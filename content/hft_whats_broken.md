title: High Frequency Trading - What's broken and how to fix it
date: 2012-05-22 10:00
author: Chris Stucchio
tags: economics, trading, high frequency trading, subpenny rule
category: high frequency trading




In previous posts, I discussed the [basic mechanics](/blog/2012/hft_apology.html) and [social utility](/blog/2012/hft_apology2.html) of high frequency trading. Of particular import is that I characterized the latency arms race as socially wasteful. Now I'll discuss a policy proposal which might mitigate the harmful effects of the race for latency, while giving better prices to speculators.
{% endmark %}

## Why HFT's race each other

In the previous post, I explained that HFT's usually make their money by running market making strategies. This consists of selling liquidity to speculators at a price equal to the bid/ask spread.

A crucial ingredient of market making strategies is getting to the top of the order book:

    SELL(owner=Whiskey , min_price=10.02, quantity=200, time=9:45:00.000) <- Trades third
    SELL(owner=Echo, min_price=10.01, quantity=100, time=9:45:00.003) <- Trades second
    SELL(owner=Topher, min_price=10.01, quantity=200, time=9:45:00.001) <- Trades first
    ------
    BUY(owner=Sierra, max_price=10.00, quantity=100)

Because his order arrived earlier than all the others at the lowest price, Topher will be the first to trade.  Although she was first, Whiskey will be the last to trade since her order has a higher price. In general, the more you trade, the more money you make, so in this case Topher is lined up to make more money than Echo and Whiskey.

It might be the case that Echo is willing to offer a better price than Topher, say $10.008, but she is legally forbidden from doing so. [SEC Rule 612](http://www.sec.gov/divisions/marketreg/subpenny612faq.htm), or the Sub-Penny rule forbids this. So Topher gets to trade first merely by being fastest, not by offering the best price.

## The Subpenny rule - A minimum wage for HFT's

The subpenny rule essentially acts as a price floor on liquidity - it is illegal to sell liquidity at a price lower than $0.01. Echo is willing to offer a better deal, but the SEC forbids her from undercutting Topher. The net result is that whoever wishes to purchase liquidity must overpay by $0.002/share and Topher will collect all of this windfall.

As with a classical minimum wage, two parties are harmed - the purchaser (who must pay extra) and the lower priced seller (who is pushed out of the market).

Similarly, at prices higher than $0.01, it makes price movements lumpy - on a bid ask spread of $0.05, it is illegal for someone to enter the market at price $0.049 or $0.045. Thus, at any price point, speculators are forced to compete on latency rather than on price. Price competition is only possible if one market maker is willing to offer a price at least $0.01 better than another, which is often not the case.

When price competition is impossible, market makers must compete for business via other methods - in this case latency.

In other cases, price floors result in different sorts of competition. For example, before [Airline Deregulation](https://en.wikipedia.org/wiki/Airline_deregulation), airlines charged the same high prices and competed with each other on amenities.

**Update**: See my [followup post](subpenny_rule_responses.html) which shows a graph displaying the precise effect of the subpenny rule.

### To the swift go the rents

The term [Economic Rent](https://en.wikipedia.org/wiki/Economic_rent) designates the difference between the raw costs of everything needed to produce a good or service and the price of that good. In a competitive marketplace, rents are usually driven to zero.

The classic example of economic rents consists of a newly formed town in the American west. A landowner (call her Adelle) is the first to arrive. When Adelle arrives she builds a hotel. Latecomers to the town must pay rent to Adelle or be homeless, so Adelle is free to charge exorbitant prices (say $100/night). In the long run, as more people arrive and build competing hotels, Adelle is forced to lower her prices (to $50/night). The price difference between Adelle's price as a monopoly and her price in a competitive market (namely $100-$50=$50) is the economic rent she extracts.

If Adele deliberately engages in behavior designed to capture the rent (the extra $50/night), she is engaging in [Rent Seeking](https://en.wikipedia.org/wiki/Rent_seeking). Rent seeking refers to a strategy where a person expends resources to increase their share of existing wealth rather than to create new wealth. The example economics textbooks usually give is that Adelle might burn down the forest to make it more difficult for others to build competing hotels. A more contemporary strategy would be for her to convince the city council to use zoning and other regulations to keep competition out.

Other well known examples of rents and rent seeking are minimum wages and unionization (where workers capture rents), monopolies/oligopolies (e.g., the cable/phone duopoly on internet service, assorted taxi monopolies), various [occupational licensing](http://conversableeconomist.blogspot.com/2012/05/occupational-licensing-and-low-income.html) regimes, and corporate managers who avoid using more efficient processes in order to protect their job/headcount.

Because of the subpenny rule, whichever HFT is fastest will also collect economic rents. Since Topher was faster, he will collect a price of $0.01/share for liquidity even though Echo is willing to offer a price of only $0.008/share. As a result Topher collects a rent of $0.002/share. Thus, Topher's low latency trading system is a form of [Rent Seeking](https://en.wikipedia.org/wiki/Rent_seeking) - Topher is expending resources to increase his share of existing wealth rather than to create new wealth (e.g., by running a market making strategy in a security which has a shortage of liquidity).

As a preliminary estimate, we can guesstimate that the size of rent being collected is $0.005/share. This follows immediately by treating the best price a market maker would offer (assuming it were legal) as a uniformly distributed random variable on the interval [n x $0.01, (n+1) x $0.01] (for n an integer). Because of the prospect of collecting $0.005/share in rent, Topher is willing to make an investment which is as large as $0.0049/share in rent seeking. This is profitable for him even if no customers benefit.

## Eliminate the Subpenny Rule

For all of the 20'th century, stocks were priced in increments of $1/16 of a dollar, or $0.0625. In 2001, the [SEC](http://www.sec.gov/rules/other/decimalp.htm) ordered securities markets to decimalize - to reduce the pricing increment to $0.01 and to quote all prices in decimals. Decimalization has been considered successful - it has greatly reduced trading costs for speculators since many securities now have a bid/ask spread much lower than $0.0625. For example, at the time I'm writing this, the bid/ask on BAC (Bank of America) is $7.93/7.94.

**edit:** An anonymous commenter pointed out to me that NYSE actually traded in $1/8 until 1997, though CBOE might have been using $1/16 earlier.

Back under the sub-sixteenth rule, the spread could be *at best* $7.875/7.9375 (or $7.9375/8.00). Without the subpenny rule, it might be even tighter. This isn't guaranteed, of course, but it's certainly possible.

In the days when humans were manually trading securities on the floor of a trading pit, the minimum pricing increment served a useful purpose - it prevent a constant nitpicky bidding war among traders, where each trader attempted to outbid the other by pennies. On a physical trading floor, such activities would take a lot of human effort and the price would not be dramatically improved - keep in mind that this was an era when rebalancing your retirement portfolio could cost hundreds of dollars. Today this concern is no longer relevant since the majority of securities are traded by computer.

To minimize the rent seeking behavior of HFT's, I propose adding more decimal places. If we price securities in increments of $0.0001, then the value of low latency is at most $0.0001/share. This drastically reduces the value Topher gets out of speed, and makes him more likely to focus his efforts on other things. His network engineers might leave, and work on making Amazon or Facebook faster.

### Costs

As with any major change to market structure, the risks should always be considered. Fortunately, reducing the pricing increment is not an unprecedented change, so we can already see the consequences.

We already lowered the pricing increment once, from $0.0625 to $0.01, with no significant harm and considerable benefit. In currency markets, the minimum pricing increment is typically $0.0001. The bid/ask spread on EUR/USD right now is $1.3027/1.3030, and the EUR/AUD spread is actually quite high right now at $1.2805/1.2815. In equities, the Indian shares markets ([Bombay stock exchange](http://www.bseindia.com/) and [National Stock Exchange](http://www.nseindia.com)) are already ahead of the curve. Depending on the price of a security, the minimum pricing increment is 1-5 paise, or $0.01-0.05 rupees. Since 1 rupee is about $0.02, that's a minimum pricing increment of about $0.001.

Based on this, we can guesstimate that the risks of eliminating the subpenny rule are low. We've done it before and there have been few/no measurable harms as a result.

I've heard a couple more criticisms of this idea which are worth bringing up. One is that measured volatility might increase. This criticism is true, but in my view is not worth worrying about. With a subpenny rule, a trader has no incentive to make price improvements of 1/1000 of a cent. Without a subpenny rule, he does. The net result is that more price improvements will be made, and volatility will increase. However, this small increase in volatility is not a significant risk to the markets - big jumps are a worry, small jumps are merely noise. Volatility also increased after decimalization, but penny-sized price fluctuations are a small price to pay compared to 1/16 spreads.

The other criticism is that it might be more difficult for traders to evaluate the markets. Instead of merely looking at the number of shares available at $10.00, a trader might need to add up the number of shares available at $10.0000, $10.0003, $10.0015 and $10.0029. In my view this will merely require minor modifications to behavior and the tools available - for example, trading programs might merely display a price of "no worse than $10.0029" which aggregates the prices between $10.0000 and $10.0029, and traders will need to look at cumulative price views rather than ladder views.

### Benefits

The first benefit is that the bid ask spread is likely to narrow (probably by about half a penny), thus making it cheaper and easier for speculators to ply their trade. In [part 2](hft_apology2.html) of this series, I explained how this benefits price discovery (and presumably society in general). Realistically, this is probably not a major benefit.

A more significant benefit would be diverting labor from the latency arms race to more productive purposes. When I worked in HFT, my coworkers were extremely smart people, capable of doing many valuable things. I don't believe the best use of such people's labor is in reducing latency to make one HFT trade faster than another. While I don't generally like to second guess a free market, I believe in this specific case the market mechanics line up in such a way as to make the most socially optimal option not individually optimal.

To describe it in arbitrary numbers, if 50% of the time of HFTs is spent reducing latency, then I believe the socially optimal situation would be to have 50% fewer high frequency traders focusing 100% of their time on pricing strategies. The other traders would then be able to focus their talent on other problems, either in the field of finance or outside. As recent events at J.P. Morgan demonstrate, more talent is needed in risk management. Many technology companies creating valuable products are also starved of talent.

It would even be beneficial to redistribute such people within the field. Many markets have fairly high spreads, for example the Brazilian and Indian stock markets. Instead of fighting over priority in US markets, some HFTs might instead focus their efforts on reducing the spread in Indian, Brazilian and other less developed markets.

### Alternatives

Many have also proposed a financial transaction tax, which I think is excessive - in addition to reducing the effort devoted to HFT, it will also increase the spread. On Hacker News, btilly provides another [excellent suggestion](http://news.ycombinator.com/item?id=3895296) as to how one might tweak market mechanics to reduce rent seeking by HFTs. I still favor eliminating the subpenny rule since it's a much smaller change which has been well tested, but of all the suggestions I've seen his is by far the best.

## To learn more

As in the last post, I linked to two useful books, [Trading & Exchanges](http://www.amazon.com/gp/product/0195144708/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=0195144708) and [Algorithmic Trading & DMA](http://www.amazon.com/gp/product/0956399207/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=0956399207) which will get you started learning the basics of exchanges. (Disclaimer: affiliate links.) See also [part 1](hft_apology.html) and [part 2](hft_apology2.html) of this series.

In the comments on several of these articles, there was quite a bit of discussion of weird trading patterns and alleged DOS attacks on the exchanges (theories promulgated primarily by Nanex and ZeroHedge). In future posts I'll give my theories as to what causes these (sadly, my theories are far more mundane than those of Nanex).

Hat tip: Alex Tabarrok had [similar ideas](http://marginalrevolution.com/marginalrevolution/2009/08/high-speed-trading-swimming.html).
