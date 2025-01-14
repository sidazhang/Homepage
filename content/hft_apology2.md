title: A High Frequency Trader's Apology, Pt 2
date: 2012-04-25 10:00
author: Chris Stucchio
tags: economics, trading, high frequency trading
category: high frequency trading




In a [previous post](/blog/2012/hft_apology.html) I discussed the mechanics of HFT. If you haven't read it, [go read it now](/blog/2012/hft_apology.html). Now I'll discuss it's social utility and cost.
{% endmark %}

## About the title

Many people were misled by it, and this wasn't my intention. I was merely alluding to the book by Hardy, [A Mathematician's Apology](http://www.amazon.com/gp/product/110760463X/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=110760463X), which spent time explaining and justifying his life as a mathematician. (Hardy, in turn, was alluding to the [Apology of Socrates](https://en.wikipedia.org/wiki/Apology_(Plato)). It's an apology in the classical sense (an intellectual justification), not an expression of remorse. My mistake - as a math geek, it's easy for me to forget that most people have never heard of Hardy.

## Recap - how HFT's make their money

In the previous post, I explained that HFT's usually make their money by running market making strategies. Consider a market with two market makers, Leela and Bender, as well as two speculators, Fry and Zoidberg. Fry bought shares of MomCorp one year ago when the price was $5.00 and wants to cash out. Zoidberg thinks MomCorp is a good buy and wants to get into the market.

    12:00:00.000 - MomCorp issues an earnings release

HFT's now conclude risk has gone down and believe it is safe to buy at price $10.00 or to sell at $10.05. The race is on - HFT's will all attempt to places orders as fast as possible:

    12:00:00.032 BUY(Leela, $10.00, 100 shares) <- Leela trades first
    12:00:00.042 SELL(Leela, $10.05, 100 shares)
    12:00:00.045 BUY(Bender, $10.00, 100 shares)

Pay attention - this is the high frequency part of the story. Leela and Bender got into a race to sell liquidity and Leela won. Leela now has a chance to make $0.05 while Bender doesn't. Speed is important for Leela only because she needs to place her order before Bender - if Leela and Bender were both 100ms slower, then neither one would be affected.

Now Fry decides that he doubled his money, and wants to cash out so that he can purchase anchovies.

    12:01:00.000 SELL(Fry, $10.00, 100 shares)

At this point the matching engine marks a trade between Fry and Leela, and Fry has sold Leela 100 shares for $10.00/share. It's important to note that the race between Leela and Bender didn't matter to Fry - all he knows is that he sold 100 shares @ $10.00 to anonymous counterparty.

Now Leela sits around holding 100 shares, waiting for someone else to come along. There are two possible outcomes:

- At 12:05:00.000, Zoidberg comes along and buys from Leela at $10.05. Leela has earned $0.05.
- At 12:05:00.000, MomCorp's share price drops to $9.50 due to fears that anchovy oil will make MomCorp's robot oil products obsolete, and Zoidberg is only willing to buy at $9.50. Leela has lost $0.50.

Obviously, the former needs to happen more frequently than the latter, otherwise Leela won't make any money. But it's always possible for MomCorp to tank, and Fry is happy to pay Leela $0.05 to take on that risk - he wants to eat anchovy pizza, not stress about short term price movements.

## Price Discovery

I'm taking as a premise that the fundamental purpose of markets is the transmission of information through prices, or price discovery. When new information is discovered about the future value of MomCorp, a well functioning market will adjust prices to reflect this information. I'm also taking as a premise that this process is socially valuable.

Market makers don't directly participate directly in the price discovery process. A high frequency trader, or any sort of market maker, has no opinion or information on whether Apple is a valuable company. So what value do they provide?

With a bit more precision, the market price of an asset should reflect the consensus point of view of that underlying price. But in the real world, there is always a margin of error which tends to be *proportional to transaction costs*. I.e., if it costs you $1/share to trade, you will not be able to make money by making a $0.50 or $0.99 price correction, so the market price will reflect the "true price" with errors of roughly $1. Additionally, taking on risk requires a higher speculative premium - if you run the risk of not being able to sell your shares, you might not buy to begin with.

For simplicity, I'm ignoring things like brokerage fees (typically $8/trade in the US for regular people using eTrade), and focusing solely on the portion of transaction costs caused by the bid ask spread.

What HFT's and market makers do is reduce transaction costs and improve liquidity, thereby allowing speculators to make more fine-grained corrections to the market price.

I'll give a couple of examples illustrating this shortly, but it's important to clarify what I mean by liquidity.

### Liquidity - the ability to trade when you want

Liquidity is a fairly fuzzy term. It generally describes two orthogonal concepts - the number of shares available to buy or sell *right now* at a given price (or better), and the narrowness of the bid/ask spread. Consider the order books:

    SELL($10.10, 100 shares)
    ----------- A ---------
    BUY($10.00, 100 shares)

This order book is less liquid than either of these order books:

    SELL($10.08, 100 shares)
    ----------- B --------
    BUY($10.03, 100 shares)

Book B is more liquid than book A Because the spread is narrower ($10.08-10.03=$0.05, rather than $0.10 for book A).

    SELL($10.10, 100 shares)
    SELL($10.10, 100 shares)
    ----------- C ---------
    BUY($10.00, 100 shares)
    BUY($10.00, 250 shares)

Book C is more liquid than book A because C has more shares available at $10.00 and $10.10.

It's a fairly subjective matter whether book B or C is more liquid. In my mental model, liquidity is only a [partial ordering](https://en.wikipedia.org/wiki/Partially_ordered_set), not a [total ordering](https://en.wikipedia.org/wiki/Total_order). Some people like to assign a quantitative measure to liquidity, and there are all sorts of ways to describe it.

### Why speculators need liquidity

Suppose Fry believes that some future event will occur which will cause MomCorp to become more valuable in one year - perhaps he observed a secret prototype of theirs while delivering a Mother's Day present to Mom (CEO and Founder). Fry will want to take a long position on MomCorp now and close out his position in one year.

Suppose the current price of MomCorp is 9.00/9.05, i.e. it costs Fry $9.05 to buy *right now* and he can sell his shares for $9.00 *right now*. If Fry believes MomCorp will rise in value to $10.00 in the next year, Fry will want to take the following actions:

1. Today: Buy 100 shares MomCorp for $9.05. This pushes the price of MomCorp up from $9.05 to $9.15, transmitting Fry's information on the future of MomCorp to the market.
2. +1 Year: Sell 100 shares MomCorp for $10.00 (this assumes the bid/ask went up to $10.00/10.05).

Profit: $95.

Fry was able to easily convey information to the markets because he wanted to speculate on a highly liquid stock. Fry earned only $0.95/share on a price movement of $1.00 due to transaction costs - he needed to pay the spread ($0.05/share).

But what if MomCorp was less liquid? If no one were willing to sell Fry any shares, Fry is stopped at step 1. He can't buy and therefore can't transmit his information to the markets. Even if someone is willing to buy, Fry might hesitate - what if +1 Year rolls around and he can't find someone to sell to in step 2?

The inability to buy or sell when you want to is liquidity risk, and Fry will demand a higher speculative premium before accepting this risk.

Now suppose shares were available to purchase but with a higher bid/ask spread, say $8.50/9.50. Then Fry's trading strategy would look like this:

1. Today: Buy 100 shares MomCorp for $9.50. This pushes the price of MomCorp up from $8.50/9.50 to $8.65/9.65, transmitting Fry's information on the future of MomCorp to the market.
2. +1 Year: The bid/ask went up to $9.50/10.50, so Fry sells 100 shares MomCorp for $9.50.

Profit: $0 - Fry's entire gain from the price movement went to paying the spread.

Fry is a clever guy, so he probably saw this coming. That's why he didn't bother making this trade and didn't communicate his information to the market - why do work and take on risk for no money?

Market prices will accurately reflect the consensus opinion of the value of the underlying assets, but their margin of error is proportional to the bid/ask spread. Speculators will lose money making corrections smaller than that and will not bother transmitting this information to the world.

It's also important to note that the liquidity most HFT's provide is very fleeting. A typical HFT strategy might often offer liquidity for a few seconds at $10.00/10.05, pull the order (raising the spread to $9.99/10.05) for a few seconds in response to some market event, put it back for a few seconds, etc. None of this matters much to Fry - the jockeying for position among HFT's just means that he doesn't know which order will fill his order when he places it. Fry would much rather have the bid/ask spread oscillate rapidly between $9.98/10.07 and $10.00/10.05 than remain slow and steady at $9.90/10.10 - he'll always pay less money to trade, he just isn't sure exactly how much less.

## HFT - Network Infrastructure for the Markets

When transaction costs are at least as high as $X, messages with value < $X will not be sent. I send thousands of emails every year (cost = mouseclick), but I sent precisely 2 snail mails (cost = walk to post office + dealing with unpleasant postal workers). Both snail mails were very high value - one prevented the Federal Government from hitting me with "failure to file" penalties, the other prevented NJ from doing the same thing.

The network engineers working on gmail have drastically reduced my cost of communication, and thus I send more messages and the friction of communication is reduced. Because those messages have value to me, I've gained and so have the people receiving my messages.

Market makers in general (and HFT in particular) play the same role in financial markets. When a speculator trades, he is attempting to communicate his information to the market. Market makers lower the transaction costs for speculators and allow them to make more fine-grained price corrections.

### Automated market makers - like humans, but faster and smarter

Nothing I've said distinguishes human market makers from automated market makers. But I promised a defense of HFT, so here it is. Computerized market makers simply do a better job than their human counterparts. They do this for two reasons.

*More Accurate* - computers are capable of rapidly doing precise calculations. A human who is mentally gauging the markets will apply a fudge factor - he thinks a good spread is $10.00/10.10, but to protect himself from arithmetic mistakes and human fuzziness he might only offer $9.98/10.12. A computer can do the calculations carefully and offer a narrower spread. The computer can also perform more detailed calculations.

*Cheaper* - There are not many humans smart enough to profitably run a market making strategy. Such humans tend to be expensive - perhaps $50-200k/year - and no human, no matter how smart, can run a market making strategy across more than a few securities. Thus, a market making strategy run by humans must generate at least $200-300k/year in profits *per security*. In contrast, a computer can run a strategy across hundreds of securities. If a server in the proper data center costs $50-200k/year to run and it can run a strategy for 100 securities, then it only needs to earn $2-3k/year in profits *per security*. This enables automated market makers to provide liquidity even in thinly traded stocks where the (absolute) profit would be very low.

*Note: My NDA forbids me from discussing actual costs, so I'm just treating the cost of a server as being identical to the cost of a human. These [HN](http://news.ycombinator.com/item?id=1517339) [threads](http://news.ycombinator.com/item?id=302445) provide recommendations of some entry level HFT brokerages, you can probably find actual prices on their websites.*

Until now I've told a just-so story about how HFT's add liquidity to the market. But this has actually been studied empirically and the conclusion is that [HFT](ftp://ftp.cba.uri.edu/classes/Zhen/iown/liquidity/hendershott_jones_menkveld_jf2011.pdf) [improves](http://papers.ssrn.com/sol3/papers.cfm?abstract_id=1624329) [liquidity](http://papers.ssrn.com/sol3/papers.cfm?abstract_id=1722924).

Automated market makers don't do anything fundamentally different from a pit trader or human daytrader. They just do the same thing faster and more accurately, and they tend to outcompete human market makers by offering tighter spreads and  greater volumes of liquidity. This is the same story we heard with regards to telephone switching, factory work, farming, and thousands of other professions where machines simply do a better job than humans.

So here is my apology/justification for HFT: market making is valuable and computers do it better than humans. A few programmers and servers can replace tens to hundreds of human traders, freeing up the labor of those intelligent people for other pursuits while providing lower costs to the purchasers of liquidity.

## The Latency Arms Race

The astute reader might ask - "does market making need to happen on 4ms timescales?" The answer is no. Going back to our example before, of Fry and Zoidberg speculating while Leela sells liquidity, Fry doesn't care if Leela placed her order at 12:00.00.032, 12:00.00.045 or 12:00.00.150. From Fry's perspective, he trades with anonymous counterparty. There is virtually no benefit to speculators from having HFT's trade in 12ms vs 24ms, or even 24 seconds. The speculator cares only about the fact that someone is willing to buy or sell to him right now with a narrow bid/ask spread.

Leela cares about speed because it allowed her to trade before Bender. If Leela were slow, Bender would jump in first every time and take over the liquidity selling business. Fry does care about *price competition* between Leela and Bender - if Leela wasn't competing with him, Bender would probably offer Fry high prices on liquidity, in the form of a higher bid/ask spread. Price matters to Fry, not latency.

Although the latency competition provides little to no value to the end consumers, all HFTs must play the game. If they don't, a faster HFT will beat them to market and their order flow will be reduced.

This is a very real social cost of HFT - many very smart people spend a lot of time and effort reducing the latency of trading systems. I'm no fool, but when I worked as an HFT I often felt like one. The field contains a lot of very smart people, and the world would probably be better off if the stock market had a little more latency and those smart people were building products for the world. For example, after leaving HFT I built a useful [consumer product](http://styloot.com/content/).

But with current market mechanics, the global optimum where trading is marginally slower and smart people build useful products is impossible to reach. The latency arms race has us stuck in a suboptimal Nash Equilibrium which is similar in character to [signalling competitions](http://www.chrisstucchio.com/blog/2011/high_heel_bubble.html) (e.g., the education bubble).

I'd also like to note that I don't believe automated market making is useless. It isn't. Providing liquidity and reducing the spread is valuable. To illustrate with arbitrary numbers, if HFT's currently focus on 50% strategy (i.e., price competition and liquidity improvements) and 50% latency, a more optimal scenario would be 50% fewer HFT's focusing 100% of their efforts on strategy.

In my next post I'll put forward a policy proposal designed to reduce the effort devoted to the latency competition. The policy proposal won't be good politics - being technical and minimalist, it's neither an attempt to punish those greedy rich 1-percenters nor does it signal affection for those supersmart computer geeks who are disrupting Wall Street. But it's something we've successfully done before and it might push things in the right direction.

## P.S. How to disagree

In the Hacker News [comments](http://news.ycombinator.com/item?id=3852341) on [part 1](http://www.chrisstucchio.com/blog/2012/hft_apology.html) of this series, there were several comments suggesting that HFT's somehow steal pennies from ordinary investors. I don't agree with this claim, but I'm very interested in hearing well reasoned disagreement.

To encourage disagreement to be well reasoned, I'm going to make a suggestion. If you want to claim HFT's are somehow robbing retail investors, please write down carefully the mechanics of how this works. I'd suggest writing a story which illustrates the specific orders the ordinary investor and HFT make, which trades occur, and all possible futures after the trade (i.e. market goes up and market goes down).

As an example, here is a story involving Bender (a truly evil HFT):

The order book to begin with:

    SELL($10.20, 100 shares)
    SELL($10.10, 100 shares)
    ----------- A ---------
    BUY($10.00, 100 shares)

Prof. Farnsworth is about to buy 100 shares at limit price $10.15, just after looking at the picture [cute_puppy.jpg.bender_just_hacked_u.exe](http://imgur.com/dKEg9). As his mouse is hovering over "Buy", the trojan notifies Bender of his intention to trade. Bender rapidly places an order `BUY($10.10, 100 share)` which the market fills immediately. The order book then looks like this:

    SELL($10.20, 100 shares)
    ----------- A ---------
    BUY($10.00, 100 shares)

Bender then places an order `SELL($10.15, 100 shares)`:

    SELL($10.20, 100 shares)
    SELL($10.15, 100 shares) <- Bender's order
    ----------- A ---------
    BUY($10.00, 100 shares)

Prof. Farnsworth's BUY order hits the market and Bender sells him shares at $10.15. If the market goes up to $11.10 Farnsworth gains $95 after he sells. If the market goes down to $9.10, Farnsworth has lost $105. In contrast, without Bender, Farnsworth would have gained or lost $100. Bender has robbed him of $5.

Of course, it's highly illegal to use trojans to rob retail investors and game the stock market, so this story is not particularly realistic.

## To Learn More

In the [previous post](hft_apology.html) I pointed out these two books, [Trading & Exchanges](http://www.amazon.com/gp/product/0195144708/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=0195144708) and [Algorithmic Trading & DMA](http://www.amazon.com/gp/product/0956399207/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=0956399207) which will get you started learning the basics of exchanges. (Disclaimer: affiliate links.) In Hacker News comments, people asked about alternative market structures. Two of the more common ones are [Dark Pools](https://en.wikipedia.org/wiki/Dark_liquidity) and [Crossing Networks](https://en.wikipedia.org/wiki/Crossing_network). Also, there were many comments on the Flash Crash, so it's worthwhile linking to the [SEC Report](http://www.sec.gov/news/studies/2010/marketevents-report.pdf) on the topic.

Also, the [HN discussion](http://news.ycombinator.com/item?id=3894302) was excellent.

See also [part 3](hft_whats_broken.html) of this series.
