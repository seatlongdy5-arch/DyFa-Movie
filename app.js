import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const configured = firebaseConfig.apiKey !== "PASTE_API_KEY";
const $ = id => document.getElementById(id);
const grid = $("movieGrid");
let db, auth, currentUser = null, movies = [], editingId = null;

const sample = [
 {title:"រឿងភាគចិន៖ ស្នេហ៍ក្នុងអតីតកាល",category:"រឿងភាគ",poster:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",video:"https://www.youtube.com/embed/ScMzIvxBSi4",description:"គំរូសម្រាប់បង្ហាញរូបរាង Website"},
 {title:"រឿងខ្លី៖ ជោគវាសនាស្នេហា",category:"រឿងខ្លី",poster:"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600",video:"https://www.youtube.com/embed/ScMzIvxBSi4",description:"គំរូសម្រាប់បង្ហាញរូបរាង Website"},
 {title:"ភាពយន្ត៖ ដំណើរផ្សងព្រេង",category:"ភាពយន្ត",poster:"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600",video:"https://www.youtube.com/embed/ScMzIvxBSi4",description:"គំរូសម្រាប់បង្ហាញរូបរាង Website"}
];

if(configured){const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);onAuthStateChanged(auth,user=>{currentUser=user;});}
else { $("adminMessage").textContent="សូមភ្ជាប់ Firebase មុនពេលប្រើ Admin។ រូបភាពនេះជាគំរូបង្ហាញប៉ុណ្ណោះ។"; }

function safeUrl(url){try{const u=new URL(url);return ["https:","http:"].includes(u.protocol)?u.href:"";}catch{return "";}}
function render(list){
 grid.innerHTML="";
 if(!list.length){grid.innerHTML='<p class="muted">មិនទាន់មានរឿងទេ។ សូមចូល Admin ដើម្បីបន្ថែមរឿង។</p>';return;}
 list.forEach(m=>{
  const card=document.createElement("article");card.className="movie-card";
  const img=document.createElement("img");img.className="poster";img.src=safeUrl(m.poster)||"";
  img.alt=m.title||"Poster";img.loading="lazy";
  const info=document.createElement("div");info.className="movie-info";
  const tag=document.createElement("span");tag.className="tag";tag.textContent=m.category||"រឿង";
  const h=document.createElement("h3");h.textContent=m.title||"គ្មានចំណងជើង";
  const p=document.createElement("p");p.textContent=m.description||"";
  info.append(tag,h,p);card.append(img,info);card.addEventListener("click",()=>watch(m));grid.append(card);
 });
}
function watch(m){
 const url=safeUrl(m.video||"");
 $("watchContent").innerHTML="";
 const h=document.createElement("h2");h.textContent=m.title||"មើលរឿង";
 const desc=document.createElement("p");desc.className="muted";desc.textContent=m.description||"";
 $("watchContent").append(h);
 if(url && /youtube\.com\/embed\//.test(url)){
  const frame=document.createElement("iframe");frame.className="video-frame";frame.src=url;frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";frame.allowFullscreen=true;$("watchContent").append(frame);
 } else {
  const p=document.createElement("p");p.textContent="តំណវីដេអូមិនត្រឹមត្រូវ ឬមិនមែនជា YouTube Embed URL។";$("watchContent").append(p);
 }
 $("watchContent").append(desc);$("watchModal").classList.remove("hidden");
}
async function loadMovies(){
 if(!configured){movies=sample;render(movies);return;}
 try{const snap=await getDocs(query(collection(db,"movies"),orderBy("createdAt","desc")));movies=snap.docs.map(d=>({id:d.id,...d.data()}));render(movies);}
 catch(e){grid.innerHTML='<p class="muted">មិនអាចទាញទិន្នន័យបានទេ។ សូមពិនិត្យ Firebase និង Firestore Rules។</p>';console.error(e);}
}
$("searchInput").addEventListener("input",e=>{const q=e.target.value.trim().toLowerCase();render(movies.filter(m=>(m.title||"").toLowerCase().includes(q)||(m.category||"").toLowerCase().includes(q)));});
$("menuBtn").addEventListener("click",()=>$("nav").classList.toggle("open"));
$("openAdmin").addEventListener("click",()=>$("adminModal").classList.remove("hidden"));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).classList.add("hidden")));
["watchModal","adminModal"].forEach(id=>$(id).addEventListener("click",e=>{if(e.target.id===id)$(id).classList.add("hidden");}));

$("loginForm").addEventListener("submit",async e=>{
 e.preventDefault();if(!configured){$("adminMessage").textContent="សូមកំណត់ Firebase Config ជាមុនសិន។";return;}
 try{await signInWithEmailAndPassword(auth,$("adminEmail").value,$("adminPassword").value);$("adminMessage").textContent="ចូលបានជោគជ័យ។";showAdmin();}
 catch(err){$("adminMessage").textContent="ចូលមិនបាន៖ "+err.message;}
});
function showAdmin(){
 $("adminContent").innerHTML=`<h2>ផ្ទាំងគ្រប់គ្រងរឿង</h2><p class="muted">អ្នកបានចូលជា ${currentUser?.email||"Admin"}</p>
 <div class="admin-actions"><button class="primary-btn" id="addMovie">＋ បន្ថែមរឿងថ្មី</button><button class="secondary-btn" id="logout">ចាកចេញ</button></div>
 <div id="editor"></div><div class="admin-list" id="adminList"></div>`;
 $("addMovie").onclick=()=>movieForm();$("logout").onclick=async()=>{await signOut(auth);$("adminContent").innerHTML='<h2>បានចាកចេញពី Admin</h2>';};
 drawAdminList();
}
function movieForm(m={}){
 editingId=m.id||null;
 $("editor").innerHTML=`<form class="form" id="movieForm">
 <label>ចំណងជើងរឿង<input id="fTitle" required value="${esc(m.title||"")}"></label>
 <label>ប្រភេទ<select id="fCategory"><option ${m.category==="រឿងខ្លី"?"selected":""}>រឿងខ្លី</option><option ${m.category==="រឿងភាគ"?"selected":""}>រឿងភាគ</option><option ${m.category==="ភាពយន្ត"?"selected":""}>ភាពយន្ត</option></select></label>
 <label>តំណរូប Poster<input id="fPoster" type="url" required value="${esc(m.poster||"")}" placeholder="https://..."></label>
 <label>តំណ YouTube Embed<input id="fVideo" type="url" required value="${esc(m.video||"")}" placeholder="https://www.youtube.com/embed/VIDEO_ID"></label>
 <label>ការពិពណ៌នា<textarea id="fDescription">${esc(m.description||"")}</textarea></label>
 <button class="primary-btn">រក្សាទុករឿង</button></form>`;
 $("movieForm").onsubmit=saveMovie;
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function saveMovie(e){
 e.preventDefault();if(!currentUser)return;
 const data={title:$("fTitle").value.trim(),category:$("fCategory").value,poster:safeUrl($("fPoster").value),video:safeUrl($("fVideo").value),description:$("fDescription").value.trim(),createdAt:Date.now()};
 if(!data.poster||!data.video){alert("សូមពិនិត្យតំណ URL");return;}
 try{if(editingId)await updateDoc(doc(db,"movies",editingId),data);else await addDoc(collection(db,"movies"),data);$("editor").innerHTML="";await loadMovies();drawAdminList();}
 catch(err){alert("រក្សាទុកមិនបាន៖ "+err.message);}
}
async function drawAdminList(){
 const el=$("adminList");if(!el)return;el.innerHTML="";
 movies.forEach(m=>{const row=document.createElement("div");row.className="admin-item";const name=document.createElement("span");name.textContent=m.title;const actions=document.createElement("span");const edit=document.createElement("button");edit.className="secondary-btn";edit.textContent="កែ";edit.onclick=()=>movieForm(m);const del=document.createElement("button");del.className="danger-btn";del.textContent="លុប";del.onclick=async()=>{if(confirm("តើអ្នកចង់លុបរឿងនេះមែនទេ?")){await deleteDoc(doc(db,"movies",m.id));await loadMovies();drawAdminList();}};actions.append(edit,del);row.append(name,actions);el.append(row);});
}
if(configured) onAuthStateChanged(auth,user=>{currentUser=user;if(user && $("adminModal")&&!$("adminModal").classList.contains("hidden"))showAdmin();});
loadMovies();