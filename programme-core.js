(function(root){
  'use strict';
  const data = typeof module === 'object' && module.exports ? require('./formations.js') : root.BoumFormations;
  const { courses } = data;
  const obstacles = {
    temps: 'tes journées laissent peu de marge',
    culpabilite: 'tu as du mal à te choisir sans culpabiliser',
    flou: 'tu ne sais pas encore par quel geste commencer'
  };
  const questions = [
    { label:'Ta priorité', title:'Qu’est-ce qui te ferait du bien, là ?', choices:[
      {value:'douce',icon:'☕',text:'Alléger tout ce que je porte'},
      {value:'solide',icon:'✋',text:'Oser dire ce dont j’ai besoin'},
      {value:'totale',icon:'🌻',text:'Retrouver un cap pour moi'}
    ]},
    { label:'Ton quotidien', title:'Qu’est-ce qui te freine le plus ?', choices:[
      {value:'temps',icon:'◷',text:'Mes journées sont déjà pleines'},
      {value:'culpabilite',icon:'♡',text:'Je culpabilise de penser à moi'},
      {value:'flou',icon:'↗',text:'Je ne sais pas par où commencer'}
    ]},
    { label:'Ton rythme', title:'Un créneau réaliste pour toi ?', choices:[
      {value:'5',icon:'·',text:'5 minutes · juste l’essentiel'},
      {value:'10',icon:'··',text:'10 minutes · un petit rendez-vous'},
      {value:'15',icon:'···',text:'15 minutes · le temps d’explorer'}
    ]}
  ];
  function recommend(answers){
    if(!Array.isArray(answers)||answers.length!==3)return null;
    const [courseId, obstacle, rawMinutes]=answers, minutes=Number(rawMinutes);
    if(!Object.hasOwn(courses,courseId)||!Object.hasOwn(obstacles,obstacle)||![5,10,15].includes(minutes))return null;
    const c=courses[courseId];
    const priorities={douce:'alléger ce que tu portes',solide:'faire entendre tes besoins',totale:'retrouver un cap personnel'};
    return {courseId,obstacle,minutes,reason:`Tu veux ${priorities[courseId]}, et ${obstacles[obstacle]}. ${c.name} te donne un cadre pour commencer par ce besoin précis.`, firstStep:c.firstStep};
  }
  function fresh(){return {version:3,active:'douce',minutes:10,obstacle:'temps',remember:false,courses:{}};}
  function normalize(input){
    if(!input||input.version!==3||!Object.hasOwn(courses,input.active))return null;
    const state=fresh(); state.active=input.active;
    state.minutes=[5,10,15].includes(input.minutes)?input.minutes:10;
    state.obstacle=Object.hasOwn(obstacles,input.obstacle)?input.obstacle:'temps';state.remember=input.remember===true;
    for(const c of Object.values(courses)){
      const record=input.courses && Object.hasOwn(input.courses,c.id) ? input.courses[c.id] : null;
      if(!record||typeof record!=='object')continue;
      const validIds=new Set(c.lessons.map(l=>l.id));
      const done=Array.isArray(record.done)?[...new Set(record.done.filter(id=>validIds.has(id)))]:[];
      const current=Number.isInteger(record.current)?Math.min(1,Math.max(0,record.current)):0;
      const notes={};if(record.notes&&typeof record.notes==='object')for(const l of c.lessons){if(Object.hasOwn(record.notes,l.id)&&typeof record.notes[l.id]==='string')notes[l.id]=record.notes[l.id].slice(0,1200);}
      state.courses[c.id]={current,done,notes};
    }
    return state;
  }
  function record(state){return state.courses[state.active] ||= {current:0,done:[],notes:{}};}
  function pace(minutes){return ({5:'Version essentielle : lis l’idée, choisis une seule partie de l’exercice et garde une phrase.',10:'À ton rythme : fais l’exercice, puis note ce que tu souhaites retenir.',15:'Pour approfondir : fais l’exercice, regarde l’exemple et prépare un petit essai dans ta semaine.'})[minutes];}
  const api={courses,questions,recommend,fresh,normalize,record,pace};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.BoumProgramme=api;
})(typeof window!=='undefined'?window:globalThis);
