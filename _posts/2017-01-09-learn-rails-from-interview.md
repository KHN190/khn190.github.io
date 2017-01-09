---
layout: post
title:  "Rails 面试标准答案（试行）"
cover: null.png
date:   2017-01-09 21:59:00 +0800
categories: ruby-on-rails
---

面试在技术问题上分为三种。一种倾向技术问题，一种倾向考察对业务逻辑的理解（架构），还有一种倾向了解你的项目经验。这里主要记录技术考察的第一类、对我来说的新问题。

## Ruby 常用的元编程方法

动态定义 method 的方法有 class\_eval, instance\_eval, define\_method 和 send；利用 block 构造匿名函数的方法有 select, each, map, inject 等。还有使用 Module 的方法进行元编程。主要遵循的原则是 D.R.Y，以均衡代码量和代码复杂度。

## Rails 如何实现 has\_many 和 before\_do

belongs\_to 和 has\_many 等模型关系见 [Rails 5 代码](https://github.com/rails/rails/blob/5-0-stable/activerecord/lib/active_record/associations.rb)，其对应关系实际上为一个 Association 的类，定义 belongs\_to 时就将该 Association 实例化。这个实例的方法包括依赖关系的定义、可接受的关键字、回调方法和内存管理。

before\_do 是拓展自 ActiveSupport::Concern 的[回调函数](https://github.com/rails/rails/blob/5-0-stable/activerecord/lib/active_record/callbacks.rb#L258)，触发 before\_do 依赖于具体 action 方法中 @call\_back\_already\_called 的值，若值为 false 则设置其为 true 并调用回调函数。例如 before\_create 接受一个 symbol，在 create 方法之前则尝试使用 symbol 对应的回调方法。

transaction 中的 rollback 和 commit 方法和以上没有本质区别，只是通过 callback 函数进行额外检查。

## ActiveSupport

## Rack 的作用、在 Rails 的角色

## Scope 在 ActiveRecord 的实现

scope 实现没看懂。定义的方法等同于 def，但通过 `scope :foo, :bar` 定义后可以用 `class.foo.bar` 调用，其中 foo 和 bar 的顺序任意互换。根据文档，scope 将返回一个 ActiveRecord::Relation 对象。一种比较有用的方法是覆盖 default_scope，而不是重写 all 方法来默认查找 deleted 为 false 的记录。

## Rails 启动的顺序

## Rails 5 的新特性

## 常用的实现业务的 Gem

### Pundit

### Devise

### ActsAsTagglableOn

## Rails Engine

引擎实际上就是一个半独立/完全独立的 Application，通过 Routing 挂载在应用上。Devise 就是一个 Rails 引擎。另外基于和 git 交互的 GitHub 风格的维基 [Gollum-Wiki](https://github.com/gollum/gollum) 也是一个引擎。一种应用场景是某天有一个临时活动，需要挂载一些临时的逻辑，你不想把它写入永久性的工程，所以你把它实现成一个引擎，暂时挂载在 route 上。一段时间后，活动结束，这个引擎又被取下来（改动最少的情况只有 routes.rb 中的一行）。另一种应用场景是，根据不同的生产环境，按需加载不同的插件。尤其是大型的 SaaS 平台，要适应不同的业务逻辑，不可能用同样的代码去应对所有环境，要提供灵活、精准的服务，就需要 Rails 引擎的技术支持。第二种应用需要在 Rack 层增加检测的逻辑。

## Rails 的依赖

## HTTP 协议中 request 和 response 包括什么内容？

## 简述 Cookie 和 Session 的内容和作用

## 如何传输信息实现登录？
