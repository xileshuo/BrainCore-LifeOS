---
tags:
  - 读书
  - 微信读书
  - weread
isbn: {{ metaData.isbn }}
category: {{ metaData.category }}
---

## 内容简介

> [!info] 书籍简介
> {{ metaData.intro | striptags(true) | trim }}

## 高亮划线

{% set prevDate = '' -%}
{% for chapter in chapterHighlights -%}
{% for highlight in chapter.highlights -%}
{% set d = '' -%}
{% if highlight.createTime %}{% set d = highlight.createTime.slice(0, 10) %}{% endif -%}
{% if d and d != '1970-01-01' and d != prevDate -%}
### {{ d }}
{% set prevDate = d -%}
{% endif -%}

> [!ABSTRACT] <span style="font-size:1.4em; color: #66a5ad;">{{ highlight.markText | trim }}</span>

{% endfor -%}
{%- endfor -%}

<br>

## 读书笔记

{% set prevNoteDate = '' -%}
{% for chapter in bookReview.chapterReviews -%}
{% if chapter.reviews or chapter.chapterReview -%}

{% for review in chapter.reviews -%}
{% set rd = '' -%}
{% if review.createTime %}{% set rd = review.createTime.slice(0, 10) %}{% endif -%}
{% if rd and rd != '1970-01-01' -%}
{% if rd != prevNoteDate -%}
### {{ rd }}
{% set prevNoteDate = rd -%}
{% endif %}
{% endif -%}

> [!ABSTRACT] <span style="font-size:1.4em; color: #66a5ad;">{{ review.abstract | trim }}</span>
> > [!TIP] 📝 随记 <span style="font-size:1.4em;">
> > {{ review.content }}</span>

{% endfor -%}

{% if chapter.chapterReview -%}
{% set cd = '' -%}
{% if chapter.chapterReview.createTime %}{% set cd = chapter.chapterReview.createTime.slice(0, 10) %}{% endif -%}
{% set showDate = cd if cd and cd != '1970-01-01' else '时间未记录' -%}
{% if showDate != prevNoteDate -%}
### {{ showDate }}
{% set prevNoteDate = showDate -%}
{% endif %}

> [!TIP] 🚩 章节总结 <span style="font-size:1.4em;">
> {{ chapter.chapterReview.content }}</span>

{% endif -%}
{% endif -%}
{%- endfor -%}

<br>

## 全书评论

{% if bookReview.bookReviews -%}
{% for r in bookReview.bookReviews -%}
> [!example] 书评 #{{ loop.index }}
> {{ r.mdContent }}

{% endfor -%}
{%- endif -%}
