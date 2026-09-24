/* Programa Mínimo — CCB/Orquestra, "Sugestão de métodos para instrumentos",
   jan/2018 (o arquivo no Drive é "Programa Mínimo - CCB Orquestra - 03-2018").

   Três etapas: reuniões de jovens e menores (RJM), cultos oficiais e
   oficialização. Para cada instrumento, os métodos exigidos em cada etapa
   (alternativas separadas por "ou"), e, nas cordas, a voz do hinário.
   Transcrito como está no documento, só com a grafia uniformizada. */
const PROGRAMA_MINIMO = {
  etapas: ["Reuniões de jovens e menores", "Cultos oficiais", "Oficialização"],
  instrumentos: [
    { nome: "Violino", familia: "cordas", etapas: [
      { metodos: ["N. Laoureux vol. 1 até a pág. 35", "CCB até a pág. 46 (lição 113) + H. Sitt vol. 1 até a lição 6", "Método Facilitado (Ed. Britten) até a pág. 40"],
        voz: "Hinos 431 a 480, soprano no natural" },
      { metodos: ["N. Laoureux vol. 1 completo + vol. 3 até a pág. 15", "CCB até a pág. 67 (lição 162) + H. Sitt vol. 1 até a lição 14", "Método Facilitado (Ed. Britten) até a pág. 55"],
        voz: "Hinário completo, soprano 8ª acima" },
      { metodos: ["N. Laoureux vol. 1 completo + vol. 3 até a pág. 24 e das págs. 44 a 53", "Método CCB completo + H. Sitt op. 32 vol. 1 completo", "Método Facilitado (Ed. Britten) completo"],
        voz: "Hinário completo, soprano 8ª acima e contralto no natural" },
    ] },
    { nome: "Viola", familia: "cordas", etapas: [
      { metodos: ["Beginning Strings até a lição VI + Berta Volmer vol. 1 até a pág. 31", "Método Facilitado (Ed. Britten) até a pág. 40"],
        voz: "Hinos 431 a 480, tenor no natural" },
      { metodos: ["Berta Volmer vol. 1 até a pág. 62 + A Tune a Day (C. P. Herfurth) vol. 3 até a pág. 16", "Método Facilitado (Ed. Britten) até a pág. 55"],
        voz: "Hinário completo, tenor no natural" },
      { metodos: ["Berta Volmer vol. 1 completo + A Tune a Day (C. P. Herfurth) vol. 3 completo", "Método Facilitado (Ed. Britten) completo"],
        voz: "1ª a 3ª posições; hinário completo, tenor no natural" },
    ] },
    { nome: "Violoncelo", familia: "cordas", etapas: [
      { metodos: ["Beginning Strings até a lição VI + Dotzauer vol. 1 até a pág. 34 (lição 80)", "Método Facilitado (Ed. Britten) até a pág. 40"],
        voz: "Hinos 431 a 480, baixo no natural" },
      { metodos: ["Dotzauer vol. 1 completo + vol. 2 até a pág. 3 (lição 111)", "Método Facilitado (Ed. Britten) até a pág. 52"],
        voz: "Hinário completo, baixo no natural" },
      { metodos: ["Dotzauer vol. 1 completo + vol. 2 até a pág. 19 (lição 154)", "Método Facilitado (Ed. Britten) completo"],
        voz: "Hinário completo, baixo no natural" },
    ] },
    { nome: "Flauta (Dó)", familia: "madeiras", etapas: [
      { metodos: ["Parès até a lição 41", "Galli até a pág. 41", "Método Prático (Almeida Dias) até a fase 13"] },
      { metodos: ["Parès até a lição 62", "Galli completo", "Método Prático (Almeida Dias) até a fase 25"] },
      { metodos: ["Parès completo", "Galli completo", "Método Prático (Almeida Dias) completo"] },
    ] },
    { nome: "Oboé (Dó), oboé d'amore (Lá), corne inglês (Fá)", familia: "madeiras", etapas: [
      { metodos: ["Rubank Elementary Method for Oboe completo", "Giampieri até a pág. 21"] },
      { metodos: ["Rubank Intermediate Method for Oboe até a pág. 16", "Giampieri até a pág. 30"] },
      { metodos: ["Rubank Intermediate Method for Oboe até a pág. 30", "Giampieri até a pág. 50"] },
    ] },
    { nome: "Fagote (Dó)", familia: "madeiras", etapas: [
      { metodos: ["Giampieri até a pág. 18", "Weissenborn até o módulo 12"] },
      { metodos: ["Giampieri até a pág. 26", "Weissenborn até o módulo 18"] },
      { metodos: ["Giampieri até a pág. 43", "Weissenborn até o módulo 22"] },
    ] },
    { nome: "Clarinete (Si♭)", familia: "madeiras", etapas: [
      { metodos: ["Giampieri até a pág. 28", "Domingos Pecci até a pág. 29", "Galper book 1, lição 26 — até o exercício 110"] },
      { metodos: ["Giampieri até a pág. 41", "Domingos Pecci até a pág. 36", "Nabor Pires Camargo até a lição 36", "Galper book 1 completo + book 2 até a pág. 18"] },
      { metodos: ["Giampieri até a pág. 63", "Domingos Pecci completo", "Nabor Pires Camargo completo", "Galper book 1 completo + book 2 até a pág. 29"] },
    ] },
    { nome: "Clarinete alto (Mi♭) e clarinete baixo (Si♭)", familia: "madeiras", etapas: [
      { metodos: ["Giampieri até a pág. 28", "Galper book 1, lição 26 — até o exercício 110"] },
      { metodos: ["Giampieri até a pág. 36", "Galper book 1 completo + book 2 até a pág. 18"] },
      { metodos: ["Giampieri completo", "Galper book 1 completo + book 2 até a pág. 29"] },
    ] },
    { nome: "Saxofones soprano e tenor (Si♭), alto e barítono (Mi♭)", familia: "madeiras", etapas: [
      { metodos: ["Giampieri até a pág. 21", "Amadeu Russo até a pág. 25", "Método Prático (Almeida Dias) até a fase 13"] },
      { metodos: ["Giampieri até a pág. 30", "Amadeu Russo até a pág. 40", "Método Prático (Almeida Dias) até a fase 25"] },
      { metodos: ["Giampieri até a pág. 50", "Amadeu Russo até a pág. 55", "Método Prático (Almeida Dias) completo"] },
    ] },
    { nome: "Trompete (Dó ou Si♭), cornet e flugelhorn (Si♭)", familia: "metais", etapas: [
      { metodos: ["Rubank Elementary Method for Cornet or Trumpet completo"] },
      { metodos: ["Robert W. Getchell — Second Book of Practical Studies, exercícios 65 a 94", "Amadeu Russo até a pág. 30", "Método Prático (Almeida Dias) até a fase 25"] },
      { metodos: ["Robert W. Getchell — Second Book of Practical Studies completo", "Amadeu Russo até a pág. 41", "Método Prático (Almeida Dias) completo"] },
    ] },
    { nome: "Trompa (Fá/Si♭)", familia: "metais", etapas: [
      { metodos: ["Rubank Elementary completo + Método Prático para trompa até a lição 73"] },
      { metodos: ["Rubank Elementary completo + Rubank Intermediate completo + Método Prático para trompa até a lição 105"] },
      { metodos: ["Rubank Elementary completo + Rubank Intermediate completo + Método Prático para trompa completo"] },
    ] },
    { nome: "Trombone e eufônio (Si♭)", familia: "metais", etapas: [
      { metodos: ["Rubank Elementary for Trombone até a pág. 24", "Método Prático (Almeida Dias) até a fase 13"] },
      { metodos: ["Rubank Elementary for Trombone até a pág. 37", "Método Prático (Almeida Dias) até a fase 25"] },
      { metodos: ["Rubank Elementary for Trombone até a pág. 48", "Método Prático (Almeida Dias) completo"] },
    ] },
    { nome: "Tuba (Si♭, Dó, Mi♭ ou Fá)", familia: "metais", etapas: [
      { metodos: ["Rubank Elementary for Tuba até a pág. 24", "Método Prático (Almeida Dias) até a fase 13"] },
      { metodos: ["Rubank Elementary for Tuba até a pág. 37", "Método Prático (Almeida Dias) até a fase 25"] },
      { metodos: ["Rubank Elementary for Tuba até a pág. 48", "Método Prático (Almeida Dias) completo"] },
    ] },
  ],
  /* O que vale para todos os instrumentos. */
  todos: [
    { item: "Teoria", etapas: ["Método de Teoria e Solfejo (MTS, 2014) até o módulo 10", "MTS (2014) completo", "MTS (2014) completo e revisado (sem o apêndice)"] },
    { item: "Solfejo", etapas: ["Hinos 431 a 480", "Todos os hinos", "Todos os hinos"] },
    { item: "Hinário", etapas: ["431 a 480 — voz principal e voz alternativa", "Completo — voz principal e voz alternativa", "Completo — voz principal e voz alternativa"] },
  ],
  observacoes: [
    "Os métodos acima podem ser substituídos por outros de grau mais elevado.",
    "Todos os instrumentos devem saber executar a voz do soprano, e ela é apresentada nos testes.",
    "Sugestão de livro de teoria para complementar o MTS: Bohumil Med, 4ª edição.",
  ],
};

if (typeof module !== "undefined") module.exports = { PROGRAMA_MINIMO };
