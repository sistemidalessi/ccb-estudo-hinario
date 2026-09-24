/* Desenho das figuras da apostila, em SVG. Os símbolos musicais vêm da fonte
   Bravura (fontes/Bravura.otf, licença OFL): a primeira versão desenhava
   claves e pausas à mão, e ficaram feias e, no caso da pausa de mínima,
   erradas. */

const COR = {
  tinta: "#16212A", destaque: "#1F5673", claro: "#7FA9BF",
  fundo: "#E9EDEC", borda: "#C2CBC8", apagado: "#5C6B75", alerta: "#9C4A2F",
};

// Distância entre linhas do pentagrama. Tudo o mais é proporcional a ela, para
// que a figura possa crescer ou encolher sem virar um emaranhado de ajustes.
// O destino é a página impressa: em gerar-apostila.js cada pixel de projeto vale
// 0,72 ponto, então D=17 dá uma pauta de ~17 mm de altura — tamanho de livro.
const D = 17;
const HASTE = 3.2 * D;      // comprimento da haste
const RX = 0.62 * D, RY = 0.44 * D;   // cabeça da nota
const el = (t, a = {}, f = "") =>
  `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(" ")}>${f}</${t}>`;

/* y de uma posição do pentagrama: 0 = 1ª linha (a de baixo), 1 = 1º espaço,
   2 = 2ª linha... Valores negativos descem abaixo da pauta. */
const posY = (topo, p) => topo + 4 * D - p * (D / 2);

function pauta(x, topo, larg, opts = {}) {
  const cor = opts.cor || COR.tinta;
  return el("g", { stroke: cor, "stroke-width": opts.fina ? 1.3 : 0.13 * D + 0.4 },
    [0, 1, 2, 3, 4].map(i =>
      el("line", { x1: x, y1: topo + i * D, x2: x + larg, y2: topo + i * D })).join(""));
}

/* ------------------------------------------------------------------------
   Símbolos musicais: glifos da fonte Bravura (padrão SMuFL, licença OFL, em
   fontes/). Nada de desenho à mão — claves, cabeças, colchetes, pausas,
   acidentes e fermata saem da fonte, com as medidas do bravura_metadata.json:
   a fonte tem 4 espaços de pauta por em, então font-size = 4·D, e cada glifo
   se posiciona pela linha de base, como manda o SMuFL:
     clave de Sol na 2ª linha, de Fá na 4ª, de Dó na 3ª;
     pausa de semibreve PENDURADA na 4ª linha; de mínima APOIADA na 3ª;
     semínima, colcheia e semicolcheia centradas na 3ª linha.
   ------------------------------------------------------------------------ */
const FONTE = `font-family="Bravura" font-size="${4 * D}"`;
const G = {
  claveSol: "", claveFa: "", claveDo: "",
  cabecaPreta: "", cabecaMinima: "", cabecaSemibreve: "",
  pausa1: "", pausa2: "", pausa4: "", pausa8: "", pausa16: "",
  sustenido: "", bemol: "", bequadro: "",
  fermata: "", ponto: "",
  colchete8cima: "", colchete8baixo: "", colchete16cima: "", colchete16baixo: "",
  quialtera3: "",
};
const LARG = { cabeca: 1.18, semibreve: 1.688, sustenido: 0.996, bemol: 0.904, bequadro: 0.672,
               fermata: 2.42, pausa1: 1.128, pausa2: 1.128, pausa4: 1.08, pausa8: 0.988, pausa16: 1.28 };
const ESP = { haste: 0.12 * D, linha: 0.13 * D, suplementar: 0.16 * D, barraLig: 0.5 * D, extSup: 0.4 * D };
const glifo = (x, y, g, cor = COR.tinta) => `<text x="${x}" y="${y}" ${FONTE} fill="${cor}">${g}</text>`;

/* linhas suplementares para uma nota fora da pauta */
function suplementares(x, topo, p, opts = {}) {
  const meia = (opts.larg || LARG.cabeca) * D / 2 + ESP.extSup;
  const out = [];
  for (let k = 10; k <= p; k += 2) out.push(k);
  for (let k = -2; k >= p; k -= 2) out.push(k);
  return out.map(k => el("line", {
    x1: x - meia, y1: posY(topo, k), x2: x + meia, y2: posY(topo, k),
    stroke: opts.cor || COR.tinta, "stroke-width": ESP.suplementar,
  })).join("");
}

/* Uma nota, com x no centro da cabeça. dur: 1=semibreve 2=mínima 4=semínima
   8=colcheia 16=semicolcheia. pontos: pontos de aumento. Haste para cima
   abaixo da 3ª linha, para baixo da 3ª linha para cima — a regra de gravura. */
function nota(x, topo, p, dur = 4, opts = {}) {
  const y = posY(topo, p);
  const cor = opts.cor || COR.tinta;
  const larg = (dur === 1 ? LARG.semibreve : LARG.cabeca) * D;
  const x0 = x - larg / 2;
  const partes = [suplementares(x, topo, p, { cor, larg: larg / D })];
  partes.push(glifo(x0, y, dur === 1 ? G.cabecaSemibreve : dur === 2 ? G.cabecaMinima : G.cabecaPreta, cor));
  if (dur >= 2) {
    const pracima = opts.haste === "cima" || (opts.haste !== "baixo" && p < 4);
    // âncoras do metadata: stemUpSE (1.18, 0.168) e stemDownNW (0, -0.168)
    const hx = pracima ? x0 + 1.18 * D - ESP.haste / 2 : x0 + ESP.haste / 2;
    const hy0 = pracima ? y - 0.168 * D : y + 0.168 * D;
    // haste de 3,5 espaços; chega pelo menos à 3ª linha quando a nota é suplementar
    let comp = 3.5 * D;
    const meio = posY(topo, 4);
    if (pracima && hy0 - comp > meio) comp = hy0 - meio;
    if (!pracima && hy0 + comp < meio) comp = meio - hy0;
    const hy = pracima ? hy0 - comp : hy0 + comp;
    partes.push(el("line", { x1: hx, y1: hy0, x2: hx, y2: hy, stroke: cor, "stroke-width": ESP.haste }));
    if (!opts.semFlag && dur >= 8) {
      const g = dur === 8 ? (pracima ? G.colchete8cima : G.colchete8baixo)
                          : (pracima ? G.colchete16cima : G.colchete16baixo);
      partes.push(glifo(hx - ESP.haste / 2, hy, g, cor));
    }
    partes.push(`<!--haste ${hx.toFixed(2)} ${hy.toFixed(2)}-->`);
  }
  for (let i = 0; i < (opts.pontos || 0); i++) {
    // o ponto vai no espaço: nota em linha sobe meio espaço
    const pp = p % 2 === 0 ? p + 1 : p;
    partes.push(glifo(x0 + larg + 0.3 * D + i * 0.55 * D, posY(topo, pp), G.ponto, cor));
  }
  return el("g", {}, partes.join(""));
}

/* Ponta da haste de uma nota desenhada por nota(), para ligar barras. */
function pontaDaHaste(x, topo, p, cima = true) {
  const x0 = x - LARG.cabeca * D / 2, y = posY(topo, p);
  const hx = cima ? x0 + 1.18 * D - ESP.haste / 2 : x0 + ESP.haste / 2;
  return { x: hx, y: cima ? y - 0.168 * D - 3.5 * D : y + 0.168 * D + 3.5 * D };
}

/* Barra de ligação (colcheias unidas): as notas devem ser desenhadas com
   semFlag e haste na mesma direção. Espessura: 0,5 espaço (beamThickness). */
const barra = (x1, x2, topo, p1, p2, cima = true, qtd = 1) => {
  const a = pontaDaHaste(x1, topo, p1, cima), b = pontaDaHaste(x2, topo, p2, cima);
  const e = ESP.barraLig, s = cima ? 1 : -1;
  let out = "";
  for (let i = 0; i < qtd; i++) {
    const d = i * (e + 0.25 * D) * s;
    out += el("path", { d: `M${a.x - ESP.haste / 2} ${a.y + d} L${b.x + ESP.haste / 2} ${b.y + d} L${b.x + ESP.haste / 2} ${b.y + d + s * e} L${a.x - ESP.haste / 2} ${a.y + d + s * e} z`, fill: COR.tinta });
  }
  return out;
};

/* Pausas, com x no centro. dur igual ao da nota. */
function pausa(x, topo, dur = 4, cor = COR.tinta) {
  const nome = "pausa" + dur;
  const y = dur === 1 ? posY(topo, 6)      // semibreve: pendurada na 4ª linha
          : posY(topo, 4);                 // mínima: apoiada na 3ª; as demais, centradas nela
  return glifo(x - LARG[nome] * D / 2, y, G[nome], cor);
}

/* Claves: x é a borda esquerda. */
const claveSol = (x, topo, cor) => glifo(x - 1.3 * D, posY(topo, 2), G.claveSol, cor);
const claveFa = (x, topo, cor) => glifo(x - 1.3 * D, posY(topo, 6), G.claveFa, cor);
const claveDo = (x, topo, cor) => glifo(x - 1.4 * D, posY(topo, 4), G.claveDo, cor);

/* Acidentes: x no centro, y na altura da nota. */
const sustenido = (x, y, cor = COR.tinta) => glifo(x - LARG.sustenido * D / 2, y, G.sustenido, cor);
const bemol = (x, y, cor = COR.tinta) => glifo(x - LARG.bemol * D / 2, y, G.bemol, cor);
const bequadro = (x, y, cor = COR.tinta) => glifo(x - LARG.bequadro * D / 2, y, G.bequadro, cor);

/* Fermata: x no centro, y na base do arco. */
const fermata = (x, y, cor = COR.tinta) => glifo(x - LARG.fermata * D / 2, y, G.fermata, cor);

const barraCompasso = (x, topo, tipo = "simples") => {
  const y1 = topo, y2 = topo + 4 * D;
  if (tipo === "dupla") return el("g", { stroke: COR.tinta, "stroke-width": 1.8 },
    el("line", { x1: x, y1, x2: x, y2 }) + el("line", { x1: x + 6, y1, x2: x + 6, y2 }));
  if (tipo === "final") return el("g", { stroke: COR.tinta },
    el("line", { x1: x, y1, x2: x, y2, "stroke-width": 1.8 }) +
    el("line", { x1: x + 7, y1, x2: x + 7, y2, "stroke-width": 5 }));
  return el("line", { x1: x, y1, x2: x, y2, stroke: COR.tinta, "stroke-width": 0.16 * D + 0.3 });
};

/* Fórmula de compasso com os algarismos da fonte (E080–E089): o de cima
   centrado na 4ª linha, o de baixo na 2ª. x é o centro. */
const digitos = n => String(n).split("").map(d => String.fromCharCode(0xE080 + Number(d))).join("");
const formula = (x, topo, cima, baixo) =>
  `<text x="${x}" y="${posY(topo, 6)}" ${FONTE} text-anchor="middle" fill="${COR.tinta}">${digitos(cima)}</text>` +
  `<text x="${x}" y="${posY(topo, 2)}" ${FONTE} text-anchor="middle" fill="${COR.tinta}">${digitos(baixo)}</text>`;

/* rótulo alinhado à direita — usado nas legendas da margem esquerda */
const rotuloDir = (x, y, txt, o = {}) => el("text", {
  x, y, "font-size": o.tam || 18, fill: o.cor || COR.apagado, "text-anchor": "end",
  "font-weight": o.forte ? 600 : 400, "font-family": "Calibri,sans-serif",
}, txt);

const rotulo = (x, y, txt, o = {}) => el("text", {
  x, y, "font-size": o.tam || 18, fill: o.cor || COR.apagado,
  "text-anchor": o.centro ? "middle" : "start",
  "font-weight": o.forte ? 600 : 400, "font-family": "Calibri,sans-serif",
}, txt);

const chave = (x1, x2, y, txt) =>
  el("path", { d: `M${x1} ${y} v-7 H${x2} v7`, fill: "none", stroke: COR.destaque, "stroke-width": 1.8 }) +
  el("text", { x: (x1 + x2) / 2, y: y - 12, "font-size": 17, fill: COR.destaque, "text-anchor": "middle", "font-weight": 600, "font-family": "Calibri,sans-serif" }, txt);

const svg = (larg, alt, corpo) =>
  `<svg width="${larg}" height="${alt}" viewBox="0 0 ${larg} ${alt}" xmlns="http://www.w3.org/2000/svg">
   <rect width="${larg}" height="${alt}" fill="#fff"/>${corpo}</svg>`;

module.exports = {
  COR, D, RX0: 0.62 * 17 - 0.9, el, posY, pauta, nota, barra, pausa, suplementares, glifo, G, FONTE, pontaDaHaste,
  claveSol, claveFa, claveDo, sustenido, bemol, bequadro, fermata,
  barraCompasso, formula, rotulo, rotuloDir, chave, svg,
};
