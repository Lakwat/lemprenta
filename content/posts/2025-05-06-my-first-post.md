---
# El Frontmatter YAML comença amb --- i acaba amb ---
# Aquests parells clau-valor proporcionen metadades sobre la publicació.

# Títol de la publicació del blog (utilitzat en plantilles i SEO)
title: "La Meva Primera Publicació, prova de recàrrega"

# Data de la publicació (utilitzada per ordenar i mostrar)
# Utilitzant la data d'avui basada en el nostre context.
date: "2025-05-06" # Pots canviar-la a "git Last Modified" si prefereixes que s'actualitzi automàticament

# Etiquetes per categoritzar la publicació (es poden utilitzar per filtrar/publicacions relacionades)
tags: ["introducció", "proves", "català"]

# Especifica quin fitxer de disseny (de templates/_includes/layouts/)
# s'ha d'utilitzar per renderitzar aquesta publicació.
layout: layouts/post.njk

# Una breu descripció per a SEO i previsualitzacions en xarxes socials.
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
// Fins i tot els blocs de codi funcionen!
console.log("Hola des de la meva primera publicació!");
```

Aquesta publicació és una demostració de com es pot crear contingut fàcilment.
