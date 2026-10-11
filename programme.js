document.addEventListener('DOMContentLoaded',()=>{
  'use strict';
  const $=id=>document.getElementById(id);if(!$('programme'))return;
  const core=window.BoumProgramme, KEY='boum-formations-v2';
  let state=core.fresh(),resetPending=false,audioSerial=0;
  const announce=text=>{$('notebookStatus').textContent=text;};
  function stopAudio(){audioSerial++;if('speechSynthesis'in window)window.speechSynthesis.cancel();$('audioStatus').textContent='';$('listenLesson').textContent='Écouter la leçon';}
  function save(){
    try{
      if(state.remember){localStorage.setItem(KEY,JSON.stringify(state));$('storageStatus').textContent='Carnet enregistré dans ce navigateur, sur cet appareil uniquement.';}
      else{localStorage.removeItem(KEY);$('storageStatus').textContent='Carnet gardé uniquement dans cet onglet. Télécharge-le avant de fermer si tu veux le conserver.';}
      return true;
    }catch{$('storageStatus').textContent='La sauvegarde est indisponible. Ton carnet reste dans cet onglet ; tu peux le télécharger.';return false;}
  }
  function render(focus=false){
    const c=core.courses[state.active],r=core.record(state),l=c.lessons[r.current];
    resetPending=false;$('resetNotebook').textContent='Effacer mes données';
    $('courseSelect').value=c.id;$('paceSelect').value=state.minutes;$('remember').checked=state.remember;
    $('lessonProgressText').textContent=`${r.done.length} / ${c.lessons.length} leçons terminées`;
    $('lessonProgress').max=c.lessons.length;$('lessonProgress').value=r.done.length;
    $('lessonKicker').textContent=`${c.name} · Module ${l.moduleIndex+1} / ${c.modules.length}`;
    $('lessonDuration').textContent=`${state.minutes} min`;$('lessonTitle').textContent=l.title;$('lessonIdea').textContent=l.idea;
    $('lessonAction').textContent=l.action;$('lessonExample').textContent=l.example;$('lessonOutput').textContent=l.output;
    $('lessonPace').textContent=core.pace(state.minutes);$('lessonNote').value=r.notes[l.id]||'';
    $('lessonPosition').textContent=`${r.current+1} / ${c.lessons.length}`;
    $('previousLesson').disabled=r.current===0;$('nextLesson').disabled=r.current===c.lessons.length-1;
    const done=r.done.includes(l.id);$('completeLesson').textContent=done?'Exercice terminé ✓':'J’ai fait cet exercice ✓';$('completeLesson').disabled=done;
    $('courseFinished').hidden=r.done.length!==c.lessons.length;
    $('lessonList').replaceChildren();
    c.lessons.forEach((item,i)=>{const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.textContent=`${r.done.includes(item.id)?'✓ ':''}${i+1}. ${item.title}`;if(i===r.current)b.setAttribute('aria-current','step');b.addEventListener('click',()=>{stopAudio();r.current=i;render(true);});li.append(b);$('lessonList').append(li);});
    save();if(focus)$('lessonTitle').focus({preventScroll:true});
  }
  function selectCourse(id,minutes,obstacle,scroll=false){
    if(!Object.hasOwn(core.courses,id))return;stopAudio();state.active=id;
    if([5,10,15].includes(minutes))state.minutes=minutes;if(['temps','culpabilite','flou'].includes(obstacle))state.obstacle=obstacle;
    render(true);announce(`Ton carnet ${core.courses[id].name} est ouvert. Les notes de tes autres formations sont conservées dans cette session.`);
    if(scroll){$('programme').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
  }
  $('courseSelect').addEventListener('change',e=>selectCourse(e.target.value));
  $('paceSelect').addEventListener('change',e=>{stopAudio();state.minutes=Number(e.target.value);render();announce('Le format de la leçon est ajusté au temps choisi.');});
  $('remember').addEventListener('change',e=>{state.remember=e.target.checked;const saved=save();announce(saved?(state.remember?'La sauvegarde sur cet appareil est activée.':'La sauvegarde est désactivée et la copie enregistrée de ce carnet a été retirée.'):'Le navigateur bloque cette modification du stockage. Tu peux continuer dans cet onglet et gérer les données enregistrées dans les paramètres du navigateur.');});
  $('lessonNote').addEventListener('input',e=>{const r=core.record(state),l=core.courses[state.active].lessons[r.current];r.notes[l.id]=e.target.value.slice(0,1200);save();});
  $('completeLesson').addEventListener('click',()=>{const r=core.record(state),c=core.courses[state.active],id=c.lessons[r.current].id;if(!r.done.includes(id))r.done.push(id);render();announce(r.done.length===c.lessons.length?'Toutes les leçons sont terminées. Ton carnet est prêt à être téléchargé.':'Exercice enregistré. Passe à la leçon suivante quand tu le souhaites.');});
  for(const [button,direction]of[['previousLesson',-1],['nextLesson',1]])$(button).addEventListener('click',()=>{const r=core.record(state);r.current=Math.max(0,Math.min(core.courses[state.active].lessons.length-1,r.current+direction));stopAudio();render(true);});
  $('listenLesson').addEventListener('click',()=>{
    if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){$('audioStatus').textContent='La lecture audio est indisponible dans ce navigateur. Le texte reste accessible.';return;}
    if(window.speechSynthesis.speaking||window.speechSynthesis.pending){stopAudio();$('audioStatus').textContent='Lecture arrêtée.';return;}
    const l=core.courses[state.active].lessons[core.record(state).current],utterance=new SpeechSynthesisUtterance(`${l.title}. ${l.idea} À toi d’essayer. ${l.action} ${core.pace(state.minutes)}`),serial=++audioSerial;
    utterance.lang='fr-FR';utterance.rate=.95;
    const finish=text=>{if(serial===audioSerial){$('audioStatus').textContent=text;$('listenLesson').textContent='Écouter la leçon';}};
    utterance.onend=()=>finish('Lecture terminée.');utterance.onerror=()=>finish('La lecture n’a pas pu se terminer. Le texte reste disponible.');
    $('listenLesson').textContent='Arrêter la lecture';$('audioStatus').textContent='Lecture en cours.';window.speechSynthesis.speak(utterance);
  });
  $('exportNotebook').addEventListener('click',()=>{
    const lines=['BOUM! — Mon carnet de formations','Mes notes et mes exercices',''];
    for(const c of Object.values(core.courses)){const r=state.courses[c.id];if(!r)continue;lines.push(`${c.name} — ${c.title}`,`${r.done.length}/${c.lessons.length} leçons terminées`,'');for(const l of c.lessons){if(r.done.includes(l.id)||r.notes[l.id])lines.push(`${r.done.includes(l.id)?'[FAIT]':'[EN COURS]'} ${l.title}`,`À garder : ${l.output}`,`Ma note : ${r.notes[l.id]||'(aucune note)'}`,'');}const next=c.lessons.find(l=>!r.done.includes(l.id));if(next)lines.push(`Prochaine leçon non terminée : ${next.title}`,next.action,'');}
    lines.push('Contenus préécrits proposés en autonomie. Ce carnet ne constitue ni un diagnostic ni une certification.');
    const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='BOUM-mon-carnet.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Le téléchargement de ton carnet est prêt.');
  });
  $('resetNotebook').addEventListener('click',()=>{
    if(!resetPending){resetPending=true;$('resetNotebook').textContent='Confirmer l’effacement';announce('Appuie une seconde fois pour effacer les notes et la progression de toutes tes formations sur cet appareil.');return;}
    stopAudio();state=core.fresh();let erased=true;try{localStorage.removeItem(KEY);localStorage.removeItem('boum-parcours-v1');}catch{erased=false;}
    render();announce(erased?'Tes notes et ta progression ont été effacées de ce carnet.':'Le carnet est vidé dans cet onglet. Le navigateur bloque l’effacement du stockage ; retire les données du site dans ses paramètres pour effacer la copie enregistrée.');
  });
  let restored=false;try{const raw=localStorage.getItem(KEY);if(raw){const parsed=core.normalize(JSON.parse(raw));if(parsed?.remember){state=parsed;restored=true;}else localStorage.removeItem(KEY);}}catch{announce('Le carnet fonctionne dans cet onglet, sans restauration de données.');}
  const requested=new URLSearchParams(location.search).get('formation');if(requested&&Object.hasOwn(core.courses,requested))state.active=requested;
  render();if(restored)announce('Ton carnet enregistré sur cet appareil a été retrouvé.');
  document.addEventListener('boum:start',e=>{const d=e.detail||{};selectCourse(d.courseId,d.minutes,d.obstacle,true);});
  window.addEventListener('pagehide',stopAudio);
});
