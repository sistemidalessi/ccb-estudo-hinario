/* Hinos indicados pelo próprio GEM, aula por aula.
 *
 * Origem: os quatro cadernos "Planejamento do GEM — Atividades das Aulas do MSA
 * (para impressão)", 1º a 4º períodos. Ali, ao fim de várias aulas, há listas de
 * hinos para estudo — é a ordem de complexidade que o hinário não traz: os hinos
 * não aparecem na ordem do hinário, e sim na ordem em que o assunto é ensinado.
 *
 * Campos:
 *   p      período (1 a 4)
 *   a      aula ou aulas a que a lista pertence
 *   tipo   "complementar" — lista oficial de exercícios complementares
 *          "exercicio"    — hino executado dentro da própria aula
 *          "citado"       — hino usado como exemplo numa pergunta
 *          "selecionar"   — o caderno manda o INSTRUTOR escolher os hinos
 *   rot    o que a lista trabalha
 *   hinos  números dos hinos
 *   comp1  subconjunto marcado com (*): ler a partir do 1º compasso completo
 *   nota   observação do próprio caderno
 *   conf   "conferir" quando a leitura do PDF pode ter embaralhado a lista
 *
 * Só há aqui número de hino e o assunto da aula: nada da partitura.
 */
const HINOS_AULA = [

  /* ---------------- 1º período ---------------- */
  {p:1, a:[5], tipo:"exercicio", rot:"Figuras de som e de silêncio", hinos:[131,197,4,2],
   nota:"131 e 197 para identificar as figuras; 4 para dizer quais NÃO aparecem; 2 para contar as colcheias do soprano."},
  {p:1, a:[10], tipo:"citado", rot:"Linhas suplementares", hinos:[33]},
  {p:1, a:[11], tipo:"citado", rot:"Percepção: solfejo, leitura rítmica ou métrica", hinos:[343]},
  {p:1, a:[14], tipo:"exercicio", rot:"Metrônomo e pulsação", hinos:[387,131,160],
   nota:"387 a 115 bpm, de boca fechada ou em leitura rítmica com TÁ; 131 e 160 na velocidade média."},

  /* ---------------- 2º período ---------------- */
  {p:2, a:[1], tipo:"exercicio", rot:"Ligaduras de valor e de portamento", hinos:[175,171]},
  {p:2, a:[2], tipo:"exercicio", rot:"Fórmula de compasso em 3", hinos:[184,397,333]},
  {p:2, a:[3,4,5], tipo:"complementar", rot:"Fórmula de compasso em 4 e ponto de aumento",
   hinos:[64,123,144,373,96,271,131,160,235]},
  {p:2, a:[6], tipo:"exercicio", rot:"Fórmula de compasso em 2", hinos:[158,419],
   nota:"158 com metrônomo entre 60 e 72 bpm: leitura rítmica, leitura métrica e solfejo."},
  {p:2, a:[7,8,9], tipo:"complementar", rot:"Movimento de solfejo em 2", hinos:[224,266,53]},
  {p:2, a:[7,8,9], tipo:"complementar", rot:"Hinos a estudar ignorando as fermatas",
   hinos:[468,31,419,310,335,32,38],
   nota:"A fermata só é estudada no tópico 5.2 — por ora, passar por ela sem parar."},
  {p:2, a:[10], tipo:"exercicio", rot:"Tercinas", hinos:[12,182,462]},
  {p:2, a:[11], tipo:"complementar", rot:"Solfejo na voz principal do instrumento",
   hinos:[211,233,348,267,320,465,110,304,462,464,157,469],
   comp1:[211,233,348,320,465,110,462,464,157,469]},
  {p:2, a:[13], tipo:"exercicio", rot:"Fórmula de compasso em 6", hinos:[23,5]},
  {p:2, a:[13], tipo:"complementar", rot:"Compasso em 6, na velocidade mínima",
   hinos:[256,76,282,322,124,52,55,116,130,33,5]},
  {p:2, a:[14], tipo:"exercicio", rot:"Metrônomo e pulsação", hinos:[387,131,160]},

  /* ---------------- 3º período ---------------- */
  {p:3, a:[6], tipo:"exercicio", rot:"Fórmula de compasso em 9", hinos:[45]},
  {p:3, a:[6], tipo:"complementar", rot:"Compasso em 9",
   hinos:[293,177,287,399,418,193,425], comp1:[293,287,399,418,193,425]},
  {p:3, a:[7], tipo:"exercicio", rot:"Movimento alternativo para solfejo em 9", hinos:[44,415],
   nota:"415 é citado na pergunta sobre onde o movimento alternativo NÃO se aplica bem."},
  {p:3, a:[7], tipo:"complementar", rot:"Movimento alternativo em 9",
   hinos:[170,121,248,63,41,61,362,238], comp1:[170,121,248,63,41,61,362,238],
   nota:"O caderno manda ler todos a partir do 1º compasso completo."},
  {p:3, a:[8], tipo:"exercicio", rot:"Fórmula de compasso em 12", hinos:[15]},
  {p:3, a:[8], tipo:"complementar", rot:"Compasso em 12", hinos:[205]},
  {p:3, a:[9,10,11], tipo:"complementar", rot:"Compasso em 12 e movimento alternativo em 4",
   hinos:[215,459,42,105],
   nota:"Casas de ritornello só entram na fase 9 — por ora, ler apenas a seção \"Final\"."},
  {p:3, a:[9,10,11], tipo:"complementar", rot:"Diversas fórmulas de compasso",
   hinos:[28,175,176,388,401,51,100,71,73,94,324,403,54]},
  {p:3, a:[12], tipo:"citado", rot:"Tonalidade pela armadura de clave", hinos:[289]},
  {p:3, a:[14], tipo:"exercicio", rot:"Ritornello com 2 casas", hinos:[21,63,298,372,459]},
  {p:3, a:[14], tipo:"exercicio", rot:"Ritornello com 3 casas", hinos:[6,41,42,272,457,465,475]},

  /* ---------------- 4º período ---------------- */
  {p:4, a:[3], tipo:"complementar", rot:"Compassos alternados", hinos:[342,346,415]},
  {p:4, a:[3], tipo:"complementar", rot:"Fórmula de compasso diferente entre estrofe e coro",
   hinos:[94,296,348,350,352,359,422],
   nota:"A velocidade não muda entre estrofe e coro — só o 422 traz velocidades distintas."},
  {p:4, a:[4,5], tipo:"complementar", rot:"Síncopa",
   hinos:[5,14,21,33,42,59,83,84,91,117,176,178,181,186,188,198,203,208,229,236,241,252,255,261,
          286,294,298,300,326,335,352,372,381,410,413,417,422,426,434,458,460,473,478],
   nota:"O caderno fecha a lista com o Coro 2, que não entra aqui por não ter número de hino."},
  {p:4, a:[4,5], tipo:"complementar", rot:"Contratempo",
   hinos:[13,25,29,46,47,66,67,70,72,88,148,161,172,190,208,227,232,233,236,243,255,273,274,275,
          283,289,318,324,337,349,356,357,375,377,378,381,391,398,
          404,407,410,434,441,452,467,471,475,476],
   nota:"Seis hinos estão nas duas listas — 208, 236, 255, 381, 410 e 434 —, e isso é do caderno: o mesmo hino traz as duas figuras."},
  {p:4, a:[6,7], tipo:"selecionar", rot:"Ritmos iniciais: anacrúsicos e acéfalos", hinos:[],
   nota:"O caderno não dá lista: manda o instrutor selecionar hinos anacrúsicos e/ou acéfalos. Só há 2 hinos acéfalos no hinário."},
  {p:4, a:[8,9,10], tipo:"selecionar", rot:"Notas pontuadas em compasso simples e composto", hinos:[],
   nota:"O caderno manda o instrutor selecionar os hinos, para trabalhar a proporção entre as figuras."},
  {p:4, a:[11], tipo:"complementar", rot:"Andamento e poco rallentando", hinos:[15,157,378]},
  {p:4, a:[13], tipo:"complementar", rot:"Interpretação musical", hinos:[31,208]},
  {p:4, a:[14,15], tipo:"selecionar", rot:"Indicações interpretativas", hinos:[],
   nota:"São 6 e só essas: Solene, Majestoso, Com júbilo, Com veneração, Com submissão, Com humildade. No hinário, onze hinos trazem uma delas impressa: 96, 184, 299, 310 e 464 (Solene); 135, 367, 390 e 395 (Majestoso); 147 (Com júbilo); 271 (Com veneração). Com submissão e Com humildade não aparecem em hino nenhum."},
];

if (typeof module !== "undefined") module.exports = { HINOS_AULA };
