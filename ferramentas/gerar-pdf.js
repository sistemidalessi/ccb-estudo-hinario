/* Gera as apostilas em PDF, a partir dos mesmos dados do gerador .docx.
 *
 * Uso:  node ferramentas/gerar-pdf.js        (os quatro períodos e a apostila geral)
 *       node ferramentas/gerar-pdf.js 2      (só o 2º)
 *       node ferramentas/gerar-pdf.js geral  (só a apostila geral)
 *
 * A apostila geral junta os quatro períodos num volume, com a análise de
 * hinos ao fim de cada fase (que também sai nas apostilas por período) e, no
 * fim, o repertório por etapa e o Programa Mínimo de todos os instrumentos.
 *
 * Por que PDF, além do Word: o .docx depende da fonte instalada e do programa
 * que o abrir — numa máquina sem Cambria a paginação muda e as figuras andam
 * de lugar. O PDF chega igual em qualquer impressora. O Word continua sendo
 * gerado, para quando for preciso editar.
 *
 * Por que não converter o .docx: o LibreOffice deste ambiente não carrega o
 * arquivo. Gerar direto do HTML é melhor de qualquer jeito — dá controle real
 * de quebra de página e numeração.
 */
const fs = require("fs");
const path = require("path");
const { carregar } = require("./carregar.js");
const { hinosDaAula, listasOficiais, fcTexto, metTexto } = require("./hinos-da-aula.js");

const RAIZ = path.join(__dirname, "..");
const { TIPOS, AULAS, Q, HINOS, PLANOS, FASES } = carregar(RAIZ);
const { todasAsAnalises, ultimaAulaDaFase } = require("./analise.js");
const { repertorio } = require("./repertorio.js");
const { dicasDoHino, REGENCIA } = require("./regencia.js");
const { PROGRAMA_MINIMO } = require(path.join(RAIZ, "dados", "programa-minimo.js"));
const ANALISES = todasAsAnalises(HINOS);
const FIM_DA_FASE = ultimaAulaDaFase(AULAS);
const faseQueFecha = (p, a) => Number(Object.keys(FIM_DA_FASE).find(f => FIM_DA_FASE[f].p === p && FIM_DA_FASE[f].a === a)) || null;
const { LICOES } = require(path.join(RAIZ, "dados", "licoes.js"));

const FASES_DO_PERIODO = { 1: [1, 2, 3], 2: [4, 5], 3: [6, 7, 8, 9], 4: [10, 11, 12, 13, 14, 15, 16] };
const ORDINAL = { 1: "1º", 2: "2º", 3: "3º", 4: "4º" };

const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* As figuras entram embutidas em base64: assim o PDF é um arquivo só, sem
   depender de caminho relativo na hora da impressão. */
const cacheFig = new Map();
function figura(nome) {
  if (!nome) return "";
  if (!cacheFig.has(nome)) {
    const arq = path.join(RAIZ, "assets", "figuras", nome + ".png");
    if (!fs.existsSync(arq)) { cacheFig.set(nome, ""); }
    else cacheFig.set(nome, `<figure class="${/^(mov|reg-\d)/.test(nome) ? "estreita" : ""}">` +
      `<img src="data:image/png;base64,${fs.readFileSync(arq).toString("base64")}" alt="${esc(nome)}"></figure>`);
  }
  return cacheFig.get(nome);
}

const lista = (titulo, itens) => (itens && itens.length)
  ? `<div class="rot-bloco"><h4>${esc(titulo)}</h4><ul>${itens.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>` : "";

/* Recursos em texto corrido: são listas longas e quase iguais em toda aula
   (quadro, projetor, computador...), e em lista empurravam o fim do roteiro
   para uma segunda página quase vazia. */
const corrido = (titulo, basicos, extras) => {
  const b = basicos || [], e = extras || [];
  if (!b.length && !e.length) return "";
  return `<div class="rot-bloco"><h4>${esc(titulo)}</h4>` +
    (b.length ? `<p class="corrido"><b>Básicos:</b> ${b.map(esc).join(" · ")}</p>` : "") +
    (e.length ? `<p class="corrido"><b>Complementares:</b> ${e.map(esc).join(" · ")}</p>` : "") + `</div>`;
};

function roteiro(periodo, num) {
  const pl = ((PLANOS || {})[periodo] || []).find(x => x.a === num);
  if (!pl) return "";
  return `<section class="pagina roteiro">
    <p class="olho">Roteiro do instrutor · Plano de Aula oficial</p>
    <h2>Aula ${num} · ${esc(pl.topico)}</h2>
    <p class="tema">${esc(pl.tema || "")}</p>
    <p class="meta">Fase ${pl.fase}${pl.duracao ? " · " + esc(pl.duracao) : ""}</p>
    ${lista("Habilidades a desenvolver", pl.habilidades)}${lista("Objetivos", pl.objetivos)}
    <div class="rot-duas">${lista("Conteúdo", pl.conteudo)}${corrido("Recursos", pl.recursos, pl.extras)}</div>
    ${lista("Metodologia", pl.metodologia)}${lista("Avaliação", pl.avaliacao)}</section>`;
}

function exercicios(doAula, instrutor) {
  if (!doAula.length) return "";
  return `<h3>Exercícios</h3><ol class="qs">` + doAula.map(q => {
    const t = TIPOS[q.k];
    const precisaLinha = t.canal === "papel";
    return `<li><p class="qhead"><span class="chip ${t.canal}">${esc(t.rot)}</span>` +
      `<span class="fase">fase ${q.f} · ${esc(q.t)}</span><span class="nivel">nível ${q.n}</span></p>` +
      `<p class="qtext">${esc(q.q)}</p>` +
      (instrutor ? `<p class="gab"><b>Gabarito</b>${esc(q.g)}</p>`
        : precisaLinha ? `<div class="linhas">${"<span></span>".repeat(q.k === "criar" || q.n === 3 ? 3 : 2)}</div>`
        : `<p class="visto">Apresentado ao instrutor em ____/____/______ &nbsp;&nbsp; Visto: ______________</p>`) +
      `</li>`;
  }).join("") + `</ol>`;
}

function hinoDaAula(periodo, num, instrutor) {
  const fecho = hinosDaAula(periodo, num, HINOS);
  if (!fecho) return "";
  let dentro = "";
  if (fecho.fonte === "oficial") {
    dentro += listasOficiais(periodo, num, HINOS).map(l => {
      const rot = l.tipo === "exercicio" ? `Executado na aula — ${l.rot.toLowerCase()}`
                : l.tipo === "citado" ? `Citado na aula — ${l.rot.toLowerCase()}` : l.rot;
      return `<h4>${esc(rot)}</h4><p class="hinos">` +
        l.hinos.map(h => `<span class="hn">${h.n}${l.comp1.has(h.n) ? "*" : ""}</span>`).join("") + `</p>` +
        (l.comp1.size ? `<p class="nota">* ler a partir do 1º compasso completo</p>` : "") +
        (l.nota ? `<p class="nota">${esc(l.nota)}</p>` : "") +
        (l.conf === "conferir" && instrutor
          ? `<p class="nota alerta">Conferir esta lista no caderno impresso do GEM antes de usar em avaliação: ela vem em duas colunas e a leitura automática do PDF pode tê-las embaralhado.</p>` : "");
    }).join("") + `<p class="nota">Lista do próprio GEM para esta aula.</p>`;
  } else {
    dentro += `<p class="nota">Hinos ${fecho.hinos.map(h => h.n).join(", ")} — ${esc(fecho.porque)}.</p>` +
      (fecho.conferir && instrutor ? `<p class="nota alerta">${esc(fecho.conferir)}</p>` : "");
  }
  fecho.hinos.forEach(h => {
    if (!h.tom) return;
    // o ♩ da fonte do texto sai minúsculo e solto do número: vai na DejaVu
    const fichaHtml = fichaDoHino(h);
    dentro += `<div class="ficha"><p><b>Hino ${h.n}</b> <span class="nota">${fichaHtml}</span></p>`;
    fecho.perguntas(h).forEach(([pergunta, gab]) => {
      dentro += `<p class="hq">${esc(pergunta)}</p>` +
        (instrutor ? `<p class="gab"><b>Gabarito</b>${esc(gab)}</p>` : `<div class="linhas"><span></span></div>`);
    });
    dentro += `</div>`;
  });
  return `<div class="caixa pratica"><h3>O hino da aula</h3>${dentro}</div>`;
}

function aula(periodo, [num, tops, assunto], instrutor) {
  const lic = LICOES[`${periodo}-${num}`];
  const doAula = Q.filter(q => q.a === num && FASES_DO_PERIODO[periodo].includes(q.f));
  let c = `<section class="pagina aula"><header><p class="olho">${periodo}º período · aula ${num}</p>` +
    `<h2>${esc((lic && lic.titulo) || assunto)}</h2>` +
    `<p class="meta">MSA · ${tops ? "tópicos " + esc(tops) : "continuação da aula anterior"}</p></header>`;
  if (lic) {
    c += `<p class="abre">${esc(lic.abre)}</p>`;
    lic.blocos.forEach(b => { c += `<h3>${esc(b.h)}</h3><p>${esc(b.t)}</p>${figura(b.fig)}`; });
    if (lic.atencao) c += `<div class="caixa atencao"><h3>Atenção</h3><p>${esc(lic.atencao)}</p></div>`;
  }
  c += exercicios(doAula, instrutor);
  if (!doAula.length && !lic)
    c += `<div class="caixa"><h3>Conclusão dos exercícios individuais</h3><p>Aula reservada às apresentações pendentes do período.</p></div>`;
  c += hinoDaAula(periodo, num, instrutor);
  if (lic && lic.casa) c += `<div class="caixa casa"><h3>Para casa</h3><p>${esc(lic.casa)}</p></div>`;
  return c + `</section>`;
}

/* ---------- análise de hinos, ao fim de cada fase ---------- */

const CONFERIR_RITMO = "O ritmo inicial foi lido da partitura (largura do primeiro compasso e indicação de regência na margem); conferir no hinário antes de usar em avaliação.";

function fichaDoHino(h) {
  const ficha = [h.tom + " maior", fcTexto(h), h.marc, metTexto(h), h.ind].filter(Boolean).join(" · ");
  // o ♩ e o ♪ da fonte do texto saem minúsculos e soltos do número: vão na DejaVu
  return esc(ficha).replace(/([♩♪]\.?) = /, '<span class="seminima">$1</span>\u202F=\u00A0');
}

/* Partitura do hino, recortada do hinário por recortar-hinos.py. Fica fora
   do Git; se não existir, a análise sai sem ela (e avisa no console). */
const DIR_HINOS = path.join(__dirname, "hinos-img");
function partituras(n) {
  if (!fs.existsSync(DIR_HINOS)) return [];
  return fs.readdirSync(DIR_HINOS).filter(a => a.startsWith(String(n).padStart(3, "0") + "-")).sort()
    .map(a => "data:image/png;base64," + fs.readFileSync(path.join(DIR_HINOS, a)).toString("base64"));
}
let avisouSemPartitura = false;

function analiseHTML(f, instrutor) {
  const bloco = ANALISES[f];
  if (!bloco || !bloco.length) return "";
  const fase = FASES.find(x => x.f === f);
  let c = `<section class="analise"><p class="olho">Fim da fase ${f} · análise de hinos</p>
    <h2>Analise os hinos</h2>
    <p class="abre">Fase ${f} — ${esc(fase ? fase.nome.toLowerCase() : "")}. Olhe o hino e responda. As perguntas cobrem só
      o que foi estudado até aqui: as marcadas <span class="novo">novo</span> são desta fase; as outras revisam as anteriores.</p>`;
  if (instrutor && f === 13) c += `<p class="nota alerta">${esc(CONFERIR_RITMO)}</p>`;
  bloco.forEach(({ h, novas, revisao }, i) => {
    const imgs = partituras(h.n);
    if (!imgs.length && !avisouSemPartitura) {
      console.warn("  (sem as partituras em ferramentas/hinos-img: rode recortar-hinos.py)");
      avisouSemPartitura = true;
    }
    // a ficha (tom, fórmula, metrônomo) entrega as respostas: só no instrutor
    c += `<div class="hino-analise${imgs.length ? " com-partitura" : ""}${i ? " novo-hino" : ""}">
      <p class="hcab"><b>Hino ${h.n}</b>${instrutor ? ` <span class="nota">${fichaDoHino(h)}</span>` : ""}</p>` +
      imgs.map(src => `<img class="partitura" src="${src}">`).join("") + `<ol class="qa">`;
    [...novas.map(q => [q, true]), ...revisao.map(q => [q, false])].forEach(([[pergunta, gab], nova]) => {
      c += `<li><p>${nova ? '<span class="novo">novo</span> ' : ""}${esc(pergunta)}</p>` +
        (instrutor ? `<p class="gab"><b>Gabarito</b>${esc(gab)}</p>` : `<div class="linhas"><span></span></div>`) + `</li>`;
    });
    c += `</ol></div>`;
  });
  return c + `</section>`;
}

/* ---------- curso de regência (só no caderno do instrutor) ---------- */

/* Um módulo ao fim de cada fase, logo depois da análise: a técnica do
   módulo e, para cada hino da análise, as observações para regê-lo na aula
   prática do mês. Texto em dados/regencia.js; observações em regencia.js. */
function blocosDeRegencia(mod) {
  // os desenhos de compasso vão ao lado do texto: embaixo dele, cada um
  // ocupava meia página
  const lado = n => /^(mov|reg-\d)/.test(n || "");
  return mod.blocos.map(b => lado(b.fig)
    ? `<h3>${esc(b.h)}</h3>${figura(b.fig).replace('<figure class="estreita">', '<figure class="lado">')}<p>${esc(b.t)}</p>`
    : `<h3>${esc(b.h)}</h3><p>${esc(b.t)}</p>${figura(b.fig)}`).join("") + `<div style="clear:both"></div>`;
}
function regenciaHTML(f) {
  const mod = REGENCIA[f];
  if (!mod) return "";
  let c = "";
  if (f === 1) {
    const I = REGENCIA.intro;
    c += `<section class="regencia"><p class="olho">Curso de regência · para os instrutores</p>
      <h2>${esc(I.titulo)}</h2><p class="abre">${esc(I.abre)}</p>${blocosDeRegencia(I)}</section>`;
  }
  c += `<section class="regencia"><p class="olho">Curso de regência · módulo ${f} de 16</p>
    <h2>${esc(mod.titulo)}</h2><p class="abre">${esc(mod.abre)}</p>${blocosDeRegencia(mod)}
    <div class="caixa regpratica"><h3>Na aula prática</h3><ul>${mod.pratica.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div>
    <h3 class="reghinos">Para reger os hinos da análise desta fase</h3>`;
  (ANALISES[f] || []).forEach(({ h }) => {
    c += `<div class="reghino"><p class="hcab"><b>Hino ${h.n}</b> <span class="nota">${fichaDoHino(h)}</span></p><dl>` +
      dicasDoHino(h, f).map(([r, t]) => `<dt>${esc(r)}</dt><dd>${esc(t)}</dd>`).join("") + `</dl></div>`;
  });
  return c + `</section>`;
}

/* ---------- repertório e Programa Mínimo (apostila geral) ---------- */

function repertorioHTML(instrutor) {
  const R = repertorio(HINOS);
  let c = `<section class="pagina apendice"><p class="olho">Apêndice</p><h2>Repertório de estudo por etapa</h2>
    <p class="abre">Hinos para estudar em cada etapa do Programa Mínimo, em ordem de dificuldade. Cada um traz
      alguma coisa que os anteriores da mesma etapa ainda não trouxeram — uma fórmula, uma tonalidade, um sinal,
      um jeito de entrar —, para o estudo não ser aleatório. A voz é a do Programa Mínimo; os dados de violino
      vêm ao lado.</p>
    <p class="nota">A dificuldade soma o que pesa na execução: armadura, compasso composto, mudança de fórmula,
      tercina, síncopa e contratempo, ritornelo, entrada, andamento, tamanho e, no violino, a posição exigida
      pelo soprano 8ª acima. A posição é orientação geral; a digitação é a do método do aluno.</p>`;
  R.forEach(et => {
    c += `<h3 class="etapa">${esc(et.nome)}</h3><p class="nota">Violino: ${esc(et.violino)}</p>
      <table class="rep"><thead><tr><th>Hino</th><th>Ficha</th><th>O que traz</th><th>Violino</th>${instrutor ? "" : "<th>Visto</th>"}</tr></thead><tbody>`;
    et.hinos.forEach((x, i) => {
      const traz = i === 0 ? `ponto de partida — ${x.tudo.filter(t => !t.startsWith("violino:")).join(", ")}` : x.traz.join(", ");
      c += `<tr><td class="n">${x.n}</td><td>${fichaDoHino(x.h)}</td><td>${esc(traz)}</td><td>${esc(x.violino)}</td>${instrutor ? "" : "<td></td>"}</tr>`;
    });
    c += `</tbody></table>`;
  });
  return c + `</section>`;
}

/* Módulo "Antes de começar": o Programa Mínimo, por instrumento. Vem antes
   das aulas — o Anderson quis que o aluno saiba desde o início o que precisa
   estudar para tocar em cada etapa. */
const FAMILIAS = { cordas: "Cordas", madeiras: "Madeiras", metais: "Metais" };
const ETAPA_CURTA = ["Para as reuniões de jovens e menores", "Para os cultos oficiais", "Para a oficialização"];

function programaMinimoHTML() {
  const P = PROGRAMA_MINIMO;
  let c = `<section class="pagina antes"><p class="olho">Antes de começar</p><h2>O caminho na orquestra</h2>
    <p class="abre">Todo músico da orquestra passa por três etapas. Em cada uma, o <b>Programa Mínimo</b> da
      Congregação diz o que é preciso ter estudado no método do instrumento, na teoria e no hinário. Escolha o
      seu instrumento e veja, desde já, o caminho.</p>
    <div class="etapas">
      <div><span class="num">1</span><b>Reuniões de jovens e menores</b><p>A primeira etapa. Toca-se dos hinos 431 a 480.</p></div>
      <div><span class="num">2</span><b>Cultos oficiais</b><p>O hinário completo, com a voz principal e a voz alternativa.</p></div>
      <div><span class="num">3</span><b>Oficialização</b><p>O programa completo e revisado; é o fim da formação.</p></div>
    </div>
    <h3>Para todos os instrumentos</h3>
    <table class="pm"><thead><tr><th></th>${ETAPA_CURTA.map(e => `<th>${esc(e)}</th>`).join("")}</tr></thead><tbody>
      ${P.todos.map(t => `<tr><td class="inst">${esc(t.item)}</td>${t.etapas.map(e => `<td>${esc(e)}</td>`).join("")}</tr>`).join("")}
    </tbody></table>`;
  Object.entries(FAMILIAS).forEach(([fam, nome]) => {
    c += `<h3 class="familia">${nome}</h3>`;
    P.instrumentos.filter(i => i.familia === fam).forEach(i => {
      c += `<div class="instrumento"><p class="nome">${esc(i.nome)}</p><div class="tres">` +
        i.etapas.map((e, k) => `<div><p class="quando">${ETAPA_CURTA[k]}</p><p>${e.metodos.map(esc).join('<span class="ou"> ou </span>')}</p>` +
          (e.voz ? `<p class="voz">${esc(e.voz)}</p>` : "") + `</div>`).join("") + `</div></div>`;
    });
  });
  c += `<ul class="obs">${P.observacoes.map(o => `<li>${esc(o)}</li>`).join("")}</ul>
    <p class="nota">Fonte: Congregação Cristã no Brasil — Sugestão de métodos para instrumentos, jan/2018.</p></section>`;
  return c;
}

const ESTILO = `
@page { size: A4; margin: 20mm 20mm 18mm; }
* { box-sizing: border-box; }
body { margin:0; font-family:"Bitstream Charter","Liberation Serif",Georgia,serif;
  font-size:10.5pt; line-height:1.5; color:#16212A; }
h2,h3,h4 { font-family:"Bitstream Charter",Georgia,serif; margin:0; break-after:avoid; }
p { margin:0 0 .5em; }
.pagina { break-before:page; }
.pagina:first-of-type { break-before:auto; }
.capa { display:flex; flex-direction:column; justify-content:center; min-height:238mm; text-align:center; }
.capa .org { font-size:9pt; letter-spacing:.14em; text-transform:uppercase; color:#5C6B75; }
.capa h1 { font-size:34pt; margin:14mm 0 3mm; font-weight:600; }
.capa .sub { font-size:13pt; font-style:italic; color:#5C6B75; margin-bottom:14mm; }
.capa .periodo { font-size:18pt; font-weight:600; color:#1F5673; border-top:1.5pt solid #1F5673;
  padding-top:4mm; display:inline-block; }
.capa .fases { font-size:10pt; color:#5C6B75; margin-top:2mm; }
.capa .campos { margin-top:18mm; text-align:left; font-size:11pt; line-height:2.6; }
.capa .rodape { margin-top:16mm; font-size:9pt; font-style:italic; color:#5C6B75; }
.aula header { border-bottom:.5pt solid #C2CBC8; padding-bottom:2.5mm; margin-bottom:4mm; }
.aula h2 { font-size:17pt; color:#1F5673; margin:1mm 0; }
.olho { font-size:8pt; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#5C6B75; margin:0; }
.meta { font-size:8.5pt; color:#5C6B75; margin:0; }
.abre { font-size:11pt; color:#3F4C55; }
.aula h3 { font-size:12pt; margin:4mm 0 1.5mm; }
figure { margin:3mm 0 4mm; text-align:center; break-inside:avoid; }
figure img { width:162mm; height:auto; }
figure.estreita img { width:97mm; }
.caixa { break-inside:avoid; border-left:2.5pt solid #1F5673; background:#F2F4F3;
  padding:3mm 4mm; margin:4mm 0; }
.caixa h3 { font-size:8.5pt; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
  color:#1F5673; margin:0 0 1.5mm; font-family:"Liberation Sans",sans-serif; }
.caixa p { font-size:10pt; margin:0 0 .4em; }
.atencao, .pratica { border-left-color:#8A5A2B; background:#F7F1E8; }
.atencao h3 { color:#8A5A2B; }
.pratica h3 { font-family:"Bitstream Charter",Georgia,serif; font-size:12pt; text-transform:none;
  letter-spacing:0; color:#16212A; }
.pratica h4 { font-size:9.5pt; margin:2.5mm 0 1mm; }
.qs { list-style:none; margin:2mm 0 0; padding:0; counter-reset:q; }
.qs > li { counter-increment:q; break-inside:avoid; padding:2.5mm 0; border-bottom:.4pt solid #E1E6E4; }
.qs > li:last-child { border-bottom:0; }
.qhead { margin:0 0 1mm; font-family:"Liberation Sans",sans-serif; }
.qhead::before { content:counter(q) ". "; font-weight:700; }
.chip { font-size:7.5pt; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
  padding:.5mm 1.5mm; border-radius:1mm; margin-right:2mm; }
.chip.papel { color:#1F5673; background:#DDE8ED; }
.chip.pratica { color:#8A5A2B; background:#F1E6D8; }
.fase, .nivel { font-size:8pt; color:#5C6B75; margin-right:2mm; font-family:"Liberation Sans",sans-serif; }
.qtext { margin:0 0 1mm; }
.linhas span { display:block; border-bottom:.4pt dotted #AFBAC0; height:6mm; }
.visto { font-size:9pt; color:#5C6B75; margin-top:2mm; }
.gab { font-size:9.5pt; color:#3F4C55; background:#EFF3EC; border-left:2pt solid #4A6B3F;
  padding:1.5mm 3mm; margin:1.5mm 0 0; }
.gab b { display:block; font-size:7.5pt; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
  color:#4A6B3F; font-family:"Liberation Sans",sans-serif; }
.hinos { display:flex; flex-wrap:wrap; gap:1mm; margin:1mm 0; }
.hn { font-family:"Liberation Mono",monospace; font-size:8.5pt; border:.4pt solid #C2CBC8;
  border-radius:1mm; padding:.3mm 1.5mm; background:#fff; }
.nota { font-size:8.5pt; color:#5C6B75; font-style:italic; }
.nota.alerta { color:#8A5A2B; font-style:normal; }
.ficha { margin-top:2.5mm; padding-top:1.5mm; border-top:.4pt dashed #C2CBC8; break-inside:avoid; }
.hq { font-size:10pt; margin:1mm 0 .5mm; }
.seminima { font-family:"DejaVu Sans",sans-serif; font-style:normal; font-size:10pt; line-height:1; }
.roteiro { background:#F7F9F9; }
.roteiro h2 { font-size:15pt; color:#1F5673; }
.roteiro .tema { font-style:italic; font-size:11pt; }
.rot-bloco { margin-top:2.5mm; break-inside:avoid; }
.rot-bloco h4 { font-size:8pt; font-weight:600; letter-spacing:.09em; text-transform:uppercase;
  color:#1F5673; font-family:"Liberation Sans",sans-serif; margin:0 0 1mm; }
.rot-bloco ul { margin:0; padding-left:5mm; }
.rot-bloco li { font-size:9.5pt; color:#3F4C55; margin-bottom:.6mm; }
.rot-duas { display:grid; grid-template-columns:1fr 1fr; gap:6mm; }
.corrido { font-size:9pt; color:#3F4C55; margin:0 0 1.2mm; line-height:1.4; }
.corrido b { color:#1F5673; font-weight:600; }
.instr h2 { font-size:15pt; }
.analise { break-before:page; }
.analise h2 { font-size:17pt; color:#4A6B3F; margin:1mm 0 2mm; }
.analise .abre { font-size:10pt; color:#3F4C55; }
.novo { font-family:"Liberation Sans",sans-serif; font-size:7pt; font-weight:700; letter-spacing:.06em;
  text-transform:uppercase; color:#4A6B3F; background:#E3ECDD; padding:.3mm 1.3mm; border-radius:1mm; }
.hino-analise { border-left:2.5pt solid #4A6B3F; background:#F4F7F2; padding:2.5mm 4mm; margin:4mm 0; break-inside:avoid; }
.hino-analise.com-partitura { break-inside:auto; background:none; border-left:0; padding:0; }
.hino-analise.com-partitura.novo-hino { break-before:page; }
.hino-analise.com-partitura .hcab { font-size:13pt; border-bottom:1.5pt solid #4A6B3F; padding-bottom:1mm; margin-bottom:3mm; }
.hino-analise.com-partitura .qa { background:#F4F7F2; border-left:2.5pt solid #4A6B3F; padding:2mm 4mm 2mm 9mm; margin-top:3mm; }
img.partitura { display:block; width:auto; max-width:100%; max-height:168mm; margin:0 auto 2mm; }
.hino-analise.com-partitura:not(.novo-hino) img.partitura { max-height:148mm; }
.hino-analise .hcab { margin:0 0 1mm; font-size:11pt; }
.qa { margin:0; padding-left:5mm; }
.qa > li { break-inside:avoid; padding:1.2mm 0; }
.qa > li p { margin:0; font-size:10pt; }
.qa .linhas span { height:5.5mm; }
.apendice h2 { font-size:17pt; color:#1F5673; margin:1mm 0 2mm; }
.apendice .abre { font-size:10pt; color:#3F4C55; }
h3.etapa { font-size:12.5pt; color:#1F5673; margin:6mm 0 1mm; }
table.rep, table.pm { width:100%; border-collapse:collapse; font-size:8.5pt; margin:2mm 0 4mm; }
table.rep th, table.pm th { font-family:"Liberation Sans",sans-serif; font-size:7.5pt; font-weight:600;
  letter-spacing:.06em; text-transform:uppercase; color:#1F5673; text-align:left; border-bottom:.8pt solid #1F5673; padding:1.2mm 1.5mm; }
table.rep td, table.pm td { border-bottom:.4pt solid #DDE3E1; padding:1.4mm 1.5mm; vertical-align:top; line-height:1.35; }
table.rep tr, table.pm tr { break-inside:avoid; }
table.rep td.n { font-family:"Liberation Mono",monospace; font-weight:700; font-size:10pt; width:11mm; }
table.rep td:last-child { width:14mm; }
table.pm td.inst { font-weight:600; width:32mm; }
table.pm .ou { font-style:italic; color:#7D8F99; }
table.pm .voz { margin:1mm 0 0; color:#8A5A2B; font-size:8pt; }
table.pm tr.todos td { background:#F2F4F3; }
ul.obs { font-size:9pt; color:#3F4C55; padding-left:5mm; }
.divisor { display:flex; flex-direction:column; justify-content:center; min-height:238mm; text-align:center; }
.divisor h2 { font-size:28pt; color:#1F5673; }
.divisor p { color:#5C6B75; }
.antes h2 { font-size:20pt; color:#1F5673; margin:1mm 0 2mm; }
.antes .abre { font-size:10.5pt; }
.etapas { display:grid; grid-template-columns:repeat(3,1fr); gap:3mm; margin:4mm 0 5mm; }
.etapas > div { background:#F2F4F3; border-top:3pt solid #1F5673; padding:3mm; font-size:9.5pt; }
.etapas b { display:block; font-size:10.5pt; color:#1F5673; margin-bottom:1mm; }
.etapas p { margin:0; color:#3F4C55; }
.etapas .num { float:right; font:700 18pt "Liberation Sans",sans-serif; color:#C2CBC8; line-height:1; }
h3.familia { font-size:13pt; color:#8A5A2B; border-bottom:.8pt solid #8A5A2B; margin:6mm 0 2mm; padding-bottom:1mm; }
.instrumento { break-inside:avoid; margin:0 0 3mm; }
.instrumento .nome { font-weight:700; font-size:11pt; margin:0 0 1mm; }
.instrumento .tres { display:grid; grid-template-columns:repeat(3,1fr); gap:3mm; }
.instrumento .tres > div { font-size:8.8pt; line-height:1.4; border-left:1.5pt solid #C2CBC8; padding-left:2mm; }
.instrumento .quando { font:600 7pt "Liberation Sans",sans-serif; letter-spacing:.05em; text-transform:uppercase; color:#1F5673; margin:0 0 .8mm; }
.instrumento .tres p { margin:0; }
.instrumento .ou { font-style:italic; color:#7D8F99; }
.instrumento .voz { margin-top:1mm !important; color:#8A5A2B; font-weight:600; }
.sumario { list-style:none; padding:0; margin:2mm 0 0; }
.sumario li { display:flex; gap:2mm; margin:.8mm 0; font-size:10pt; }
.sumario li .pont { flex:1; border-bottom:.5pt dotted #AFBAC0; transform:translateY(-1.2mm); }
.sumario li.sub { padding-left:6mm; font-size:9pt; color:#3F4C55; }
.instr p { margin-bottom:.6em; }
.regencia { break-before:page; }
.regencia h2 { font-size:17pt; color:#8A5A2B; margin:1mm 0 2mm; }
.regencia h3 { font-size:12pt; margin:4mm 0 1.5mm; clear:both; }
figure.lado { float:right; width:66mm; margin:0 0 2mm 6mm; }
figure.lado img { width:66mm; }
.regencia .caixa { clear:both; }
.regencia .abre { font-size:10.5pt; color:#3F4C55; }
.regpratica { border-left-color:#8A5A2B; background:#F7F1E8; }
.regpratica h3 { color:#8A5A2B; margin:0 0 1.5mm; font-size:8.5pt; }
.regpratica ul { margin:0; padding-left:5mm; font-size:10pt; }
.regpratica li { margin-bottom:1mm; }
h3.reghinos { color:#8A5A2B; border-bottom:.8pt solid #8A5A2B; padding-bottom:1mm; margin-top:6mm; }
.reghino { break-inside:avoid; margin:3mm 0 4mm; }
.reghino .hcab { font-size:11.5pt; margin:0 0 1mm; }
.reghino dl { display:grid; grid-template-columns:27mm 1fr; gap:1mm 3mm; margin:0; font-size:9.6pt; line-height:1.42; }
.reghino dt { font:600 7.5pt "Liberation Sans",sans-serif; letter-spacing:.06em; text-transform:uppercase; color:#8A5A2B; padding-top:.8mm; }
.reghino dd { margin:0; color:#16212A; }
`;

function corpoDoPeriodo(periodo, instrutor) {
  return AULAS[periodo].map(a => {
    const f = faseQueFecha(periodo, a[0]);
    return (instrutor ? roteiro(periodo, a[0]) : "") + aula(periodo, a, instrutor) +
      (f ? analiseHTML(f, instrutor) + (instrutor ? regenciaHTML(f) : "") : "");
  }).join("");
}

/* Os quatro períodos num volume só, com o repertório e o Programa Mínimo. */
/* O sumário leva número de página: o volume é gerado duas vezes, e na
   segunda os números vêm da primeira (ver o fim do arquivo). */
function documentoGeral(instrutor, paginas = {}) {
  const pg = k => paginas[k] ? String(paginas[k]) : "";
  const linha = (k, texto, sub) => `<li${sub ? ' class="sub"' : ""}><span>${esc(texto)}</span><span class="pont"></span><span>${pg(k)}</span></li>`;
  const capa = `<section class="capa">
    <p class="org">Congregação Cristã no Brasil</p><p class="org">Grupo de Estudos Musicais</p>
    <h1>Estudo do Hinário</h1>
    <p class="sub">${instrutor ? "Caderno do instrutor" : "Caderno do candidato"}</p>
    <p><span class="periodo">Apostila geral</span></p>
    <p class="fases">Os quatro períodos do MSA · 16 fases · 60 aulas</p>
    ${instrutor
      ? `<div class="caixa" style="margin-top:14mm;text-align:left"><h3>Uso do instrutor</h3>
         <p>Roteiro de cada aula, gabaritos de todos os exercícios e das análises de hinos, repertório por etapa
         o Programa Mínimo de todos os instrumentos, para orientar os demais instrutores, e o curso de
         regência da aula prática mensal.</p></div>`
      : `<div class="campos">Nome: ______________________________________________<br>
         Comum congregação: _________________________________<br>
         Instrumento: ____________________ Ano letivo: _________</div>`}
    <p class="rodape">Material complementar. O MSA continua sendo o material didático da aula,
      apresentado por inteiro pelo instrutor.</p></section>`;
  const instrucoes = `<section class="pagina instr"><h2>Como usar este caderno</h2>
    <p>Este volume reúne os quatro períodos do MSA, aula por aula, na ordem do Manual de aplicação. Ele é
      complementar: o conteúdo do MSA continua sendo apresentado por inteiro pelo instrutor.</p>
    <p>Os exercícios usam o <b>Hinário em Dó, capa preta</b>; as perguntas de arcada, o hinário de cordas
      (capa marrom). O hinário não é reproduzido aqui.</p>
    <h3>O que há em cada aula</h3>
    <p>Abertura, explicação com figura, o erro que mais aparece, exercícios, os hinos que fecham a aula e a tarefa de casa.</p>
    <h3>A análise de hinos</h3>
    <p>Ao fim de cada uma das 16 fases, dois ou três hinos para analisar com o hinário em mãos. As perguntas
      cobrem só o que já foi estudado: a cada fase entram as perguntas novas, e as anteriores voltam como revisão.</p>
    ${instrutor ? `<h3>O curso de regência</h3>
    <p>Só neste caderno. Depois da análise de cada fase, um módulo de regência para a aula prática mensal, em
      que os instrutores regem: a técnica do módulo, com figuras, e as observações para reger cada hino da
      análise. A técnica cresce com o conteúdo do MSA, do compasso em 4 ao começo acéfalo.</p>` : ""}
    <h3>Antes das aulas</h3>
    <p>O caminho na orquestra: o que o Programa Mínimo pede de cada instrumento para tocar nas reuniões de
      jovens e menores, nos cultos oficiais e na oficialização.</p>
    <h3>No fim do volume</h3>
    <p>O repertório de estudo por etapa: hinos em ordem de dificuldade, cada um trazendo algo novo.</p>
    </section><section class="pagina instr"><h2>Sumário</h2>
    <ol class="sumario">${linha("pm", "Antes de começar — o caminho na orquestra (Programa Mínimo)")}${[1, 2, 3, 4].map(p =>
      linha(`p${p}`, `${ORDINAL[p]} período — fases ${FASES_DO_PERIODO[p][0]} a ${FASES_DO_PERIODO[p].slice(-1)[0]}`) +
      FASES_DO_PERIODO[p].map(f => linha(`f${f}`, `Análise de hinos — fase ${f}: ${FASES.find(x => x.f === f).nome.toLowerCase()}`, true) +
        (instrutor ? linha(`r${f}`, `Regência — ${f === 1 ? "introdução e " : ""}módulo ${f}: ${REGENCIA[f].titulo.toLowerCase()}`, true) : "")).join("")).join("")}
      ${linha("rep", "Repertório de estudo por etapa")}</ol></section>`;
  const corpo = [1, 2, 3, 4].map(p =>
    `<section class="pagina divisor"><p class="olho">Estudo do Hinário</p><h2>${ORDINAL[p]} período</h2>
      <p>Fases ${FASES_DO_PERIODO[p][0]} a ${FASES_DO_PERIODO[p].slice(-1)[0]} do MSA · 15 aulas</p>
      <p>${FASES_DO_PERIODO[p].map(f => esc(FASES.find(x => x.f === f).nome)).join(" · ")}</p></section>` +
    corpoDoPeriodo(p, instrutor)).join("");
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
    <title>Estudo do Hinário — apostila geral — ${instrutor ? "instrutor" : "candidato"}</title>
    <style>${ESTILO}</style></head><body>${capa}${instrucoes}${programaMinimoHTML()}${corpo}${repertorioHTML(instrutor)}</body></html>`;
}

function documento(periodo, instrutor) {
  const fases = FASES_DO_PERIODO[periodo];
  const usados = [...new Set(Q.filter(q => fases.includes(q.f)).map(q => q.k))];
  const nomes = c => usados.filter(k => TIPOS[k].canal === c).map(k => `${TIPOS[k].rot} (${TIPOS[k].desc})`).join(" · ");

  const capa = `<section class="capa">
    <p class="org">Congregação Cristã no Brasil</p><p class="org">Grupo de Estudos Musicais</p>
    <h1>Estudo do Hinário</h1>
    <p class="sub">${instrutor ? "Caderno do instrutor" : "Caderno do candidato"}</p>
    <p><span class="periodo">${ORDINAL[periodo]} Período</span></p>
    <p class="fases">Fases ${fases[0]} a ${fases[fases.length - 1]} do MSA · 15 aulas</p>
    ${instrutor
      ? `<div class="caixa" style="margin-top:14mm;text-align:left"><h3>Uso do instrutor</h3>
         <p>Traz o roteiro de cada aula, os gabaritos de todos os exercícios e, ao fim de cada fase, o módulo do
         curso de regência para a aula prática mensal. O caderno do candidato é o outro arquivo.</p></div>`
      : `<div class="campos">Nome: ______________________________________________<br>
         Comum congregação: _________________________________<br>
         Instrumento: ____________________ Ano letivo: _________</div>`}
    <p class="rodape">Material complementar. O MSA continua sendo o material didático da aula,
      apresentado por inteiro pelo instrutor.</p></section>`;

  const instrucoes = `<section class="pagina instr"><h2>Como usar este caderno</h2>
    <p>Este caderno acompanha as aulas do MSA, aula por aula, na mesma ordem do Manual de aplicação.
      Ele é complementar: o conteúdo do MSA continua sendo apresentado por inteiro pelo instrutor.</p>
    <p>Os exercícios usam o <b>Hinário em Dó, capa preta</b>. O hinário não é reproduzido aqui.</p>
    <h3>O que há em cada aula</h3>
    <p>Abertura, explicação em blocos com figura, o erro que mais aparece, exercícios numerados,
      os hinos que fecham a aula e a tarefa de casa.</p>
    <h3>Os tipos de exercício</h3>
    <p><b>No papel</b> — ${esc(nomes("papel"))}</p>
    <p><b>Na prática</b> — ${esc(nomes("pratica"))}</p>
    <p>Os exercícios de prática são apresentados ao instrutor, que assina a data ao lado.</p>
    <h3>Os níveis</h3>
    <p>Nível 1 é reconhecer o que está escrito; nível 2 é explicar por que é assim;
      nível 3 é aplicar, comparar ou decidir. Não é nota.</p>${instrutor ? `
    <h3>O curso de regência</h3>
    <p>Só neste caderno. Depois da análise de hinos de cada fase vem um módulo de regência para a aula prática
      mensal, em que os instrutores regem: a técnica do módulo, com figuras, e as observações para reger cada
      hino da análise.</p>` : ""}</section>`;

  const corpo = corpoDoPeriodo(periodo, instrutor);

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
    <title>Estudo do Hinário — ${ORDINAL[periodo]} Período — ${instrutor ? "instrutor" : "candidato"}</title>
    <style>${ESTILO}</style></head><body>${capa}${instrucoes}${periodo === 1 ? programaMinimoHTML() : ""}${corpo}</body></html>`;
}

/* Lê o PDF da primeira passada e acha a página de cada parte do sumário.
   A numeração do rodapé conta da capa, igual ao índice da página no PDF. */
function paginasDoSumario(arquivo) {
  const { execFileSync } = require("child_process");
  const paginas = execFileSync("pdftotext", ["-layout", arquivo, "-"], { encoding: "utf8", maxBuffer: 64 << 20 }).split("\f");
  const achar = (teste, ultima) => {
    const idx = paginas.map((t, i) => (teste(t) ? i : -1)).filter(i => i >= 0);
    return idx.length ? (ultima ? idx[idx.length - 1] : idx[0]) + 1 : null;
  };
  const out = {};
  [1, 2, 3, 4].forEach(p => {
    const f = FASES_DO_PERIODO[p];
    out[`p${p}`] = achar(t => t.includes(`Fases ${f[0]} a ${f[f.length - 1]} do MSA · 15 aulas`) && t.includes("período") && !t.includes("Sumário"));
    f.forEach(ff => {
      out[`f${ff}`] = achar(t => new RegExp(`FIM DA FASE ${ff} · ANÁLISE`, "i").test(t));
      out[`r${ff}`] = achar(t => ff === 1 ? /CURSO DE REGÊNCIA · PARA OS INSTRUTORES/i.test(t)
                                          : new RegExp(`CURSO DE REGÊNCIA · MÓDULO ${ff} DE 16`, "i").test(t));
    });
  });
  out.rep = achar(t => /APÊNDICE/i.test(t) && t.includes("Repertório de estudo por etapa"), true);
  out.pm = achar(t => /ANTES DE COMEÇAR/i.test(t) && t.includes("O caminho na orquestra") && !t.includes("Sumário"));
  return out;
}

(async () => {
  const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
  const dir = path.join(RAIZ, "apostila");
  fs.mkdirSync(dir, { recursive: true });
  const arg = process.argv[2];
  const periodos = arg === "geral" ? ["geral"] : Number(arg) ? [Number(arg)] : [1, 2, 3, 4, "geral"];
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage();
  for (const p of periodos) {
    for (const instrutor of [false, true]) {
      const nome = p === "geral" ? `Apostila-geral-${instrutor ? "instrutor" : "candidato"}.pdf`
                                 : `Apostila-${p}o-periodo-${instrutor ? "instrutor" : "candidato"}.pdf`;
      const opcoes = {
        path: path.join(dir, nome), format: "A4", printBackground: true,
        margin: { top: "20mm", bottom: "18mm", left: "20mm", right: "20mm" },
        displayHeaderFooter: true, headerTemplate: "<span></span>",
        footerTemplate: `<div style="width:100%;font:8pt 'Liberation Sans',sans-serif;color:#7D8F99;
          padding:0 20mm;display:flex;justify-content:space-between">
          <span>Estudo do Hinário · ${p === "geral" ? "apostila geral" : ORDINAL[p] + " período"} · ${instrutor ? "instrutor" : "candidato"}</span>
          <span class="pageNumber"></span></div>`,
      };
      if (p === "geral") {
        await pagina.setContent(documentoGeral(instrutor), { waitUntil: "load" });
        await pagina.pdf(opcoes);
        const paginas = paginasDoSumario(opcoes.path);
        await pagina.setContent(documentoGeral(instrutor, paginas), { waitUntil: "load" });
      } else {
        await pagina.setContent(documento(p, instrutor), { waitUntil: "load" });
      }
      await pagina.pdf(opcoes);
      console.log("gerado:", path.join("apostila", nome));
    }
  }
  await navegador.close();
})();
