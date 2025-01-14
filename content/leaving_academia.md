title: How to leave academia
date: 2012-04-01 10:00
author: Chris Stucchio
tags: academia, job search




So you've decided to leave academia, or are perhaps just thinking about doing so. Welcome to the dark side. I made the transition a few years ago, and since then I've gotten a number of questions about how to do it. Hence, this article.


First of all, I'm going to assume you are looking for a technical job, and I'm also going to assume you are coming from a technical field. When I left my postdoc I focused on finding jobs in technology and in finance.

A number of people seem happy about leaving academia and doing consulting (e.g. McKinsey), but I don't know anything so I won't comment. Also, if your degree is in English, the best I can do is point you [here](http://jobs.starbucks.com/).

## Building your Skillset

Good news - you've already got a solid quantitative background. This opens up a lot of doors for you. Now you just need to focus on building up some practical skills. They are a lot easier than algebraic geometry or solid state physics, but they are necessary nonetheless.

### Programming

Most jobs open to quantitative people these days involve programming, so it's strongly beneficial for you to learn it.

To begin with, go read [Software Carpentry](http://software-carpentry.org/4_0/). Right now. This document covers all the basic practicalities of dealing with code. Even if you plan to stay in academia, you should go read it, particularly if you plan to be a computational scientist. I'd differ from software carpentry in only one case: use git instead of subverson. A [tutorial](http://help.github.com/linux-set-up-git/) on git can be found [here](http://help.github.com/linux-set-up-git/).

As far as programming languages to learn, I'd suggest [Python](http://www.python.org) to start with. This is because python has the excellent [scientific Python](http://www.scipy.org/) and [matplotlib](http://matplotlib.sourceforge.net/) libraries, which matlab like functionality in a language suitable for use at work. You should also learn C++ - it's fairly widely used in quantitative jobs, particularly in finance. It's also very common for interviewers to ask C++ questions even if the job uses another language. I found the book [Practical C++ Programming](http://www.amazon.com/gp/product/0596004192/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=0596004192) helpful, at least to reach a practical level.

Frederick Ross added this suggestion:
>For C++, I have yet to find a better first book than ['Accelerated C++' by Koenig and Moo](http://www.amazon.com/gp/product/020170353X/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=020170353X). Lots of good books after that, but that one is one of the few textbooks in any field that I would feel enthusiastic handing to a beginner.

The key fact to note about coding is that the goals are different in academia and out. In academia, the end product is a publication and your code needs to work only once. After the important graph/image is generated and included in latex, you are finished. Outside academia the end product is usually software and it needs to work reliably. This involves a very different coding style - for example, instead of observing garbage output and rerunning the program, your program needs to automatically detect errors and either fix them or notify the user. Learn to develop this coding style early, it will help you later on.

It's important to learn about algorithms. One of the classic books is [Introduction to Algorithms](http://www.amazon.com/gp/product/0262033844/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0262033844) (it's the one on my desk right now), but there are many more. Also, algorithm questions come up often on job interviews.

Frederick Ross also suggested
>For algorithms, [Skiena's 'The Algorithm Design Manual'](http://www.amazon.com/gp/product/1849967202/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=1849967202) is a bit quicker to get up to speed than Cormen (though Cormen is gorgeous). I don't feel as strongly about this.

Another important skill is web development, for two reasons. One is that the web is becoming a universal front end to computers. The other is that if you write a cool webapp, you can show it off to potential employers. I'd recommend learning [Django](https://www.djangoproject.com/), due solely to the fact that you are already going to learn Python in order to use Scipy. The free [Django Book](http://djangobook.com/en/2.0/) is a great place to get started.

If you don't like Python, [Ruby on Rails](http://rubyonrails.org/) is another option. From what I can see, you can't go wrong choosing either Rails or Django. The only reason I suggest Python over Ruby is that Ruby doesn't have anything comparable to Scipy.

#### Focus on Practicalities

A lot of academics focus primarily on core concepts of computing. This is a very good idea, but you must not neglect the practical aspects.

To find a list of phone numbers in a file, a smart man writes observes that phone numbers form a regular language and writes an optimized finite state automaton in C++. A wise man knows that `grep` already exists, and types:

    grep "[0-9]\{3\}[-]\?[0-9]\{3\}[-]\?[0-9]\{4\}" filename.txt

If I run into a smart man on a job interview, I'll tell him to reapply when he becomes wise. Many of the hard problems in computing are already solved. In both work and job interviews, it's very important not to reinvent the wheel.

#### Data Science

The most accessible job to a typical physicist cum programmer goes by the job title *Data Scientist*. It's also one of the more high paying jobs in technology. Probably the best way to describe the job is "be the programmer who understands regression and confidence intervals".

Nowadays, businesses generate a lot of data. A single user browsing a website can generate 20-30 data points in a few minutes - click data, scroll data, pause data (the user paused to look at something), etc. The job of the data scientist is to look for patterns in this data and come up with useful ways of explaining it to technical and non-technical people. For example, at [Styloot](http://styloot.com), I analyzed data to determine which properties of a dress are considered important by women (and used this to build a search engine for clothing).

To do this job you need to be a good programmer. You also need some basic statistics and machine learning skills. The classic introduction to machine learning is [Pattern Recognition and Machine Learning](http://www.amazon.com/gp/product/0387310738/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0387310738), by Bishop. A basic intro to statistics is [Data Analysis: A Bayesian Tutorial](http://www.amazon.com/gp/product/0198568320/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=0198568320) by Sivia and Skilling, a more advanced intro is [Bayesian Data Analysis](http://www.amazon.com/gp/product/158488388X/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=158488388X) by Gelman. Of course, whatever you used in grad school is probably also sufficient.

For small data sets (2-8GB) you can write code using python and [numpy](http://numpy.scipy.org/), and this will cover many important applications. For larger data sets, [Hadoop](http://hadoop.apache.org/) seems to be the standard tool. Hadoop is quite heavyweight, however, so don't start off with it.

### Finance

The starting point for learning finance is learning the basics of pricing derivatives. The classic starting point is [Wilmott's Book](http://www.amazon.com/gp/product/0470319585/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=0470319585). Another somewhat more sophisticated book is [An Introduction to the Mathematics of Financial Derivatives](http://www.amazon.com/gp/product/0125153929/ref=as_li_ss_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=0125153929). The key takeaways from these books are Gaussian models, Black-Scholes, PDE models and Monte-Carlo simulation.

#### Finance Interviews

Interviewing at financial institutions is a skill in itself and it's one you need to get good at. For the most part, you can expect to be asked basic programming questions, basic questions on quantitative finance, as well as brainteasers involving basic probability:

> Consider the integers from [0,1000]. Suppose a particle starts at position n. At discrete instants of time t=0,1,2,..., the particle moves up or down with p=0.5. What is the probability that the particle reaches 0 before t=1000?

> 100 passengers have queued up to board a plane, and are lined up in the order of the seats on the plane (n=1..100). However, the first person lost his ticket and selects a random seat. The remaining passengers will occupy their assigned seat if it is available, or a random seat otherwise. What is the probability that passenger 100 sits in seat 100?

The source of hundreds of such brainteasers is [Heard on the Street](http://www.amazon.com/gp/product/0970055277/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=christuc-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0970055277). In addition to giving great interview practice, many lazy/busy interviewers take questions directly from this book.

The best way to get good at interviews is to practice interviewing. I recommend that you start doing finance interviews a year or two before you graduate, just so you have some under your belt and are good at them.

### Other Niches

In addition to general quant development and finance, there are a variety of other niches where quant Ph.D.'s do well.

If you are American, many military or other government contractors will hire you for physics and behavioral modelling. Typical jobs here might involve modelling the spread of disease, radio interference between different communication devices, cryptography or game theory. I have no firsthand experience, but I'm told these jobs are usually very stable, very bureaucratic and political, and are typically located just outside major metro areas (the sole exception being DC). One notable exception is [Palantir](http://www.palantir.com/) which allegedly behaves a lot like a tech company, though a significant fraction of the engineers they hire wind up working in sales jobs.

Another niche is biostatistics. I don't know much about it, but people with a solid stats background often wind up there.

There are also a variety of small tech companies selling specific scientific products to larger institutions. These will often be things like face recognition, LIDAR systems, sensor networks, statistical software, telecom or environmental modelling. The culture at these places varies widely - some behave like Valley startups, others act like government contractors.

## Finding a Job

First of all, don't just send out your academic CV. Shorten it to a resume. The resume shouldn't be more than 1-2 pages long. It should focus on your skills and what you've done and can do. Your education should probably be at the top, and your publications/talks should probably be last. After you've had 1-2 jobs, your experience should be at the top, followed by skills, followed by education, and maybe you'll still bother to include publications. Here is my old [academic CV](/work/cv_stucchio.pdf) and my current [resume](/work/resume.pdf).

If you are looking for work in a programming job, it's very helpful to build a portfolio. A [github](https://github.com) account with a few projects is helpful, as is a publicly visible webapp. Some interesting projects and a well populated github will get you far more callbacks than a resume. I've gotten quite a few job interviews without ever writing a resume, based solely on the strength of publicly visible projects.

Another important point is how to market yourself. You want to focus on the value created rather than the specific methods. As if often the case, Patrick McKenzie wrote a great [blog post](http://www.kalzumeus.com/2011/10/28/dont-call-yourself-a-programmer/) on this topic.

In finance, pedigree is very important. If you went to Harvard for undergrad and UCLA for your Ph.D., emphasize your Harvard degree. Signalling is the name of the game here, and a github will be less helpful than in technology.

### Interviewing - it's a skill

In technology, just convince the interviewer that you are smart and can get things done. Convincing them of cultural fit is also a good thing - if you want documentation and procedure at a startup, you won't be very happy, and neither will anyone else.

One significant tip, particularly for phone interviews - don't go silent. Tell me what you are thinking even if it's wrong. It's much better to sound like you are thinking than like you've given up.

Apart from that, I'll just link to good blog posts on the topic:

[Get that Job at Google](http://steve-yegge.blogspot.com/2008/03/get-that-job-at-google.html)

[How to take control of your job interview](http://raganwald.posterous.com/how-to-take-control-of-your-job-interview)

From the other side - advice given to interviewers:

[My Favorite Interview Question](http://weblog.raganwald.com/2006/06/my-favourite-interview-question.html)

### Networking

It's important. I suck at it. The gist is to get out there, meet people, and try to help them out.

After posting this, I received some helpful info from Tim Hsiau. Both links look more or less spot on to me:

>For networking, local meetups on topics people care about may exist.
>Personally, I've found that talking to former high school classmates
>was an excellent way of networking, but I guess YMMV depending on the
>quality of the cohort... In some ways, I think it's a bit like dating.
> You have to find out where the decision makers/girls are, and then
>demonstrate value to get them to pay attention.
>
>This blog might have some interesting info, although it might be aimed
>towards more established professionals
>[http://www.socalcto.com/2009/10/visible-networking.html](http://www.socalcto.com/2009/10/visible-networking.html)
>[http://www.socalcto.com/2009/10/marketing-startups-and-networking-in.html](http://www.socalcto.com/2009/10/marketing-startups-and-networking-in.html)

### Salary Negotiation

Just go read Patrick McKenzie's excellent [blog post](http://www.kalzumeus.com/2012/01/23/salary-negotiation/?utm_source=rss&utm_medium=rss&utm_campaign=salary-negotiation) about this topic. I have nothing to add.

(I'm also sick of linking to him, but his blog is great.)

### Do you even want this job?

Make sure you evaluate whether your workplace will be a good fit. Ask yourself - do you want to come here every day and work? If you don't want to come to work, does the money make the job worthwhile? There is nothing wrong with chasing a $200k paycheck. But if you are doing work you dislike for the money, understand that and be aware of the tradeoffs you are making.

### Desperation Consultants

There is a group of people to be wary of, what I call the "desperation consultants".

A lot of graduate students fail to find a postdoc or teaching position - perhaps as many as half. They find themselves feeling dejected, perhaps with low self esteem, and a bit desperate for some sort of work. At this point, the "desperation consultants" swoop in. These will typically be third rate consulting shops, occasionally with a name that alludes to a prestigious university or financial firm (e.g., [J.T. Marlin](https://en.wikipedia.org/wiki/Boiler_Room_(film))). They will offer the dejected academic a third rate salary often using hardball negotiating tactics (e.g., "tell me your salary requirements or I'm hanging up the phone").

Use them for interview practice. Don't work for them.

Pretty much any serious employer will be offer well north of $100k to quant Ph.D.s who can program. (Early stage technology startups might be a bit lower, but will also offer equity.) The desperation consultants will probably be in the $60-80k neighborhood, sometimes lower. Obvious disclaimer: this number applies mainly to the NYC and SV area, and holds true for the 2008-2012 neighborhood. If you are looking for work in Texas or Nebraska, adjust downward.

## What it's actually like

Once you actually get a job, things are a bit different. In academia, half the goal is to show how smart you are. The end goal is to have a grand unified theory of whatever, which is simple, elegant and beautiful. The problems you solve should be as general as possible. Code is written to get a single graph, attach it to the paper, and submit. The end product is publications and grants.

In the outside world, the goal is to give customers something in return for money. This won't necessarily be a testament to your genius - the customers don't care if you use cheap tricks to avoid solving the fundamental problem. You can build [Strong AI](https://en.wikipedia.org/wiki/Strong_AI) or just run a call center in India - your customers don't care about those details, they just care about you solving their problems. Cheap hacks are just as good as grand theorems.

Much like in academia, some of the work you do will be the fun work you signed up for, and some of it will be boring grunt work. As a postdoc, I found teaching and writing papers to be boring. As a startup CTO, I find writing web scrapers and building crud apps to be similarly boring. You can't avoid this, all you can do is change the form it takes.

One of the biggest differences between academia and industry is the ranking system. Academia is a tournament - either you make it to the top or you are nobody. Once you prove the full theorem, there is little interest in special cases. In industry there is plenty of room for B-players and there is lots of interest in yet another CRUD app or a new application of linear regression.

Further discussion on this topic can be found on [Hacker News](http://news.ycombinator.com/item?id=3802259).

In particular, note [eli_gottlieb's post](http://news.ycombinator.com/item?id=3804039) discussing why he *doesn't* like working in industry. Definitely required reading.

Disclaimer: Links to books are affiliate links. If you click the link and buy the book, I'll get a buck or two. You can tweak the urlparams if you want to change this. To keep myself honest, I restricted my list of books to those I either owned or borrowed myself unless otherwise noted.
