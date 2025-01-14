title: Introducing Hobo
date: 2012-03-31 10:00
author: Chris Stucchio
tags: hobo, styloot, java, indexing




In this post I'd like to introduce [Hobo](https://github.com/stucchio/Hobo), a fast in-memory *index* for your data. Hobo is not a database, it's an external index for data you have stored elsewhere. Hobo is used for two primary purposes - the first is to answer queries of the form "find me all items with features X and Y", and the second is to find items with a specified color.


## In-memory

Hobo is an in-memory index. The data source is a csv file of the form:

    id;category;quality;red,green,blue;feature1,feature2,...,featuren;cost

`id` is a string representing a unique identifier of an item stored in another database. For example, it might be a string representation of a primary key in Postgres. Category is a string representing an item's category - prefixes denote subset inclusion, so "/dresses/short" is a subcategory of "/dresses" or even "/dre". Red, green and blue are the color of the item in RGB format, the features are a list of feature ID's (separated by commas), and cost is the cost of the item.

Upon startup, Hobo loads the list of items into RAM and index them. This index is used to serve up search results.

Items with a higher quality will be returned first.

## Running Queries

To query Hobo, use the thrift interface. It has one method:

    find(category_name, features, red, green, blue, colorDist, cost_min, cost_max, page)

Most fields are self explanatory - `colorDist` represents how similar hobo will require the color to be, and `page` represents which page of the results should be returned. The field `features` should be a list of feature id's (represented as strings).

### Color Distance - the CIELab Metric

Color distance is calculated using the [CIELab Metric](http://en.wikipedia.org/wiki/Color_difference), which is a method of assigning a numerical distance to a pair of colors that represents how similar they are. A similarity of 0 implies the colors are equal. Humans tend to perceive colors with distance in the region of 0-3 as being identical, and 0-10 as reasonably similar.

The CIELab Metric has been formulated to model human perception of color. It is far more accurate than doing things like, for example, `sqrt( (x.red-y.red)^2+(x.blue-y.blue)^2+(x.green-y.green)^2 )`.

## Scalability

Hobo is deterministic, so you can spin up as many hobo servers as you need if you need scale to a large number of clients.

In terms of the number of items, Hobo scales up as far as available RAM will allow. We have tested hobo as far as millions of items, and it performs reasonably well. Beyond this, Hobo is not the right solution for you/

Hobo expects to have a relatively small number of features per item - on the order of 10-20. Hobo is unlikely to scale as the number of features scales beyond a few thousand in total, and 50 per item.

## Try it out

You can get it from [github](https://github.com/stucchio/Hobo).
