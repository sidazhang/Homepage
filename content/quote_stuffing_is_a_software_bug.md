title: High Frequency Trader's 'Quote Stuffing' is a Software Bug
date: 2014-04-22 10:00
author: Chris Stucchio
tags: economics, trading, high frequency trading





One of the more enduring memes about algorithmic trading is "quote stuffing". Occasionally an HFT will submit and then cancel a quote thousands of times in a second.

<img src="http://www.zerohedge.com/sites/default/files/images/user5/imageroot/trichet/1%206%20nanex.png" style="max-width: 800px;"></img>

The folks at Nanex, [ZeroHedge](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0CCcQFjAA&url=http%3A%2F%2Fwww.zerohedge.com%2Farticle%2Fits-not-market-its-hft-crop-circle-crime-scene-further-evidence-quote-stuffing-manipulation-&ei=QLhWU4mbLIWFrAfm4oGwDg&usg=AFQjCNGVYZnSwY_3Hf_bCZYlaHBj3yLqlw&sig2=YdK32zEpnMXcJoPxnS2Bbw&bvm=bv.65177938,d.bmk&cad=rja) (from where we linked this image) and other such locations spread a lot of heat about this, though not so much light. The gist of the "theory" is that

1. HFTs send and cancel a lot of quotes in rapid succession
2. ???
3. they steal money from the little guy.

I put "theory" in quotes since, in the traditional scientific usage of the term, part (2) would actually need to be specified to qualify as a theory.

The claims by Nanex and others are entirely nonsense. Quote stuffing is virtually always a software bug caused by odd edge cases which are hard to find in backtests/simulations. Additionally, part (3) of the theory is false - any HFT who does too much "quote stuffing" will lose money. It's not a nefarious plot. It's just a bug.



**Clarification**: The general quasi-theory described above is not a direct quote from Nanex or anywhere else, as is hinted by the lack of quotation marks. The text above is merely my unkind paraphrasing. Eric Scott Hunsader of Nanex suggested via [Twitter](https://twitter.com/nanexllc/status/458682342589353985) that this point was unclear, so I've added this clarification.

# Signal Processing - responsiveness vs accuracy

An HFT system is basically a fancy signal processing engine. A signal is typically a real-valued function of time - perhaps normalized to be confined to the interval `[0,1]`.

![signals](/blog_media/2014/quote_stuffing_is_a_software_bug/signals.png)

Typical signals might be quantities like bid/ask spread, volume at bid, volume at ask, volume at bid / volume at ask, etc. As you might expect, these signals are all very noisy.

Taking these signals as an input, the HFT system needs to make a decision about whether to place an order or not. Unfortunately, when making these decisions, there is a tradeoff to be made between speed and accuracy. In graphical terms:

![signals](/blog_media/2014/quote_stuffing_is_a_software_bug/signal_jump.png)

Has the signal jumped? Has the market moved? Or is it just noise?

![signals](/blog_media/2014/quote_stuffing_is_a_software_bug/signal_jump2.png)

If we wait longer we can determine the answer - that's a real movement. But if we wait too long we will not be able to reap the rewards of our insight. There are lots of tricks we can try to improve the situation, mostly variants of moving averages:

![signals](/blog_media/2014/quote_stuffing_is_a_software_bug/moving_averages.png)

If the HFT responds too quickly, he'll fire off too many orders many of which are just noise. If the HFT doesn't respond quickly enough he'll never get filled. So it's important to get this right.

## A concrete example

Here is a simple signal. An HFT has decided that when the signal is above a threshold, he will trade. When it is below a threshold, he won't. So he looks at historical data:

![signals](/blog_media/2014/quote_stuffing_is_a_software_bug/signal_to_order1.png)

Hey, looks like we placed orders when the signal behaved appropriately. Sounds good - then we check if the market moved in the right direction after orders were placed.

![signals](/blog_media/2014/quote_stuffing_is_a_software_bug/signal_to_order2.png)

Here is another case - we cancelled orders when expected, so everything looks good.

Now that it looks like it's doing the right thing directionally, we run a full backtest. That involves running the strategy which uses this signal against a full batch of historical order data, and check if it apears to make money. Additionally, we look for various statistical indicators of something going wrong. For example, did `profit/order` go down? Did `# of orders` spike? Did we take too much risk? If all the obvious indicators look good, we put it into production.

After running it for a day or two, it works great and appears to make money. Except, once in a blue moon this happens when the *mean* signal approaches the threshold and stays there for a while:

![signals](/blog_media/2014/quote_stuffing_is_a_software_bug/signal_to_order3.png)

Quick, someone call Nanex! It's a crime scene!

### Rare errors are hard to find

What actually happened here is that 99.9% of the time, the trading signal works great. But maybe 0.1% of the time it goes haywire and hits the market with a lot of orders.

If we look at aggregate quantities, we simply don't detect it. 99.9% of the time there is no change in order volume, and 0.1% of the time order volume increases by a factor of 100%. Total increase is `99.9% + 100 x 0.1% = 109.9`, which is well within normal daily variation. If we choose any individual symbol and watch the graph for the entire day, we again don't see any error - out of 1000 symbols, the trading strategy will go haywire only once.

So overall, we are effectively providing liquidity 99.9% of the time, and a few seconds out of the day, for perhaps one trading signal, we go a little haywire. From the perspective of both consumers of liquidity and the HFT, that's really not a bad tradeoff.

## Backtesting is not enough

Quote stuffing is, unfortunately, not a failure caused by insufficient backtesting.

Consider this story from 2011, in which the list price on Amazon for [The Making of a Fly](http://www.amazon.com/gp/product/0632030488/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0632030488&linkCode=as2&tag=christuc-20) was [$23 million](http://news.discovery.com/tech/amazon-lists-books-for-23-million-bucks.htm). The apparent cause of this was that one pricing bot would increase their price to 1.27 x min bid price, whereas another pricing bot would reduce their price to 0.99 x min bid price. The net result is that after both bots updated their prices, the price would increase by a factor of 1.27 x 0.98 = 1.24.

This phenomenon would be *completely impossible to detect via backtesting*. The reason is that developer #1 tests his algorithm against historical data. But in the historical data set, bot #2 does NOT update his prices in response to bot #1 - all bot #2 will do is what he did historically. As a result, you get price wars between two bots, each one rapidly bidding a price up, until a threshold is reached at which point one bot pulls back. Like this:

<img src="http://www.zerohedge.com/sites/default/files/images/user5/imageroot/trichet/nanex%2014.png" style "max-width: 800px"></img>

# Quote stuffing is "Buy High, Sell Low" trading strategy

I've [discussed adverse selection before](http://www.chrisstucchio.com/blog/2014/fervent_defense_of_frontrunning_hfts.html), but I'll give a refresher. When a retail investor is selling stock, he is probably doing so in order to finance his retirement. As a result, his trade is *uninformed* - he is not trading because he knows that BOA is about to tank. In contrast, when an institutional investor (read: big hedge fund) sells, he is often trading precisely because he wants to buy a stock which will go up, or sell a stock which will go down.

When a market maker trades with an informed investor, he is taking the wrong side of that trade. As a result, HFT's go to [great effort](http://www.chrisstucchio.com/blog/2014/fervent_defense_of_frontrunning_hfts.html) to ensure that their bid/ask spread is high when they trade with informed investors.

Now lets take a detailed look at an HFT who is rapidly placing and cancelling orders. For simplicity, suppose that he places an order at 12:00:000, cancels it at 12:00:100, places it again at 12:00:200, cancels at 12:00:300, etc. This HFT is at risk of having his order filled - 50% of the time his order is on the market. If another trader's order hits the market at 12:00:237, the HFT will receive a fill no matter how low his latency is.

## What kind of fill does he get?

Suppose there are a set of other traders who place open orders at 12:00:050. Lets look at a timeline for the order book:

    T = 12:00:000

    SELL(100 @ $20.10)
    ------------------
    BUY(100 @ $20.00) <- Quote Stuffer

    T = 12:00:050

    SELL(100 @ $20.10)
    ------------------
    BUY(100 @ $20.00) <- Quote Stuffer
    BUY(100 @ $20.00)
    ... 2000 more shares...
    BUY(100 @ $20.00)

    T = 12:00:100

    SELL(100 @ $20.10)
    ------------------
    BUY(100 @ $20.00)
    ... 2000 more shares...
    BUY(100 @ $20.00)

    T = 12:00:200

    SELL(100 @ $20.10)
    ------------------
    BUY(100 @ $20.00)
    ... 2000 more shares...
    BUY(100 @ $20.00)
    BUY(100 @ $20.00) <- Quote Stuffer

Notice that the quote stuffer just moved to the *bottom* of the order book, since his order came last.

Now suppose at `T=12:00:237`, a fill occurs. If the fill comes from `SELL(100 @ $20.00)`, a typical retail trade, the quote stuffer will NOT get a fill:

    SELL(100 @ $20.10)
    ------------------
    BUY(100 @ $20.00) <- Filled!
    ... 2000 more shares...
    BUY(100 @ $20.00)
    BUY(100 @ $20.00) <- Quote Stuffer

On the other hand, suppose an informed trader comes along. He knows the market is about to tank, so he decides to `SELL(2300 @ $20.00)` - i.e., he wants to take *all the liquidity*. Then this happens:

    SELL(100 @ $20.10)
    ------------------
    BUY(100 @ $20.00) <- Filled!
    ... 2000 more shares... <- Filled!
    BUY(100 @ $20.00) <- Filled
    BUY(100 @ $20.00) <- Quote Stuffer gets filled!

After someone just dumps 23 lots, the price is likely to go down. The quote stuffer now needs to unload his position:

    SELL(100 @ $19.85)
    ...other guys...
    SELL(100 @ $19.85) <- Quote stuffer, the fastest HFT gets to the top of the new book
    ------------------
    BUY(100 @ $20.80)

Buy high, sell low. Not such a hot trading strategy.

An HFT who engages in quote stuffing is pushing himself to the *bottom* of the order book. If an uninformed trader comes along (the people HFTs want to trade with), the quote stuffer has a 0% chance of filling his order. If the quote stuffer is the only liquidity provider in the market at this time, he has a 50% chance of filling the retail guy's order. In contrast, if an informed trader comes along (the guy who HFTs want to avoid), the quote stuffer has a 50% chance of filling his order. In contrast, if the HFT had a stable order at the top of the book, he'd have a 100% chance of filling the retail guy and a 100% chance of filling the informed trader.

Quote stuffing makes you lose money. It's the exact *opposite* strategy to buying retail order flow, predatory trading, and all the things HFTs are normally criticized for.

# Rolling Windows and Fill Rates

In addition to the fact that quote stuffing makes you lose money, it's also a great way to get shut down.

As a trader, you are allowed to submit N messages to the exchange every X minutes. I can't tell you what N and X are, but your broker can. Once you cross this threshold, you might be forced to stop trading. Your broker might penalize you. There are all sorts of *very bad things* that can happen when you exceed your rolling windows.

The second is your fill rate - this is the ratio of orders you place to trades you make. If this drops too low, your broker gets angry, as does the exchange. This can again result in unpleasant consequences like, for example, your access being turned off.

Spamming orders wildly can get you into trouble. It's best to avoid it if you can.

# Quote Stuffing is not a DOS attack

This is fairly simple to verify. Most incidents of quote stuffing revealed by Nanex show perhaps thousands of quotes/second. With millisecond-level turnaround on orders, this is roughly the best that one could possibly do. The intrinsic latency of the markets imposes fundamental limits on what order flow an HFT can submit.

For comparison, computing `2*x+3` (for different values of `x` stored in a large array of doubles) 8 million times takes my laptop about 20ms. Quote stuffing simply does not add a lot of latency to your competitors.

Further, quote stuffing will actually impose *more* work on you than it will on your competitors. The message sequence for a quote stuffer:

    T=0: Send quote
    T=1: Receive quote Ack (private message)
    T=2: Receive anonymized quote on public feed

(1 and 2 can happen in any order.)

In contrast, everyone else sees only:

    T=2: Receive anonymized quote on public feed

So the quote stuffer needs to handle his own quotes, his own acks, the public feed, and he also needs to reconcile his private feed against the public one. I.e., his software needs to figure out that the quote he just added to the public feed is his own (not someone else's), and that he should not respond to it.

In short, quote stuffing imposes considerably more work on the quote stuffer than it imposes on the competition.

**Note about the reconciliation step:** Suppose the HFT wants to bid 1 penny above anyone else. When he places an order, it will show up in the public feed. If he doesn't reconcile his order book with the public one, he won't realize that the quote which just showed up is his own. As a result he will get into a bidding war *with himself*. That's bad.

# Conclusion

Quote stuffing is an accident. A software bug. An HFT who engages in quote stuffing is not stealing money, running a DOS attack, or anything else. All he did is build a bot which became unstable for a little while. As a result, he put his own capital at risk, increased liquidity for the big players that Michael Lewis is currently shilling for, and potentially got himself shut down.

HFT's do quote stuff. It's impossible to both respond to the markets quickly and not run the risk of quote stuffing. But it's not in the best interest of any trader to be doing it. As a result, HFTs do spend a lot of time trying to reduce the amount of quote stuffing they do. I've certainly created a few classes with names like `VolatilitySmoothedFooSignalCalculator` in my time, which are just variations in `FooSignalCalculator` designed to reduce the number of orders I sent.

**Note:** I've made the graphs using the xkcd plotting style to emphasize that these are schematic diagrams. Further rationale can be found [here](/blog/2014/why_xkcd_style_graphs_are_important.html).

**Amusing:** Apparently Eric Scott Hunsader (CEO of Nanex) is [butthurt](https://twitter.com/nanexllc/status/459132238412914688) about this "libelous" post.
