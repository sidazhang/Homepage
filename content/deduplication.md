title: Caching the Identity for Fun and Profit
date: 2013-06-01 10:00
author: Chris Stucchio
tags: algorithms, hadoop





One of the wonderful features of Scala and other high level languages is that they are very expressive. Very often, one can represent business objects as a simple map, e.g.:

    val headers = Map("User-Agent" -> "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.63 Safari/537.31",
                      "Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                      "Accept-encoding" -> "gzip,deflate,sdch"
                      )

Very often one might need to process a large number of such objects. An actual page of heap used by our program might look something like this (the `-` character represents binary data we don't care about for this discussion):

    User-Agent----Accept----gzip,deflate,sdch---Accept-----User-Agent-----gzip,deflate,sdch---
    -----Accept-encoding-----User-Agent-------gzip,deflate,sdch---Mozilla/5.0 (X11; Linux x86_
    -------User-Agent-------gzip,deflate,sdch---Internet Explorer-----------------------------

Fugly. We are storing the same common strings many times.



There is a solution to this problem. Consider the function `identity: String => String`, with the property that `identity(x) == x` for every `x`. Define a new function:

    def identity(m: Map[String,String]): Map[String,String] = {
        m.toSeq( x => (identity(x), identity(x)) ).toMap
      }

What this function does is it takes a map and turns it into a sequence of key/value pairs. It then takes elements from each pair and applies the identity to it. Finally, it turns the resulting sequence back into a map.

In short, `identity: Map[String,String] => Map[String,String]` satisfies the property `identity(x) = x` for every `x: Map[String,String]`.

Applying the identity function to our business objects as we create them can drastically reduce our heap usage. Here is the implementation of `identity: String => String`:

    object Identity {
      import com.google.common.cache.CacheBuilder

      private val cache = CacheBuilder.newBuilder()
         .maximumSize(1024*16)
         .expireAfterWrite(1, TimeUnit.MINUTES)
         .build[String,String](
             new CacheLoader[String, String]() {
               def load(s: String): String = s
             });

      def identity(s): cache.get(s)
    }

The key idea here is that this function deduplicates it's input. Calling `identity(s)` on a string `s="foo"` at address `A` will return the string `"foo"` at address `A`. Calling it a second time on the string `s="foo"` at address `B` will return the previous string `"foo"` at address `A`. The copied string at address `B` will (assuming it is not leaked) be immediately garbage collected - on the JVM it will be part of the youngest generation and will be GCed immediately.

The specific cache I'm using comes from [Google Guava](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/CacheBuilder.html).

I fall victim to the high level fallacy a lot. I usually high level programming languages, abstract away basic details, and focus almost exclusively on business objects and statistics. Hadoop provides me nearly unlimited processing power and storage, so my primary concerns are experiment design and statistical significance. Once in a while a `java.lang.OutOfMemory` error is thrown and I'm immediately reminded that Hadoop is still made of servers running JVMs with 4GB heap space.

Computing has come a long way, but you still can't escape the hardware. But if you are very lucky, the fix might be something as simple as injecting a carefully implemented identity function into the call chain.
