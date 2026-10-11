const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../programme-core.js');
test('les 27 combinaisons orientent selon le besoin, pas le prix ou le manque de temps',()=>{
 for(const courseId of ['douce','solide','totale'])for(const obstacle of ['temps','culpabilite','flou'])for(const minutes of ['5','10','15']){
 const r=core.recommend([courseId,obstacle,minutes]);assert.equal(r.courseId,courseId);assert.equal(r.minutes,Number(minutes));assert.ok(r.reason&&r.firstStep);
 }
});
test('un bilan incomplet ou invalide ne produit pas de recommandation',()=>{
 for(const answers of [null,[],['douce'],['inconnue','temps','5'],['douce','x','5'],['douce','temps','500'],['__proto__','temps','5']])assert.equal(core.recommend(answers),null);
});
test('seule une courte découverte est présente dans le catalogue public',()=>{
 const lessons=Object.values(core.courses).flatMap(c=>c.lessons);assert.equal(lessons.length,3);assert.equal(new Set(lessons.map(l=>l.id)).size,3);
 for(const l of lessons)for(const key of ['idea','action','example','output'])assert.ok(typeof l[key]==='string'&&l[key].length>15);
 for(const c of Object.values(core.courses)){assert.equal(c.lessons.length,1);assert.equal(c.lessons[0].duration,1);assert.ok(c.lessons[0].action.split(' ').length<80);assert.ok(c.advantages.some(a=>a.toLowerCase().includes('respiration')));assert.ok(c.advantages.some(a=>a.toLowerCase().includes('méditation')));for(const m of c.modules)assert.equal(m.lessons,undefined);}
});
test('la restauration ignore les identifiants étrangers et borne les notes',()=>{
 const state=core.normalize({version:3,active:'douce',minutes:999,remember:'true',courses:{douce:{current:999,done:['douce-preview','douce-preview','totale-preview','x'],notes:{'douce-preview':'a'.repeat(2000),'x':'invalide'}}}});
 assert.equal(state.minutes,10);assert.equal(state.remember,false);assert.equal(state.courses.douce.current,1);assert.deepEqual(state.courses.douce.done,['douce-preview']);assert.equal(state.courses.douce.notes['douce-preview'].length,1200);assert.equal(Object.keys(state.courses.douce.notes).length,1);
 assert.equal(core.normalize({version:2,active:'douce'}),null);assert.equal(core.normalize({version:3,active:'__proto__'}),null);
});
test('changer de formation conserve des carnets distincts',()=>{
 const s=core.fresh();core.record(s).notes['douce-preview']='Ma note';s.active='solide';assert.deepEqual(core.record(s).notes,{});s.active='douce';assert.equal(core.record(s).notes['douce-preview'],'Ma note');
});
