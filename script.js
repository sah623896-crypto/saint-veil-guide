(() => {
  const nav = document.querySelector('#site-nav');
  const toggle = document.querySelector('.menu-toggle');
  toggle?.addEventListener('click', () => { const opened = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(opened)); toggle.setAttribute('aria-label', opened ? '메뉴 닫기' : '메뉴 펼치기'); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('is-open'); toggle?.setAttribute('aria-expanded', 'false'); }));
  const cards = [...document.querySelectorAll('.world-fold')];
  const filter = document.getElementById('guide-filter');
  const empty = document.getElementById('guide-no-results');
  filter?.addEventListener('input', () => {
    const q = filter.value.trim().toLocaleLowerCase(); let found = 0;
    cards.forEach(d => { const matched = !q || d.textContent.toLocaleLowerCase().includes(q); d.hidden = !matched; if(matched){found++;if(q) d.open = true;} else d.open = false; });
    empty.hidden = found !== 0;
  });
  document.querySelector('#expand-all')?.addEventListener('click', () => { filter.value='';filter.dispatchEvent(new Event('input'));cards.forEach(d=>{ d.hidden=false;d.open=true;}); });
  document.querySelector('#collapse-all')?.addEventListener('click', () => { filter.value='';filter.dispatchEvent(new Event('input'));cards.forEach(d=>{d.hidden=false;d.open=false;}); });
  let toastTimeout;
  function toast(message) { const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('visible'),2200); }
  function fallbackCopy(text) { const t=document.createElement('textarea');t.value=text;t.setAttribute('readonly','');t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();const success=document.execCommand('copy');t.remove();if(!success) throw new Error('copy'); }
  async function copy(text) {try {if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);else fallbackCopy(text);toast('복사했어요!');} catch(e) {toast('복사할 수 없어요. 텍스트를 직접 선택해 주세요.');}}
  document.querySelector('#copy-template')?.addEventListener('click', () => copy(document.querySelector('#profile-template').textContent));
  document.querySelectorAll('.copy-intro').forEach(el=>el.addEventListener('click',()=>copy(el.dataset.copy)));
  const events = [
    '예상치 못한 비 때문에 가까운 처마 밑으로 피신하게 된다.',
    '검문소에서 갑작스러운 출입 통제가 시작된다.',
    '오래된 음악 상자에서 낯선 선율이 흘러나온다.',
    '야시장에서 누군가의 작은 물건을 발견한다.',
    '거리의 정전으로 잠시 둘만의 조용한 시간이 생긴다.',
    '잃어버린 꽃다발의 주인을 찾아야 한다.',
    '낡은 악보 한쪽에서 읽기 어려운 메모가 발견된다.',
    '창가에 남겨진 편지에는 받는 사람의 이름이 없다.',
    '오랫동안 닫혀 있던 영화관에서 작은 상영회가 열린다.',
    '신경 쓰이던 사람이 뜻밖의 작은 선물을 건넨다.',
    '폐역에서 오래된 수색 장치가 잠시 작동한다.',
    '호숫가 산책길에서 갑작스러운 안개가 짙어진다.'
  ];
  let last=0; document.querySelector('#event-roll')?.addEventListener('click',()=>{let i=last; while(events.length>1 && i===last) i=Math.floor(Math.random()*events.length);last=i;document.querySelector('#random-event').textContent=events[i];});
})();