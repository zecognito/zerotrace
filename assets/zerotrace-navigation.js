(()=>{const links=[['/','HOME'],['/news/','NEWS'],['/rabbit-hole/','RABBIT HOLE'],['/about/','ABOUT']];const normalizeFooter=()=>{document.querySelectorAll('footer').forEach(footer=>{footer.querySelectorAll('.disclaimer,.ztPageData').forEach(el=>{el.textContent='© 2026 ZeroTrace';});footer.querySelectorAll('a[href]').forEach(a=>{try{if(new URL(a.getAttribute('href'),location.href).pathname.replace(/\/$/,'')==='/resources')a.remove()}catch(_){}});});};const build=()=>{normalizeFooter();const menu=document.getElementById('mobileMenu');if(menu){menu.classList.add('ztUniversalMenu');menu.setAttribute('aria-label','ZeroTrace navigation');menu.replaceChildren();const header=document.createElement('div');header.className='ztNavHeader';const name=document.createElement('span');name.textContent='ZEROTRACE';const label=document.createElement('b');label.textContent='// NAVIGATION';header.append(name,label);const rule=document.createElement('div');rule.className='ztNavRule';menu.append(header,rule);links.forEach(([url,title],i)=>{const a=document.createElement('a');a.href=url;a.className='routeNavLink ztNavRoute';const n=document.createElement('span');n.className='ztNavNo';n.textContent=String(i+1).padStart(2,'0');const t=document.createElement('span');t.textContent=title;const arrow=document.createElement('b');arrow.textContent='→';a.append(n,t,arrow);a.addEventListener('click',()=>{if(typeof window.closeMenu==='function')window.closeMenu();else{menu.classList.remove('open');const btn=document.getElementById('menuBtn');if(btn)btn.setAttribute('aria-expanded','false')}});menu.append(a)});const foot=document.createElement('div');foot.className='ztNavFooter';const line=document.createElement('i');const copy=document.createElement('span');copy.textContent='WHAT YOU REVEAL IS YOUR CHOICE.';foot.append(line,copy);menu.append(foot)}const desktop=document.querySelector('.navlinks');if(desktop){desktop.replaceChildren(...links.map(([url,title])=>{const a=document.createElement('a');a.href=url;a.textContent=title;return a}))}};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build()})();

/* ZeroTrace News affiliate placement. Registry-first with resilient fallback. */
(()=>{
  if(!/^\/news\/[^/]+\/?$/.test(location.pathname))return;
  async function mount(){
    const article=document.querySelector('article.article');
    if(!article||document.getElementById('ztAffiliatePlacement'))return;
    const fallback={id:'ZT-AFF-001',product:'CRYPTOTAG Zeus Starter Kit',affiliate_url:'https://link.amazon/B092O5UIa',image:'/affiliate/banners/zerotrace-affiliate-cryptotag-zeus-banner.webp',placement:'news_articles',status:'active'};
    let entry=fallback;
    try{
      const response=await fetch('/affiliate/registry.json',{cache:'no-store'});
      if(response.ok){
        const registry=await response.json();
        const active=(registry.banners||[]).find(item=>item.id===registry.active_banner_id&&item.status==='active'&&item.placement==='news_articles');
        if(active&&active.image&&active.affiliate_url)entry=active;
      }
    }catch(_){/* Use known-good active banner when registry is unavailable. */}
    const section=document.createElement('section');
    section.id='ztAffiliatePlacement';
    section.setAttribute('aria-label','Advertisement');
    section.style.cssText='width:min(980px,92%);margin:0 auto 54px';
    const link=document.createElement('a');
    link.href=entry.affiliate_url;
    link.target='_blank';
    link.rel='sponsored nofollow noopener noreferrer';
    link.setAttribute('aria-label','Advertisement: '+entry.product+' on Amazon');
    link.style.cssText='display:block;text-decoration:none';
    const img=document.createElement('img');
    img.src=entry.image;
    img.alt='Advertisement for '+entry.product;
    img.loading='lazy';
    img.decoding='async';
    img.style.cssText='display:block;width:100%;height:auto;border:1px solid #263038';
    link.append(img);
    const label=document.createElement('p');
    label.textContent='Advertisement · Paid link';
    label.style.cssText='margin:0 0 9px;font:10px/1.5 ui-monospace,monospace;letter-spacing:.06em;color:#9ba7a1';
    const info=document.createElement('button');
    info.type='button';
    info.textContent='ⓘ';
    info.setAttribute('aria-label','Affiliate disclosure information');
    info.setAttribute('aria-expanded','false');
    info.style.cssText='background:transparent;border:0;color:#d4b56b;cursor:pointer;font:15px/1 sans-serif;padding:0 5px;vertical-align:middle;min-width:30px;min-height:30px';
    const popup=document.createElement('div');
    popup.hidden=true;
    popup.setAttribute('role','dialog');
    popup.setAttribute('aria-label','Affiliate disclosure');
    popup.style.cssText='position:absolute;z-index:20;top:100%;left:0;width:min(350px,90vw);padding:17px 20px;border:1px solid #38464b;background:#0a1014;box-shadow:0 14px 36px #000b;color:#c4ceca;font:12px/1.65 ui-monospace,monospace';
    const heading=document.createElement('strong');
    heading.textContent='AFFILIATE DISCLOSURE //';
    heading.style.cssText='display:block;color:#f4b728;margin-bottom:8px;letter-spacing:.06em';
    const copy=document.createElement('span');
    copy.textContent='ZeroTrace may earn a commission when you purchase through affiliate links, at no additional cost to you. As an Amazon Associate, I earn from qualifying purchases.';
    popup.append(heading,copy);
    label.style.position='relative';
    label.append(info,popup);
    info.addEventListener('click',e=>{e.stopPropagation();popup.hidden=!popup.hidden;info.setAttribute('aria-expanded',String(!popup.hidden));});
    document.addEventListener('click',e=>{if(!label.contains(e.target)){popup.hidden=true;info.setAttribute('aria-expanded','false');}});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){popup.hidden=true;info.setAttribute('aria-expanded','false');info.focus();}});
    section.append(label,link);
    article.insertAdjacentElement('afterend',section);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();

/* Amazon Associates identification beside the existing copyright. */
(()=>{const add=()=>{document.querySelectorAll('footer').forEach(footer=>{
  if(footer.querySelector('.ztAmazonDisclosure'))return;
  const copyright=footer.querySelector('.ztPageData');
  if(!copyright)return;
  const disclosure=document.createElement('span');
  disclosure.className='ztAmazonDisclosure';
  disclosure.textContent='As an Amazon Associate, I earn from qualifying purchases.';
  disclosure.style.cssText='font:inherit;color:inherit;letter-spacing:inherit';
  const separator=document.createElement('span');
  separator.textContent=' · ';
  separator.style.cssText='font:inherit;color:inherit';
  copyright.append(separator,disclosure);
});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add,{once:true});else add();})();
