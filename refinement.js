/* Task-specific insight support and consequences. Existing runs keep their rules. */
'use strict';
function refinedRun(){return run?.refinementVersion===1;}
const refineStart=startCase;
startCase=function(id){refineStart(id);run.refinementVersion=1;run.qcSeed=Math.floor(Math.random()*0xffffffff);persist();render();};

function insightSupport(){
 if(!temp.insightSupport)temp.insightSupport=run.insightMemory?.mode===temp.mode?{...run.insightMemory.state}:{};
 return temp.insightSupport;
}
function insightSupportReady(){
 if(!refinedRun()||run.stage!==1||temp.mode==='manual')return true;
 const s=insightSupport();
 return {augmentation:s.generated,automation:s.ran&&s.life&&s.brand,agentic:s.dispatched&&s.goal&&s.brand,alliance:s.consulted&&s.shared}[temp.mode]||false;
}
function supportCandidates(){
 if(run.caseId==='coffee')return ['独处：课间十分钟，给自己留一点空白。','相聚：和朋友下课坐一会，把聊天接下去。'];
 if(run.caseId==='bike')return ['从前置篮筐切入，把课本放进早八出行。','从日常转场切入，把社团与实习连成路线。'];
 if(run.caseId==='delivery')return ['把午饭提前排进课表，强调安排感。','一个人也好好吃，强调被照顾的感受。'];
 return ['把耳机用在图书馆与通勤的个人空间。','把声音用在校园日常，而非堆砌万能性能承诺。'];
}
function insightSupportHTML(){
 const s=insightSupport(),m=temp.mode,list=supportCandidates().map(x=>`<li>${esc(x)}</li>`).join('');
 const toggle=(key,label)=>button(label,'insight-toggle:'+key,`chip ${s[key]?'selected':''}`,'aria-pressed="'+!!s[key]+'"');
 let body='';
 if(m==='manual')body='<p>你直接读访谈、追问和组合线索。没有AI预整理，方向由你从头判断。</p>';
 if(m==='augmentation')body=`<p>先向AI要两个候选，再由你回到访谈里挑选、修改和组合。</p>${button(s.generated?'再看两个候选':'请AI整理两个切入点','insight-help','pixel-button ghost')}${s.generated?`<ul>${list}</ul><p class="small muted">候选不是结论，下面的真实需求仍由你确认。</p>`:''}`;
 if(m==='automation')body=`<p>把筛选标准写进规则，AI按这套标准整理，不自己决定品牌该讲什么。</p><div class="choose-row">${toggle('life','提取具体生活需求')}${toggle('brand','对照品牌目标')}${toggle('exclude','排除无资料承诺')}</div>${button('试跑筛选规则','insight-help','pixel-button ghost')}${s.ran?`<div class="support-report"><strong>规则试跑结果</strong><p>${s.life?'已提取具体使用情境。':'未筛出具体情境，热闹的判断也混进来了。'} ${s.brand?'已按品牌目标分组。':'缺少品牌目标，线索都进了同一堆。'} ${s.exclude?'夸大承诺进入待核验清单。':'未设置承诺筛选，仍需人工核验。'}</p>${s.life&&s.brand?`<ul>${list}</ul>`:''}</div>`:''}`;
 if(m==='agentic')body=`<p>给智能体一个局部目标和可读资料，它自己规划调查步骤。你验收报告，再决定广告方向。</p>${chips([['motivation','找到学生的使用动机'],['explore','探索两种差异化表达']],s.goal,'insight-goal')}<div class="choose-row">${toggle('brand','允许读取品牌资料')}${toggle('interviews','允许读取校园访谈')}</div>${button('派出洞察智能体','insight-help','pixel-button ghost')}${s.dispatched?`<div class="support-report"><strong>自主调查回报</strong><p>${s.goal==='explore'?'计划：比较两种表达 → 查资料边界 → 标出待核验假设。':'计划：归纳使用场景 → 寻找动机 → 核对品牌能否承接。'}</p><p>${s.brand?'已引用确认的品牌资料。':'未获品牌资料权限，不能判断品牌适配。'} ${s.interviews?'已读访谈，候选有情境依据。':'尚未获访谈权限，以下只是待验证假设；请在下面亲自追问或读访谈。'}</p><ul>${list}</ul></div>`:''}`;
 if(m==='alliance')body=`<p>洞察智能体自主分析，创意专家评估表达，客户确认边界；大家用同一份策略，最后由你拍板。</p><div class="choose-row">${toggle('shared','共享品牌目标与确认资料')}</div>${button('召集三方协作会','insight-help','pixel-button ghost')}${s.consulted?`<div class="support-report"><p><strong>洞察智能体：</strong>${supportCandidates()[0]}</p><p><strong>创意专家：</strong>${supportCandidates()[1]}</p><p><strong>客户：</strong>${s.shared?'方向可以不同，产品与服务边界请用确认资料。':'我没收到共享资料，大家的判断可能引用不同版本。'}</p><p class="small muted">协作会不替你做最终取舍。把共同目标带进下面的业务选择。</p></div>`:''}`;
 return `<section class="insight-support" style="--support-color:${MODES[m].color}"><div class="speaker">${MODES[m].name} · 本轮分工</div>${body}${!insightSupportReady()?'<p class="small muted">先完成上面的协作准备，再确认下面的方向。准备与提示不额外扣资源。</p>':''}</section>`;
}
const refineInsight=insightHTML;
insightHTML=function(){let html=refineInsight();if(!refinedRun())return html;if(!insightSupportReady())html=html.replace(/data-action="(coffee-insight-finish|project-insight-finish|finish-insight)"/g,'disabled data-action="$1"');return insightSupportHTML()+html;};
const refineChoose=chooseMode;
chooseMode=function(id){refineChoose(id);if(refinedRun()&&run.stage===1&&temp.mode===id){insightSupport();render();}};

const refineService=servicePromiseHTML;
servicePromiseHTML=function(){if(!refinedRun())return refineService();return `<section class="service-meeting"><h3>上线策略：先服务好一圈，还是让更多人知道？</h3>${stakeholderCards()}<div class="promotion-grid"><article><strong>先把北苑这一圈服务好</strong><p>在取餐点与附近社群推广。覆盖窄一些，预约体验更容易稳定。</p>${button('聚焦北苑，保体验','promotion:focus',`chip ${run.promotionPlan==='focus'?'selected':''}`,run.stage===3&&run.promotionPlan&&run.promotionPlan!=='focus'?'disabled':'')}<p class="small muted">无额外制作成本</p></article><article><strong>把“提前安排”讲给更多人</strong><p>增加App首页与校园社群推广；仍写清截止时间和北苑取餐点，覆盖更多潜在用户。</p>${button('扩大传播，讲清范围','promotion:reach',`chip ${run.promotionPlan==='reach'?'selected':''}`,run.stage===3&&run.promotionPlan&&run.promotionPlan!=='reach'?'disabled':'')}<p class="small muted">主视觉轮额外：体力−2 · 预算−8；交付轮不重复扣</p></article></div>${run.servicePromise==='reservation'?'<p class="saved-workflow">两条路都按预约规则交付。你的推广范围会进入客户反馈。</p>':''}<details class="absurd-pitches"><summary>看看同事的大胆提议</summary>${button('无需预约，任意地点下课秒到','project-promise:unconditional','chip')}${run.servicePromise==='unconditional'?dialogue('下课达 · 运营','你的胆子真是肥嘟嘟的。传播铺得再广，也不能替服务许愿。',6,'shocked'):''}</details></section>`;};
const refineModeCost=modeCost,refineBudgetCost=budgetCost;
modeCost=function(mode,stage){return refineModeCost(mode,stage)+(refinedRun()&&run.caseId==='delivery'&&run.promotionPlan==='reach'&&stage===2?2:0);};
budgetCost=function(mode,stage){return refineBudgetCost(mode,stage)+(refinedRun()&&run.caseId==='delivery'&&run.promotionPlan==='reach'&&stage===2?8:0);};
const refineVerdict=projectVerdict;
projectVerdict=function(){let text=refineVerdict();if(refinedRun()&&run.caseId==='delivery')text+=run.promotionPlan==='reach'?'你额外投入了传播素材，让更多人知道“提前安排”；取餐范围写清了，范围外的同学也能判断是否适合自己。':'你先把宣传聚焦北苑，覆盖更窄，但商家与取餐点更容易接住这一批预约。';return text;};

function sourceChecks(){
 const m=temp.mode;
 const product=m==='automation'?!!temp.lockProduct:m==='agentic'?!!temp.brandData:m==='alliance'?!!temp.fixedAssets:temp.art?.product===caseData().sprite;
 const facts=m==='automation'?!!temp.humanReview:m==='agentic'?!!temp.brandData&&!temp.allowPublish:m==='alliance'?!!temp.sharedMemory&&temp.response==='shared':true;
 return {stage:run.stage,mode:m,product,facts,claim:temp.art?.headline<3&&run.servicePromise!=='unconditional',variable:m!=='automation'||!temp.lockEverything};
}
const refineComplete=completeRound;
completeRound=function(good,detail,title,quote){
 if(!refinedRun()||run.pendingFeedback)return refineComplete(good,detail,title,quote);
 const stage=run.stage,checks=stage>=2?sourceChecks():null,length=run.history.length;
 refineComplete(good,detail,title,quote);
 if(run.history.length===length)return;
 if(checks){run.sourceChecks??=[];run.sourceChecks.push(checks);}else run.history.at(-1).support=temp.mode==='manual'?'人工判断':MODES[temp.mode].name+'完成洞察准备';
 persist();
};
function seededQC(seed){let x=seed>>>0;return ()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296;};}
const refineMakeQC=makeQC;
makeQC=function(){
 if(!refinedRun())return refineMakeQC();
 const rand=seededQC(run.qcSeed),c=caseData(),checks=run.sourceChecks?.at(-1),items=[],notes={product:productText(c,true),logo:'品牌名称引用错误',fact:'引用了变更前的旧信息',claim:'文案承诺超出已提供资料',parameter:'参考续航40km被写成80km',condition:'预约与取餐点条件被删去'};
 const add=(defect,source)=>items.push({defect,source,note:notes[defect]||'品牌项正确，允许表达变化',variant:['center','split','quiet'][Math.floor(rand()*3)],background:rand()<.5?'lake':'night',headline:Math.floor(rand()*3)});
 if(checks&&!checks.product){add('product','当前配置未锁定确认素材');add('product','同一错误引用传播到另一渠道');}
 if(checks&&!checks.facts)add('fact','当前交接缺少最新资料复核');
 if(checks&&!checks.claim)add(run.caseId==='delivery'?'condition':'claim','继承了当前未经支持的承诺');
 const pool=['logo','fact','product','claim',...(run.caseId==='bike'?['parameter']:run.caseId==='delivery'?['condition']:[])];
 const candidates=Math.floor(rand()*3);
 for(let i=0;i<candidates;i++){const index=Math.floor(rand()*pool.length);add(pool.splice(index,1)[0],'同事合并的候选稿');}
 while(items.length<6)add(null,'允许变化的正确物料');
 // Always retain at least two valid variations; a strange layout is not a brand error.
 while(items.filter(q=>!q.defect).length<2)add(null,'允许变化的正确物料');
 for(let i=items.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
 return items.map((q,i)=>({...q,id:'asset-'+i,refined:true}));
};
function qcCase(c){if(run?.caseId==='delivery')return {...c,headlines:(DELIVERY_DIRECTIONS[run.routeDirection]||DELIVERY_DIRECTIONS.reservation).headlines};return c;}
const refineDrawPoster=drawPoster;
drawPoster=function(canvas,art,c,q){if(q?.refined){art={...art,product:c.sprite,headline:q.headline,background:q.background,layout:q.variant};c=qcCase(c);}return refineDrawPoster(canvas,art,c,q);};
const refineInspect=inspectQC;
inspectQC=function(id){
 if(!refinedRun())return refineInspect(id);const q=run.qc?.find(x=>x.id===id);if(!q)return;const c=qcCase(caseData());
 if(!q.defect&&q.variant!=='center'){run.qcAudit??={};run.qcAudit.inspectedVariation=id;persist();}
 modal(`<canvas class="poster-canvas" width="480" height="600" data-qc="${id}" aria-label="放大物料"></canvas><div class="brief-box"><h3>逐项核对</h3><p>品牌：${q.defect==='logo'?c.badLogo:c.name}</p><p>产品素材：${productText(c,q.defect==='product')}</p><p>最新信息：${q.defect==='fact'?c.oldFact:c.fact}</p><p>文案：${q.defect==='claim'?c.badHeadline:c.headlines[q.headline]}</p><p>资料与条件：${['parameter','condition'].includes(q.defect)?c.wrongNote:c.posterNote}</p><p class="small muted">背景和构图可以变化，请按品牌资料判断。</p></div>${button((temp.flags||[]).includes(id)?'取消返工标记':'标记需要返工','flag-modal:'+id)}`,'物料 '+(run.qc.indexOf(q)+1)+' · 查看细节');
};
const refineQCFeedback=qcFeedbackHTML;
qcFeedbackHTML=function(){
 if(!refinedRun())return refineQCFeedback();const score=qcScore(temp.flags||[],run.qc),bad=run.qc.filter(q=>q.defect);
 return `<div class="feedback ${score.perfect?'':'warning'}"><h3>${score.perfect?(bad.length?'关键问题找到了，正确变化也保住了。':'这一批没有品牌错误，保留正确物料。'):'再核对一下资料与允许变化的部分。'}</h3><p>找到 ${score.found} 处问题，遗漏 ${score.missed} 处，误标 ${score.falseFlags} 张。</p>${bad.length?`<p>${bad.map(q=>'物料 '+(run.qc.indexOf(q)+1)+'：'+q.note+'（'+q.source+'）').join('；')}。</p><p>逐张补丁能交付这一批；修正引用与约束，能避免下一批继续复制错误。</p>`:'<p>质检也可以确认“没有问题”。本批无需返工，不扣返工资源。</p>'}</div>`;
};
const refineQuality=qualityHTML;
qualityHTML=function(){let html=refineQuality();if(refinedRun()&&temp.qcChecked&&!run.qc.some(q=>q.defect)){const perfect=qcScore(temp.flags||[],run.qc).perfect;html=html.replace('选择返工方式',perfect?'确认无误，进入签字':'调整误标后，重新检查').replace('data-action="repair-choice"','data-action="'+(perfect?'qc-clear':'check-qc')+'"');}return html;};
const refineTitle=determineTitle;
determineTitle=function(r){
 if(r.refinementVersion!==1)return refineTitle(r);
 const modes=r.history.map(h=>h.mode),allGood=r.history.length===3&&r.history.every(h=>h.good)&&r.reflectionCorrect;
 if(allGood&&modes[0]==='agentic'&&modes[1]==='augmentation'&&['automation','alliance'].includes(modes[2]))return 'mage';
 if(allGood&&new Set(modes).size>=2&&r.qcFirstPerfect&&r.repair==='root'&&r.qc?.some(q=>q.defect)&&r.qcAudit?.preservedVariation&&r.sourceChecks?.length===2&&r.sourceChecks.every(s=>s.product&&s.facts&&s.claim&&s.variable))return 'guardian';
 const counts=Object.fromEntries(Object.keys(MODES).map(m=>[m,0]));modes.forEach(m=>counts[m]++);return Object.keys(counts).sort((a,b)=>counts[b]-counts[a]||modes.lastIndexOf(b)-modes.lastIndexOf(a))[0];
};
TITLES.find(t=>t.id==='guardian').hint='隐藏线索：跨环节协作，固定品牌项，保留正确变化；首次质检后修正源头。';

const refineNotebook=notebookHTML;
notebookHTML=function(){const gain=Math.min(20,100-run.energy);return refineNotebook().replace(/<button([^>]*data-action="rest"[^>]*)>[^<]*<\/button>/,`<button$1 ${gain===0||run.budget<5?'disabled':''}>${gain===0?'体力充足，暂不需要休息':'休息：体力＋'+gain+' · 预算−5'}</button>`);};
const refineAction=action;
action=function(name){
 const [a,arg]=name.split(':');
 if(a==='rest'&&run){if(run.rested)return;if(run.energy>=100){toast('体力充足，休息机会留到后面。');return;}if(run.budget<5){toast('休息需要预算5，当前预算不足。');return;}const gain=Math.min(20,100-run.energy);run.rested=true;run.energy+=gain;run.budget-=5;persist();render();toast('喝水休息：体力＋'+gain+'，预算−5。本局一次。');return;}
 if(!refinedRun())return refineAction(name);
 if(['insight-toggle','insight-goal','insight-help'].includes(a)&&run.stage===1&&temp.mode&&!temp.completed){
  const s=insightSupport();if(a==='insight-toggle'&&['life','brand','exclude','interviews','shared'].includes(arg)){s[arg]=!s[arg];s.ran=false;s.dispatched=false;s.consulted=false;}
  if(a==='insight-goal'&&['motivation','explore'].includes(arg)){s.goal=arg;s.dispatched=false;}
  if(a==='insight-help'){if(temp.mode==='augmentation')s.generated=true;if(temp.mode==='automation')s.ran=true;if(temp.mode==='agentic'){if(!s.goal){toast('先给智能体一个调查目标。');return;}s.dispatched=true;}if(temp.mode==='alliance')s.consulted=true;}
  run.insightMemory={mode:temp.mode,state:{...s}};persist();render();return;
 }
 if(['coffee-insight-finish','project-insight-finish','finish-insight'].includes(a)&&!insightSupportReady()){toast('先完成本轮的协作准备，再确认广告方向。');return;}
 if((a==='promotion'||a==='project-promise'&&arg==='reservation')&&run.caseId==='delivery'&&[2,3].includes(run.stage)&&!temp.completed){if((run.stakeholders?.length||0)<3){toast('先听齐三方需求，再确定推广范围。');return;}const plan=a==='promotion'?arg:(run.promotionPlan||'focus');if(!['focus','reach'].includes(plan))return;if(run.stage===3&&run.promotionPlan&&run.promotionPlan!==plan){toast('推广范围已在主视觉轮确认；这轮按已约定的范围交付。');return;}run.promotionPlan=plan;run.servicePromise='reservation';persist();render();return;}
 if(a==='check-qc'&&run.stage===4){run.qcAudit??={};const id=run.qcAudit.inspectedVariation;run.qcAudit.preservedVariation=!!id&&!(temp.flags||[]).includes(id);}
 if(['repair-choice','repair'].includes(a)&&run.stage===4&&!run.qc.some(q=>q.defect)){if(!temp.qcChecked||!qcScore(temp.flags||[],run.qc).perfect){toast('本批没有品牌错误，请先取消误标并重新检查。');return;}return action('qc-clear');}
 if(a==='qc-clear'||a==='repair-choice'&&run.stage===4&&!run.qc.some(q=>q.defect)&&temp.qcChecked&&qcScore(temp.flags||[],run.qc).perfect){if(run.stage!==4||!temp.qcChecked||run.qc.some(q=>q.defect)||!qcScore(temp.flags||[],run.qc).perfect)return;run.repair='none';run.stage=5;temp={};persist();render();scrollTop();return;}
 if(a==='repair'&&run.stage!==4)return;
 return refineAction(name);
};

// Workflow operations update their panel; the viewport survives with its scroll position.
const refineRender=render;
let refinementRendered=null;
render=function(){
 const app=$('#app'),same=refinementRendered?.run===run&&refinementRendered?.stage===run?.stage&&view==='game';
 const panel=app?.querySelector('.game-panel'),viewport=panel?.querySelector?.('.canvas-viewport');
 const canPatch=same&&viewport&&temp.mode==='automation'&&!temp.completed&&!temp.modeIntro&&typeof panel.replaceChildren==='function';
 if(canPatch){
  const staged=document.createElement('div');staged.innerHTML=stageHTML();const nextViewport=staged.querySelector('.canvas-viewport');
  if(nextViewport){
   const left=viewport.scrollLeft,top=viewport.scrollTop,scrollX=window.scrollX,scrollY=window.scrollY,active=document.activeElement;
   const focusKey=active?.dataset?.field?['data-field',active.dataset.field]:active?.dataset?.action?['data-action',active.dataset.action]:active?.id?['id',active.id]:null;
   const selection=active&&typeof active.selectionStart==='number'?[active.selectionStart,active.selectionEnd]:null;
   viewport.replaceChildren(...nextViewport.childNodes);nextViewport.replaceWith(viewport);panel.replaceChildren(...staged.childNodes);viewport.scrollLeft=left;viewport.scrollTop=top;
   for(const [selector,html] of [['.hud',gameHTML()],['.note-panel',notebookHTML()],['.topbar',topbar()]]){const holder=document.createElement('div');holder.innerHTML=html;const old=app.querySelector(selector),next=holder.querySelector(selector);if(old&&next)old.replaceWith(next);}
   drawAll();if(focusKey){const target=[...app.querySelectorAll('['+focusKey[0]+']')].find(el=>el.getAttribute(focusKey[0])===focusKey[1]);target?.focus({preventScroll:true});if(selection&&target?.setSelectionRange)target.setSelectionRange(...selection);}
   window.scrollTo({left:scrollX,top:scrollY,behavior:'instant'});return;
  }
 }
 refineRender();refinementRendered={run,stage:run?.stage};
};
Object.assign(gameAPI,{start:startCase,chooseMode,action,modeCost,budgetCost,determineTitle});
render();
