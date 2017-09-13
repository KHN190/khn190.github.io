---
layout: post
title:  "各色人类研究中心: Admixture 祖源算法简介"
cover: null.png
date:   2017-09-13 16:00:00 +0800
categories: gese
---

### I. Admixture

Admixture 算法是计算祖源的一种通用方法，其实现相当简单，在各色的数据上实际效果优于 LDA 和 MLP 分类器：

1. 使用一个人群的主要基因型 + frequency 作为特征，如 ：在位点 rs1000 上，东亚的频率是 0.89，北美的频率是 0.12
2. 预设一个初始化的各种群混合比例：东亚 0.33，北美 0.33，欧洲 0.33
3. 使用最大期望优化各种群混合比例：东亚 0.96，北美 0.02，欧洲 0.02

### II. 数据

Admixture 可使用多种不同的参照数据，如 decod 的 K12b，K7 等。其数字 7/12 代表分出多少个地区，基因频率数据则采样自全球各地。这样的数据有两个文件：

1. 一是基因位点 + minor Genotype + major Genotype，
2. 二是主要基因型按地区的频率

### III. E11计算器

以 E11 数据集为例：

1. E11.alleles 格式为：rs100000 A G
2. E11.11.F 格式为：0.948301 0.831291 0.706129 ...，分别对应非洲、欧洲、印度...等地的该位点基因频率

### IV. 实现

利用 Scipy 预先实现的 optimize 可以轻易实现最大期望算法：https://github.com/stevenliuyi/admix
