document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const core = window.BoumProgramme;
  const $ = id => document.getElementById(id);
  const KEY = 'boum-parcours-v1';
  let state = null, resetPending = false;
  const status = message => { $('programmeStatus').textContent = message; };
  function clearAudio() { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); $('audioStatus').textContent = ''; }
  function save() {
    try {
      if (state?.remember) { localStorage.setItem(KEY, JSON.stringify(state)); $('programmeStorage').textContent = 'Progression enregistrée dans ce navigateur. Aucun envoi à un service IA.'; }
      else { localStorage.removeItem(KEY); $('programmeStorage').textContent = 'Progression gardée uniquement dans cet onglet. Télécharger ton bilan permet de la conserver.'; }
    } catch { $('programmeStorage').textContent = 'Ce navigateur ne permet pas la sauvegarde. Ta progression reste dans cet onglet ; tu peux télécharger ton bilan.'; }
  }
  function fillForm() {
    if (!state) return;
    $('programmePlan').value = state.plan; $('programmeGoal').value = state.goal;
    $('programmeTime').value = String(state.minutes); $('programmeEnergy').value = state.energy;
    $('programmeRemember').checked = state.remember;
  }
  function render(focus = false) {
    resetPending = false; $('programmeReset').textContent = 'Effacer mon parcours';
    $('programmeForm').hidden = true; $('programmeDashboard').hidden = false;
    const plan = core.PLANS[state.plan], task = core.task(state), exercise = core.workshop(state);
    $('dashboardPlan').textContent = plan.name + ' · aperçu gratuit';
    $('dashboardTitle').textContent = task ? 'Un petit pas à ta portée.' : 'Ton parcours est terminé !';
    $('programmeSummary').textContent = `Mon intention : ${core.GOALS[state.goal]}. ${state.plan === 'totale' ? 'Trois phases : explorer, expérimenter, consolider.' : 'Un objectif, un exercice à la fois.'}`;
    $('programmeCompleted').textContent = state.completed; $('programmeDuration').textContent = plan.days;
    $('programmeMinutes').textContent = task?.minutes || state.minutes;
    $('programmeProgress').max = plan.days; $('programmeProgress').value = state.completed;
    const weeks = Math.floor(state.completed / 7);
    $('programmeReview').textContent = !state.completed ? 'Le bilan se construit avec tes actions. À la fin de chaque série de sept pas, prends un moment pour choisir ce qui te sert.' : `${state.completed} action${state.completed > 1 ? 's' : ''} cochée${state.completed > 1 ? 's' : ''}${weeks ? `, soit ${weeks} série${weeks > 1 ? 's' : ''} de sept pas` : ''}. Qu’est-ce qui a été utile ? Qu’aimerais-tu alléger ? Garde une seule priorité pour la suite.`;
    $('programmeRoadmap').textContent = state.plan === 'totale' ? 'Étapes 1–30 : explorer · 31–60 : expérimenter · 61–90 : consolider. Les exercices reviennent avec de nouvelles consignes pour approfondir.' : 'Étapes 1–10 : découvrir · 11–20 : tester · 21–30 : installer un rythme. Les exercices reviennent pour être appliqués à ta vraie vie.';
    $('taskDay').textContent = task ? `Étape ${task.day} / ${plan.days} · ${task.stage}` : 'Bilan de fin de parcours';
    $('taskTitle').textContent = task?.title || 'Tu peux être fière des pas parcourus.';
    $('taskText').textContent = task?.text || 'Télécharge ton bilan. Choisis ensuite une chose à garder et un rythme réaliste pour la suite.';
    $('taskTip').textContent = task?.tip || 'Les étapes ne sont pas une course. Tu peux revenir quand tu veux.';
    $('taskComplete').disabled = !task; $('taskComplete').textContent = task ? 'C’est fait ✓' : 'Parcours terminé ✓';
    $('programmeAdaptive').hidden = state.plan === 'douce'; $('checkinEnergy').value = state.energy;
    $('programmeWorkshop').hidden = !exercise;
    if (exercise) { $('workshopTitle').textContent = exercise.title; $('workshopText').textContent = exercise.text; }
    save(); if (focus) $('dashboardTitle').focus({ preventScroll: true });
  }
  $('programmeForm').addEventListener('submit', e => {
    e.preventDefault(); clearAudio();
    const input = { plan: $('programmePlan').value, goal: $('programmeGoal').value, minutes: Number($('programmeTime').value), energy: $('programmeEnergy').value, remember: $('programmeRemember').checked };
    const preserving = state && state.goal === input.goal && state.plan === input.plan;
    state = core.normalize({ ...input, completed: preserving ? state.completed : 0, workshop: 0 });
    render(true); status('Ton aperçu est prêt. Les fiches sont préécrites et adaptées à tes choix ; aucune IA connectée.');
  });
  $('programmeEdit').addEventListener('click', () => { clearAudio(); fillForm(); $('programmeDashboard').hidden = true; $('programmeForm').hidden = false; status('Changer d’objectif ou de formule recommence le parcours. Modifier le temps ou l’énergie conserve les actions faites.'); $('programmePlan').focus({ preventScroll: true }); });
  document.querySelectorAll('[data-choose-plan]').forEach(link => link.addEventListener('click', () => {
    // Le CTA du quiz utilise la même sélection, même après un nouveau résultat.
    const plan = link.dataset.choosePlan;
    if (!core.PLANS[plan]) return;
    clearAudio();
    fillForm(); $('programmePlan').value = plan;
    $('programmeDashboard').hidden = true; $('programmeForm').hidden = false;
    status('Explore ce parcours gratuitement. Changer de formule ou d’objectif recommence le parcours ; aucun abonnement ne sera créé.');
  }));
  // Le lien de résultat est renseigné après le quiz.
  $('resultCta').addEventListener('click', () => { const plan = $('resultCta').dataset.choosePlan; if (core.PLANS[plan]) { fillForm(); $('programmePlan').value = plan; } });
  $('taskComplete').addEventListener('click', () => {
    if (!state || !core.task(state)) return;
    clearAudio(); state.completed++; render(true);
    status(state.completed === core.PLANS[state.plan].days ? 'Parcours terminé. Ton bilan est disponible au téléchargement.' : `Action ${state.completed} enregistrée. Le prochain pas est prêt ; tu peux revenir plus tard.`);
  });
  $('checkinApply').addEventListener('click', () => {
    if (!state || state.plan === 'douce') return;
    clearAudio(); state.energy = $('checkinEnergy').value; render();
    $('checkinFeedback').textContent = state.energy === 'doucement' ? 'La prochaine fiche est allégée à 5 minutes maximum.' : 'Ton rythme est ajusté à ton temps disponible.';
    status('Bilan enregistré. Le parcours s’adapte par règles à ton choix d’énergie.');
  });
  $('workshopNext').addEventListener('click', () => { if (!state) return; state.workshop = (state.workshop + 1) % 3; render(); status('Un autre exercice est prêt.'); });
  $('taskAudio').addEventListener('click', () => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { $('audioStatus').textContent = 'La lecture audio n’est pas disponible dans ce navigateur. La fiche reste accessible en texte.'; return; }
    if (window.speechSynthesis.speaking) { clearAudio(); $('audioStatus').textContent = 'Lecture arrêtée.'; return; }
    const utterance = new SpeechSynthesisUtterance(`${$('taskTitle').textContent}. ${$('taskText').textContent} ${$('taskTip').textContent}`);
    utterance.lang = 'fr-FR'; utterance.rate = .95;
    utterance.onend = () => { $('audioStatus').textContent = 'Lecture terminée.'; };
    utterance.onerror = () => { $('audioStatus').textContent = 'Lecture interrompue ou indisponible. La fiche reste en texte.'; };
    window.speechSynthesis.speak(utterance); $('audioStatus').textContent = 'Lecture en cours. Appuie à nouveau sur Écouter pour l’arrêter.';
  });
  $('programmeExport').addEventListener('click', () => {
    if (!state) return;
    const next = core.task(state);
    const lines = ['BOUM! — Mon bilan de parcours', '', `Formule explorée : ${core.PLANS[state.plan].name}`, `Intention : ${core.GOALS[state.goal]}`, `Actions faites : ${state.completed} / ${core.PLANS[state.plan].days}`, `Temps choisi : ${state.minutes} minutes`, `Énergie : ${state.energy}`, '', 'Actions réalisées :'];
    for (let i = 0; i < state.completed; i++) { const done = core.task({ ...state, completed: i }); lines.push(`${i + 1}. ${done.title} — ${done.stage}`); }
    lines.push('', next ? `Prochain pas : ${next.title}\n${next.text}\n${next.tip}` : 'Parcours terminé.', '', 'Cet aperçu utilise des contenus préécrits. Aucune génération IA, aucun abonnement, aucun suivi professionnel.');
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'BOUM-mon-bilan.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); status('Ton bilan a été préparé pour le téléchargement.');
  });
  $('programmeReset').addEventListener('click', () => {
    if (!resetPending) { resetPending = true; $('programmeReset').textContent = 'Confirmer l’effacement'; status('Cette action efface la progression de cet appareil. Appuie une seconde fois pour confirmer.'); return; }
    clearAudio(); state = null; try { localStorage.removeItem(KEY); } catch {}
    $('programmeDashboard').hidden = true; $('programmeForm').hidden = false; $('programmeRemember').checked = false;
    status('Parcours effacé. Tu peux repartir quand tu veux.'); $('programmePlan').focus({ preventScroll: true });
  });
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { state = core.normalize(JSON.parse(raw)); if (state?.remember) { fillForm(); render(); status('Ton parcours sauvegardé a été retrouvé sur cet appareil.'); } else { state = null; localStorage.removeItem(KEY); } }
  } catch { state = null; status('L’aperçu fonctionne sans sauvegarde sur cet appareil.'); }
  window.addEventListener('pagehide', clearAudio);
});
