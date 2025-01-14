title: Agents - a purely functional alternative to Actors
date: 2014-02-25 09:00
author: Chris Stucchio
tags: scala, type systems, scalaz, scalaz-streaming, agents, concurrency
nolinkback: true





I was recently introduced to the [scalaz-stream](https://github.com/scalaz/scalaz-stream) library by the excellent blog post [Actors are Overly Nondeterministic](http://pchiusano.blogspot.in/2013/09/actors-are-overly-nondeterminstic.html). I decided to take a look at them, and I realize they have a lot to offer.

One of the cools things I noticed could be built with them is Clojure-style Agents. But Agents implemented using scalaz-stream are actually more general than clojure agents - asynchronous multithreaded processing is not required. If you want to run agents in a separate thread using a message queue for communication, you can. But you can also run them in a single thread if that's more efficient. Using scalaz-stream, we can actually generalize over the specific dispatch method.

In this post I'll both explain a little bit about [scalaz-stream](https://github.com/scalaz/scalaz-stream) and also describe the [scalaz agent](https://github.com/stucchio/scalaz_agent) library I built on top of it.




Please note that the agent library is in the very preliminary stages and is probably under 100 lines of code. You can't do a lot with it yet.

# scalaz.concurrent.Process

A `Process[F[_], T]` is a stream of values of type `T`, but which has the ability to make external requests of type `F[_]`. So for example, a `Process` might be a stream of `Int` objects, but while processing the `Int` objects it could also make requests return an `Option[X]` to assist in the computation.

I'm going to avoid more abstract nonsense and give an example. My working example will be building a conversion rate tracker, so I'll define the basic relevant data types:

    sealed trait Event
    case object Display extends Event
    case object Conversion extends Event

The `Display` object represents the display of an ad to a user, while `Conversion` represents the user clicking on the ad.

An event stream will be an object of type `Process[F[_], Event]`. The simplest way to build one is as follows:

    val testSeq: Process[Nothing,Event] = Process.emitSeq(Seq[Event](Display,Conversion,Display,Display))

This is little more than a wrapper around an underlying `Seq`. In fact, it literally evaluates to exactly that:

    scala> testSeq
    res2: scalaz.stream.Process[Nothing,ScalazStreaming.Event] =
        Emit(List(Display, Conversion, Display, Display),Halt(scalaz.stream.Process$End$))

The underlying monad here is `Nothing` - i.e., there is no monadic effect in play here.

## An infinite stream

We might also want to play with an infinite stream. Defining this takes a bit more work:

    import scalaz.stream._
    import scalaz.stream.io._
    import scalaz.concurrent.Task

    val rnd = new Random
    val conversionRate = 0.10

    def simulatedEvent: Process[Task,Event] = Process.await(Task.delay({ () }))(recv = _ => {
      if (rnd.nextDouble < conversionRate) {
        Process.emitSeq( Seq(Display,Conversion) )
      } else {
        Process.emit(Display)
      }
    })

The `simulatedEvent` function represents a single lazily-evaluated event where we displayed an ad to a user, following which the user may or may not have converted. 90% of the time, we will see the following:

    scala> simulatedEvent.toSeq
    Seq(Display)

10% of the time we get the following:

    scala> simulatedEvent.toSeq
    Seq(Display, Conversion)

Now to create an infinite *stream* of events, we simply use the `repeat` method:

    def eventStream = simulatedEvent.repeat

# Agents

An agent is merely a piece of data (the state) together with a function that takes a message and returns a new agent with altered state.

    trait Agent[T, A <: Agent[T,A]] {
      def receive(d: T): A
    }

The type signature is fairly complicated, but an example will clear things up. We'll build a `StatisticsCalculator`, which is a class that receives an event (either a `Display` or a `Conversion`) and updates it's statistics:

    case class StatisticsCalculator(displays: Long, conversions: Long) extends Agent[Event, StatisticsCalculator] {
      def receive(e: Event): StatisticsCalculator = e match {
        case Display => this.copy(displays=displays+1)
        case Conversion => this.copy(conversions=conversions+1)
      }
    }

This is more or less how we would build a mutable statistics counter - the only difference is that this version is purely functional. The complicated type signature is necessary to ensure that `send` returns a `StatisticsCalculator` rather than an `Agent[Event,StatisticsCalculator]`.

For those familiar with akka actors, the `receive` method should be considered as an immutable version of Akka's `receive`.

## scan - a streaming version of cumulative sum

The `Process` type provides a method called `scan`:

    def scan[B](b: B)(f: (B,O) => B): Process[F,B]

The `scan` method is sort of a cumulative fold. Rather than simply providing the result of folding the entire stream, it provides the intermediate results along the way as well. I.e., suppose `ones` were a stream repeating an infinite sequence of `1`. Then:

    ones.scan(0)( (x, y) => x+y )

would return the stream `0,1,2,3,...`.

Using `scan`, we can define a `runAgent` function:

    def runAgent[F[_], T, A <: Agent[T,A]](process: Process[F,T], initialState: =>A): Process[F,A]
        = process.scan(initialState)( (a, t) => a.receive(t) )

That's a complicated type signature, but only due to the signature of the `Agent`.

## Computing the history of the agent

If we now apply the `runAgent` function, we get a stream of agent values:

    scala> val testSeq: Process[Nothing,Event] = Process.emitSeq(Seq[Event](Display,Conversion,Display,Display))

    scala> runAgent(testSeq, StatisticsCalculator(0,0)).toSeq
    Seq[com.chrisstucchio.spire_examples.ScalazStreaming.StatisticsCalculator] =
        Vector(StatisticsCalculator(0,0), StatisticsCalculator(1,0), StatisticsCalculator(1,1),
               StatisticsCalculator(2,1), StatisticsCalculator(3,1))

So using the `Agent`, we've synchronously run a calculation on a sequence of events. At the start, the `Agent` has the state `StatisticsCalculator(0,0)`. After seeing the first event (a `Display`), it's state is `StatisticsCalculator(1,0)` representing that it saw a single `Display` and 0 `Conversions`. Schematically, we've done the following:

    Input data: ()   , Display, Conversion, Display, Display
    State:      (0,0), (1,0),   (1,1),      (2,1),   (3,1)

So far this is nothing special - it's just a fancy way of simulating stateful code in a purely functional system.

# Changing the execution model

In the previous section, we merely used agents to run a *purely functional* computation. The function `Process.emitSeq` did little more than put a wrapper around a standard scala `Seq`. The `runAgent` function merely ran a `fold`-like operation on the immutable `StatisticsCalculator` objects.

However, we can also run an infinite calculation using the *exact same code*. Recall the `eventStream`:

    def eventStream: Process[Task,Event] = simulatedEvent.repeat

Note that the type of this is now `Process[Task,Event]` instead of `Process[Nothing,Event]`. I.e., there is an effectful monad underlying this stream.

    scala> runAgent(eventStream, StatisticsCalculator(0,0))
    res3: scalaz.stream.Process[scalaz.concurrent.Task,ScalazStreaming.StatisticsCalculator] =
        Emit(List(StatisticsCalculator(0,0)),Await(scalaz.concurrent.Task@5fd243ea,<function1>,Halt(scalaz.stream.Process$End$),Halt(scalaz.stream.Process$End$)))

This looks like a little bit more than a wrapper around a `Seq`. The result of `runAgent` on the `eventStream` is now the first object, together with a closure representing how to continue the computation. If we want to actually run the computation, we need to call the `.run` method. But that will be an infinite computation with no side effects, so lets do something more interesting. Lets produce some side effects:

    scala> val s = runAgent(eventStream, StatisticsCalculator(0,0)).map(x => println(x))
    s: scalaz.stream.Process[scalaz.concurrent.Task,Unit] =
          Emit(List(()),Await(scalaz.concurrent.Task@7150c54a,<function1>,Halt(scalaz.stream.Process$End$),Halt(scalaz.stream.Process$End$)))

We've produced a value of type `Process[Task,Unit]` as expected, but we've also generated a side effect. The following was printed to stdout:

    StatisticsCalculator(0,0)

To run the stream, we use the `.run` method, which returns a `Task[Unit]`. For those unfamiliar with `scalaz.concurrent.Task`, it's the scalaz alternative to `scala.concurrent.Future`. So running the `Process[Task,Unit]` is basically a way of sequencing a bunch of `Future`-like objects together.

The `Future` (oops `Task`) can then be run with it's own `.run` method (equivalent to `Await.ready(future, duration)` from Akka):

    scala> s.run.run
    StatisticsCalculator(0,0)
    StatisticsCalculator(1,0)
    StatisticsCalculator(2,0)
    StatisticsCalculator(2,1)
    StatisticsCalculator(3,1)
    ...etc...

(There are some interesting differences between `Future` and `Task`. I'll discuss them in another post.)

# Effectful Agents

One common use of Actors is to sequence work to be performed. We can use Agents for a similar purpose. For this we need to introduce the `EffectfulAgent`:

    trait EffectfulAgent[T, A <: Agent[T,A], F[_]] extends Agent[T,A] {
      def discard: A
      def effect: F[A]
    }

Here the `effect` method actually does work. It returns an agent wrapped inside a functor `F[_]` - this is interpreted as meaning the `effect` method does the actual work. Splitting the `receive` and `effect` methods of an agent allows us to run an agent and simulate it's state without actually running the side effects.

An `EffectfulAgent` should satisfy the laws:

    a.discard.effect == mzero
    a.discard.discard == a.discard

(The first law assumes of course that `F[_]` is a `Monad` with `Zero`.) This means that an agent who's effect has been discarded has no effect.

We also require that if we ignore effects:

    a.effect == a.discard.point[F]

This means that calling the `discard` method on an `EffectfulAgent` changes the state of the agent in the same way as actually running it's `effect`.

## Example - a printing statistics calculator

To provide an example of an `EffectfulAgent`, I'll demonstrate a `StatisticsCalculator` which prints it's data to stdout every 10 displays.

    case class PrintingStatisticsCalculator(displays: Long, conversions: Long, toPrint: Option[String]) extends EffectfulAgent[Event,PrintingStatisticsCalculator,IO] {
      def receive(e: Event): PrintingStatisticsCalculator = e match {
        case Display => if (displays + 1 % 10 == 0) {
            this.copy(displays = displays + 1, toPrint = Some("Current state: " + this))
          } else {
            this.copy(displays=displays+1)
          }
        case Conversion => this.copy(conversions=conversions+1)
      }

      def discard: PrintingStatisticsCalculator = this.copy(toPrint = None)
      def effect: IO[PrintingStatisticsCalculator] = toPrint.map( putStrLn ).getOrElse(ioUnit).map( _ => discard)
    }

The `toPrint` element represents the data to be printed (if any). It's pretty clear from the definition above that the laws are satisfied.

Running an effectful agent is done via the `agentEffect` method:

    def runAgentForEffect[F[_],F2[x] >: F[x], T, A <: EffectfulAgent[T,A,F2]](process: Process[F,T], initialState: A): Process[F2,A] =
        process.scan(initialState)( (a, t) => a.discard.receive(t) )
          .evalMap(_.effect)

A complicated type signature, but the idea is simple. First we run the agent, in order to generate a `Process` in which the state changes. Then for each state, we run it for it's effect. Then we `discard` the effect and continue.

# Separating state from effect

By splitting state from effect, we create the ability to reuse code by swapping out different effects. The business logic of the `PrintingStatisticsCalculator` does not change just because we want different effects. So if we needed multiple effect implementations, we could easily mix in different `effect` implementations with traits or other methods.

## Testing the agent

By splitting state away from effects, testing becomes much easier. If I want to test an `Agent`, I simply generate input as a `Seq`:

    Process.emitSeq(Seq[Event](Display,Conversion,Display,Display))

and then check whether the output matches the desired sequence:

    assert(runAgent(testSeq, StatisticsCalculator(0,0)).toSeq === Seq(StatisticsCalculator(0,0), StatisticsCalculator(1,0), StatisticsCalculator(1,1) ... etc

This separates business logic from implementation details. This is a lot easier and faster than testing Akka code. Testing Akka actors typically involves spinning up actor systems, and code is littered with `expectMsgPf(250 milliseconds)` and similar things.

Note that we do not need to spin up an `ActorSystem` as part of the test.

## Testing side effects

We can also test the *business logic* of `EffectfulAgent` objects *without running their effects*:

    assert(runAgent(testSeq, PrintingStatisticsCalculator(0,0)).toSeq === Seq(PrintingStatisticsCalculator(0,0,None), ... etc)

I.e., we can check that at certain stages of the computation, `printingStatisticsCalculator.toPrint == Some(...)`, but we do not need to actually run the effect as part of the test.

This is very handy in making test suites run more quickly - we can write a small number of tests which check that effects are properly performed, and write a much larger number of tests which verify the business logic of an `EffectfulAgent`. The tests of business logic never need to actually produce a side effect. I.e., I'll write many tests ensuring that:

    streamEndState === PrintingStatisticsCalculator(20,6,Some("data to print"))

but a much smaller number of tests to determine that `PrintingStatisticsCalculator(_,_,Some("data to print")).effect` actually prints `"data to print"`.

# Conclusion

Akka's actors are a great system, one which I use every day. As a tool for distributed computing they are extremely helpful.

But as far as type safety, they leave a lot to be desired - a standard untyped actor is built on the type signature `Any => Unit` with side effects. It's my belief that we can do better for non-distributed systems, both in terms of orthogonality and type safety. After playing with [scalaz-stream](https://github.com/scalaz/scalaz-stream), I'm beginning to think that we might have other useful abstractions around which we can build systems.

Source code for the agent library is [available on github](https://github.com/stucchio/scalaz_agent).
