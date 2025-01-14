title: Learning Spire - Vector Spaces!
date: 2013-12-07 08:00
author: Chris Stucchio
tags: scala, spire, math, vector space
category: scala




I've been working through some of [Spire](https://github.com/non/spire), which is a math library for Scala. I originally discovered Spire when I was looking for a `VectorSpace` typeclass for Scala, so it's probably worthwhile to discuss that here. We all learned abot vector spaces in Linear Algebra, and probably thought they were primarily used for studying matrices. This is not so. They are used heavily in functional analysis, which is the study of more complicated vectors than simple finite dimensional list of numbers.

I've written a few other posts on Spire, including this post on [boolean algebras in spire](/blog/2013/learning_spire_boolean_algebra.html) and this post on [Spire's cfor macro](http://www.chrisstucchio.com/blog/2014/learning_spire_cfor.html).




Another important typeclass provided by Spire is the [Vector Space](https://github.com/non/spire/blob/master/core/src/main/scala/spire/algebra/VectorSpace.scala). Most people remember vectors from Linear Algebra as simply being lists of numbers:

    [1, 5, 7]

They can be added pointwise:

    [1, 5, 3] + [2, 1, -5] == [3, 6, -2]

They can also be multiplied by scalars:

    4 * [1, 5, 3] = [4, 20, 12]

Spire provides this functionality:

    import spire.algebra.Field
    import spire.algebra.VectorSpace
    import spire.implicits._

    Vector(1,5,3) + Vector(2,1,-5)
    //Result is Vector(3, 6, -2)

    4.0 *: Vector(1.0,5.0,3.0)
    //Result is Vector(4.0, 20.0, 12.0)

Note the `*:` operator used for scalar multiplication.

To define a `VectorSpace` typeclass, you need to implement a few members:

    trait VectorSpace[V, F] {
      def scalar: Field[F]

      def zero: V
      def negate(f: V): V
      def plus(f: V, g: V)
      def timesl(r: F, f: V): V
    }

Here, `plus` is addition whereas `timesl` is multiplication by a scalar. The `scalar` method enforces the constraint that the scalars come from a [field](http://en.wikipedia.org/wiki/Field_(mathematics)), which is merely a mathematical structure along the lines of real or complex numbers. If you are unfamiliar with algebra, just assume the field is the set of `Double`s.

But it's very useful to know that there are many more vector spaces than simply `R^N`.

## Function Spaces

A very useful vector space is the space of functions `T => Double`. Functions can be added simply by adding them up pointwise - `(f + g)(x) = f(x)+g(x)` and multiplication is handled similarly. With this definition in mind, defining a function space is straightforward:

    implicit def FunctionSpace[T]  = new VectorSpace[T => Double, Double] {
      def scalar: Field[Double] = implicitly[Field[Double]]

      def zero: T => Double = (_ => 0.0)
      def negate(f: T => Double): T => Double = (x => -1*f(x))
      def plus(f: T => Double, g: T => Double): T => Double = (x => f(x)+g(x))
      def timesl(r: Double, f: T => Double): T => Double = (x => r*f(x))
    }

Once this is done, we can treat functions of type `T => Double` as vectors:

    def f(x: String) = x.size.toDouble
    def g(x: String) = x.hashCode.toDouble

    val h: String => Double = 4.0 *: (f _) + (g _)

Equivalently we could have defined `h` as:

    def h(x: String) = 4*x.size.toDouble + x.hashCode.toDouble

### Implementation Details

It would probably be more efficient to define a `FunctionSpace` in a manner that doesn't require creating a new closure whenever two functions are added and multiplied. For example, one could build a simple (private) wrapper:

    private case class FunctionWithCoeffs[T](data: Map[T => Double, Double]) extends (T => Double) {
      def apply(t: T): Double = {
        var result: Double = 0.0
        data.foreach( fv => { result += fv._2 * fv._1(t); } )
        result
      }
      def addTo(other: FunctionWithCoeffs): FunctionWithCoeffs = {
        val intersect = data.keySet.intersect(other.data.keySet)
        val nonIntersecting = (data.keySet diff other.data.keySet) | (other.data.keySet diff data.keySet)
        val intersectingKeys = intersect.map(k => (k, data(k) + other.data(k))).toMap
        val nonIntersectingKeys = (data.keySet diff other.data.keySet).map(k => (k, data(k))).toMap + (other.data.keySet diff data.keySet).map(k => (k, other.data(k))).toMap
        FunctionWithCoeffs(intersectingKeys ++ nonIntersectingKeys)
      }

      def times(x: Double) = FunctionWithCoeffs(data.mapValues(v => x*v))
    }

Then the `FunctionSpace` operations can be redefined in terms of this, e.g:

    def plus(f: T => Double, g: T => Double): T => Double = (f,g) match {
      case (fc:FunctionWithCoeffs, gc:FunctionWithCoeffs) => (fc addTo gc)
      case (fc:FunctionWithCoeffs, gc:(T=>Double)) => (fc addTo FunctionWithCoeffs(Map(gc -> 1.0)))
      case (fc:(T=>Double), gc:FunctionWithCoeffs) => (gc addTo FunctionWithCoeffs(Map(fc -> 1.0)))
      case (fc:(T=>Double), gc:(T => Double)) => FunctionWithCoeffs(Map(fc -> 1.0, gc -> 1.0))
    }

## Extensions

Now consider the space of functions of type `T => V`, where `V` is also a `VectorSpace`. This space of functions is also a vector space:

    implicit def FunctionToVectorSpaceSpace[U,V](implicit rng: VectorSpace[V,Double]) = new VectorSpace[U => V, Double] {
      type O = (U => V)

      def scalar: Field[Double] = implicitly[Field[Double]]
      def zero = _ => rng.zero
      def negate(f: O): O = x => -1.0 *: f(x)
      def plus(f: O, g: O): O = x => f(x) + g(x)
      def timesl(r: Double, f: O): O = x => r *: f(x)
    }

Then we can do silly things like this:

    def op(t: String => Double): (String => Double) = (x:String) => (2*t(x)+t(x)*t(x))
    val opx2: (String => Double) => (String => Double) = 2.0 *: (op _)
    val z = opx2( (x:String) => x.size.toDouble)

Unfortunately Scala's compiler is not smart enough for everything you might want to work:

    val z = (2.0 *: (op _))( (x:String) => x.size.toDouble)

    [info] Compiling 1 Scala source to /home/stucchio/src/spire_examples/target/scala-2.10/classes...
    [error] /home/stucchio/src/spire_examples/src/main/scala/spire_examples/VectorSpaceExamples.scala:32: type mismatch;
    [error]  found   : String => Double
    [error]  required: spire.algebra.Module[(String => Double) => (String => Double),Double]
    [error]   val z = (2.0 *: (op _))( (x:String) => x.size.toDouble)

## Sparse Vectors

Another excellent use case for a `VectorSpace` is sparse vectors. A sparse vector is a vector, most of the elements of which are zero. These can be represented in Scala via a map, and they behave like this:

    3.0 *: Map("x" -> 5.0, "y" -> 2.5) + Map("y" -> -1.0, "z" -> 3.0)

Result:

    Map(x -> 15.0, y -> 6.5, z -> 3.0)

One way to implement this is:

    implicit def SparseVectorsOver[T]  = new VectorSpace[Map[T,Double], Double] {
      def scalar: Field[Double] = implicitly[Field[Double]]

      def zero = Map()
      def negate(f: Map[T,Double]) = f.mapValues( -1 * _ )
      def plus(f: Map[T,Double], g: Map[T,Double]) = {
        val intersect = f.keySet.intersect(g.keySet)
        val intersectingKeys = intersect.map(k => (k, f(k) + g(k))).toMap
        val nonIntersectingKeys = (f.keySet diff g.keySet).map(k => (k, f(k))).toMap ++ (g.keySet diff f.keySet).map(k => (k, g(k))).toMap
        intersectingKeys ++ nonIntersectingKeys
      }
      def timesl(r: Double, f: Map[T,Double]) = f.mapValues( r * _)
    }

You don't actually want to put this into your code, since Spire already provides this, and your implicit will conflict with theirs.
