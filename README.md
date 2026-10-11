# BOUM! — MAMA

[Site en ligne](https://samirneo.github.io/MAMA/) · Formations bien-être pour femmes, pensées notamment pour la vie après 45 ans.

## Produit

Trois besoins distincts ; la formation la plus chère n'est pas une version supérieure des autres.

| Formation | Besoin | Programme | Trace finale | Tarif envisagé |
| --- | --- | --- | --- | ---: |
| La Douce — Souffler | Charge mentale et équilibre numérique | 3 modules, 9 leçons, ≈ 3 semaines | Une semaine respirable | 19 € |
| La Solide — Prendre sa place | Limites et relations du quotidien | 4 modules, 12 leçons, ≈ 4 semaines | Un carnet de limites claires | 39 € |
| La Totale — Oser la suite | Transitions et projet personnel | 6 modules, 18 leçons, ≈ 6 semaines | Une feuille de route à 90 jours | 69 € |

Le rythme indicatif est de trois leçons par semaine, avec des séances de 5, 10 ou 15 minutes. Les prix sont des **achats uniques envisagés**, sans abonnement. Aucune vente n'est activée. Les 39 leçons sont actuellement en accès libre dans la version découverte.

## Expérience

- Mini-bilan de trois questions dès l'accueil : priorité, obstacle, temps disponible.
- Recommandation explicable fondée sur la priorité, sans score psychologique ni influence du prix.
- Première action immédiate, lien vers la formation et ouverture du carnet au rythme choisi.
- Carnets distincts : notes, leçons terminées, navigation, lecture vocale et export texte.
- Sauvegarde facultative sur l'appareil, effacement confirmé, repli si le stockage est bloqué.
- Trois pages HTML de formation, lisibles et navigables sans JavaScript.

Le site utilise des contenus préécrits. Aucune génération IA, compte membre, facturation ou messagerie n'est connecté. Les exercices ne constituent ni une thérapie ni une certification.

## Source et génération

- `formations.js` : source éditoriale des formations, modules et leçons.
- `scripts/build-site.cjs` : génère l'accueil, les pages de formation, le sitemap, robots.txt et la page 404.
- `site.css` : identité et responsive en CSS natif.
- `programme-core.js` : recommandation, validation des données et formats de séance.
- `script.js` : mini-bilan et navigation.
- `programme.js` : carnet local.
- `assets/` : favicon et image de partage.

Modifier la source puis régénérer ; ne pas éditer directement les HTML générés.

```sh
node scripts/build-site.cjs
node --test tests/programme.test.cjs
node scripts/verify-site.cjs
```

Servir le dossier avec un serveur HTTP statique pour le voir localement. Pas de dépendances de build à installer. GitHub Actions exécute génération, contrôles et tests, puis publie les seuls fichiers du site sur Pages.

## SEO

Quatre pages canoniques, descriptions uniques, Open Graph/Twitter, image 1200 × 630, données structurées Course/ItemList et BreadcrumbList, sitemap XML et liens internes. Aucun faux avis, aucune offre commercialisable déclarée dans les données structurées. Aucun résultat enrichi ni positionnement n'est garanti.

Le `robots.txt` est publié dans `/MAMA/` : les robots consultent normalement celui à la racine du domaine. Ce fichier de projet ne remplace pas le contrôle du domaine `samirneo.github.io`. Le sitemap peut être déclaré explicitement dans une propriété Search Console appropriée ; cette étape et l'indexation ne sont pas confirmées dans cette livraison.

## Suite commerciale

Voir `docs/AUTOMATISATION.md` pour la livraison automatisable et les branchements restants. Le frontend GitHub Pages ne doit recevoir aucune clé fournisseur ni clé de paiement.
