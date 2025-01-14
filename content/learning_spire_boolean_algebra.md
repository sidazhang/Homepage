title: Learning Spire - Boolean Algebras are pretty cool
date: 2013-12-05 08:00
author: Chris Stucchio
tags: scala, spire, math, boolean algebra
category: scala




For a long time I've been a fan of the [Scalaz](https://github.com/scalaz/scalaz) library for Scala. Scalaz puts a Haskell into your Scala so you can Haskell while you Scala. More precisely, it provides a lot of useful features for expressing pure computations such as `Applicative` functors, `Monads`, `Monoids`, `NonEmptyLists` and the like. But for the most part, Scalaz stops at the edge of theoretical computer science and category theory.

Enter [Spire](https://github.com/non/spire). Spire is a similar library which picks up where Scalaz leaves off. Spire provides a collection of type classes that represent concepts familiar to a math major, rather than a computer science major. One of the simpler such type classes is the `BooleanAlgebra`, which I'll discuss here.



Spire offers the fundamental class `BooleanAlgebra`. It has the following members which must be implemented:

    trait BooleanAlgebra[A] {
      def one: A
      def zero: A
      def complement(a: A): A
      def and(a: A, b: A): A
      def or(a: A, b: A): A
    }

together with a set of others that are defined in terms of these (for example, logical implication `def imp(a: A, b: A): A = or(complement(a), b)`). Among other things these give uniform syntactic additions for handling `BooleanAlgebra`s:

    import spire.algebra._
    import spire.syntax.booleanAlgebra._

With these imports you can do `x & y`, `x | y`, etc.

The most common `BooleanAlgebra` is simply the Scala `Boolean` type. An implementation of a `BooleanAlgebra` for `Boolean` would be:

    import spire.algebra._
    import spire.syntax.booleanAlgebra._

    object BooleanBooleanAlgebra[Boolean] {
      def one: true
      def zero: false
      def complement(a: Boolean) = !a
      def and(a: Boolean, b: Boolean) = a && b
      def or(a: Boolean, b: Boolean) = a || b
    }

This of course does exactly what we expect:

    true & false === false
    true | false === true

The `spire.syntax.booleanAlgebra._` import provides the `&`, `|`, etc operators.

 Spire actually provides a specialized `BooleanAlgebra[Boolean]` object, as well as similar objects for `Byte`, `Short`, `Int` and `Long`. The specialized versions of these objects implement bitwise Boolean algebra on the underlying primitive types.

Those of us who remember our introductory math classes might remember that bitwise operations on computing primitives are not the only examples of a [Boolean Algebra](http://en.wikipedia.org/wiki/Boolean_algebra_(structure)). For example, the set of predicates on a type forms a very useful `BooleanAlgebra`:

    implicit def PredicateBooleanAlgebra[T] = new BooleanAlgebra[T => Boolean] {
      def one: T => Boolean = _ => true
      def zero: T => Boolean = _ => false
      def and(a: T=>Boolean, b: T=>Boolean): T=>Boolean = x => a(x) && b(x)
      def or(a: T=>Boolean, b: T=>Boolean): T=>Boolean = x => a(x) || b(x)
      def complement(a: T=>Boolean) = x => !a(x)
    }

This is a very helpful typeclass:

    def hasCookie(req: HttpRequest): Boolean = req.headers.find( ...)
    def isInternetExplorer(req: HttpRequest): Boolean = req.headers['Content-Type'] == "Internet Explorer"

    //equivalent to hasCookie(req) && isInternetExplorer(req)
    val hasCookieAndIsInternetExplorer = (hasCookie _) & (isInternetExplorer _)

    val requestsWithCookieAndInternetExporer = requests.filter( (hasCookie _) & (isInternetExplorer _) )

Another common boolean algebra is the powerset of a finite set. To define this in Scala we need to first define a `FiniteSet` typeclass:

    trait BadFiniteSet[F] extends Enum[F] {
      val realMin: F
      override def min = Some(realMin)
      val realMax: F
      override def max = Some(realMax)
      def all: Set[F] = fromToL(realMin, realMax).toSet
    }

The normal `Enum[F]` trait does not require that a min or max exists, so we need to force their existence with a stable member. An example of a concrete `FiniteSet`:

    implicit object FiveEnum extends BadFiniteSet[Int] {
      val realMin: Int = 1
      val realMax: Int = 5
      def succ(x: Int) = if (x < 5) { x + 1 } else { 5 }
      def pred(x: Int) = if (x > 1) { x - 1 } else { 1 }
      def order(x: Int, y: Int) = ???
    }

(Unfortunately this is a bit of an unsatisfactory `FiniteSet` implementation, since Scala will use this for any `Set[Int]`. But it works perfectly fine for a set of `case object`s.)

Then you can use sets the same way:

    val r = Set(1,3,4) & Set(1,2,3)

In Scala it is not possible to create a `BooleanAlgebra[Set[T]]` for a set `T` which is infinite, since you will not be able to implement the `one` member.

However, you *can* implement a `BooleanAlgebra` for the set of sets which are either finite or cofinite. (CoFinite means a set who's complement is finite.)

    sealed trait FiniteOrCofinite[T]
    case class FiniteSet[T](x: Set[T]) extends FiniteOrCofinite[T]
    case class CoFiniteSet[T](x: Set[T]) extends FiniteOrCofinite[T]

Note that `CoFiniteSet(Set(1,2,3))` represents the set of integers `(..., -2, -1, 0, 4,5,6,...)`, i.e. everything but `1,2,3`.

    implicit def FiniteCoFiniteSetBooleanAlgebra[T] = new BooleanAlgebra[FiniteOrCofinite[T]] {
      def one = CoFiniteSet[T](Set[T]())
      def zero = FiniteSet(Set[T]())
      def and(a: FiniteOrCofinite[T], b: FiniteOrCofinite[T]) = (a,b) match {
        case (FiniteSet(x), FiniteSet(y)) => FiniteSet(x intersect y)
        case (CoFiniteSet(x), CoFiniteSet(y)) => CoFiniteSet(x union y)
        case (FiniteSet(x), CoFiniteSet(y)) => FiniteSet(x -- y)
        case (CoFiniteSet(x), FiniteSet(y)) => FiniteSet(y -- x)
      }
      def or(a: Set[T], b: Set[T]) = (a,b) match {
        case (FiniteSet(x), FiniteSet(y)) => FiniteSet(x union y)
        case (CoFiniteSet(x), CoFiniteSet(y)) => CoFiniteSet(x intersect y)
        case (FiniteSet(x), CoFiniteSet(y)) => CoFiniteSet(y -- x)
        case (CoFiniteSet(x), FiniteSet(y)) => CoFiniteSet(x -- y)
      }
      def complement(a: FiniteOrCofinite[T]) = a match {
        case FiniteSet(x) => CoFiniteSet(x)
        case CoFiniteSet(x) => FiniteSet(x)
      }
    }

As an example of a set which can't be represented this way, consider the set `(0,2,4,6,...)`. It's complement (in the positive integers) is `(1,3,5,7,...)`, which is also infinte.

Other examples of `BooleanAlgebra` include [semiconductor gates](http://www.allaboutcircuits.com/vol_4/chpt_7/6.html) and streaming data filters.

I've written a few other posts on Spire, including this post on [vector spaces in spire](http://www.chrisstucchio.com/blog/2013/learning_spire_vector_space.html) and this post on [Spire's cfor macro](http://www.chrisstucchio.com/blog/2014/learning_spire_cfor.html).
