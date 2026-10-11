// v9 / screenshot gallery: local, no external dependencies
(() => {
  const dialog = document.getElementById('rp-sample-dialog');
  if (!dialog) return;
  const image = document.getElementById('rp-sample-dialog-img');
  const title = document.getElementById('rp-sample-dialog-title');
  const orig = document.getElementById('rp-sample-original');
  const entries = {
    ash: {name:'애쉬 벨몬트',file:'ash.png'},
    ian: {name:'이안 에버렛',file:'ian.png'},
    luca:{name:'루카 세레인',file:'luca.png'}
  };
  let restoreFocus=null;
  document.querySelectorAll('.rp-sample-open[data-sample]').forEach(button=>{
    button.addEventListener('click',()=>{
      const sample=entries[button.dataset.sample];
      if (!sample) return;
      restoreFocus=button;
      const url='assets/rp-samples/'+sample.file;
      image.src=url;
      image.alt=sample.name+'의 실제 RP 출력 화면 전체';
      title.textContent=sample.name+' · 실제 RP 예시';
      orig.href=url;
      if (typeof dialog.showModal==='function')dialog.showModal();
      else dialog.setAttribute('open','');
    });
  });
  const close=()=>{if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');restoreFocus?.focus();};
  document.getElementById('rp-sample-dialog-close')?.addEventListener('click',close);
  dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
  dialog.addEventListener('close',()=>{image.removeAttribute('src');restoreFocus?.focus();});
})();
