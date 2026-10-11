// Persona portrait gallery, designed for use as USER profile images only.
(()=>{
  'use strict';
  const images=[{"id":1,"title":"카페의 오후","category":"일상","description":"비 오는 날의 카페","image":"assets/user-portraits/persona-01.png","thumb":"assets/user-portraits/persona-01.webp"},{"id":2,"title":"외곽 정비소","category":"기술","description":"기계와 함께하는 일상","image":"assets/user-portraits/persona-02.png","thumb":"assets/user-portraits/persona-02.webp"},{"id":3,"title":"작은 녹음실","category":"기술","description":"오래된 오디오 기록","image":"assets/user-portraits/persona-03.png","thumb":"assets/user-portraits/persona-03.webp"},{"id":4,"title":"노을의 서가","category":"음악꽃","description":"차분한 독서 시간","image":"assets/user-portraits/persona-04.png","thumb":"assets/user-portraits/persona-04.webp"},{"id":5,"title":"새벽 꽃배달","category":"음악꽃","description":"전차 정류장의 흰 꽃다발","image":"assets/user-portraits/persona-05.png","thumb":"assets/user-portraits/persona-05.webp"},{"id":6,"title":"악보 복원사","category":"음악꽃","description":"음악원에서 찾은 악보","image":"assets/user-portraits/persona-06.png","thumb":"assets/user-portraits/persona-06.webp"},{"id":7,"title":"온실 채집자","category":"음악꽃","description":"푸른 꽃을 모으는 사람","image":"assets/user-portraits/persona-07.png","thumb":"assets/user-portraits/persona-07.webp"},{"id":8,"title":"호숫가 연주자","category":"음악꽃","description":"석양과 현악기","image":"assets/user-portraits/persona-08.png","thumb":"assets/user-portraits/persona-08.webp"},{"id":9,"title":"꽃집 견습생","category":"음악꽃","description":"작은 꽃집의 오후","image":"assets/user-portraits/persona-09.png","thumb":"assets/user-portraits/persona-09.webp"},{"id":10,"title":"우편 배달부","category":"일상","description":"구시가지의 편지","image":"assets/user-portraits/persona-10.png","thumb":"assets/user-portraits/persona-10.webp"},{"id":11,"title":"피아노 조율사","category":"음악꽃","description":"창가의 오래된 피아노","image":"assets/user-portraits/persona-11.png","thumb":"assets/user-portraits/persona-11.webp"},{"id":12,"title":"꽃과 약초","category":"음악꽃","description":"말린 꽃과 약초","image":"assets/user-portraits/persona-12.png","thumb":"assets/user-portraits/persona-12.webp"},{"id":13,"title":"외곽 수리공","category":"기술","description":"폐철도의 정비 작업","image":"assets/user-portraits/persona-13.png","thumb":"assets/user-portraits/persona-13.webp"},{"id":14,"title":"성당의 악보","category":"음악꽃","description":"고요한 성당의 연주자","image":"assets/user-portraits/persona-14.png","thumb":"assets/user-portraits/persona-14.webp"},{"id":15,"title":"경계 순찰관","category":"군경","description":"경계구역 순찰","image":"assets/user-portraits/persona-15.png","thumb":"assets/user-portraits/persona-15.webp"},{"id":16,"title":"통신 기록관","category":"군경","description":"신호를 기록하는 담당관","image":"assets/user-portraits/persona-16.png","thumb":"assets/user-portraits/persona-16.webp"},{"id":17,"title":"독립 군용 인조인간","category":"군경","description":"제9외곽선의 독립 개체","image":"assets/user-portraits/persona-17.png","thumb":"assets/user-portraits/persona-17.webp"},{"id":18,"title":"경계 의료지원관","category":"군경","description":"안전구역의 의료 지원","image":"assets/user-portraits/persona-18.png","thumb":"assets/user-portraits/persona-18.webp"}];
  const grid=document.getElementById('portrait-grid');
  if(!grid)return;
  const buttons=[...document.querySelectorAll('[data-portrait-filter]')];
  const count=document.getElementById('portrait-counter');
  const modal=document.getElementById('portrait-lightbox');
  const big=document.getElementById('portrait-lightbox-image');
  const caption=document.getElementById('portrait-lightbox-caption');
  const download=document.getElementById('portrait-lightbox-download');
  const close=document.getElementById('portrait-lightbox-close');
  let filter='all',lastFocus=null;
  const categoryLabels={'일상':'일상','음악꽃':'꽃 · 음악','기술':'기술 · 정비','군경':'군 · 경계'};
  function render(){
    const items=images.filter(x=>filter==='all'||x.category===filter);
    grid.replaceChildren();
    items.forEach(item=>{
      const card=document.createElement('button');card.type='button';card.className='portrait-card';card.setAttribute('aria-label',`${item.title} 이미지 크게 보기`);
      const figure=document.createElement('span');figure.className='portrait-image';
      const image=document.createElement('img');image.src=item.thumb;image.alt=`유저 프로필 추천 이미지 ${String(item.id).padStart(2,'0')} - ${item.title}`;image.loading='lazy';image.decoding='async';
      figure.append(image);
      const text=document.createElement('span');text.className='portrait-caption';
      const cat=document.createElement('small');cat.textContent=`NO. ${String(item.id).padStart(2,'0')} / ${categoryLabels[item.category]}`;
      const title=document.createElement('strong');title.textContent=item.title;
      const desc=document.createElement('span');desc.textContent=item.description;
      text.append(cat,title,desc);card.append(figure,text);
      card.addEventListener('click',()=>{lastFocus=card;big.src=item.image;big.alt=image.alt;caption.textContent=`${item.title} · USER 프로필 용도`;download.href=item.image;download.download=`SAINT-VEIL_USER_${String(item.id).padStart(2,'0')}.png`;modal.hidden=false;document.body.style.overflow='hidden';close.focus();});
      grid.append(card);
    });
    count.textContent=`추천 이미지 ${items.length}장 / 전체 ${images.length}장`;
  }
  buttons.forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.portraitFilter;buttons.forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});render();}));
  function dismiss(){modal.hidden=true;big.removeAttribute('src');document.body.style.overflow='';lastFocus?.focus();}
  close.addEventListener('click',dismiss);modal.addEventListener('click',e=>{if(e.target===modal)dismiss();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)dismiss();});
  render();
})();
