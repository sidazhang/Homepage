title: Concurrent bloom filters
date: 2016-05-30 10:00
author: Chris Stucchio
tags: scala, java, bloom filters, probabilistic algorithms
category: algorithms
nolinkback: true

Bloom filters are probabilistic data structure for determining whether an element is in a set. Such a data structure offers only two methods - `add` and `mightContain`. Google's [guava library offers a nice implementation](https://google.github.io/guava/releases/snapshot/api/docs/com/google/common/hash/BloomFilter.html), but unfortunately this implementation (like every implementation I've found) is not concurrent. Concurrent reads are no problem, but writes are trickier - and reading while writing is also not straightforward.

The best I've been able to come up with is the following version, which combines a `BloomFilter` with a `ConcurrentHashMap`. Unfortunately, the space behavior of this data structure is also not as good as a `BloomFilter` - the space complexity varies inversely with the concurrency. Code for this is available [on github](https://github.com/stucchio/Oldmonk/blob/6adbaf7104c73fc0fff02c6e69b7698e0492b04d/src/main/scala/com/vwo/oldmonk/datastructures/SemiConcurrentBloomFilter.scala).

The basic idea is the following. We store an `AtomicReference` to the `BloomFilter`, and we also store a `ConcurrentHashMap`:

```scala
class SemiConcurrentBloomFilter[A](filterSize: Int = 1024*1024, falsePositiveProbability: Double = 1e-12, insertionsBeforeCompact: Int = 1024)(implicit funnel: Funnel[A]) {

  private val newValues = new java.util.concurrent.ConcurrentHashMap[A,A]()

  private val mainFilter: AtomicReference[BloomFilter[A]] = new AtomicReference(
    BloomFilter.create[A](funnel, filterSize, falsePositiveProbability)
  )

  private val insertionsSinceCompact = new AtomicInteger(0)
```

When we `add` an element to the filter, we simply insert it into `newValues`. We also increment the `insertionsSinceCompact` value.
Once `numInserted` reaches `insertionsBeforeCompact` (or some multiple)`, we *attempt* to compact the data structure.

```scala
  def add(a: A) = {
    val bf = mainFilter.get()
    if (!bf.mightContain(a) ) {
      newValues.put(a,a)
      val numInserted = insertionsSinceCompact.incrementAndGet()
      if (numInserted % insertionsBeforeCompact == 0) {
        maybeCompact
      }
    }
  }
```

I'll come back to the compaction process in a moment. The `mightContain` operation is then defined as first checking if a value is in the `ConcurrentHashMap`, and then checking if it's in the `BloomFilter`:

```scala
  def mightContain(a: A) = {
    val fromNew = newValues.get(a) //If a has been removed from newValues
    if (fromNew != null) {
      true
    } else { //Then we have already added
      mainFilter.get().mightContain(a)
    }
  }
```

The compaction process consists of moving values from the `ConcurrentHashMap` into the `BloomFilter`. However, we can't simply do this willy nilly - there is a very real possibility that multiple compactions will happen simultaneously. What we must do is copy the Bloom filter, add the elements in `newValues` to it, and remember which values we added:

```scala
  def maybeCompact: Unit = {
    attemptedCompactions.incrementAndGet()
    val size = newValues.size()
    val toAdd: Seq[A] = newValues.keys().take(size).toSeq //We restrict the size to ensure that we don't sit in an infinite loop here
    val oldBf = mainFilter.get()
    val newBf = oldBf.copy()
    toAdd.foreach(newBf.put _)
    val addedNew: Boolean = mainFilter.compareAndSet(oldBf, newBf)
```

So far this is safely concurrent - we have merely *read* the `ConcurrentHashMap`, and then *written* these values to the `BloomFilter`. So at this time, the elements are contained in both the `ConcurrentHashMap` and also the `BloomFilter`. So at this time, the `mightContain` operation will surely return the correct result. We make sure to limit the number of elements we move to `size` elements because we don't want this operation to run forever if a separate thread keeps calling `add`.

Then, in the event we successfully replaced the old `BloomFilter` with the new one, we can now safely remove those elements from the `ConcurrentHashMap`:

```scala
    if (addedNew) { //If this succeeds, then both mainFilter and newValues contain all elements of toAdd
      toAdd.foreach(newValues.remove _) //Now it's safe to remove from newValues
      insertionsSinceCompact.addAndGet(-1*size) //Finally reduce insertions
      successfulCompactions.incrementAndGet() //Statistics
    }
  }
```

During and after this process, the `mightContain` operation will also return the correct result. These values might be absent from `newValues`, but they will be present in the `BloomFilter`.

This data structure also has no deadlocks. Suppose multiple threads begin a compaction simultaneously. At least one of these threads will successfully call `mainFilter.compareAndSet(oldBf, newBf)` - the rest will fail. This means that elements will be moved from the `ConcurrentHashMap` into the `BloomFilter` - i.e. the process never gets stuck.

All told, this means we have a valid concurrent data structure.


In principle, I believe that the space complexity of this an amortized constant provided the rate of insertion is not too large. Suppose it takes a time `c*size` for a compaction event to occur, and suppose new elements are added at a rate `a` per unit time. When `time == insertionsSinceCompact / a`, a compaction will be triggered. This will take time `c*insertionsSinceCompact`. So as of time `insertionsSinceCompact/a + c*insertionsSinceCompact = (1/a+c)insertionsSinceCompact`, a compaction will be complete. This means that the largest the `ConcurrentHashMap` will ever get is `a*(1/a+c)insertionsSinceCompact = (1+ac)insertionsSinceCompact`.

So although the constant factor is larger, this data structure has similar complexity to a BloomFilter.

So now, dear reader, I ask you - is this correct? Does anyone know of a better version of this? What I've come up with here seems right to me, but I'd love to know what the internet thinks of this. And since I know a lot of smart folks read my blog, I'm reaching out to you.
