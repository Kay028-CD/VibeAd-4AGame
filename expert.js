/* Industry expert guidance layer. Direct interview lines are kept short and attributed. */
'use strict';
const EXPERT={name:'林老师 · 广告行业专家',person:7,expression:'thinking'};
const EXPERT_STAGE_HINTS={
  1:'先把访谈里的生活线索和品牌承诺放在同一张桌上。AI可以整理，但切入点是否成立，仍要回到人的判断。',
  2:'原创性和策略不是二选一：先让表达发散，再用确认资料收住边界。',
  3:'同一个项目可以按环节组合不同模式，模式要跟任务走，不必整局只用一种。',
  4:'质检先锁住产品、Logo、事实和承诺边界，再判断背景、构图和表达是否只是合理变化。',
  5:'AI能自主决定多少，与整个流程多依赖AI，是两条不同的轴；最后的战略责任仍由人承担。'
};
const EXPERT_MODE_HINTS={
  manual:'手搓可以保留完整判断，但体力要留给真正需要人的地方。',
  augmentation:'把AI当成扩展手：它给候选和框架，你负责筛选、组合和最终表达。',
  automation:'先把固定项、变量和验收规则写清楚，再让流程批量执行；规矩越清楚，返工越少。',
  agentic:'给智能体一个边界清楚的目标和可读资料，再让它自行规划局部任务；人的验收不能省。',
  alliance:'联盟不是多叫几个智能体，而是共享策略、任务衔接和人的最终责任。'
};
function expertDialogue(text,source='4A框架提示'){
  return `<div class="expert-note">${dialogue(EXPERT.name,text,EXPERT.person,EXPERT.expression)}<span class="expert-source">${esc(source)}</span></div>`;
}
function expertQuote(text,attribution){
  return expertDialogue('“'+text+'”','论文访谈原句（英文） · '+attribution);
}
function expertHintForStage(stage=run?.stage,mode=temp?.mode){
  const line=EXPERT_STAGE_HINTS[stage]||EXPERT_STAGE_HINTS[1];
  return mode&&EXPERT_MODE_HINTS[mode]?line+' '+EXPERT_MODE_HINTS[mode]:line;
}
function expertModeNote(mode=temp?.mode){
  if(mode==='augmentation')return expertQuote('The control is really in my own hands.','B10 · 低嵌入工具使用');
  if(mode==='agentic')return expertQuote('I don’t intervene in that process.','B4 · 目标驱动的局部执行');
  if(mode==='alliance')return expertQuote('If a problem can be solved by workflows, we use workflows.','A1 · 按任务组合模式');
  return expertDialogue(expertHintForStage(run?.stage,mode));
}
function expertInlineHint(text){return `<span class="expert-inline"><strong>林老师：</strong>${esc(text)}</span>`;}

const expertModeHTML=modeHTML;
modeHTML=function(title,description){
  let html=expertModeHTML(title,description);
  const tip=expertModeNote(temp?.mode);
  html=html.replace('<div class="tips">',tip+'<div class="tips">');
  html=html.replace(/<div class="tips">([^<]*)<\/div>/,`<div class="tips">${expertInlineHint('先看任务，再决定分工；提示、调整与模式选择的判断都由你负责。')}</div>`);
  return html;
};

const expertCanvasHint=canvasHint;
canvasHint=function(){
  const n=temp?.hints||0;
  if(n===1)return '林老师：先把品牌要求和确认资产接进生成之前。';
  if(n===2)return '林老师：把“锁定产品与Logo”接在简报之后，把人工确认放在最后。';
  if(n>=3)return '林老师：完整路径是读取简报 → 锁定产品与Logo → 生成变量 → 排版适配 → 人工确认。固定品牌项，保留变量层。';
  return expertCanvasHint();
};

const expertWorkflowHTML=workflowHTML;
workflowHTML=function(){
  let html=expertWorkflowHTML();
  const note=expertDialogue('先把固定项送进流程，再把可变层交给生成；节点顺序服务于品牌责任。');
  return html.replace('<div class="canvas-toolbar">',note+'<div class="canvas-toolbar">');
};

const expertInsightHTML=insightHTML;
insightHTML=function(){
  let html=expertInsightHTML();
  const note=expertDialogue(expertHintForStage(1,temp?.mode));
  return html.replace('<div class="choice-grid">',note+'<div class="choice-grid">');
};

if(typeof insightSupportHTML==='function'){
  const expertInsightSupportHTML=insightSupportHTML;
  insightSupportHTML=function(){
    const html=expertInsightSupportHTML();
    return html.replace('<section class="insight-support"',expertDialogue(EXPERT_MODE_HINTS[temp?.mode]||EXPERT_STAGE_HINTS[1])+'<section class="insight-support"');
  };
}

const expertQualityHTML=qualityHTML;
qualityHTML=function(){
  let html=expertQualityHTML();
  return html.replace('<div class="qc-reference">',expertDialogue(EXPERT_STAGE_HINTS[4])+'<div class="qc-reference">');
};

const expertReviewHTML=reviewHTML;
reviewHTML=function(){
  let html=expertReviewHTML();
  return html.replace('<h2>交稿之前，再想清楚两件事。</h2>','<h2>交稿之前，再想清楚两件事。</h2>'+expertDialogue(EXPERT_STAGE_HINTS[5]));
};

const expertNotebookHTML=notebookHTML;
notebookHTML=function(){
  const html=expertNotebookHTML();
  return html.replace('<aside class="note-panel">','<aside class="note-panel">'+expertDialogue(expertHintForStage(run?.stage,temp?.mode)));
};

const expertGuideModal=guideModal;
guideModal=function(){
  return expertGuideModal().replace('<p class="key-question">','<div class="expert-modal-note">'+expertDialogue('这张矩阵不是升级排行榜，而是帮助你按任务安排人机分工。')+'</div><p class="key-question">');
};

if(typeof eventHTML==='function'){
  const expertEventHTML=eventHTML;
  eventHTML=function(){return expertEventHTML().replace('<div class="random-event">','<div class="random-event">'+expertDialogue('突发需求来了，先判断哪类任务变多，再看哪个模式更省资源。') );};
}

Object.assign(gameAPI,{expertDialogue,expertHintForStage});
