const KEY="mrtls_demo_v1";
const defaultState={theme:"light",platformName:"MRTLS",description:"Digital Platform",projects:[
{id:1,name:"MRTLS Launch",description:"تهيئة النسخة التجريبية للمنصة.",status:"active"},
{id:2,name:"واجهة العملاء",description:"تصميم تجربة استخدام حديثة وسريعة.",status:"completed"}
],activities:["تم إنشاء المشروع التجريبي","تم تشغيل لوحة التحكم","تم تهيئة نسخة MRTLS الأولى"]};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||defaultState;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function save(){localStorage.setItem(KEY,JSON.stringify(state));render();}
function statusText(s){return s==="active"?"نشط":s==="completed"?"مكتمل":"متوقف"}
function render(){
 document.body.classList.toggle("dark",state.theme==="dark");
 $("#projectCount").textContent=state.projects.length;
 $("#activeCount").textContent=state.projects.filter(p=>p.status==="active").length;
 $("#doneCount").textContent=state.projects.filter(p=>p.status==="completed").length;
 $("#completionRate").textContent=(state.projects.length?Math.round(state.projects.filter(p=>p.status==="completed").length/state.projects.length*100):0)+"%";
 $("#activityCount").textContent=state.activities.length;
 $("#platformName").value=state.platformName; $("#platformDescription").value=state.description;
 renderRecent(); renderProjects(); renderActivity();
}
function projectCard(p){
 return '<article class="project-card"><span class="badge '+p.status+'">'+statusText(p.status)+'</span><h3>'+escapeHtml(p.name)+'</h3><p>'+escapeHtml(p.description||"بدون وصف")+'</p><div class="project-card-footer"><small>مشروع رقمي</small><button class="delete-btn" data-delete="'+p.id+'">حذف</button></div></article>';
}
function renderRecent(){
 const box=$("#recentProjects"); const list=state.projects.slice(-4).reverse();
 box.innerHTML=list.length?list.map(p=>'<div class="project-row"><div><h4>'+escapeHtml(p.name)+'</h4><p>'+escapeHtml(p.description||"بدون وصف")+'</p></div><span class="badge '+p.status+'">'+statusText(p.status)+'</span></div>').join(""):'<div class="empty"><strong>لا توجد مشاريع</strong>أنشئ أول مشروع من الزر العلوي.</div>';
}
function renderProjects(){
 const q=($("#searchInput")?.value||"").trim().toLowerCase();
 const list=state.projects.filter(p=>(p.name+" "+p.description).toLowerCase().includes(q));
 $("#allProjects").innerHTML=list.length?list.map(projectCard).join(""):'<div class="empty"><strong>لا توجد نتائج</strong>جرّب اسمًا مختلفًا.</div>';
 $$("[data-delete]").forEach(b=>b.onclick=()=>{const id=Number(b.dataset.delete);state.projects=state.projects.filter(p=>p.id!==id);state.activities.unshift("تم حذف مشروع");state.activities=state.activities.slice(0,20);save()});
}
function renderActivity(){$("#activityList").innerHTML=state.activities.map((a,i)=>'<div class="activity"><div class="activity-icon">✓</div><div><strong>'+escapeHtml(a)+'</strong><small>'+(i===0?"الآن":"نشاط سابق")+'</small></div></div>').join("")||'<div class="empty">لا يوجد نشاط.</div>'}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function showSection(id){
 $$(".section").forEach(s=>s.classList.toggle("active",s.id===id));
 $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.section===id));
 const titles={dashboard:"لوحة التحكم",projects:"المشاريع",activity:"النشاط",settings:"الإعدادات"};
 $("#pageTitle").textContent=titles[id]||"لوحة التحكم";
}
$$(".nav-item").forEach(b=>b.onclick=()=>showSection(b.dataset.section));
$$("[data-section-link]").forEach(b=>b.onclick=()=>showSection(b.dataset.sectionLink));
$("#themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";save()};
$("#searchInput").oninput=renderProjects;
$("#newProjectBtn").onclick=()=>$("#projectDialog").showModal();
$("#projectForm").onsubmit=e=>{
 e.preventDefault();
 const name=$("#projectName").value.trim(),description=$("#projectDescription").value.trim(),status=$("#projectStatus").value;
 if(!name)return;
 state.projects.push({id:Date.now(),name,description,status});
 state.activities.unshift("تم إنشاء مشروع: "+name);state.activities=state.activities.slice(0,20);save();
 $("#projectForm").reset();$("#projectDialog").close();showSection("projects");
};
$("#saveSettings").onclick=()=>{state.platformName=$("#platformName").value.trim()||"MRTLS";state.description=$("#platformDescription").value.trim();state.activities.unshift("تم تحديث الإعدادات");state.activities=state.activities.slice(0,20);save();$("#saveMessage").textContent="تم حفظ الإعدادات بنجاح."};
render();