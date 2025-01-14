title: Subpenny rule elimination - roundup
date: 2012-05-25 10:00
author: Chris Stucchio
tags: economics, trading, high frequency trading, subpenny rule




Just thought it's worth pointing out a couple of responses to my post proposing the elimination of the subpenny rule.
{% endmark %}

[Alex Tabarrok](http://marginalrevolution.com/marginalrevolution/2012/05/should-stocks-trade-in-0001-increments.html) discusses this on Marginal Revolution. In particular, look at David Krych's comment criticizing my proposal - I haven't had time to fully evaluate it, but it seems insightful.

[Dealbreaker](http://dealbreaker.com/2012/05/reducing-high-frequency-trading-by-regulating-it-less/) also discusses the topic, and posts an excellent graph (which I'll show in a moment).

Apriori, if we think about the relationship between the bid/ask spread and the share price, we realize that in principle there simply shouldn't be one. Share price is just one arbitrary number (value of the company) divided by another (number of shares issued). The bid/asks spread should be determined solely by fundamental and technical factors, i.e. demand for liquidity, the amount of news that move the prices (more news should imply higher spreads), etc.

On the other hand, suppose the subpenny rule were forcing spreads to be higher than they need to be. The effect should be higher for low priced symbols, and should display a 1/price behavior. I.e., as measured in basis points, the price of liquidity pile up around $0.01/PRICE if the subpenny rule was forcing the spreads to be wider.

![Graph of spread vs price](/blog_media/2012/subpenny_rule/price_vs_spread.jpg)

Hey, look at that. Looks like the subpenny rule is raising prices considerably for low priced symbols.

Now given this quantitative evidence, I'll update my beliefs. I now believe the natural price for liquidity is in the 2-8 basis points range. The rents which HFT's are collecting are basically anything above that.

I'll quibble with Dealbreaker on one issue - I didn't intend to describe this in the "partisan and alarmist way" he describes - I generally think HFT is beneficial on balance (as I discussed [here](hft_apology2.html)). I just think that with some tweaks it could be even better.
