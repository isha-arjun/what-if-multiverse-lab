/* WHAT IF? — Multiverse Intelligence Engine
   Deterministic simulation + narrative systems. No API keys or external dependencies.
   This is AI-inspired procedural intelligence, not a hosted LLM. */
(() => {
  "use strict";
  const STORE = "multiverseIntelligence_v1";
  const $ = id => document.getElementById(id);
  const clamp = n => Math.max(0, Math.min(100, Math.round(n)));
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const read = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {world:{stability:82,threat:28,trust:62,resources:55,knowledge:35},history:[],branches:[],activeBranch:"PRIME",relationships:{}}; } catch { return {world:{stability:82,threat:28,trust:62,resources:55,knowledge:35},history:[],branches:[],activeBranch:"PRIME",relationships:{}}; } };
  let state = read();
  const save = () => localStorage.setItem(STORE, JSON.stringify(state));
  const character = () => $("characterSelect")?.selectedOptions?.[0]?.textContent || "Spider-Man";
  const event = () => $("eventSelect")?.selectedOptions?.[0]?.textContent || "Battle of New York";
  const brain = name => characterBrains[name] || {drive:"protect what matters",method:"careful judgment",voice:"A difficult choice demands clarity.",risk:"the situation may change faster than expected",focus:"teamwork"};
  const eventBrain = name => eventBrains[name] || {problem:"an unexpected crisis is unfolding",stakes:"the people and places involved",lever:"cooperation and careful investigation"};
  const special = {
    "Loki|Thor": {tone:"a tense family rivalry",trust:-12,synergy:4},
    "Thor|Loki": {tone:"a tense family rivalry",trust:-12,synergy:4},
    "Iron Man|Captain America": {tone:"a clash between personal judgment and collective oversight",trust:-8,synergy:8},
    "Captain America|Iron Man": {tone:"a clash between personal judgment and collective oversight",trust:-8,synergy:8},
    "Rocket|Groot": {tone:"a loyal partnership built on instinct and trust",trust:15,synergy:18},
    "Groot|Rocket": {tone:"a loyal partnership built on instinct and trust",trust:15,synergy:18},
    "Spider-Man|Iron Man": {tone:"a mentor-and-protégé dynamic",trust:12,synergy:15},
    "Iron Man|Spider-Man": {tone:"a mentor-and-protégé dynamic",trust:12,synergy:15},
    "Black Widow|Hawkeye": {tone:"long-earned trust between experienced partners",trust:16,synergy:15},
    "Hawkeye|Black Widow": {tone:"long-earned trust between experienced partners",trust:16,synergy:15},
    "Wolverine|Cyclops": {tone:"a disagreement over tactics and responsibility",trust:-5,synergy:8},
    "Cyclops|Wolverine": {tone:"a disagreement over tactics and responsibility",trust:-5,synergy:8},
    "Magneto|Professor X": {tone:"a philosophical disagreement about mutant safety and coexistence",trust:-18,synergy:3}
  };
  const pair = (a,b) => special[a+"|"+b] || null;
  const relScore = (a,b) => {
    if(a===b) return {score:100,label:"Self-directed"};
    const s=pair(a,b); if(s) return {score:clamp(55+s.trust),label:s.tone};
    const A=brain(a),B=brain(b);
    const shared=[A.drive,A.focus,A.method].filter(x=>[B.drive,B.focus,B.method].includes(x)).length;
    const score=clamp(48+shared*13+(A.risk===B.risk?5:0));
    return {score,label:score>72?"Natural alignment":score<42?"Likely friction":"Pragmatic partnership"};
  };
  function selectedPair(){
    const all=[...document.querySelectorAll("#characterSelect option")].map(o=>o.textContent);
    const a=character(), b=all.find(x=>x!==a) || "Iron Man";
    return {a,b};
  }
  function renderWorld(){
    const w=state.world;
    ["stability","threat","trust","resources","knowledge"].forEach(k=>{
      const v=clamp(w[k] ?? 50), node=$("ai-"+k);
      if(node) node.textContent=v;
      const bar=$("ai-"+k+"-bar"); if(bar) bar.style.width=v+"%";
    });
    if($("ai-branch-name")) $("ai-branch-name").textContent=state.activeBranch;
    if($("ai-history-count")) $("ai-history-count").textContent=state.history.length;
    renderHistory(); renderBranches();
  }
  function renderHistory(){
    const root=$("ai-history"); if(!root)return;
    root.replaceChildren();
    if(!state.history.length){root.innerHTML='<p class="muted small">No decisions yet. Run your first simulation turn.</p>';return;}
    state.history.slice().reverse().forEach((h,i)=>{
      const el=document.createElement("article"); el.className="branch";
      const b=document.createElement("b"); b.textContent="TURN "+(state.history.length-i)+" · "+h.character+" / "+h.event;
      const p=document.createElement("p"); p.textContent=h.decision+" — "+h.consequence;
      el.append(b,p); root.append(el);
    });
  }
  function renderBranches(){
    const root=$("ai-branches"); if(!root)return;
    root.replaceChildren();
    state.branches.slice(-8).reverse().forEach(b=>{
      const el=document.createElement("div");el.className="saved-item";
      const info=document.createElement("div"), name=document.createElement("b"), desc=document.createElement("div");
      name.textContent=b.name;desc.className="muted small";desc.textContent=b.summary;
      info.append(name,desc);
      const btn=document.createElement("button");btn.className="btn";btn.textContent="Load";btn.addEventListener("click",()=>loadBranch(b.id));
      el.append(info,btn);root.append(el);
    });
    if(!state.branches.length)root.innerHTML='<p class="muted small">Your alternate branches will appear here.</p>';
  }
  function relationship(){
    const {a,b}=selectedPair(),r=relScore(a,b);
    $("ai-rel-title").textContent=a+" + "+b;
    $("ai-rel-score").textContent=r.score+"/100";
    $("ai-rel-label").textContent=r.label;
    const A=brain(a),B=brain(b),s=pair(a,b);
    $("ai-rel-detail").textContent=s ? "Their interaction is shaped by "+s.tone+". "+(s.synergy>10?"Together they have a strong complementary advantage.":"Their priorities may create friction.") : "Their compatibility is inferred from shared motivations, methods and priorities. "+a+" tends to "+A.drive+", while "+b+" tends to "+B.drive+".";
  }
  function buildOptions(a,e){
    const c=brain(a),v=eventBrain(e);
    return [
      {label:"Prioritize "+c.focus,detail:a+" uses "+c.method+" to respond to "+v.problem+".",effect:{stability:7,threat:-5,trust:5,resources:-2,knowledge:2}},
      {label:"Exploit "+v.lever,detail:"Use "+v.lever+" to change the balance of the crisis.",effect:{stability:1,threat:-3,trust:-2,resources:4,knowledge:9}},
      {label:"Take an unexpected route",detail:a+" chooses to "+c.drive+", accepting that "+c.risk+".",effect:{stability:-4,threat:3,trust:2,resources:-3,knowledge:5}}
    ];
  }
  function interpret(text,a,e){
    const t=text.toLowerCase(), c=brain(a), v=eventBrain(e);
    let effect={stability:0,threat:0,trust:0,resources:0,knowledge:0}, intent="unconventional strategy";
    const rules=[
      {keys:["rescue","save","protect","evacuate","help"],intent:"rescue and protection",effect:{stability:10,threat:-7,trust:9,resources:-3,knowledge:1}},
      {keys:["negotiate","ally","team","unite","cooperate","talk"],intent:"alliance and negotiation",effect:{stability:7,threat:-4,trust:12,resources:1,knowledge:2}},
      {keys:["attack","fight","confront","destroy","stop"],intent:"direct confrontation",effect:{stability:-3,threat:-8,trust:-2,resources:-5,knowledge:0}},
      {keys:["research","study","analyze","investigate","discover"],intent:"investigation and discovery",effect:{stability:3,threat:-2,trust:1,resources:-1,knowledge:14}},
      {keys:["build","invent","create","repair","technology","device"],intent:"engineering and invention",effect:{stability:4,threat:-3,trust:2,resources:-4,knowledge:12}},
      {keys:["trick","deceive","manipulate","secret","infiltrate"],intent:"deception and misdirection",effect:{stability:-4,threat:4,trust:-9,resources:2,knowledge:6}},
      {keys:["retreat","wait","hide","withdraw","contain"],intent:"containment and caution",effect:{stability:6,threat:1,trust:0,resources:2,knowledge:3}},
      {keys:["sacrifice","risk","everything","myself"],intent:"high-risk intervention",effect:{stability:-8,threat:-5,trust:5,resources:-8,knowledge:2}}
    ];
    const rule=rules.find(r=>r.keys.some(k=>t.includes(k)));
    if(rule){intent=rule.intent;effect={...rule.effect};}
    else {effect={stability:2,threat:-1,trust:1,resources:-1,knowledge:4};}
    if(t.includes("loki")||a==="Loki"){effect.trust-=2;}
    if(t.includes("together")||t.includes("team"))effect.trust+=3;
    const world=state.world;
    if(world.knowledge>75 && ["investigation and discovery","engineering and invention"].includes(intent)){effect.stability+=3;effect.threat-=2;}
    if(world.trust<25 && intent==="alliance and negotiation"){effect.trust-=4;}
    return {intent,effect,detail:"Interpreted as "+intent+". The plan is evaluated against "+v.stakes+". "+c.risk+"."};
  }
  function consequence(a,e,decision,intent,effect){
    const c=brain(a),v=eventBrain(e);
    const parts=[];
    if(effect.stability>5)parts.push("The timeline becomes more resilient.");
    if(effect.stability<0)parts.push("Reality becomes less predictable.");
    if(effect.threat< -3)parts.push("The immediate danger is reduced.");
    if(effect.threat>2)parts.push("The threat grows harder to contain.");
    if(effect.trust>5)parts.push("Allies become more willing to cooperate.");
    if(effect.trust< -3)parts.push("Trust between factions deteriorates.");
    if(effect.knowledge>7)parts.push("New information or technology changes what is possible.");
    if(effect.resources< -4)parts.push("The response consumes significant resources.");
    return a+" applies "+intent+" during "+e+". "+parts.join(" ")+" The central stakes remain "+v.stakes+". "+c.drive+" remains the character's guiding motivation.";
  }
  function run(decision){
    const a=character(),e=event(),c=brain(a),parsed=interpret(decision,a,e);
    const before={...state.world};
    Object.keys(parsed.effect).forEach(k=>state.world[k]=clamp((state.world[k]??50)+parsed.effect[k]));
    const outcome=consequence(a,e,decision,parsed.intent,parsed.effect);
    const turn={id:Date.now()+Math.random(),character:a,event:e,decision,intent:parsed.intent,consequence:outcome,before,after:{...state.world},created:new Date().toISOString()};
    state.history.push(turn);state.history=state.history.slice(-80);
    $("ai-last-outcome").textContent=outcome;
    $("ai-last-analysis").textContent=parsed.detail+" "+a+"'s approach: "+c.method+". Motivation: "+c.drive+".";
    renderWorld();save();
  }
  function saveBranch(){
    const name=prompt("Name this timeline branch:", "Variant "+String.fromCharCode(65+state.branches.length%26));
    if(!name)return;
    state.branches.push({id:String(Date.now()),name:name.slice(0,48),summary:state.history.length+" decisions · "+state.activeBranch,world:{...state.world},history:state.history.slice(),created:new Date().toISOString()});
    state.activeBranch=name.slice(0,48);save();renderWorld();
  }
  function loadBranch(id){
    const b=state.branches.find(x=>x.id===id);if(!b)return;
    state.world={...b.world};state.history=b.history.slice();state.activeBranch=b.name;renderWorld();save();
  }
  function reset(){
    if(!confirm("Reset the active timeline? Saved branches will remain available."))return;
    state.world={stability:82,threat:28,trust:62,resources:55,knowledge:35};state.history=[];state.activeBranch="PRIME";renderWorld();save();
  }
  function ask(){
    const q=$("ai-question").value.trim();if(!q)return;
    const a=character(),e=event(),c=brain(a),v=eventBrain(e),w=state.world;
    let answer;
    if(/why|reason|motivat|goal/i.test(q))answer=a+" is driven to "+c.drive+". Their usual method is "+c.method+", though "+c.risk+".";
    else if(/what if|consequence|happen|outcome|future/i.test(q))answer="In this timeline, "+e+" is shaped by "+v.problem+". Current stability is "+w.stability+"/100 and threat is "+w.threat+"/100. The biggest stakes are "+v.stakes+".";
    else if(/relationship|trust|ally|team/i.test(q)){const {a:x,b}=selectedPair(),r=relScore(x,b);answer=x+" and "+b+": "+r.label+" ("+r.score+"/100). "+$("ai-rel-detail").textContent;}
    else answer="The question is being considered through "+a+"'s perspective. "+c.voice+" In "+e+", the key leverage is "+v.lever+". Current timeline knowledge: "+w.knowledge+"/100.";
    $("ai-answer").textContent=answer;
  }
  function compare(){
    const opts=buildOptions(character(),event()),root=$("ai-compare");root.replaceChildren();
    opts.slice(0,2).forEach((o,i)=>{
      const w={...state.world};Object.keys(o.effect).forEach(k=>w[k]=clamp(w[k]+o.effect[k]));
      const card=document.createElement("div");card.className="tile";
      const h=document.createElement("h3");h.textContent="Possible branch "+(i?"B":"A");
      const p=document.createElement("p");p.textContent=o.label+" — "+o.detail;
      const stats=document.createElement("p");stats.textContent="Stability "+w.stability+" · Threat "+w.threat+" · Trust "+w.trust+" · Knowledge "+w.knowledge;
      card.append(h,p,stats);root.append(card);
    });
  }
  function init(){
    const actions={
      "ai-run":()=>{const d=$("ai-decision").value.trim();if(d)run(d);},
      "ai-run-choice":()=>{const opts=buildOptions(character(),event());const n=Number($("ai-option").value);run(opts[n]?.label||opts[0].label);},
      "ai-save-branch":saveBranch,"ai-reset":reset,"ai-ask":ask,"ai-compare-btn":compare
    };
    Object.entries(actions).forEach(([id,fn])=>$(id)?.addEventListener("click",fn));
    $("ai-decision")?.addEventListener("keydown",e=>{if(e.key==="Enter")actions["ai-run"]();});
    $("characterSelect")?.addEventListener("change",relationship);
    $("eventSelect")?.addEventListener("change",()=>{const s=$("ai-event-context");if(s)s.textContent=event();});
    $("ai-event-context").textContent=event();relationship();renderWorld();
    const select=$("ai-option");if(select)select.innerHTML=buildOptions(character(),event()).map((o,i)=>'<option value="'+i+'">'+esc(o.label)+'</option>').join("");
    $("characterSelect")?.addEventListener("change",()=>{if(select)select.innerHTML=buildOptions(character(),event()).map((o,i)=>'<option value="'+i+'">'+esc(o.label)+'</option>').join("");});
    $("eventSelect")?.addEventListener("change",()=>{if(select)select.innerHTML=buildOptions(character(),event()).map((o,i)=>'<option value="'+i+'">'+esc(o.label)+'</option>').join("");});
    renderWorld();
  }
  document.addEventListener("DOMContentLoaded",init);
})();
