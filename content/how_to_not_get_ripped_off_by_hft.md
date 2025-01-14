title: How to not get ripped off by High Frequency Traders
date: 2014-04-03 10:00
author: Chris Stucchio
tags: economics, trading, high frequency trading
category: high frequency trading





Given the commodification and decline of high frequency trading, I was a bit surprised to see that Michael Lewis [wrote a book](http://www.reuters.com/article/2014/03/31/us-markets-hft-flashboys-idUSBREA2U03D20140331) on the topic. Not only that, but based on the reviews (I haven't read the actual book), it sounds like a scary "tell-all" book revealing how HFT rips off "the little guy". At least, it rips off little guys like [David Einhorn](http://en.wikipedia.org/wiki/David_Einhorn_(hedge_fund_manager)) who want to move millions of shares in a single day.

So I'm a former high frequency trader. I've even written a popular [tutorial](/blog/2012/hft_apology.html) on the subject. Today I'm going to give away a secret and tell all my readers a trick they can use to avoid getting ripped off by HFT's.




# How an HFT makes his money

As I explain in the aforementioned [tutorial](/blog/2012/hft_apology.html), HFT's sell liquidity. This means that at any given time, HFT's will have open orders on the matching engine to buy and/or sell a stock:

    SELL(100 shares @ $50.90)
    -------------------------
    BUY(100 shares @ $50.80)

The market maker (High Frequency Trader or HFT) makes money off the spread - when you want to buy immediately, you *take liquidity*. This means you buy shares from him at $50.90. Then when you want to unload the stock, you sell shares to him at $50.80.

He makes $0.10 off the trade, at least in aggregate.

Additionally, because you took liquidity, you have to pay the exchange a small [liquidity removal fee](https://www.nasdaqtrader.com/trader.aspx?id=pricelisttrading2).

# How to avoid paying the HFT

It's very simple: the HFT is selling liquidity - don't buy it.

This can be accomplished in a number of ways. The simplest is merely not crossing the spread. If the Bid/Ask spreadis $50.80/50.90, you can simply refuse to pay $50.90 for shares. You place a *limit order* for 100 shares @ $50.80 - then whenever someone comes along and is willing to sell for $50.80, they will first sell to the HFT (who's order is already out there) and then sell to you.

Alternately, if you want to be the first to trade, you can place an order to buy 100 shares @ $50.81. In addition, you'll even collect a [rebate for adding liquidity](https://www.nasdaqtrader.com/trader.aspx?id=pricelisttrading2)

## But what if the market moves?

That's a problem. It might happen that you place an order to buy @ $50.80, but in the time it takes you to place your order, the market could move. The evil HFT might rapidly change the bid/ask spread before you reach the market:

    SELL(100 shares @ $50.80)
    -------------------------
    BUY(100 shares @ $50.70)

At this point, although you didn't intend to pay for liquidity, you wind up doing it anyway.

Enter [Add Liquidity Only orders](http://usequities.nyx.com/markets/nyse-arca-equities/order-types) (or [post-only](http://www.nasdaqtrader.com/content/ProductsServices/Trading/postonly_factsheet.pdf) on Nasdaq). ALO orders are a special way to control your trading - with an ALO order you can make sure that you *never* buy what an HFT is selling.

If you use an ALO order to BUY @ $50.80, and the market has moved to SELL @ $50.80, then your order will be rejected. Instead of buying from the HFT, you'll simply be told "sorry, can't buy, try again." Then you can resubmit at a lower price. This effectively cuts the HFT out of the loop.

# Why doesn't everyone do this?

This is an obvious question to ask. The answer is, quite simply, execution risk. Execution risk is the risk that you place an order but your trade never actually happens. This is perfectly fine if you are casually interested in buying shares at some point in the next few weeks.

It's not so useful if you expect GOOG is about to tank and you want to get out ASAP. In that case, the service market makers provide is very valuable - well worth paying the spread + liquidity fee.

This is the exact situation that all the protagonists of Michael Lewis' [book](http://www.reuters.com/article/2014/03/31/us-markets-hft-flashboys-idUSBREA2U03D20140331) were in. They needed to move a lot of shares quickly - they actually needed the service that HFTs were selling.

The fact of the matter is that HFT's can't rip you off. You are never under any obligation to do business with them. In spite of that, lots of sophisticated investors voluntarily pay HFTs every day. An important question for all the critics of HFT to grapple with is, "why do sophisticated investors voluntarily pay for something useless?"

# See also

In the past, I've written a multipart [tutorial](/blog/2012/hft_apology.html) on high frequency trading. [Part 2](/blog/2012/hft_apology2.html) [part 3](hft_whats_broken.html)

See also [Matt Levine](http://www.bloombergview.com/articles/2014-03-31/michael-lewis-doesn-t-like-high-frequency-traders) and [Felix Salmon's](http://blogs.reuters.com/felix-salmon/2014/03/31/michael-lewiss-flawed-new-book/) critiques of Michael Lewis.
