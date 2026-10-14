'use strict';
const config = window.SITE_CONFIG || {};
const catalog = window.CATALOG || [];
const money = row => `${row.prefix || ''}${row.price.toLocaleString('ru-RU')} ₽`;
const categoryBox = document.querySelector('.categories');
const list = document.querySelector('#price-list');
function renderCategory(index) {
 const group = catalog[index];
 document.querySelector('#category-title').textContent = group.title;
 document.querySelector('#category-description').textContent = group.description;
 document.querySelector('#category-count').textContent = `${String(index+1).padStart(2,'0')} / ${String(catalog.length).padStart(2,'0')}`;
 categoryBox.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
 list.replaceChildren();
 group.items.forEach(row=>{
  const item=document.createElement('div');item.className='price-row';
  const info=document.createElement('div'),name=document.createElement('h4'),detail=document.createElement('small'),button=document.createElement('button');
  name.textContent=row.name; detail.textContent=row.detail;button.textContent=money(row);
  button.setAttribute('aria-label',`Обсудить запись: ${row.name}, ${money(row)}`);
  button.addEventListener('click',()=>openBooking(`${row.name}${row.detail ? ' ('+row.detail+')' : ''} — ${money(row)}`));
  info.append(name,detail);item.append(info,button);list.append(item);
 });
}
catalog.forEach((g,i)=>{const b=document.createElement('button');b.textContent=g.title;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>renderCategory(i));categoryBox.append(b);});
if(catalog.length)renderCategory(0);
const dialog=document.querySelector('#booking'), message=document.querySelector('#message');
function safeURL(raw){try{const u=new URL(raw);return u.protocol==='https:'?u.href:null;}catch{return null;}}
function channels(text=''){
 const out=[];
 if(safeURL(config.bookingUrl))out.push(['Онлайн-запись',safeURL(config.bookingUrl)]);
 if(safeURL(config.telegram))out.push(['Telegram',safeURL(config.telegram)]);
 const wa=String(config.whatsapp||'').replace(/\D/g,'');
 if(wa.length>=10)out.push(['WhatsApp',`https://wa.me/${wa}?text=${encodeURIComponent(text)}`]);
 if(safeURL(config.instagram))out.push(['Instagram',safeURL(config.instagram)]);
 const phone=String(config.phone||'').replace(/[^+\d]/g,'');
 if(phone.length>=10)out.push([config.phone,`tel:${phone}`]);
 return out;
}
function addLinks(target,text){
 target.replaceChildren();
 channels(text).forEach(([label,url])=>{
  const a=document.createElement('a');a.href=url;
  const type=url.startsWith('tel:')?'phone':label==='Telegram'?'telegram':label==='WhatsApp'?'whatsapp':label==='Instagram'?'instagram':null;
  if(type){const icon=document.createElement('img');icon.src=`assets/icon-${type}.svg`;icon.alt='';icon.className='contact-icon';icon.width=20;icon.height=20;icon.setAttribute('aria-hidden','true');a.append(icon);}
  const caption=document.createElement('span');caption.textContent=label;a.append(caption);
  if(!url.startsWith('tel:')){a.target='_blank';a.rel='noopener noreferrer';}
  target.append(a);
 });
}
function openBooking(service=''){
 message.value=`Здравствуйте! Хочу записаться${service ? ': '+service : ' на консультацию'}. Подскажите, пожалуйста, ближайшее свободное время.`;
 document.querySelector('#copy-status').textContent='';
 const ready=channels().length>0;
 document.querySelector('#booking-help').textContent=ready?'Выберите удобный способ связи. Для Telegram и Instagram скопируйте сообщение ниже и отправьте его в личные сообщения студии.':'Онлайн-запись пока недоступна. Скопируйте сообщение и отправьте специалисту через привычный канал связи.';
 addLinks(document.querySelector('#booking-links'),message.value);
 dialog.showModal();
}
document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>openBooking(b.dataset.book)));
message.addEventListener('input',()=>addLinks(document.querySelector('#booking-links'),message.value));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#copy').addEventListener('click',async()=>{
 const status=document.querySelector('#copy-status');
 try{await navigator.clipboard.writeText(message.value);status.textContent='Сообщение скопировано. Отправьте его специалисту.';}
 catch{message.focus();message.select();status.textContent='Текст выделен. Нажмите «Копировать» или Ctrl+C / ⌘C.';}
});
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню');}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#location').textContent=[config.city||'Казань',config.address||'По предварительной записи'].join(' · ');
addLinks(document.querySelector('#contact-links'));

const instagramLink=document.querySelector('.instagram-link');
if(instagramLink && safeURL(config.instagram)) instagramLink.href=safeURL(config.instagram);
