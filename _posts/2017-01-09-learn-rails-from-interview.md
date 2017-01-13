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

## ActiveRecord 如何实现 has\_many 和 before\_do

belongs\_to 和 has\_many 等模型关系见 [Rails 5 代码](https://github.com/rails/rails/blob/5-0-stable/activerecord/lib/active_record/associations.rb)，其对应关系实际上为一个 Association 的类，定义 belongs\_to 时就将该 Association 实例化。这个实例的方法包括依赖关系的定义、可接受的关键字、回调方法和内存管理。

before\_do 是拓展自 ActiveSupport::Concern 的[回调函数](https://github.com/rails/rails/blob/5-0-stable/activerecord/lib/active_record/callbacks.rb#L258)，触发 before\_do 依赖于具体 action 方法中 @call\_back\_already\_called 的值，若值为 false 则设置其为 true 并调用回调函数。例如 before\_create 接受一个 symbol，在 create 方法之前则尝试使用 symbol 对应的回调方法。

transaction 中的 rollback 和 commit 方法和以上没有本质区别，只是通过 callback 函数进行额外检查。

## ActiveSupport::Concern

## Rack 的作用

## ActiveRecord 如何实现 Scope

scope 实现没看懂。定义的方法等同于 def，但通过 `scope :foo, :bar` 定义后可以用 `class.foo.bar` 调用，其中 foo 和 bar 的顺序任意互换。根据文档，scope 将返回一个 ActiveRecord::Relation 对象。一种比较有用的方法是覆盖 default_scope，而不是重写 all 方法来默认查找 deleted 为 false 的记录。

## Rails 启动的顺序

以 rails s 为例：

1. 执行 bin/rails
2. 引用 config/boot，加载 Gem 依赖
3. 引用 rails/commands，提供 rails 命令的别名和任务
4. 执行 command_tasks
5. [引用 action_pack 下的 action_dispatch，作为 rails 的路径组件]
6. 执行 rails/commands/server，将其实例化
7. [执行 lib/rack/server，将其实例化，完成 rack server 设置]
8. 执行 config/application，完成应用设置
9. 执行 rails::server#start
10. 引用 config/environment，决定生产/测试/开发环境
11. 引用 config/application，加载应用和命名空间
12. 引用 rails/all，包括 rails 的所有组件 (active_record, active_controller, action_view, etc.)
13. 执行 Rails.application.initialize!

[文档](http://guides.ruby-china.org/initialization.html).

## Rails 5 的新特性

## 常用的业务类 Gem

### Pundit

### Devise

### Omniauth

### ActsAsTagglableOn

## Rails Engine

引擎实际上就是一个半独立/完全独立的 Application，通过 Routing 挂载在应用上。Devise 就是一个 Rails 引擎。另外基于和 git 交互的 GitHub 风格的维基 [Gollum-Wiki](https://github.com/gollum/gollum) 也是一个引擎。一种应用场景是某天有一个临时活动，需要挂载一些临时的逻辑，你不想把它写入永久性的工程，所以你把它实现成一个引擎，暂时挂载在 route 上。一段时间后，活动结束，这个引擎又被取下来（改动最少的情况只有 routes.rb 中的一行）。另一种应用场景是，根据不同的生产环境，按需加载不同的插件。尤其是大型的 SaaS 平台，要适应不同的业务逻辑，不可能用同样的代码去应对所有环境，要提供灵活、精准的服务，就需要 Rails 引擎的技术支持。第二种应用需要在 Rack 层增加检测的逻辑。

## HTTP 协议中 request 和 response 包括什么内容？

默认讲述的是 HTTP/2.0，这个版本的协议在同一个 Connection 下使用 Stream 和实现于客户端/服务器的 Flow Control 来管理连接，数据则有不同类型的帧 (Frame) 表示。在启动 HTTP 连接的阶段，会发送特殊的 Header 和相应的 Settings Frame (可能为空)。服务器推送到客户端则会由服务器发送 Push_Promise Frame。而普通的请求是由客户端发送 Header 和 Data 到服务器，响应是从服务器到客户端，同样包括 Header 和 Data，帧类型取决于两者协议的内容。推送的响应和普通响应一致。Header 包括权重，Stream 依赖，Stream ID 等等数据。API 全称则是 Application Programming Interface，是实现于应用层的一种可编程协议，底层则是 HTTP/HTTPS 连接，API 数据作为 HTTP(S) 协议的数据发送，对应服务器上的服务则是，HTTP 请求由 Nginx 等生产服务器处理，API 请求由 Rails Application 处理。原生 HTTP 协议不包括任何状态和加密，可使用 Cookie 和 TLS 拓展协议提供相应服务。HTTP 连接的错误需要查询 Nginx 的日志，或者抓包分析。常用的 HTTP Header 项可以在 [Wikipedia 条目](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)上看到。

## 简述 Cookies 和 Session 的内容和作用

Cookies 和 Session 目的是解决 HTTP 连接无状态的问题，最早由 Netscape 发明于1994年。RFC 中存有 Cookies 的 [Spec 文档](https://tools.ietf.org/html/rfc6265)。Cookies 主要用于存储 Session ID 和其他非隐私信息。相关安全问题见文档后半部分，主要有 Cookie 拼接、重放攻击 (重用 Cookie) 和中间人攻击等。对 Cookie 内容加密之外，通常还需要 TLS 在传输层加密保证信道安全。Session 保存用户 ID、Token 等身份验证信息，以 Devise 为例，在 Session 中有 current_user 实例，在数据库中有随 Session 更新的 Secret_Token 和过期时间等信息。Cookie 和 HTML 中表单内嵌的 hidden field、meta 标签在功能上没有实质区别。

## 如何传输信息实现登录？

