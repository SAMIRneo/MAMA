document.addEventListener('DOMContentLoaded',()=>{
  'use strict';
  const burger=document.getElementById('burger'), links=document.getElementById('navLinks');
  if(burger&&links){
    const close=()=>{links.classList.remove('is-open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Ouvrir le menu');};
    burger.addEventListener('click',()=>{const open=burger.getAttribute('aria-expanded')!=='true';links.classList.toggle('is-open',open);burger.setAttribute('aria-expanded',String(open));burger.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&burger.getAttribute('aria-expanded')==='true'){close();burger.focus();}});
    document.addEventListener('click',e=>{if(!e.target.closest('.nav'))close();});
    window.matchMedia('(min-width: 801px)').addEventListener('change',e=>{if(e.matches)close();});
  }
  const core=window.BoumProgramme;
  const $=id=>document.getElementById(id);
  if(!$('bilan'))return;
  let step=0,answers=[], recommendation=null;
  function showQuestion(focus=false){
    const q=core.questions[step];
    $('finderQuestions').hidden=false;$('finderResult').hidden=true;
    $('finderTitle').textContent=q.title;$('finderCount').textContent=`${step+1} / 3 · ${q.label}`;
    $('finderBar').style.width=`${((step+1)/3)*100}%`;$('finderBack').hidden=step===0;
    $('finderAnswers').replaceChildren();
    q.choices.forEach(choice=>{
      const button=document.createElement('button');button.type='button';button.dataset.answer=choice.value;
      const icon=document.createElement('span');icon.className='answer-icon';icon.setAttribute('aria-hidden','true');icon.textContent=choice.icon;
      const label=document.createElement('span');label.textContent=choice.text;
      const arrow=document.createElement('span');arrow.className='answer-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='→';
      button.append(icon,label,arrow);
      button.addEventListener('click',()=>{answers[step]=choice.value;answers=answers.slice(0,step+1);if(step<2){step++;showQuestion(true);}else showResult();});
      $('finderAnswers').append(button);
    });
    if(focus)$('finderTitle').focus({preventScroll:true});
  }
  function showResult(){
    recommendation=core.recommend(answers);if(!recommendation)return;
    const c=core.courses[recommendation.courseId];
    $('finderQuestions').hidden=true;$('finderResult').hidden=false;
    $('resultTitle').textContent=`${c.name} — ${c.title}`;$('resultReason').textContent=recommendation.reason;
    $('resultAction').textContent=recommendation.firstStep;
    $('resultPace').textContent=`Une première leçon gratuite de 1 minute. Pour la formation complète : ton rythme de ${recommendation.minutes} minutes par séance. Tu peux choisir un autre parcours.`;
    $('resultDetail').href=`formations/${c.slug}/`;
    $('finderStatus').textContent=`Ton parcours conseillé est ${c.name}.`;
    $('resultTitle').focus({preventScroll:true});
  }
  $('finderBack').addEventListener('click',()=>{if(step>0){step--;showQuestion(true);}});
  $('finderRestart').addEventListener('click',()=>{step=0;answers=[];recommendation=null;$('finderStatus').textContent='';showQuestion(true);});
  $('resultStart').addEventListener('click',()=>{if(recommendation)document.dispatchEvent(new CustomEvent('boum:start',{detail:recommendation}));});
  document.querySelectorAll('[data-course-start]').forEach(button=>button.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('boum:start',{detail:{courseId:button.dataset.courseStart,minutes:10,obstacle:'temps'}}))));
  showQuestion();
  if(location.hash==='#quiz')location.replace('#bilan');
});
