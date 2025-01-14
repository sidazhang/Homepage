title: Statistical Mechanics has failed the market test or Noah Smith misses the point
date: 2014-01-13 21:00
author: Chris Stucchio
tags: economics, philosphy of science, microfoundations, macroeconomics





If statistical mechanics models work, why don't people use them to get rich?

When I studied physics in grad school, I was told something along these lines:

"Statistical mechanics models are useful because they pass the Atomic Critique (the belief that because the universe is made out of atoms, all physical laws must be derivable from the laws of atomic physics). If all you want to do is forecast heat transfer, you don't need to pass the Atomic Critique, so you don't need a statistical mechanics model."

This is usually what I hear academic physicists say when asked to explain the fact that essentially no one in the private sector uses statistical mechanics models. Private-sector people don't usually need to worry about non-continuous effects, so they don't need Atomic Critique-robust models.



The problem is, this argument is wrong. If you have a model that both A) satisfies the Atomic Critique and B) is a decent model of the physical world, you can design all sorts of interesting devices. This is because although any old continuum model can be used to make classical predictions of the world, you need Atomic-robust models to make good quantum-level forecasts.

Alright, I'm done with the snark. Before I continue, let me provide a little background and definition of the terms I'm using:

**Statistical mechanics** is the study of quantities like pressure and heat, and deriving them from microfoundations - at the undergrad level, this is typically classical physics. In Statistical Mechanics, air is modelled as a collection of lots of (classical) atoms, who's velocities are statistically distributed according to the law `exp(-m|v|^2 / T)`, with `T` being temperature. By contrast, in Thermodynamics, air is modelled as a continuous quantity and temperature is merely an intrinsic continuous property of all materials. Statistical mechanics is a highly accurate and extremely useful physical theory, and is considered to be one of the foundations of physics.

**DSGE (Dynamic Stochastic General Equlibrium) models** are a category of economic models which attempt to model macroeconomic quantities in terms of microfoundations. I.e., instead of starting with supply and demand curves as intrinsic continuous quantities devoid of meaning on the microeconomic level, you model `Supply(P) = # of people willing to buy at P`. Given a distribution of humans willing to spend money iin a certain way, you can derive the supply curve from the distribution of people.

You'll also be extremely hard pressed to find any engineers using it in practice. In practice, most engineers just use ordinary Thermodynamocs 201.

Actually I'm exaggerating - even Thermodynamics 201 has failed the market test. In practice, most engineers use Catalog Thermo 101. This consists of looking in the catalog for a heat sink with the right dimensions and which purports to dissipate enough heat. Then you slather on some thermal paste, and if the component overheats at the prototype stage, you blow some air across the heat sink.

Therefore, we can conclude that Thermodynamics and Statistical Mechanics are invalid.

Noah Smith [started](http://noahpinionblog.blogspot.co.uk/2014/01/the-most-damning-critique-of-dsge.html) this discussion, asking why the financial sector doesn't use DSGE models if they make accurate predictions. But the problem is that his critique proves too much - if it were valid, then we should also consider statistical mechanics models invalid. DSGE models satisfying the [Lucas Critique](http://en.wikipedia.org/wiki/Lucas_critique) occupy the same role in macroeconomics that statistical mechanics models occupy in thermodynamics.

The fact is that DSGE models, statistical mechanics models and continuous thermodynamic models are complicated. All microfoundations models are. Most of the time, that complexity doesn't buy you much in the way of accuracy.

Many of the major triumphs of statistical mechanics are proofs of theorems stating that thermodynamics works. Boltzman, for example, used statistical mechancis to prove that most of the quantities studied in thermodynamics will behave (with some fluctuations) exactly as thermodynamics predicts, at least for ordinary values of the parameters (e.g., temperature between 20K and 10,000K). To take a more recent (1970's) area of study, consider the [stability of matter](ftp://xvm-one-173.mit.edu/blahblah1.pdf). This is a set of theorems (by luminaries like Eliot Lieb, Barry Simon, Walter Thirring and Joel Lebowitz) which use a lot of difficult mathematics to prove that atomic physics does not predict the collapse of the universe. For obvious reasons, most engineers have never heard of these guys and don't use their models.

Does this make statistical mechanics inaccurate? Of course not. Bose and Einstein, for example, used statistical mechanics to predict a new state of matter - the [Bose-Einstein condensate](http://en.wikipedia.org/wiki/Bose%E2%80%93Einstein_condensate). This is a state of matter predicted by a quantum mechanical microfoundations model - at very low temperatures and pressures, Helium and certain other atoms behave in a completely different manner than an ordinary gas. Many other important physical phenomena, including [superconductivity](http://en.wikipedia.org/wiki/Superconductivity) and [nanoelectronics](http://en.wikipedia.org/wiki/Nanoelectronics) are heavily influenced by Statistical Mechanics.

The fact of the matter is that Statistical Mechanics provides us with a fundamental understanding of our world. It's used very rarely in the private sector because much simpler models are usually good enough. This doesn't mean microfoundations are useless, it simply means that simpler models are usually good enough.

DSGE models occupy the same role. They are complicated, and not always necessary. Very frequently simple correlations are good enough to make money with, particularly for modelling things like changes in interest rates (Noah Smith's suggested use of DSGE models).

But make no mistake - Noah Smith is simply wrong, and DSGE models *are* used in the private sector. Mathematical finance and modelling interest rates is the sexy new hotness, but fundamentals traders still exist. And fundamentals traders use DSGE models all the time, particularly when studying markets which don't fully exist yet. For example, consider any trader who bought Tesla for the long haul. There is minimal historical data on electric cars. There is minimal historical data on oil prices far higher than what they are now, on driving behavior in such a new regime, and on the buildout of infrastructure necessary for electric vehicles to be widely used (e.g., superchargers). Anyone attempting to model Tesla's fundamentals is doing so based primarily on a DSGE model, even if they don't necessarily use the term. The same is true for many venture capitalists, investors in new technologies, and even many old school fundamentals traders who are trying to predict how much money will flow into the midmarket of some retail sector.

If you want to predict the future of market sizes for new technologies, you simply must use microfoundations. There is no other way to do it.

*Related: [Chris House](http://orderstatistic.wordpress.com/2014/01/11/noah-smiths-not-so-damning-critique-of-dsge-models/) has similar thoughts.
