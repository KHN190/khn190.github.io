---
layout: post
title:  "Ruby on Rails：请加上 null: true 限制"
date:   2016-09-14 16:33:39 +0800
categories: ruby-on-rails
---

设想有这样一个架构：一类信息我们叫作 InfoShort（电影短信息），一类信息继承自它，比如说 Director（电影导演）。继承结构如下：

{% highlight ruby %}
class InfoShort < Info; end
class Director < InfoShort; end
{% endhighlight %}

数据库中 InfoShort 引用自 Movie 表单，也就是说，每个 Movie 记录对应有 Director，Alias，TimeLength 等短信息。Director 呢，是个
抽象模型，数据库中没有直接的对应记录，所以通过 `superclass.new` 来创建它。

现在发生了一个问题：你在 console 中调试的时候发现 `InfoShort` 通过 `create` 方法可以返回一条记录，但用自己定义的 `save` 方法则不可以！使用下面的 `save` 方法显示 `insert` 的 SQL 语句发生回滚，但没有报任何错误。真是非常奇怪的问题。

{% highlight ruby %}
class Info
  def self.save(params)
    if obj = superclass.find_by_movie_id(params[:movie_id])
      # ...
    else
      obj = superclass.new
      # ... 赋值操作
    end
    obj.save
  end
end

# call this method
Director.save(params) # Failed.
{% endhighlight %}

同样地，你注意到，在 console 中尝试：

{% highlight ruby %}
InfoShort.create(params)
{% endhighlight %}

正确返回了一条记录。好吧。你想到了手动执行 SQL 语句，来看看这里有没有报错的地方，到底是数据库这一层的哪出了错竟然没被捕捉到。你一五一十地把 params 中的数据复制到了终端：

{% highlight sql %}
insert into info_shorts(movie_id, value, crawler) values(737, 'some value', 'crawler');
{% endhighlight %}

这时你见到了鬼，导致你从凳子上跳了起来：执行完全正确。

你是一个意志坚强的人，所以你打算继续看下去，现在你一行一行地在 console 中执行 `Info.save` 的操作...运气来临了。不，不是在命令行中找到了错误，你发现了一个类似 typo 的东西：InfoShort 所必须的 movie_id 虽然被传入 params，但你不小心漏掉了一行，导致这个新建的 InfoShort 记录该项没有被赋值！你恍然大悟，加入了一行：

{% highlight ruby %}
class Info
  def self.save(params)
    if obj = superclass.find_by_movie_id(params[:movie_id])
      # ...
    else
      obj = superclass.new
      # ... 赋值操作
      # 注意这里！
      obj.movie_id = params[:movie_id]
    end
    obj.save
  end
{% endhighlight %}

你再执行 save 操作，终于成功了！但是等等，为什么 create 方法没有报错？你在 stackoverflow 上搜索一番，发现这个帖子：http://stackoverflow.com/questions/9791386/differences-between-new-save-and-create

原来 create 虽然调用 new 和 save 方法，但它的“可以”是不管是否 save 成功的！你又看了看 migrate 记录，发现数据表单是这么写的：

{% highlight ruby %}
class CreateInfoShorts < ActiveRecord::Migration
  def change
    create_table :info_shorts do |t|
      t.integer :movie_id, index: true
      # ...
      t.timestamps
    end
  end
end
{% endhighlight %}

万恶的数据库结构居然没有加上 null: true 的限制！导致上述错误无法被 ActiveRecord 捕捉，害你在一个 typo 上花费了将近两个小时！那么为什么手动操作也没报错呢？因为你手工复制 params 的时候没有漏掉 movie_id，但你不知道在自己定义的 save 方法中漏掉了。好了，现在你可以得出结论：

1. 使用 save 方法来控制数据库操作是否成功
2. 避免在定义数据库表单时漏掉限制，否则 bug 会发生得悄无声息
