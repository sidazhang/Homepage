title: Piketty's r > g thesis proves nothing about inequality
date: 2014-04-30 01:00
author: Chris Stucchio
tags: economics, macroeconomics
mathjax: true





I hate to continue discussing [Piketty's book](http://www.amazon.com/gp/product/067443000X/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=067443000X&linkCode=as2&tag=christuc-20), but it seems to be entering the culture. Not only that, but people who read the book (or at least various book reviews) seem to be gaining a lot of misconceptions from it. Having read approximately half the book, I certainly understand part of the reason for this - Piketty refuses to concretely state his theory (if he indeed has one).

The most prominent misconception people seem to be taking away is that *all by itself*, the simple fact that `r > g` somehow implies that wealth (often inherited wealth) will concentrate. Many people also seem to believe that it implies a decline in mobility, in meritocracy, and all sorts of other egalitarian social structures.

The simple fact of the matter is that `r > g` implies none of this.




# What does r > g mean?

In formal terms, the quantity $@ r $@ represents the growth rate of the *capital stock* of a nation. At the simplest possible level, we have that:

$$ \textrm{capital stock} = C e^{r t} $$

This quantity has units of *dollars*.

The quantity $@ g $@ represents the growth rate of *national income* - i.e.:

$$ \textrm{income} = D e^{g t} $$

This quantity has units of *dollars per year*.

So $@ r > g $@ implies that as time increases, the ratio of *capital stock* to *national income* will grow:

$$ \frac{ \textrm{capital stock} }{ \textrm{income} } = (C/D) e^{(r-g)t} $$

This quantity has units of *years*. It represents how much time it would take for us to rebuild our capital stock if we spent the entire national income on doing so.

## A simple example

Suppose a man has a fixed income of $100,000/year. He also owns a home worth $250,000. The value $@ r $@ represents the rate of return on his house, while $@ g $@ represents the growth rate of his income. Suppose that $@ r = 0.05 $@ while $@ g = 0 $@. In year 0:

$$ \frac{ \textrm{capital stock} }{ \textrm{income} } = ($250,000/ $100,000/\textrm{year}) e^{(r-g)0} = 2.5 \textrm{years} $$

I.e., the man's wealth is 2.5 years worth of his income. In 5 years his home has appreciated to $321,000 while his income has remained constant. Now:

$$ \frac{ \textrm{capital stock} }{ \textrm{income} } = ($250,000/ $100,000/\textrm{year}) e^{(0.05)5} = 3.21 \textrm{years} $$

# How can r > g - multiple models

Unfortunately, the equation $@ r > g $@ describes only macroeconomic aggregates. It provides no information whatsoever on the rate of return of individual investments. In this section I'll describe multiple scenarios, all with r > g. Yet on the micro level, these scenarios will be wildly different! The purpose of this section is not to show that one scenario or another is correct - it is merely to show that $@ r > g $@ is consistent will many different micro-level hypothesis and therefore proves very little.

Most notably, it *does not prove that wealth concentrates*.

## Homogeneous Capital Model

The first scenario I'll call *homogeneous capital*. This is the unrealistic assumption that every dollar of capital invested has the same rate of return as every other dollar, regardless of the investment. Piketty often writes as if this is his underlying model, though he also describes it as unrealistic. As I said, Piketty is quite unclear in the book as to what his actual model is, so I won't concretely attribute this model to him.

In the homogeneous capital model, suppose an individual owns $@ X $@ units of wealth at $@ t=0 $@ and everyone else combined owns $@ C $@ units of wealth. Suppose for simplicity that all income is consumed, so the only drivers of wealth are growth at the rate $@ r $@. At $@ t=0 $@ the individual owns $@ X / (X + C) $@ of the total wealth. How much does he own at later times?

At time $@ t $@, the individual owns $@ X e^{r t} $@ units of capital. Everyone else combined owns $@ C e^{rt} $@ units. So the fraction of wealth owned by the individual at time $@ t $@ is:

$$ \frac{ X e^{rt} }{ X e^{rt} + C e^{rt} } = \frac{ X e^{rt} }{ (X+C) e^{rt} } = \frac{X}{X+C} $$

In this model *wealth never concentrates*. Whatever fraction of the wealth you own at $@ t=0 $@ is what you own forever.

## Silicon Valley Model

The second scenario I'll describe is the *silicon vally* model - it could also be called the *lottery model* since the mathematics would be identical. The world as a whole is made up of $@ N $@ individual capital holders, some of whom may be holding $@ 0 $@ units of capital. The wealth of each individual is $@ x_i $@, and this wealth takes the form of *legacy businesses* - think Microsoft or GM rather than AirBnB.

In every time period a single individual builds a company from scratch and grows it to tremendous size $@ y $@. Once it reaches tremendous size it stops growing and becomes another legacy business. The rate of growth of this economy is:

$$ r = \log\left(\frac{ y + \sum_i x_i} {\sum_i x_i} \right) $$

In this scenario, wealth concentrates over the *short term*. At time zero, the successful entrepreneur owns $@ x_0 $@ units of wealth, representing $@ x_0 / \sum_i x_i $@ of the economy. After one time period, wealth concentration has inreased - the entrepreneur (or lottery winner) owns $@ (x_0+y) / (y+\sum_i x_i) $@ while everyone else owns only $@ x_i / (y+\sum_i x_i) $@.

If we suppose that the number of successful entrepreneurs is far lower than the total number of people then wealth will concentrate. But very importantly, *inherited* wealth does not grow - as a fraction of the economy it shrinks. The only way to grow one's capital is via entrepreneurship (or lottery winnings).

The *mean* rate of return is $@ r $@ but the *median* rate of return (what the vast majority of investors receive) is $@ 0 $@.

## Diminishing return on capital

Another important model to consider is that of *diminishing returns on capital*. This assumes inhomogeneous investors, each investing in some niche. The important point is that returns in each niche have diminishing returns - the rate of return in a given niche $@ r_i = r_i(x_i) $@ decreases with $@ x_i $@.

This is simply a statement that it's easier to grow $1M to $2M than it is to grow $1B to $2B.

Suppose further that the economy as a whole has an aggregate rate of return $@ r $@ which is slowly varying (i.e., I'll pretend it's constant).

For an individual investor who owns $@ x_i $@ units of wealth, we can compute the rate of change of his *fraction* of wealth:

$$ \frac{d}{dt} \left( \frac{ x_i(0) e^{\int_0^t r_i(x_i(t)) dt} }{ C e^{rt} } \right) = \frac{ C e^{rt} x_i(0) e^{\int_0^t r_i(x_i(t)) dt} r_i(x_i(t)) - C e^{rt} x_i(0) e^{\int_0^t r_i(x_i(t)) dt} r} { C^2 e^{2rt} } = $$

$$ \frac{  x_i(0) e^{\int_0^t r_i(x_i(t)) dt} r_i(x_i(t)) -  x_i(0) e^{\int_0^t r_i(x_i(t)) dt} r} { C e^{rt} } = \frac{ x_i(0)e^{\int_0^t r_i(x_i(t)) dt} }{C e^{rt}} \left( r_i(x_i(t)) - r\right) $$

The important part of this equation to note is the $@ ( r_i(x_i(t)) - r) $@ term. As soon as $@ r_i(x_i) $@ dips below $@ r $@, then the fraction of wealth held by a wealthy person *decreases* (though the total amount still increases).

Intuitively, this means that the fraction of wealth held by Elon Musk will increase for a while. At some point (once we are all driving Tesla's), the growth rate of his venture will slow down while the economy as a whole will continue increasing. At this point, the fraction of wealth held by Musk will decrease.

### Increasing return on capital

Conversely, we could take the same mathematical framework as in the diminishing return on capital section, but instead assume that $@ r_i(x_i)$@ is an *increasing* function of $@ x_i $@. With this trivial change, $@ ( r_i(x_i(t)) - r) $@ will remain positive forever once $@ x_i(t)$@ crosses a threshold.

This model does imply wealth concentration - there will be some investor with $@ r_i(x_i(t)) = \max_i r_i(x_i(t)) $@. Eventually this investor will own nearly everything.

(I'm ignoring some mathematical details here - it's possible that $@ r_i(x_i(t))$@ will grow sufficiently slowly that multiple investors will hold an asymptotically constant fraction of the total wealth.)

# r > g by itself tells you nothing about wealth concentration

In his book, Piketty repeatedly suggests that $@ r > g $@ implies concentration of wealth. As evidence to support this, he offers literary hints of the [Belle Epoche](http://en.wikipedia.org/wiki/Belle_%C3%89poque) and occasionally seems to hint at the homogeneous capital model.

The simple fact of the matter is that there are many specific models of wealth growth, each of which reflects certain aspects of reality. And in many of these models, though by no means all, there is no wealth concentration via inherited wealth. The claim that $@ r > g $@ is interesting, but if Piketty and others wish to show that this implies wealth concentration or an increasing imporance of inheritance, they will need a far more detailed model than what is claimed in [Piketty's book](http://www.amazon.com/gp/product/067443000X/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=067443000X&linkCode=as2&tag=christuc-20).

All by itself, $@ r > g $@ implies very little. And if Piketty [bothered to write down a careful model](http://www.chrisstucchio.com/blog/2013/basic_income_vs_basic_job2.html), this fact would be readily apparent. At the very least we would actually know what assumptions he is making.
