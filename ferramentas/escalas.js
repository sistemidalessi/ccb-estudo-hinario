/* A escala antes do hino.

   Pedido do Anderson (24/09/2026): na reunião dos instrutores falou-se muito
   em fazer escalas, "só que fazer escala por fazer não é legal". A ideia é
   sugerir, antes de cada hino da análise, a escala que prepara aquele hino,
   para todos os instrumentos, e com dificuldade crescente. Só escalas
   maiores (decisão dele). O arpejo da tonalidade vem junto, como na apostila
   de escalas da CCB que ele mandou ("Escalas e arpejos — tonalidades maiores
   do Hinário 5"): uma oitava subindo e descendo, em semínimas, e o arpejo.

   O que vem daquela apostila, em palavras próprias: o formato do exercício e
   a tabela de transposição (que é teoria geral: um instrumento em Si♭ soa um
   tom abaixo do que lê; em Mi♭, uma sexta maior abaixo; em Fá, uma quinta
   justa abaixo). Nada da partitura dela é reproduzido.

   O que é nosso: amarrar a escala ao hino — o tom, o compasso, o ritmo, a
   nota mais aguda, o andamento e o começo dele — conforme a fase do MSA. */
const { formula, composto, media, metTexto } = require("./hinos-da-aula.js");
const { posicaoViolino, umaOitavaAcima } = require("./repertorio.js");

/* Grupos de instrumentos pela afinação. Trombone, eufônio e tuba: a apostila
   de escalas os escreve como instrumentos em Si♭; quem lê o hinário em Dó
   toca como os instrumentos em Dó. */
const GRUPOS = [
  { id: "do", nome: "Em Dó", quem: "violino, viola, violoncelo, flauta, oboé, fagote" },
  { id: "sib", nome: "Em Si♭", quem: "clarinete e clarone, sax soprano e tenor, trompete, cornet, flugelhorn — e trombone, eufônio e tuba, quando leem em Si♭" },
  { id: "mib", nome: "Em Mi♭", quem: "clarinete alto, sax alto e barítono" },
  { id: "fa", nome: "Em Fá", quem: "trompa em Fá" },
];

/* Tom do hinário (em Dó) → tom que cada grupo lê para soar junto. */
const TRANSP = {
  "Dó": { sib: "Ré", mib: "Lá", fa: "Sol" },
  "Sol": { sib: "Lá", mib: "Mi", fa: "Ré" },
  "Ré": { sib: "Mi", mib: "Si", fa: "Lá" },
  "Lá": { sib: "Si", mib: "Fá♯", fa: "Mi" },
  "Mi": { sib: "Fá♯", mib: "Dó♯", fa: "Si" },
  "Fá": { sib: "Sol", mib: "Ré", fa: "Dó" },
  "Si♭": { sib: "Dó", mib: "Sol", fa: "Fá" },
  "Mi♭": { sib: "Fá", mib: "Dó", fa: "Si♭" },
  "Lá♭": { sib: "Si♭", mib: "Fá", fa: "Mi♭" },
  "Ré♭": { sib: "Mi♭", mib: "Si♭", fa: "Lá♭" },
};
const TONS_DO_HINARIO = Object.keys(TRANSP);

const SUST = ["Fá", "Dó", "Sol", "Ré", "Lá", "Mi", "Si"], BEM = ["Si", "Mi", "Lá", "Ré", "Sol", "Dó", "Fá"];
const NSUST = { "Dó": 0, "Sol": 1, "Ré": 2, "Lá": 3, "Mi": 4, "Si": 5, "Fá♯": 6, "Dó♯": 7 };
const NBEM = { "Fá": 1, "Si♭": 2, "Mi♭": 3, "Lá♭": 4, "Ré♭": 5, "Sol♭": 6 };
function armadura(tom) {
  if (tom in NSUST) { const k = NSUST[tom]; return k ? `${k} sustenido${k > 1 ? "s" : ""} (${SUST.slice(0, k).join(", ")})` : "sem acidentes"; }
  if (tom in NBEM) { const k = NBEM[tom]; return `${k} ${k > 1 ? "bemóis" : "bemol"} (${BEM.slice(0, k).join(", ")})`; }
  return "";
}
const leitura = tom => [{ grupo: "Em Dó", tom }, ...["sib", "mib", "fa"].map(g =>
  ({ grupo: GRUPOS.find(x => x.id === g).nome, tom: (TRANSP[tom] || {})[g] }))];

/* Em que nível do exercício cada fase está. */
const nivel = f => f <= 3 ? 1 : f <= 5 ? 2 : f <= 9 ? 3 : 4;
const NIVEIS = [
  null,
  { nome: "Nível 1 — a escala e o arpejo", fases: "fases 1 a 3" },
  { nome: "Nível 2 — no compasso e no ritmo do hino", fases: "fases 4 e 5" },
  { nome: "Nível 3 — armadura e extensão do hino", fases: "fases 6 a 9" },
  { nome: "Nível 4 — andamento, dinâmica, articulação e o começo do hino", fases: "fases 10 a 16" },
];

function compassoDaEscala(h) {
  const f = (h.fc && h.fc.length) ? formula(h.fc[0]) : "4/4";
  const [num] = f.split("/").map(Number);
  const fig = { 2: "mínimas", 4: "semínimas", 8: "colcheias" }[Number(f.split("/")[1])] || "colcheias";
  if (composto(f)) return `em ${fig}, de três em três, com a primeira de cada grupo mais apoiada — o ${f} do hino`;
  if (num === 2) return `de duas em duas notas, a primeira mais apoiada — o ${f} do hino`;
  if (num === 3) return `de três em três notas, a primeira mais apoiada — o ${f} do hino`;
  return `de quatro em quatro notas, a primeira mais apoiada e a terceira um pouco — o ${f} do hino`;
}

/* A escala sugerida antes de um hino, na fase em que ele é analisado. */
function escalaDoHino(h, f) {
  const n = nivel(f), tom = h.tom;
  const passos = [`Escala de ${tom} maior, uma oitava, subindo e descendo, em semínimas, uma nota por clique (metrônomo em 60); depois o arpejo: 1ª, 3ª, 5ª, 8ª e de volta.`];
  if (n >= 2) {
    passos.push(`Depois, a mesma escala ${compassoDaEscala(h)}.`);
    if ((h.s || []).includes("pontuada")) passos.push("E uma vez com cada nota no ritmo pontuado — colcheia pontuada e semicolcheia —, que o hino tem.");
  }
  if (n >= 3) {
    passos.push(`Antes de tocar, diga a armadura: ${armadura(tom)}.`);
    if (h.ag) passos.push(`Estenda a escala até a nota mais aguda do soprano do hino, ${h.ag.replace(/\d$/, "")}${h.ag ? ` (no violino, soprano 8ª acima: ${umaOitavaAcima(h.ag)}, ${posicaoViolino(umaOitavaAcima(h.ag))})` : ""}.`);
  }
  if (n >= 4) {
    const m = media(h);
    if (m) passos.push(`No andamento do hino (${metTexto(h).replace("-", "–")}), começando por volta de ${Math.round(m)}.`);
    passos.push("Subindo em crescendo, descendo em diminuendo; uma vez ligada de duas em duas notas, outra destacada.");
    if (f >= 13 && h.ri && h.ri !== "tético")
      passos.push(`Comece a escala como o hino começa: ${h.ri === "acéfalo" ? "depois de uma pausa no 1º tempo" : "em anacruse, antes do 1º tempo"}${h.arc ? `, com o arco ${h.arc === "cima" ? "para cima" : "para baixo"} (cordas)` : ""}.`);
  }
  return { tom, armadura: armadura(tom), leitura: leitura(tom), nivel: n, passos };
}

module.exports = { escalaDoHino, GRUPOS, TRANSP, TONS_DO_HINARIO, armadura, leitura, NIVEIS, nivel };
