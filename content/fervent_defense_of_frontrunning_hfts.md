title: A Fervent Defense of Front-running HFTs
date: 2014-04-07 10:00
author: Chris Stucchio
tags: economics, trading, high frequency trading, predatory trading
category: high frequency trading





In the good old days before the computer revolution, stocks were generally priced by traders using pencil and paper. Analysts would read news, study corporate financials, and then give ideas to traders. Trading happened in a physical trading pit. When a large player (Goldman Sachs, J.P. Morgan) wanted to buy a large block of shares, they would hire a pit trader to trade on their behalf..

The pit trader would be told to buy a bunch of shares of GOOG at the best price he could. Before electronic trading, order flow was determined by price-height priority. If a trader is really tall, you are more likely to notice that he wants to fill your order. Similarly if he was loud, had a bright jacket, or was otherwise noticeable. Those days were far more civilized than our modern system of price-time priority and electronic markets, or at least that's what [Michael Lewis](http://www.amazon.com/gp/product/0393244660/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0393244660&linkCode=as2&tag=christuc-20) wants us to believe.

Nowadays, the electronic markets are a [crime scene](http://www.zerohedge.com/article/its-not-market-its-hft-crop-circle-crime-scene-further-evidence-quote-stuffing-manipulation-) full of evil HFTs who will front run little guys like J.P. Morgan.

In contrast, consider the good old days of pit trading. A pit trader would never front-run you. A pit trader would never dare to move his price away from where David Einhorn wants it to be.

![a pit trader](/blog_media/2014/fervent_defense_of_frontrunning_hfts/pit_trader.jpg)




(With apologies to the most photogenic pit trader I could find via Google Image Search.)

Before you accuse me of exaggerating on price-height priority, I have it on good authority (read: someone who worked there) that brokers in Chicago wore lifts in their shoes to make it easier to get a fill.

The major charge Michael Lewis levels at the new world of electronic trading is that high frequency traders "front-run" institutional traders, which he somehow equates with the little guy. I guess "what's good for Goldman is good for America"? In this post I will explain why "front-running" (the actual term is "predatory trading") is a good thing, how it helps the little guy, and why Michael Lewis is mostly full of crap.

Also, after you read this article, go read Jalopy's [comment on HN](https://news.ycombinator.com/item?id=7546768). Made me think twice.

# Front Running and Predatory Trading - some definitions

To begin I want to define some terms.

**Front-running** is when a market participant with a fiduciary duty to act as your agent uses knowledge of your trades to make their own trades. In simple terms: you tell your broker "go buy me a bunch of GOOG, get me a good price." Your broker then buys some GOOG for himself, raising the price. Then he turns around and sells you GOOG at a higher price. This is front running because it's *your broker* - you are paying him to help you out.

**Predatory trading** is when some guy who *doesn't work for you* figures out that you want to buy a bunch of GOOG and buys it in order to drive the price up for you. In the old days of pit trading, some tall guy in a bright pink jacket might notice you are getting nervous towards the end of the day. During the day he observed you buying up some GOOG and he figures that you want to buy more and the price will go up. So he goes "hey, I want some too", and outbids you.

In simple terms:

![Mickey and Rocky](/blog_media/2014/fervent_defense_of_frontrunning_hfts/rocky-screenshot-4.jpg)

Mickey (Rocky's coach) is an asshole if he punches Rocky. Punching Rocky is bad because Mickey's job is to help rocky.

![Apollo and Rocky](/blog_media/2014/fervent_defense_of_frontrunning_hfts/rocky-screenshot-7.jpg)

Apollo is not an asshole if he punches rocky. His job is to kick Rocky's ass.

From here on out, I'm going to stick to the term "predatory trading" to refer to HFTs who trade ahead of you but are not your broker.

### The little guy

For the purposes of this blog post, I'm following Michael Lewis' unconventional definitions. I'm defining the "little guy" as JP Morgan or George Soros - someone who wants to move 100,000 shares at a time. I'm defining the "big guy" as either Joe Sixpack dumping 100 shares from his retirement account, or perhaps Anil's HFT shop, a $1-20M prop shop run by a few computer geeks.

# Moving Large Blocks

Big players sometimes need to move a lot of stock at one time. As a concrete example, [Little Billie Ackman](http://en.wikipedia.org/wiki/Bill_Ackman) currently holds a [$400M short position](http://dealbook.nytimes.com/2013/11/22/ackman-vows-to-take-bet-against-herbalife-to-the-end-of-the-earth/) against Herbalife, which he believes is a pyramid scheme. If Bill Ackman wants to close out this short, he will need to move a lot of shares relatively quickly. Similarly, in 2011, [Little Davey Einhorn](http://en.wikipedia.org/wiki/David_Einhorn_(hedge_fund_manager)) performed a large short against Green Mountain Coffee.

For the purposes of this post, I'll be discussing cases when a market participant wants to move an amount of stock larger than the current set of open orders on a single public matching engine (e.g. NYSE/ARCA/BATS). For example, suppose the order book looks like this:

    SELL(100 @ $21)
    SELL(300 @ $20.5)
    SELL(500 @ $20.0)
    SELL(300 @ $20.0)
    SELL(400 @ $20.0)
    ----------------
    BUY(300 @ $19.90)
    BUY(200 @ $19.85)

The case we are interested in is when a trader wants to move 10,000 shares, but only 1,600 shares are available.

## Supply and Demand

Like most things, the price of a stock is determined by supply and demand. When a trader decides he wants to make a large trade, *demand has changed* in a significant way. As a result, the price of the stock will change a well.

This is generally considered to be a good thing. In fact, it's the primary mechanism behind price discovery and using markets to transmit information. If a speculator believes AAPL is undervalued, he buys a bunch of shares of AAPL. This drives up the price until AAPL is no longer undervalued - then the speculator can sell his AAPL and reap the profits.

A very important fact to note is that at the time the decision to trade is made, the person making the trade has an information advantage. Everyone else in the market currently believes demand is `D`. The trader knows that demand is actually `D+B`, where `B` is the amount of stock they want to buy. The trader knows when the trade will be made.

The goal of the trader is to use this information without leaking it to the outside world. As soon as everyone else figures out the demand is `D+B`, they will adjust their prices accordingly.

# A whale dumped 1000 lots - you'll never believe what happened next

Lets consider first the ideal case for [Little Billie Ackman](http://en.wikipedia.org/wiki/Bill_Ackman). Suppose that there are currently 1000 lots (1 lot = 100 shares) available on the matching engine.

At this point, a whole bunch of "trade" messages hit the feed - someone bought 1000 lots at $21.00. Everyone else in the market has just figured out that they got the demand wrong - they thought it was `D`, but it's actually `D+B`. As a result, the price on offer will immediately shoot upwards, perhaps to $22.00.

In the meantime, all the traders who had orders out in the market do not reap the benefits of this price increase. Their orders were filled at $21.00 and then the price went up to $22.00. Conversely, if the whale sold at $21.00, the people who just bought from him might discover that a few moments later, their shares are worth only $20.50.

# Adverse Selection aka Delta Toxicity

There is a further difficulty when passively providing liquidity. When you passively provide liquidity, there are two types of people who will take liquidity from you.

**Retail traders**. This category of people is folks like Joe Retiree - he's a fellow who put money into the market and now wants to take it out. Or perhaps he's a younger man who wants to put his money into the market. His goal is to save his wealth for later - as a result, he wants to buy stocks that broadly track the economy. Very importantly, he's typically not trading on the basis of information that only he posesses.

**Informed Traders**. This category of people includes folks like Little Billie Ackman. Ackman has information on Herbalife which the liquidity provider lacks - as a result, the expectation is that after Ackman buys, the price of shares will move against the liquidity provider and in favor of Ackman.

Informed traders (which traders moving a lot of stock nearly always are) reduce the profits of market makers. As a result, market makers try to focus on providing liquidity to people with consumption preference while avoiding (or charging higher prics to) the informed.

As a result, most traders attempt to hide their intentions. Instead of hitting the market with a single trade that meets their demand, they buy in small chunks - 2 lots here, 3 lots there, until they've eventually filled the entire 1000 lot trade they wanted. Most big traders have internal departments devoted to trade execution - hiding their intentions in the most clever way possible. For anyone who doesn't want to run an internal department, you can rent an algorithm from assorted shops out there. For example, [Pipeline Financial](http://www.marketswiki.com/mwiki/Pipeline_Financial_Group_Inc) (oops, bad example).

Many alternative trading venues, for example [Dark Pools](http://en.wikipedia.org/wiki/Dark_liquidity) have sprung up as a way to help the little guy hide his intentions. A Dark Pool is basically a matching engine where all quotes are hidden - only trades are printed to the public tape. There are also electronic communication networks (ECN) and crossing networks which offer similar services to dark pools - they let you move large blocks quietly, without leaking information.

This process of trade execution was actually the job of Katsuyama, the hero of Michael Lewis' tale. His job was to go out into the markets and quietly buy or sell shares for his clients. And according to Michael Lewis, he sucked at it. Apparently he thought his job was to push a button, sell 2000 lots in one shot, and then collect his $2M/year paycheck.

## The little guy's dirty secret

So now, dear reader, you might be asking yourself how Little Goldie Sacks might go about quietly purchasing shares, moving 1000 lots without revealing her intentions to the market. The answer:

**The little guys either build or rent a high frequency trading shop.**

Most shops which do high frequency trading exclusively are noise traders. They run algorithms which are designed to be market neutral - buy 3 lots of IBM, sell it a few hundred seconds later [1]. In contrast, the little guys trying to move $20M of stock run similar algorithms - the only difference is that they skip the sell side of the trade. Or sometimes they do the sell side, but don't match the sizes. I'm told by a person who does this that a whale who wants to move 1000 lots might actually trade 1500-2000 lots - say 1250 buys and 250 sells, for a net gain of 1000 lots.

[1] For anyone confused by this, "high frequency" refers to the speed at which orders are placed. The HFT places orders rapidly to get into the buy queue before the other guy. Immediately after he trades he again rapidly attepmts to get into the queue to sell his shares. But the time between him getting into the queue and actually selling shares could be quite long. Go read the [tutorial](http://www.chrisstucchio.com/blog/2012/hft_apology.html).

# Price Discrimination

Because of the dichotomy between retail and informed traders, HFTs have come up with clever schemes to price discriminate between these two groups.

A typical HFT will run a market making strategy, passively offering liquidity. The people with consumption preference make small trades and are nearly always filled in a single trade. To begin, the market might look like this:

    SELL(100 @ $21)
    SELL(300 @ $20.5)
    SELL(500 @ $20.0)
    SELL(300 @ $20.0)
    SELL(400 @ $20.0)
    ----------------
    BUY(300 @ $19.90)
    BUY(200 @ $19.85)

Big Joe, a retail investor might want to put $16,000 into the market. So he hits the market with an 800 share order. The net result:

    SELL(100 @ $21)
    SELL(300 @ $20.5)
    SELL(500 @ $20.0) <- TRADE 100 @ $20
    SELL(300 @ $20.0) <- TRADE 300 @ $20
    SELL(400 @ $20.0) <- TRADE 400 @ $20
    ----------------
    BUY(300 @ $19.90)
    BUY(200 @ $19.85)

Afterwards the order book looks like this:

    SELL(100 @ $21)
    SELL(300 @ $20.5)
    SELL(400 @ $20.0)
    ----------------
    BUY(300 @ $19.90)
    BUY(200 @ $19.85)

Big Joe's order is now filled, and he is happy. Note that the market maker *at no point* had the ability to change any order in response to Big Joe. If you do not understand this point, please go read the [tutorial](http://www.chrisstucchio.com/blog/2012/hft_apology.html).

In contrast, suppose Little Billie Ackman hits the market with a 1,500 share order (a small fraction of the 10,000 shares he wants) at $20.50:

    SELL(100 @ $21)
    SELL(300 @ $20.5) <- TRADE 300 @ $20.5
    SELL(500 @ $20.0) <- TRADE 500 @ $20
    SELL(300 @ $20.0) <- TRADE 300 @ $20
    SELL(400 @ $20.0) <- TRADE 400 @ $20
    ----------------
    BUY(300 @ $19.90)
    BUY(200 @ $19.85)

Now the order book looks like this:

    SELL(100 @ $21)
    ----------------
    BUY(300 @ $19.90)
    BUY(200 @ $19.85)

At this point, Little Billie is hoping more people will show up and offer to sell @ $20.00, and he can pick them off as well. In contrast, the market makers are sitting there thinking "oh shit, shark in the water, if you want us to make markets it'll cost you a bit." They then put new orders out and the book will look something like this:

    SELL(200 @ $22.00)
    SELL(300 @ $21.5)
    SELL(500 @ $21.25)
    SELL(100 @ $21.25)
    ----------------
    BUY(300 @ $19.90)
    BUY(200 @ $19.85)

Now if Little Billie wants to fill his big block, he'll need to pay more than $20.00/share.

Avoiding adverse selection was a constant problem when I traded.  I haven't done HFT in years, but I still remember cooking up a trading signal and then running:

    java com.myemployer.simulation.ComputeAdverseSelectionAfterTrigger --date BEGIN-END

Coming up with a new trading signal would allow you to offer a better price for small liquidity consumers, and pull your orders/resubmit at a higher price anytime a big player wanted to move a lot of lots.

## What if we had no price discrimination

If we had no price discrimination, perhaps because of a regulation requiring market makers to leave their quotes out in the market for 60 seconds, then the beginning of this story would be different. Instead of offerling liquidity at $19.90/$20.00, the market makers would have had a wider spread:

    SELL(100 @ $21.00)
    SELL(300 @ $21.00)
    SELL(500 @ $20.69)
    SELL(300 @ $20.65)
    SELL(400 @ $20.60)
    ----------------
    BUY(300 @ $19.70)
    BUY(200 @ $19.65)

The actual price of liquidity would be some sort of weighted average of the adverse selection of trades of Big Joe and Little Billie. The net result is that Big Joe would pay more to trade and Little Billie would pay less.

# What about Active Predators

Consider now the more active predators which Michael Lewis claims exists, but which in reality are far less common than he believes. These traders are not simply market makers - they will actually trade ahead of the whale and buy up shares.

So Little Billie Ackman does this:

    SELL(200 @ $21.0)
    SELL(100 @ $21.0)
    SELL(300 @ $20.5) <- TRADE 300 @ $20.5
    SELL(500 @ $20.0) <- TRADE 500 @ $20
    SELL(300 @ $20.0) <- TRADE 300 @ $20
    SELL(400 @ $20.0) <- TRADE 400 @ $20
    ----------------
    BUY(300 @ $19.90)
    BUY(200 @ $19.85)

Then the predator comes along and buys up the remaining liquidity:

    SELL(200 @ $21.0) <- TRADE 200 @ $21.0
    SELL(100 @ $21.0) <- TRADE 200 @ $21.0
    ----------------
    BUY(300 @ $19.90)
    BUY(200 @ $19.85)

Finally the predator offers the shares he just bought at a higher price:

    SELL(300 @ $22.0)
    ----------------
    BUY(300 @ $19.90)
    BUY(200 @ $19.85)

This benefits the trader attempting to sell at $21.0 - he gets an immediate fill. If the predator never showed up, the trader with the $21.00 sell order may never have been fillled. Perhaps Little Billie would have eventually purchased at $21.0. On the other hand, perhaps Little Billie would have waited hours or days for someone else to show up at $20.25, and the seller would never have been filled at $21.00.

This is good for the market as well - information about demand is now available, but has not been incorporated into the market price. The predator has turned this *information* into a *price movement*, thereby making the market more efficient.

# Conclusion

Informed traders looking to move a large block have an information advantage over everyone else. They know that the price of a security is about to move, whereas the their counterparties do not. When the informed trader trades, they reap most of the benefits and their counterparty loses.

Predatory traders break this information advantage. Instead of Goldman, David Einhorn or other informed traders gaining the full benefit of their information, predatory traders detect that information and split the profits with the counterparties (taking a cut in the process). Predatory traders improve market efficiency by turning information about market demand into price movements. They are simply criticized because the price movement happens before the whale actually wanted it to.

It's pretty clear why Goldman, David Einhorn and Charles Schwab are opposed to this. Their information advantage is being reduced and they make less money. It's also pretty clear why the NY Attorney General is opposed to this - it's a way to score cheap political points by attacking a bunch of geeks while simultaneously making large campaign contributors happy.

As a regular guy who takes liquidity on occasion, I can't see why I should be opposed. But I suppose if we return to the old days of pit trading, the price-height priority system will certainly work in my favor.

# See also

<div id="8df23a29-bb86-4259-9c5e-1a6f74be4bc2"></div>

This [survey paper](http://pages.stern.nyu.edu/~jhasbrou/Teaching/2014%20Winter%20Markets/Readings/HFT0324.pdf) is also useful in general.

The paper [Predatory Trading](http://people.stern.nyu.edu/lpederse/papers/predatory_trading.pdf) also goes into detail on this. The talk [Competing players in illiquid markets:predatory trading vs. liquidity provision](http://www.ricam.oeaw.ac.at/conferences/fayr07/Talks/Schoeneborn.pdf) gives more detailed links to the literature, as does the [paper](http://mpra.ub.uni-muenchen.de/5548/1/MPRA_paper_5548.pdf) it accompanies.

The paper [High-Frequency Trading Synchronizes Prices in Financial Markets](http://arxiv.org/pdf/1211.1919v1.pdf) shows that HFT generally synchronizes prices in financial markets and makes them more efficient.

Finally, the paper [Do retail traders suffer from high frequency traders?](http://qed.econ.queensu.ca/pub/faculty/milne/322/IIROC_FeeChange_submission_KM_AP3.pdf) answers the question of whether HFT benefits the little guy, based on a natural experiment in Canada. The answer is that Big Joe Sixpack benefits from HFT at the expense of Little Billie Ackman.

Lastly, see [this](https://news.ycombinator.com/item?id=7546768) comment on HN. Really made me think twice about this issue - I'm now quite conflicted.

# Before Commenting

If you feel the need to comment on this article accusing me of whitewashing the fact that HFTs regularly steal pennies from Little Davey Einhorn by waving their hands really really fast and making some Nanex graphs wiggle, **please go read the tutorial**. [Part 1](http://www.chrisstucchio.com/blog/2012/hft_apology.html) [Part 2](http://www.chrisstucchio.com/blog/2012/hft_apology2.html). For some reason, this topic attracts a large number of uninformed comments which postulate impossible trading strategies. After you've read and internalized the tutorial, go ahead and comment. Explain with a detailed sequence of trades how theft happens.

In spite of the silly claims by Michael Lewis, Katsuyama and others were not the first to discover this. Everything Lewis talks about was described in far more detail in [Trading and Exchanges](http://amzn.to/1HkNWyP) way back in 2002. [Algorithmic Trading and Dma](http://amzn.to/1M0hl5i) is another good book on the topic - unfortunately the book was published in 2010, a few months after Katsuyama learned the markets were rigged.
