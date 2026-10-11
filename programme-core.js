/* Aperçu éditorial déterministe : aucune génération IA ni requête distante. */
(function (root) {
  'use strict';
  const PLANS = { douce: { name: 'La Douce', days: 30 }, solide: { name: 'La Solide', days: 30 }, totale: { name: 'La Totale', days: 90 } };
  const GOALS = { temps: 'me garder du temps', projet: 'faire avancer un projet', limites: 'poser mes limites' };
  const CONTENT = {
    temps: [
      ['Un rendez-vous avec toi', 'Repère un moment calme dans ta journée. Réserve-le pour une activité que tu choisis, même si elle paraît minuscule.'],
      ['Le tri qui libère', 'Note trois choses qui prennent de la place dans ta journée. Choisis-en une que tu peux simplifier, reporter ou déléguer.'],
      ['Ton menu de petits plaisirs', 'Écris cinq activités qui te font du bien et qui ne demandent pas une organisation compliquée. Entoure celle que tu peux tester aujourd’hui.'],
      ['Le créneau protégé', 'Choisis un créneau réaliste dans la semaine. Prépare une phrase simple pour expliquer que tu ne seras pas disponible à ce moment-là.'],
      ['Une tâche en moins', 'Repère une tâche faite par habitude. Demande-toi si elle est nécessaire aujourd’hui et ce qui se passerait si tu la faisais autrement.'],
      ['Sortir du pilote automatique', 'Pendant une activité du quotidien, observe ce que tu fais sans te presser. Identifie un changement qui rendrait ce moment plus agréable.'],
      ['Ton bilan sans procès', 'Regarde les actions déjà faites. Qu’est-ce qui a été facile ? Qu’est-ce qui a débordé ? Choisis une seule chose à garder pour la suite.'],
      ['La version légère', 'Reprends une activité qui te plaît et prépare sa version courte. L’objectif est qu’elle trouve une place même dans une journée chargée.'],
      ['Une demande concrète', 'Prépare une demande d’aide précise : une tâche, une personne, un moment. Tu peux l’écrire sans être obligée de l’envoyer aujourd’hui.'],
      ['Ton rituel qui tient', 'Choisis un petit rituel à garder. Note quand il commence, combien de temps il dure et sa version minimale pour les journées compliquées.']
    ],
    projet: [
      ['L’envie en une phrase', 'Décris ton projet en une phrase simple : ce que tu aimerais essayer, pour toi. Pas besoin d’un dossier de trente pages.'],
      ['Le prochain pas visible', 'Découpe ton envie en une action que tu peux réellement commencer. Évite « tout préparer » : cherche un verbe précis et un résultat modeste.'],
      ['Une information utile', 'Liste ce que tu sais déjà et une information qui te manque. Identifie une source fiable ou une personne à qui poser une question.'],
      ['La version d’essai', 'Imagine une première version de ton projet qui coûte peu de temps et d’argent. Décris ce que tu apprendrais en la testant.'],
      ['Le vrai obstacle', 'Nomme un obstacle concret : temps, matériel, organisation. Sépare ce qui dépend de toi de ce qui dépend des autres.'],
      ['Préparer le terrain', 'Rassemble une ressource utile ou aménage un petit espace pour ton projet. Préparer une chose suffit pour aujourd’hui.'],
      ['Ce qui a déjà bougé', 'Relis ton intention de départ. Note une chose apprise, une chose faite et un prochain pas réaliste.'],
      ['Un retour utile', 'Prépare une question précise sur ton essai. Choisis quelqu’un dont le retour pourrait t’aider ; tu décides si et quand tu le sollicites.'],
      ['Le créneau du projet', 'Place ton prochain pas dans un créneau réaliste. Prévois aussi une version plus courte si la journée ne se passe pas comme prévu.'],
      ['La petite expérience', 'Lance ou prépare ton essai à petite échelle. Observe ce qui fonctionne et écris ce que tu aimerais ajuster, sans te juger.']
    ],
    limites: [
      ['Ce qui te prend trop de place', 'Choisis une situation du quotidien dans laquelle tu aimerais avoir plus de marge. Décris les faits sans te juger ni juger l’autre.'],
      ['Ton besoin en une phrase', 'Écris ce dont tu as besoin dans cette situation : du temps, de la clarté, du calme ou un partage plus juste des tâches.'],
      ['Un non qui tient debout', 'Prépare une phrase courte pour refuser une demande ordinaire : « Je ne suis pas disponible pour ça aujourd’hui. » Adapte-la à tes mots.'],
      ['Une alternative choisie', 'Si tu en as envie, prépare une alternative que tu peux vraiment tenir. Proposer autre chose est un choix, pas une obligation.'],
      ['Le temps de répondre', 'Prépare une phrase pour ne pas répondre tout de suite : « Je regarde mon planning et je reviens vers toi. » Répète-la tranquillement.'],
      ['La conversation sur papier', 'Écris trois lignes : le fait observé, ton besoin et ta demande concrète. Garde ce brouillon pour toi ou relis-le à voix haute.'],
      ['Le bilan sans culpabilité', 'Observe ce que tu as essayé. Qu’est-ce qui t’a laissé plus de marge ? Quelle formulation te ressemble davantage ?'],
      ['Moins de justifications', 'Reprends une phrase de refus et enlève les explications qui ne sont pas nécessaires. Cherche une version polie et claire.'],
      ['Ta marge de manœuvre', 'Liste ce que tu peux choisir dans une situation ordinaire : le moment, le format ou la durée. Choisis une marge que tu aimerais protéger.'],
      ['Une limite réaliste', 'Choisis une limite simple à garder cette semaine. Précise ce que tu feras si elle devient difficile à tenir, sans chercher à contrôler les autres.']
    ]
  };
  const WORKSHOPS = {
    temps: ['Dessine ta semaine sur une feuille. Place les obligations fixes, puis un créneau pour toi. Retire une chose avant d’en ajouter une.', 'Fais deux colonnes : « je choisis » et « je fais par habitude ». Choisis une habitude à alléger cette semaine.', 'Prépare trois versions de ton rituel : idéale, courte et minimale. La version minimale compte aussi.'],
    projet: ['Écris le résultat de ton premier essai, le matériel nécessaire et une date possible. Réduis le périmètre jusqu’à ce qu’il soit réaliste.', 'Écris trois étapes, puis coupe la première en une action de quelques minutes. Commence uniquement par celle-ci.', 'Imagine qu’un essai ne donne pas le résultat espéré. Note ce que tu pourrais quand même apprendre et le prochain ajustement possible.'],
    limites: ['Prépare une conversation ordinaire en trois phrases : ce que j’observe, ce dont j’ai besoin, ce que je demande.', 'Répète deux formulations : « Je ne peux pas aujourd’hui » et « Je peux te proposer ceci ». Garde celle que tu peux tenir.', 'Écris une réponse à une insistance légère : « J’ai entendu ta demande. Ma réponse reste la même. » Tu peux t’exercer sans l’envoyer.']
  };
  function normalize(input) {
    if (!input || typeof input !== 'object') return null;
    const plan = Object.hasOwn(PLANS, input.plan) ? input.plan : null;
    const goal = Object.hasOwn(GOALS, input.goal) ? input.goal : null;
    const minutes = Number(input.minutes);
    const energy = ['doucement', 'stable', 'elan'].includes(input.energy) ? input.energy : null;
    if (!plan || !goal || ![5, 10, 20].includes(minutes) || !energy) return null;
    const count = Number(input.completed), exercise = Number(input.workshop);
    return { version: 1, plan, goal, minutes, energy, completed: Number.isFinite(count) ? Math.min(PLANS[plan].days, Math.max(0, Math.floor(count))) : 0, workshop: Number.isFinite(exercise) ? Math.max(0, Math.floor(exercise)) % 3 : 0, remember: input.remember === true };
  }
  function task(state) {
    const s = normalize(state);
    if (!s) throw Error('Parcours invalide');
    if (s.completed >= PLANS[s.plan].days) return null;
    const index = s.completed % 10;
    const cycle = Math.floor(s.completed / 10);
    const [title, text] = CONTENT[s.goal][index];
    const stages = ['Découvrir', 'Tester dans la vraie vie', 'Installer un rythme', 'Approfondir', 'Essayer autrement', 'Trouver ton équilibre', 'Consolider', 'Faire le point', 'Préparer la suite'];
    const variations = [
      'Commence par écrire une première réponse ou préparer un petit essai.',
      'Reprends cet exercice avec une situation réelle de cette semaine. Compare avec ton premier essai.',
      'Transforme ce qui a été utile en une habitude réaliste. Simplifie ce qui ne tient pas.',
      'Choisis une nouvelle situation et applique ce que tu as déjà appris.',
      'Essaie une autre façon de faire. Note ce qui te convient le mieux.',
      'Adapte cet exercice à une semaine chargée, avec une version plus légère.',
      'Reprends la piste la plus utile et précise comment la garder dans le temps.',
      'Compare avec ton point de départ : une chose apprise, une difficulté, une prochaine action.',
      'Prépare la suite : garde ce qui te sert et choisis un rythme que tu peux tenir.'
    ];
    const budget = s.energy === 'doucement' ? Math.min(5, s.minutes) : s.minutes;
    const tip = s.energy === 'doucement' ? `Version légère : ${budget} minutes maximum. Une phrase ou un brouillon suffit.` : s.energy === 'elan' ? `${budget} minutes maximum. Si tu as de la marge, note le prochain petit pas, sans ajouter une deuxième obligation.` : `${budget} minutes maximum. Arrête-toi à la fin du créneau : suffisamment bien, c’est bien.`;
    return { day: s.completed + 1, title, text: text + ' ' + variations[cycle], stage: stages[cycle], minutes: budget, tip };
  }
  function workshop(state) {
    const s = normalize(state);
    if (!s || s.plan === 'douce') return null;
    return { title: s.plan === 'totale' ? 'Ma mise en situation' : 'Mon atelier guidé', text: WORKSHOPS[s.goal][s.workshop] + (s.plan === 'totale' ? ' Mise en situation : écris une objection possible, puis une réponse calme. C’est un exercice sur papier, pas un dialogue généré par IA.' : '') };
  }
  const api = { PLANS, GOALS, normalize, task, workshop };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BoumProgramme = api;
})(typeof window !== 'undefined' ? window : globalThis);
