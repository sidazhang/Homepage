title: Models help you understand why you disagree
date: 2013-11-14 08:00
author: Chris Stucchio
tags: statistics, public policy, economics, monte carlo





In a [blog post yesterday](/blog/2013/basic_income_vs_basic_job.html), I advocated very strongly that rather than simply bloviating about political (and other) topics, we should instead build mathematical models to clearly express our thinking. There was a [lot of disagreement](https://news.ycombinator.com/item?id=6725096) on this. But quite a few people took the point to heart, and several actually decided to modify my model to illustrate their thinking. One in particular was [Jeremy Scheff](http://www.jeremyscheff.com/2013/11/basic-income-vs-basic-job/), who who [forked my model](https://gist.github.com/jdscheff/7457890) and came up with his own. His model has a very different answer.

I'm going to briefly address his model to demonstrate how models help us have a rational discussion.




Jeremy alters my model in several ways. His first tweak is to cut the direct costs of a Basic Income in half:

> In Chris's model, basic income is paid to everyone. It is also possible to have a system like progressive income tax, where it gradually phases out; in fact, fellow Rutgers alumnus Milton Friedman proposed to implement basic income through a negative income tax. So let's imagine some system like that and reduce the costs by 50% right off the bat.

He is very explicit about this. I copied this change over from his model to mine, and it has a dramatic effect - the cost of the Basic Income is in fact cut from about $3 trillion to $1.5 trillion when you do this.

This is a major point of disagreement between us. He believes this a realistic change that can be made, but I simply don't understand it. This is part of the reason we disagree. A major step towards the two of us agreeing with each other would be to evaluate this proposition - can it possibly work his way? If so, how? Is there data we can dig up to figure this out one way or the other?

A second place where his model disagrees with mine is that he believes a largeish number of people are not really disabled, and a Basic Income would induce them to engage in productive work:

> At this point, I want to add an effect that has been neglected. Chris treated the number of disabled adults as a constant, but that is [likely not true](http://apps.npr.org/unfit-for-work/). So let's conservatively say 2 million people currently on disability would start working if they got a basic income, likely at some not-so-great wage.

He includes a to account for this effect. I copied this term only over to my model, and reran it. It didn't change much of anything. This is also good to know. If Jeremy and I were bloviating on /r/politics, we could spend hours debating whether this effect is real or not. Because we have a model to work from, we now know that this effect simply doesn't matter much and won't spend much time debating it.

A third effect he thought of that I didn't is a productivity multiplier - essentially, he believes that a Basic Income might make working adults up to 20% more productive. I'm not convinced by this at all, but at least I understand what he thinks would happen. I copied this change only over to my model, and it also turns out to have a big effect. This is another point that is worth discussing.

The final place where we disagree is that he believes it to be quite possible that the people working basic jobs will actually be destructive - perhaps they buy into the [Broken Window fallacy](https://en.wikipedia.org/wiki/Parable_of_the_broken_window):

> Chris says it's worth somewhere between $0/hr and $7.25/hr, as otherwise they'd probably be working a minimum wage or higher job. Sounds reasonable enough, but there are also people who bring negative value to the table. These people would be forced to work, likely in some boring job they hate.

Altering this assumption might make the Basic Job up to $500B more expensive. It's not a small number, but it's not that big an issue either.

Jeremy was very [explicit](https://gist.github.com/jdscheff/7457890/revisions) about what he disagreed with me on. His explicitness allowed me to go diff by diff and figure out why we really disagree, and which disagreements actually matter. Now we can move forward. The main things we need to figure out are whether his alternate implementation of BI can cut the direct costs in half, and whether BI can really add 20% to worker productivity.

Presumably, treating us both as rational actors, once we find data to address these points, we will update our beliefs and come to agreement. And that's why models are important. They aren't magic oracles to tell us the answer, they are simply communication devices to make our thinking clear and calculation devices to prevent us from making logical errors (e.g. thinking that the `undisabled_cost_benefit` or that `jk_rowling()` will change the result).

Incidentally, I'm not really planning to try to change Jeremy's mind here because there is very little data to actually address the points where we disagree. I'm also scared of becoming a political blogger - among other things, the commenters on those blogs are all a bunch of idiots and I'm happy not to have them as readers. The ideology I'm pushing here is [epistemiological](https://en.wikipedia.org/wiki/Epistemology), not political. I have a far stronger desire to convert my readers into Bayesians than I do to convert them to my niche brand of capitalistic liberalism.

<div id="9ee729f6-96f9-4207-96c3-e60fa89b2e43"></div>

<script type="text/javascript">
(function(){window.BayesianWitch=window.BayesianWitch||{};window.BayesianWitch.variations=window.BayesianWitch.variations||{};window.BayesianWitch.variationNotifySuccess=window.BayesianWitch.variationNotifySuccess||{};window.BayesianWitch.variationGetSuccessData=window.BayesianWitch.variationGetSuccessData||{};var logCustom=function(data){if(window.BayesianWitch.customEventsFired)window.BayesianWitch.logCustom(data);else{window.BayesianWitch.customEvents=window.BayesianWitch.customEvents||[];window.BayesianWitch.customEvents.push(data)}};
var bandit={"bandit":{"uuid":"9ee729f6-96f9-4207-96c3-e60fa89b2e43","tag":"nov_14_link_to_bw","site":{"client":{"id":4,"uuid":"3f68e356-e7a8-4714-807f-d6ce31b659ff","name":"f3810710421dd621f6c9a28c7fe6ba"},"domain":"chrisstucchio.com","uuid":"cdfdf2e8-8937-4fa8-9a5b-7595f8b3487f"}},"variations":[{"tag":"call to action 1","isActive":true,"contentAndType":{"content":"<p> <b>Side note:</b> If you are interested in using Bayesian statistics to optimize your website, go check out <a href=\"http://www.bayesianwitch.com\">BayesianWitch</a>.</p>","content_type":"text/html"},"uuid":"7f048c5f-a0ca-4918-bc44-ce4b818fdfbf"},{"tag":"call to action 2","isActive":true,"contentAndType":{"content":"<p>Tangentially, I'm also building a startup that uses Bayesian statistics to <a href=\"http://www.bayesianwitch.com\">increase conversions on your website</a>.  If you are a web developer or growth hacker, go <a href=\"http://www.bayesianwitch.com\">sign up</a> for the beta. </p>","content_type":"text/html"},"uuid":"109358b6-8a6a-4f15-8e92-3d86ed0ca233"}]};var fallbackDelay=500;var maxAge=2592000;var banditDisplayed=false;var alreadySeenVersion=null;var cookieName="bwsn_"+bandit.bandit.uuid;var cookiePosition=document.cookie.indexOf(cookieName+"\x3d");if(cookiePosition>=0)alreadySeenVersion=document.cookie.substring(cookiePosition+cookieName.length+1,cookiePosition+cookieName.length+1+36);var displayBandit=function(displayVariation){if(banditDisplayed)return false;var divToInsert=document.getElementById(bandit.bandit.uuid);
if(!displayVariation){logCustom({"bd_var":bandit.bandit.uuid,"timeout":fallbackDelay});if(alreadySeenVersion)for(var i=0;i<bandit.variations;i++){if(bandit.variations[i].uuid==alreadySeenVersion)displayVariation=bandit.variations[i]}else displayVariation=bandit.variations[bandit.variations.length*Math.random()<<0]}divToInsert.innerHTML=displayVariation.contentAndType.content;divToInsert.setAttribute("bayesianwitch_bd_var",displayVariation.uuid);divToInsert.setAttribute("bayesianwitch_bd_suc","true");
logCustom({"bd_var":displayVariation.uuid});window.BayesianWitch.variationNotifySuccess[bandit.bandit.uuid]=function(){logCustom({"bd_var":displayVariation.uuid,"bd_suc":true})};window.BayesianWitch.variationGetSuccessData[bandit.bandit.uuid]=function(){return{"bd_var":displayVariation.uuid,"bd_suc":true}};banditDisplayed=true;document.cookie=cookieName+"\x3d"+displayVariation.uuid+"; Max-Age\x3d"+maxAge+";";return true};window.BayesianWitch.variations[bandit.bandit.uuid]=displayBandit;window.setTimeout(displayBandit,
fallbackDelay);var callback=document.createElement("script");callback.setAttribute("type","application/javascript");if(alreadySeenVersion)callback.setAttribute("src","http://162.243.65.45:8080/js_embed_snippet/"+bandit.bandit.uuid+"?version\x3d"+alreadySeenVersion);else callback.setAttribute("src","http://162.243.65.45:8080/js_embed_snippet/"+bandit.bandit.uuid);document.body.appendChild(callback)})();
</script>