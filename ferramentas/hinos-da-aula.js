/* Escolhe, para cada aula do MSA, os hinos que servem de fecho — aqueles em que
   o conceito da aula aparece. Os hinos saem fora da ordem do hinário de
   propósito: quem manda é a teoria.

   Ordem de prioridade, e ela importa:
   1. a lista oficial do GEM para aquela aula (dados/hinos-por-aula.js), quando
      existe. O caderno de atividades já traz os hinos na ordem de complexidade
      do MSA — nada aqui substitui isso;
   2. as regras abaixo, que escolhem hinos pelos dados do cabeçalho (tom,
      marcação, metrônomo). Elas existem para as aulas em que o próprio caderno
      manda o instrutor selecionar os hinos, e para as que não trazem lista.

   Cada regra diz por que aqueles hinos foram escolhidos e gera perguntas com
   gabarito, tiradas dos próprios dados do hino. */

/* As listas oficiais vêm do require no Node e do <script> no navegador. O nome
   interno é outro (LISTAS) de propósito: `const HINOS_AULA` do arquivo de dados
   já ocupa o escopo global da página, e redeclarar quebraria o carregamento. */
let LISTAS = [];
try {
  LISTAS = require("../dados/hinos-por-aula.js").HINOS_AULA;
} catch (e) {
  if (typeof HINOS_AULA !== "undefined") LISTAS = HINOS_AULA;
}

const ARMADURA = {
  "Dó": "nenhum acidente", "Sol": "um sustenido (Fá♯)", "Ré": "dois sustenidos (Fá♯ Dó♯)",
  "Lá": "três sustenidos (Fá♯ Dó♯ Sol♯)", "Mi": "quatro sustenidos (Fá♯ Dó♯ Sol♯ Ré♯)",
  "Fá": "um bemol (Si♭)", "Si♭": "dois bemóis (Si♭ Mi♭)", "Mi♭": "três bemóis (Si♭ Mi♭ Lá♭)",
  "Lá♭": "quatro bemóis (Si♭ Mi♭ Lá♭ Ré♭)", "Ré♭": "cinco bemóis (Si♭ Mi♭ Lá♭ Ré♭ Sol♭)",
};
const RELATIVA = {
  "Dó": "Lá menor", "Sol": "Mi menor", "Ré": "Si menor", "Lá": "Fá♯ menor", "Mi": "Dó♯ menor",
  "Fá": "Ré menor", "Si♭": "Sol menor", "Mi♭": "Dó menor", "Lá♭": "Fá menor", "Ré♭": "Si♭ menor",
};

const media = h => {
  const m = /^(\d+)-(\d+)$/.exec(h.met || "");
  return m ? (Number(m[1]) + Number(m[2])) / 2 : null;
};

/* espalha a escolha pelo hinário inteiro, em vez de pegar sempre os primeiros */
function espalhar(lista, quantos) {
  if (lista.length <= quantos) return lista;
  const passo = lista.length / quantos;
  return Array.from({ length: quantos }, (_, i) => lista[Math.floor(i * passo)]);
}

const temTom = (...tons) => H => H.filter(h => tons.includes(h.tom));
const temMarc = m => H => H.filter(h => h.marc === m);

/* Chave: "<período>-<aula>". */
const REGRAS = {
  "1-7": {
    porque: "hinos cuja marcação impressa é em 4 — o compasso quaternário que a aula estudou",
    escolher: temMarc("em 4"),
    perguntas: h => [
      [`No hino ${h.n}, confira a fórmula de compasso no hinário e diga qual é a unidade de tempo.`,
       "Em 4/4 a unidade de tempo é a semínima e a unidade de compasso é a semibreve."],
      [`Marque a acentuação métrica dos quatro tempos do hino ${h.n}.`,
       "1º forte · 2º fraco · 3º meio-forte · 4º fraco."],
    ],
  },
  "1-14": {
    porque: "um hino lento e um rápido, para comparar a marcação de metrônomo",
    escolher: H => {
      const com = H.filter(h => media(h)).sort((a, b) => media(a) - media(b));
      return [com[0], com[com.length - 1]];
    },
    perguntas: h => [
      [`O hino ${h.n} traz a marcação ${h.met}. O que esses números indicam?`,
       `Que se executam de ${h.met.split("-")[0]} a ${h.met.split("-")[1]} unidades de tempo por minuto. É a faixa de andamento escrita na partitura.`],
      [`Ponha o metrônomo no valor mais baixo da marcação do hino ${h.n} e toque o primeiro sistema.`,
       "Avaliar se a nota cai junto com o clique, e não logo antes ou logo depois."],
    ],
  },
  "2-2": {
    porque: "hinos marcados em 3 — o compasso ternário da aula",
    escolher: temMarc("em 3"),
    perguntas: h => [
      [`Marque os três movimentos de solfejo enquanto lê o primeiro sistema do hino ${h.n}.`,
       "Ponto 1 abaixo, ponto 2 para fora, ponto 3 acima; o terceiro movimento volta ao ponto 1."],
      [`No hino ${h.n}, qual a unidade de compasso?`,
       "Em 3/4, a mínima pontuada."],
    ],
  },
  "2-6": {
    porque: "hinos marcados em 2, o compasso binário",
    escolher: temMarc("em 2"),
    perguntas: h => [
      [`Leia o ritmo do primeiro sistema do hino ${h.n} marcando os dois movimentos.`,
       "Avaliar se o 1º movimento continuou sendo o mais marcado."],
      [`Compare a acentuação do hino ${h.n} com a de um hino em 3: o que muda na sensação?`,
       "Em 2 o ciclo forte–fraco é curto e marcial; em 3 há dois tempos fracos depois do forte."],
    ],
  },
  "2-13": {
    porque: "hinos marcados em 6 — compasso composto, três pulsos em cada tempo",
    escolher: temMarc("em 6"),
    perguntas: h => [
      [`No hino ${h.n}, quantos tempos há no compasso e em quantos pulsos cada um se divide?`,
       "Dois tempos, cada um com três pulsos — por isso a unidade de tempo é a semínima pontuada."],
      [`Marque os seis pontos do hino ${h.n}: onde cai o movimento mais amplo?`,
       "Entre o 3º e o 4º ponto — é ele que separa os dois tempos."],
    ],
  },
  "3-1": {
    porque: "um hino sem nenhum acidente na armadura e um com cinco, para ver a diferença de imediato",
    escolher: H => [H.find(h => h.tom === "Dó"), H.find(h => h.tom === "Ré♭")].filter(Boolean),
    perguntas: h => [
      [`Quantos acidentes tem a armadura do hino ${h.n}, e quais são?`,
       `${h.tom} maior: ${ARMADURA[h.tom]}.`],
    ],
  },
  "3-3": {
    porque: "hinos em tonalidades de sustenidos, uma armadura de cada",
    escolher: H => ["Sol", "Ré", "Lá", "Mi"].map(t => H.find(h => h.tom === t)).filter(Boolean),
    perguntas: h => [
      [`O hino ${h.n} está em ${h.tom} maior. Quais sustenidos há na armadura, em ordem?`,
       `${ARMADURA[h.tom]}.`],
      [`Toque a escala de ${h.tom} maior antes de tocar o hino ${h.n}.`,
       "Conferir a afinação dos sustenidos — são eles que costumam ficar baixos."],
    ],
  },
  "3-4": {
    porque: "hinos em tonalidades de bemóis, uma armadura de cada",
    escolher: H => ["Fá", "Si♭", "Mi♭", "Lá♭", "Ré♭"].map(t => H.find(h => h.tom === t)).filter(Boolean),
    perguntas: h => [
      [`O hino ${h.n} está em ${h.tom} maior. Quais bemóis há na armadura, em ordem?`,
       `${ARMADURA[h.tom]}.`],
      [`Pela regra do penúltimo bemol, confira: a armadura do hino ${h.n} leva a que tonalidade?`,
       `A ${h.tom} maior. ${h.tom === "Fá" ? "Com um bemol só a regra não se aplica: é Fá maior, de cor." : "O penúltimo bemol da armadura é a tônica."}`],
    ],
  },
  "3-5": {
    porque: "quatro armaduras diferentes lado a lado, para treinar o reconhecimento",
    escolher: H => espalhar(["Dó", "Sol", "Si♭", "Lá♭"].map(t => H.find(h => h.tom === t)).filter(Boolean), 4),
    perguntas: h => [
      [`Sem contar nota por nota: que tonalidade indica a armadura do hino ${h.n}?`,
       `${h.tom} maior — ${ARMADURA[h.tom]}.`],
    ],
  },
  "3-6": {
    porque: "os hinos do hinário marcados em 9",
    escolher: temMarc("em 9"),
    perguntas: h => [
      [`No hino ${h.n}, quantos tempos há no compasso e qual a unidade de tempo?`,
       "Três tempos; unidade de tempo semínima pontuada. A unidade de compasso é indefinida: nove colcheias não formam uma figura única."],
    ],
  },
  "3-12": {
    porque: "tonalidades distantes entre si, para exercitar tônica e relativa menor",
    escolher: H => espalhar(["Ré", "Fá", "Mi♭", "Ré♭"].map(t => H.find(h => h.tom === t)).filter(Boolean), 4),
    perguntas: h => [
      [`Qual a tonalidade do hino ${h.n} e qual a sua relativa menor?`,
       `${h.tom} maior; relativa menor, ${RELATIVA[h.tom]}.`],
      [`No hino ${h.n}, tonalidade escrita e tonalidade de execução são a mesma no seu instrumento?`,
       "No violino, na flauta e no violoncelo, sim. No clarinete em Si♭, no sax alto em Mi♭ e no trompete em Si♭, não."],
    ],
  },
  "4-11": {
    porque: "o hino mais lento e o mais rápido do hinário, pela marcação impressa",
    escolher: H => {
      const com = H.filter(h => media(h)).sort((a, b) => media(a) - media(b));
      return [com[0], com[com.length - 1]];
    },
    perguntas: h => [
      [`O hino ${h.n} está marcado ${h.met}. Classifique o andamento em lento, moderado ou rápido.`,
       `${media(h) < 70 ? "Lento" : media(h) < 100 ? "Moderado" : "Rápido"} — média em torno de ${Math.round(media(h))}.`],
    ],
  },
  /* As indicações interpretativas são seis — Solene, Majestoso, Com júbilo,
     Com veneração, Com submissão, Com humildade — e a extração do hinário ainda
     não as recolheu (a primeira versão do extrator procurava termos italianos,
     que não são indicação nenhuma). Enquanto h.ind estiver vazio esta regra
     devolve null e a aula fica sem hino de fecho automático; o caderno do GEM,
     nessa aula, manda mesmo o instrutor escolher. */
  "4-14": {
    porque: "hinos que trazem indicação interpretativa impressa",
    escolher: H => espalhar(H.filter(h => h.ind), 3),
    perguntas: h => [
      [`O hino ${h.n} traz a indicação “${h.ind}”. O que muda na sua execução?`,
       "Resposta aberta. Espera-se que o candidato cite ataque, intensidade e condução da frase — não apenas o sentimento."],
    ],
  },
};

/* Listas oficiais do GEM para uma aula, com os dados do hino anexados. */
function listasOficiais(periodo, aula, HINOS) {
  const porNumero = new Map(HINOS.map(h => [h.n, h]));
  return (LISTAS || [])
    .filter(l => l.p === periodo && l.a.includes(aula) && l.hinos.length)
    .map(l => ({
      ...l,
      hinos: l.hinos.map(n => porNumero.get(n) || { n }),
      comp1: new Set(l.comp1 || []),
    }));
}

function hinosDaAula(periodo, aula, HINOS, quantos = 3) {
  const oficiais = listasOficiais(periodo, aula, HINOS);
  const comp = oficiais.find(l => l.tipo === "complementar") || oficiais[0];
  if (comp) {
    return {
      fonte: "oficial",
      porque: `lista do próprio GEM para esta aula — ${comp.rot.toLowerCase()}`,
      // para a ficha (tom, marcação, metrônomo) sair preenchida, prefere-se
      // os hinos que a extração do hinário reconheceu; os demais aparecem
      // na lista completa acima, só sem ficha.
      hinos: espalhar(comp.hinos.filter(h => h.tom).length ? comp.hinos.filter(h => h.tom) : comp.hinos, quantos),
      nota: comp.nota,
      comp1: comp.comp1,
      todas: oficiais,
      perguntas: h => [
        [`O hino ${h.n} está na lista do GEM para esta aula. Localize nele o que a aula estudou e mostre onde está.`,
         "Conforme o hino. Exigir que o candidato aponte o compasso, e não apenas diga que “tem”."],
      ],
    };
  }
  const regra = REGRAS[`${periodo}-${aula}`];
  if (!regra) return null;
  const achados = espalhar((regra.escolher(HINOS) || []).filter(Boolean), quantos);
  if (!achados.length) return null;
  return { fonte: "regra", porque: regra.porque, hinos: achados, perguntas: regra.perguntas };
}

if (typeof module !== "undefined") module.exports = { hinosDaAula, listasOficiais, ARMADURA };
