/* Restore four clue choices after an actual interview step. */
'use strict';
function fourClueRun(){return run?.insightFour===1;}
const interviewStart=startCase;
startCase=function(id){interviewStart(id);run.insightFour=1;persist();render();};
const PROJECT_INTERVIEWS={
 coffee:[{id:'solo',name:'刚下课的学生',person:1,question:'课间来咖啡店，你最想得到什么？',answer:COFFEE_ANGLES.solo.quote+' '+COFFEE_ANGLES.solo.answer},{id:'social',name:'和朋友同行的学生',person:0,question:'什么样的咖啡店，会让你们留下来？',answer:COFFEE_ANGLES.social.quote+' '+COFFEE_ANGLES.social.answer}],
 headphones:[{id:'public',name:'音乐节观众',person:0,question:'你在校园里听歌，最在意什么？',answer:'同一首歌，在食堂和音乐节听是两种感觉。广告如果能讲这种变化，我会更有共鸣。'},{id:'private',name:'戴着耳机的学生',person:1,question:'和朋友一起玩，还需要自己的声音空间吗？',answer:'喜欢和朋友去现场，也需要自己的独处时刻。头戴式耳机像给这一刻留一小块自己的空间。'}],
 bike:[{id:'class',name:'赶早八的学生',person:1,question:'每天去上课，什么最让你手忙脚乱？',answer:'早八前，我想把课本和电脑带齐，也少一点手忙脚乱。车上有地方放东西，会更方便。'},{id:'daily',name:'社团与实习两头跑的学生',person:0,question:'一天里多次转场，你会提前想什么？',answer:'社团和实习来回跑，出门前会先想好路线和充电。比起夸张的参数，我更关心它能不能接住我的日常。'}],
 delivery:[{id:'student',name:'学生代表',person:1,question:'午课结束，你最希望午饭怎样安排？',answer:'课间只有十分钟，想提前安排午饭，不用再排一长队。一个人吃饭也想吃好一点，规则和价格最好一眼看懂。'},{id:'merchant',name:'商家',person:3,question:'推广预约套餐，商家要先确认什么？',answer:STAKEHOLDERS.merchant.text},{id:'runner',name:'配送协调员',person:4,question:'“下课就到了”能承诺到哪里？',answer:STAKEHOLDERS.runner.text}]
};
function interviewState(){run.interviewState??={heard:[],selected:[],checked:false,score:0};return run.interviewState;}
function interviewsReady(){const s=interviewState();return PROJECT_INTERVIEWS[run.caseId].every(p=>s.heard.includes(p.id));}
function interviewDefaultDirection(){
 const s=interviewState(),first=s.selected.find(i=>caseData().observations[i].good)??0;
 if(run.caseId==='coffee'){run.angle??=first===1?'social':'solo';temp.angle=run.angle;temp.art={...run.art,layout:COFFEE_ANGLES[run.angle].layout,headline:0,background:'lake'};}
 if(run.caseId==='bike'){run.feature??=first===1?'range':'basket';run.routeScene??=first===1?'daily':'class';temp.art={...run.art,layout:run.routeScene==='class'?'quiet':'split',headline:0};}
 if(run.caseId==='delivery'){run.routeDirection??=first===1?'care':'reservation';temp.art={...run.art,layout:run.routeDirection==='care'?'quiet':'split',headline:0};}
}
function interviewPrimaryHTML(){
 if(run.caseId==='coffee')return `<label class="form-label">两条生活都能成立，这次更想讲哪一条？</label>${chips(Object.entries(COFFEE_ANGLES).map(([id,a])=>[id,a.name]),run.angle,'coffee-angle')}`;
 if(run.caseId==='bike')return `<label class="form-label">把访谈带进广告：这次主打什么？</label>${chips(Object.entries(PROJECT_FEATURES).map(([id,f])=>[id,f.name]),run.feature,'project-feature')}${chips(Object.entries(PROJECT_SCENES),run.routeScene,'project-scene')}`;
 if(run.caseId==='delivery')return `<label class="form-label">两条需要都是真的，这次先讲什么？</label>${chips(Object.entries(DELIVERY_DIRECTIONS).map(([id,d])=>[id,d.name]),run.routeDirection,'project-direction')}`;
 return '';
}
const interviewInsight=insightHTML;
insightHTML=function(){
 if(!fourClueRun())return interviewInsight();const s=interviewState();if(s.checked)interviewDefaultDirection();const c=caseData(),ready=interviewsReady(),support=insightSupportReady();
 const interviews=`<section class="interview-step"><div class="eyebrow">01 / 先做访谈</div><h2>先听他们怎么说，再决定广告讲什么。</h2><p class="lead">${insightModeText(temp.mode)} 听完这次的受众与相关方，下一步从四条线索里选两条。</p><div class="choice-grid">${PROJECT_INTERVIEWS[run.caseId].map(p=>`<article class="interview-card"><div class="speaker">${p.name}</div><p>${p.question}</p>${s.heard.includes(p.id)?dialogue(p.name,p.answer,p.person,'thinking'):button('问问'+p.name,'interview-listen:'+p.id,'pixel-button ghost')}</article>`).join('')}</div><p class="small muted">已访谈 ${s.heard.length} / ${PROJECT_INTERVIEWS[run.caseId].length} · 访谈与预览免费</p></section>`;
 if(!ready)return interviews+`<div class="action-row">${button('换一种分工','back-mode','plain-button')}<span class="small muted">听完访谈，解锁四条线索。</span></div>`;
 const retorts={coffee:'图片和热梗一堆，就算懂学生了吗？',headphones:'飞船和换Logo都安排上了，学生的声音空间呢？',bike:'400km和飞行摩托都写上了，我这辆小六是要去宇宙上早八吗？',delivery:'任意地点秒到，菜品还没确认，谁来接住这张广告？'};
 const feedback=s.checked?`${s.score===0?dialogue(c.name+' · 客户','你的胆子真是肥嘟嘟的。'+retorts[run.caseId],c.client,'shocked'):''}<div class="feedback ${s.score===2?'':'warning'}"><h3>${s.score===2?'这两条线索，有真实生活撑着。':'再想一步：判断来自访谈，还是自己的想当然？'}</h3><p>${c.insight}</p><p class="small muted">可以调整选择后重新确认；也可以带着这次的取舍继续，结果会记入本局。</p></div>${interviewPrimaryHTML()}${projectDraftHTML('这次的主线已进入广告草稿。')}`:'';
 return interviews+insightSupportHTML()+`<section class="clue-step"><div class="eyebrow">02 / 四选二</div><h2>哪两条线索，值得变成广告？</h2><p class="lead">对照刚才的访谈和品牌目标，挑两条。AI的整理只是参考，选择由你决定。</p><div class="choice-grid">${c.observations.map((o,i)=>button(`<span class="mode-name">线索 ${i+1}</span><h3>${esc(o.text)}</h3>`,'observation:'+i,`choice ${s.selected.includes(i)?'selected':''}`,'aria-pressed="'+s.selected.includes(i)+'" '+(!support?'disabled':''))).join('')}</div>${feedback}<div class="round-cost">${costHTML()}<span class="small muted">选择与检查免费，确认进入主视觉时扣除。</span></div><div class="action-row">${button('换一种分工','back-mode','plain-button')}${button(s.checked?'带着线索，去做主视觉':'确认这两条线索',s.checked?'finish-insight':'check-insight','pixel-button',s.selected.length!==2||!support?'disabled':'')}</div></section>`;
};
const interviewAction=action;
action=function(name){
 const [a,arg]=name.split(':');if(!fourClueRun()||run.stage!==1||!temp.mode||temp.completed)return interviewAction(name);
 const s=interviewState();
 if(a==='interview-listen'){const p=PROJECT_INTERVIEWS[run.caseId].find(p=>p.id===arg);if(!p)return;if(!s.heard.includes(arg))s.heard.push(arg);if(run.caseId==='delivery'){run.stakeholders??=[];if(!run.stakeholders.includes(arg))run.stakeholders.push(arg);}persist();render();return;}
 if(['insight-help','insight-goal','insight-toggle','observation','check-insight','finish-insight','coffee-insight-finish','project-insight-finish','coffee-angle','project-feature','project-scene','project-direction'].includes(a)&&!interviewsReady()){toast('先听完访谈，再整理与选择线索。');return;}
 if(a==='observation'){if(!insightSupportReady())return;const i=Number(arg);if(!Number.isInteger(i)||i<0||i>=4)return;if(s.selected.includes(i))s.selected=s.selected.filter(x=>x!==i);else if(s.selected.length<2)s.selected.push(i);else{toast('先取消一条，再换另一条线索。');return;}s.checked=false;temp.insightChecked=false;persist();render();return;}
 if(a==='check-insight'){if(s.selected.length!==2||!insightSupportReady())return;s.score=s.selected.filter(i=>caseData().observations[i].good).length;s.checked=true;temp.insightChecked=true;temp.insightScore=s.score;interviewDefaultDirection();persist();render();return;}
 if(a==='coffee-angle'&&s.checked&&COFFEE_ANGLES[arg]){run.angle=arg;temp.angle=arg;temp.art={...temp.art,layout:COFFEE_ANGLES[arg].layout,headline:0};persist();render();return;}
 if(['coffee-angle','project-feature','project-scene','project-direction'].includes(a)&&!s.checked){toast('先从四条线索里选两条并确认，再决定主线。');return;}
 if(['finish-insight','coffee-insight-finish','project-insight-finish'].includes(a)){if(!s.checked||s.selected.length!==2||!insightSupportReady()){toast('先确认两条线索，再进入主视觉。');return;}interviewDefaultDirection();run.insightGood=s.score===2;completeRound(run.insightGood,caseData().insight,run.insightGood?'先懂生活，再谈脑洞。':'这次取舍，会跟进下一稿。',run.insightGood?'访谈给你依据，AI帮你整理，广告主线由你决定。':'热闹的点子还要对照真实需求，下一环节记得再核验。');return;}
 return interviewAction(name);
};
Object.assign(gameAPI,{start:startCase,action});
render();
