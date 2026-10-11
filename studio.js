(() => {
  const el=id=>document.getElementById(id);
  const list=el('studio-items'),drop=el('studio-drop'),input=el('image-input');
  const items=[];
  const kinds={ash:'애쉬',ian:'이안',luca:'루카',world:'월드·기타'};
  const statuses={candidate:'보관 후보',public:'공개',replaced:'교체 이미지',unused:'미사용 이미지'};
  const types=new Set(['image/png','image/jpeg','image/webp','image/gif']);
  let toastTimer;
  function notice(str){const node=el('studio-toast');node.textContent=str;node.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('visible'),3000);}
  function extOf(name){return /\.[a-z0-9]{2,5}$/i.exec(name)?.[0].toLowerCase() || '.png';}
  function cleanName(s,ext){s=(s||'image').replace(/[\\/:*?"<>|\x00-\x1f]/g,'_').replace(/^\.+/g,'').trim();return ((s||'image').slice(0,125))+ext;}
  function fileBase(s){return s.replace(/\.[^.]+$/,'');}
  function addFiles(files){let added=0;for(const file of files){if(!types.has(file.type)){continue;}const obj={file,cat:'ash',status:'candidate',name:fileBase(file.name),url:URL.createObjectURL(file),id:Math.random().toString(36).slice(2)};items.push(obj);added++;}render();if(added)notice(`${added}개 이미지가 임시 목록에 추가됐어요.`);else notice('PNG, JPG, WEBP, GIF 이미지를 선택해 주세요.');}
  input.addEventListener('change',e=>{addFiles([...e.target.files]);e.target.value='';});
  drop.addEventListener('click',()=>input.click());
  drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click();}});
  for(const ev of ['dragenter','dragover'])drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('is-dragging');});
  for(const ev of ['dragleave','drop'])drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('is-dragging');});
  drop.addEventListener('drop',e=>addFiles([...e.dataTransfer.files]));
  function render(){list.replaceChildren();let counts={public:0,candidate:0,replaced:0,unused:0};items.forEach(item=>counts[item.status]++);
    el('studio-count').textContent=`전체 ${items.length}개 · 공개 ${counts.public} · 교체 ${counts.replaced} · 미사용 ${counts.unused} · 보관 후보 ${counts.candidate}`;
    el('export-public').disabled=!counts.public;el('export-backup').disabled=!items.length;
    if(!items.length){const d=document.createElement('div');d.className='studio-empty';d.textContent='파일을 추가하면 이곳에 미리보기와 분류 도구가 나타나요.';list.appendChild(d);return;}
    items.forEach(item=>{const card=document.createElement('article');card.className='studio-item';const prev=document.createElement('div');prev.className='studio-preview';const img=document.createElement('img');img.src=item.url;img.alt=item.file.name;prev.appendChild(img);
      const fields=document.createElement('div');fields.className='studio-fields';
      const nameLabel=document.createElement('label');nameLabel.textContent='파일명 (확장자 제외)';const name=document.createElement('input');name.value=item.name;name.setAttribute('aria-label','파일명');name.addEventListener('input',()=>item.name=name.value);nameLabel.appendChild(name);
      const row=document.createElement('div');row.className='studio-fieldrow';
      for(const [target,key,options] of [['캐릭터','cat',kinds],['보관 상태','status',statuses]]){const label=document.createElement('label');label.textContent=target;const sel=document.createElement('select');sel.setAttribute('aria-label',target);Object.entries(options).forEach(([v,t])=>{const op=document.createElement('option');op.value=v;op.textContent=t;sel.appendChild(op);});sel.value=item[key];sel.addEventListener('change',()=>{item[key]=sel.value;const focused=document.activeElement;render();});label.appendChild(sel);row.appendChild(label);}
      const info=document.createElement('div');info.className='studio-fieldnote';info.textContent=`${(item.file.size/1024/1024).toFixed(2)} MB · ${item.file.name}`;
      const remove=document.createElement('button');remove.className='studio-remove';remove.type='button';remove.textContent='이 파일 제외 ×';remove.addEventListener('click',()=>{items.splice(items.indexOf(item),1);URL.revokeObjectURL(item.url);render();});
      fields.append(nameLabel,row,info,remove);card.append(prev,fields);list.appendChild(card);
    });
  }
  el('clear-images').addEventListener('click',()=>{if(items.length&&!confirm('임시 목록을 비울까요? 다운로드하지 않은 파일 분류 내용은 사라져요.'))return;for(const x of items)URL.revokeObjectURL(x.url);items.length=0;render();});
  // Standalone, uncompressed ZIP writer. Image formats are already compressed.
  const encoder=new TextEncoder();let crcTable;
  function makeTable(){let t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?(0xEDB88320^(c>>>1)):c>>>1;t[n]=c>>>0;}return t;}
  async function crcBlob(blob){if(!crcTable)crcTable=makeTable();let c=0xffffffff;let reader=blob.stream().getReader();while(true){const {done,value}=await reader.read();if(done)break;for(let i=0;i<value.length;i++)c=crcTable[(c^value[i])&255]^(c>>>8);}return (c^0xffffffff)>>>0;}
  const u16=(v,n,x)=>v.setUint16(n,x,true),u32=(v,n,x)=>v.setUint32(n,x>>>0,true);
  async function zipDownload(files,filename){let localParts=[],cdParts=[],offset=0;const date=new Date();const dosDate=((Math.max(1980,date.getFullYear())-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate();const dosTime=(date.getHours()<<11)|(date.getMinutes()<<5)|(date.getSeconds()>>1);
    for(const {path,blob} of files){const name=encoder.encode(path);const crc=await crcBlob(blob);const len=blob.size;if(len>=0xffffffff)throw Error('파일 크기가 ZIP 제한을 초과했습니다.');
      const header=new Uint8Array(30+name.length);const dv=new DataView(header.buffer);u32(dv,0,0x04034b50);u16(dv,4,20);u16(dv,6,0x0800);u16(dv,8,0);u16(dv,10,dosTime);u16(dv,12,dosDate);u32(dv,14,crc);u32(dv,18,len);u32(dv,22,len);u16(dv,26,name.length);u16(dv,28,0);header.set(name,30);localParts.push(header,blob);
      const central=new Uint8Array(46+name.length);const cv=new DataView(central.buffer);u32(cv,0,0x02014b50);u16(cv,4,20);u16(cv,6,20);u16(cv,8,0x0800);u16(cv,10,0);u16(cv,12,dosTime);u16(cv,14,dosDate);u32(cv,16,crc);u32(cv,20,len);u32(cv,24,len);u16(cv,28,name.length);u16(cv,30,0);u16(cv,32,0);u16(cv,34,0);u16(cv,36,0);u32(cv,38,0);u32(cv,42,offset);central.set(name,46);cdParts.push(central);offset+=header.length+len;
    }
    const cdSize=cdParts.reduce((sum,a)=>sum+a.length,0);const end=new Uint8Array(22);const v=new DataView(end.buffer);u32(v,0,0x06054b50);u16(v,4,0);u16(v,6,0);u16(v,8,files.length);u16(v,10,files.length);u32(v,12,cdSize);u32(v,16,offset);u16(v,20,0);
    if(files.length>65535||offset+cdSize>0xffffffff)throw Error('한 번에 ZIP으로 처리하기에 파일이 너무 많습니다.');
    const zip=new Blob([...localParts,...cdParts,end],{type:'application/zip'});const link=document.createElement('a');const url=URL.createObjectURL(zip);link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  }
  function selectedFiles(mode){const selected=mode==='public'?items.filter(x=>x.status==='public'):items;const taken=new Set();const out=[];for(const x of selected){const ext=extOf(x.file.name);const base=cleanName(x.name,ext);const root=mode==='public'?`assets/gallery/${x.cat}/`:`archive/${x.status}/${x.cat}/`;let final=root+base,n=2;while(taken.has(final)){final=root+cleanName(`${x.name} (${n++})`,ext);}taken.add(final);out.push({path:final,blob:x.file});}return out;}
  async function exportMode(mode){const files=selectedFiles(mode);if(!files.length){notice('해당 상태의 이미지가 없어요.');return;}const publicFile=mode==='public';const btn=el(publicFile?'export-public':'export-backup');btn.disabled=true;const before=btn.textContent;btn.textContent='ZIP 생성 중…';try{const meta={exportedAt:new Date().toISOString(),note:'백업 파일은 공개 저장소에 올리지 마세요. 홈페이지 정리실에서 만든 로컬 ZIP입니다.',items:items.map(i=>({original:i.file.name,filename:cleanName(i.name,extOf(i.file.name)),category:i.cat,status:i.status}))};if(!publicFile)files.push({path:'archive/분류목록.json',blob:new Blob([JSON.stringify(meta,null,2)],{type:'application/json'})});await zipDownload(files,publicFile?'생트베일_공개앨범_업로드용.zip':'생트베일_이미지전체_개인백업.zip');notice('ZIP 생성이 완료됐어요. 다운로드 폴더를 확인해 주세요.');}catch(e){console.error(e);notice('ZIP 생성 중 오류가 발생했어요. 파일을 나누어서 시도해 주세요.');}finally{btn.textContent=before;render();}}
  el('export-public').addEventListener('click',()=>exportMode('public'));el('export-backup').addEventListener('click',()=>exportMode('backup'));
  window.addEventListener('beforeunload',e=>{if(items.length){e.preventDefault();e.returnValue='';}});
  render();
})();
