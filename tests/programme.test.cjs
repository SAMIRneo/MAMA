const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../programme-core.js');
const state = (overrides = {}) => ({ plan: 'douce', goal: 'temps', minutes: 10, energy: 'stable', completed: 0, ...overrides });
test('tous les objectifs et formules atteignent leur fin sans fiche manquante', () => {
  for (const plan of Object.keys(core.PLANS)) for (const goal of Object.keys(core.GOALS)) {
    const days = core.PLANS[plan].days;
    for (let i = 0; i < days; i++) {
      const task = core.task(state({ plan, goal, completed: i }));
      assert.equal(task.day, i + 1); assert.ok(task.title && task.text && task.stage && task.tip);
    }
    assert.equal(core.task(state({ plan, goal, completed: days })), null);
  }
});
test('batterie basse réduit le pas sans modifier la progression', () => {
  const s = state({ plan: 'solide', energy: 'doucement', minutes: 20, completed: 17 });
  assert.equal(core.task(s).minutes, 5); assert.equal(core.task(s).day, 18); assert.equal(s.completed, 17);
});
test('les ateliers appartiennent aux deux formules approfondies', () => {
  assert.equal(core.workshop(state()), null); assert.ok(core.workshop(state({ plan: 'solide' })).text);
  assert.match(core.workshop(state({ plan: 'totale' })).text, /Mise en situation/);
});
test('les cycles approfondissent la fiche plutôt que réinitialiser le parcours', () => {
  const first = core.task(state()), second = core.task(state({ completed: 10 }));
  assert.equal(first.title, second.title); assert.notEqual(first.text, second.text); assert.notEqual(first.stage, second.stage);
});
test('les états stockés invalides sont rejetés et les compteurs sont bornés', () => {
  assert.equal(core.normalize(null), null); assert.equal(core.normalize(state({ plan: '__proto__' })), null);
  assert.equal(core.normalize(state({ goal: 'inconnue' })), null); assert.equal(core.normalize(state({ minutes: 500 })), null);
  assert.equal(core.normalize(state({ energy: 'inconnue' })), null); assert.equal(core.normalize(state({ completed: -2 })).completed, 0);
  assert.equal(core.normalize(state({ completed: 999 })).completed, 30); assert.equal(core.normalize(state({ workshop: Infinity })).workshop, 0);
  assert.equal(core.normalize(state({ completed: Infinity })).completed, 0); assert.equal(core.normalize(state({ remember: 'true' })).remember, false);
});
