title: Hadoop's MapWritable sometimes a performance hog
date: 2011-03-25 00:00
author: Chris Stucchio
tags: hadoop, serialization, low level hacks



I've been using Hadoop a lot lately for a stealth mode project I'm working on. One of the big lessons I'm learning is that where medium to big data is concerned, data formats matter a lot. Where small filesizes are concerned, there is little harm in slinging around JSON objects and text representations. But once you reach the point of several GB, it's in your best interest to think carefully about efficient representations.


I recently started working on performance optimizations when running a small (20GB) hadoop job. I was attempting to use an inverted index to compute the dot product between a large family of sparse vectors. So my code, in oversimplified form, looked like this:

    #!java
    public void map(UUIDWritable key, UUIDArrayWritable value, Context context) {
        ....
        UUIDWritable resultKey = ....;
        MapWritable result = ....;
        ...
        context.write(resultKey, result);
    }

(UUIDWritable is a custom data format I wrote which stores UUID's in their binary 16 byte representation. Storing UUID's as text takes 33 bytes.)

In this case, the result is a map, each key of which is a UUIDWritable and each value of which is a DoubleWritable. This step of the process was a huge performance hog, and most of the time was being spent on disk IO. Some simple arithmetic suggested that the disk usage was considerably higher than it should be, so I got curious and took a look at [MapWritable.java](http://svn.apache.org/viewvc/hadoop/common/trunk/src/java/org/apache/hadoop/io/MapWritable.java?view=markup):

```java
public void write(DataOutput out) throws IOException {
    super.write(out);
    // Write out the number of entries in the map
    out.writeInt(instance.size());
    // Then write out each key/value pair
    for (Map.Entry e: instance.entrySet()) {
        out.writeByte(getId(e.getKey().getClass()));
        e.getKey().write(out);
	out.writeByte(getId(e.getValue().getClass()));
	e.getValue().write(out);
    }
}
```

It appears that the superclass is writing out something, and then MapWritable is saving two extra bytes (a representation of the class of the key and value). What is the [superclass](http://svn.apache.org/viewvc/hadoop/common/trunk/src/java/org/apache/hadoop/io/AbstractMapWritable.java?view=markup) writing?

```
public void write(DataOutput out) throws IOException {
    // First write out the size of the class table and any classes that are
    // "unknown" classes

    out.writeByte(newClasses);

    for (byte i = 1; i &lt;= newClasses; i++) {
        out.writeByte(i);
        out.writeUTF(getClass(i).getName());
     }
}
```

It appears that MapWritable is writing out the name of every class the map contains (UUIDWritable and DoubleWritable), for an extra 60 or so bytes. So this means that for a vector containing 8 non-zero elements, the size of the record is padded by 100%

No wonder things were slow. I cut disk IO by about 35% and runtime by 25% simply by writing a custom binary format that doesn't write out class names.

Moral of the story? Be aware of what you are writing to the disk. 60 bytes times 100 million records = 6GB of wasted disk IO. With medium to big data, it starts to add up.

<script src="https://gist.github.com/887832.js"> </script>
