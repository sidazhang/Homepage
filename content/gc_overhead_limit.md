title: java.lang.OutOfMemoryError, GC overhead limit exceeded
date: 2013-09-13 10:00
author: Chris Stucchio
tags: algorithms, hadoop





One annoying error which I often see when running Hadoop jobs is this:

    java.lang.OutOfMemoryError: GC overhead limit exceeded

The cause of this error is that Java is spending a lot of time inside the garbage collector, and is not freeing up large chunks of memory. When this error occurs, it is a sign that your performance is being harmed due to object creation, and that you can mitigate it by reducing the number of objects.



One mitigation strategy I've used is [deduplication](/blog/2013/deduplication.html). Another I've used is mutability. Rather than doing this:

    case class Foo(var x: Int, var y: Boolean) extends Writable {
      def +(other: Foo): Foo = Foo(x+other.x, y && other.y)
      ...
    }

you can reduce object creation by doing this:

    case class Foo(var x: Int, var y: Boolean) extends Writable {
      def ++(other: Foo): Foo = {
          x += other.x
	  y = y && other.y
        }
      ...
    }

Ultimately the solution to this problem is to tell the child Java process to ignore the fact that it is spending a lot of time inside GC. Then you might still waste a lot of time waiting for GC, but it won't crash your job. For the sake of efficiency I still recommend trying to reduce object creation, but at the end of the day you can still do this (example is [scalding](https://github.com/twitter/scalding) code):


    class MyJob(args: Args) extends Job(args) {
      override def config(implicit mode: com.twitter.scalding.Mode) = super.config ++ Map("mapred.child.java.opts" -> "-XX:-UseGCOverheadLimit")

      ...your job goes here...
    }

(I don't know how to pass jvm options to the child jvm in raw hadoop, but the one to pass in is "-XX:-UseGCOverheadLimit".)
