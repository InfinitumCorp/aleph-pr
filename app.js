const LINES=["Narrative before noise.","Place the story where it will be believed.","The city is already in the room.","Hold the line after the headline."];
const PRACTICES=[
  {id:"Strategy",line:"Decide the story before the room does.",body:"Positioning, narrative architecture, and the posture a reputation needs when attention arrives early — or all at once.",moves:["Narrative architecture","Reputation mapping","Executive counsel","Crisis posture"]},
  {id:"Media",line:"Place it where it will be believed.",body:"Israeli and international desks, launch sequences, and founder platforms. Fewer claims, better doors, a record that survives the week.",moves:["Desk relationships","Launch sequencing","Founder platforms","International placement"]},
  {id:"Influence",line:"Build the circle around the idea.",body:"Cultural partners, creators, and city-scale moments that make a private ambition feel like a public fact.",moves:["Cultural partnerships","Creator rooms","City moments","Community of record"]}
];
const STUDIES=[
  {id:"shoreline",n:"01",title:"Shoreline",d:"Influence",f:"Hospitality",detail:"A waterfront opening, told through the city rather than the building. Residents, night culture, and the sea carried the first weeks."},
  {id:"quiet",n:"02",title:"Quiet Signal",d:"Strategy",f:"Technology",detail:"A deep-tech company needed a public language that was not a pitch. We wrote the vocabulary, then opened the rooms it could enter."},
  {id:"dark",n:"03",title:"After Dark",d:"Media",f:"Culture",detail:"A night festival whose press operation ran like a small newsroom. One confirmed fact, many doors, nothing decorative after midnight."},
  {id:"north",n:"04",title:"Northbound",d:"Strategy",f:"Civic",detail:"An infrastructure project with a decade in it. Told in commutes, coastline, and the people who would live beside the work."},
  {id:"glass",n:"05",title:"Glass & Grain",d:"Influence",f:"Luxury",detail:"A visiting house, a short residency, a city that already had taste. The assignment was the invitation, not the announcement."},
  {id:"freq",n:"06",title:"Frequency",d:"Media",f:"Founders",detail:"Not a profile. Four conversations, placed with desks that do not take sponsored adjectives. The founder spoke once."}
];
let si=0, disc="Strategy", hor="Launch", filter="All", selected="shoreline", sent=null;
const $=(id)=>document.getElementById(id);
function step(n){si=(si+n+LINES.length)%LINES.length; paintSignal();}
function paintSignal(){$("sig-n").textContent=`0${si+1} / 0${LINES.length}`;$("sig").textContent=LINES[si];}
function chips(el, items, current, set){el.innerHTML=items.map(i=>`<button type="button" class="chip${i===current?" on":""}" data-v="${i}">${i}</button>`).join("");el.querySelectorAll("button").forEach(b=>b.onclick=()=>{set(b.dataset.v);});}
function paintPractice(){
  chips($("ptabs"), PRACTICES.map(p=>p.id), disc, v=>{disc=v;paintPractice();});
  const p=PRACTICES.find(x=>x.id===disc);
  $("ppanel").innerHTML=`<p class="line">${p.line}</p><p class="muted">${p.body}</p><ul>${p.moves.map((m,i)=>`<li><span>0${i+1}</span> ${m}</li>`).join("")}</ul>`;
}
function paintWork(){
  chips($("filters"), ["All","Strategy","Media","Influence"], filter, v=>{filter=v;paintWork();});
  const vis=filter==="All"?STUDIES:STUDIES.filter(s=>s.d===filter);
  const active=vis.find(s=>s.id===selected)||vis[0];
  selected=active.id;
  $("study").innerHTML=`<p class="kicker">${active.n} / ${active.d} / ${active.f}</p><h3>${active.title}</h3><p class="muted">${active.detail}</p>`;
  $("grid").innerHTML=vis.map(s=>`<button class="card${s.id===active.id?" on":""}" data-id="${s.id}"><span>${s.n} / ${s.d}</span><b>${s.title}</b><span>${s.f}</span><span>${s.id===active.id?"Viewing":"View study"}</span></button>`).join("");
  $("grid").querySelectorAll("button").forEach(b=>b.onclick=()=>{selected=b.dataset.id;paintWork();$("study").scrollIntoView({behavior:"smooth",block:"nearest"});});
}
function paintSlip(d){
  const code=sent?sent.code:"Draft";
  const b=sent?sent.brief:d;
  $("slip").innerHTML=`<div class="row-slip"><b>ALEPH PR</b><span>${code}</span></div><h3>Brief</h3>
    ${[["Name",b.name],["Organization",b.organization],["Discipline",b.discipline],["Horizon",b.horizon]].map(([k,v])=>`<div class="row-slip"><span>${k}</span><b>${v||"—"}</b></div>`).join("")}
    <p>${(b.note||"Your note will appear here as you write.").trim()}</p>
    ${sent?`<button class="btn" type="button" id="copy">Copy brief</button>`:""}`;
  const c=$("copy"); if(c) c.onclick=async()=>{try{await navigator.clipboard.writeText(`ALEPH PR — ${sent.code}\n${b.name}\n${b.note}`);c.textContent="Copied";}catch{c.textContent="Select the slip";}};
}
function draft(){const f=new FormData($("form"));return {name:f.get("name")||"",organization:f.get("organization")||"",discipline:disc,horizon:hor,note:f.get("note")||""};}
$("form").addEventListener("input",()=>{sent=null;paintSlip(draft());});
$("form").addEventListener("submit",e=>{e.preventDefault();const d=draft();if(!d.name.trim()||!d.note.trim()){$("err").hidden=false;return;}$("err").hidden=true;sent={code:`ALEPH-${Math.floor(1000+Math.random()*9000)}`,brief:{...d,name:d.name.trim(),note:d.note.trim()}};paintSlip(d);$("slip").scrollIntoView({behavior:"smooth",block:"nearest"});});
function tick(){const t=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:"Asia/Jerusalem"}).format(new Date());$("clock").textContent=`${t} Tel Aviv`;}
tick();setInterval(tick,15000);
if(!matchMedia("(prefers-reduced-motion: reduce)").matches) setInterval(()=>step(1),3400);
$("year").textContent=new Date().getFullYear();
function bindChoice(id, items, get, set){
  const el=$(id);
  el.innerHTML=items.map(i=>`<button type="button" class="chip${i===get()?" on":""}" data-v="${i}">${i}</button>`).join("");
  el.querySelectorAll("button").forEach(b=>b.onclick=()=>{set(b.dataset.v);bindChoice(id,items,get,set);paintSlip(draft());});
}
paintSignal();paintPractice();paintWork();
bindChoice("disc", PRACTICES.map(p=>p.id), ()=>disc, v=>{disc=v;});
bindChoice("hor", ["Launch","Reputation","Crisis","Culture"], ()=>hor, v=>{hor=v;});
paintSlip(draft());
