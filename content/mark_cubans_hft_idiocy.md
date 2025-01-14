title: Mark Cuban's HFT Idiocy
date: 2014-04-09 09:00
author: Chris Stucchio
tags: economics, trading, high frequency trading
category: high frequency trading





I just finished reading Mark Cuban's [Idiot's Guide to High Frequency Trading](http://www.huffingtonpost.com/mark-cuban/high-frequency-trading_b_5086685.html). The title is half accurate - it's certainly idiocy, though it's by no means a guide. Writing a guide to HFT without explaining how a matching engine works is like writing a guide to computer programming that doesn't explain what a variable is. If you want an actual guide to HFT, I wrote one a couple of years ago. [Part 1](/blog/2012/hft_apology.html) [Part 2](/blog/2012/hft_apology2.html).

Cuban repeats a common trope I see a lot in HFT critiques - "jump in front of those users" " jump to the front of the trading line" "jump in front of trades from slower market participants to create small guaranteed wins millions of times a day". Most critiques of HFT often involve this claim. And it's simply wrong. Other false claims Cuban makes is the claim that HFTs are "guaranteed to make a profit", that HFTs don't trade thinly traded stocks, and his claims about order stuffing. I'll address quote stuffing in another blog post, but I'm going to take down the rest of Cuban's claims in this post.



# HFT's Can't "cut in front"

At this point I fully realize that I'm about to make this blog post completely inaccessible to most HuffPo readers by drawing a network diagram. But it's necessary.

Network topology of the markets:

![network diagram](/blog_media/2014/hfts_cant_jump_the_queue/network_diagram.png)

The important point is that the HFT has a direct connection to the market and receives everything in a few milliseconds. The slow guy is seconds behind - he actually needs to wait for his web browser to reload ETrade to receive a quote update.

So now, suppose a little guy like myself wants to buy 2 lots (200 shares). Suppose the order book looks like this:

    SELL(100@20.5)
    SELL(100@20.25)
    SELL(100@20.2)
    --------------
    BUY(200@20.1)
    ...

I place my buy order for 200 shares @ $20.25. Here is a timeline of what happens (times are in milliseconds):

    T = 0   : My order hits ETrade
    T = 1000: ETrade communicates my order to the matching engine.
    T = 1001: The matching engine looks at the order book and discovers a match:

    SELL(100@20.5)
    SELL(100@20.25) <----- Trade match! 100 shares @ 20.25
    SELL(100@20.20) <----- Trade match! 100 shares @ 20.20
    --------------
    BUY(200@20.1)
    ...

At `T = 1001`, the order book now looks like this:

    SELL(100@20.5)
    --------------
    BUY(200@20.1)
    ...

Then the matching engine notifies everyone via the multicast messages, and notifies me and whoever I traded with via the private messages. The notifications are received in roughly the following order:

    T = 1030: HFT hears that someone just bought 100 @ $20.2, 100 @ $20.25
    T = 1500: ETrade hears that someone just bought 100 @ $20.2, 100 @ $20.25
    T = 1500: ETrade hears that I just received 2 fills on my order
    T = 2500: ETrade updates my web browser and informs me of all this.

The HFT **never had the opportunity to "cut in front" of me**. My order was filled at `T=1001` and the HFT was informed at `T=1030`.

## "Jump the Queue" means Mark Cuban is whining about someone beating him at his own game

Now suppose it wasn't me buying shares. Suppose it was Mark Cuban. Where I normally move $3000-5000 worth of shares around at any one time, Cuban can easily move millions around. Suppose Mark Cuban wants to buy 20,000 shares (trade value ~$400k). The order book looks like this:

    SELL(100@20.5)
    SELL(100@20.25)
    SELL(100@20.2)
    --------------
    BUY(200@20.1)
    ...

He can't find 20,000 shares on offer, and he doesn't want to pay $20.5 in any case. He knows if he places a big buy order for 19,800 @ $20.25 that everyone (including the ETrade guy) will figure out what he is up to and raise the price. So he decides to get clever. He'll send out `BUY 200 @ $20.25` now. After this the order book looks like:

    SELL(100@20.5)
    --------------
    BUY(200@20.1)
    ...

Then he'll wait for some poor sucker to put in some more `SELL 100 @ $20.20` order. Immediately after he sees that he'll snipe it. Cuban, being a big trader, has a pretty fast connection to the markets - he can easily place a trade in 200-300 ms.

Cubans goal is to buy 20,000 shares before the markets figure out that demand went up, and that the price should move correspondingly. He's trying to be the fastest guy on the market.

This is what Cuban wants to happen, and what used to happen in the old days before HFT:

    T = 0: Trader places order SELL 100 @ $20.10
    T = 300: Cuban hears about it
    T = 500: Cuban uses a keyboard shortcut to trade really fast.
    T = 700: Cuban owns the shares
    T = 2500: ETrade guy sees everything that just went down.

Now that Cuban is no longer the fastest guy out there, here is what happens:

    T = 0: Trader places order SELL 100 @ $20.10
    T = 30: HFT sees sell order
    T = 35: HFT places buy order
    T = 70: HFT owns shares
    T = 300: Cuban sees shares for sale
    T = 500: Cuban sees someone faster than him just sniped them
    T = 86400000 (next day): Cuban whines in HuffPo about the markets being unfair.

Cry me a river.

I discuss this in more detail in [A Fervent Defense of Front-Running HFTs](/blog/2014/fervent_defense_of_frontrunning_hfts.html).

# Is the HFT guaranteed to make a profit?

So our industrious HFT has observed that someone seems to be buying shares whenever a `SELL` order hits the market between $20.00 and $20.25. His electronic brain decides he wants to fight with this guy and push the price up. Is his profit guaranteed?

Hardly. To make a profit, the HFT needs to buy a bunch of shares between $20.00-20.25 and sell most or all of them back to Mark Cuban for $20.26 or more.

Mark Cuban knows he wants to buy 20,000 shares. He knows he is unwilling to pay more than $20.50 for them.

This is what our industrious HFT knows:

    12:00:00 Someone bought 200 @ $20.00
    12:16:23 Someone bought 100 @ $20.12
    12:28:16 Someone bought 300 @ $20.18
    12:29:45 Someone sold   200 @ $19.97
    12:45:02 Someone bought 200 @ $20.25
    12:49:56 Someone bought 200 @ $20.19
    12:49:46 Someone sold   100 @ $19.95

Now he needs to use the magic of "pattern matching software" (i.e. a weighted moving average) to deduce from this that Cuban wants 20,000 shares @ $20.50 or less.

Lets suppose his "pattern matching" isn't perfect, and he picks up 30,000 shares, paying an average price of $20.22 for them. He turns around and tries to sell them to Cuban at $20.75. Cuban says "fuck that, too rich for my blood."

Now the HFT is stuck with 30,000 shares that he needs to unload. And you better believe that the HFT is not going to be getting $20.22 for them, particularly as soon as the other HFTs figure out he needs to dump a big position.

If you get it right you make money, if you screw up you lose money. That's how trading works.

# Do HFT's trade low volume stocks?

Cuban makes this claim.

> b. If you trade in small stocks, this doesn't impact small stock trades. HFT doesn't deal with low volume stocks. By definition they need to do a high frequency of trades. If the stocks you buy or sell don't have volume (I don't know what the minimum amount of volume is), then they aren't messing with your stocks.

This one is a doozy. It shows that Cuban doesn't even understand what "high frequency" actually refers to.

HFTs don't need to do a high frequency of *trades*. The "high frequency" part of the name refers to the process of *getting into the order book*. Consider the following sequence of events:

    T = 0:   A signal hits the market suggesting a stock might go up
    T = 29:  HFT #1 sees the signal
    T = 32:  HFT #2 sees the signal
    T = 33:  HFT #1 sends a sell order @ $20.20
    T = 56:  HFT #2 sends a sell order @ $20.20
    T = 103: HFT #1's order gets into the order book. Now it looks like this:

    SELL(100@20.20) <- HFT #1's order
    --------------
    BUY(200@19.97)

    T = 105: HFT #2's order gets into the order book:

    SELL(200@20.20) <- HFT #2's order
    SELL(100@20.20) <- HFT #1's order
    --------------
    BUY(200@19.97)

This is the *high frequency* part of the game. Because he was faster, HFT #1 is now sitting at the top of the order book. He will trade first. Now, at `T=200,000` someone comes along and takes liquidity:

    SELL(200@20.20) <- HFT #2 - doesn't trade. :(
    SELL(100@20.20) <- Trade!!! HFT #1 has just sold 100 @ $20.20 to anonymous counterparty.
    --------------
    BUY(200@19.97)

HFT #1 was allowed to trade at `T=200,000` because he was the fastest at `T=0`. His speed is *irrelevant* at the time of the trade.

What happens next is:

    T = 200,030: HFT #1 places BUY 100 @ $19.98

The order book then looks like this:

    SELL(200@20.20) <- HFT #2
    --------------
    BUY(100@19.98) <- HFT #1
    BUY(200@19.97)

If someone comes along and sells shares before the market moves, HFT #1 will make some money. And if the market moves before that happens he will lose money.

HFTs do NOT need high volume in an individual security to trade. In fact, they will typically make *more money per share* on thinly traded stocks since the spread is wider.

Enough volume needs to exist so that they can close out their positions and avoid failure to deliver, but that's a *very* low bar. A few trades/day, most likely. Any security which doesn't meet that bar is probably about to be delisted.

# So why are some of the big banks and funds not screaming bloody murder?

This is a question Cuban asks. It's silly, since it assumes they aren't.

[Goldman is](http://online.wsj.com/news/articles/SB10001424052702303563304579447692855042948?mod=mktw). [Charles Schwab is](http://pressroom.aboutschwab.com/press-release/corporate-and-financial-news/schwab-statement-high-frequency-trading). Big traders like [Mark Cuban](http://www.huffingtonpost.com/mark-cuban/high-frequency-trading_b_5086685.html) and [David Einhorn](http://www.cbsnews.com/news/is-the-us-stock-market-rigged/) are.

Their information advantage has been reduced and they are steaming mad about it. Less money for them, more for the little guy.

# Huffpo, seriously?

Come on guys. Clearly no editor or fact checker actually did their job. You could have just read a book (like [Trading and Exchanges](http://www.amazon.com/gp/product/0195144708/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0195144708&linkCode=as2&tag=christuc-20) from fucking 2002) and discovered that Cuban is full of it. Every single one of his factual claims is wrong. I'm sure you got pageviews, but this is ridiculous.
