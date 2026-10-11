(() => {
  const grid = document.querySelector('#album-grid');
  if (!grid) return;
  const counter = document.querySelector('#album-counter');
  const empty = document.querySelector('#album-empty');
  const filters = [...document.querySelectorAll('[data-album]')];
  const dialog = document.querySelector('#gallery-lightbox');
  const close = document.querySelector('#lightbox-close');
  const modalImage = document.querySelector('#lightbox-image');
  const modalCaption = document.querySelector('#lightbox-caption');
  const labels = {ash:'애쉬 벨몬트', ian:'이안 에버렛', luca:'루카 세레인', world:'월드 / 기타'};
  const seeds = [
    { name:'애쉬 벨몬트 · 공식 인장', cat:'ash', url:'assets/ash.webp', thumb:'assets/ash.webp' },
    { name:'이안 에버렛 · 공식 인장', cat:'ian', url:'assets/ian.webp', thumb:'assets/ian.webp' },
    { name:'루카 세레인 · 공식 인장', cat:'luca', url:'assets/luca.webp', thumb:'assets/luca.webp' },
    { name:'애쉬 벨몬트 · 보너스 일러스트', cat:'ash', file:'ash-homepage-bonus.png', url:'assets/gallery/ash/ash-homepage-bonus.png', thumb:'assets/gallery/ash/ash-homepage-bonus.png' },
    { name:'이안 에버렛 · 보너스 일러스트', cat:'ian', file:'ian-homepage-bonus.png', url:'assets/gallery/ian/ian-homepage-bonus.png', thumb:'assets/gallery/ian/ian-homepage-bonus.png' },
    { name:'루카 세레인 · 보너스 일러스트', cat:'luca', file:'luca-homepage-bonus.png', url:'assets/gallery/luca/luca-homepage-bonus.png', thumb:'assets/gallery/luca/luca-homepage-bonus.png' },
  ];
  let entries = seeds.slice();let selected='all';
  const typeOk=name=> /\.(png|jpe?g|webp|gif|avif)$/i.test(name);
  const friendly = s => decodeURIComponent(s).replace(/\.[^.]+$/, '').replaceAll('_',' ').replaceAll('-', ' ');
  function render() {
    grid.replaceChildren();
    const visible=entries.filter(x=>selected==='all'||x.cat===selected);
    for (const item of visible) {
      const card=document.createElement('button');card.type='button';card.className='album-card';
      const frame=document.createElement('span');frame.className='album-frame';
      const img=document.createElement('img');img.loading='lazy';img.src=item.thumb||item.url;img.alt=item.name;frame.appendChild(img);
      const info=document.createElement('span');info.className='album-info';
      const name=document.createElement('strong');name.textContent=item.name;
      const tag=document.createElement('small');tag.textContent=labels[item.cat] || '이미지';
      info.append(name,tag);card.append(frame,info);
      card.addEventListener('click',()=>{modalImage.src=item.url;modalImage.alt=item.name;modalCaption.textContent=item.name;dialog.hidden=false;document.body.style.overflow='hidden';close.focus();});
      grid.appendChild(card);
    }
    empty.hidden=visible.length>0;
    counter.textContent=`공개 이미지 ${visible.length}개 표시 · 전체 ${entries.length}개`;
  }
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    selected=btn.dataset.album;
    filters.forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});
    render();
  }));
  function dismiss(){ dialog.hidden=true;modalImage.removeAttribute('src');document.body.style.overflow=''; }
  close?.addEventListener('click',dismiss);
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dismiss();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.hidden)dismiss();});
  render();
  // Public GitHub Pages hosted files are automatically discovered; no login or browser token required.
  const config=window.SAINT_VEIL_CONFIG || {};
  const host=location.hostname.toLowerCase();
  const inferredOwner=host.endsWith('.github.io')?host.slice(0,-'.github.io'.length):'';
  const owner=config.owner || inferredOwner;
  const repo=config.repo || (inferredOwner ? (location.pathname.split('/').filter(Boolean)[0] || `${inferredOwner}.github.io`) : '');
  const branch=config.branch || 'main';
  if (!owner || !repo || !/^[\w.-]+$/.test(owner)||!/^[\w.-]+$/.test(repo)) {
    counter.textContent=`기본 공개 이미지 ${entries.length}장 표시 · GitHub Pages 배포 후 추가 이미지도 자동으로 확인합니다.`;
    return;
  }
  const groups=['ash','ian','luca','world'];
  Promise.all(groups.map(async cat=>{
    const url=`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/assets/gallery/${cat}?ref=${encodeURIComponent(branch)}`;
    try {
      const r=await fetch(url,{headers:{Accept:'application/vnd.github+json'}});
      if (!r.ok) return [];
      const data=await r.json();if (!Array.isArray(data))return [];
      return data.filter(f=>f.type==='file'&&typeOk(f.name)&&f.download_url && !seeds.some(s=>s.cat===cat && s.file===f.name)).map(f=>({name:friendly(f.name),cat,url:f.download_url,thumb:f.download_url}));
    } catch{return [];}
  })).then(groups=>{entries=seeds.concat(...groups);render();}).catch(()=>render());
})();
