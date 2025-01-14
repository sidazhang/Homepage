title: Why Can't Gay Men Donate Blood? A Bayesian Analysis
date: 2016-06-16 10:00
author: Chris Stucchio
tags: statistics, bayesian statistics, false positives
nolinkback: true

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">It’s legal to buy an AR-15 assault rifle. It’s illegal for a gay man to donate blood to victims of the massacre. The world makes no sense.</p>&mdash; John Barcus (@johnrtworld) <a href="https://twitter.com/johnrtworld/status/742007515030786048">June 12, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

In the wake of an Islamic radical shooting up a bunch of gays, Americans have decided to engage in the feel-good ritual of donating blood. But in spite of this terror attack hitting the gay community especially hard, gays are still forbidden from participating. This has led to lots of folks questioning why.

The nominal answer is that anyone with a high HIV risk is forbidden from donating blood. But I'm going to address this question with Bayesian statistics, in order to properly quantify the risks.

## The question

The core question to be asked is the following. Given a pint of blood, what are the odds that it is contaminated with HIV?

We want to answer this question for a variety of circumstances. For instance, suppose the pint of blood came from a gay man, and the HIV test came up negative? I.e., what is `P(HIV|gay, negative test)`? What is `P(HIV | straight, positive test)`? Etc.

Once we calculate these quantities, we can begin to understand whether it is good policy to prevent gay men from donating.

## What's my prior?

The prior is the belief a person has before any evidence is gathered.

First of all, what is the probability that a randomly selected person has HIV? According to a quick google search, we [find the probability of an adult being infected](http://www.indexmundi.com/united_states/demographics_profile.html):

```
P(HIV) = 0.006
```

The next question to ask - what is the probability that a randomly selected *straight person*, or *gay person*, has HIV? I.e., what is `P(HIV|gay)`? I can't find any direct statistics on this. However, I've found the following information which we can use to compute a rough guesstimate. First, the [CDC says](http://www.cdc.gov/hiv/statistics/overview/) that 67% of new HIV infections are caused by Male to Male sexual contact. I'm going to infer from this that approximately 67% of people with HIV are men who have sex with men.

Second, the [CDC estimates](http://www.cdc.gov/nchs/data/nhsr/nhsr077.pdf) that approximately 1.8% of men are gay and 0.4% are bisexual. So in total, treating men as 50% of the population, we find that approximately 1.1% of the population of the US consists of men who have sex with men.

So now lets answer the question.

```
P(HIV|gay) = (0.6% of population) x (67% of HIV infections are gay) / (1.1% of total population) = 36%
P(HIV|not gay) = (0.6% of population) x (33% of HIV infections are not gay) / (98.9% of total population) = 0.2%
```

**Edit 2016/06/25:** Apparently only 19% of gay men have HIV, according to [this CDC link](http://www.cdc.gov/mmwr/preview/mmwrhtml/mm5937a2.htm?s_cid=mm5937a2_w) provided by Tom in the comments.

## Computing a posterior

Now lets address the question - suppose we run an HIV test on donated blood. What is the probability of infection after this?

According to the [Wikipedia article on HIV testing](https://en.wikipedia.org/wiki/Diagnosis_of_HIV/AIDS#Accuracy_of_HIV_testing), modern tests have a sensitivity of 99.7% and specificity of 98.5%.

What this means is that if a person is known to be infected, then the test has a 99.7% chance of reporting that they are infected. Similarly, if a person is not infected, then the test has a 98.5% chance of reporting a negative.

Now lets consider two people - one gay, one straight - who have donated blood. Their blood has been tested and the result is negative. What is the probability that the blood is infected?

We can answer this with Bayes rule.

```
P(HIV | straight, negative test) = P(negative test | HIV) P(HIV | straight) / P(negative test | straight)
    = 0.3% x 0.2% / P(negative test | straight)
```

The probability of a negative test is `P(negative test | HIV) P(HIV|straight) + P(negative test| no HIV) P(no HIV|straight)`, which is `0.3% x 0.2% + 98.5% x 99.8% = 98.3%`. Plugging this in yields:

```
P(HIV | straight, negative test) = 6.1e-6
```

Now lets repeat this calculation for a gay person.

```
P(HIV | gay, negative test) = P(negative test | HIV) P(HIV | gay) / P(negative test|gay)
    = 0.3% x 36% / (0.3% x 36% + 98.5% x 64%)
    = 0.17%
```

That's a lot higher.

**Edit 2016/06/25:** Using Tom's better estimate the actual number is 0.09%. So getting 2 pints of blood from 2 independent gay men with negative HIV results is roughly as dangerous as getting 1 pint of *untested* blood from a straight man.

## Base rates matter

Suppose a non-gay person donates blood. No HIV test is run on this blood. The risk of this blood having HIV is 0.2%.

Now suppose a gay person donates blood, and an HIV test turns up negative. The risk of this blood having HIV is only a little bit less than 0.2%.

In short, allowing gay people to donate blood is nearly as dangerous as letting straight people donate blood and then **not testing it!**

I guess this twitter meme is wrong. The world does make sense. It turns out the Red Cross isn't anti-gay - they just did the math and decided to protect people who receive donated blood.

The broader lesson here is that base rates (in this case, `P(HIV|gay)` and `P(HIV|straight)`) matter. A  test will have a lot more false negatives when applied to a highly risky subpopulation than when applied in general. As such, negative results for that subpopulation are a lot less useful than they are in general. You can't rely on test results alone, you need information about the inputs to the test also.

**P.S.** If anyone has more accurate numbers than what I've provided, please let me know. I can't see how the result will drastically change based on plausible variations in these numbers, but I do want to be as accurate as possible.
