/* Desenho das figuras da apostila, em SVG, sem nenhuma dependência.
   Não há fonte musical instalada no ambiente (e o download é bloqueado), então
   claves, figuras e pausas são caminhos vetoriais escritos aqui. */

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
  return el("g", { stroke: cor, "stroke-width": opts.fina ? 1.3 : 1.7 },
    [0, 1, 2, 3, 4].map(i =>
      el("line", { x1: x, y1: topo + i * D, x2: x + larg, y2: topo + i * D })).join(""));
}

/* linhas suplementares para uma nota fora da pauta */
function suplementares(x, topo, p, opts = {}) {
  const out = [];
  for (let k = 10; k <= p; k += 2) out.push(k);
  for (let k = -2; k >= p; k -= 2) out.push(k);
  return out.map(k => el("line", {
    x1: x - RX * 1.55, y1: posY(topo, k), x2: x + RX * 1.55, y2: posY(topo, k),
    stroke: opts.cor || COR.tinta, "stroke-width": 1.7,
  })).join("");
}

/* Uma nota. dur: 1=semibreve 2=mínima 4=semínima 8=colcheia 16=semicolcheia.
   pontos: quantidade de pontos de aumento. */
function nota(x, topo, p, dur = 4, opts = {}) {
  const y = posY(topo, p);
  const cor = opts.cor || COR.tinta;
  const cheia = dur >= 4;
  const rx = RX, ry = RY;
  const partes = [suplementares(x, topo, p, { cor })];
  partes.push(el("ellipse", {
    cx: x, cy: y, rx, ry, transform: `rotate(-20 ${x} ${y})`,
    fill: cheia ? cor : "none", stroke: cor, "stroke-width": cheia ? 0 : 2.8,
  }));
  if (dur >= 2) {
    const pracima = opts.haste === "cima" || (opts.haste !== "baixo" && p < 4);
    const hx = pracima ? x + rx - 0.9 : x - rx + 0.9;
    const hy = pracima ? y - HASTE : y + HASTE;
    partes.push(el("line", { x1: hx, y1: y, x2: hx, y2: hy, stroke: cor, "stroke-width": 2.5 }));
    for (let i = 0; !opts.semFlag && i < Math.log2(dur / 4); i++) {
      const fy = hy + (pracima ? i * D * 0.78 : -i * D * 0.78);
      const a = D * 0.88, b = D * 1.5, c = D * 0.95;
      partes.push(el("path", {
        d: pracima ? `M${hx} ${fy} q${a} ${a * 0.55} ${a * 0.9} ${b} q${-a * 0.35} ${-b * 0.55} ${-a * 0.9} ${-c} z`
                   : `M${hx} ${fy} q${a} ${-a * 0.55} ${a * 0.9} ${-b} q${-a * 0.35} ${b * 0.55} ${-a * 0.9} ${c} z`,
        fill: cor, stroke: "none",
      }));
    }
  }
  for (let i = 0; i < (opts.pontos || 0); i++)
    partes.push(el("circle", { cx: x + RX * 1.75 + i * D * 0.5, cy: posY(topo, p % 2 ? p : p + 1), r: D * 0.19, fill: cor }));
  return el("g", {}, partes.join(""));
}

/* Barra de ligação entre duas notas (colcheias unidas) */
const barra = (x1, x2, topo, p1, p2, cima = true) => {
  const e = D * 0.46;                                   // espessura da barra de ligação
  const y1 = posY(topo, p1) + (cima ? -HASTE : HASTE), y2 = posY(topo, p2) + (cima ? -HASTE : HASTE);
  return el("path", { d: `M${x1} ${y1} L${x2} ${y2} L${x2} ${y2 + (cima ? e : -e)} L${x1} ${y1 + (cima ? e : -e)} z`, fill: COR.tinta });
};

/* Pausas. dur igual ao da nota. */
function pausa(x, topo, dur = 4, cor = COR.tinta) {
  const l3 = topo + 2 * D;                       // 3ª linha
  if (dur === 1) return el("rect", { x: x - 11, y: l3 - D, width: 22, height: 7, fill: cor });
  if (dur === 2) return el("rect", { x: x - 11, y: l3, width: 22, height: 7, fill: cor });
  if (dur === 4) return el("path", {
    d: `M${x - 5} ${l3 - 20} q10 9 3 18 q-9 9 1 17 q-11 -6 -6 -16 q-8 -8 2 -19 z`, fill: cor });
  // colcheia e semicolcheia: haste inclinada com ganchos
  const g = [];
  const topoH = l3 - 16, baseH = l3 + 16;
  g.push(el("line", { x1: x + 6, y1: topoH, x2: x - 4, y2: baseH, stroke: cor, "stroke-width": 2.1 }));
  const n = dur === 8 ? 1 : 2;
  for (let i = 0; i < n; i++) {
    const gy = topoH + i * 13;
    g.push(el("circle", { cx: x + 1, cy: gy, r: 3.4, fill: cor }));
    g.push(el("path", { d: `M${x + 1} ${gy} q9 -2 11 -6`, fill: "none", stroke: cor, "stroke-width": 2.1 }));
  }
  return el("g", {}, g.join(""));
}

/* Claves, desenhadas à mão. Recebem o topo da pauta. */
function claveSol(x, topo) {
  const s = D / 18;                          // a clave ocupa cerca de 7 espaços
  const g2 = posY(topo, 2);                  // 2ª linha (Sol): centro da espiral
  // Traçado contínuo, do gancho de baixo até o centro da espiral.
  const d = `M-14,64 C-23,66 -26,56 -19,50 C-12,45 -3,49 -1,57
             C1,44 1,20 0,-6
             C-1,-30 -3,-44 2,-56
             C4,-61 9,-60 11,-55 C16,-43 13,-29 4,-18
             C-4,-8 -15,2 -19,12 C-24,24 -17,34 -6,34
             C5,34 13,26 12,15 C11,6 4,0 -3,1`;
  return el("g", { transform: `translate(${x} ${g2}) scale(${s})` },
    el("path", { d, fill: "none", stroke: COR.tinta, "stroke-width": 5.4,
                 "stroke-linecap": "round", "stroke-linejoin": "round" }));
}

function claveFa(x, topo) {
  const s = D / 17, y4 = posY(topo, 6);       // 4ª linha (Fá)
  const d = `M-18,-16 C-10,-24 3,-22 8,-13 C14,-2 8,14 -4,24 C-10,29 -17,33 -24,36
             C-14,27 -5,17 -1,6 C2,-2 1,-13 -6,-15 C-11,-16 -15,-12 -14,-7`;
  return el("g", { transform: `translate(${x} ${y4})` },
    el("g", { transform: `scale(${s})` },
      el("path", { d, fill: "none", stroke: COR.tinta, "stroke-width": 5.4,
                   "stroke-linecap": "round", "stroke-linejoin": "round" })) +
    el("circle", { cx: 16 * s, cy: -D / 2, r: 2.7, fill: COR.tinta }) +
    el("circle", { cx: 16 * s, cy: D / 2, r: 2.7, fill: COR.tinta }));
}

function claveDo(x, topo) {
  const s = D / 14, y3 = posY(topo, 4);       // 3ª linha (Dó central)
  // Meia asa, espelhada em cima e em baixo da 3ª linha.
  const asa = `M-14,-2 C-14,-14 -9,-24 -1,-27 C6,-30 13,-25 13,-17
               C13,-10 7,-6 1,-8 C5,-9 7,-13 5,-16 C2,-20 -3,-18 -5,-13
               C-7,-9 -8,-5 -8,-2`;
  const meia = el("path", { d: asa, fill: "none", stroke: COR.tinta, "stroke-width": 5,
                            "stroke-linecap": "round", "stroke-linejoin": "round" });
  return el("g", { transform: `translate(${x} ${y3}) scale(${s})` },
    el("rect", { x: -30, y: -28, width: 5, height: 56, fill: COR.tinta }) +
    el("rect", { x: -22, y: -28, width: 2.4, height: 56, fill: COR.tinta }) +
    meia + el("g", { transform: "scale(1 -1)" }, meia));
}

/* Acidentes */
function sustenido(x, y, cor = COR.tinta) {
  return el("g", { stroke: cor, fill: cor }, [
    el("line", { x1: x - 4, y1: y - 11, x2: x - 4, y2: y + 12, "stroke-width": 1.8 }),
    el("line", { x1: x + 4, y1: y - 13, x2: x + 4, y2: y + 10, "stroke-width": 1.8 }),
    el("line", { x1: x - 9, y1: y - 2, x2: x + 9, y2: y - 5, "stroke-width": 3 }),
    el("line", { x1: x - 9, y1: y + 6, x2: x + 9, y2: y + 3, "stroke-width": 3 }),
  ].join(""));
}
function bemol(x, y, cor = COR.tinta) {
  return el("g", { stroke: cor, fill: "none", "stroke-width": 2 },
    el("line", { x1: x - 4, y1: y - 18, x2: x - 4, y2: y + 6 }) +
    el("path", { d: `M${x - 4} ${y + 6} q11 -9 8 -14 q-3 -5 -8 2` }));
}
function bequadro(x, y, cor = COR.tinta) {
  return el("g", { stroke: cor, "stroke-width": 1.9 }, [
    el("line", { x1: x - 5, y1: y - 13, x2: x - 5, y2: y + 8 }),
    el("line", { x1: x + 5, y1: y - 8, x2: x + 5, y2: y + 13 }),
    el("line", { x1: x - 5, y1: y - 5, x2: x + 5, y2: y - 8, "stroke-width": 3 }),
    el("line", { x1: x - 5, y1: y + 5, x2: x + 5, y2: y + 2, "stroke-width": 3 }),
  ].join(""));
}

const fermata = (x, y, cor = COR.tinta) =>
  el("g", { stroke: cor, fill: "none", "stroke-width": 2.2 },
    el("path", { d: `M${x - 16} ${y} q16 -20 32 0` }) +
    el("circle", { cx: x, cy: y - 5, r: 2.6, fill: cor }));

const barraCompasso = (x, topo, tipo = "simples") => {
  const y1 = topo, y2 = topo + 4 * D;
  if (tipo === "dupla") return el("g", { stroke: COR.tinta, "stroke-width": 1.8 },
    el("line", { x1: x, y1, x2: x, y2 }) + el("line", { x1: x + 6, y1, x2: x + 6, y2 }));
  if (tipo === "final") return el("g", { stroke: COR.tinta },
    el("line", { x1: x, y1, x2: x, y2, "stroke-width": 1.8 }) +
    el("line", { x1: x + 7, y1, x2: x + 7, y2, "stroke-width": 5 }));
  return el("line", { x1: x, y1, x2: x, y2, stroke: COR.tinta, "stroke-width": 1.8 });
};

const formula = (x, topo, cima, baixo) =>
  el("g", { fill: COR.tinta, "font-family": "Calibri,sans-serif", "font-weight": "700", "font-size": 27, "text-anchor": "middle" },
    el("text", { x, y: posY(topo, 6) + 9 }, cima) + el("text", { x, y: posY(topo, 2) + 9 }, baixo));

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
  COR, D, RX0: 0.62 * 17 - 0.9, el, posY, pauta, nota, barra, pausa, suplementares,
  claveSol, claveFa, claveDo, sustenido, bemol, bequadro, fermata,
  barraCompasso, formula, rotulo, rotuloDir, chave, svg,
};
