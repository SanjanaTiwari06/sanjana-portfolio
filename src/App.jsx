import React,{useState,useEffect,useRef} from 'react';
import D from './data.json';
const api=async(u,o)=>{const r=await fetch(u,o);const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Error '+r.status);return j;};
const TK='ptk';
const h=React.createElement;
function Rv({children}){
 const r=useRef();
 useEffect(()=>{const el=r.current,io=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('in');io.disconnect();}},{threshold:.08});io.observe(el);return()=>io.disconnect();},[]);
 return h('div',{ref:r,className:'rv'},children);
}
function Login({done}){
 const [e,setE]=useState(''),[p,setP]=useState(''),[m,setM]=useState('');
 const go=async()=>{try{const r=await api('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,password:p})});localStorage.setItem(TK,r.token);done();}catch(x){setM(x.message);}};
 const i={style:{padding:'12px 16px',borderRadius:12,border:'1px solid var(--line)',background:'var(--bg)',color:'var(--fg)',font:'inherit'}};
 return h('div',{className:'lb',style:{alignItems:'center'},onClick:done},h('div',{className:'lbi cap',onClick:x=>x.stopPropagation(),style:{display:'grid',gap:12,maxWidth:380}},h('h3',null,'Editor login'),h('input',{...i,type:'email',placeholder:'Email',value:e,onChange:x=>setE(x.target.value)}),h('input',{...i,type:'password',placeholder:'Password',value:p,onChange:x=>setP(x.target.value),onKeyDown:x=>x.key==='Enter'&&go()}),m&&h('p',{className:'mono'},m),h('button',{className:'b f',onClick:go},'Login')));
}
function App(){
 const [S,setS]=useState(D),[edit,setEdit]=useState(false),[ok,setOk]=useState(false),[lg,setLg]=useState(location.hash==='#admin'),[tab,setTab]=useState(0),[lb,setLb]=useState(null),[busy,setBusy]=useState(false);
 useEffect(()=>{const hc=()=>setLg(location.hash==='#admin');window.addEventListener('hashchange',hc);api('/api/site').then(r=>{if(r.data)setS(r.data);}).catch(()=>{});try{setOk(!!localStorage.getItem(TK));}catch(e){}return()=>window.removeEventListener('hashchange',hc);},[]);
 const [dk,setDk]=useState(()=>{try{return localStorage.getItem('th')!=='light';}catch(e){return true;}});
 useEffect(()=>{document.documentElement.dataset.theme=dk?'dark':'light';try{localStorage.setItem('th',dk?'dark':'light');}catch(e){}},[dk]);
 useEffect(()=>{const k=e=>{if(e.key==='Escape')setLb(null);};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k);},[]);
 const up=fn=>setS(p=>{const n=JSON.parse(JSON.stringify(p));fn(n);return n;});
 const t=(tag,val,set,cls)=>h(tag,{className:cls,contentEditable:edit,suppressContentEditableWarning:true,onBlur:edit?e=>set(e.currentTarget.textContent.trim()):undefined},val);
 const del=fn=>edit&&h('button',{className:'x',onClick:e=>{e.stopPropagation();up(fn);}},'✕');
 const add=(lab,fn)=>edit&&h('button',{className:'b',style:{marginTop:16},onClick:e=>{e.stopPropagation();up(fn);}},lab);
 const sec=(id,lab,kids)=>h('section',{id,className:'sec'},h('div',{className:'w'},h(Rv,null,h('div',{className:'mono lab'},lab),kids)));
 const save=async()=>{setBusy(true);try{const d={...S,about:S.about.filter(Boolean),services:S.services.filter(Boolean)};await api('/api/site',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'Bearer '+localStorage.getItem(TK)},body:JSON.stringify({data:d})});setS(d);setEdit(false);}catch(e){alert('Save nahi hua: '+e.message);if(/login/i.test(e.message)){localStorage.removeItem(TK);setOk(false);}}setBusy(false);};
 const uploadPhoto=()=>{const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.onchange=()=>{const x=inp.files[0];if(!x)return;const im=new Image();im.onload=()=>{const k=Math.min(1,800/im.width),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);up(n=>{n.photo=c.toDataURL('image/jpeg',0.82);});};im.src=URL.createObjectURL(x);};inp.click();};
 const pv=p=>p.img||'';
 const shot=i=>{const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.onchange=()=>{const x=inp.files[0];if(!x)return;const im=new Image();im.onload=()=>{const k=Math.min(1,900/im.width),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);up(n=>{n.projects[i].img=c.toDataURL('image/jpeg',0.8);});};im.src=URL.createObjectURL(x);};inp.click();};
 const mv=e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',(e.clientX-r.left)+'px');e.currentTarget.style.setProperty('--my',(e.clientY-r.top)+'px');};
 const tb=S.tabs[tab]||S.tabs[0];
 const xp=(k)=>S[k].map((x,i)=>h('div',{className:'xp',key:i},h('div',null,t('b',x.t,v=>up(n=>{n[k][i].t=v;})),h('br'),t('span',x.o,v=>up(n=>{n[k][i].o=v;}))),t('span',x.d,v=>up(n=>{n[k][i].d=v;}),'mono'),del(n=>{n[k].splice(i,1);})));
 const mq=S.services.concat(S.services).map((s,i)=>h('span',{key:i},s));
 return h(React.Fragment,null,
  h('div',{className:'nav'},h('div',{className:'w'},h('b',null,S.first+' '+S.last),h('nav',null,h('a',{href:'#about'},'About'),h('a',{href:'#services'},'Skills'),h('a',{href:'#work'},'Projects'),h('a',{href:'#resume'},'Resume'),h('a',{href:'#contact',className:'pill'},'Let’s talk'),h('button',{className:'tg','aria-label':'Toggle dark mode',onClick:()=>setDk(!dk)},dk?'☀':'☾')))),
  h('header',{className:'hero',onMouseMove:mv},h('div',{className:'w hg'},h('div',null,
   t('div',S.role,v=>up(n=>{n.role=v;}),'mono'),
   h('h1',null,t('span',S.first,v=>up(n=>{n.first=v;})),' ',t('em',S.last,v=>up(n=>{n.last=v;}))),
   t('p',S.sub,v=>up(n=>{n.sub=v;}),'sub'),
   h('div',{className:'btns'},h('a',{className:'b f',href:'#work'},'See my projects ↓'),h('a',{className:'b',href:'#contact'},'Start a conversation'))),h('div',{className:'ph'},h('img',{src:S.photo||'/sanjana.jpg',alt:S.first+' '+S.last}),edit&&h('button',{className:'x',disabled:busy,onClick:uploadPhoto},'⇪ Photo')))),
  h('div',{className:'mq'},h('div',null,mq)),
  sec('about','01 / The person behind the code',h(React.Fragment,null,h('h2',null,'Full-stack by training. ',h('em',null,'Builder by habit.')),S.about.map((a,i)=>h('div',{key:i},t('p',a,v=>up(n=>{n.about[i]=v;}),'lead'),del(n=>{n.about.splice(i,1);}))),add('+ Add paragraph',n=>{n.about.push('New paragraph');}))),
  sec('craft','02 / Three sides of the stack',h(React.Fragment,null,h('div',{className:'tabs'},S.tabs.map((x,i)=>h('button',{key:i,className:'tab'+(i===tab?' on':''),onClick:()=>setTab(i)},x.k))),h('div',{className:'panel',key:tab},t('h3',tb.t,v=>up(n=>{n.tabs[tab].t=v;})),t('p',tb.d,v=>up(n=>{n.tabs[tab].d=v;}),'lead')))),
  sec('services','03 / What I do',h(React.Fragment,null,h('h2',null,'Built for the browser. ',h('em',null,'Backed by solid APIs.')),S.services.map((s,i)=>h('div',{className:'row',key:i},h('span',{className:'mono'},String(i+1).padStart(2,'0')),t('span',s,v=>up(n=>{n.services[i]=v;}),'nm'),h('span',{className:'ar'},'↗'),del(n=>{n.services.splice(i,1);}))),add('+ Add skill',n=>{n.services.push('New skill');}))),
  sec('work','04 / Selected projects',h(React.Fragment,null,h('h2',null,'The work. ',h('em',null,'Built end to end.')),h('div',{className:'grid'},S.projects.map((p,i)=>h('div',{className:'it',key:i,onClick:()=>!edit&&setLb(p)},
   h('div',{className:'im'},pv(p)?h('img',{src:pv(p),alt:p.title,loading:'lazy',style:{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}}):h('div',{className:'mono',style:{display:'grid',placeItems:'center',height:'100%',padding:24,textAlign:'center',lineHeight:1.8}},t('span',p.tech,v=>up(n=>{n.projects[i].tech=v;})))),
   h('div',{className:'t'},t('span',p.title,v=>up(n=>{n.projects[i].title=v;})),h('span',{className:'mono'},'Project')),
   edit&&h('div',{className:'cap'},p.pts.map((x,j)=>h('div',{key:j},t('p',x,v=>up(n=>{n.projects[i].pts[j]=v;})),del(n=>{n.projects[i].pts.splice(j,1);}))),add('+ Point',n=>{n.projects[i].pts.push('New point');}),h('p',{className:'mono'},'Link: ',t('span',p.link||'add link',v=>up(n=>{n.projects[i].link=v==='add link'?'':v;}))),pv(p)&&h('p',{className:'mono'},'Tech: ',t('span',p.tech,v=>up(n=>{n.projects[i].tech=v;}))),h('button',{className:'b',style:{marginTop:12},onClick:e=>{e.stopPropagation();shot(i);}},'⇪ Screenshot'),p.img&&h('button',{className:'b',style:{marginTop:12,marginLeft:8},onClick:e=>{e.stopPropagation();up(n=>{delete n.projects[i].img;});}},'Remove screenshot')),
   del(n=>{n.projects.splice(i,1);})))),add('+ Add project',n=>{n.projects.push({title:'New project',tech:'Tech stack',link:'',pts:['Describe what you built']});}))),
  sec('resume','05 / Experience & education',h(React.Fragment,null,h('h2',null,'Where I’ve ',h('em',null,'learned and built.')),xp('exp'),add('+ Add experience',n=>{n.exp.push({t:'Title',o:'Organisation',d:'Dates'});}),h('div',{className:'mono lab',style:{marginTop:36}},'Education'),xp('edu'),add('+ Add education',n=>{n.edu.push({t:'Degree',o:'Institute',d:'Years'});}),h('div',{className:'mono lab',style:{marginTop:36}},'Skills'),t('p',S.skills,v=>up(n=>{n.skills=v;}),'sk'),h('a',{className:'b f',href:S.resume,download:true},'Download resume ↓'))),
  sec('philosophy','06 / How I work',h(React.Fragment,null,h('div',{className:'big'},'“',t('span',S.quote,v=>up(n=>{n.quote=v;})),'”'),h('p',{className:'lead',style:{marginTop:28}},t('span',S.phil,v=>up(n=>{n.phil=v;}))))),
  h('section',{id:'contact',className:'ct'},h('div',{className:'w'},h(Rv,null,h('div',{className:'mono lab'},'07 / Let’s talk'),h('h2',null,t('span',S.cta,v=>up(n=>{n.cta=v;}))),
   !edit&&h('div',{style:{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12,marginTop:8}},S.email&&h('a',{className:'b f',href:'mailto:'+S.email},S.email),S.mobile&&h('a',{className:'b',href:'tel:'+S.mobile.replace(/[^\d+]/g,'')},S.mobile),S.linkedin&&h('a',{className:'b',target:'_blank',rel:'noopener',href:S.linkedin},'LinkedIn ↗'),S.github&&h('a',{className:'b',target:'_blank',rel:'noopener',href:S.github},'GitHub ↗')),
   edit&&h('p',{className:'mono',style:{lineHeight:2}},'Email: ',t('span',S.email||'add email',v=>up(n=>{n.email=v==='add email'?'':v;})),h('br'),'Mobile (khaali chhodo to hide): ',t('span',S.mobile||'add mobile',v=>up(n=>{n.mobile=v==='add mobile'?'':v;})),h('br'),'LinkedIn link: ',t('span',S.linkedin||'add linkedin',v=>up(n=>{n.linkedin=v==='add linkedin'?'':v;})),h('br'),'GitHub link: ',t('span',S.github||'add github',v=>up(n=>{n.github=v==='add github'?'':v;})))))),
  h('div',{className:'w'},h('footer',null,h('span',{className:'mono'},'© '+S.first+' '+S.last),h('span',{className:'mono'},'MERN Stack Developer'))),
  lb&&h('div',{className:'lb',onClick:()=>setLb(null)},h('button',{className:'b lbx',onClick:()=>setLb(null)},'← Back'),h('div',{className:'lbi',onClick:e=>e.stopPropagation()},h('div',{className:'cap'},pv(lb)&&h('img',{src:pv(lb),alt:lb.title,style:{width:'100%',borderRadius:14,marginBottom:16}}),h('h3',null,lb.title),h('p',{className:'mono'},lb.tech),lb.pts.map((x,i)=>h('p',{key:i},x)),lb.link&&h('p',null,h('a',{className:'b f',target:'_blank',rel:'noopener',href:lb.link},'View project ↗'))))),
  lg&&!ok&&h(Login,{done:()=>{setLg(false);history.replaceState(null,'',location.pathname);}}),
  ok&&(edit?h('div',{className:'bar'},h('button',{className:'b f',disabled:busy,onClick:save},busy?'Working…':'Save & publish'),h('button',{className:'b',onClick:()=>location.reload()},'Cancel'),h('button',{className:'b',onClick:()=>{localStorage.removeItem(TK);setOk(false);setEdit(false);}},'Logout')):h('button',{className:'b f fab',onClick:()=>setEdit(true)},'✎ Edit')));
}
export default App;
