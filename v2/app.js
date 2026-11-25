(() => {
  'use strict';
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('.site-header'), hero=$('.hero-mosaic'), contact=$('#contact');
  let motionPaused=reduce.matches;

  // Native scrolling and real links keep browser history and deep links reliable.
  function headerState() {
    const atHero=!!hero && hero.getBoundingClientRect().bottom>75;
    const dark=contact.getBoundingClientRect().top<55;
    header.classList.toggle('at-hero',atHero);
    header.classList.toggle('on-dark',dark);
  }
  let queued=false;
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{headerState();queued=false;});}},{passive:true});
  headerState();

  const menu=$('#menu'), opener=$('.menu-button');
  opener.addEventListener('click',()=>{menu.showModal();opener.setAttribute('aria-expanded','true');});
  $('.menu-close').addEventListener('click',()=>menu.close());
  menu.addEventListener('close',()=>{opener.setAttribute('aria-expanded','false');opener.focus({preventScroll:true});});
  $$('.menu-links a').forEach(a=>a.addEventListener('click',()=>menu.close()));
  function updateTheme(theme) {
    document.documentElement.dataset.theme=theme;
    $$('[data-theme]').filter(x=>x.tagName==='BUTTON').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme)));
    $('meta[name="theme-color"]').content=theme==='dark'?'#101010':'#ffffff';
  }
  updateTheme(document.documentElement.dataset.theme||'light');
  $$('.theme-picker button').forEach(b=>b.addEventListener('click',()=>{updateTheme(b.dataset.theme);try{localStorage.setItem('robgd-v2-theme',b.dataset.theme);}catch{}}));

  // Keep forms and the viewport when switching to the equivalent translated page.
  $$('.language a').forEach(a=>a.addEventListener('click',()=>{
    const target=new URL(a.href);
    target.hash=location.hash;
    a.href=target.href;
    try{sessionStorage.setItem('robgd-v2-language-scroll',String(scrollY));}catch{}
  }));
  try {
    const y=sessionStorage.getItem('robgd-v2-language-scroll');
    if(y!==null){sessionStorage.removeItem('robgd-v2-language-scroll');addEventListener('load',()=>scrollTo({top:Number(y),behavior:'instant'}),{once:true});}
  } catch{}

  // Reveals start only when the observer is available; no JS always shows all content.
  if(!reduce.matches && 'IntersectionObserver' in window){
    document.body.classList.add('motion-ready');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target);}}),{threshold:.06});
    $$('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight-30)el.classList.add('pending');observer.observe(el);});
  }

  const motionButton=$('.motion-toggle');
  function setMotion(paused){motionPaused=paused;hero?.classList.toggle('motion-paused',paused);if(motionButton){motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?motionButton.dataset.play:motionButton.dataset.pause);}}
  setMotion(motionPaused);
  motionButton?.addEventListener('click',()=>setMotion(!motionPaused));
  reduce.addEventListener('change',()=>setMotion(reduce.matches));
  if(hero&&'IntersectionObserver'in window)new IntersectionObserver(entries=>hero.classList.toggle('offscreen',!entries[0].isIntersecting)).observe(hero);

  const wheel=$('.wheel-track');
  let wheelVisible=false, wheelIndex=0;
  if(wheel){
    if('IntersectionObserver'in window)new IntersectionObserver(entries=>{wheelVisible=entries[0].isIntersecting;}).observe(wheel);
    setInterval(()=>{
      if(!wheelVisible||motionPaused||document.hidden)return;
      const rows=[...wheel.children];wheelIndex++;
      if(wheelIndex===12){wheelIndex=6;wheel.style.transition='none';wheel.style.transform=`translateY(${-wheelIndex*rows[0].getBoundingClientRect().height}px)`;requestAnimationFrame(()=>requestAnimationFrame(()=>{wheel.style.transition='';}));}
      else wheel.style.transform=`translateY(${-wheelIndex*rows[0].getBoundingClientRect().height}px)`;
      rows.forEach((row,i)=>row.classList.toggle('active',i===wheelIndex+2));
    },2300);
  }

  // Flipbook previews use only the user's own project images, never autoplay audio.
  if(matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce.matches){
    $$('.project-card').forEach(card=>{
      const img=$('img',card), count=$('.shot-counter',card), shots=JSON.parse(card.dataset.shots);
      let timer,index=0;
      function stop(){clearInterval(timer);timer=null;index=0;img.src=shots[0];count.textContent=`1/${shots.length}`;}
      function start(){stop();for(const src of shots.slice(1)){const preload=new Image();preload.src=src;}timer=setInterval(()=>{if(document.hidden||motionPaused)return;index=(index+1)%shots.length;img.src=shots[index];count.textContent=`${index+1}/${shots.length}`;},850);}
      card.addEventListener('pointerenter',start);card.addEventListener('pointerleave',stop);card.addEventListener('blur',stop);
    });
  }

  const booth=$('.portrait-booth');
  function printPortrait(){if(reduce.matches||!booth)return;booth.classList.remove('printing');requestAnimationFrame(()=>requestAnimationFrame(()=>booth.classList.add('printing')));}
  booth?.addEventListener('click',printPortrait);
  if(booth&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){printPortrait();observer.disconnect();}},{threshold:.35});observer.observe(booth);}

  // One open item per accordion, with native keyboard semantics and no hidden focus traps.
  $$('.accordion').forEach(group=>$$('details',group).forEach(item=>item.addEventListener('toggle',()=>{
    if(item.open)$$('details',group).filter(other=>other!==item).forEach(other=>other.open=false);
  })));
  $$('video').forEach(video=>video.addEventListener('play',()=>$$('video').filter(v=>v!==video).forEach(v=>v.pause())));
  addEventListener('pagehide',()=>$$('video').forEach(v=>v.pause()));

  // A real email handoff, accurately labelled. No fake success and no unconfigured backend.
  const form=$('#contact-form');
  let message='';
  try {const draft=JSON.parse(sessionStorage.getItem('robgd-v2-draft')||'null');if(draft)for(const [key,value]of Object.entries(draft)){const field=form.elements.namedItem(key);if(field)field.value=value;}}catch{}
  form.addEventListener('input',()=>{try{sessionStorage.setItem('robgd-v2-draft',JSON.stringify(Object.fromEntries(new FormData(form))));}catch{}});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form));
    message=`${data.name}\n${data.email}\n${data.brand||''}\n${data.location||''}\n\n${data.service}\n\n${data.message}`;
    const mailto=`mailto:romadgcv@gmail.com?subject=${encodeURIComponent('RobGD — '+(data.brand||data.service))}&body=${encodeURIComponent(message)}`;
    $('.form-status').hidden=false;
    $('#form-whatsapp').href=`https://wa.me/393513848087?text=${encodeURIComponent(message)}`;
    location.href=mailto;
  });
  $('#copy-message').addEventListener('click',async event=>{
    try{await navigator.clipboard.writeText(message);event.currentTarget.textContent=event.currentTarget.dataset.copied;}
    catch{const area=document.createElement('textarea');area.value=message;area.readOnly=true;$('.form-status').append(area);area.select();}
  });
})();
