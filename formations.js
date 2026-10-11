/* Catalogue public : une courte découverte et les bénéfices des formations prévues. */
(function(root){'use strict';const courses={
  "douce": {
    "id": "douce",
    "name": "La Douce",
    "title": "Souffler",
    "slug": "souffler-charge-mentale",
    "emoji": "☕",
    "color": "sage",
    "weeks": 3,
    "price": 19,
    "topic": "Charge mentale & équilibre numérique",
    "description": "Rendre visible ce qui te pèse, alléger les sollicitations et retrouver une place dans ton propre agenda.",
    "forYou": "Tu penses à tout, les messages ne s’arrêtent jamais et ton temps passe souvent après celui des autres.",
    "outcome": "Repartir avec une carte de ta charge mentale, une règle numérique et une semaine plus respirable.",
    "takeaway": "Ta semaine respirable",
    "firstStep": "Note trois choses qui occupent ton esprit. Entoure celle qui peut attendre aujourd’hui.",
    "plannedLessons": 9,
    "advantages": [
      "Pauses de respiration simples, sans forcer",
      "Mini-méditations pour revenir au moment présent",
      "Fiches pour alléger la charge mentale",
      "Rituels courts pour une semaine plus respirable"
    ],
    "modules": [
      {
        "title": "Voir tout ce que tu portes",
        "goal": "Rendre visible la charge avant de vouloir mieux s’organiser."
      },
      {
        "title": "Récupérer ton attention",
        "goal": "Choisir quand le numérique entre dans ta journée."
      },
      {
        "title": "Installer une semaine respirable",
        "goal": "Construire un cadre léger qui tient dans la vraie vie."
      }
    ],
    "lessons": [
      {
        "title": "Une petite minute pour toi",
        "idea": "Avant de vouloir tout changer, commence par une pause. Rien à réussir : juste un moment pour toi.",
        "action": "Installe-toi confortablement, les yeux ouverts si tu préfères. Observe trois respirations naturelles, sans les modifier. Regarde un détail agréable autour de toi. Puis note un petit geste qui te ferait du bien aujourd’hui.",
        "example": "Boire mon café tranquillement, sortir quelques instants ou reporter une demande qui peut attendre.",
        "output": "Un petit geste choisi pour aujourd’hui.",
        "duration": 1,

        "id": "douce-preview",
        "moduleIndex": 0,
        "moduleTitle": "Découverte gratuite"
      }
    ]
  },
  "solide": {
    "id": "solide",
    "name": "La Solide",
    "title": "Prendre sa place",
    "slug": "confiance-limites",
    "emoji": "✋",
    "color": "pink",
    "weeks": 4,
    "price": 39,
    "topic": "Limites, confiance & relations du quotidien",
    "description": "Clarifier tes besoins, formuler un non et préparer des conversations plus claires, à la maison comme au travail.",
    "forYou": "Tu dis oui par réflexe, tu te justifies beaucoup ou tu peines à faire entendre tes besoins.",
    "outcome": "Repartir avec tes phrases repères, une conversation préparée et des limites que tu peux tenir.",
    "takeaway": "Ton carnet de limites claires",
    "firstStep": "Complète cette phrase : « Cette semaine, j’aimerais avoir plus de marge pour… »",
    "plannedLessons": 12,
    "advantages": [
      "Respiration de recentrage avant une conversation",
      "Méditations guidées autour de la confiance et des besoins",
      "Exercices pour dire non et poser une limite",
      "Carnet de phrases repères et bilans personnels"
    ],
    "modules": [
      {
        "title": "Reconnaître ce dont tu as besoin",
        "goal": "Mettre des mots sur une situation sans te juger."
      },
      {
        "title": "Dire non avec tes propres mots",
        "goal": "Disposer de phrases simples avant d’en avoir besoin."
      },
      {
        "title": "Partager la charge et clarifier les attentes",
        "goal": "Transformer les reproches flous en demandes discutables."
      },
      {
        "title": "Tenir tes limites avec souplesse",
        "goal": "Garder un cadre sans chercher la réponse parfaite."
      }
    ],
    "lessons": [
      {
        "title": "Une petite minute pour toi",
        "idea": "Avant de vouloir tout changer, commence par une pause. Rien à réussir : juste un moment pour toi.",
        "action": "Installe-toi confortablement, les yeux ouverts si tu préfères. Observe trois respirations naturelles, sans les modifier. Regarde un détail agréable autour de toi. Puis note un petit geste qui te ferait du bien aujourd’hui.",
        "example": "Boire mon café tranquillement, sortir quelques instants ou reporter une demande qui peut attendre.",
        "output": "Un petit geste choisi pour aujourd’hui.",
        "duration": 1,

        "id": "solide-preview",
        "moduleIndex": 0,
        "moduleTitle": "Découverte gratuite"
      }
    ]
  },
  "totale": {
    "id": "totale",
    "name": "La Totale",
    "title": "Oser la suite",
    "slug": "nouveau-cap-projet-personnel",
    "emoji": "🌻",
    "color": "mustard",
    "weeks": 6,
    "price": 69,
    "topic": "Transitions de vie & projet personnel",
    "description": "Faire de la place à tes envies et transformer un « un jour » en une petite expérience, puis en un cap concret.",
    "forYou": "Ta vie change, tu ne sais plus très bien ce que tu veux pour toi, ou un projet attend depuis longtemps.",
    "outcome": "Repartir avec un projet clarifié, un premier essai et une feuille de route personnelle à 90 jours.",
    "takeaway": "Ta feuille de route à 90 jours",
    "firstStep": "Écris une envie qui t’appartient, même petite. Puis note ce que tu pourrais en essayer sans tout bouleverser.",
    "plannedLessons": 18,
    "advantages": [
      "Respiration et pauses d’attention pour préparer une action",
      "Méditations guidées pour explorer ses envies",
      "Exercices pour clarifier et tester un projet",
      "Feuille de route personnelle à 90 jours"
    ],
    "modules": [
      {
        "title": "Faire le point sur ta prochaine étape",
        "goal": "Distinguer tes envies des rôles que tu occupes."
      },
      {
        "title": "Retrouver des appuis",
        "goal": "T’appuyer sur du concret plutôt que sur une confiance parfaite."
      },
      {
        "title": "Explorer sans tout miser",
        "goal": "Transformer une idée en expérience limitée."
      },
      {
        "title": "Construire ton plan",
        "goal": "Passer de l’idée aux conditions concrètes de l’action."
      },
      {
        "title": "Passer à l’essai",
        "goal": "Agir à petite échelle et apprendre du résultat."
      },
      {
        "title": "Choisir la suite",
        "goal": "Dessiner un cap sans te l’imposer."
      }
    ],
    "lessons": [
      {
        "title": "Une petite minute pour toi",
        "idea": "Avant de vouloir tout changer, commence par une pause. Rien à réussir : juste un moment pour toi.",
        "action": "Installe-toi confortablement, les yeux ouverts si tu préfères. Observe trois respirations naturelles, sans les modifier. Regarde un détail agréable autour de toi. Puis note un petit geste qui te ferait du bien aujourd’hui.",
        "example": "Boire mon café tranquillement, sortir quelques instants ou reporter une demande qui peut attendre.",
        "output": "Un petit geste choisi pour aujourd’hui.",
        "duration": 1,

        "id": "totale-preview",
        "moduleIndex": 0,
        "moduleTitle": "Découverte gratuite"
      }
    ]
  }
};if(typeof module==='object'&&module.exports)module.exports={courses};else root.BoumFormations={courses};})(typeof window!=='undefined'?window:globalThis);
