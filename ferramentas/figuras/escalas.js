/* As escalas em partitura, para a página "As escalas do hinário" e para a
   caixa de escala antes dos hinos da análise.

   O formato é o que o Anderson mostrou (apostila de escalas e arpejos da
   CCB): em 4/4, a escala sobe e desce uma oitava em semínimas, termina em
   mínima, e depois da barra dupla vem o arpejo (1ª, 3ª, 5ª, 8ª e volta).
   Na clave de Sol, duas oitavas sobrepostas: a de baixo, haste para baixo,
   e a de cima, haste para cima — para o violino, a de baixo é o soprano no
   natural (reuniões de jovens) e a de cima o soprano 8ª acima (cultos).
   Desenho nosso, com a fonte Bravura; nada é copiado da apostila.

   Alturas em "passos diatônicos absolutos": Dó = 0 … Si = 6, mais 7 por
   oitava (Dó4 = 28). Na pauta, p = 0 é a 1ª linha. */
const { COR, D, el, posY, pauta, nota, claveSol, claveFa, claveDo, sustenido, bemol,
        barraCompasso, formula, rotulo, svg } = require("./desenho.js");

const LETRA = { "Dó": 0, "Ré": 1, "Mi": 2, "Fá": 3, "Sol": 4, "Lá": 5, "Si": 6 };
const CLAVES = {
  sol: { base: 30, desenha: claveSol, desloc: 0 },   // 1ª linha = Mi4
  fa:  { base: 18, desenha: claveFa,  desloc: -2 },  // 1ª linha = Sol2
  do:  { base: 24, desenha: claveDo,  desloc: -1 },  // 1ª linha = Fá3
};
// posições da armadura na clave de Sol (as outras claves deslocam)
const POS_SUST = [8, 5, 9, 6, 3, 7, 4], POS_BEM = [4, 7, 3, 6, 2, 5, 1];
const NSUST = { "Dó": 0, "Sol": 1, "Ré": 2, "Lá": 3, "Mi": 4, "Si": 5, "Fá♯": 6, "Dó♯": 7 };
const NBEM = { "Fá": 1, "Si♭": 2, "Mi♭": 3, "Lá♭": 4, "Ré♭": 5 };

const letraDo = tom => tom.replace(/[♯♭]/, "");
/* Tônica da oitava de baixo: na clave de Sol, de Sol3 a Fá4 (o violino
   começa no Sol3); na de Fá, de Sol2 a Fá3; na de Dó, de Dó3 a Si3. */
function tonica(tom, clave) {
  const l = LETRA[letraDo(tom)];
  if (clave === "do") return l + 21;
  const base = clave === "sol" ? 28 : 21;              // Dó4 ou Dó3
  return l >= 4 ? l + base - 7 : l + base;
}

const slug = tom => tom.replace("♯", "s").replace("♭", "b").normalize("NFD").replace(/[̀-ͯ]/g, "");
const idDaEscala = (clave, tom) => `esc-${clave}-${slug(tom)}`;

function escala(tom, clave) {
  const C = CLAVES[clave], duas = clave === "sol";
  const t0 = tonica(tom, clave);
  const graus = [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0, 0, 2, 4, 7, 4, 2, 0];
  // compasso a compasso: 4 + 4 + 4 + (3, a última mínima) | 4 + (3, a última mínima)
  const compassos = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14], [15, 16, 17, 18], [19, 20, 21]];
  const topo = duas ? 132 : 70, x0 = 20;
  const nSinais = NSUST[tom] || NBEM[tom] || 0;
  const xArm = x0 + 70, xForm = xArm + nSinais * 19 + 22, xIni = xForm + 40;
  const passo = 36, gap = 18;
  let x = xIni, c = "";
  const notas = [];
  compassos.forEach((comp, k) => {
    comp.forEach((gi, j) => {
      const ultima = j === comp.length - 1 && comp.length === 3;
      notas.push({ x, grau: graus[gi], dur: ultima ? 2 : 4 });
      x += ultima ? passo * 2 : passo;
    });
    x += gap - passo / 2;
    notas.push({ barra: x, tipo: k === 3 ? "dupla" : k === 5 ? "final" : "simples" });
    x += gap + passo / 2 - 4;
  });
  const larg = x + 10;
  c += pauta(x0, topo, larg - x0 - 10) + C.desenha(x0 + 34, topo);
  // armadura
  const pos = NSUST[tom] ? POS_SUST : POS_BEM, sinal = NSUST[tom] ? sustenido : bemol;
  for (let i = 0; i < nSinais; i++) c += sinal(xArm + i * 19, posY(topo, pos[i] + C.desloc));
  c += formula(xForm, topo, "4", "4");
  if (notas.some(n => !n.barra && Number.isNaN(n.grau + 0))) throw new Error("escala sem altura: " + tom);
  notas.forEach(n => {
    if (n.barra) { c += barraCompasso(n.tipo === "simples" ? n.barra : n.barra - 8, topo, n.tipo); return; }
    const p = t0 + n.grau - C.base;
    if (duas) {
      c += nota(n.x, topo, p, n.dur, { haste: "baixo" }) + nota(n.x, topo, p + 7, n.dur, { haste: "cima" });
    } else c += nota(n.x, topo, p, n.dur);
  });
  c += rotulo(x0, duas ? 22 : 18, `${tom.toUpperCase()} MAIOR`, { tam: 17, forte: 1, cor: COR.tinta });
  return svg(larg, duas ? topo + 4 * D + 118 : topo + 4 * D + 78, c);
}

/* Tons da clave de Sol: os dez do hinário e os que os hinários em Si♭ e
   Mi♭ acrescentam (Si, Fá♯, Dó♯). Claves de Fá e de Dó: os dez. */
const TONS10 = ["Dó", "Fá", "Si♭", "Mi♭", "Lá♭", "Ré♭", "Sol", "Ré", "Lá", "Mi"];
const TONS_SOL = [...TONS10, "Si", "Fá♯", "Dó♯"];

const FIGS = {};
TONS_SOL.forEach(t => { FIGS[idDaEscala("sol", t)] = () => escala(t, "sol"); });
TONS10.forEach(t => { FIGS[idDaEscala("fa", t)] = () => escala(t, "fa"); FIGS[idDaEscala("do", t)] = () => escala(t, "do"); });

module.exports = { FIGS, idDaEscala, TONS10, TONS_SOL };
