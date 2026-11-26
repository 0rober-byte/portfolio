(()=>{'use strict';
const dictionaries={
en:{work:'Work',about:'About',navServices:'Services',top:'Back to top',projects:'Projects',home:'Home',viewWork:'All projects',back:'Back to projects',contact:'Let’s talk',client:'Client',year:'Year',services:'Services',selected:'Selected work',selectedSub:'Design applications',previous:'Previous project',next:'Next project',need:'Want to know more?',contactMore:'Get in touch',collab:'Let’s create something great.',email:'Email'},
es:{work:'Proyectos',about:'Sobre mí',navServices:'Servicios',top:'Volver arriba',projects:'Proyectos',home:'Inicio',viewWork:'Todos los proyectos',back:'Volver a proyectos',contact:'Hablemos',client:'Cliente',year:'Año',services:'Servicios',selected:'Trabajo seleccionado',selectedSub:'Aplicaciones de diseño',previous:'Proyecto anterior',next:'Proyecto siguiente',need:'¿Querés saber más?',contactMore:'Contactame',collab:'Creemos algo excelente.',email:'Email'},
it:{work:'Progetti',about:'Chi sono',navServices:'Servizi',top:'Torna su',projects:'Progetti',home:'Home',viewWork:'Tutti i progetti',back:'Torna ai progetti',contact:'Parliamone',client:'Cliente',year:'Anno',services:'Servizi',selected:'Lavori selezionati',selectedSub:'Applicazioni di design',previous:'Progetto precedente',next:'Progetto successivo',need:'Vuoi saperne di più?',contactMore:'Contattami',collab:'Creiamo qualcosa di speciale.',email:'Email'}
};
function apply(lang){lang=dictionaries[lang]?lang:'en';document.documentElement.lang=lang;try{localStorage.setItem('robGD-language',lang)}catch(e){}
document.querySelectorAll('[data-es][data-it]').forEach(el=>{if(!el.dataset.en)el.dataset.en=el.textContent;el.textContent=lang==='es'?el.dataset.es:lang==='it'?el.dataset.it:el.dataset.en});
document.querySelectorAll('[data-ui]').forEach(el=>{let key=el.dataset.ui;if(dictionaries[lang][key])el.textContent=dictionaries[lang][key]});
document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===lang)));
}
document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>apply(btn.dataset.lang)));
let lang='en';try{lang=localStorage.getItem('robGD-language')||'en'}catch(e){}apply(lang);
document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(!link)return;const url=link.getAttribute('href');if(!url)return;const method=url.startsWith('mailto:')?'Email':url.startsWith('https://wa.me/')?'WhatsApp':null;if(method&&typeof window.va==='function')window.va('event',{name:'Contact Click',data:{method,source:'project_page'}});},{capture:true});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&matchMedia('(hover:hover) and (pointer:fine)').matches){
document.querySelectorAll('.closing').forEach(section=>{
section.addEventListener('pointermove',event=>{const rect=section.getBoundingClientRect();section.style.setProperty('--pointer-x',((event.clientX-rect.left)/rect.width*100)+'%');section.style.setProperty('--pointer-y',((event.clientY-rect.top)/rect.height*100)+'%');});
section.addEventListener('pointerleave',()=>{section.style.setProperty('--pointer-x','50%');section.style.setProperty('--pointer-y','50%');});
});
}
})();
