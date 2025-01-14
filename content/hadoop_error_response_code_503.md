title: Hadoop error - HTTP Response Code 503
date: 2011-02-20 00:00
author: Chris Stucchio
tags: hadoop




I recently had a power failure, which resulting in my hadoop cluster shutting down. No matter, hadoop came back after a little while.

However, I ran into problems immediately after restarting it:

    #!bash
    $ hadoop fsck /
    Exception in thread "main" java.io.IOException: \
                        Server returned HTTP response code: 503 for URL: http://0.0.0.0:50070/fsck?path=%2F
       at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1441)
       at org.apache.hadoop.hdfs.tools.DFSck.run(DFSck.java:123)
       at org.apache.hadoop.util.ToolRunner.run(ToolRunner.java:65)
       at org.apache.hadoop.util.ToolRunner.run(ToolRunner.java:79)
       at org.apache.hadoop.hdfs.tools.DFSck.main(DFSck.java:159)



Apart from this, my data seemed to be in good shape. However, the task tracker also had some problems as well - it was difficult to make a process finish:

    ...
    11/02/20 21:59:08 INFO mapred.JobClient:  map 93% reduce 0%
    11/02/20 22:00:05 INFO mapred.JobClient:  map 100% reduce 0%
    11/02/20 22:03:59 INFO mapred.JobClient: Task Id : attempt_201102202150_0001_m_000001_0, Status : FAILED
    Too many fetch-failures
    11/02/20 22:03:59 WARN mapred.JobClient: Error reading task outputServer returned\
        HTTP response code: 503 for URL:
        http://stylewok-hadoop:50060/tasklog?plaintext=true&amp;taskid=attempt_201102202150_0001_m_000001_0&amp;filter=stdout
    11/02/20 22:03:59 WARN mapred.JobClient: Error reading task outputServer returned HTTP response code: 503 for URL:
        http://stylewok-hadoop:50060/tasklog?plaintext=true&amp;taskid=attempt_201102202150_0001_m_000001_0&amp;filter=stderr
    11/02/20 22:04:06 INFO mapred.JobClient:  map 93% reduce 0%

A quick google search turned up only another person who ran into this problem, but no solution. So I'm posting here, in the hope that this post is helpful to other people who run into this issue.

I asked on the Hadoop mailing list, and Harsh J pointed me in the direction of Hadoop's embedded Jetty server. On his suggestion, I checked the logs, and sure enough, Jetty wasn't running:

It's definitely uninitialized. From the namenode log:

    #!bash
    $ less /var/log/hadoop/hadoop-namenode-HOSTNAME-hadoop.log
    ...
    2011-02-20 22:38:31,789 INFO org.mortbay.log: Logging to org.slf4j.impl.Log4jLoggerAdapter(org.mortbay.log) via org.mortbay.log.Slf4jLog
    2011-02-20 22:38:31,835 INFO org.apache.hadoop.http.HttpServer: Port returned by webServer.getConnectors()[0].getLocalPort()
        before open() is -1. Opening the listener on 50070
    2011-02-20 22:38:31,836 INFO org.apache.hadoop.http.HttpServer: listener.getLocalPort() returned 50070
    webServer.getConnectors()[0].getLocalPort() returned 50070
    2011-02-20 22:38:31,836 INFO org.apache.hadoop.http.HttpServer: Jetty bound to port 50070
    2011-02-20 22:38:31,836 INFO org.mortbay.log: jetty-6.1.14
    2011-02-20 22:38:31,932 WARN org.mortbay.log: Failed startup of context\
         org.mortbay.jetty.webapp.WebAppContext@7c19f9d2/,file:/usr/local/hadoop/webapps/hdfs\
         java.util.zip.ZipException: error in opening zip file
       at java.util.zip.ZipFile.open(Native Method)
       at java.util.zip.ZipFile.(ZipFile.java:114)
       at java.util.jar.JarFile.(JarFile.java:135)
       at java.util.jar.JarFile.(JarFile.java:99)
       at org.mortbay.jetty.webapp.TagLibConfiguration.configureWebApp(TagLibConfiguration.java:168)
       at org.mortbay.jetty.webapp.WebAppContext.startContext(WebAppContext.java:1231)
       at org.mortbay.jetty.handler.ContextHandler.doStart(ContextHandler.java:517)
       at org.mortbay.jetty.webapp.WebAppContext.doStart(WebAppContext.java:460)
       at org.mortbay.component.AbstractLifeCycle.start(AbstractLifeCycle.java:50)
       at org.mortbay.jetty.handler.HandlerCollection.doStart(HandlerCollection.java:152)
       at org.mortbay.jetty.handler.ContextHandlerCollection.doStart(ContextHandlerCollection.java:156)
       at org.mortbay.component.AbstractLifeCycle.start(AbstractLifeCycle.java:50)
       at org.mortbay.jetty.handler.HandlerWrapper.doStart(HandlerWrapper.java:130)
       at org.mortbay.jetty.Server.doStart(Server.java:222)
       at org.mortbay.component.AbstractLifeCycle.start(AbstractLifeCycle.java:50)
       at org.apache.hadoop.http.HttpServer.start(HttpServer.java:461)
       at org.apache.hadoop.hdfs.server.namenode.NameNode.startHttpServer(NameNode.java:246)
       at org.apache.hadoop.hdfs.server.namenode.NameNode.initialize(NameNode.java:202)
       at org.apache.hadoop.hdfs.server.namenode.NameNode.(NameNode.java:279)
       at org.apache.hadoop.hdfs.server.namenode.NameNode.createNameNode(NameNode.java:956)
       at org.apache.hadoop.hdfs.server.namenode.NameNode.main(NameNode.java:965)
       2011-02-20 22:38:31,939 INFO org.mortbay.log: Started SelectChannelConnector@0.0.0.0:50070

Googling for this problem suggested that Jetty sometimes behaves oddly if it's underlying jar files are altered.

Solution: I reinstalled hadoop. Everything is back to normal.

