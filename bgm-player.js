// SAINT-VEIL BGM 5: MP3 file diagnostics + playback state tracking.
(() => {
  'use strict';
  const songs = {
    main: ['Ashes of Solid Things','assets/audio/main.mp3'],
    ash: ['The Locked Door','assets/audio/ash.mp3'],
    ian: ['The Unwritten Waltz','assets/audio/ian.mp3'],
    luca: ['The First Flower','assets/audio/luca.mp3']
  };
  const $ = id => document.getElementById(id);
  const widget = document.querySelector('.bgm-widget'), audio=$('bgm-audio'), sel=$('bgm-select'), toggle=$('bgm-toggle');
  const title=$('bgm-title'), badge=$('bgm-status'), notice=$('bgm-notice'), volume=$('bgm-volume');
  const check=$('bgm-check'), diagnostics=$('bgm-diagnostics');
  if (![widget,audio,sel,toggle,title,badge,notice,volume].every(Boolean)) return;
  let key=sel.value in songs ? sel.value : 'main';
  let attempt=0;
  const status=(s,m)=>{badge.textContent=s;notice.textContent=m;};
  const controls=(playing)=>{widget.classList.toggle('is-playing',playing);toggle.textContent=playing?'Ⅱ':'▶';toggle.setAttribute('aria-label',playing?'음악 일시정지':'음악 재생');};
  const trackPath=k => new URL(songs[k][1],document.baseURI).href;
  const failText=(err)=>{
    if (err?.name==='NotAllowedError') return '브라우저가 재생을 차단했어요. ▶ 버튼을 직접 눌러주세요.';
    if (err?.name==='NotSupportedError' || audio.error?.code===4) return 'MP3 형식을 읽지 못했어요. 파일을 확인해 주세요.';
    return '곡을 불러오지 못했어요. 「음악 파일 점검」에서 주소와 파일 상태를 확인해 주세요.';
  };
  function selectSong(k){
    key=k in songs?k:'main'; sel.value=key;attempt++;
    audio.pause(); controls(false);
    title.textContent='♪ '+songs[key][0];
    audio.src=trackPath(key);audio.load();
    status('READY','▶ 버튼을 누르면 재생돼요. 처음부터 자동 재생되지는 않아요.');
  }
  async function start(){
    const run=++attempt;
    status('LOADING','음악을 불러오는 중이에요…');
    try{
      await audio.play();
      if(run!==attempt)return;
      controls(true);status('PLAYING','음악 재생 중 · 소리가 작다면 음량과 기기 소리를 확인해 주세요.');
    }catch(err){
      if(run!==attempt)return;
      controls(false);status('CHECK',failText(err));
    }
  }
  toggle.addEventListener('click',()=>{
    if(audio.paused){void start();}else{attempt++;audio.pause();controls(false);status('PAUSED','일시정지 중');}
  });
  sel.addEventListener('change',()=>{
    const wasPlaying=!audio.paused;selectSong(sel.value);if(wasPlaying)void start();
  });
  audio.addEventListener('playing',()=>{controls(true);if(badge.textContent!=='PLAYING')status('PLAYING','음악 재생 중');});
  audio.addEventListener('pause',()=>{if(audio.paused)controls(false);});
  audio.addEventListener('waiting',()=>{if(!audio.paused)status('LOADING','오디오 버퍼링 중…');});
  audio.addEventListener('error',()=>{
    controls(false);
    const errors={1:'재생이 취소되었어요',2:'파일 요청 중 네트워크 오류',3:'MP3 디코딩 오류',4:'파일 누락 또는 형식 미지원'};
    status('CHECK',(errors[audio.error?.code]||'오디오 오류')+' · 음악 파일 점검을 눌러주세요.');
  });
  audio.addEventListener('volumechange',()=>{volume.value=Math.round(audio.volume*100);});
  volume.addEventListener('input',()=>{audio.volume=Math.max(0,Math.min(1,Number(volume.value)/100));audio.muted=false;});
  audio.loop=true;audio.volume=Number(volume.value)/100;
  selectSong(key);
  // Troubleshoot GitHub Pages path/case and missing files without making private network calls.
  check?.addEventListener('click',async()=>{
    diagnostics.hidden=!diagnostics.hidden;
    if(diagnostics.hidden)return;
    diagnostics.replaceChildren();
    const intro=document.createElement('p');intro.textContent='배포된 파일 상태를 확인해요. 빨간 항목이 나오면 GitHub에 해당 MP3가 없는 상태예요.';diagnostics.append(intro);
    for(const [k,[name,path]] of Object.entries(songs)){
      const row=document.createElement('div');row.textContent=`${name}: 확인 중…`;diagnostics.append(row);
      try{
        // Read one byte using Range; some servers ignore Range but still reply 200.
        const response=await fetch(trackPath(k),{method:'GET',headers:{Range:'bytes=0-0'},cache:'no-store'});
        const contentType=response.headers.get('content-type')||'';
        const ok=response.ok && !contentType.toLowerCase().includes('text/html');
        await response.body?.cancel();
        row.textContent=`${ok?'✓':'✕'} ${name} · HTTP ${response.status} · ${path}`;
        row.className=ok?'bgm-healthy':'bgm-unhealthy';
        if(!ok){const a=document.createElement('a');a.href=trackPath(k);a.target='_blank';a.rel='noopener noreferrer';a.textContent=' 파일 직접 확인 ↗';row.append(a);}
      }catch(err){row.textContent=`✕ ${name} · 네트워크/접근 오류 · ${path}`;row.className='bgm-unhealthy';}
    }
    const hint=document.createElement('p');hint.textContent='모두 정상인데 재생되지 않으면 ▶을 다시 누르고 휴대폰 무음 설정·브라우저 사이트 음소거를 확인해 주세요.';diagnostics.append(hint);
  });
})();
