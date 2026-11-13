'use strict';
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const zhButton=document.getElementById('zh');
if(zhButton){if(localStorage.getItem('atlas-zh')==='off')document.body.classList.add('hide-zh');const updateZH=()=>{const off=document.body.classList.contains('hide-zh');zhButton.setAttribute('aria-pressed',String(!off));zhButton.querySelector('span').textContent=off?'выкл.':'вкл.';};updateZH();zhButton.onclick=()=>{document.body.classList.toggle('hide-zh');localStorage.setItem('atlas-zh',document.body.classList.contains('hide-zh')?'off':'on');updateZH();};}
function selectSection(){const sections=[...document.querySelectorAll('.atlas-section')];if(!sections.length)return;const hashId=location.hash.slice(1);const id=hashId==='frames'?'builder':hashId;const selected=sections.find(x=>x.id===id)||sections[0];sections.forEach(x=>x.hidden=x!==selected);document.querySelectorAll('[data-section-link]').forEach(a=>{a.classList.toggle('active',a.dataset.sectionLink===selected.id);if(a.dataset.sectionLink===selected.id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});document.title=selected.querySelector('h1').textContent+' · В магазине';}
addEventListener('hashchange',selectSection);selectSection();
let activeAudio=null;
document.addEventListener('play',e=>{if(!(e.target instanceof HTMLMediaElement))return;if(activeAudio&&activeAudio!==e.target){activeAudio.pause();activeAudio.currentTime=0;}activeAudio=e.target;},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-audio-start],[data-audio-pause],[data-audio-resume],[data-audio-stop]');if(!b)return;const audio=b.closest('.audio-box').querySelector('audio');if(b.hasAttribute('data-audio-pause'))audio.pause();else if(b.hasAttribute('data-audio-stop')){audio.pause();audio.currentTime=0;}else{if(b.hasAttribute('data-audio-start'))audio.currentTime=0;audio.play().catch(()=>{});}});
document.addEventListener('change',e=>{if(e.target.matches('[data-audio-rate]'))e.target.closest('.audio-box').querySelector('audio').playbackRate=Number(e.target.value);});
// Student grammar: explicit case selection, quantities, and recorded word families.
document.querySelectorAll('[data-case-word]').forEach(button=>button.addEventListener('click',()=>{const value=button.dataset.caseWord;document.querySelectorAll('[data-case-word]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.caseWord===value)));document.querySelectorAll('[data-case-panel]').forEach(p=>p.hidden=p.dataset.casePanel!==value);}));
const quantityNumber=document.getElementById('quantity-number'),quantityWord=document.getElementById('quantity-word');
function numberForm(n){const lastTwo=n%100,last=n%10;if(lastTwo>=11&&lastTwo<=14)return 2;return last===1?0:last>=2&&last<=4?1:2;}
function numberWords(n,gender){const ones=['ноль','один','два','три','четыре','пять','шесть','семь','восемь','девять'];const teens=['десять','одиннадцать','двенадцать','тринадцать','четырнадцать','пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать'];const tens=['','','двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят','восемьдесят','девяносто'];const hundreds=['','сто','двести','триста','четыреста','пятьсот','шестьсот','семьсот','восемьсот','девятьсот'];let result=[];if(n>=100)result.push(hundreds[Math.floor(n/100)]);let k=n%100;if(k>=10&&k<=19)result.push(teens[k-10]);else{if(k>=20)result.push(tens[Math.floor(k/10)]);k%=10;if(k||n===0){if(k===1)result.push(gender==='ж.'?'одна':gender==='ср.'?'одно':'один');else if(k===2)result.push(gender==='ж.'?'две':'два');else result.push(ones[k]);}}return result.join(' ');}
function showQuantity(){if(!quantityNumber)return;const n=Number(quantityNumber.value),out=document.getElementById('quantity-result'),rule=document.getElementById('quantity-rule');if(quantityNumber.value===''||!Number.isInteger(n)||n<0||n>999){out.textContent='Введите целое число от 0 до 999.';rule.textContent='';return;}const nouns=JSON.parse(document.getElementById('quantity-data').textContent),entry=nouns[Number(quantityWord.value)],index=numberForm(n),word=entry[2][index];out.textContent=`${n} ${word} — ${numberWords(n,entry[1])} ${word}`;rule.textContent=n%100>=11&&n%100<=14?'Последние две цифры — 11–14: падеж 2, множественное число.':index===0?'Последняя цифра — 1: падеж 1, единственное число.':index===1?'Последняя цифра — 2, 3 или 4: падеж 2, единственное число.':'Падеж 2, множественное число.';}
if(quantityNumber){quantityNumber.addEventListener('input',showQuantity);quantityWord.addEventListener('change',showQuantity);showQuantity();}
const familyAudioNode=document.getElementById('family-audio-data');
if(familyAudioNode){const familyAudio=JSON.parse(familyAudioNode.textContent),audio=document.getElementById('pronunciation-audio'),panel=document.querySelector('.pronunciation-panel'),title=document.getElementById('pronunciation-title');document.body.append(panel);const close=document.createElement('button');close.textContent='Закрыть плеер ×';close.className='close-pronunciation';close.onclick=()=>{audio.pause();panel.hidden=true;};panel.prepend(close);document.addEventListener('click',e=>{const button=e.target.closest('[data-pronounce]');if(!button)return;panel.hidden=false;const row=button.closest('tr');title.textContent=button.dataset.audioTitle||row?.querySelector('.sound-word')?.textContent||button.textContent;audio.src=familyAudio[button.dataset.pronounce];audio.playbackRate=Number(document.getElementById('pronunciation-rate').value);audio.play().catch(()=>{});document.querySelectorAll('[data-pronounce]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));});document.getElementById('pronunciation-rate').addEventListener('change',e=>{audio.playbackRate=Number(e.target.value);});document.querySelector('[data-pronunciation-replay]').addEventListener('click',()=>{audio.currentTime=0;audio.play().catch(()=>{});});addEventListener('hashchange',()=>{audio.pause();panel.hidden=true;});}
const modelLexicon={dress:{nom:'платье',acc:'это платье',gender:'средний род',need:'нужно',short:'короткое',pronoun:'оно',plural:false},skirt:{nom:'юбка',acc:'эту юбку',gender:'женский род',need:'нужна',short:'короткая',pronoun:'она',plural:false},scarf:{nom:'шарф',acc:'этот шарф',gender:'мужской род',need:'нужен',short:'короткий',pronoun:'он',plural:false},trousers:{nom:'брюки',acc:'эти брюки',gender:'множественное число',need:'нужны',short:'короткие',pronoun:'они',plural:true}};
function modelSentence(kind,key){const w=modelLexicon[key];const h=x=>`<mark>${escapeHTML(x)}</mark>`;const noun=h(w.nom);if(kind==='need')return `Мне ${h(w.need)} ${noun}.`;if(kind==='length')return `${h(w.nom[0].toUpperCase()+w.nom.slice(1))} слишком ${h(w.short)}.`;if(kind==='like')return `Мне ${h(w.plural?'нравятся':'нравится')} ${noun}.`;if(kind==='price')return `Сколько ${h(w.plural?'стоят':'стоит')} ${noun}?`;if(kind==='request')return `Покажите мне ${h(w.acc)}, пожалуйста.`;return `Я не беру ${h(w.acc)}, потому что ${h(w.pronoun)} слишком ${h(w.short)}.`;}
document.querySelectorAll('[data-model]').forEach(widget=>{const input=widget.querySelector('.model-word');const update=()=>{widget.querySelector('.model-output').innerHTML=modelSentence(widget.dataset.model,input.value);widget.querySelector('.model-explanation').textContent=modelLexicon[input.value].gender+' — выделенные формы согласованы с предметом.';};input.addEventListener('change',update);update();});
const frameItems={dress:{nom:'платье',gender:'ср.',forms:['платье','платья','платьев'],accOne:'платье'},cup:{nom:'чашка',gender:'ж.',forms:['чашка','чашки','чашек'],accOne:'чашку'},mug:{nom:'кружка',gender:'ж.',forms:['кружка','кружки','кружек'],accOne:'кружку'},bag:{nom:'сумка',gender:'ж.',forms:['сумка','сумки','сумок'],accOne:'сумку'}};
const framePeople={'i-man':{nom:'Я',buy:'покупаю',sell:'продаю',past:'купил'},'i-woman':{nom:'Я',buy:'покупаю',sell:'продаю',past:'купила'},anna:{nom:'Анна',buy:'покупает',sell:'продаёт',past:'купила'},ivan:{nom:'Иван',buy:'покупает',sell:'продаёт',past:'купил'},we:{nom:'Мы',buy:'покупаем',sell:'продаём',past:'купили'}};
function countedItem(item,n,acc=false){const index=numberForm(n);let number=numberWords(n,item.gender);if(acc&&index===0&&item.gender==='ж.')number=number.replace(/одна$/,'одну');return number+' '+(index===0&&acc?item.accOne:item.forms[index]);}
function frameState(){const val=id=>document.getElementById(id).value;return {kind:val('frame-kind'),person:framePeople[val('frame-who')],to:val('frame-to'),item:frameItems[val('frame-item')],count:Number(val('frame-count')),place:val('frame-place'),price:Number(val('frame-price')),money:val('frame-money')};}
function frameOutput(s){const q=countedItem(s.item,s.count,true),total=s.price*s.count,currency=s.money==='rub'?['рубль','рубля','рублей']:['юань','юаня','юаней'],sum=total+' '+currency[numberForm(total)],unit=s.price+' '+currency[numberForm(s.price)];const phrase=s.kind==='sell'?`${s.person.nom} ${s.person.sell} ${s.to} ${q} ${s.place} за ${sum}.`:`${s.person.nom} ${s.person.buy} ${q} ${s.place} за ${sum}.`;const unitProduct=numberWords(1,s.item.gender)+' '+s.item.nom,capitalProduct=unitProduct[0].toUpperCase()+unitProduct.slice(1);const dialogue=[['Покупатель',`Будьте добры, покажите ${s.item.accOne}.`],['Продавец',`Пожалуйста. ${capitalProduct} стоит ${unit}.`],['Покупатель',`Дайте мне ${q}. Сколько с меня?`],['Продавец',`С вас ${sum}.`],['Покупатель','Можно платить картой?']];return {phrase,dialogue,sum,q,unit};}
const frameKind=document.getElementById('frame-kind');
function renderFrame(){if(!frameKind)return;const s=frameState();const to=document.getElementById('frame-to');to.querySelector('option[value="мне"]').disabled=s.person.nom==='Я';if(s.kind==='sell'&&s.person.nom==='Я'&&s.to==='мне'){to.value='вам';s.to='вам';}const out=frameOutput(s);document.getElementById('frame-to-label').hidden=s.kind!=='sell';const slots=[['Кто?',s.person.nom],...(s.kind==='sell'?[['Кому?',s.to]]:[]),['Что и сколько?',out.q],['Где?',s.place],['За сколько всего?',out.sum]];document.getElementById('frame-slots').innerHTML=slots.map(([q,a])=>`<div><small>${escapeHTML(q)}</small><b>${escapeHTML(a)}</b></div>`).join('');document.getElementById('frame-result').textContent=out.phrase;document.getElementById('frame-forms').textContent=`Цена одной вещи — ${out.unit}. Количество — ${s.count}. Всего — ${out.sum}.`;document.getElementById('frame-dialogue').innerHTML=out.dialogue.map(([who,text])=>`<p><b>${escapeHTML(who)}</b><span>${escapeHTML(text)}</span></p>`).join('');document.getElementById('frame-copy-status').textContent='';}
if(frameKind){document.querySelector('.frame-constructor').addEventListener('change',renderFrame);renderFrame();document.getElementById('frame-copy').onclick=async()=>{const out=frameOutput(frameState());try{await navigator.clipboard.writeText(out.phrase+'\n'+out.dialogue.map(([w,t])=>w+': '+t).join('\n'));document.getElementById('frame-copy-status').textContent='Скопировано';}catch{document.getElementById('frame-copy-status').textContent='Выделите и скопируйте текст.';}};}

// The four phrase structures share explicit, checked forms of the module's nouns.
const phraseGoods={
 dress:{nom:'платье',acc:'это платье',det:'Это',g:'n'},
 skirt:{nom:'юбка',acc:'эту юбку',det:'Эта',g:'f'},
 scarf:{nom:'шарф',acc:'этот шарф',det:'Этот',g:'m'},
 trousers:{nom:'брюки',acc:'эти брюки',det:'Эти',g:'p'},
 shoes:{nom:'туфли',acc:'эти туфли',det:'Эти',g:'p'},
 bag:{nom:'сумка',acc:'эту сумку',det:'Эта',g:'f'},
 cup:{nom:'чашка',acc:'эту чашку',det:'Эта',g:'f'},
 mug:{nom:'кружка',acc:'эту кружку',det:'Эта',g:'f'},
 coat:{nom:'пальто',acc:'это пальто',det:'Это',g:'n'},
 shirt:{nom:'рубашка',acc:'эту рубашку',det:'Эта',g:'f'},
 phone:{nom:'телефон',acc:'этот телефон',det:'Этот',g:'m'}
};
const phraseQualities={
 expensive:{m:'дорогой',f:'дорогая',n:'дорогое',p:'дорогие'},
 cheap:{m:'дешёвый',f:'дешёвая',n:'дешёвое',p:'дешёвые'},
 new:{m:'новый',f:'новая',n:'новое',p:'новые'},
 fashionable:{m:'модный',f:'модная',n:'модное',p:'модные'},
 beautiful:{m:'красивый',f:'красивая',n:'красивое',p:'красивые'}
};
const showPeople={i:{nom:'Я',show:'покажу',look:'посмотрю'},you:{nom:'Вы',show:'покажете',look:'посмотрите'},seller:{nom:'Продавец',show:'покажет',look:'посмотрит'},anna:{nom:'Анна',show:'покажет',look:'посмотрит'},we:{nom:'Мы',show:'покажем',look:'посмотрим'},they:{nom:'Они',show:'покажут',look:'посмотрят'}};
const phraseMark=s=>`<mark>${escapeHTML(s)}</mark>`;
function showPhrase(action,who,item,to){const p=showPeople[who],w=phraseGoods[item];return `${p.nom} ${p[action]}${action==='show'?' '+to:''} ${w.acc}.`;}
function descriptionPhrase(item,quality,degree){const w=phraseGoods[item],adjective=phraseQualities[quality][w.g];return `${w.det} ${w.nom}${degree?' '+degree:''} ${adjective}.`;}
function opinionVerb(predicate,plural){const forms={fit:['подходит','подходят'],suit:['идёт','идут'],like:['нравится','нравятся']};const negative=predicate.startsWith('not-');const base=negative?predicate.slice(4):predicate;return (negative?'не ':'')+forms[base][plural?1:0];}
function opinionPhrase(role,item,predicate){const w=phraseGoods[item];return `${w.det} ${w.nom} ${role==='buyer'?'мне':'вам'} ${opinionVerb(predicate,w.g==='p')}.`;}
function phraseSlots(id,slots){document.getElementById(id).innerHTML=slots.map(([question,value])=>`<div><small>${escapeHTML(question)}</small><b>${escapeHTML(value)}</b></div>`).join('');}
function renderShowPhrase(){const val=id=>document.getElementById(id).value;const action=val('show-action'),who=val('show-who'),item=val('show-item'),to=document.getElementById('show-to');
 for(const option of to.options)option.disabled=(who==='i'&&option.value==='мне')||(who==='you'&&option.value==='вам');
 if(to.selectedOptions[0].disabled)to.value=who==='you'?'мне':'вам';
 document.getElementById('show-to-field').hidden=action!=='show';
 document.getElementById('show-result').textContent=showPhrase(action,who,item,to.value);
 phraseSlots('show-slots',[['Кто?',showPeople[who].nom],['Что?',phraseGoods[item].acc],...(action==='show'?[['Кому?',to.value]]:[])]);
 document.getElementById('show-help').textContent=action==='show'?'Показать кому? — мне, вам, покупателю. Показать что? — эту сумку, это платье.':'Посмотреть что? — эту сумку, это платье.';
}
function renderDescription(){const item=document.getElementById('describe-item').value,w=phraseGoods[item],quality=document.getElementById('describe-quality'),degree=document.getElementById('describe-degree').value;
 for(const option of quality.options)option.textContent=phraseQualities[option.value][w.g];
 const adjective=phraseQualities[quality.value][w.g];
 document.getElementById('describe-result').innerHTML=`${phraseMark(w.det)} ${escapeHTML(w.nom)}${degree?' '+escapeHTML(degree):''} ${phraseMark(adjective)}.`;
 const genders={m:'Мужской род',f:'Женский род',n:'Средний род',p:'Множественное число'};
 document.getElementById('describe-forms').textContent=`${genders[w.g]}: ${w.det.toLowerCase()} → ${adjective}.`;
}
function renderOpinion(){const role=document.getElementById('opinion-role').value,item=document.getElementById('opinion-item').value,w=phraseGoods[item],predicate=document.getElementById('opinion-predicate');
 const canSuit=!['cup','mug','phone'].includes(item);
 for(const option of predicate.options){option.textContent=opinionVerb(option.value,w.g==='p');option.disabled=!canSuit&&['suit','not-suit'].includes(option.value);}
 if(predicate.selectedOptions[0].disabled)predicate.value='like';
 const person=role==='buyer'?'мне':'вам',verb=opinionVerb(predicate.value,w.g==='p');
 document.getElementById('opinion-result').innerHTML=`${phraseMark(w.det)} ${escapeHTML(w.nom)} ${phraseMark(person)} ${phraseMark(verb)}.`;
 document.getElementById('opinion-forms').textContent=`${role==='buyer'?'Покупатель говорит о себе — мне.':'Продавец обращается к покупателю — вам.'} ${w.g==='p'?'Несколько вещей: подходят, идут, нравятся.':canSuit?'Одна вещь: подходит, идёт, нравится.':'Одна вещь: подходит, нравится.'}`;
}
if(document.getElementById('show-frame')){
 for(const [id,render] of [['show-frame',renderShowPhrase],['describe-frame',renderDescription],['opinion-frame',renderOpinion]]){document.getElementById(id).addEventListener('change',()=>{render();const status=document.querySelector(`#${id} [role="status"]`);if(status)status.textContent='';});render();}
 document.querySelectorAll('[data-copy-phrase]').forEach(button=>button.addEventListener('click',async()=>{const target=button.dataset.copyPhrase,status=document.getElementById(target+'-status');try{await navigator.clipboard.writeText(document.getElementById(target).textContent);status.textContent=' Скопировано';}catch{status.textContent=' Выделите и скопируйте фразу.';}}));
}
