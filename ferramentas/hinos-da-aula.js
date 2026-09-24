/* Escolhe, para cada aula do MSA, os hinos que servem de fecho — aqueles em que
   o conceito da aula aparece. Os hinos saem fora da ordem do hinário de
   propósito: quem manda é a teoria.

   Ordem de prioridade, e ela importa:
   1. a lista oficial do GEM para aquela aula (dados/hinos-por-aula.js), quando
      existe. O caderno de atividades já traz os hinos na ordem de complexidade
      do MSA — nada aqui substitui isso;
   2. as regras abaixo, que escolhem hinos pelos dados do hinário: tom,
      marcação e metrônomo, do cabeçalho; fórmula de compasso, ritmo inicial
      e sinais, lidos da partitura. Elas existem para as aulas em que o próprio caderno
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

/* ---- fórmula de compasso (campo fc, lido da partitura) ----
   "C" é o C de 4/4 e "C cortado" o de 2/2: para a conta valem como números. */
const formula = f => f === "C" ? "4/4" : f === "C cortado" ? "2/2" : f;
/* só hinos de uma fórmula só: para a aula de um compasso, o hino que muda no
   meio atrapalha mais do que ajuda (ele tem aula própria, a de compassos
   alternados) */
const umaFormula = h => (h.fc && h.fc.length === 1) ? formula(h.fc[0]) : null;
const temFormula = (...fs) => H => H.filter(h => fs.includes(umaFormula(h)));
const COMPOSTOS = ["6/8", "9/8", "12/8", "6/4", "9/4"];
const composto = f => COMPOSTOS.includes(f);
/* como a fórmula aparece impressa, para a ficha e as perguntas */
const fcTexto = h => (h.fc || []).map(f => f === "C" ? "C (4/4)" : f === "C cortado" ? "C cortado (2/2)" : f).join(" → ");

/* [unidade de tempo, unidade de compasso] de cada fórmula do hinário */
const UNIDADES = {
  "2/4": ["semínima", "mínima"], "3/4": ["semínima", "mínima pontuada"],
  "4/4": ["semínima", "semibreve"], "2/2": ["mínima", "semibreve"],
  "3/2": ["mínima", "semibreve pontuada"],
  "6/8": ["semínima pontuada", "mínima pontuada"],
  "9/8": ["semínima pontuada", "indefinida — nove colcheias não formam uma figura única"],
  "12/8": ["semínima pontuada", "semibreve pontuada"],
  "6/4": ["mínima pontuada", "semibreve pontuada"],
  "9/4": ["mínima pontuada", "indefinida — nove semínimas não formam uma figura única"],
};
const tempos = f => { const [a] = f.split("/").map(Number); return composto(f) ? a / 3 : a; };

/* Quanto vale cada figura pontuada, em tempos, conforme o compasso. */
function valoresPontuados(f) {
  const den = Number(f.split("/")[1]);
  if (!composto(f)) {
    return den === 4
      ? "semínima pontuada, um tempo e meio; colcheia pontuada, três quartos de tempo; mínima pontuada, três tempos"
      : "mínima pontuada, um tempo e meio; semínima pontuada, três quartos de tempo";
  }
  return den === 8
    ? "semínima pontuada, um tempo inteiro (é a unidade de tempo); colcheia pontuada, meio tempo — um pulso e meio; mínima pontuada, dois tempos"
    : "mínima pontuada, um tempo inteiro (é a unidade de tempo); semínima pontuada, meio tempo; semibreve pontuada, dois tempos";
}

/* Pergunta de violino sobre a arcada da primeira nota (campo arc). O hinário
   marca a arcada no começo de todo hino; a regra de fundo é chegar ao tempo
   forte com arco para baixo. O gabarito diz o que está impresso e explica —
   sem inventar a distribuição das notas da anacruse, que o hinário mostra. */
const SINAL_ARCO = { baixo: "arco para baixo (⊓)", cima: "arco para cima (V)" };
function perguntaArco(h) {
  if (!h.arc) return [];
  const imp = SINAL_ARCO[h.arc];
  let porque;
  if (h.ri === "tético") {
    porque = h.arc === "baixo"
      ? "O hino começa no tempo forte, e o tempo forte pede arco para baixo — o de mais peso."
      : "É exceção: o hino começa no tempo forte, mas a arcada pede arco para cima. Conferir no hinário o motivo (ligadura, repetição da frase).";
  } else if (h.ri === "anacrúsico") {
    porque = h.arc === "cima"
      ? "A anacruse vem antes do tempo forte: começando para cima, o arco chega ao 1º tempo descendo."
      : "Mesmo sendo anacruse, começa para baixo: a anacruse tem mais de uma nota, ou ocupa um tempo inteiro, e a arcada se organiza para o arco chegar ao tempo forte descendo. Mostrar no hinário como as notas da anacruse se distribuem.";
  } else {
    porque = "No acéfalo o tempo forte fica em silêncio; a arcada impressa é a que o hinário indica para a entrada logo depois dele.";
  }
  return [[`Violino: com que arco começa o hino ${h.n}, segundo a arcada impressa? Por que esse arco?`,
           `Com ${imp}. ${porque}`]];
}

/* O ritmo inicial foi lido da partitura por medida e pelo selo de regência:
   é o dado menos certo da tabela, e o instrutor precisa saber disso. */
const CONFERIR_RITMO = "O ritmo inicial destes hinos foi lido da partitura pela largura do primeiro compasso e pela indicação de regência impressa na margem; os casos duvidosos foram olhados um a um. Mesmo assim, conferir no hinário antes de usar em avaliação.";

/* Chave: "<período>-<aula>". */
const REGRAS = {
  "1-7": {
    porque: "hinos em 4/4 do começo ao fim — o compasso quaternário que a aula estudou",
    escolher: temFormula("4/4"),
    perguntas: h => [
      [`O hino ${h.n} está em ${fcTexto(h)}. Qual é a unidade de tempo e qual a unidade de compasso?`,
       "Em 4/4 a unidade de tempo é a semínima e a unidade de compasso é a semibreve." +
       (h.fc[0] === "C" ? " O C no lugar dos números quer dizer o mesmo 4/4." : "")],
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
    porque: "hinos em 3/4 — o compasso ternário da aula",
    escolher: temFormula("3/4"),
    perguntas: h => [
      [`Marque os três movimentos de solfejo enquanto lê o primeiro sistema do hino ${h.n}.`,
       "Ponto 1 abaixo, ponto 2 para fora, ponto 3 acima; o terceiro movimento volta ao ponto 1."],
      [`No hino ${h.n}, qual a unidade de compasso?`,
       "Em 3/4, a mínima pontuada."],
    ],
  },
  "2-6": {
    porque: "hinos em 2/4 e 2/2, o compasso binário",
    escolher: temFormula("2/4", "2/2"),
    perguntas: h => [
      [`Leia o ritmo do primeiro sistema do hino ${h.n} marcando os dois movimentos.`,
       "Avaliar se o 1º movimento continuou sendo o mais marcado."],
      [`Compare a acentuação do hino ${h.n} com a de um hino em 3: o que muda na sensação?`,
       "Em 2 o ciclo forte–fraco é curto e marcial; em 3 há dois tempos fracos depois do forte."],
    ],
  },
  "2-13": {
    porque: "hinos em 6/8 — compasso composto, três pulsos em cada tempo",
    escolher: temFormula("6/8"),
    perguntas: h => [
      [`No hino ${h.n}, em 6/8, quantos tempos há no compasso e em quantos pulsos cada um se divide?`,
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
    porque: "hinos em 9/8 e 9/4",
    escolher: temFormula("9/8", "9/4"),
    perguntas: h => [
      [`O hino ${h.n} está em ${fcTexto(h)}. Quantos tempos há no compasso e qual a unidade de tempo?`,
       `Três tempos; unidade de tempo ${UNIDADES[umaFormula(h)][0]}. A unidade de compasso é ${UNIDADES[umaFormula(h)][1]}.`],
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
  "4-2": {
    porque: "um hino em compasso simples ao lado de um em composto, os dois com dois tempos",
    ordenado: true,
    escolher: H => [
      espalhar(temFormula("2/4")(H), 1)[0], espalhar(temFormula("6/8")(H), 1)[0],
    ].filter(Boolean),
    perguntas: h => {
      const f = umaFormula(h);
      return [
        [`O hino ${h.n} está em ${fcTexto(h)}. O compasso é simples ou composto? Por quê?`,
         composto(f)
           ? `Composto: o número de cima é ${f.split("/")[0]}, cada tempo se divide em três pulsos e a unidade de tempo é figura pontuada (${UNIDADES[f][0]}).`
           : `Simples: cada tempo se divide em dois e a unidade de tempo é figura simples (${UNIDADES[f][0]}).`],
        [`Quantos tempos tem o compasso do hino ${h.n}?`,
         `${tempos(f)} tempos${composto(f) ? `, cada um com três pulsos — ${f.split("/")[0]} pulsos ao todo` : ""}.`],
      ];
    },
  },
  "4-6": {
    porque: "dois hinos anacrúsicos e um tético, para comparar onde cada um começa",
    conferir: CONFERIR_RITMO,
    ordenado: true,
    escolher: H => {
      const ana = espalhar(H.filter(h => h.ri === "anacrúsico" && umaFormula(h) && !composto(umaFormula(h))), 2);
      const tet = espalhar(H.filter(h => h.ri === "tético" && umaFormula(h) && !composto(umaFormula(h))), 1);
      return [ana[0], tet[0], ana[1]].filter(Boolean);
    },
    perguntas: h => [
      [`O hino ${h.n} (${fcTexto(h)}) começa em que parte do compasso? Classifique o ritmo inicial.`,
       h.ri === "tético"
         ? "Tético: a primeira nota cai no 1º tempo, e o primeiro compasso está completo."
         : "Anacrúsico: as notas iniciais vêm antes do 1º tempo — o primeiro compasso é incompleto."],
      [`Toque os dois primeiros compassos do hino ${h.n} marcando os tempos. Em que tempo você entrou?`,
       h.ri === "tético" ? "No 1º tempo." : "Num tempo fraco, antes do 1º tempo do primeiro compasso completo. Conferir no hinário em qual."],
      ...perguntaArco(h),
    ],
  },
  "4-7": {
    porque: "os dois acéfalos do hinário, ao lado de um anacrúsico",
    conferir: CONFERIR_RITMO + " Os dois acéfalos são os únicos hinos do hinário com a indicação de regência “súbito ativo”.",
    ordenado: true,
    escolher: H => [...H.filter(h => h.ri === "acéfalo"),
      espalhar(H.filter(h => h.ri === "anacrúsico" && umaFormula(h) === "3/4"), 1)[0]].filter(Boolean),
    perguntas: h => [
      [`Classifique o ritmo inicial do hino ${h.n} (${fcTexto(h)}).`,
       h.ri === "acéfalo"
         ? "Acéfalo: o 1º tempo do primeiro compasso fica em silêncio, e a pausa não vem escrita — é subentendida. É um dos dois únicos do hinário."
         : "Anacrúsico: as notas iniciais vêm antes do 1º tempo."],
      [`Entre no hino ${h.n} sem que ninguém conte antes. O que é preciso sentir para acertar a entrada?`,
       h.ri === "acéfalo"
         ? "O 1º tempo, que não soa: a entrada vem logo depois dele. Quem não sente o tempo forte em silêncio entra adiantado."
         : "O tempo em que a anacruse começa, para que a primeira nota do compasso completo caia no tempo forte."],
      ...perguntaArco(h),
    ],
  },
  "4-8": {
    porque: "hinos em compasso simples com notas pontuadas",
    escolher: H => H.filter(h => (h.s || []).includes("pontuada") && umaFormula(h) && !composto(umaFormula(h))),
    perguntas: h => [
      [`Localize uma nota pontuada no hino ${h.n} (${fcTexto(h)}) e diga quantos tempos ela vale.`,
       `Conforme a figura. Em ${umaFormula(h)}: ${valoresPontuados(umaFormula(h))}.`],
    ],
  },
  "4-9": {
    porque: "hinos em compasso composto — 6/8, 9/8 e 12/8 — com notas pontuadas",
    escolher: H => H.filter(h => (h.s || []).includes("pontuada") && ["6/8", "9/8", "12/8"].includes(umaFormula(h))),
    perguntas: h => [
      [`Localize uma nota pontuada no hino ${h.n} (${fcTexto(h)}) e diga quantos tempos ela vale.`,
       `Conforme a figura. Em ${umaFormula(h)}: ${valoresPontuados(umaFormula(h))}.`],
      [`Leia o primeiro sistema do hino ${h.n} com o metrônomo marcando os pulsos, e não os tempos.`,
       "Avaliar se as figuras pontuadas ocupam exatamente os pulsos que valem, sem encurtar a figura seguinte."],
    ],
  },
  "4-10": {
    porque: "a mesma figura pontuada num hino de compasso simples e num de composto",
    ordenado: true,
    escolher: H => {
      const p = H.filter(h => (h.s || []).includes("pontuada"));
      return [espalhar(p.filter(h => umaFormula(h) === "4/4"), 1)[0],
              espalhar(p.filter(h => umaFormula(h) === "6/8"), 1)[0]].filter(Boolean);
    },
    perguntas: h => [
      [`No hino ${h.n} (${fcTexto(h)}), quanto vale uma colcheia pontuada, e quanto vale uma semínima pontuada?`,
       umaFormula(h) === "6/8"
         ? "Em 6/8: colcheia pontuada, meio tempo (um pulso e meio); semínima pontuada, um tempo inteiro — é a unidade de tempo."
         : "Em 4/4: colcheia pontuada, três quartos de tempo; semínima pontuada, um tempo e meio."],
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
     Com veneração, Com submissão, Com humildade. No hinário, onze hinos trazem
     uma delas impressa — cinco Solene, quatro Majestoso, um Com júbilo e um
     Com veneração. Se h.ind estiver vazio em todos, a regra
     devolve lista vazia e a aula fica sem hino de fecho automático — o caderno
     do GEM, nessa aula, manda mesmo o instrutor escolher. */
  "4-14": {
    porque: "hinos que trazem indicação interpretativa impressa",
    // A ordem devolvida aqui é a de prioridade, não a do hinário: quem escolhe
    // não deve espalhá-la, senão volta a cair em duas indicações iguais.
    ordenado: true,
    // Prefere variedade: um hino de cada indicação antes de repetir. Três
    // "Majestoso" seguidos ensinam menos que um Majestoso ao lado de um Solene.
    escolher: H => {
      const com = H.filter(h => h.ind);
      const vistas = new Set(), primeiros = [], resto = [];
      com.forEach(h => (vistas.has(h.ind) ? resto : (vistas.add(h.ind), primeiros)).push(h));
      return [...primeiros, ...resto];
    },
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
  const candidatos = (regra.escolher(HINOS) || []).filter(Boolean);
  /* Espalhar serve para varrer o hinário inteiro quando a regra devolve os
     hinos na ordem do número. Se a regra já ordenou por prioridade, espalhar
     desfaz o trabalho dela — aí vão os primeiros. */
  const achados = regra.ordenado ? candidatos.slice(0, quantos)
                                 : espalhar(candidatos, quantos);
  if (!achados.length) return null;
  return { fonte: "regra", porque: regra.porque, hinos: achados, perguntas: regra.perguntas,
           conferir: regra.conferir };
}

if (typeof module !== "undefined") module.exports = { hinosDaAula, listasOficiais, ARMADURA, fcTexto };
