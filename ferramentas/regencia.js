/* Observações de regência para cada hino da análise — caderno do instrutor.

   O texto de cada módulo do curso está em dados/regencia.js; aqui saem as
   observações de cada hino, dos dados de dados/hinos.js (fórmula, marcação
   impressa, metrônomo, ritmo inicial, sinais, indicação) e da tabela ENTRADA
   abaixo.

   ENTRADA: em que tempo entra cada hino anacrúsico ou acéfalo da análise, e
   qual é o gesto de preparação. Lido no olho, na partitura recortada, em
   24/09/2026 — o ritmo inicial de dados/hinos.js diz só "anacrúsico", e a
   preparação depende de quanto falta ao primeiro compasso. Se a lista de
   hinos da análise mudar, o verificar.js acusa o hino que ficou sem entrada. */
const path = require("path");
const { formula, composto, media, LISTAS } = require("./hinos-da-aula.js");
const { REGENCIA } = require(path.join(__dirname, "..", "dados", "regencia.js"));

const ENTRADA = {
  446: ["no 4º tempo, com colcheia pontuada e semicolcheia", "o gesto do 3 (fora)"],
  432: ["no 4º tempo, com uma semínima", "o gesto do 3 (fora)"],
  330: ["no 4º tempo, com colcheia pontuada e semicolcheia", "o gesto do 3 (fora)"],
  95: ["no 4º tempo, com colcheia pontuada e semicolcheia", "o gesto do 3 (fora)"],
  384: ["no 4º tempo, com duas colcheias", "o gesto do 3 (fora)"],
  380: ["no 4º tempo, com duas colcheias", "o gesto do 3 (fora)"],
  170: ["no 3º tempo — as três colcheias do último grupo", "o gesto do 2 (fora)"],
  464: ["no 3º tempo, com duas colcheias", "o gesto do 2 (fora)"],
  431: ["no 4º tempo, com duas colcheias", "o gesto do 3 (fora)"],
  466: ["no 3º tempo, com colcheia pontuada e semicolcheia", "o gesto do 2 (fora)"],
  469: ["no 4º tempo, com colcheia pontuada e semicolcheia", "o gesto do 3 (fora)"],
  438: ["na 6ª colcheia, o último terço do 2º tempo", "o próprio 2º tempo (acima): o grupo entra no fim dele (anacruse de fração, módulo 13)"],
  444: ["no 3º tempo, com duas colcheias", "o gesto do 2 (fora)"],
  313: ["na 6ª colcheia", "em 6, o gesto do 5 (fora no desenho de conjunto; no do MSA, o 2º pulso do grupo de cima); em 2, o próprio 2º tempo, com o grupo entrando no fim dele"],
  425: ["na 7ª colcheia, com três colcheias — o 3º tempo inteiro", "o 6º pulso, o último do grupo de fora"],
  54: ["no 4º tempo, com colcheia pontuada e semicolcheia", "o gesto do 3 (fora)"],
  296: ["no 3º tempo, com uma semínima", "o gesto do 2 (fora)"],
  274: ["na segunda metade do 2º tempo, com três colcheias", "o próprio 2º tempo (fora): o grupo entra na metade dele; se precisar de apoio, dê antes o 1, pequeno"],
  410: ["na segunda metade do 2º tempo (o tempo é a mínima), com uma semínima", "o próprio 2º tempo (acima): o grupo entra na metade dele; neste andamento, pode-se subdividir a preparação"],
  305: ["no 4º tempo, com uma semínima", "o gesto do 3 (fora)"],
  367: ["no 3º tempo, com colcheia pontuada e semicolcheia", "o gesto do 2 (fora)"],
  377: ["depois da pausa de colcheia do 1º tempo", "o gesto do 2 (acima); depois, o 1 seco e firme — é ele que ataca a pausa, e o grupo entra logo depois"],
};

const listaGEM = rot => new Set((LISTAS || []).filter(l => l.rot === rot).flatMap(l => l.hinos));
const SINCOPA = listaGEM("Síncopa"), CONTRATEMPO = listaGEM("Contratempo");

const NOME_DO_ULTIMO = { 2: "o 2 (acima)", 3: "o 3 (acima)", 4: "o 4 (acima)", 6: "o 6 (acima)", 9: "o 9º pulso (acima)", 12: "o 12º pulso (acima)" };

/* Duração das figuras, em semínimas. */
const FIG = { 2: "mínima", 4: "semínima", 8: "colcheia" };
const dur = fig => ({ "mínima": 2, "semínima": 1, "colcheia": 0.5 }[fig.replace(" pontuada", "")] || 1) * (/pontuada/.test(fig) ? 1.5 : 1);
const PADRAO = {
  2: "1 abaixo, 2 acima", 3: "1 abaixo, 2 fora, 3 acima", 4: "1 abaixo, 2 dentro, 3 fora, 4 acima",
  6: "use o desenho de 6 que a orquestra da sua região usa (módulo 5)",
  9: "o desenho do 3 com três pulsos em cada direção, o primeiro de cada grupo maior (módulo 7)",
  12: "o desenho do 4 com três pulsos em cada direção, o primeiro de cada grupo maior (módulo 7)",
};

/* Casos em que a marcação impressa não é o número de gestos. Olhados na
   partitura em 24/09/2026 — conferir com o Anderson. */
const MARCACAO_DE_FRASE = {
  32: "O cabeçalho traz \"em 4\" e, logo abaixo, \"Reger frase em 4\": é agrupamento de frases, não o desenho — quatro gestos por compasso de 2/4, com a semínima entre 52 e 72, dariam colcheias a mais de 100 por minuto. Rege-se em 2, sentindo a frase de quatro compassos.",
};

/* Em quanto se rege: { n (gestos por compasso, ou null se fica à escolha),
   gesto (figura de cada gesto), texto }. */
function desenho(h) {
  const fs = (h.fc || []).map(formula);
  const f = fs[0] || "4/4";
  const [num, den] = f.split("/").map(Number);
  const comp = composto(f);
  const pulso = FIG[den] || "semínima";
  const tempo = comp ? (den === 4 ? "mínima pontuada" : "semínima pontuada") : pulso;
  const imp = h.marc ? " (marcado no hinário)" : "";
  if (MARCACAO_DE_FRASE[h.n]) return { n: comp ? num / 3 : num, gesto: tempo, texto: MARCACAO_DE_FRASE[h.n] };
  if (fs.length > 1) {
    const [a, b] = fs.map(x => Number(x.split("/")[0]));
    return { n: a, gesto: tempo, texto: `Começa em ${a} (${PADRAO[a]}) e passa a ${b} onde a fórmula muda (${fs.join(" → ")}). O 1º tempo do compasso novo é o que precisa estar claro: prepare-o com o último tempo do desenho antigo e olhe para o grupo na passagem (módulo 11).` };
  }
  const marc = h.marc ? Number(h.marc.replace(/\D/g, "")) : null;
  const tempos = comp ? num / 3 : num;
  if (comp && !marc) {
    const m = media(h);
    if (m && /colcheia/.test(h.mf || "") && den === 8) {
      return { n: null, gesto: null, texto: `Sem marcação impressa. Com a colcheia por volta de ${Math.round(m)}, em ${num} seriam ${Math.round(m)} gestos por minuto; em ${tempos}, uns ${Math.round(m / 3)}, com o rebote carregando as três colcheias. O hinário usa as duas maneiras nessa faixa: decida pelo caráter e pela segurança do grupo, e diga antes qual será (módulo 5).` };
    }
    return { n: tempos, gesto: tempo, texto: `Em ${tempos}: cada gesto uma ${tempo}, e o rebote carrega os três pulsos (${PADRAO[tempos]}). Nos trechos lentos, pode-se subdividir em ${num} (módulo 14).` };
  }
  const n = marc || num;
  let gesto = pulso;
  if (comp && n === tempos) gesto = tempo;
  else if (!comp && n === num / 2) gesto = FIG[den / 2] || pulso;
  else if (!comp && n === num * 2) gesto = FIG[den * 2] || pulso;
  let t = `Em ${n}${imp}: ${PADRAO[n] || ""}.`;
  if (comp && n === tempos) t = `Em ${n}${imp}: cada gesto uma ${gesto}, e o rebote redondo carrega os três pulsos (${PADRAO[n]}).`;
  else if (comp && n === num) t = `Em ${n}${imp}: um gesto por ${pulso} — ${PADRAO[n]}.`;
  else if (!comp && n !== num) t += ` O compasso é ${f}, mas o regente dá ${n} gestos por compasso, cada um uma ${gesto}${n < num ? " (módulo 11)" : ""}; o grupo continua contando ${num}.`;
  if ((h.fc || [])[0] === "C") t += " O sinal C é o 4/4.";
  if ((h.fc || [])[0] === "C cortado") t += " O C cortado é o 2/2: tempo de mínima.";
  else if (f === "2/2") t += " O tempo é a mínima.";
  return { n, gesto, texto: t };
}

function andamento(h, d) {
  const m = media(h);
  const car = h.ind ? ` O caráter indicado é "${h.ind.toLowerCase()}".` : "";
  if (!m) return `O hinário não traz metrônomo: escolha pelo caráter e pela letra, e confira antes quantos gestos por minuto vai dar.${car}`;
  const [a, b] = h.met.split("-");
  const fig = h.mf || "";
  let t = `Metrônomo impresso ${a}–${b}${fig ? ` (${fig})` : ""}: comece por volta de ${Math.round(m)}.`;
  if (fig && d.gesto && fig !== d.gesto) {
    const r = dur(fig) / dur(d.gesto);
    // só quando a conta fecha (a figura do metrônomo divide o gesto ou o
    // contém): um "semínima" num 6/8 em 2 é impressão a conferir, não conta
    const g = Math.round(m * r);
    if ([1 / 3, 1 / 2, 2, 3].some(x => Math.abs(r - x) < 1e-9))
      t += ` Regido com um gesto por ${d.gesto}, são uns ${g} gestos por minuto.`;
    else t += ` Atenção: o sinal traz ${fig}, e o gesto vale ${d.gesto} — confira no hinário como ler esse número.`;
  }
  // lento: menos de 56 semínimas por minuto, qualquer que seja o gesto
  if (!/Atenção/.test(t) && m * dur(fig || "semínima") < 56) t += " Andamento lento: subdivida onde o grupo se espalhar (módulo 14).";
  return t + car;
}

function entrada(h, d) {
  if (h.ri === "tético" || !h.ri) {
    const ult = d.n ? NOME_DO_ULTIMO[d.n] : "o último tempo (em 6, o 6; em 2, o 2)";
    return `Tético: entra no 1º tempo. Preparação: ${ult || "o último tempo do compasso"}, um tempo só, no andamento e com a respiração.`;
  }
  const e = ENTRADA[h.n];
  if (!e) return h.ri === "acéfalo"
    ? "Acéfalo: o 1º tempo é pausa. Prepare com o último tempo e dê o 1 seco e firme; o grupo entra logo depois (módulo 13)."
    : "Anacrúsico: conte na partitura quanto falta ao primeiro compasso. A preparação é o tempo anterior ao da entrada.";
  return h.ri === "acéfalo"
    ? `Acéfalo: entra ${e[0]}. Preparação: ${e[1]} (módulo 13).`
    : `Anacrúsico: entra ${e[0]}. Preparação: ${e[1]}. Os tempos vazios do começo não se marcam.`;
}

/* O laço do corte entre as estrofes sai para o lado do gesto de preparação
   da entrada: para fora quando a preparação é o tempo de fora (entrada no
   último tempo em 3 ou em 4); nos outros casos, para dentro e sobe. */
function voltaDaEstrofe(h) {
  const prep = (ENTRADA[h.n] || [])[1] || "";
  if (h.ri === "anacrúsico" && /^[^;:]*\(fora\)/.test(prep))
    return `O corte do fim da estrofe sai para fora: é o lado do gesto de preparação — ${prep.split(":")[0].split(";")[0]} —, e o laço vira a preparação da anacruse da estrofe seguinte.`;
  if (h.ri === "acéfalo")
    return "O corte do fim da estrofe sai para dentro e sobe, e vira o 2 da preparação; o 1 seco vem em seguida, como no começo.";
  if (h.ri === "anacrúsico")
    return `O corte do fim da estrofe sai para dentro e sobe, e o tempo da preparação — ${prep.split(":")[0].split(";")[0]} — cai dali.`;
  return "O corte do fim da estrofe sai para dentro e sobe; do alto, o 1 cai e a estrofe seguinte começa.";
}

/* As observações de um hino, na fase em que ele é regido. Cada item é
   [rótulo, texto]. O que depende de assunto ainda não visto no curso remete
   ao módulo em que ele é tratado. */
function dicasDoHino(h, fase) {
  const d = desenho(h), s = h.s || [];
  const out = [["Desenho", d.texto], ["Andamento", andamento(h, d)], ["Entrada", entrada(h, d)]];
  if (s.includes("fermata")) out.push(["Fermata", fase < 5
    ? "O hino tem fermata, assunto do módulo 5. Por ora: pare o gesto no ponto do tempo, com a mão viva, sem cair; se depois dela vem respiração ou pausa, retome com um corte pequeno que já é a preparação do tempo seguinte; se a música segue ligada, saia direto no tempo seguinte."
    : "Antes de reger, decida quanto dura cada fermata e se há corte depois dela — há corte quando vem respiração ou pausa; se a música segue ligada, sai-se direto no tempo seguinte."]);
  if (s.includes("tercina")) out.push(["Tercina", "O gesto não muda: a tercina cabe dentro do tempo. Se o grupo correr, firme o ictus do tempo seguinte."]);
  if (s.includes("ritornelo")) out.push(["Ritornelo", "Na barra de repetição não se corta: o último gesto antes dela leva de volta ao começo do trecho. Nas casas 1 e 2, olhe para o grupo na passagem."]);
  if (SINCOPA.has(h.n) || CONTRATEMPO.has(h.n))
    out.push([SINCOPA.has(h.n) ? "Síncopa" : "Contratempo", `O GEM lista este hino com ${SINCOPA.has(h.n) ? "síncopa" : "contratempo"}: no trecho, o gesto fica nítido e do mesmo tamanho — não se rege o som fora do tempo (módulo 12).`]);
  if (fase >= 9) out.push(["Entre as estrofes", voltaDaEstrofe(h)]);
  if (fase >= 10) out.push(["Dinâmica", "Marque antes, no hinário, onde a dinâmica impressa muda, e mostre cada mudança só com o tamanho do gesto."]);
  return out;
}

const modulo = f => REGENCIA[f];

module.exports = { dicasDoHino, desenho, modulo, REGENCIA, ENTRADA };
