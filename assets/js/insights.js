(function(){
'use strict';
const dictionary={
en:{home:'Home',work:'Projects',journal:'Insights',talk:"Let's talk",label:'Ideas / Journal',head1:'Ideas.',head2:'Design.',head3:'Perspective.',intro:'Thoughts on visual communication, branding, creative direction and the tools shaping our profession.',featured:'Selected thoughts',selection:'From LinkedIn · Editorial selection',read:'Read on LinkedIn',feed:'Latest on LinkedIn',feedLabel:'Social / Live feed',feedIntro:'New public posts will appear here once the LinkedIn feed connection is enabled.',follow:'See my LinkedIn',closing:'Have something in mind?',closingNote:'Let’s make it meaningful.'},
es:{home:'Inicio',work:'Proyectos',journal:'Ideas',talk:'Hablemos',label:'Ideas / Cuaderno',head1:'Ideas.',head2:'Diseño.',head3:'Criterio.',intro:'Reflexiones sobre comunicación visual, branding, dirección creativa y las herramientas que están transformando nuestra profesión.',featured:'Ideas destacadas',selection:'Desde LinkedIn · Selección editorial',read:'Leer en LinkedIn',feed:'Lo último en LinkedIn',feedLabel:'Social / Publicaciones',feedIntro:'Las nuevas publicaciones públicas aparecerán aquí cuando se active la conexión del feed de LinkedIn.',follow:'Ver mi LinkedIn',closing:'¿Tenés un proyecto en mente?',closingNote:'Hagamos que tenga sentido.'},
it:{home:'Home',work:'Progetti',journal:'Idee',talk:'Parliamone',label:'Idee / Journal',head1:'Idee.',head2:'Design.',head3:'Visione.',intro:'Riflessioni su comunicazione visiva, branding, direzione creativa e strumenti che stanno trasformando la nostra professione.',featured:'Idee in evidenza',selection:'Da LinkedIn · Selezione editoriale',read:'Leggi su LinkedIn',feed:'Ultimi post su LinkedIn',feedLabel:'Social / Feed',feedIntro:'I nuovi post pubblici appariranno qui dopo l’attivazione del collegamento al feed di LinkedIn.',follow:'Vai al mio LinkedIn',closing:'Hai un progetto in mente?',closingNote:'Diamo forma a qualcosa di significativo.'}
};
function translate(lang){
lang=dictionary[lang]?lang:'en';document.documentElement.lang=lang;
document.querySelectorAll('[data-i18n]').forEach(el=>{const value=dictionary[lang][el.dataset.i18n];if(value!==undefined)el.textContent=value});
document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===lang)));
try{localStorage.setItem('robGD-language',lang)}catch(e){}
}
let lang='en';try{lang=localStorage.getItem('robGD-language')||'en'}catch(e){}
translate(lang);
document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',()=>translate(el.dataset.lang)));

// Official Elfsight embed integration is intentionally dormant until its real widget ID is supplied.
// Personal LinkedIn profile content cannot be polled with standard read permissions.
// After connecting the public profile through Elfsight, put its UUID below and deploy.
const ROBGD_ELFSIGHT_WIDGET_ID = '';
const id=ROBGD_ELFSIGHT_WIDGET_ID.trim();
if(/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(id)){
 const mount=document.getElementById('linkedin-widget');
 const fallback=document.getElementById('linkedin-fallback');
 if(mount){
  const frame=document.createElement('div');
  frame.className='elfsight-app-'+id;
  frame.setAttribute('data-elfsight-app-lazy','');
  mount.appendChild(frame);mount.hidden=false;
  if(fallback)fallback.hidden=true;
  const script=document.createElement('script');
  script.src='https://elfsightcdn.com/platform.js';script.async=true;
  document.head.appendChild(script);
 }
}
})();