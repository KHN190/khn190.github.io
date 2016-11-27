---
layout: post
title: Archive
cover: archive.jpg
date:  2016-11-27 13:10:00 +0800
permalink: /archive/
categories: archive
---

<div class="posts">
  <ul class="posts-list">
    {% for post in site.posts %}
      <li class="post-link">
        <a class="post-title" href="{{ post.url }}">
          <span class="post-date">{{ post.date | date_to_string }}</span>
          {{ post.title }}
        </a>
      </li>
    {% endfor %}
  </ul>
</div>
