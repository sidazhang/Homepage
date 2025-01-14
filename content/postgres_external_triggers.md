title: Postgres NOTIFY for cache busting and more
date: 2013-11-07 08:00
author: Chris Stucchio
tags: postgres, caching
mathjax: true





> "There are only two hard things in Computer Science: cache invalidation and naming things."
>
> Phil Karlton

For those of using [Postgres](http://www.postgresql.org/) as a data store, cache invalidation has become significantly easier. Postgres has introduced the command [NOTIFY](http://www.postgresql.org/docs/9.3/static/sql-notify.html) which can be used to inform the cache of necessary invalidation.




## The old way

Before we discuss Postgres `NOTIFY`, lets think back to the old methods of invalidation. There are two general strategies.

**Time To Live**. Common queries are cached on read in redis or memcached with a time to live parameter. This is a fairly foolproof method, but it has the problem that read queries may be up to 5 minutes out of date. Whether or not this delay is acceptable depends strongly on the application. For the purposes of the discussion here, we will assume that it is not acceptable.

**Post-save signals**. Whenever an object is modified by the application, a signal is sent to some global application bus. A listener somewhere on the bus then takes action - invalidating and possibly pre-warming the cache.

There are several complications with post-save signals which the developer needs to worry about when combining them with database transactions. The first is race conditions. Consider the following:

    BEGIN TRANSACTION
    UPDATE objects SET foo=bar WHERE id=12345;

    UPDATE other_objects SET buz=baz WHERE id=67890;

    ...inside the application...
    application_bus.notify(ObjectAltered(12345))

    ...on the other side of the event bus...
    warm_cache(Object(12345))
    ...the old version of the object is cached...

    ...back in SQL...
    COMMIT;

What happens in this case is that *the cache is not invalidated*. Because the transaction had not yet committed, the old version of object 12345 was loaded. The cache will now remain out of date until the TTL (if any) has passed.

If transactions are frequently rolled back another possible concern arises - the cache can be invalidated unnecessarily.

Caching is not the only place where this problem arises. There are many situations where some action must be taken in response to object modification or creation - examples include data validation (e.g., a spam check on user generated content) and updates for online learning systems. Depending on how the spam checking system is created, either valid content will not receive a "not spam" flag, or invalid content will fail to receive an "is spam" flag.

One solution to this is to tie the notification system to the database connection:

    class NotifyingDatabaseConnection(object):
        def notify(self, message):
            self.__messages__.append(message)

        def commit(self):
            self.__connection__.commit()
            self.__event_bus__.send_notifications(self.__messages__)
            self.__messages__ = []

The Haskell style approach would be to define your SQL monad as `WriterT [Notification] YourTransactionMonadIO`, and similarly send off the notifications only after the transaction has committed. As far as I'm aware, neither Django nor Rails implement any functionality of this nature. At the time I wrote this post, the only implementation I was aware of is a half-assed prototype of the monadic approach which I built at AOL/Patch on a suggestion from [Jim Powers](https://twitter.com/corruptmemory). However, Ben Bangert (in a comment on this post) pointed out to me that the [Pyramid](http://docs.pylonsproject.org/projects/pyramid_tm/en/latest/#transaction-usage) framework also handles this.

Another situation where things become problematic is when multiple rows are updated in the database but the application does not know which ones:

    BEGIN TRANSACTION
    UPDATE users SET status='spammer' WHERE id=12345;
    UPDATE comments SET status='dead' WHERE author_id=12345;

    ...the application does not have a list of every post created by user 12345...
    COMMIT;

The last case where this can become problematic is when a developers forgets to call `application_bus.notify(...)`.

The solution to all these problems is to let Postgres do the work for you.

## Postgres NOTIFY

Postgres comes with a built in event bus based on the [`NOTIFY`](http://www.postgresql.org/docs/9.3/static/sql-notify.html) command. `NOTIFY` works as follows. First, a daemon process opens a database connection and runs:

    LISTEN 'object_insert';

In Python this is done as follows (see [here](http://initd.org/psycopg/docs/advanced.html)):

    conn = psycopg2.connect(DSN)
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)

    curs = conn.cursor()
    curs.execute("LISTEN test;")

    while True:
        if select.select([conn],[],[],5) == ([],[],[]):
            pass
        else:
            conn.poll()
            while conn.notifies:
                notify = conn.notifies.pop()
                handle_notification(notify)

Similarly using [JDBC on the JVM](http://jdbc.postgresql.org/documentation/91/listennotify.html):

    org.postgresql.PGConnection conn = (org.postgresql.PGConnection)DriverManager.getConnection(...);
    Statement stmt = conn.createStatement();
    stmt.execute("LISTEN object_insert");
    stmt.close();
    while (true) {
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT 1");
        rs.close();
        stmt.close();
        org.postgresql.PGNotification notifications[] = pgconn.getNotifications();
        handleNotifications(notifications);
        Thread.sleep(100);
    }

Elsewhere, when an object is updated, the `NOTIFY` command is used:

    NOTIFY object_insert, '12345'

The listening daemon will then receive the message `('object_insert', '12345')`.

An important property of `NOTIFY` is that it is transactional. A notify is only sent upon commit:

    BEGIN TRANSACTION;
    UPDATE ...;
    NOTIFY object_updated, '12345';
    ....
    COMMIT;

    ...Notification is sent now...

Similarly:

    BEGIN TRANSACTION;
    UPDATE ...;
    NOTIFY object_updated, '12345';
    ....
    ROLLBACK;

    ...No notification is sent...

## Never forget - use a trigger

Using `NOTIFY` as described above still runs into the issue that developers might forget to call it. This is an excellent use for database triggers:

    CREATE OR REPLACE FUNCTION object_notify() RETURNS trigger AS $$
    DECLARE
    BEGIN
      PERFORM pg_notify('object_updated,CAST(NEW.id AS text));
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER object_post_insert_notify AFTER UPDATE ON objects FOR EACH ROW EXECUTE PROCEDURE object_notify();

Using the database trigger solves many problems. Developers no longer need to remember to call `NOTIFY` whenever they alter a row. Further, the problem of multi-row updates is handled:

    UPDATE comments SET status='dead' WHERE author_id=12345;

This will cause a notification to be sent for every comment created by the author with no additional effort on the part of the developer.

## Don't overload your master database

One important caveat to this approach is that *you need a real event bus* - I recommend [RabbitMQ](http://www.rabbitmq.com/). Postgres uses master/slave replication, and you do not want to overload your master. You should set up a single process to listen for notifications and then publish these notifications to the real event bus, which can then PubSub them as needed. If you have a large number of listeners, you do not want to waste postgres master connections on them.
