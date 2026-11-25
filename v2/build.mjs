import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales } from './locales.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);
const out = path.join(root, 'dist');
const content = JSON.parse(fs.readFileSync(path.join(here,'content.json'),'utf8'));
const slugs = ['chana-resto','control-vehicular','gloow','buenos-aires-vending','red-mutual','nicanor','ipi-institute','eurorepar'];
const coverNames = ['chana','control','gloow','bav','red','nicanor','ipi','eurorepar'];
const order = [2,4,3,0,1,5,6,7];
export const projects = content.projectData.map((p,i)=>({...p,index:i,slug:slugs[i],cover:`assets/images/covers/${coverNames[i]}.webp`,shots:[`assets/images/covers/${coverNames[i]}.webp`,...p.gallery.filter(x=>!x.endsWith('.mp4'))]}));
const brands = [['bml','Business Media Lab'],['clinica','Clínica Capilar'],['gloow','GLOOW'],['control','Control Vehicular'],['chana','Chaná Restó'],['florencia','Florencia Acacia'],['tmb','TMB'],['gm','GM'],['siglo-21','Siglo 21'],['nicanor','Nicanor'],['red','Red Mutual'],['nation','Nation'],['best-performance','Best Performance'],['bav','BAV'],['ipi','IPI']];
const e = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const asset = s => '/'+s;
const base = lang => lang==='es'?'/':`/${lang}/`;
const href = (lang, route='') => base(lang)+route;
const arrow = (direction='right') => `<svg class="arrow ${direction}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>`;
const logo = (white=false,cls='') => `<img class="${cls}" src="/assets/logos/Rob_${white?'blanco':'negro'}.svg" alt="RobGD" width="188" height="52">`;
const pill = (url,label,cls='') => `<a class="pill mono ${cls}" href="${url}">${label}</a>`;
const date = '2026';

// Use the original project's description in English and its existing translations.
// Correct the old Eurorepar translation, which described an unrelated editorial project.
content.caseI18n.es[7] = ['MARCA / REDES / CAMPAÑAS','Identidad de marca, redes sociales, marketing digital, publicidad, campañas y material promocional','Comunicación de marca a través de la identidad visual, la publicidad, las redes sociales y el marketing digital, para fortalecer su presencia en múltiples canales.'];
content.caseI18n.it[7] = ['BRAND / SOCIAL / CAMPAGNE','Brand identity, social media, marketing digitale, pubblicità, campagne e materiale promozionale','Comunicazione di marca attraverso identità visiva, pubblicità, social media e marketing digitale, per rafforzare la presenza del brand su più canali.'];
function caseCopy(p,lang) { return lang==='en' ? [p.category,p.services,p.description] : content.caseI18n[lang][p.index]; }

function header(t,route,home) {
  const links = [href(t.code,'work/'),href(t.code)+'#about',href(t.code)+'#services',href(t.code,'process/'),'#contact'];
  return `<a class="skip" href="#main">${t.skip}</a>
  <header class="site-header ${home?'at-hero':''}">
    <a class="mini-logo" href="${base(t.code)}" aria-label="RobGD — ${t.backHome}">${logo(false,'logo-light')}${logo(true,'logo-dark')}</a>
    <div class="floatbar">
      <nav class="language mono" aria-label="${t.language}">${Object.values(locales).map(l=>`<a href="${href(l.code,route)}" lang="${l.code}" hreflang="${l.code}" ${l.code===t.code?'aria-current="true"':''}>${l.code.toUpperCase()}</a>`).join('')}</nav>
      ${pill('#contact',t.talk,'contact-shortcut')}
      <button class="menu-button" aria-label="${t.menu}" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
    </div>
  </header>
  <dialog id="menu" aria-label="${t.menu}">
    <div class="menu-top">${logo()}<button class="menu-close" aria-label="${t.close}">×</button></div>
    <nav class="menu-links">${t.nav.map((n,i)=>`<a href="${links[i]}"><span class="mono">0${i+1}</span>${n}${arrow()}</a>`).join('')}</nav>
    <div class="menu-bottom"><p class="mono">${t.location}<br>${t.languages}</p><fieldset class="theme-picker"><legend class="mono">${t.theme}</legend><button data-theme="light" aria-pressed="true">${t.light}</button><button data-theme="dark" aria-pressed="false">${t.dark}</button></fieldset></div>
  </dialog>`;
}

function footer(t) {
  const fields = t.form;
  return `<section class="contact" id="contact" aria-labelledby="contact-title">
    <div class="wrap">
      <p class="eyebrow mono reveal">${t.contact}</p>
      <h2 class="contact-title reveal" id="contact-title">${t.contactTitle}</h2>
      <div class="contact-grid">
        <form id="contact-form" action="mailto:romadgcv@gmail.com" method="get">
          <div class="field-pair">${[0,1].map((i)=>`<label><span class="sr-only">${fields[i]}</span><input name="${i?'email':'name'}" type="${i?'email':'text'}" placeholder="${fields[i]}" autocomplete="${i?'email':'name'}" required maxlength="120"></label>`).join('')}</div>
          <div class="field-pair">${[2,3].map((i)=>`<label><span class="sr-only">${fields[i]}</span><input name="${i===2?'brand':'location'}" placeholder="${fields[i]}" autocomplete="${i===2?'organization':'address-level2'}" maxlength="160"></label>`).join('')}</div>
          <label><span class="sr-only">${fields[4]}</span><select name="service" required><option value="">${fields[4]}</option>${t.services.map(s=>`<option>${s[0]}</option>`).join('')}</select></label>
          <label><span class="sr-only">${fields[5]}</span><textarea name="message" placeholder="${fields[5]}" required minlength="10" maxlength="4000"></textarea></label>
          <button class="pill mono form-submit" type="submit">${t.send} ${arrow()}</button>
          <p class="form-note">${t.formNote}</p>
          <div class="form-status" hidden role="status"><p>${t.formReady}</p><div class="form-actions"><button class="pill" id="copy-message" type="button" data-copied="${t.copied}">${t.copy}</button><a class="pill" id="form-whatsapp" href="https://wa.me/393513848087" target="_blank" rel="noopener">${t.sendWhatsapp}</a></div></div>
        </form>
        <div class="contact-info"><p>${t.contactBody}</p><div class="contact-links"><a href="mailto:romadgcv@gmail.com">romadgcv@gmail.com ${arrow('diagonal')}</a><a href="https://wa.me/393513848087" target="_blank" rel="noopener">WhatsApp ${arrow('diagonal')}</a><a href="https://www.instagram.com/robgd_" target="_blank" rel="noopener">Instagram ${arrow('diagonal')}</a></div><p class="mono location">${t.location}</p><div class="social-links">${[['LinkedIn','https://www.linkedin.com/in/robertinomarrazzo/'],['Behance','https://www.behance.net/robertinomarrazzo']].map(([n,u])=>pill(u,n+' '+arrow('diagonal'))).join('')}</div></div>
      </div>
      <nav class="footer-nav" aria-label="${t.nav[4]}">${[[t.nav[0],href(t.code,'work/'),'08 '+t.nav[0]],[t.nav[1],href(t.code)+'#about','ARGENTINA · ITALIA'],[t.nav[2],href(t.code)+'#services','BRANDING · DIGITAL · EDITORIAL']].map(([n,u,s])=>`<a href="${u}"><span>${n}</span><small class="mono">${s}</small></a>`).join('')}</nav>
      <a class="footer-logo" href="${base(t.code)}" aria-label="RobGD — ${t.backHome}">${logo(true)}</a>
      <footer class="mono"><span>© ${date} Robertino Marrazzo. ${t.rights}</span><span>${t.tagline}</span><a href="#top">↑ ${t.top}</a></footer>
    </div>
  </section>`;
}

function card(p,t) {
  const cp=caseCopy(p,t.code), cat=cp[0].split(' / ').slice(0,2).join(' · ');
  return `<a class="project-card reveal" href="${href(t.code,`projects/${p.slug}/`)}" data-shots='${e(JSON.stringify(p.shots.map(asset)))}'>
    <div class="thumb"><img src="${asset(p.cover)}" alt="${e(p.title)}" width="800" height="1000" loading="lazy" decoding="async"><span class="shot-counter mono" aria-hidden="true">1/${p.shots.length}</span><span class="open-project mono">${t.view} ${arrow()}</span></div>
    <div class="project-meta"><h3>${e(p.title)}</h3><span class="mono">${e(cat)}</span></div><div class="project-meta secondary mono"><span>${e(cp[0].split(' / ').slice(2).join(' · ') || 'Visual communication')}</span><span>${p.year}</span></div>
  </a>`;
}

function homePage(t) {
  const tileGroups=[
    [projects[4].cover,projects[2].cover,projects[0].gallery[0],projects[3].cover,projects[1].cover,projects[5].cover,projects[6].cover,projects[7].cover],
    [projects[3].gallery[2],projects[0].cover,projects[4].gallery[0],projects[6].cover,projects[2].gallery[2],projects[5].cover,projects[7].cover,projects[1].cover],
    [projects[1].cover,projects[6].gallery[2],projects[5].cover,projects[2].cover,projects[0].gallery[2],projects[7].cover,projects[3].cover,projects[4].cover]
  ];
  return `<main id="main">
    <div class="hero-mosaic" aria-label="${t.featured}">
      ${tileGroups.map((group,r)=>`<div class="mosaic-row"><div class="mosaic-track track-${r}">${[0,1].map(copy=>`<div class="mosaic-group" ${copy?'aria-hidden="true"':''}>${group.map((src,i)=>`<div class="mosaic-tile ${i%3===0?'wide':''}"><img src="${asset(src)}" alt="" width="520" height="650" ${r===0&&i<2?'fetchpriority="high"':''} decoding="async"></div>`).join('')}</div>`).join('')}</div></div>`).join('')}
      <div class="hero-signature">${logo(true,'hero-logo')}<span class="hero-line"></span><span class="hero-role">Graphic<br class="mobile-break"> Designer</span></div>
      <button class="motion-toggle" aria-label="${t.pause}" data-pause="${t.pause}" data-play="${t.play}" aria-pressed="false"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path class="pause-icon" d="M7 5h3v14H7zM14 5h3v14h-3z"/><path class="play-icon" d="m8 5 11 7-11 7z"/></svg></button>
    </div>
    <section class="intro wrap">
      <p class="mono muted reveal">( ${t.heroLabel} )</p><h1 class="reveal"><strong>${t.hero[0]}</strong><br><span class="light">${t.hero[1]}</span></h1><p class="intro-body reveal">${t.intro}</p>${pill('#contact',t.talk,'solid reveal')}
    </section>
    <section class="word-wheel" aria-label="${t.hero[1]}"><div class="wrap wheel-layout"><b>${t.wheelLead}</b><div class="wheel-mask" aria-hidden="true"><div class="wheel-track">${[...t.wheel,...t.wheel,...t.wheel].map((v,i)=>`<span ${i===2?'class="active"':''}>${v}</span>`).join('')}</div></div></div></section>
    <section id="featured" class="section wrap">
      <div class="work-head"><div><p class="eyebrow mono reveal">${t.featured}</p><h2 class="big reveal">${t.featuredTitle}</h2></div><div class="brand-stat reveal"><b>15</b><span class="mono muted">${t.brands}</span>${pill(href(t.code,'work/'),t.all+' '+arrow())}</div></div>
      <div class="project-grid">${order.map(i=>card(projects[i],t)).join('')}</div><div class="see-all">${pill(href(t.code,'work/'),t.all+' '+arrow())}</div>
    </section>
    <section id="about" class="section wrap">
      <div class="studio-grid"><div><p class="eyebrow mono reveal">( ${t.studio} )</p><h2 class="studio-title reveal">${t.studioTitle}</h2><p class="studio-tag mono reveal"><span class="brand-mark" aria-hidden="true"></span>${t.studioTag}</p><div class="studio-body reveal">${t.studioBody.map(p=>`<p>${p}</p>`).join('')}</div></div><div class="studio-image reveal"><img src="/assets/images/covers/red.webp" alt="Red Mutual" width="1080" height="1080" loading="lazy"></div></div>
      <div class="world reveal"><p class="mono">${t.world}</p><p>${t.places.split(' · ').join(' <span class="small-mark" aria-hidden="true">✳</span> ')}</p></div>
      <div class="principles">${t.principles.map(([n,h,p])=>`<article class="reveal"><p class="mono">${n}</p><h3>${h}</h3><p>${p}</p></article>`).join('')}</div>
      <div class="about-me"><button class="portrait-booth reveal" aria-label="${t.replay}"><span class="portrait-slot"><span class="portrait-strip"><img src="/assets/images/Foto-1.webp" alt="${t.photo}" width="700" height="800" loading="lazy"><img src="/assets/images/Foto-2.webp" alt="" width="700" height="800" loading="lazy"><span class="mono">Robertino Marrazzo<br>Graphic Designer</span></span></span><span class="booth-label mono">ARGENTINA → ITALIA</span></button><div class="bio"><p class="eyebrow mono reveal">( ${t.about} )</p><h2 class="reveal">${t.hello}</h2><p class="mono muted reveal">${t.role}</p>${t.bio.map(p=>`<p class="reveal">${p}</p>`).join('')}${pill('#contact',t.talk,'solid reveal')}</div></div>
      <div class="brand-list"><p class="eyebrow mono">${t.brands}</p><div class="brand-grid">${brands.map(([s,n])=>`<div><img src="/assets/brands/${s}.svg" alt="${n}" width="180" height="80" loading="lazy"></div>`).join('')}</div></div>
    </section>
    <section id="services" class="section wrap"><p class="eyebrow mono reveal">${t.servicesLabel}</p><h2 class="big reveal">${t.servicesTitle}</h2><div class="accordion services">${t.services.map(([h,p,items],i)=>`<details class="accordion-item"><summary><h3>${h}</h3><span class="plus" aria-hidden="true"></span></summary><div class="accordion-body"><span class="pill mono scope">${t.scope}</span><p>${p}</p><ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul></div></details>`).join('')}</div><a class="process-cta reveal" href="${href(t.code,'process/')}"><span class="mono">${t.processKicker}</span><strong>${t.processCta}${arrow()}</strong></a></section>
  </main>`;
}

function workPage(t) {
  return `<main id="main" class="subpage wrap"><div class="page-head">${pill(base(t.code),'← '+t.back,'back')}<p class="eyebrow mono">${t.featured} · 08</p><h1>${t.allTitle}</h1></div><div class="project-grid">${order.map(i=>card(projects[i],t)).join('')}</div></main>`;
}

function media(src,p,t,priority=false) {
  const video=/\.mp4$/.test(src);
  return video ? `<video controls playsinline preload="metadata" poster="${asset(p.cover)}" aria-label="${e(p.title+' — '+t.video)}"><source src="${asset(src)}" type="video/mp4"><a href="${asset(src)}">${t.video}</a></video>` : `<img src="${asset(src)}" alt="${e(p.title+' — '+t.image)}" ${priority?'fetchpriority="high" loading="eager"':'loading="lazy"'} decoding="async">`;
}
function projectPage(p,t) {
  const cp=caseCopy(p,t.code), idx=order.indexOf(p.index), next=projects[order[(idx+1)%order.length]], prev=projects[order[(idx+order.length-1)%order.length]];
  return `<main id="main" class="subpage project-page wrap">
    <div class="project-intro"><div>${pill(href(t.code,'work/'),'← '+t.backWork,'back')}<p class="eyebrow mono">${e(p.client)} — ${p.year}</p><h1>${e(p.title)}</h1><div class="project-tags mono">${cp[0].split(' / ').map(s=>`<span>${e(s)}</span>`).join('')}</div></div><div class="case-description"><p>${e(cp[2])}</p><dl>${[[t.meta[0],p.client],[t.meta[1],p.year],[t.meta[2],cp[1]]].map(([k,v])=>`<div><dt class="mono muted">${k}</dt><dd>${e(v)}</dd></div>`).join('')}</dl>${pill(p.live,t.visit+' '+arrow('diagonal'))}</div></div>
    <div class="case-hero" aria-label="${t.overview}">${media(p.video||p.image,p,t,true)}</div>
    <div class="case-gallery" aria-label="${t.gallery}">${p.gallery.map((src,i)=>`<figure class="reveal">${media(src,p,t)}<figcaption class="mono">${String(i+1).padStart(2,'0')} / ${e(p.client)} · ${src.endsWith('.mp4')?t.video:t.image}</figcaption></figure>`).join('')}</div>
    <nav class="project-navigation" aria-label="${t.nav[0]}"><a class="previous-project mono" href="${href(t.code,`projects/${prev.slug}/`)}">${arrow('left')}${t.previous}</a><span class="mono muted">${String(idx+1).padStart(2,'0')} / 08</span><a class="next-project" href="${href(t.code,`projects/${next.slug}/`)}"><span class="mono">${t.next} ${arrow()}</span><h2>${e(next.title)}</h2></a></nav>
  </main>`;
}

function processPage(t) {
  return `<main id="main" class="subpage wrap process-page"><div class="page-head">${pill(base(t.code),'← '+t.back,'back')}<p class="eyebrow mono">${t.processCta}</p><h1 class="process-title">${t.processTitle}</h1></div><div class="process-intro"><p>${t.processIntro}</p><div class="process-lead-steps">${t.steps.filter((_,i)=>[0,2,4].includes(i)).map(([n,p],i)=>`<article class="reveal"><b>0${i+1}</b><div><h3>${n}</h3><p>${p}</p></div></article>`).join('')}</div></div><section class="section"><p class="eyebrow mono">${t.nav[3]}</p><h2 class="big">${t.processCta}.</h2><div class="accordion">${t.steps.map(([n,p],i)=>`<details class="accordion-item"><summary><span class="mono step-n">0${i+1}</span><h3>${n}</h3><span class="plus" aria-hidden="true"></span></summary><div class="step-body"><p>${p}</p></div></details>`).join('')}</div></section><section class="expectations"><h2 class="big">${t.expectations}.</h2><div>${t.expect.map(([h,p])=>`<article class="reveal"><h3>${h}</h3><p>${p}</p></article>`).join('')}</div></section><a class="process-cta" href="#contact"><span class="mono">${t.contact}</span><strong>${t.talk}${arrow()}</strong></a></main>`;
}

function page(t,route,body,p=null,home=false) {
  const title=p?`${p.title} — RobGD`:route==='work/'?`${t.all} — RobGD`:route==='process/'?`${t.processCta} — RobGD`:t.title;
  const description=p?caseCopy(p,t.code)[2]:t.description;
  return `<!doctype html><html lang="${t.code}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="robots" content="noindex,nofollow"><meta name="description" content="${e(description)}"><title>${e(title)}</title><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:type" content="website"><meta property="og:site_name" content="RobGD — Robertino Marrazzo"><meta property="og:image" content="${asset(p?p.cover:'assets/images/covers/gloow.webp')}"><link rel="icon" href="/assets/logos/Rob_negro.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"><link rel="stylesheet" href="/v2/style.css">${Object.values(locales).map(l=>`<link rel="alternate" hreflang="${l.code}" href="${href(l.code,route)}">`).join('')}<script>try{document.documentElement.dataset.theme=localStorage.getItem('robgd-v2-theme')||'light'}catch(e){}</script><script src="/v2/app.js" defer></script></head><body class="${home?'home-page':'inner-page'}" id="top">${header(t,route,home)}${body}${footer(t)}</body></html>`;
}

export function build() {
  fs.mkdirSync(out,{recursive:true});
  for (const dir of ['assets','img','videos']) if(fs.existsSync(path.join(root,dir))) fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true});
  fs.mkdirSync(path.join(out,'v2'),{recursive:true});
  for (const name of ['style.css','app.js']) fs.copyFileSync(path.join(here,name),path.join(out,'v2',name));
  let pages=0;
  const write=(url,data)=>{const file=path.join(out,url,'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);pages++;};
  for(const t of Object.values(locales)) {
    write(base(t.code),page(t,'',homePage(t),null,true));
    write(href(t.code,'work/'),page(t,'work/',workPage(t)));
    write(href(t.code,'process/'),page(t,'process/',processPage(t)));
    for (const p of projects) { const route=`projects/${p.slug}/`;write(href(t.code,route),page(t,route,projectPage(p,t),p)); }
  }
  const t=locales.es;
  fs.writeFileSync(path.join(out,'404.html'),page(t,'',`<main id="main" class="wrap subpage not-found"><p class="mono">404</p><h1 class="big">${t.notFound}</h1><p>${t.notFoundBody}</p>${pill('/',t.backHome)}</main>`));
  fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
  console.log(`Built ${pages} localized pages + 404. Original assets preserved.`);
  return {pages,out};
}
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) build();
