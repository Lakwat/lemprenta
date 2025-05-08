---
# YAML Frontmatter starts with --- and ends with ---
# These key-value pairs provide metadata about the post.

# Title of the blog post (used in templates and SEO)
title: "My First Post, reload test"

# Date of the post (used for sorting and display)
# Using today's date based on our context.
date: 2025-05-06

# Tags for categorizing the post (can be used for filtering/related posts)
tags: ["introduction", "testing"]

# Specifies which layout file (from templates/_includes/layouts/)
# should be used to render this post. We'll create this file later.
layout: layouts/post.njk

# A short description for SEO and social media previews.
description: "This is the very first post on my automated blog!"
---

# Hello World! This is the content of my very first blog post. Eleventy will take this Markdown file, combine it with the `post.njk` layout, and generate an HTML page.

You can write standard Markdown here:

* Lists
* Are
* Easy

And include **bold** or *italic* text.

```javascript
// Even code blocks work!
console.log("Hello from my first post!");
