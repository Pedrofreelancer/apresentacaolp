(function(){
  "use strict";

  const $  = (s,sc=document)=>sc.querySelector(s);
  const $$ = (s,sc=document)=>Array.from(sc.querySelectorAll(s));

  // Header: sombra ao rolar
  const header = $('#header');
  function onScroll(){
    header.style.boxShadow = (window.scrollY > 6) ? '0 8px 24px rgba(0,0,0,.35)' : 'none';
  }
  window.addEventListener('scroll', onScroll); onScroll();

  // Menu mobile
  const menuBtn = $('#menuBtn');
  const navList = $('#navList');
  if(menuBtn && navList){
    menuBtn.addEventListener('click', ()=>{
      const open = navList.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('#navList a').forEach(a=>a.addEventListener('click', ()=>{
      navList.classList.remove('open');
      menuBtn.setAttribute('aria-expanded','false');
    }));
  }

  // Smooth scroll com offset do header
  $$('#navList a, a[href^="#"]').forEach(link=>{
    link.addEventListener('click', (e)=>{
      const href = link.getAttribute('href');
      if(href && href.startsWith('#') && href.length>1){
        const target = document.getElementById(href.slice(1));
        if(target){
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8;
          window.scrollTo({top:y, behavior:'smooth'});
        }
      }
    });
  });

  // Ano no rodapé
  const year = $('#year'); if(year){ year.textContent = String(new Date().getFullYear()); }

  // Toggle planos
  const btnMensal = $('#btnMensal');
  const btnSem    = $('#btnSemestral');
  const boxMensal = $('#plansMensal');
  const boxSem    = $('#plansSemestral');

  function setPlan(view){
    const mensal = (view === 'mensal');
    if(boxMensal) boxMensal.hidden = !mensal;
    if(boxSem)    boxSem.hidden    =  mensal ? true : false;
    if(btnMensal){
      btnMensal.classList.toggle('active', mensal);
      btnMensal.setAttribute('aria-pressed', String(mensal));
    }
    if(btnSem){
      btnSem.classList.toggle('active', !mensal);
      btnSem.setAttribute('aria-pressed', String(!mensal));
    }
  }
  if(btnMensal && btnSem){
    btnMensal.addEventListener('click', ()=>setPlan('mensal'));
    btnSem.addEventListener('click', ()=>setPlan('semestral'));
  }
  setPlan('mensal');

  // Modo Simples/Pro
  const modoBtn = $('#modoBtn');
  function setModo(simplesOn){
    $$('.simples').forEach(el=>el.hidden = !simplesOn);
    $$('.pro').forEach(el=>el.hidden = simplesOn);
    if(modoBtn){
      modoBtn.setAttribute('aria-pressed', String(simplesOn));
      modoBtn.innerHTML = `Modo: <strong>${simplesOn ? 'Simples' : 'Pro'}</strong>`;
    }
  }
  let simples = true;
  if(modoBtn){
    modoBtn.addEventListener('click', ()=>{ simples = !simples; setModo(simples); });
  }
  setModo(simples);

  // Observações — salvar/copiar
  const obs = $('#obs');
  const salvarObs = $('#salvarObs');
  const copiarObs = $('#copiarObs');
  const obsRet = $('#obsRet');

  if(obs && salvarObs && copiarObs && obsRet){
    const saved = localStorage.getItem('black360_obs');
    if(saved){ obs.value = saved; }
    salvarObs.addEventListener('click', ()=>{
      localStorage.setItem('black360_obs', obs.value);
      obsRet.textContent = 'Observações salvas localmente neste navegador.';
      obsRet.style.color = 'var(--ok)';
    });
    copiarObs.addEventListener('click', async ()=>{
      try{
        await navigator.clipboard.writeText(obs.value);
        obsRet.textContent = 'Texto copiado para a área de transferência.';
        obsRet.style.color = 'var(--ok)';
      }catch{
        obsRet.textContent = 'Não foi possível copiar automaticamente.';
        obsRet.style.color = 'var(--err)';
      }
    });
  }
})();
