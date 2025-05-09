---
# YAML Frontmatter starts with --- and ends with ---
# These key-value pairs provide metadata about the post.

# Title of the blog post (used in templates and SEO)
title: "La Meva Primera Publicació, prova de recàrrega"

# Date of the post (used for sorting and display)
# Using today's date based on our context.
date: "2025-05-06" # You can change this to "git Last Modified" if you prefer it to update automatically

# Tags for categorizing the post (can be used for filtering/related posts)
tags: ["introducció", "proves", "català"]

# Specifies which layout file (from templates/_includes/layouts/)
# should be used to render this post.
# CORRECTED: Removed the redundant 'layouts/' prefix.
layout: post.njk

# A short description for SEO and social media previews.
description: "Aquesta és la primera publicació al meu blog automatitzat en català!"
---

# Hola Món! Aquest és el contingut de la meva primera publicació al blog.

Eleventy agafarà aquest fitxer Markdown, el combinarà amb el disseny `post.njk` i generarà una pàgina HTML.

Pots escriure Markdown estàndard aquí:

* Les llistes
* Són
* Fàcils

I incloure text en **negreta** o *itàlica*.

```javascript
// Even code blocks work!
console.log("Hola des de la meva primera publicació!");
```

Aquesta publicació és una demostració de com es pot crear contingut fàcilment.
