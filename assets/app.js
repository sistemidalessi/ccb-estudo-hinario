/* ---------------- estado e utilidades ---------------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const faseDe = f => FASES.find(x => x.f === f);
const periodoDe = q => faseDe(q.f).p;
const canalDe = q => TIPOS[q.k].canal;
Q.forEach((q,i) => q.id = "q" + i);

function store(k, v){
  try{ if(v === undefined) return JSON.parse(localStorage.getItem("eh_"+k) || "null");
       localStorage.setItem("eh_"+k, JSON.stringify(v)); }catch(e){ return null; }
}
function shuffle(a){ const r = a.slice(); for(let i=r.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; }
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function lvl(n){ return '<span class="lvl" title="nível '+n+' de 3">'+[1,2,3].map(i => '<i class="'+(i<=n?"on":"")+'"></i>').join("")+"</span>"; }
function chip(k){ const t = TIPOS[k]; return '<span class="chip '+t.canal+'">'+t.rot+"</span>"; }

/* ---------------- tema ---------------- */
$("#themeBtn").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  const dark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", dark ? "light" : "dark");
  store("tema", dark ? "light" : "dark");
});
(function(){ const t = store("tema"); if(t) document.documentElement.setAttribute("data-theme", t); })();

/* ---------------- abas ---------------- */
$$("nav.tabs button").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
function setTab(name){
  $$("nav.tabs button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === name)));
  ["trilha","ficha","estudo","banco"].forEach(n => { $("#p-"+n).hidden = n !== name; });
  window.scrollTo({top:0, behavior:"instant"});
}

/* ---------------- trilha ---------------- */
(function trilha(){
  const nomes = {1:"1º período",2:"2º período",3:"3º período",4:"4º período"};
  const html = [1,2,3,4].map(p => {
    const fs = FASES.filter(f => f.p === p);
    const total = Q.filter(q => periodoDe(q) === p).length;
    const linhas = fs.map(f => f.tops.map(([cod,nome]) => {
      const n = Q.filter(q => q.f === f.f && q.t === cod).length;
      return '<li data-fase="'+f.f+'"><span class="code">'+cod+'</span><span class="name">'+esc(nome)+"</span><span class=\"n\">"+n+"</span></li>";
    }).join("")).join("");
    return '<div class="period"><div class="period-h"><h3>'+nomes[p]+'</h3>'+
      '<span class="fases">fases '+fs[0].f+"–"+fs[fs.length-1].f+"</span>"+
      '<span class="cnt">'+total+" questões</span></div><ul class=\"topics\">"+linhas+"</ul></div>";
  }).join("");
  $("#periods").innerHTML = html;
  $("#periods").addEventListener("click", e => {
    const li = e.target.closest("li[data-fase]"); if(!li) return;
    $("#b-fase").value = li.dataset.fase; setTab("banco"); renderBank();
  });
})();

/* ---------------- gerador de ficha ---------------- */
const tiposAtivos = new Set(Object.keys(TIPOS));
(function tiposUI(){
  $("#f-tipos").innerHTML = Object.entries(TIPOS).map(([k,t]) =>
    '<button type="button" class="tg" data-k="'+k+'" aria-pressed="true" title="'+esc(t.desc)+'">'+t.rot+"</button>").join("");
  $("#f-tipos").addEventListener("click", e => {
    const b = e.target.closest(".tg"); if(!b) return;
    const on = b.getAttribute("aria-pressed") === "true";
    if(on && tiposAtivos.size === 1) return;
    b.setAttribute("aria-pressed", String(!on));
    on ? tiposAtivos.delete(b.dataset.k) : tiposAtivos.add(b.dataset.k);
  });
})();

let fichaAtual = [];
let mostrarGab = false;

function selecionar(periodo, qtd){
  let pool = Q.filter(q => tiposAtivos.has(q.k));
  if(periodo !== "ac") pool = pool.filter(q => periodoDe(q) === Number(periodo));
  else pool = pool.filter(q => periodoDe(q) <= 4);
  // distribui entre as fases do período para não concentrar tudo num tópico
  const porFase = {};
  shuffle(pool).forEach(q => { (porFase[q.f] = porFase[q.f] || []).push(q); });
  const fases = shuffle(Object.keys(porFase));
  const out = [];
  let i = 0;
  while(out.length < qtd && fases.some(f => porFase[f].length)){
    const f = fases[i % fases.length];
    if(porFase[f].length) out.push(porFase[f].pop());
    i++;
  }
  return out.sort((a,b) => a.f - b.f || a.t.localeCompare(b.t));
}

function renderFicha(){
  const hino = $("#f-hino").value.trim();
  const instr = $("#f-instr").value.trim();
  if(!fichaAtual.length){ $("#ficha-out").innerHTML = ""; return; }
  const itens = fichaAtual.map(q => {
    const precisaLinha = ["ver","entender","erro","comparar","criar"].includes(q.k);
    return '<li><div class="qhead"><span class="qnum"></span>'+chip(q.k)+
      '<span class="fasecode">fase '+q.f+" · "+q.t+"</span>"+lvl(q.n)+"</div>"+
      '<div class="qtext">'+esc(q.q)+(precisaLinha?'<span class="answerline"></span>':"")+"</div>"+
      (mostrarGab ? '<div class="gab"><b>Gabarito</b>'+esc(q.g)+"</div>" : "");
  }).join("");
  $("#ficha-out").innerHTML =
    '<div class="ficha"><div class="ficha-h"><div class="org">Congregação Cristã no Brasil · Grupo de Estudos Musicais</div>'+
    "<h2>Estudo do Hinário</h2></div>"+
    '<div class="ficha-meta">'+
      '<div class="line">Nome:<span class="fill"></span>Data: ____/____/20____</div>'+
      '<div class="line">Comum congregação:<span class="fill"></span></div>'+
      '<div class="line">Instrumento: '+(instr?esc(instr):"")+'<span class="fill"></span>Tocando:<span class="fill"></span></div>'+
    "</div>"+
    '<div class="ficha-inst">Com o hinário em mãos, analise o hino '+(hino? "nº "+esc(hino) : "indicado pelo instrutor")+" e responda:</div>"+
    '<ol class="qs">'+itens+"</ol>"+
    '<div class="ficha-foot"><span>Hinário em Dó, capa preta</span><span>'+fichaAtual.length+" questões · fases "+
      [...new Set(fichaAtual.map(q=>q.f))].join(", ")+"</span></div></div>";
}

$("#f-gerar").addEventListener("click", () => {
  fichaAtual = selecionar($("#f-periodo").value, Number($("#f-qtd").value));
  renderFicha();
});
$("#f-gab").addEventListener("click", () => {
  mostrarGab = !mostrarGab;
  $("#f-gab").setAttribute("aria-pressed", String(mostrarGab));
  $("#f-gab").textContent = mostrarGab ? "Ocultar gabarito" : "Mostrar gabarito";
  renderFicha();
});
$("#f-copy").addEventListener("click", async () => {
  if(!fichaAtual.length){ toast("Gere uma ficha primeiro."); return; }
  const hino = $("#f-hino").value.trim();
  const letras = "abcdefghijklmnopqrstuvwxyz";
  const txt = ["CONGREGAÇÃO CRISTÃ NO BRASIL — GRUPO DE ESTUDOS MUSICAIS","ESTUDO DO HINÁRIO","",
    "Nome: ______________________________  Data: ____/____/20____",
    "Comum congregação: _______________  Instrumento: __________  Tocando: __________","",
    "Com o hinário em mãos, analise o hino "+(hino?("nº "+hino):"indicado")+" e responda:",""]
    .concat(fichaAtual.map((q,i) => letras[i]+") ["+TIPOS[q.k].rot+" · fase "+q.f+"] "+q.q + (mostrarGab ? "\n   GABARITO: "+q.g : "") + "\n"))
    .join("\n");
  try{ await navigator.clipboard.writeText(txt); toast("Ficha copiada — cole no Word e imprima."); }
  catch(e){ toast("Não foi possível copiar aqui. Selecione o texto da ficha com o mouse."); }
});
function toast(msg){
  const el = document.createElement("div"); el.className = "toast"; el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2800);
}
fichaAtual = selecionar("1", 10); renderFicha();

/* ---------------- modo estudo ---------------- */
let fila = [], erradas = [], atual = null, revelado = false, acertos = 0, vistas = 0;
$("#e-start").addEventListener("click", () => {
  const p = $("#e-periodo").value, c = $("#e-canal").value;
  let pool = Q.slice();
  if(p !== "ac") pool = pool.filter(q => periodoDe(q) === Number(p));
  if(c !== "todos") pool = pool.filter(q => canalDe(q) === c);
  fila = shuffle(pool); erradas = []; acertos = 0; vistas = 0;
  $("#study").hidden = false; proxima();
});
function proxima(){
  if(!fila.length && erradas.length){ fila = shuffle(erradas); erradas = []; }
  if(!fila.length){ fimRodada(); return; }
  atual = fila.shift(); revelado = false; renderStudy();
}
function renderStudy(){
  const total = vistas + fila.length + erradas.length + 1;
  const pct = Math.round((vistas / Math.max(total,1)) * 100);
  $("#study").innerHTML =
    '<div class="study-top"><div>'+chip(atual.k)+' <span class="fasecode">fase '+atual.f+" · "+atual.t+"</span> "+lvl(atual.n)+"</div>"+
    '<div class="stats"><span>'+acertos+" acertos</span><span>"+(fila.length+erradas.length)+" restantes</span></div></div>"+
    '<div class="progress"><span style="width:'+pct+'%"></span></div>'+
    '<p class="qbig">'+esc(atual.q)+"</p>"+
    (revelado ? '<div class="answer">'+esc(atual.g)+"</div>" : "")+
    '<div class="study-actions">'+
      (revelado
        ? '<button class="btn" id="s-ok" type="button">Acertei</button><button class="btn ghost" id="s-no" type="button">Errei — repetir</button>'
        : '<button class="btn" id="s-ver" type="button">Ver resposta</button><button class="btn ghost" id="s-pula" type="button">Pular</button>')+
    "</div>"+
    '<p class="muted">'+TIPOS[atual.k].desc+"</p>";
  if(revelado){
    $("#s-ok").onclick = () => { acertos++; vistas++; proxima(); };
    $("#s-no").onclick = () => { erradas.push(atual); vistas++; proxima(); };
  } else {
    $("#s-ver").onclick = () => { revelado = true; renderStudy(); };
    $("#s-pula").onclick = () => { fila.push(atual); proxima(); };
  }
}
function fimRodada(){
  $("#study").innerHTML = '<p class="eyebrow">Rodada concluída</p><p class="qbig">'+acertos+
    " de "+vistas+" na primeira tentativa.</p><p class=\"muted\">O que você errou voltou e foi refeito até sair certo.</p>"+
    '<div class="study-actions"><button class="btn" onclick="document.getElementById(\'e-start\').click()" type="button">Nova rodada</button></div>';
}

/* ---------------- banco ---------------- */
(function bancoUI(){
  $("#b-fase").innerHTML = '<option value="">Todas</option>' +
    FASES.map(f => '<option value="'+f.f+'">Fase '+f.f+" — "+esc(f.nome)+"</option>").join("");
  $("#b-tipo").innerHTML = '<option value="">Todos</option>' +
    Object.entries(TIPOS).map(([k,t]) => '<option value="'+k+'">'+t.rot+"</option>").join("");
  ["#b-fase","#b-tipo"].forEach(s => $(s).addEventListener("change", renderBank));
  $("#b-busca").addEventListener("input", renderBank);
})();
function renderBank(){
  const f = $("#b-fase").value, k = $("#b-tipo").value, s = $("#b-busca").value.trim().toLowerCase();
  const lista = Q.filter(q =>
    (!f || q.f === Number(f)) && (!k || q.k === k) &&
    (!s || (q.q + " " + q.g).toLowerCase().includes(s)));
  $("#b-count").textContent = lista.length + (lista.length === 1 ? " questão" : " questões");
  $("#bank").innerHTML = lista.length ? lista.map(q =>
    '<div class="bq"><div class="qhead">'+chip(q.k)+'<span class="fasecode">fase '+q.f+" · "+q.t+"</span>"+lvl(q.n)+"</div>"+
    '<div class="qtext">'+esc(q.q)+'</div><div class="gab"><b>Gabarito</b>'+esc(q.g)+"</div></div>").join("")
    : '<div class="empty">Nenhuma questão com esses filtros.</div>';
}
renderBank();
