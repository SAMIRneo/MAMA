document.addEventListener('DOMContentLoaded',()=>{
  'use strict';
  const $=id=>document.getElementById(id);if(!$('programme'))return;
  const core=window.BoumProgramme, KEY='boum-formations-v3';
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
    const c=core.courses[state.active],r=core.record(state),l=c.lessons[0],locked=r.current===1;
    resetPending=false;$('resetNotebook').textContent='Effacer mes données';
    $('courseSelect').value=c.id;$('paceSelect').value=state.minutes;$('remember').checked=state.remember;
    $('lessonProgressText').textContent=r.done.length?'Première leçon gratuite terminée':'Première leçon gratuite';
    $('lessonProgress').max=c.lessons.length;$('lessonProgress').value=r.done.length;
    $('lessonKicker').textContent=`${c.name} · ${locked?'Formation complète payante':'Découverte gratuite'}`;
    $('lessonDuration').textContent=locked?`${c.price} €`:'1 min';$('lessonTitle').textContent=l.title;$('lessonIdea').textContent=l.idea;
    $('lessonAction').textContent=l.action;$('lessonExample').textContent=l.example;$('lessonOutput').textContent=l.output;
    $('lessonPace').textContent='Une minute suffit. Respire naturellement, sans retenir ton souffle ni forcer. Tu peux passer cet exercice s’il ne te convient pas.';$('lessonNote').value=r.notes[l.id]||'';
    $('lessonPosition').textContent=locked?'Formation complète':'Découverte';
    $('previousLesson').disabled=r.current===0;$('nextLesson').disabled=locked;$('nextLesson').textContent='La suite →';
    const done=r.done.includes(l.id);$('completeLesson').textContent=done?'Exercice terminé ✓':'J’ai fait cet exercice ✓';$('completeLesson').disabled=done;
    $('courseFinished').hidden=locked||r.done.length!==1;
    $('previewContent').hidden=locked;$('lessonPaywall').hidden=!locked;
    document.querySelector('.lesson').setAttribute('aria-labelledby',locked?'paywallTitle':'lessonTitle');
    $('paywallBenefits').replaceChildren();c.advantages.forEach(text=>{const li=document.createElement('li');li.textContent=text;$('paywallBenefits').append(li);});
    $('paywallBuy').textContent=`Découvrir ${c.name} · ${c.price} € →`;
    $('lessonList').replaceChildren();
    [{title:'Une minute pour toi · gratuit',current:0},{title:'✦ Formation complète · accès payant',current:1}].forEach(item=>{const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.textContent=item.title;if(item.current===r.current)b.setAttribute('aria-current','step');b.addEventListener('click',()=>{stopAudio();r.current=item.current;render(true);});li.append(b);$('lessonList').append(li);});
    save();if(focus){if(locked){$('lessonPaywall').querySelector('h3').setAttribute('tabindex','-1');$('lessonPaywall').querySelector('h3').focus({preventScroll:true});}else $('lessonTitle').focus({preventScroll:true});}
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
  $('lessonNote').addEventListener('input',e=>{const r=core.record(state);if(r.current!==0)return;const l=core.courses[state.active].lessons[0];r.notes[l.id]=e.target.value.slice(0,1200);save();});
  $('completeLesson').addEventListener('click',()=>{const r=core.record(state);if(r.current!==0)return;const id=core.courses[state.active].lessons[0].id;if(!r.done.includes(id))r.done.push(id);render();announce('Ta première leçon gratuite est terminée. La suite fait partie de la formation complète payante.');});
  for(const [button,direction]of[['previousLesson',-1],['nextLesson',1]])$(button).addEventListener('click',()=>{const r=core.record(state);r.current=Math.max(0,Math.min(1,r.current+direction));stopAudio();render(true);});
  $('paywallBuy').addEventListener('click',()=>{location.href=`formations/${core.courses[state.active].slug}/`;});
  let selectedVoice='';
  function populateVoices(){
    if(!('speechSynthesis'in window)){$('voiceSelect').disabled=true;return;}
    const rank=v=>/denise|natural|neural|google.*fran/i.test(v.name)?0:/virginie|julie|audrey|amélie|amelie/i.test(v.name)?1:/hortense/i.test(v.name)?2:3;
    const voices=window.speechSynthesis.getVoices().filter(v=>/^fr/i.test(v.lang)).sort((a,b)=>rank(a)-rank(b));
    $('voiceSelect').replaceChildren();
    if(!voices.length){const opt=document.createElement('option');opt.value='';opt.textContent='Voix française du navigateur';$('voiceSelect').append(opt);return;}
    voices.forEach(v=>{const opt=document.createElement('option');opt.value=v.voiceURI;opt.textContent=v.name.replace(/Microsoft |Google /g,'');$('voiceSelect').append(opt);});
    if(!voices.some(v=>v.voiceURI===selectedVoice))selectedVoice=voices[0].voiceURI;$('voiceSelect').value=selectedVoice;
  }
  $('voiceSelect').addEventListener('change',()=>{stopAudio();selectedVoice=$('voiceSelect').value;});
  if('speechSynthesis'in window)window.speechSynthesis.addEventListener('voiceschanged',populateVoices);populateVoices();
  $('listenLesson').addEventListener('click',()=>{
    if(core.record(state).current!==0)return;
    if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){$('audioStatus').textContent='La lecture audio est indisponible dans ce navigateur. Le texte reste accessible.';return;}
    if(window.speechSynthesis.speaking||window.speechSynthesis.pending){stopAudio();$('audioStatus').textContent='Lecture arrêtée.';return;}
    const l=core.courses[state.active].lessons[0],utterance=new SpeechSynthesisUtterance(`${l.title}… ${l.idea}… ${l.action}`),serial=++audioSerial;
    const voice=window.speechSynthesis.getVoices().find(v=>v.voiceURI===selectedVoice);if(voice)utterance.voice=voice;
    utterance.lang=voice?.lang||'fr-FR';utterance.rate=.82;utterance.pitch=1;utterance.volume=.85;
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
    stopAudio();state=core.fresh();let erased=true;try{localStorage.removeItem(KEY);localStorage.removeItem('boum-formations-v2');localStorage.removeItem('boum-parcours-v1');}catch{erased=false;}
    render();announce(erased?'Tes notes et ta progression ont été effacées de ce carnet.':'Le carnet est vidé dans cet onglet. Le navigateur bloque l’effacement du stockage ; retire les données du site dans ses paramètres pour effacer la copie enregistrée.');
  });
  let restored=false;try{const raw=localStorage.getItem(KEY);if(raw){const parsed=core.normalize(JSON.parse(raw));if(parsed?.remember){state=parsed;restored=true;}else localStorage.removeItem(KEY);}}catch{announce('Le carnet fonctionne dans cet onglet, sans restauration de données.');}
  const requested=new URLSearchParams(location.search).get('formation');if(requested&&Object.hasOwn(core.courses,requested))state.active=requested;
  render();if(restored)announce('Ton carnet enregistré sur cet appareil a été retrouvé.');
  document.addEventListener('boum:start',e=>{const d=e.detail||{};selectCourse(d.courseId,d.minutes,d.obstacle,true);});
  window.addEventListener('pagehide',stopAudio);
});
