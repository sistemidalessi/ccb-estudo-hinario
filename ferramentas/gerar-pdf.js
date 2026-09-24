/* Gera as apostilas em PDF, a partir dos mesmos dados do gerador .docx.
 *
 * Uso:  node ferramentas/gerar-pdf.js        (os quatro períodos)
 *       node ferramentas/gerar-pdf.js 2      (só o 2º)
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
const { hinosDaAula, listasOficiais, fcTexto } = require("./hinos-da-aula.js");

const RAIZ = path.join(__dirname, "..");
const { TIPOS, AULAS, Q, HINOS, PLANOS } = carregar(RAIZ);
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
    else cacheFig.set(nome, `<figure class="${nome.startsWith("mov") ? "estreita" : ""}">` +
      `<img src="data:image/png;base64,${fs.readFileSync(arq).toString("base64")}" alt="${esc(nome)}"></figure>`);
  }
  return cacheFig.get(nome);
}

const lista = (titulo, itens) => (itens && itens.length)
  ? `<div class="rot-bloco"><h4>${esc(titulo)}</h4><ul>${itens.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>` : "";

function roteiro(periodo, num) {
  const pl = ((PLANOS || {})[periodo] || []).find(x => x.a === num);
  if (!pl) return "";
  return `<section class="pagina roteiro">
    <p class="olho">Roteiro do instrutor · Plano de Aula oficial</p>
    <h2>Aula ${num} · ${esc(pl.topico)}</h2>
    <p class="tema">${esc(pl.tema || "")}</p>
    <p class="meta">Fase ${pl.fase}${pl.duracao ? " · " + esc(pl.duracao) : ""}</p>
    ${lista("Habilidades a desenvolver", pl.habilidades)}${lista("Objetivos", pl.objetivos)}
    ${lista("Conteúdo", pl.conteudo)}${lista("Recursos", pl.recursos)}
    ${lista("Recursos complementares", pl.extras)}${lista("Metodologia", pl.metodologia)}
    ${lista("Avaliação", pl.avaliacao)}</section>`;
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
    const ficha = [h.tom + " maior", fcTexto(h), h.marc, h.met ? "♩ = " + h.met : "", h.ind].filter(Boolean).join(" · ");
    dentro += `<div class="ficha"><p><b>Hino ${h.n}</b> <span class="nota">${esc(ficha)}</span></p>`;
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
.roteiro { background:#F7F9F9; }
.roteiro h2 { font-size:15pt; color:#1F5673; }
.roteiro .tema { font-style:italic; font-size:11pt; }
.rot-bloco { margin-top:2.5mm; break-inside:avoid; }
.rot-bloco h4 { font-size:8pt; font-weight:600; letter-spacing:.09em; text-transform:uppercase;
  color:#1F5673; font-family:"Liberation Sans",sans-serif; margin:0 0 1mm; }
.rot-bloco ul { margin:0; padding-left:5mm; }
.rot-bloco li { font-size:9.5pt; color:#3F4C55; margin-bottom:.6mm; }
.instr h2 { font-size:15pt; }
.instr p { margin-bottom:.6em; }
`;

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
         <p>Traz o roteiro de cada aula e os gabaritos de todos os exercícios. O caderno do candidato é o outro arquivo.</p></div>`
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
      nível 3 é aplicar, comparar ou decidir. Não é nota.</p></section>`;

  const corpo = AULAS[periodo].map(a =>
    (instrutor ? roteiro(periodo, a[0]) : "") + aula(periodo, a, instrutor)).join("");

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
    <title>Estudo do Hinário — ${ORDINAL[periodo]} Período — ${instrutor ? "instrutor" : "candidato"}</title>
    <style>${ESTILO}</style></head><body>${capa}${instrucoes}${corpo}</body></html>`;
}

(async () => {
  const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
  const dir = path.join(RAIZ, "apostila");
  fs.mkdirSync(dir, { recursive: true });
  const pedido = Number(process.argv[2]);
  const periodos = pedido ? [pedido] : [1, 2, 3, 4];
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage();
  for (const p of periodos) {
    for (const instrutor of [false, true]) {
      const nome = `Apostila-${p}o-periodo-${instrutor ? "instrutor" : "candidato"}.pdf`;
      await pagina.setContent(documento(p, instrutor), { waitUntil: "load" });
      await pagina.pdf({
        path: path.join(dir, nome), format: "A4", printBackground: true,
        margin: { top: "20mm", bottom: "18mm", left: "20mm", right: "20mm" },
        displayHeaderFooter: true, headerTemplate: "<span></span>",
        footerTemplate: `<div style="width:100%;font:8pt 'Liberation Sans',sans-serif;color:#7D8F99;
          padding:0 20mm;display:flex;justify-content:space-between">
          <span>Estudo do Hinário · ${ORDINAL[p]} período · ${instrutor ? "instrutor" : "candidato"}</span>
          <span class="pageNumber"></span></div>`,
      });
      console.log("gerado:", path.join("apostila", nome));
    }
  }
  await navegador.close();
})();
