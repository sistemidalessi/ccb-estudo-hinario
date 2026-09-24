/* Análise de hinos ao fim de cada fase do MSA.

   O Anderson pediu: ao fim de cada assunto, dois ou três hinos com as
   perguntas das fichas "Hinos - Análises II" (as 320 fichas do GEM de
   Diadema), mas só sobre o que já foi aprendido. As fichas antigas tinham
   dois defeitos que isto corrige: misturavam os quatro períodos numa folha só
   — o candidato do 1º período não tinha como responder metade — e não tinham
   gabarito.

   Aqui:
   - cada pergunta das fichas fica presa à fase em que o assunto é ensinado
     (PERGUNTAS, campo f), e só aparece dali em diante;
   - o gabarito sai dos dados do próprio hino (dados/hinos.js): fórmula,
     unidades, sistemas, velocidade, armadura, escala, ritmo inicial...;
   - os hinos de cada fase mostram o assunto da fase e não exigem o que ainda
     não foi ensinado: nada de 6/8 antes da fase 5, de ritornelo antes da 9,
     de síncopa antes da 12.

   Pergunta que dependeria de ler a partitura nota a nota (quantas frases,
   que ligadura é aquela) ficou de fora: sem gabarito certo, não entra. */

const H = require("./hinos-da-aula.js");
const { ARMADURA, RELATIVA, fcTexto, formula, composto, UNIDADES, valoresPontuados,
        perguntaArco, media, LISTAS } = H;

/* ------------------------------------------------------------ utilidades --- */

/* Em que fase cada fórmula de compasso é ensinada. */
const FASE_DA_FORMULA = {
  "4/4": 2, "C": 11, "3/4": 4, "2/4": 4, "2/2": 4, "C cortado": 11, "3/2": 4,
  "6/8": 5, "6/4": 5, "9/8": 7, "9/4": 7, "12/8": 7,
};
const formulaPrincipal = h => (h.fc && h.fc.length) ? formula(h.fc[0]) : null;

/* Síncopa e contratempo não se leem da partitura; vêm das listas do GEM. */
const listaGEM = rot => new Set((LISTAS || []).filter(l => l.rot === rot).flatMap(l => l.hinos));
const SINCOPA = listaGEM("Síncopa");
const CONTRATEMPO = listaGEM("Contratempo");

/* O hino pode aparecer na fase f? Só se tudo o que ele traz já foi ensinado. */
function cabeNaFase(h, f) {
  if (!h.tom || !h.fc || !h.fc.length || !h.sis) return false;
  if (h.fc.some(x => (FASE_DA_FORMULA[x] || 99) > Math.max(f, 2))) return false;
  if (h.fc.length > 1 && f < 11) return false;                      // compassos alternados
  const s = h.s || [];
  if (s.includes("tercina") && f < 5) return false;
  if (s.includes("ritornelo") && f < 9) return false;
  if ((SINCOPA.has(h.n) || CONTRATEMPO.has(h.n)) && f < 12) return false;
  if (h.ri === "acéfalo" && f < 13) return false;
  return true;
}

/* Notas da pauta de Sol, da 1ª linha para cima. */
const LETRAS = ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si"];
function passosDoMi4(nota) {
  const m = /^(Dó|Ré|Mi|Fá|Sol|Lá|Si)[♯♭]?(\d)$/.exec(nota || "");
  if (!m) return null;
  return LETRAS.indexOf(m[1]) + 7 * Number(m[2]) - (LETRAS.indexOf("Mi") + 7 * 4);
}
function lugarNaPauta(nota) {
  const p = passosDoMi4(nota);
  if (p === null) return "";
  if (p >= 0 && p <= 8) return p % 2 === 0 ? `${p / 2 + 1}ª linha` : `${(p + 1) / 2}º espaço`;
  if (p === 9) return "acima da 5ª linha";
  if (p === -1) return "abaixo da 1ª linha";
  if (p > 9) return p % 2 === 0 ? `${(p - 8) / 2}ª linha suplementar superior` : `acima da ${(p - 9) / 2}ª linha suplementar superior`;
  return p % 2 === 0 ? `${-p / 2}ª linha suplementar inferior` : `abaixo da ${(-p - 1) / 2}ª linha suplementar inferior`;
}
const semOitava = nota => (nota || "").replace(/\d$/, "");
const comArtigo = lugar => /^(acima|abaixo)/.test(lugar) ? lugar : (/linha/.test(lugar) ? "na " : "no ") + lugar;

/* Escala maior de cada tonalidade do hinário. */
const ACID = {
  "Dó": {}, "Sol": { Fá: "♯" }, "Ré": { Fá: "♯", Dó: "♯" }, "Lá": { Fá: "♯", Dó: "♯", Sol: "♯" },
  "Mi": { Fá: "♯", Dó: "♯", Sol: "♯", Ré: "♯" }, "Fá": { Si: "♭" }, "Si♭": { Si: "♭", Mi: "♭" },
  "Mi♭": { Si: "♭", Mi: "♭", Lá: "♭" }, "Lá♭": { Si: "♭", Mi: "♭", Lá: "♭", Ré: "♭" },
  "Ré♭": { Si: "♭", Mi: "♭", Lá: "♭", Ré: "♭", Sol: "♭" },
};
function escala(tom) {
  const letra = tom.replace(/[♯♭]/, "");
  const i = LETRAS.indexOf(letra);
  const notas = Array.from({ length: 8 }, (_, k) => LETRAS[(i + k) % 7]);
  return notas.map(n => n + ((ACID[tom] || {})[n] || "")).join(" – ");
}

/* Acentuação métrica, só onde o banco de questões já a fixou. */
const ACENTUACAO = {
  "2/4": "1º tempo forte · 2º fraco", "2/2": "1º tempo forte · 2º fraco",
  "3/4": "1º tempo forte · 2º fraco · 3º fraco",
  "4/4": "1º tempo forte · 2º fraco · 3º meio-forte · 4º fraco",
  "6/8": "1º movimento forte · 4º meio-forte · os demais fracos",
  "6/4": "1º movimento forte · 4º meio-forte · os demais fracos",
};

/* ------------------------------------------------------------- perguntas --- */
/* f: fase em que a pergunta passa a valer · aplica(h) · faz(h) → [pergunta, gabarito] */

const PERGUNTAS = [
  // fase 1 — pentagrama, notas, claves
  { f: 1, aplica: () => true,
    faz: h => [`Em que clave está a pauta de cima do hino ${h.n}? E a de baixo?`,
      "Clave de Sol na de cima (soprano e contralto); clave de Fá na de baixo (tenor e baixo)."] },
  { f: 1, aplica: h => lugarNaPauta(h.ag),
    faz: h => [`Qual é a nota mais aguda do soprano no hino ${h.n}? Em que linha ou espaço ela está?`,
      `${semOitava(h.ag)}, ${comArtigo(lugarNaPauta(h.ag))} da pauta de Sol.`] },

  { f: 1, aplica: h => lugarNaPauta(h.gr),
    faz: h => [`E a nota mais grave da pauta de Sol no hino ${h.n} — que é do contralto —, qual é e onde está?`,
      `${semOitava(h.gr)}, ${comArtigo(lugarNaPauta(h.gr))}.`] },

  // fase 2 — figuras, compasso, fórmula em 4
  { f: 2, aplica: h => formulaPrincipal(h),
    faz: h => {
      const f = formulaPrincipal(h), [a, b] = f.split("/");
      const fig = { 2: "a mínima", 4: "a semínima", 8: "a colcheia" }[b];
      return [`Qual é a fórmula de compasso do hino ${h.n}? O que indica cada número?`,
        `${fcTexto(h)}. O número de cima indica ${composto(f) ? `quantos movimentos (${a})` : `quantos tempos (${a})`} há no compasso; o de baixo, que ${fig} ${composto(f) ? "vale um movimento" : "vale um tempo"}.`];
    } },
  { f: 2, aplica: h => UNIDADES[formulaPrincipal(h)],
    faz: h => {
      const [ut, uc] = UNIDADES[formulaPrincipal(h)];
      return [`No hino ${h.n}, qual é a unidade de tempo e qual a unidade de compasso?`,
        `Unidade de tempo: ${ut}. Unidade de compasso: ${uc}.`];
    } },

  // fase 3 — sistema, leitura, condução, metrônomo
  { f: 3, aplica: h => h.sis,
    faz: h => [`Quantos sistemas tem o hino ${h.n}?`, `${h.sis}.`] },
  { f: 3, aplica: h => media(h),
    faz: h => {
      const [a, b] = h.met.split("-");
      return [`Qual é a marcação de velocidade do hino ${h.n}, e qual a velocidade média?`,
        `De ${a} a ${b}; a média é ${Math.round(media(h))} — o próprio hinário a traz entre parênteses.`];
    } },

  // fase 4 — ponto de aumento; 3 e 2
  { f: 4, aplica: () => true,
    faz: h => [`O hino ${h.n} tem nota pontuada? Se tiver, mostre uma.`,
      (h.s || []).includes("pontuada") ? "Sim. O aluno deve apontar a nota com o ponto à direita da cabeça."
                                        : "Não: este hino não tem ponto de aumento."] },

  // fase 5 — tercina, fermata, compasso em 6
  { f: 5, aplica: () => true,
    faz: h => [`O hino ${h.n} tem fermata? Se tiver, como ela se executa?`,
      (h.s || []).includes("fermata")
        ? "Sim. Prolonga-se o valor da nota, diminuindo até o silêncio; faz-se uma parada breve, respira-se e retoma-se na mesma velocidade."
        : "Não: este hino não tem fermata."] },
  { f: 5, aplica: h => (h.s || []).includes("tercina"),
    faz: h => [`Localize uma tercina no hino ${h.n}. Como se tocam as três notas?`,
      "Iguais entre si, as três no espaço de duas da mesma figura."] },
  { f: 5, aplica: h => composto(formulaPrincipal(h) || ""),
    faz: h => [`No hino ${h.n}, em ${formulaPrincipal(h)}, qual é a unidade de movimento?`,
      `${formulaPrincipal(h).endsWith("/8") ? "A colcheia" : "A semínima"} — é ela que vale um movimento.`] },

  // fase 6 — acidentes, escalas
  { f: 6, aplica: h => ACID[h.tom],
    faz: h => [`Toque a escala maior na tonalidade do hino ${h.n}.`,
      `Escala de ${h.tom} maior: ${escala(h.tom)}. Avaliar a afinação dos ${h.tom.includes("♭") || h.tom === "Fá" ? "bemóis" : "sustenidos"}.`.replace("Avaliar a afinação dos sustenidos.", h.tom === "Dó" ? "Sem acidentes." : "Avaliar a afinação dos sustenidos.")] },
  { f: 6, aplica: h => h.tom !== "Dó",
    faz: h => {
      const bem = h.tom.includes("♭") || h.tom === "Fá";
      return [`Qual é o efeito do ${bem ? "bemol" : "sustenido"} que aparece no começo das pautas do hino ${h.n}?`,
        bem ? "Abaixa a nota um semitom." : "Eleva a nota um semitom."];
    } },

  // fase 7 — armadura
  { f: 7, aplica: h => ARMADURA[h.tom],
    faz: h => [`Quais são os acidentes fixos (a armadura) do hino ${h.n}, em ordem?`,
      h.tom === "Dó" ? "Nenhum: a armadura de Dó maior não tem acidente." : `${ARMADURA[h.tom][0].toUpperCase()}${ARMADURA[h.tom].slice(1)}.`] },

  // fase 8 — tonalidade
  { f: 8, aplica: h => RELATIVA[h.tom],
    faz: h => [`Qual é a tonalidade do hino ${h.n}? Escrita e de execução, no seu instrumento.`,
      `${h.tom} maior. No violino (instrumento em Dó) escrita e execução são a mesma; nos instrumentos transpositores, a escrita muda.`] },
  { f: 8, aplica: h => RELATIVA[h.tom],
    faz: h => [`Qual é a relativa menor da tonalidade do hino ${h.n}?`, `${RELATIVA[h.tom]}.`] },

  // fase 9 — repetição
  { f: 9, aplica: () => true,
    faz: h => [`O hino ${h.n} tem barras de repetição (ritornelo)?`,
      (h.s || []).includes("ritornelo") ? "Sim. O aluno deve apontar os dois pontos junto à barra dupla e dizer de onde se repete."
                                         : "Não: este hino se toca do começo ao fim, sem repetição escrita."] },

  // fase 10 — dinâmica
  { f: 10, aplica: () => true,
    faz: h => [`No hino ${h.n}, nas retomadas depois da respiração, o som volta forte ou fraco?`,
      "Fraco. A retomada depois da respiração não recebe acento — quem recebe acento é o tempo forte do compasso."] },

  // fase 11 — acento métrico, simples e composto, alternados
  { f: 11, aplica: h => ACENTUACAO[formulaPrincipal(h)],
    faz: h => [`Qual é a acentuação métrica do compasso do hino ${h.n}?`, `${ACENTUACAO[formulaPrincipal(h)]}.`] },
  { f: 11, aplica: h => formulaPrincipal(h),
    faz: h => {
      const f = formulaPrincipal(h);
      return [`O compasso do hino ${h.n} é simples ou composto?`,
        composto(f) ? `Composto: cada tempo se divide em três; a unidade de tempo é figura pontuada (${UNIDADES[f][0]}).`
                    : `Simples: cada tempo se divide em dois; a unidade de tempo é ${UNIDADES[f][0]}.`];
    } },
  { f: 11, aplica: h => h.fc && h.fc.length > 1,
    faz: h => [`O hino ${h.n} muda de fórmula de compasso. Quais são, e na ordem em que aparecem?`,
      `${fcTexto(h)}. A unidade de tempo continua a mesma na virada — o pulso não muda.`] },

  // fase 12 — síncopa e contratempo
  { f: 12, aplica: h => SINCOPA.has(h.n) || CONTRATEMPO.has(h.n),
    faz: h => {
      const q = SINCOPA.has(h.n) && CONTRATEMPO.has(h.n) ? "uma síncopa e um contratempo"
              : SINCOPA.has(h.n) ? "uma síncopa" : "um contratempo";
      return [`Localize ${q} no hino ${h.n}.`,
        `O caderno do GEM traz este hino na lista de ${SINCOPA.has(h.n) ? "síncopa" : ""}${SINCOPA.has(h.n) && CONTRATEMPO.has(h.n) ? " e na de " : ""}${CONTRATEMPO.has(h.n) ? "contratempo" : ""}. Exigir que o aluno aponte o compasso.`];
    } },

  // fase 13 — ritmos iniciais (lidos da partitura: conferir)
  { f: 13, aplica: h => h.ri,
    faz: h => [`O hino ${h.n} começa em tempo forte ou fraco? Qual é o ritmo inicial? O primeiro compasso está completo?`,
      h.ri === "tético" ? "Tempo forte. Tético. O primeiro compasso está completo."
      : h.ri === "anacrúsico" ? "Tempo fraco, antes do 1º tempo. Anacrúsico. O primeiro compasso é incompleto."
      : "Depois do tempo forte, que fica em silêncio. Acéfalo — um dos dois do hinário. A pausa não vem escrita."] },
  { f: 13, aplica: h => h.arc && h.ri, faz: h => perguntaArco(h)[0] },

  // fase 14 — notas pontuadas
  { f: 14, aplica: h => (h.s || []).includes("pontuada") && UNIDADES[formulaPrincipal(h)],
    faz: h => [`No hino ${h.n} (${formulaPrincipal(h)}), quanto vale cada figura pontuada que aparece?`,
      `Conforme a figura. Em ${formulaPrincipal(h)}: ${valoresPontuados(formulaPrincipal(h))}.`] },

  // fase 15 — andamento
  { f: 15, aplica: h => media(h) && !composto(formulaPrincipal(h) || "") && (h.mf || "semínima") === "semínima",
    faz: h => {
      const m = media(h);
      return [`Pela marcação de velocidade, o andamento do hino ${h.n} é lento, moderado ou rápido?`,
        `${m < 70 ? "Lento" : m < 100 ? "Moderado" : "Rápido"} — média em torno de ${Math.round(m)}.`];
    } },

  // fase 16 — indicações interpretativas
  { f: 16, aplica: h => h.ind,
    faz: h => [`Qual é a indicação interpretativa do hino ${h.n}, e o que ela pede da execução?`,
      `“${h.ind}”. Resposta aberta: espera-se que o aluno fale de ataque, intensidade e condução da frase, e não só do sentimento.`] },
];

/* ------------------------------------------------------ escolha dos hinos --- */

const temS = x => h => (h.s || []).includes(x);
const fOk = (...fs) => h => fs.includes(formulaPrincipal(h));
const BEMOIS = ["Fá", "Si♭", "Mi♭", "Lá♭", "Ré♭"], SUSTENIDOS = ["Sol", "Ré", "Lá", "Mi"];
const acidentes = h => Object.keys(ACID[h.tom] || {}).length;

/* Para cada fase, os critérios dos hinos, um por vaga, em ordem. As primeiras
   fases preferem os hinos 431 a 480, que são os que o candidato toca nas
   reuniões de jovens e menores. */
const VAGAS = {
  1: [h => fOk("4/4")(h) && h.sis <= 4, h => fOk("4/4")(h) && h.sis <= 5],
  2: [h => fOk("4/4")(h) && h.sis <= 4, h => fOk("4/4")(h) && acidentes(h) <= 2, h => fOk("4/4")(h)],
  3: [h => fOk("4/4")(h) && media(h), h => fOk("4/4")(h) && media(h) && h.sis >= 5],
  4: [fOk("3/4"), fOk("2/4", "2/2"), h => fOk("4/4", "3/4")(h) && temS("pontuada")(h)],
  5: [temS("tercina"), fOk("6/8"), h => temS("fermata")(h) && fOk("6/4", "3/4")(h)],
  6: [h => SUSTENIDOS.includes(h.tom), h => BEMOIS.includes(h.tom) && acidentes(h) >= 2, h => h.tom === "Dó"],
  7: [fOk("9/8", "9/4"), fOk("12/8"), h => acidentes(h) >= 4],
  8: [h => h.tom === "Ré" || h.tom === "Lá", h => h.tom === "Ré♭", h => h.tom === "Fá"],
  9: [temS("ritornelo"), temS("ritornelo")],
  10: [h => temS("fermata")(h) && media(h), h => media(h)],
  11: [h => h.fc.length > 1, h => composto(formulaPrincipal(h)), h => h.fc[0] === "C"],
  12: [h => SINCOPA.has(h.n) && !CONTRATEMPO.has(h.n), h => CONTRATEMPO.has(h.n) && !SINCOPA.has(h.n), h => SINCOPA.has(h.n) && CONTRATEMPO.has(h.n)],
  13: [h => h.ri === "acéfalo", h => h.ri === "anacrúsico" && h.arc === "baixo", h => h.ri === "tético"],
  14: [h => temS("pontuada")(h) && fOk("4/4", "3/4")(h), h => temS("pontuada")(h) && fOk("6/8", "9/8", "12/8")(h)],
  15: [h => media(h) && media(h) < 66 && !composto(formulaPrincipal(h)), h => media(h) && media(h) >= 100 && !composto(formulaPrincipal(h))],
  16: [h => h.ind, h => h.ind],
};

function hinosDaFase(f, HINOS, usados = new Set()) {
  const pool = HINOS.filter(h => cabeNaFase(h, f) && !usados.has(h.n));
  // RJM primeiro nas fases do 1º e 2º períodos; depois, o hinário todo,
  // começando do meio para não cair sempre nos primeiros números
  const ordem = f <= 5
    ? [...pool.filter(h => h.n >= 431), ...pool.filter(h => h.n < 431)]
    : [...pool.filter(h => h.n >= 200), ...pool.filter(h => h.n < 200)];
  const escolhidos = [];
  for (const crit of VAGAS[f] || []) {
    let cands = ordem.filter(h => crit(h) && !escolhidos.includes(h));
    const rjm = cands.filter(h => h.n >= 431);
    if (f <= 5 && rjm.length) cands = rjm;
    if (!cands.length) continue;
    // espalha: um hino a cada tanto, determinístico pela fase
    escolhidos.push(cands[(f * 7) % cands.length]);
  }
  escolhidos.forEach(h => usados.add(h.n));
  return escolhidos;
}

/* Perguntas de um hino na fase f: as novas da fase primeiro; depois revisão
   das fases anteriores, até completar `total`, variando a fase de onde vêm. */
function perguntasDoHino(h, f, total = 7) {
  const novas = PERGUNTAS.filter(p => p.f === f && p.aplica(h)).map(p => p.faz(h));
  const anteriores = PERGUNTAS.filter(p => p.f < f && p.aplica(h));
  // revisão: das fases mais recentes para as mais antigas, uma por fase por volta
  const porFase = {};
  anteriores.forEach(p => (porFase[p.f] = porFase[p.f] || []).push(p));
  const fases = Object.keys(porFase).map(Number).sort((a, b) => b - a);
  const revisao = [];
  for (let volta = 0; revisao.length < total - novas.length && volta < 4; volta++) {
    for (const ff of fases) {
      const p = porFase[ff][(volta + h.n) % porFase[ff].length];
      if (volta >= porFase[ff].length) continue;
      if (revisao.length >= total - novas.length) break;
      const par = p.faz(h);
      if (!revisao.some(r => r[0] === par[0])) revisao.push(par);
    }
  }
  return { novas, revisao };
}

/* A análise de uma fase inteira. */
function analiseDaFase(f, HINOS, usados) {
  return hinosDaFase(f, HINOS, usados).map(h => ({ h, ...perguntasDoHino(h, f) }));
}

/* Toda a sequência, fase por fase, sem repetir hino. */
function todasAsAnalises(HINOS) {
  const usados = new Set(), out = {};
  for (let f = 1; f <= 16; f++) out[f] = analiseDaFase(f, HINOS, usados);
  return out;
}

/* Última aula de cada fase, no período dela: é ali que a análise entra.
   A fase de uma aula sai do tópico ("4.4, 4.5" → fase 4); aula de
   continuação, sem tópico, é da mesma fase da anterior; a revisão final do
   período ("1.1 a 3.5") não conta. */
function ultimaAulaDaFase(AULAS) {
  const ult = {};
  for (const p of [1, 2, 3, 4]) {
    let fase = null;
    (AULAS[p] || []).forEach(([num, tops]) => {
      const m = /^(\d+)\./.exec(tops || "");
      if (/ a /.test(tops || "")) return;
      if (m) fase = Number(m[1]);
      else if (/Introdu/.test(tops || "")) fase = 1;
      if (fase) ult[fase] = { p, a: num };
    });
  }
  return ult;
}

module.exports = { PERGUNTAS, todasAsAnalises, ultimaAulaDaFase, hinosDaFase, perguntasDoHino,
                   cabeNaFase, lugarNaPauta, escala, FASE_DA_FORMULA };

/* node ferramentas/analise.js --lista → os números dos hinos da análise, para
   o recortar-hinos.py saber que partituras recortar. */
if (require.main === module && process.argv.includes("--lista")) {
  const { carregar } = require("./carregar.js");
  const { HINOS } = carregar();
  const T = todasAsAnalises(HINOS);
  console.log(JSON.stringify(Object.values(T).flat().map(x => x.h.n)));
}
