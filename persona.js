// SAINT-VEIL — interactive persona dice; no server and no user data uploaded.
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const rollButton=$('persona-roll'), fieldsContainer=$('persona-fields');
  if(!rollButton||!fieldsContainer) return;
  const choose=a=>a[Math.floor(Math.random()*a.length)];
  const rand=(min,max)=>min+Math.floor(Math.random()*(max-min+1));
  const names={
    female:['엘로이즈','세라핀','릴리안','비올레트','마리엘','아델린','로웰라','로잘린','에스텔','클라리스','레오니','플로렌스','이벨린','오필리아','이리스','아녜스'],
    male:['에드윈','율리안','레온','에밀','라파엘','노엘','시릴','알렉시','마티아스','엘리엇','오귀스트','루시앙','테오도르','카이엘','레미','아르망'],
    unspecified:['루','레인','노아','엘리','로완','아리엘','에덴','도미니크','카미유','로빈','클로드','모르간']
  };
  const surnames=['로웬','벨리에','모로','드 라크루아','페르','로슈','클레어','모네','오베르','세브랭','리베르','베일','마레','르누아르','엘브랑','델포르'];
  const hairColors=['뿌리만 어두운 스모키 라벤더','푸른 기가 은은하게 도는 흑발','아이보리빛 플래티넘 블론드','장밋빛을 머금은 애쉬 브라운','진한 와인빛 버건디','차분한 청록빛 블랙','옅은 올리브 세이지 그린','우윳빛 애쉬 핑크','코코아 브라운','차가운 은백색','달빛처럼 연한 민트그레이','다크 체리 브라운','모래빛 금발','연한 블루그레이','밤색에 숨은 구리빛'];
  const hairStyles=['숱 많은 초장발과 층층이 흐르는 레이어','불규칙한 시스루 앞머리와 길게 떨어지는 옆머리','머리끝이 가볍게 말린 단발 울프컷','느슨하게 땋아 묶은 장발','무거운 풀뱅과 풍성한 웨이브','끝이 날리는 미디엄 샤기컷','어깨까지 내려오는 부드러운 히메컷','비대칭 앞머리와 로우 포니테일','부드러운 컬이 섞인 레이어드 단발','옆으로 가른 앞머리와 목덜미를 덮는 머리','잔머리가 흩날리는 반묶음 헤어','자연스럽게 흐트러진 숏레이어'];
  const eyes=['연한 회보라색 눈과 금빛 이너링','맑은 호박색 눈과 처진 눈꼬리','청록색 눈에 회색 테두리','안개 낀 듯한 세이지 그린 눈','분홍빛이 도는 회갈색 눈','별빛 같은 푸른색 눈','올리브 골드 눈과 긴 속눈썹','연한 라벤더 그레이 눈','잉크처럼 어두운 남색 눈','옅은 밀크티색의 둥근 눈'];
  const faces=['작고 둥근 얼굴과 아방한 눈매','귀엽지만 어딘가 나른한 인상','차분하고 예민해 보이는 눈매','맑고 섬세한 인상의 미인형 얼굴','부드러운 볼과 작게 다문 입술','도도해 보이지만 웃으면 순해지는 얼굴','웃지 않으면 무표정해 보이는 단정한 얼굴','긴 속눈썹과 약간 졸린 눈','표정 변화가 작아 신비롭게 보이는 얼굴'];
  const distinctive=['한쪽 눈 아래 작은 점','별 모양 머리핀 두 개','리본으로 묶은 긴 옆머리 한 가닥','양쪽 귀의 비대칭 귀걸이','자개 장식의 작은 목걸이','실크 리본을 감은 손목','오래된 열쇠 모양 펜던트','작은 꽃을 넣은 투명 로켓','얇은 안경과 작은 귀걸이','손끝의 작은 흉터'];
  const clothes=['레이스가 겹친 블라우스와 하이웨이스트 스커트','벨트와 금속 장식이 많은 다크 아카데미아 의상','진주 리본이 달린 부드러운 로맨틱 원피스','고전적인 베스트와 잔주름 셔츠','와이드 슬랙스와 오버핏 니트','꽃 자수가 있는 롱 코트와 앵클부츠','비대칭 프릴과 레이어드 치마가 있는 복장','가벼운 테크웨어 재킷과 카고 팬츠','빈티지 셔츠와 반묶음 타이','크림색 케이프와 체크 패턴 의상','장식 벨트가 있는 단정한 셔츠 원피스'];
  const moodSets={
    soft:['소심하고 낯을 가리지만 호기심이 많음. 낯선 사람 앞에서 쉽게 멍해지고 말을 더듬음.','온순하고 아방하지만 소중한 것을 지키려 할 땐 의외로 고집을 보임.','조심스러운 성격. 부탁을 거절하지 못하고 자주 당황하지만 주변을 세심하게 살핌.'],
    calm:['나른하고 조용하며 자신의 세계가 분명함. 필요한 순간에는 정확하게 판단함.','정중하고 느긋함. 다른 사람의 말을 잘 듣지만 쉽게 속내를 드러내지 않음.','섬세하고 낯가림이 있으며 감정을 글이나 음악으로 정리함.'],
    bold:['직설적이고 독립적이며 농담을 자주 함. 위험에는 신중하게 대응함.','활달하고 자존심이 강함. 지기 싫어하지만 어려운 사람을 지나치지 못함.','실용적이고 낯을 가리지 않음. 감정은 솔직하나 약한 모습을 보이기 싫어함.'],
    mysterious:['몽환적이고 엉뚱한 호기심을 품음. 종종 남들과 다른 관점으로 세상을 바라봄.','말수가 적고 침착하지만 꽃과 오래된 물건에 유독 깊은 관심을 보임.','조용하고 느긋함. 마음속 비밀은 많아도 타인에게 불필요한 거짓말은 하지 않음.']
  };
  const vocabs={
    soft:['작고 조심스러운 존댓말. 긴장하면 “아, 저…” 하고 말끝을 흐림.','부드러운 목소리, 짧은 존댓말. 친해져야 조심스럽게 반말이 나옴.'],
    calm:['차분한 존댓말. 감정이 깊어져도 말이 빨라지지 않음.','낮고 부드러운 목소리. 친분에 따라 반말과 존댓말을 구분함.'],
    bold:['시원시원한 반말. 처음에는 예의를 갖추고 친해지면 농담을 섞음.','짧고 또렷한 말투. 어렵거나 불편한 일은 직접 질문함.'],
    mysterious:['조용하고 몽롱한 말투. 생각할 때 잠시 말을 멈춤.','느릿한 존댓말. 좋아하는 주제에서만 말수가 많아짐.']
  };
  const jobs=['꽃 공방 운영자','추모식 소규모 연주자','고서점 직원','고전 악기 수리사','음향 기록 복원 보조원','옛 영화관 영사 기사','전쟁 이후 식물 조사원','음악원 임시 사서','드라이플라워 공예가','서적 제본사','기계 장치 수리공','복구 구역 통신 기사','작은 베이커리 운영자','호숫가 식물원 관리인','의료시설 기록 사무원','구시가지 물자 운송 기사','야시장 소품 상인','카페 겸 작은 화랑 직원','오래된 악보 필사자'];
  const homes=['제1거주구의 창문이 큰 2룸 아파트','제1거주구 오래된 벽돌 주택의 2층','카페 거리 위층의 작은 임대방','구 음악원 인근 오래된 다세대주택','중앙공원 근처 작은 단독주택','제1거주구 변두리의 공방 겸 거처','호수 쪽으로 난 작은 임대주택','제1거주구 남쪽의 저렴한 옥탑방'];
  const hobbies=['압화 책갈피 제작과 오래된 악보 모으기','새벽 꽃시장 구경과 느린 왈츠 듣기','낡은 레코드 수집과 꽃병 손질','골동품 상점 구경과 찻잔 모으기','가로등 아래 산책과 필름 사진 촬영','화분 가꾸기와 오래된 피아노곡 필사','수공 제본과 손편지 쓰기','기계 태엽 수리와 작은 오르골 수집','유리 공예와 허브티 블렌딩','오래된 지도와 영화 포스터 수집'];
  const tastes=['장미차, 배 타르트, 보슬보슬한 빵을 좋아함.','미지근한 밀크티와 바닐라 비스킷을 선호함.','레몬 탄산수, 따뜻한 스튜를 좋아함.','꿀을 넣은 허브티와 딸기 타르트를 좋아함.','블랙커피와 구운 호밀빵을 좋아함.','미지근한 물과 감자 수프를 자주 찾음.'];
  const gestures=['긴장하면 소매 끝을 만지작거림.','졸리면 눈을 천천히 비비고 창가에 기대어 있음.','생각할 때 손끝으로 작은 박자를 셈.','낯가림이 심해지면 목걸이 장식을 만짐.','혼란스러우면 머리카락을 귀 뒤로 넘김.','자주 멍하니 있다가 이름을 듣고 깜짝 놀람.'];
  const skillSets=['꽃과 식물 관리에 능숙함. 체력이 약하고 전투에는 서툼.','현악기 연주와 악보 읽기에 능숙하나 군사 기술은 모름.','종이 복원과 필사에 능숙하지만 외곽 전투에는 익숙하지 않음.','민간 기계 정비에 능숙하나 군용 신경 제어망에 접근할 권한이 없음.','보통 수준의 의학 응급처치를 알고 있으나 전문 의료인은 아님.','음향 장비 수리에 능숙하지만 신경기록의 비밀 기술은 모름.'];
  const pasts=[
    '전쟁 말기 가족과 피난을 경험했음. 현재는 평범한 삶을 지키기 위해 생트베일에 머묾.',
    '전쟁 중 외부의 비교적 안전한 도시에서 자랐음. 일을 구하려 생트베일로 이주함.',
    '전쟁 이후 복구 봉사에 참여했으며 그 인연으로 제1거주구에 정착함.',
    '전쟁으로 고향의 가게를 잃었고, 생트베일에서 작은 공방을 다시 시작함.',
    '어릴 적 음악 교육을 받았으며 전쟁으로 중단된 공부를 다시 시작하려 함.',
    '사라진 가족 기록을 찾으려 이주했으나 회백사건이나 라멘토의 진상은 모름.',
    '구호시설에서 자란 경험이 있고 평범한 직업을 얻어 스스로 생활함.'
  ];
  const goals=['꽃과 음악을 함께하는 작은 전시회를 열고 싶음.','안정된 집을 마련해 혼자만의 생활을 꾸리고 싶음.','전쟁 이전의 악보와 문화 기록을 보존하고 싶음.','자신이 직접 꾸민 가게를 오래 유지하고 싶음.','외곽의 희귀한 식물과 잃어버린 일상 풍경을 기록하고 싶음.','자신이 좋아하는 악기를 수리해 다시 연주하고 싶음.','전쟁 이후 잊힌 지역 주민의 사연을 모아 작은 기록집을 만들고 싶음.'];
  const bonds=['친해지는 데 시간이 걸리며 작은 배려와 편안한 일상을 좋아함.','친구처럼 장난치다가 천천히 깊어지는 관계를 선호함.','함께 책이나 음악을 즐기는 조용한 시간을 중요하게 여김.','상대가 선택을 존중해 주는 대등한 관계를 좋아함.','부끄럼이 많지만 믿는 사람에게는 오래 곁에 머물고 싶어 함.','연애는 서두르지 않고 서로의 생활을 존중하기를 바람.'];
  const scenes={
    ash:['제1거주구 경계에서 새벽 꽃 배달 때문에 마주칠 수 있음.','외곽 출입 허가를 확인받으려 검문소에 들를 수 있음.','이른 아침 전차 정류장에서 우연히 만나 목적지를 질문받을 수 있음.'],
    ian:['오래된 악보를 복원하려 기록보관소를 찾을 수 있음.','꽃잎이 끼워진 편지의 발신인을 찾아 음악원에 방문할 수 있음.','기록보관소의 공개 열람 절차를 문의할 수 있음.'],
    luca:['외곽 폐온실의 식물을 관찰하다 마주칠 수 있음.','버려진 철도 근처에서 길을 잘못 들어 마주칠 수 있음.','외곽 장치 부품을 살피러 갔다가 온실 쪽으로 이동할 수 있음.']
  };
  const ids=['identity','species','appearance','costume','personality','voice','job','home','hobbies','skills','past','goal','bond','hooks'];
  const labels={identity:'이름 · 나이',species:'종족 · 신체',appearance:'외형 · 과캐디',costume:'의상',personality:'성격',voice:'말투 · 습관',job:'직업',home:'거주지',hobbies:'취향 · 취미',skills:'특기 · 한계',past:'과거',goal:'현재 목표',bond:'관계 성향',hooks:'[작성용 메모 · 최종 복사 제외] 세 루트 연결'};
  const state={},locked=new Set();let rollNo=0;let lastGender='female',lastSpecies='human',lastMood='soft';
  function selected(id,arr){const v=$(id).value;return v==='random'?choose(arr):v;}
  function randomItem(id,gender,species,mood){
    switch(id){
      case 'identity':return `${choose(names[gender])} ${choose(surnames)} / ${rand(22,35)}세 / ${gender==='female'?'여성':gender==='male'?'남성':'성별 미설정'}`;
      case 'species':return {human:'인간. 자연적으로 태어나 자랐으며 식사·수면·치료가 필요함.',restored:`인격복원체. ${rand(2073,2077)}년 보존된 신경기록을 바탕으로 생물학적 몸으로 복원됨. 복원 후 자신의 기억과 생활을 새롭게 쌓아 왔으며 식사·수면·치료가 필요함.`,android:'독립 인조인간. 인공신경체와 인공신체를 가짐. 감정과 선택이 가능하고 에너지 보충 및 정비가 필요함. 군용으로 지정된 개체는 아님.'}[species];
      case 'appearance':return `${gender==='male'?rand(171,190):rand(151,176)}cm. ${choose(hairColors)}의 ${choose(hairStyles)}. ${choose(eyes)}. ${choose(faces)}. ${choose(distinctive)}이 특징.`;
      case 'costume':return choose(clothes)+'.';
      case 'personality':return choose(moodSets[mood]);
      case 'voice':return `${choose(vocabs[mood])} ${choose(gestures)}`;
      case 'job':return choose(jobs);
      case 'home':return choose(homes)+'. 현재 혼자 생활함.';
      case 'hobbies':return `${choose(hobbies)}. ${choose(tastes)}`;
      case 'skills':return choose(skillSets);
      case 'past':return species==='restored'?choose([
        '전쟁 말기 다른 지역에서 사망했으나 민간 신경기록을 통해 복원되었음. 회백사건과 직접 연관은 없음.',
        '과거 일부의 기억은 불완전하지만 복원 이후 독립적으로 살아감. 라멘토의 진상은 모름.'
      ]):species==='android'?choose([
        '전후 복구 작업을 지원하던 비전투형 인조인간. 현재는 본인의 의지로 시민 생활을 하고 있음.',
        '민간 시설에서 만들어졌으며 독립 개체로 살아감. 군의 명령이나 추적 대상이라는 설정은 없음.'
      ]):choose(pasts);
      case 'goal':return choose(goals);
      case 'bond':return choose(bonds);
      case 'hooks':return `애쉬: ${choose(scenes.ash)}\n이안: ${choose(scenes.ian)}\n루카: ${choose(scenes.luca)}`;
      default:return '';
    }
  }
  // The final profile contains only player character facts. Guidance notes are displayed separately.
  function buildText(){
    return `# {{user}} 캐릭터 프로필\n\n## 기본 정보\n- 이름 / 나이: ${state.identity}\n- 종족: ${state.species}\n- 직업: ${state.job}\n- 거주지: ${state.home}\n\n## 외형\n${state.appearance}\n- 평소 의상: ${state.costume}\n\n## 성격\n${state.personality}\n\n## 말투와 생활 습관\n${state.voice}\n\n## 취향과 생활\n${state.hobbies}\n\n## 기술과 한계\n${state.skills}\n\n## 과거\n${state.past}\n\n## 현재 목표\n${state.goal}\n\n## 관계 성향\n${state.bond}`;
  }
  function buildNotes(){
    return `## [작성용 메모 / 최종 등록 전 삭제] 루트별 첫 만남 연결 예시 (선택)\n${state.hooks}\n\n## [작성용 메모 / 최종 등록 전 삭제] RP 진행 참고\n- {{user}}의 대사·행동·생각·감정·선택은 {{user}}가 직접 결정함.\n- 애쉬·이안·루카와의 기존 인연이나 연애는 확정되지 않음.\n- 메인 미스터리와 회백사건의 진상은 처음부터 알지 못함.\n- 작성된 설정은 예시이며 {{user}}가 자유롭게 수정할 수 있음.\n\n※ 위 두 항목은 작성 참고 전용이며 최종 복사·TXT 저장에서 자동 제외됩니다.`;
  }

  function render(){
    $('persona-empty').hidden=true;$('persona-filled').hidden=false;
    $('persona-file-no').textContent=String(rollNo).padStart(3,'0');
    const name=(state.identity||'').split('/')[0].trim();
    $('persona-name').textContent=name;
    $('persona-short').textContent=`${state.job} · ${lastSpecies==='human'?'인간':lastSpecies==='restored'?'복원체':'인조인간'} · ${lastMood==='soft'?'소심하고 포근한 이야기':lastMood==='calm'?'조용한 이야기':lastMood==='bold'?'적극적인 이야기':'몽환적인 이야기'}`;
    $('persona-dice-number').textContent=String(rand(1,6));
    fieldsContainer.replaceChildren();
    ids.forEach(id=>{
      const box=document.createElement('div');box.className='persona-field'+(id==='hooks'?' draft-only':'');
      const top=document.createElement('div');top.className='persona-field-top';
      const label=document.createElement('strong');label.textContent=labels[id];
      const buttons=document.createElement('span');buttons.className='persona-field-buttons';
      const lock=document.createElement('button');lock.type='button';lock.textContent=locked.has(id)?'🔒':'🔓';lock.title='다음 주사위에서 이 항목 유지';lock.setAttribute('aria-label',`${labels[id]} ${locked.has(id)?'고정 해제':'고정'}`);lock.setAttribute('aria-pressed',String(locked.has(id)));
      lock.addEventListener('click',()=>{if(locked.has(id))locked.delete(id);else locked.add(id);render();});
      const refresh=document.createElement('button');refresh.type='button';refresh.textContent='↻';refresh.title='이 항목만 다시 뽑기';refresh.setAttribute('aria-label',`${labels[id]} 다시 뽑기`);
      refresh.addEventListener('click',()=>{
        if(id==='identity')lastGender=selected('persona-gender',['female','male','unspecified']);
        if(id==='species')lastSpecies=selected('persona-species',['human','restored','android']);
        if(id==='personality')lastMood=selected('persona-tone',['soft','calm','bold','mysterious']);
        state[id]=randomItem(id,lastGender,lastSpecies,lastMood);
        if(id==='species' && !locked.has('past'))state.past=randomItem('past',lastGender,lastSpecies,lastMood);
        render();
      });
      buttons.append(lock,refresh);top.append(label,buttons);
      const value=document.createElement('div');value.className='persona-field-body';value.textContent=state[id];
      box.append(top,value);fieldsContainer.append(box);
    });
    const text=buildText();$('persona-text').textContent=text;$('persona-notes-text').textContent=buildNotes();$('persona-count').textContent=`${text.length.toLocaleString('ko-KR')} / 5,000자`;
  }
  function roll(){
    if(!locked.has('identity') || !state.identity) lastGender=selected('persona-gender',['female','male','unspecified']);
    if(!locked.has('species') || !state.species) lastSpecies=selected('persona-species',['human','restored','android']);
    if(!locked.has('personality') || !state.personality) lastMood=selected('persona-tone',['soft','calm','bold','mysterious']);
    ids.forEach(id=>{if(!locked.has(id) || !state[id])state[id]=randomItem(id,lastGender,lastSpecies,lastMood);});
    rollNo++;render();
    const die=$('persona-dice-icon');die.classList.remove('rolling');void die.offsetWidth;die.classList.add('rolling');die.textContent=choose(['⚀','⚁','⚂','⚃','⚄','⚅']);
  }
  function notify(msg){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.add('visible');setTimeout(()=>t.classList.remove('visible'),2400);}
  async function copyText(){const text=buildText();try{
    if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);
    else {const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.append(ta);ta.select();document.execCommand('copy');ta.remove();}
    notify('프로필을 복사했어요!');
  }catch{notify('복사 실패: 아래 완성 프로필을 직접 복사해 주세요.');}}
  rollButton.addEventListener('click',roll);
  $('persona-reset').addEventListener('click',()=>{locked.clear();if(rollNo)render();notify('모든 고정을 해제했어요.');});
  $('persona-copy').addEventListener('click',copyText);$('persona-copy-bottom').addEventListener('click',copyText);
  $('persona-download').addEventListener('click',()=>{
    const blob=new Blob(['\ufeff'+buildText()],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='SAINT-VEIL_USER_PROFILE.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  });
})();
