/* Repertório de estudo por etapa do Programa Mínimo.

   O Anderson pediu hinos para estudar em cada etapa — reuniões de jovens e
   menores, cultos oficiais, oficialização —, em ordem de dificuldade, e que
   cada um traga algo diferente, "para não ficar estudando aleatoriamente".

   Como se escolhe:
   - dificuldade: soma do que pesa na execução e está nos dados do hino —
     acidentes da armadura, compasso composto, mudança de fórmula, tercina,
     síncopa e contratempo (listas do GEM), ritornelo, entrada acéfala ou
     anacrúsica, andamento rápido, tamanho (sistemas). Para o violino nos
     cultos e na oficialização, também a posição que o soprano 8ª acima exige;
   - novidade: a lista é montada em faixas de dificuldade crescente, e em cada
     faixa entra o hino que traz mais coisas que os anteriores ainda não
     trouxeram — fórmula, tonalidade, sinal, ritmo inicial, posição.
   A razão de cada escolha vai escrita ao lado do hino. */

const H = require("./hinos-da-aula.js");
const { formula, composto, fcTexto, media, LISTAS } = H;

const listaGEM = rot => new Set((LISTAS || []).filter(l => l.rot === rot).flatMap(l => l.hinos));
const SINCOPA = listaGEM("Síncopa"), CONTRATEMPO = listaGEM("Contratempo");
const NACID = { "Dó": 0, "Sol": 1, "Fá": 1, "Ré": 2, "Si♭": 2, "Lá": 3, "Mi♭": 3, "Mi": 4, "Lá♭": 4, "Ré♭": 5 };

/* Altura em passos acima do Mi4 (1ª linha da pauta de Sol). */
const LETRAS = ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si"];
function passos(nota) {
  const m = /^(Dó|Ré|Mi|Fá|Sol|Lá|Si)([♯♭]?)(\d)$/.exec(nota || "");
  return m ? LETRAS.indexOf(m[1]) + 7 * Number(m[3]) - 30 : null;
}
const umaOitavaAcima = nota => nota ? nota.replace(/\d$/, d => String(Number(d) + 1)) : "";

/* Posição do violino para a nota mais aguda, na corda Mi. Orientação geral —
   o método do aluno é que decide a digitação. */
function posicaoViolino(nota) {
  const p = passos(nota);
  if (p === null) return "";
  if (p <= 11) return "1ª posição";                 // até Si5
  if (p <= 13) return "3ª posição";                 // Dó6–Ré6
  if (p === 14) return "3ª posição com extensão, ou 4ª";   // Mi♭6–Mi6
  return "5ª posição";                              // Fá6
}

function dificuldade(h, etapa) {
  const f = h.fc && h.fc.length ? formula(h.fc[0]) : "4/4";
  const s = h.s || [];
  let d = (NACID[h.tom] || 0) * 0.8
    + (composto(f) ? 2 : 0) + (/^(9|12)\//.test(f) ? 1 : 0)
    + ((h.fc || []).length > 1 ? 3 : 0)
    + (s.includes("tercina") ? 2 : 0) + (s.includes("ritornelo") ? 1 : 0)
    + (SINCOPA.has(h.n) ? 2 : 0) + (CONTRATEMPO.has(h.n) ? 1.5 : 0)
    + (h.ri === "acéfalo" ? 2 : h.ri === "anacrúsico" ? 0.5 : 0)
    + (media(h) >= 110 ? 1 : 0) + (h.sis || 4) * 0.3;
  if (etapa > 0) {                                  // soprano 8ª acima no violino
    const p = passos(umaOitavaAcima(h.ag));
    if (p !== null) d += p <= 13 ? 0 : p === 14 ? 2 : 4;   // até a 3ª posição não pesa
  }
  return Math.round(d * 10) / 10;
}

/* O que o hino traz, em palavras: é daqui que sai a "novidade". */
function tracos(h, etapa) {
  const t = [];
  (h.fc || []).forEach(f => t.push(`compasso ${f === "C" ? "C (4/4)" : f === "C cortado" ? "C cortado (2/2)" : f}`));
  if ((h.fc || []).length > 1) t.push("mudança de fórmula");
  t.push(`${h.tom} maior`);
  if (h.ri) t.push(`entrada ${h.ri}`);
  (h.s || []).filter(x => x !== "pontuada").forEach(x => t.push(x));
  if (SINCOPA.has(h.n)) t.push("síncopa");
  if (CONTRATEMPO.has(h.n)) t.push("contratempo");
  if (media(h) >= 110) t.push("andamento rápido");
  if (media(h) && media(h) < 60) t.push("andamento lento");
  if (etapa > 0 && h.ag) t.push(`violino: ${posicaoViolino(umaOitavaAcima(h.ag))}`);
  if (etapa === 2 && h.gr) t.push(`contralto até ${h.gr.replace(/\d$/, "")}`);
  return t;
}

const ETAPAS = [
  { nome: "Reuniões de jovens e menores", curto: "RJM", quantos: 8,
    violino: "Soprano no natural, hinos 431 a 480.",
    pool: HINOS => HINOS.filter(h => h.n >= 431) },
  { nome: "Cultos oficiais", curto: "Cultos", quantos: 10,
    violino: "Hinário completo, soprano 8ª acima.",
    pool: HINOS => HINOS },
  { nome: "Oficialização", curto: "Oficialização", quantos: 10,
    violino: "Hinário completo, soprano 8ª acima e contralto no natural.",
    // a oficialização fica com a metade mais difícil do hinário
    pool: (HINOS, e) => { const ord = [...HINOS].sort((a, b) => dificuldade(a, e) - dificuldade(b, e));
                          return ord.slice(Math.floor(ord.length / 2)); } },
];

function repertorio(HINOS) {
  const validos = HINOS.filter(h => h.tom && h.fc && h.sis && h.ag);
  const ja = new Set(), saida = [];
  ETAPAS.forEach((et, e) => {
    const vistos = new Set();   // a novidade conta dentro da etapa
    const pool = et.pool(validos, e).filter(h => !ja.has(h.n))
      .map(h => ({ h, d: dificuldade(h, e), t: tracos(h, e) }))
      .sort((a, b) => a.d - b.d || a.h.n - b.h.n);
    const faixas = Array.from({ length: et.quantos }, (_, k) =>
      pool.slice(Math.floor(k * pool.length / et.quantos), Math.floor((k + 1) * pool.length / et.quantos)));
    const lista = [];
    faixas.forEach(faixa => {
      if (!faixa.length) return;
      // o que traz mais novidade; empate → o do meio da faixa
      const meio = faixa[Math.floor(faixa.length / 2)].d;
      const melhor = faixa.map(x => ({ ...x, novo: x.t.filter(t => !vistos.has(t)) }))
        .sort((a, b) => b.novo.length - a.novo.length || Math.abs(a.d - meio) - Math.abs(b.d - meio) || a.h.n - b.h.n)[0];
      melhor.novo.forEach(t => vistos.add(t));
      ja.add(melhor.h.n);
      lista.push({
        n: melhor.h.n, h: melhor.h, dificuldade: melhor.d,
        traz: lista.length === 0 ? ["ponto de partida"]
            : (melhor.novo.filter(t => !t.startsWith("violino:")).length
               ? melhor.novo.filter(t => !t.startsWith("violino:"))
               : melhor.novo.length ? ["mais uma posição no violino"] : ["revisão, em hino mais longo"]),
        tudo: melhor.t,
        violino: e === 0
          ? `soprano no natural; nota mais aguda ${melhor.h.ag}`
          : `soprano 8ª acima, nota mais aguda ${umaOitavaAcima(melhor.h.ag)} — ${posicaoViolino(umaOitavaAcima(melhor.h.ag))}` +
            (e === 2 && melhor.h.gr ? `; contralto natural, nota mais grave ${melhor.h.gr}` : ""),
      });
    });
    saida.push({ ...et, hinos: lista });
  });
  return saida;
}

module.exports = { repertorio, dificuldade, posicaoViolino, umaOitavaAcima, ETAPAS };
