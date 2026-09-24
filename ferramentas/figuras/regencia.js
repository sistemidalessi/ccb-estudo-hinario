/* Figuras do curso de regência (caderno do instrutor).

   Desenhadas aqui, sem copiar ilustração de curso nem de livro: são esquemas
   do que o texto de dados/regencia.js explica. Mesma paleta e mesma escala
   das outras figuras (ver gera.js). */
const { COR, el, rotulo, rotuloDir, svg } = require("./desenho.js");

const TAM = { titulo: 20, forte: 16, corpo: 15, leg: 13.5, mini: 12.5 };
const PELE = "#F3E7DA", PELE_T = "#B8906B", MADEIRA = "#C9A27A";

const seta = (id, cor) => el("marker", { id, viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 6, markerHeight: 6,
  orient: "auto-start-reverse" }, el("path", { d: "M0 0 L10 5 L0 10 z", fill: cor }));
const defs = () => el("defs", {}, seta("rt", COR.tinta) + seta("rd", COR.destaque) + seta("ra", COR.alerta) + seta("rb", COR.borda));
const traco = (d, o = {}) => el("path", { d, fill: "none", stroke: o.cor || COR.tinta, "stroke-width": o.w || 2.6,
  "stroke-linecap": "round", "stroke-dasharray": o.tracejado ? "6 5" : "", "marker-end": o.seta === false ? "" : `url(#${o.m || "rt"})` });
const ictus = (x, y, n, cor = COR.destaque, r = 15) =>
  el("circle", { cx: x, cy: y, r, fill: cor }) + rotulo(x, y + 6, String(n), { centro: 1, tam: 17, forte: 1, cor: "#fff" });
/* linha de batida: todos os tempos caem na mesma altura */
const linhaBatida = (x1, x2, y) => el("line", { x1, y1: y, x2, y2: y, stroke: COR.borda, "stroke-width": 1.4, "stroke-dasharray": "3 5" });

/* Desenho de regência: ictus numerados, o rebote depois de cada um e o
   caminho até o seguinte. `caminho` é a lista de segmentos (um por tempo),
   e cada segmento termina no ictus daquele tempo. */
function desenho({ larg = 360, alt = 316, titulo, rodape, base, pontos, segmentos, extra = "" }) {
  let c = defs() + linhaBatida(24, larg - 24, base + 2);
  segmentos.forEach(d => { c += traco(d); });
  pontos.forEach(([x, y, n, onde, lado]) => {
    c += ictus(x, y, n);
    if (onde) {
      const dx = lado ? 22 : 0;
      c += rotulo(x + dx, y + (lado ? 6 : 38), onde, { centro: lado ? 0 : 1, tam: TAM.leg, cor: COR.tinta });
    }
  });
  c += extra;
  if (titulo) c += rotulo(larg / 2, 28, titulo, { centro: 1, tam: 21, forte: 1, cor: COR.tinta });
  if (rodape) c += rotulo(larg / 2, alt - 30, rodape, { centro: 1, tam: TAM.mini });
  c += rotulo(larg / 2, alt - 12, "o pontilhado é a linha de batida; só o último tempo é dado no alto", { centro: 1, tam: TAM.mini, cor: COR.claro });
  return svg(larg, alt + 4, c);
}

const FIGS = {};

/* Compasso em 2: cai no 1, rebate para a direita e sobe até o 2; do alto,
   cai de novo no 1. */
FIGS["reg-2"] = () => desenho({
  titulo: "Em 2", rodape: "1 abaixo · 2 acima — o 2 sobe e já prepara o 1",
  base: 220, pontos: [[170, 220, 1, "abaixo"], [212, 74, 2, "acima", "d"]],
  segmentos: [
    "M170 220 C 190 176, 234 150, 220 96",            // rebote e subida até o 2
    "M204 80 C 180 110, 168 160, 170 202",              // do 2, a queda no 1
  ],
});

/* Compasso em 3: 1 abaixo, 2 fora (direita), 3 acima. */
FIGS["reg-3"] = () => desenho({
  titulo: "Em 3", rodape: "1 abaixo · 2 fora · 3 acima",
  base: 220, pontos: [[150, 220, 1, "abaixo"], [276, 214, 2, "fora"], [206, 80, 3, "acima", "d"]],
  segmentos: [
    "M150 220 C 170 176, 236 168, 266 200",
    "M276 214 C 300 176, 262 118, 222 92",
    "M196 86 C 160 120, 148 170, 150 202",
  ],
});

/* Compasso em 4: 1 abaixo, 2 dentro (esquerda), 3 fora, 4 acima. */
FIGS["reg-4"] = () => desenho({
  titulo: "Em 4", rodape: "1 abaixo · 2 dentro · 3 fora · 4 acima",
  base: 220, pontos: [[182, 220, 1, "abaixo"], [72, 212, 2, "dentro"], [292, 212, 3, "fora"], [214, 78, 4, "acima", "d"]],
  segmentos: [
    "M182 220 C 188 196, 124 190, 88 206",
    "M72 212 C 58 150, 236 142, 280 198",
    "M292 212 C 316 170, 270 112, 230 90",
    "M204 84 C 176 116, 178 170, 182 202",
  ],
});

/* Em 6, na regência de conjunto: 1 abaixo, 2 e 3 para dentro, 4 e 5 para
   fora, 6 acima. NÃO é o movimento de solfejo em 6 do MSA (ver o texto). */
FIGS["reg-6"] = () => desenho({
  larg: 400, titulo: "Em 6 — regência de conjunto", rodape: "1 abaixo · 2 e 3 dentro · 4 e 5 fora · 6 acima",
  base: 220, pontos: [[196, 220, 1, "abaixo"], [128, 218, 2], [62, 216, 3], [262, 220, 4], [336, 218, 5], [236, 78, 6, "acima", "d"]],
  segmentos: [
    "M196 220 C 196 190, 150 186, 140 206",
    "M128 218 C 116 190, 84 184, 72 204",
    "M62 216 C 48 160, 200 150, 252 206",
    "M262 220 C 276 192, 314 188, 326 206",
    "M336 218 C 360 170, 290 110, 252 90",
    "M226 84 C 196 116, 192 170, 196 202",
  ],
  extra: rotulo(95, 250, "dentro", { centro: 1, tam: TAM.leg, cor: COR.tinta }) +
         rotulo(299, 250, "fora", { centro: 1, tam: TAM.leg, cor: COR.tinta }),
});

/* A preparação: dois quadros, entrada no 1º tempo e entrada em anacruse no
   4º. Em cinza, o desenho em 4 de fundo; em azul, o que o regente faz. */
function fundo4(ox) {
  return [
    `M${ox + 142} 214 C ${ox + 148} 176, ${ox + 94} 166, ${ox + 66} 196`,
    `M${ox + 56} 206 C ${ox + 48} 170, ${ox + 180} 158, ${ox + 222} 196`,
    `M${ox + 232} 206 C ${ox + 250} 170, ${ox + 214} 116, ${ox + 182} 94`,
    `M${ox + 170} 86 C ${ox + 146} 116, ${ox + 140} 170, ${ox + 142} 200`,
  ].map(d => traco(d, { cor: "#DCE2E0", w: 2, seta: false })).join("");
}
FIGS["reg-preparacao"] = () => {
  const larg = 640, alt = 330;
  let c = defs();
  // quadro A: tético
  let ox = 10;
  c += linhaBatida(ox + 20, ox + 290, 216);
  c += el("circle", { cx: ox + 226, cy: 150, r: 7, fill: COR.apagado });
  c += rotulo(ox + 238, 146, "atenção", { tam: TAM.mini, cor: COR.apagado });
  c += traco(`M${ox + 226} 150 C ${ox + 222} 120, ${ox + 200} 92, ${ox + 180} 86`, { cor: COR.destaque, m: "rd", w: 3.4 });
  c += traco(`M${ox + 172} 88 C ${ox + 146} 116, ${ox + 140} 170, ${ox + 142} 196`, { cor: COR.alerta, m: "ra", w: 3.4 });
  c += ictus(ox + 142, 214, 1, COR.alerta);
  c += rotulo(ox + 196, 66, "preparação (gesto do 4)", { centro: 1, tam: TAM.leg, cor: COR.destaque, forte: 1 });
  c += rotulo(ox + 142, 252, "entrada no 1º tempo", { centro: 1, tam: TAM.leg, cor: COR.alerta, forte: 1 });
  c += rotulo(ox + 150, 34, "Hino tético", { centro: 1, tam: 19, forte: 1, cor: COR.tinta });
  // quadro B: anacruse no 4º tempo
  ox = 330;
  c += linhaBatida(ox + 20, ox + 290, 216);
  c += el("circle", { cx: ox + 142, cy: 160, r: 7, fill: COR.apagado });
  c += rotulo(ox + 130, 156, "atenção", { tam: TAM.mini, cor: COR.apagado });
  c = c.replace(/(<text[^>]*?)text-anchor="start"([^>]*>atenção<\/text>)$/, '$1text-anchor="end"$2');
  c += traco(`M${ox + 148} 162 C ${ox + 170} 176, ${ox + 200} 186, ${ox + 222} 200`, { cor: COR.destaque, m: "rd", w: 3.4 });
  c += traco(`M${ox + 232} 206 C ${ox + 250} 170, ${ox + 214} 116, ${ox + 186} 96`, { cor: COR.alerta, m: "ra", w: 3.4 });
  c += ictus(ox + 232, 212, 3, COR.destaque) + ictus(ox + 176, 88, 4, COR.alerta);
  c += rotulo(ox + 232, 252, "preparação (gesto do 3)", { centro: 1, tam: TAM.leg, cor: COR.destaque, forte: 1 });
  c += rotulo(ox + 196, 64, "entrada no 4º tempo", { centro: 1, tam: TAM.leg, cor: COR.alerta, forte: 1 });
  c += rotulo(ox + 150, 34, "Hino anacrúsico (entra no 4)", { centro: 1, tam: 19, forte: 1, cor: COR.tinta });
  c += rotulo(larg / 2, 290, "a preparação é um tempo só, no andamento do hino, com a respiração;", { centro: 1, tam: TAM.leg });
  c += rotulo(larg / 2, 310, "os tempos vazios antes da anacruse não são marcados", { centro: 1, tam: TAM.leg });
  return svg(larg, alt, c);
};

/* O corte: o final (laço pequeno e parada) e o que prepara a estrofe seguinte. */
FIGS["reg-corte"] = () => {
  const larg = 640, alt = 300;
  let c = defs();
  // A: corte final
  c += rotulo(160, 34, "Corte final", { centro: 1, tam: 19, forte: 1, cor: COR.tinta });
  c += traco("M120 70 C 118 120, 120 170, 122 196", { cor: "#C9D1CE", w: 2.4, seta: false });
  c += rotulo(128, 92, "último tempo", { tam: TAM.mini, cor: COR.apagado });
  c += traco("M122 196 C 124 222, 176 226, 190 204 C 202 186, 172 172, 160 190 C 154 200, 176 214, 206 214", { cor: COR.alerta, m: "ra", w: 3.4 });
  c += el("rect", { x: 212, y: 206, width: 16, height: 16, fill: COR.alerta });
  c += rotulo(160, 256, "um laço pequeno, fecha — e a mão para", { centro: 1, tam: TAM.leg, cor: COR.alerta, forte: 1 });
  c += rotulo(160, 276, "segure o silêncio um instante antes de baixar", { centro: 1, tam: TAM.leg });
  // B: corte que já é preparação
  c += rotulo(480, 34, "Corte entre estrofes", { centro: 1, tam: 19, forte: 1, cor: COR.tinta });
  c += rotulo(480, 54, "(hino que entra no tempo de fora)", { centro: 1, tam: TAM.mini });
  c += traco("M440 70 C 438 120, 440 170, 442 196", { cor: "#C9D1CE", w: 2.4, seta: false });
  c += traco("M442 196 C 444 222, 496 226, 508 204 C 518 184, 490 172, 482 186", { cor: COR.alerta, w: 3.4, seta: false });
  c += traco("M482 186 C 520 150, 548 110, 548 78", { cor: COR.destaque, m: "rd", w: 3.4 });
  c += rotulo(556, 110, "preparação", { tam: TAM.leg, cor: COR.destaque, forte: 1 });
  c += rotulo(556, 128, "da estrofe", { tam: TAM.leg, cor: COR.destaque, forte: 1 });
  c += rotulo(480, 256, "o fim do corte vira a preparação:", { centro: 1, tam: TAM.leg, cor: COR.alerta, forte: 1 });
  c += rotulo(480, 276, "o grupo respira junto e entra sem nova contagem", { centro: 1, tam: TAM.leg });
  c += el("line", { x1: 320, y1: 50, x2: 320, y2: 250, stroke: COR.borda, "stroke-width": 1 });
  return svg(larg, alt, c);
};

/* A fermata na mão do regente: quatro momentos, em linha. */
FIGS["reg-fermata"] = () => {
  const larg = 640, alt = 206;
  let c = defs();
  const caixas = [
    ["1", "chega", "o gesto cai no tempo", "da fermata", COR.destaque],
    ["2", "sustenta", "a mão para no tempo,", "viva — não cai", COR.alerta],
    ["3", "corta", "o corte é pequeno", "e já é preparação", COR.alerta],
    ["4", "retoma", "o tempo seguinte vem", "no andamento de antes", COR.destaque],
  ];
  const w = 138, g = 18, x0 = (larg - (4 * w + 3 * g)) / 2;
  caixas.forEach(([n, t, l1, l2, cor], i) => {
    const x = x0 + i * (w + g);
    c += el("rect", { x, y: 44, width: w, height: 112, rx: 8, fill: "#fff", stroke: cor, "stroke-width": 2 });
    c += el("circle", { cx: x + 22, cy: 68, r: 13, fill: cor }) + rotulo(x + 22, 74, n, { centro: 1, tam: 15, forte: 1, cor: "#fff" });
    c += rotulo(x + 42, 74, t, { tam: TAM.forte, forte: 1, cor });
    c += rotulo(x + w / 2, 110, l1, { centro: 1, tam: TAM.mini, cor: COR.tinta });
    c += rotulo(x + w / 2, 128, l2, { centro: 1, tam: TAM.mini, cor: COR.tinta });
    if (i < 3) c += traco(`M${x + w + 3} 100 L${x + w + g - 3} 100`, { cor: COR.borda, m: "rb", w: 2 });
  });
  c += rotulo(larg / 2, 26, "A fermata na regência", { centro: 1, tam: 19, forte: 1, cor: COR.tinta });
  c += rotulo(larg / 2, 184, "se a música segue ligada depois da fermata, não há corte: o passo 3 é só a preparação", { centro: 1, tam: TAM.leg });
  return svg(larg, alt, c);
};

/* Dinâmica: o mesmo desenho em 4, pequeno e amplo. */
FIGS["reg-dinamica"] = () => {
  const larg = 640, alt = 290;
  const d4 = (ox, oy, k) => {
    const p = ([x, y]) => [ox + x * k, oy + y * k];
    const pts = [[0, 0], [-60, 0], [60, 0], [18, -80]];
    const seg = (a, c1, c2, b) => `M${p(a)} C ${p(c1)}, ${p(c2)}, ${p(b)}`;
    return [
      traco(seg([0, 0], [6, -26], [-38, -32], [-54, -12]), { w: 2.4 }),
      traco(seg([-60, 0], [-66, -32], [34, -40], [54, -8]), { w: 2.4 }),
      traco(seg([60, 0], [76, -30], [44, -64], [26, -76]), { w: 2.4 }),
      traco(seg([12, -80], [-4, -60], [-2, -26], [0, -10]), { w: 2.4 }),
    ].join("") + pts.map(([x, y], i) => ictus(...p([x, y]), i + 1, COR.destaque, 12)).join("");
  };
  let c = defs();
  c += d4(170, 200, 0.95) + d4(470, 214, 1.9);
  c += rotulo(170, 34, "piano", { centro: 1, tam: 20, forte: 1, cor: COR.tinta });
  c += rotulo(470, 34, "forte", { centro: 1, tam: 20, forte: 1, cor: COR.tinta });
  c += rotulo(170, 242, "gesto pequeno, leve, perto do corpo", { centro: 1, tam: TAM.leg });
  c += rotulo(470, 242, "gesto amplo, com peso no braço", { centro: 1, tam: TAM.leg });
  c += rotulo(larg / 2, 276, "o andamento não muda com o tamanho: o gesto grande anda mais depressa no ar", { centro: 1, tam: TAM.leg, cor: COR.destaque, forte: 1 });
  return svg(larg, alt, c);
};

/* Postura, de perfil: a estante, o plano de regência e o braço. */
FIGS["reg-postura"] = () => {
  const larg = 640, alt = 380;
  let c = defs();
  // faixa do plano de regência (da cintura aos ombros)
  c += el("rect", { x: 200, y: 118, width: 150, height: 110, fill: "#E6EEF2", rx: 6 });
  c += rotulo(275, 140, "plano de regência", { centro: 1, tam: TAM.mini, cor: COR.destaque, forte: 1 });
  // corpo
  const tinta = { fill: "none", stroke: COR.tinta, "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" };
  c += el("circle", { cx: 150, cy: 66, r: 26, fill: PELE, stroke: COR.tinta, "stroke-width": 2.4 });
  c += el("path", { d: "M150 94 L150 104", ...tinta });
  c += el("path", { d: "M128 106 C 124 160, 126 210, 132 236 L168 236 C 172 210, 172 160, 170 106 Z", fill: "#DDE8ED", stroke: COR.tinta, "stroke-width": 2.4 });
  c += el("path", { d: "M136 236 L128 346 M162 236 L172 346", ...tinta });
  c += el("path", { d: "M114 348 L134 348 M166 348 L192 348", ...tinta, "stroke-width": 4 });
  // braço: ombro → cotovelo (afastado, à frente) → mão → batuta
  c += el("path", { d: "M152 114 L176 176 L236 164", ...tinta, "stroke-width": 5 });
  c += el("circle", { cx: 240, cy: 163, r: 8, fill: PELE, stroke: COR.tinta, "stroke-width": 2 });
  c += el("path", { d: "M246 162 L318 150", stroke: MADEIRA, "stroke-width": 3, "stroke-linecap": "round" });
  // estante com o hinário
  c += el("path", { d: "M430 160 L452 118 M441 138 L441 346 M418 346 L464 346", ...tinta, "stroke-width": 2.6 });
  c += el("rect", { x: 422, y: 112, width: 40, height: 8, fill: COR.tinta, transform: "rotate(-62 442 116)" });
  // olhar
  c += el("path", { d: "M176 60 L420 118", stroke: COR.claro, "stroke-width": 1.6, "stroke-dasharray": "4 5" });
  // rótulos
  const r = (x, y, t, o = {}) => rotulo(x, y, t, { tam: TAM.leg, cor: COR.tinta, ...o });
  c += r(478, 112, "estante na altura do peito:");
  c += r(478, 130, "os olhos saem do hinário");
  c += r(478, 148, "sem baixar a cabeça");
  c += r(200, 250, "cotovelo afastado do corpo,", { tam: TAM.mini });
  c += r(200, 266, "antebraço quase paralelo ao chão", { tam: TAM.mini });
  c += r(200, 300, "pés na largura dos ombros,", { tam: TAM.mini });
  c += r(200, 316, "peso nos dois, joelhos soltos", { tam: TAM.mini });
  c += r(210, 212, "da cintura aos ombros", { tam: TAM.mini, cor: COR.destaque });
  c += rotulo(larg / 2, 28, "Postura de quem rege", { centro: 1, tam: 19, forte: 1, cor: COR.tinta });
  return svg(larg, alt, c);
};

/* Como se segura a batuta: esquema de lado, mão de palma para baixo. */
FIGS["reg-batuta"] = () => {
  const larg = 640, alt = 330;
  let c = defs();
  // antebraço
  c += el("path", { d: "M20 150 C 80 146, 150 142, 206 140 L206 196 C 150 196, 80 198, 20 200 Z", fill: PELE, stroke: PELE_T, "stroke-width": 2 });
  // batuta: vara e cabo (o cabo fica dentro da mão, visto em transparência)
  c += el("path", { d: "M300 168 L612 150", stroke: "#8A6A48", "stroke-width": 3.2, "stroke-linecap": "round" });
  // dedos médio, anelar e mínimo, soltos por baixo do cabo
  [[282, 194], [262, 198], [243, 198]].forEach(([x, y]) =>
    { c += el("ellipse", { cx: x, cy: y, rx: 11, ry: 17, fill: PELE, stroke: PELE_T, "stroke-width": 2 }); });
  // dorso da mão
  c += el("path", { d: "M204 140 C 236 126, 280 124, 306 138 C 318 146, 318 164, 304 170 C 280 176, 236 184, 204 196 Z",
    fill: PELE, stroke: PELE_T, "stroke-width": 2 });
  c += el("path", { d: "M222 166 C 240 164, 262 162, 294 166", stroke: MADEIRA, "stroke-width": 12, "stroke-linecap": "round", opacity: 0.55 });
  // indicador: dobrado, com a lateral encostando na batuta
  c += el("path", { d: "M300 146 C 330 146, 344 160, 336 176 C 330 186, 314 184, 306 176", fill: PELE, stroke: PELE_T, "stroke-width": 2 });
  // polegar: por cima da batuta, do lado de cá
  c += el("path", { d: "M236 150 C 262 146, 300 150, 318 160 C 324 164, 318 172, 308 170 C 290 168, 262 168, 240 170 Z", fill: "#EBD9C6", stroke: PELE_T, "stroke-width": 2 });
  // pontos de contato
  c += el("circle", { cx: 314, cy: 165, r: 6, fill: COR.alerta }) + el("circle", { cx: 332, cy: 172, r: 6, fill: COR.alerta });
  // linha do antebraço prolongada
  c += el("path", { d: "M20 172 L612 150", stroke: COR.claro, "stroke-width": 1.4, "stroke-dasharray": "5 6" });
  const r = (x, y, t, o = {}) => rotulo(x, y, t, { tam: TAM.leg, cor: COR.tinta, ...o });
  const guia = (x1, y1, x2, y2) => el("line", { x1, y1, x2, y2, stroke: COR.apagado, "stroke-width": 1 });
  c += guia(314, 159, 300, 92) + r(210, 70, "polpa do polegar", { forte: 1, cor: COR.alerta }) + r(210, 88, "de lado, contra a batuta", { tam: TAM.mini });
  c += guia(334, 178, 400, 236) + r(404, 236, "lateral do indicador, entre a", { forte: 1, cor: COR.alerta }) + r(404, 254, "ponta e a articulação do meio", { tam: TAM.mini, forte: 1, cor: COR.alerta });
  c += guia(262, 214, 250, 262) + r(130, 276, "médio, anelar e mínimo envolvem", { tam: TAM.mini }) + r(130, 292, "o cabo, soltos; o cabo encosta de leve na palma", { tam: TAM.mini });
  c += r(430, 136, "a batuta continua a linha do antebraço", { tam: TAM.mini, cor: COR.destaque, forte: 1 });
  c += r(40, 132, "palma para baixo, punho solto", { tam: TAM.mini });
  c += rotulo(larg / 2, 30, "Como segurar a batuta", { centro: 1, tam: 19, forte: 1, cor: COR.tinta });
  c += rotulo(larg / 2, 318, "firme o bastante para não cair, solta o bastante para sentir a ponta", { centro: 1, tam: TAM.leg, cor: COR.destaque });
  return svg(larg, alt, c);
};

module.exports = { FIGS };
