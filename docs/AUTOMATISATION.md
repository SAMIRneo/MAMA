# BOUM! — Livraison autonome des offres

## Décision produit

Conserver le public, le ton, les trois noms et la direction artistique. Remplacer les prestations qui consommaient du temps humain par des livrables numériques : parcours, fiches, plans ajustés, ateliers asynchrones, simulations écrites et bilans. Aucun coaching humain, groupe communautaire, rendez-vous, réponse personnelle du fondateur ou résultat garanti.

L'objectif est une prestation courante délivrée sans intervention quotidienne du fondateur. Une entreprise réelle garde des responsabilités : incidents, litiges et décisions hors cadre ne peuvent pas toujours être confiés à l'IA.

## Droits et limites prévus

| Fonction | La Douce | La Solide | La Totale |
| --- | --- | --- | --- |
| Point de départ personnalisé | Oui | Oui | Oui |
| Parcours | 30 jours | 30 jours adaptatifs | 90 jours, trois phases |
| Fiches texte | Quotidiennes | Quotidiennes | Quotidiennes |
| Audio | Lecture de la fiche | Lecture de la fiche | Lecture de la fiche |
| Bilan | Hebdomadaire | Hebdomadaire avec nouveau plan | Hebdomadaire + bilan à 30/60/90 jours |
| Ateliers asynchrones | — | 4 par mois | 8 par mois |
| Mises en situation IA | — | — | 8 par mois, 6 tours maximum par session |
| Réécriture d'un petit pas | — | 10 par mois | 30 par mois |
| Export | Plan et bilan | Plan et bilan | Dossier complet |

Ces limites constituent un cadre de lancement à vérifier avec les coûts réels du fournisseur choisi. Aucune génération illimitée. Les droits doivent être appliqués par le serveur à partir de l'abonnement, jamais par un simple sélecteur du navigateur.

## Chaîne cible

1. **Quiz gratuit** : suggestion indicative ; choix final conservé par la cliente.
2. **Achat** : checkout hébergé, conditions d'achat, période et montant exact affichés avant confirmation.
3. **Activation** : webhook signé ; traitement idempotent de son identifiant ; activation seulement après confirmation du fournisseur de paiement.
4. **Accueil** : compte client ; consentement distinct pour les rappels facultatifs ; objectif, temps disponible et énergie. Aucun questionnaire médical.
5. **Génération** : tâche serveur vers le fournisseur IA ; validation de la sortie structurée ; enregistrement du plan. Les fiches éditoriales servent de repli annoncé en cas de panne.
6. **Livraison** : fiche dans l'espace client ; lecture audio à la demande ; rappels uniquement si la cliente les choisit.
7. **Progression** : actions signalées, historique daté, bilan hebdomadaire. Ne pas déduire de réussite psychologique à partir du nombre de clics.
8. **Ajustement** : à partir de La Solide, nouveau plan après bilan. Conserver l'ancien et les actions réalisées.
9. **Renouvellement** : confirmation par webhook ; à la fin des 30/90 jours, proposer un nouveau cycle autonome.
10. **Annulation** : portail client autonome ; actualisation de la date de fin par webhook ; maintien des droits selon les conditions d'achat.
11. **Remboursement** : parcours autonome pour les cas couverts par une politique définie ; contrôle serveur du montant et de l'éligibilité. Les cas hors cadre restent une responsabilité de l'exploitant.
12. **Sortie** : export, demande de suppression et arrêt des notifications ; conservation des seules données requises selon la politique définie.

## Automates à raccorder

| Déclencheur | Action automatique | Protection |
| --- | --- | --- |
| Paiement confirmé | Activer les droits, préparer le parcours | Webhook signé, idempotence, utilisateur vérifié |
| Début du jour choisi | Préparer la fiche suivante | Fuseau client, rappel consenti, pas de doublon |
| Bilan rempli | Générer le prochain plan | Historique limité, schéma validé, quota |
| Atelier demandé | Générer l'exercice autorisé | Authentification, droits, plafond de coût |
| Simulation demandée | Générer un tour de dialogue | La Totale uniquement, limite de tours |
| Renouvellement/annulation | Actualiser les droits | État confirmé du prestataire |
| Incident IA | Afficher une fiche éditoriale de repli | Mode indiqué, tentatives bornées |

Prévoir une file persistante, des tâches idempotentes et un nombre borné de tentatives. Une reprise après panne ne doit pas facturer une nouvelle génération. Notifier l'exploitant seulement lorsqu'une intervention devient nécessaire.

## Cadre du compagnon IA

Français clair, chaleureux, direct. Humour sans moquerie. Identifier le service comme une IA, demander peu de données et proposer une action concrète. Aucun diagnostic, traitement, résultat garanti, faux avis, pression vers l'offre chère ou dépendance affective. La cliente garde ses décisions.

Un sujet hors cadre interrompt l'exercice inadapté et oriente vers une aide humaine qualifiée. Les éventuelles coordonnées d'urgence doivent venir d'une source validée pour le pays, jamais d'une invention du modèle.

Les entrées clientes sont des données, pas des instructions système. L'IA n'a pas d'outil de paiement ou d'annulation. Les actions financières et les droits sont gérés par du code déterministe et une confirmation explicite de la cliente.

## Avant ouverture des ventes

- Backend HTTPS : authentification, comptes, stockage et droits.
- Fournisseur IA : secret serveur, modèle et budget mesurés.
- Paiement : produits, checkout, portail et webhooks.
- File de tâches et planificateur ; email seulement si des rappels sont proposés.
- Identité et contact réels de l'exploitant, conditions de vente et politique de données.
- Recette réelle : achat de test, annulation, droits, panne IA, export et suppression.

## État actuel

La vitrine et l'aperçu local sont publiables sur GitHub Pages. L'aperçu adapte des fiches préécrites : ce n'est pas une IA. Le serveur, les paiements et les automates ci-dessus sont le contrat de réalisation du service payant, pas une infrastructure déjà connectée.
