---
layout: post
title:  "Teaching Machines to Complete Multiple Choices"
cover: null.png
date:   2016-11-26 01:52:00 +0800
categories: read scifi
---

Failed again. Read furthur for why and what I've learned from this project.

Not long ago I received an invitation to complete a deep learning model that can comprehend very long articles and do multiple choices. The dataset was selected from TOFEL, the longest article contains more than 6000 words. There is also a comprehensive question, for example: "How many times did the Denver defense force Newton into turnovers?" Then you choose the best one over four candidates.

I used DeepMind's [teaching machines to read and comprehend](https://github.com/thomasmesnard/DeepMind-Teaching-Machines-to-Read-and-Comprehend) for encoding context with question. It completes questions like: "\_ is running along the street." The sentence is twisted/copied from context.

The problem with this vanilla model is that it doesn't make a place to comprehend an answer. First it embeds context into a vector with the first word from query. It repeats the step until the end of query. The output is the most probable word with a lookup in vocabulary table. I wanted it because _(hopefully)_ it will encode article with question, so I can calculate cosine similarity on the encoded matrixes.

The next component I chose from [lstm-based deep learning models for nonfactoid answer selection](https://arxiv.org/pdf/1511.04108v4.pdf), which use cosine similarity on right and wrong answer as cost function. The minimal cosine distance shows the greatest possibility. One thing that doesn't make sense to me is that how to evaluate a candidate? I had different weights for both right and wrong answers, which one to use? I made a guess in my [code](https://github.com/KHN190/machine_compreh/blob/master/model.py#L86).

One huge diffrence between my model with DeepMind's is I used sentence as minimal input (since I need to calculate cosine similarity for them, words would not go). This must make impact on performace dramatically. Also, DeepMind used millions of reports, news, articles for training, while I only have no more than 30,000 context. Of course, multiple separated models also raise the sensitivity to initial state. I think an alignment model that shares weights between encoders should ease the problem. Here the encoders for right answer, wrong answer, and the encoder for context & question don't share information.

As far as I tested, the best result I've achieved is 35% correctness, comparing to 22~23% correctness for an untrained model. The code can be found on my [GitHub](https://github.com/KHN190/machine_compreh). But only after I was informed that there's a state-of-art model which performed 80% correctness I was shocked!

The model is Standford University's [bidirectional attention flow for machine comprehension](https://arxiv.org/pdf/1611.01603v3.pdf). They used over 400 x 400 size matrix for each word embedding! While we only have a single id for each word. And our model lacks deep-lstm decoder before output. Our model lacks attentive flow layer for encoding context & questions. They made two directions, from context to question, and from question to context, while we only have one encoder for each sentence from context to question.

Another thing I learned is that cosine similarity may not be the most proper way to handle complex features. Since in [this paper about SQUAD](https://arxiv.org/pdf/1606.05250v3.pdf), the simplest logistic regression classfier runs on 1800 million features! Think again how many parameters we have? 400 cells per layer, each model with 3 layers, and we have 3 components, that is poorly 3600.

Well, again I failed!
