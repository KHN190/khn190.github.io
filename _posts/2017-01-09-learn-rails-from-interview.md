---
layout: post
title:  "Rails 面试标准答案（试行）"
cover: null.png
date:   2017-01-09 21:59:00 +0800
categories: ruby-on-rails
---

面试在技术问题上分为三种。一种倾向技术问题，一种倾向考察对业务逻辑的理解（架构），还有一种倾向了解你的项目经验。这里主要记录技术考察的第一类、对我来说的新问题。

我发现这篇 Dropbox 的面试官关于 Product Manager 面试的谈话非常有意思：[Find, Vet and Close the Best Product Managers](http://firstround.com/review/find-vet-and-close-the-best-product-managers-heres-how/)

## Ruby 常用的元编程方法

动态定义 method 的方法有 class\_eval, instance\_eval, define\_method 和 send；利用 block 构造匿名函数的方法有 select, each, map, inject 等。还有使用 Module 的方法进行元编程。主要遵循的原则是 D.R.Y，以均衡代码量和代码复杂度。

## ActiveRecord 如何实现 has\_many

belongs\_to 和 has\_many 其对应关系实际上为一个 Association 类，定义 belongs\_to 时将该 Association 实例化。这个实例此时完成的工作包括，依赖关系的定义、可接受的关键字、回调方法和内存管理。模型关系见 [Rails 5 代码](https://github.com/rails/rails/blob/5-0-stable/activerecord/lib/active_record/associations.rb)。

## ActionController 如何实现 before\_action

before\_action 是由 ActiveSupport::Concern 接口拓展的[回调函数](https://github.com/rails/rails/blob/5-0-stable/activerecord/lib/active_record/callbacks.rb#L258)，触发 before\_action 依赖于具体 action 方法中 @call\_back\_already\_called 的值，若值为 false 则设置其为 true 并调用回调函数。例如 before\_create 接受一个 symbol，在 create 方法之前则尝试使用 symbol 对应的回调方法。调用一次 before\_action 就在 actions 之前[插入一个回调](http://api.rubyonrails.org/classes/AbstractController/Callbacks/ClassMethods.html#method-i-append_before_action)。

transaction 中的 rollback 和 commit 方法和上述内容没有本质区别，只是通过回调函数进行额外检查。

## ActiveSupport::Concern

实为 Mixin 方法。为 Rails 框架下的 Module 提供了统一的接口。类似的有对 Hash 的拓展 [Hashie](https://github.com/intridea/hashie)。

1. [API 文档](http://api.rubyonrails.org/classes/ActiveSupport/Concern.html)
2. [Blog: ActiveSupport Digression](http://www.zhubert.com/blog/2013/06/13/activesupport-concern-digression/)
3. [Blog: Put Chubby Models on a Diet With ActiveSupport](https://signalvnoise.com/posts/3372-put-chubby-models-on-a-diet-with-concerns)
4. [ActiveSupport for All Obejcts & Model Extensions & Class Extensions & Ruby Types](http://guides.rubyonrails.org/active_support_core_extensions.html)

## Rack 的作用

Rack 官方文档说，`provides a minimal interface between webservers that support Ruby and Ruby frameworks`，它实际上就是 HTTP 协议的一个标准库。针对 GitHub 的 API 协议有 Omniauth-Github，在 Python 中有 Tornado 服务器，Rack 同样为 HTTP 协议提供了解析头部、数据的 Ruby 标准方法。例如 Rack 源代码中 [Request](https://github.com/rack/rack/blob/master/lib/rack/request.rb) 就定义了 Rack 对 HTTP 响应的处理。和 Omniauth 这类 API client 的区别是，HTTP 协议是传输层的，而 API 是应用层的。且 Omniauth 原则上只提供客户端，而 Rack 同时定义了服务端。

Rack 另外还提供了 Middleware Chain，用以搭建 Rack App，比如自定义使用 Warden 作为身份验证的中间件：

```ruby
failure_app = Proc.new { |env| ['401', {'Content-Type' => 'text/html'}, ["UNAUTHORIZED"]] }

app = Rack::Builder.new do
  use Rack::Session::Cookie, secret: "MY_SECRET"

  use Warden::Manager do |manager|
    manager.default_strategies :password, :basic
    manager.failure_app = failure_app
  end
end

run app
```

_*中间件*：指一种用于帮助，但并没有直接参与执行某一程序任务的组件/库。典型的例子是日志记录，身份验证和其他以层级方式存在的组件。(Wikipedia)_

在应用中，中间件的概念直观得多。我们来看 Grape 中的中间件：

```ruby
# Example config.ru

require 'sinatra'
require 'grape'

class API < Grape::API
  get :hello do
    { hello: 'world' }
  end
end

class Web < Sinatra::Base
  get '/' do
    'Hello world.'
  end
end

use Rack::Session::Cookie # a middleware
run Rack::Cascade.new [API, Web] # run grape alongside with sinatra
```

Rack 值得一提的还有 Handler，其标准库中提供了 WEBrick, Thin, CGI 等服务器，而其他支持 Rack 的服务器包括 [Puma](https://github.com/puma/puma/blob/master/lib/rack/handler/puma.rb) 等。按常理来说，Rack 只提供 HTTP 必要的标准化方法，也就是仅定义一个协议的 Ruby 标准库，不应该包括服务器 (handler)。可以看出 Rack 做了更多工作。

1. [RailsCasts: The Rails Initialization Process](http://railscasts-china.com/episodes/the-rails-initialization-process-by-kenshin54)
2. [RubyChina: Why we need Rack?](https://ruby-china.org/topics/21517)
3. [Rails on Rack](http://guides.rubyonrails.org/rails_on_rack.html)
4. [RailsCasts: Rack Middleware](http://railscasts.com/episodes/151-rack-middleware)
5. [Stackoverflow: What is Rack Middleware?](http://stackoverflow.com/questions/2256569/what-is-rack-middleware)
6. [Writing Rails Middleware](http://ieftimov.com/writing-rails-middleware)
7. [Understanding Rack Apps and Middleware](https://blog.engineyard.com/2015/understanding-rack-apps-and-middleware)

## ActiveRecord 如何实现 Scope

scope 实现没看懂。定义的方法等同于 def，但通过 `scope :foo, :bar` 定义后可以用 `class.foo.bar` 调用，其中 foo 和 bar 的顺序任意互换。根据文档，scope 将返回一个 ActiveRecord::Relation 对象。一种比较有用的方法是覆盖 default_scope，而不是重写 all 方法来默认查找 deleted 为 false 的记录。

## Rails 启动的顺序

简单来说先检查依赖，加载代码，再启动 Rack，最终按组件加载后，启动应用。以 rails s 为例：

1. 执行 bin/rails
2. 引用 config/boot，检查 Gem 依赖
3. 引用 rails/commands，提供 rails 命令的别名和任务
4. 执行 command_tasks
5. [引用 action_pack 下的 action_dispatch，作为 rails 的路径组件，完成各种代码加载]
6. 执行 rails/commands/server，将其实例化
7. [执行 lib/rack/server，将其实例化，完成 rack server 设置]
8. 执行 config/application，完成应用设置
9. 执行 rails::server#start
10. 引用 config/environment，决定生产/测试/开发环境
11. 引用 config/application，加载应用和命名空间
12. 引用 rails/all，包括 rails 的所有组件 (active_record, active_controller, action_view, etc.)
13. 执行 Rails.application.initialize!

见 [Rails Guide](http://guides.ruby-china.org/initialization.html). 整个启动过程和 Railtie 和 Rack 密不可分，因为 Railtie 是处理各组件自身载入流程的，它独立于应用；而通过 Rack 搭建的应用则通过 Railtie 定义的 hook 方法完成检测和启动。Hook，意思是抽象类中操作子类方法的一种方法，比如：

```ruby
class Foo
  def new
    if test_ok # test_ok is a hook method
      build_model
    end
  end
end
```

Devise 中的 @resource\_name 也是一个 hook，所以可以指定任意一个资源类型作为 User 模型。

## Rails Engine

引擎就是一个半独立/完全独立的 Application。Rails::Application 直接继承自 Rails::Engine，例如 Devise 就是一个 Rails 引擎，另外基于 git 的维基 [Gollum-Wiki](https://github.com/gollum/gollum) 也是一个引擎。实际应用中，比如在线商城某天有一个临时活动，因为不想把它写入永久性的工程，所以就实现成一个引擎，暂时挂载在 routes 上。一段时间后，活动结束，这个引擎又被取下来（改动最少的情况只有 routes.rb 中的一行）。比如我曾经需要在一个商城中挂载一个福袋页面，我将逻辑实现在另一个完整的应用中，通过 Nginx 的端口转发和 Rails 路由设置实现分流。另一种应用场景是，根据不同的生产环境，按需加载不同的插件。比如大型的 SaaS 平台，要适应不同的业务逻辑，不可能用同样的代码去应对所有环境，要提供灵活、精准的服务，就需要 Rails 引擎的技术支持，通过 Rack 任务去检测环境，进行加载。第三种和 Devise 一样，需要和数据库/视图交互，提供自己的一套完整的业务逻辑。Engine 拥有和宿主相独立的中间件。

[创建 Rails 插件](http://guides.rubyonrails.org/plugins.html)。

## Railties

Railtie 用于拓展 Rails 框架，构成核心组件。Rails 的主要组件 ActiveRecord，ActionController，ActionView，ActiveRecord，ActionMailer 都继承自 Railtie，各自负责自己的载入流程，而 Rails::Application 使用 Proxy 来和 Railtie 交互，让主要元件可以抽换，同时可以切入 Rails lifecycle，自定义启动流程。而 Rails::Engine 就是一个定义了 initializer 的 Railtie。

在需要检测启动时的条件 (使用 hook)、Rake 任务的时候，就需要 Railtie.

1. [Railitie 和 Plugin 系统](https://ihower.tw/blog/archives/4873)
2. [Intro to Railities](http://wangjohn.github.io/railties/rails/gsoc/2013/07/10/introduction-to-railties.html)
3. [Source code](https://github.com/rails/rails/blob/master/railties/lib/rails/railtie.rb)
4. [Extending Rails 3 with Railties](https://blog.engineyard.com/2010/extending-rails-3-with-railties)

## HTTP 协议中 request 和 response 包括什么内容？

默认讲述的是 HTTP/2.0，[这个版本的协议](https://tools.ietf.org/html/rfc7540)在同一个 Connection 下使用 Stream 和实现于客户端/服务器的 Flow Control 来管理连接，数据则有不同类型的帧 (Frame) 表示。在启动 HTTP 连接的阶段，会发送特殊的 Header 和相应的 Settings Frame (可能为空)。服务器推送到客户端则会由服务器发送 Push_Promise Frame。而普通的请求是由客户端发送 Header 和 Data 到服务器，响应是从服务器到客户端，同样包括 Header 和 Data，帧类型取决于两者协议的内容。推送的响应和普通响应一致。Header 包括权重，Stream 依赖，Stream ID 等等数据。API 全称则是 Application Programming Interface，是实现于应用层的一种可编程协议，底层则是 HTTP/HTTPS 连接，API 数据作为 HTTP(S) 协议的数据发送，对应服务器上的服务则是，HTTP 请求由 Nginx 等生产服务器处理，API 请求由 Rails Application 处理。原生 HTTP 协议不包括任何状态和加密，可使用 Cookie 和 TLS 拓展协议提供相应服务。HTTP 连接的错误需要查询 Nginx 的日志，或者抓包分析。常用的 HTTP Header 项可以在 [Wikipedia 条目](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)上看到。

## 简述 Cookies 和 Session 的内容和作用

Cookies 和 Session 目的是解决 HTTP 连接无状态的问题，最早由 Netscape 发明于1994年。RFC 中存有 Cookies 的 [Spec 文档](https://tools.ietf.org/html/rfc6265)。Cookies 主要用于存储 Session ID 和其他非隐私信息。相关安全问题见文档后半部分，主要有 Cookie 拼接、重放攻击 (重用 Cookie) 和中间人攻击等。对 Cookie 内容加密之外，通常还需要 TLS 在传输层加密保证信道安全。Session 保存用户 ID、Token 等身份验证信息，以 Devise 为例，在 Session 中有 current_user 实例，在数据库中有随 Session 更新的 Secret_Token 和过期时间等信息。Cookie 和 HTML 中表单内嵌的 hidden field、meta 标签在功能上没有实质区别。

## 如何传输信息实现登录？

具体依赖于实现。以 Devise 为例，它依赖于 Warden 来处理身份验证，自己在其上另外实现了一套较复杂的逻辑，例如提供 views、helpers、数据库交互、变量名约定、csrf 验证等。而 Warden 则依赖 Rack::Session::Cookie，具体在 Cookie 中有什么内容需要查看源码/抓包分析。基本原理和上述 Cookie/Session 机制是一致的。

通常的流程是，浏览器发起一个 HTTP 请求，通过 DNS 查询出服务端的 IP 地址，服务器收到请求，检查 Cookies 和 Session 确认是否登录。最终服务器生成一个 HTTP 响应，包含了客户端应当看到的信息，并在服务器应用中设置 Session，客户端对收到的响应进行渲染。
