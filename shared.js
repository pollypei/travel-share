const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state={trips:window.TRAVEL_SHARE.trips,id:location.hash.slice(1),day:'all',today:new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei'}).format(new Date())};
const weekday=d=>new Intl.DateTimeFormat('zh-TW',{weekday:'short',timeZone:'UTC'}).format(new Date(d+'T00:00:00Z'));
const dateLabel=d=>d.slice(5).replace('-','/')+'（'+weekday(d).replace('週','')+'）';
const group=t=>t.end<state.today?'過往旅程':t.start>state.today?'即將出發':'旅途中';
function days(t){const a=[];for(let d=new Date(t.start+'T00:00:00Z');d<=new Date(t.end+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+1))a.push(d.toISOString().slice(0,10));return a;}
function render(){
 const t=state.trips.find(t=>t.id===state.id)||state.trips[0];if(!t)return;state.id=t.id;
 $('#trip-nav').innerHTML=state.trips.map(x=>`<button class="trip-button" data-trip="${esc(x.id)}" ${x.id===t.id?'aria-current="page"':''}><strong>${esc(x.title)}</strong><small>${esc(x.start)} — ${esc(x.end.slice(5))}</small><small>${esc(x.destination)}</small></button>`).join('');
 $('#content').innerHTML=renderJournal(t,days(t),{readOnly:true});document.title=t.title+' · 旅行手帳';history.replaceState(null,'','#'+t.id);
 $('#published-at').textContent='更新：'+new Intl.DateTimeFormat('zh-TW',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Taipei'}).format(new Date(window.TRAVEL_SHARE.generatedAt));
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.trip){state.id=b.dataset.trip;state.day='all';$('.sidebar').classList.remove('menu-open');$('.menu-toggle').setAttribute('aria-expanded','false');render();window.scrollTo(0,0);}
 else if(b.dataset.openDay)openDay(b.dataset.openDay);
 else if(b.dataset.openEvent)openDay(b.dataset.eventDay,b.dataset.openEvent);
 else if(b.dataset.action==='print')window.print();
 else if(b.dataset.action==='menu'){const open=$('.sidebar').classList.toggle('menu-open');b.setAttribute('aria-expanded',String(open));}
 else if(b.dataset.action==='copy-link'){(navigator.clipboard?navigator.clipboard.writeText(location.href):Promise.reject()).then(()=>{$('#share-message').textContent='已複製這個行程的連結';}).catch(()=>{$('#share-message').textContent='請複製瀏覽器網址分享';});}
});
window.addEventListener('hashchange',()=>{state.id=location.hash.slice(1);state.day='all';render();});
render();
