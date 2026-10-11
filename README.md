# MAMA — BOUM!

BOUM! accompagne les femmes de 45 ans et plus avec une identité groovy : papier crème, Fraunces, couleurs franches, stickers et humour.

Les offres sont conçues pour une livraison automatisable par IA, sans appel humain, atelier en direct ou groupe à animer.

| Offre prévue | Mensuel | Annuel | Livraison cible |
| --- | ---: | ---: | --- |
| La Douce | 19 € | 190 € | Parcours de 30 jours, fiches et bilans |
| La Solide | 39 € | 390 € | Plan adaptatif, ateliers et débriefs |
| La Totale | 69 € | 690 € | 90 jours, mises en situation et bilans d'étape |

## Structure

- `index.html` : contenu, navigation, quiz, témoignages, offres et FAQ.
- `styles.css` : identité graphique, mises en page adaptatives et animations.
- `script.js` : menu mobile, quiz à trois questions, bascule des tarifs, FAQ et effets visuels.
- `programme.css` : carnet interactif dans la direction artistique du site.
- `programme-core.js` : exercices préécrits et règles locales.
- `programme.js` : parcours, progression, sauvegarde facultative, audio et export.
- `docs/AUTOMATISATION.md` : chaîne de livraison, droits, limites et raccordements nécessaires.
- `docs/CONTRAT-IA.json` : instructions et format de sortie du futur serveur IA.

Le site est statique, sans dépendance de compilation. Les polices Fraunces et DM Sans sont chargées depuis Google Fonts.

## Aperçu local

Servir ce dossier avec un serveur HTTP statique, puis ouvrir `index.html` dans un navigateur.

Vérifier avec `node --test tests/programme.test.cjs` et `node --check` sur les trois scripts.

## Publication

GitHub Pages publie automatiquement les six fichiers du site à chaque mise à jour de `main`, via `.github/workflows/pages.yml`. Les documents internes, tests et artefacts ne sont pas publiés sur Pages.

## État fonctionnel

Le quiz et l'aperçu gratuit sont fonctionnels : choix d'objectif et de durée, parcours de 30/90 étapes, validation des actions, bilans, ajustement d'énergie pour La Solide/La Totale, ateliers, lecture par synthèse vocale du navigateur et export texte.

**L'aperçu n'utilise pas une IA générative.** Il sélectionne des contenus préécrits et l'annonce dans l'interface. Sauvegarde locale facultative ; aucun compte, paiement, abonnement, email ou appel IA.

Les exercices reviennent avec des consignes d'approfondissement ; chaque clic confirme une action, pas le passage d'une journée. Les tarifs annuels correspondent à dix mensualités ; leur équivalent mensuel est arrondi, tandis que le total annuel exact apparaît séparément.

## Activation du service commercial

GitHub Pages ne peut pas conserver une clé secrète ni exécuter des appels IA, webhooks ou tâches serveur. L'activation nécessite un backend, un fournisseur IA, un service de paiement et les informations réelles de l'exploitant. Aucun secret ne doit être placé dans le frontend ou dans Git.

Cette version rend les prestations automatisables et le parcours vérifiable. Le service payant avec génération IA n'est pas activé ; ses raccordements et sa recette restent nécessaires avant toute vente.
