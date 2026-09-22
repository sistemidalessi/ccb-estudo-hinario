/* ---------------- currículo MSA ---------------- */
const FASES = [
 {f:1,p:1,nome:"Música, som, notas, pentagrama e claves",tops:[["1.1–1.3","Música. Som. Elementos e propriedades"],["1.4","Notas musicais"],["1.5","Pentagrama"],["1.6","Claves"]]},
 {f:2,p:1,nome:"Figuras, compasso e fórmula em 4",tops:[["2.1","Figuras musicais"],["2.2–2.3","Compasso. Barras de compasso"],["2.4","Fórmula de compasso em 4"],["2.5–2.6","Ritmo. Pulsação. Exercícios rítmicos"]]},
 {f:3,p:1,nome:"Endecagrama, leitura e condução",tops:[["3.1","Endecagrama"],["3.2","Leitura rítmica, métrica e solfejo"],["3.3–3.4","Movimentos de condução e de solfejo em 4"],["3.5","Metrônomo"]]},
 {f:4,p:2,nome:"Ligadura, ponto, intervalo, fórmulas em 3 e 2",tops:[["4.1","Ligadura"],["4.2","Ponto de aumento"],["4.3","Intervalo"],["4.4–4.5","Fórmula e solfejo em 3"],["4.6–4.7","Fórmula e solfejo em 2"]]},
 {f:5,p:2,nome:"Tercinas, fermata e fórmula em 6",tops:[["5.1","Tercinas"],["5.2","Fermata"],["5.3–5.5","Fórmula e solfejo em 6"]]},
 {f:6,p:3,nome:"Tom, semitom, acidentes e escalas",tops:[["6.1","Tom e semitom"],["6.2","Acidentes — sustenido e bemol"],["6.3–6.4","Escalas. Escalas diatônicas"],["6.5–6.7","Escalas maiores com sustenidos e bemóis"]]},
 {f:7,p:3,nome:"Armadura de clave e fórmulas em 9 e 12",tops:[["7.1","Armadura de clave"],["7.2–7.4","Fórmula e solfejo em 9"],["7.5–7.7","Fórmula e solfejo em 12"]]},
 {f:8,p:3,nome:"Tonalidade e acidentes ocorrentes",tops:[["8.1","Tonalidade"],["8.2","Acidentes ocorrentes e de precaução"]]},
 {f:9,p:3,nome:"Barras de repetição",tops:[["9.1","Barra de compasso — repetição"]]},
 {f:10,p:4,nome:"Dinâmica",tops:[["10.1","Dinâmica"]]},
 {f:11,p:4,nome:"Acento métrico e tipos de compasso",tops:[["11.1","Acento métrico"],["11.2–11.3","Compasso simples e composto"],["11.4","Compassos alternados"]]},
 {f:12,p:4,nome:"Síncopa e contratempo",tops:[["12.1–12.2","Síncopa. Contratempo"]]},
 {f:13,p:4,nome:"Ritmos iniciais",tops:[["13.1","Tético, anacrúsico e acéfalo"]]},
 {f:14,p:4,nome:"Notas pontuadas",tops:[["14.1","Notas pontuadas e subdivisão"]]},
 {f:15,p:4,nome:"Andamento",tops:[["15.1","Andamento"],["15.2","Poco rallentando"],["15.3","Modificação indevida de andamento"]]},
 {f:16,p:4,nome:"Frases e interpretação",tops:[["16.1","Frases e semifrases"],["16.2","Interpretação musical"],["16.3","Indicações interpretativas"]]}
];
const TIPOS = {
  ver:      {rot:"Identificar", canal:"papel",   desc:"nomear o que está escrito"},
  entender: {rot:"Explicar",    canal:"papel",   desc:"por que é assim"},
  erro:     {rot:"Achar o erro",canal:"papel",   desc:"corrigir o que está errado"},
  comparar: {rot:"Comparar",    canal:"papel",   desc:"dois hinos lado a lado"},
  criar:    {rot:"Produzir",    canal:"papel",   desc:"escrever ou marcar algo novo"},
  tocar:    {rot:"Tocar",       canal:"pratica", desc:"com o instrumento na mão"},
  ouvir:    {rot:"Ouvir",       canal:"pratica", desc:"o instrutor toca, o aluno responde"},
  decidir:  {rot:"Decidir",     canal:"pratica", desc:"situação real de ensaio"}
};
