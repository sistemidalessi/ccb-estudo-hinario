/* Gera as duas apostilas de um período, a partir dos mesmos dados que
   alimentam o site.

   Uso:  node ferramentas/gerar-apostila.js        (os quatro períodos)
         node ferramentas/gerar-apostila.js 2      (só o 2º)

   Saída:  apostila/Apostila-2o-periodo-candidato.docx
           apostila/Apostila-2o-periodo-instrutor.docx

   Os dois documentos são diferentes, e não um com respostas e outro sem:
   - candidato: explicação da aula, figuras, exercícios com espaço para
     responder, os hinos que fecham a aula e a tarefa de casa;
   - instrutor: antes de cada aula, uma página de roteiro tirada do Plano de
     Aula oficial (tema, habilidades, objetivos, conteúdo, duração, recursos,
     metodologia e avaliação); depois, a mesma aula do candidato com os
     gabaritos no lugar das linhas de resposta.
*/
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, PageBreak, Table, TableRow, TableCell, WidthType, ShadingType, ImageRun,
} = require("docx");
const { carregar } = require("./carregar.js");
const { hinosDaAula, listasOficiais, fcTexto, metTexto } = require("./hinos-da-aula.js");

const RAIZ = path.join(__dirname, "..");
const { TIPOS, AULAS, Q, HINOS, PLANOS, FASES } = carregar(RAIZ);
const { todasAsAnalises, ultimaAulaDaFase } = require("./analise.js");
const { repertorio } = require("./repertorio.js");
const { dicasDoHino, REGENCIA } = require("./regencia.js");
const { PROGRAMA_MINIMO } = require(path.join(RAIZ, "dados", "programa-minimo.js"));
const ANALISES = todasAsAnalises(HINOS);
const FIM_DA_FASE = ultimaAulaDaFase(AULAS);
const faseQueFecha = (p, a) => Number(Object.keys(FIM_DA_FASE).find(f => FIM_DA_FASE[f].p === p && FIM_DA_FASE[f].a === a)) || null;
const VERDE = "4A6B3F";
const { LICOES } = require(path.join(RAIZ, "dados", "licoes.js"));

const FASES_DO_PERIODO = { 1: [1, 2, 3], 2: [4, 5], 3: [6, 7, 8, 9], 4: [10, 11, 12, 13, 14, 15, 16] };
const ORDINAL = { 1: "1º", 2: "2º", 3: "3º", 4: "4º" };

const SERIF = "Cambria";
const SANS = "Calibri";
const TINTA = "16212A";
const AZUL = "1F5673";
const CINZA = "5C6B75";
const PRATICA = "8A5A2B";
const LARGURA = 9350;                 // largura útil, em DXA
// A biblioteca docx mede a imagem em PIXEL de 96 dpi, não em ponto: 1 px = 0,75 pt.
// A área de texto da página (21 cm menos 2 cm de margem de cada lado) são 17 cm,
// ou seja 643 px. MAX_FIG fica um pouco abaixo disso.
const MAX_FIG = 620;                  // largura máxima da figura, em px de documento
// Cada pixel de PROJETO (os do gera.js) vale este tanto de pixel de documento,
// em toda figura. Sem isso, uma figura desenhada larga e outra estreita saíam
// com tamanhos aparentes diferentes na página.
const PX_DOC_POR_PX_PROJETO = 0.96;
// O PNG é fotografado em 3x, então cada pixel do arquivo é 1/3 de pixel de projeto.
const ESCALA_RENDER = 3;

/* ---------- blocos reutilizáveis ---------- */

const vazio = (espaco = 120) => new Paragraph({ spacing: { after: espaco }, children: [] });
const quebra = () => new Paragraph({ children: [new PageBreak()] });

function texto(t, o = {}) {
  return new Paragraph({
    spacing: { after: o.after ?? 120, before: o.before, line: o.line ?? 300 },
    alignment: o.align, indent: o.indent,
    border: o.borda,
    children: [new TextRun({
      text: t, font: o.font ?? SANS, size: o.size ?? 21,
      bold: o.bold, italics: o.italico, color: o.cor ?? TINTA, allCaps: o.caps,
      characterSpacing: o.caps ? 16 : undefined,
    })],
  });
}

function linhaResposta(qtd = 2) {
  return Array.from({ length: qtd }, () => new Paragraph({
    spacing: { before: 200, after: 0 },
    indent: { left: 340 },
    border: { bottom: { style: BorderStyle.DOTTED, size: 6, space: 2, color: "AFBAC0" } },
    children: [new TextRun({ text: "", size: 20 })],
  }));
}

function caixa(linhas, o = {}) {
  return new Table({
    columnWidths: [LARGURA],
    width: { size: LARGURA, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "D6DCDA" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "D6DCDA" },
      left: { style: BorderStyle.SINGLE, size: 18, color: o.faixa ?? AZUL },
      right: { style: BorderStyle.SINGLE, size: 2, color: "D6DCDA" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: LARGURA, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: o.fundo ?? "F2F4F3" },
        margins: { top: 140, bottom: 140, left: 200, right: 200 },
        children: linhas,
      })],
    })],
  });
}

/* ---------- figuras ---------- */

/* Dimensões de um PNG, lidas do cabeçalho IHDR — evita uma dependência só
   para descobrir largura e altura. */
function tamanhoPNG(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("não é PNG");
  return { larg: buf.readUInt32BE(16), alt: buf.readUInt32BE(20) };
}

const cacheFig = new Map();
function figura(nome, legenda) {
  if (!nome) return [];
  const arq = path.join(RAIZ, "assets", "figuras", nome + ".png");
  if (!fs.existsSync(arq)) return [];
  if (!cacheFig.has(nome)) {
    const buf = fs.readFileSync(arq);
    const { larg, alt } = tamanhoPNG(buf);
    const escala = Math.min(PX_DOC_POR_PX_PROJETO / ESCALA_RENDER, MAX_FIG / larg);
    cacheFig.set(nome, { buf, w: Math.round(larg * escala), h: Math.round(alt * escala) });
  }
  const { buf, w, h } = cacheFig.get(nome);
  const saida = [new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 160, after: legenda ? 40 : 200 },
    children: [new ImageRun({ type: "png", data: buf, transformation: { width: w, height: h } })],
  })];
  if (legenda) saida.push(texto(legenda, { align: AlignmentType.CENTER, size: 16, italico: true, cor: CINZA, after: 200 }));
  return saida;
}

/* ---------- capa ---------- */

function capa(periodo, instrutor) {
  const geral = periodo === "geral";
  const fases = geral ? [1, 16] : FASES_DO_PERIODO[periodo];
  return [
    vazio(1300),
    texto("Congregação Cristã no Brasil", { align: AlignmentType.CENTER, caps: true, size: 18, cor: CINZA, after: 60 }),
    texto("Grupo de Estudos Musicais", { align: AlignmentType.CENTER, caps: true, size: 18, cor: CINZA, after: 640 }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 160 },
      children: [new TextRun({ text: "Estudo do Hinário", font: SERIF, size: 56, bold: true, color: TINTA })],
    }),
    texto(instrutor ? "Caderno do instrutor" : "Caderno do candidato",
      { align: AlignmentType.CENTER, font: SERIF, size: 26, italico: true, cor: CINZA, after: 440 }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 100 },
      border: { top: { style: BorderStyle.SINGLE, size: 8, space: 12, color: AZUL } },
      children: [new TextRun({ text: geral ? "Apostila geral" : `${ORDINAL[periodo]} Período`, font: SERIF, size: 32, bold: true, color: AZUL })],
    }),
    texto(geral ? "Os quatro períodos do MSA · 16 fases · 60 aulas" : `Fases ${fases[0]} a ${fases[fases.length - 1]} do MSA · 15 aulas`,
      { align: AlignmentType.CENTER, size: 20, cor: CINZA, after: instrutor ? 640 : 900 }),
    ...(instrutor
      ? [caixa([
          texto("Este exemplar é de uso do instrutor", { bold: true, size: 20, cor: AZUL, after: 60 }),
          texto("Traz o roteiro de cada aula, tirado do Plano de Aula oficial, e os gabaritos de todos os exercícios. O caderno do candidato é o outro arquivo.", { size: 19, after: 0 }),
        ], { fundo: "DDE8ED" }), vazio(700)]
      : [
          texto("Nome: ________________________________________________________", { size: 22, after: 280 }),
          texto("Comum congregação: ____________________________________________", { size: 22, after: 280 }),
          texto("Instrumento: ______________________  Ano letivo: ______________", { size: 22, after: 760 }),
        ]),
    texto("Material complementar. O MSA continua sendo o material didático da aula, apresentado por inteiro pelo instrutor.",
      { align: AlignmentType.CENTER, size: 17, italico: true, cor: CINZA, after: 0 }),
    quebra(),
  ];
}

/* ---------- página de instruções ---------- */

function comoUsar(periodo, instrutor) {
  const usados = [...new Set(Q.filter(q => FASES_DO_PERIODO[periodo].includes(q.f)).map(q => q.k))];
  const papel = usados.filter(k => TIPOS[k].canal === "papel");
  const pratica = usados.filter(k => TIPOS[k].canal === "pratica");

  const comum = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1, spacing: { after: 220 },
      children: [new TextRun({ text: "Como usar este caderno", font: SERIF, size: 32, bold: true, color: TINTA })],
    }),
    texto("Este caderno acompanha as aulas do MSA, aula por aula, na mesma ordem do Manual de aplicação. Ele é complementar: o conteúdo do MSA continua sendo apresentado por inteiro pelo instrutor, a partir do método. O que está aqui é a explicação para reler em casa, as figuras, os exercícios de fixação e os hinos que fecham cada aula."),
    texto("Os exercícios usam o Hinário em Dó, capa preta. O hinário não é reproduzido aqui: pede-se que esteja em mãos."),
    vazio(180),
    texto("O que há em cada aula", { font: SERIF, size: 24, bold: true, after: 140 }),
    texto("Abertura — por que aquele assunto existe. Explicação — o assunto em blocos curtos, com figura ao lado quando ela ajuda. Atenção — o erro que mais aparece naquela aula. Exercícios — numerados, com o tipo e o nível. O hino da aula — os hinos em que o assunto aparece. Para casa — o que levar até a aula seguinte."),
    vazio(180),
    texto("Os tipos de exercício", { font: SERIF, size: 24, bold: true, after: 140 }),
    texto("No papel — " + papel.map(k => `${TIPOS[k].rot} (${TIPOS[k].desc})`).join(" · ")),
    texto("Na prática — " + pratica.map(k => `${TIPOS[k].rot} (${TIPOS[k].desc})`).join(" · ")),
    texto("Os exercícios de prática não se respondem por escrito: são apresentados ao instrutor, que assina a data ao lado.", { italico: true, cor: CINZA }),
    vazio(180),
    texto("Os níveis", { font: SERIF, size: 24, bold: true, after: 140 }),
    texto("Cada exercício traz um nível de 1 a 3. Nível 1 é reconhecer o que está escrito; nível 2 é explicar por que é assim; nível 3 é aplicar, comparar ou decidir. Não é nota — é para o candidato saber o que ainda falta."),
    vazio(180),
    ...(instrutor ? [
      texto("O curso de regência", { font: SERIF, size: 24, bold: true, after: 140 }),
      texto("Só neste caderno. Depois da análise de hinos de cada fase vem um módulo de regência para a aula prática mensal, em que os instrutores regem: a técnica do módulo, com figuras, e as observações para reger cada hino da análise. A técnica cresce com o conteúdo do MSA, do compasso em 4 ao começo acéfalo."),
      vazio(180)] : []),
  ];

  comum.push(instrutor
    ? caixa([
        texto("Sobre os hinos de cada aula", { bold: true, after: 60 }),
        texto("Quando o caderno de atividades do GEM traz a lista de hinos daquela aula, é ela que aparece — inclusive a observação de ler a partir do 1º compasso completo. Onde o caderno manda o instrutor selecionar os hinos, ou onde não há lista, os hinos são escolhidos pelos dados do próprio hinário: tonalidade, marcação e metrônomo, do cabeçalho; fórmula de compasso, ritmo inicial e sinais, lidos da partitura. O ritmo inicial é o menos certo deles, e onde ele decide a escolha a apostila avisa para conferir.", { after: 0 }),
      ], { faixa: VERDE, fundo: "EFF3EC" })
    : caixa([
        texto("Onde a resposta depende do hino escolhido, o gabarito está no caderno do instrutor. Traga suas dúvidas para a aula seguinte — é para isso que elas servem.", { after: 0 }),
      ]));
  comum.push(quebra());
  return comum;
}

/* ---------- roteiro do instrutor (Plano de Aula oficial) ---------- */

function lista(titulo, itens, cor) {
  if (!itens || !itens.length) return [];
  const saida = [texto(titulo, { caps: true, size: 16, bold: true, cor: cor ?? AZUL, after: 60, before: 140 })];
  itens.forEach(i => saida.push(new Paragraph({
    spacing: { after: 40, line: 280 }, indent: { left: 200, hanging: 140 },
    children: [new TextRun({ text: "· " + i, font: SANS, size: 19, color: TINTA })],
  })));
  return saida;
}

function roteiro(periodo, num) {
  const pl = ((PLANOS || {})[periodo] || []).find(x => x.a === num);
  // Sem dados/planos.js na máquina, a apostila do instrutor sai sem a página de
  // roteiro — e diz por quê, em vez de sumir com a seção calada.
  if (!pl) return num === 1 ? [caixa([
    texto("Roteiro do instrutor", { caps: true, size: 16, bold: true, cor: CINZA, after: 60 }),
    texto("Esta apostila foi gerada sem os Planos de Aula do MSA, que são material interno do GEM e ficam fora do repositório. Para incluir a página de roteiro em cada aula, ponha dados/planos.js na máquina antes de gerar — as instruções estão em dados/LEIAME-planos.md.", { size: 19, after: 0 }),
  ], { faixa: CINZA, fundo: "F2F4F3" }), quebra()] : [];
  const corpo = [
    texto("Roteiro do instrutor", { caps: true, size: 16, bold: true, cor: CINZA, after: 60 }),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: `Aula ${num} · ${pl.topico}`, font: SERIF, size: 26, bold: true, color: AZUL })],
    }),
    texto(pl.tema || "", { font: SERIF, size: 22, italico: true, cor: TINTA, after: 60 }),
    texto([`Fase ${pl.fase}`, pl.duracao].filter(Boolean).join(" · "), { size: 17, cor: CINZA, after: 120 }),
    ...lista("Habilidades a desenvolver", pl.habilidades),
    ...lista("Objetivos", pl.objetivos),
    ...lista("Conteúdo", pl.conteudo),
    ...lista("Recursos", pl.recursos),
    ...lista("Recursos complementares", pl.extras),
    ...lista("Metodologia", pl.metodologia, PRATICA),
    ...lista("Avaliação", pl.avaliacao, PRATICA),
    ...lista("Referências", pl.refs, CINZA),
  ];
  return [caixa(corpo, { faixa: AZUL, fundo: "F7F9F9" }), quebra()];
}

/* ---------- uma aula ---------- */

function aula(periodo, [num, tops, assunto], instrutor) {
  const lic = LICOES[`${periodo}-${num}`];
  const doAula = Q.filter(q => q.a === num && FASES_DO_PERIODO[periodo].includes(q.f));
  const b = [];

  b.push(new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { after: 50 },
    children: [new TextRun({ text: `Aula ${num}`, font: SERIF, size: 30, bold: true, color: AZUL })],
  }));
  b.push(new Paragraph({
    spacing: { after: 90 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, space: 6, color: "D6DCDA" } },
    children: [new TextRun({ text: (lic && lic.titulo) || assunto, font: SERIF, size: 26, color: TINTA })],
  }));
  b.push(texto(tops ? `MSA · tópicos ${tops}` : "MSA · continuação da aula anterior",
    { size: 17, caps: true, cor: CINZA, after: 220 }));

  /* explicação */
  if (lic) {
    b.push(texto(lic.abre, { size: 21, after: 180 }));
    lic.blocos.forEach(bl => {
      b.push(texto(bl.h, { font: SERIF, size: 23, bold: true, after: 70, before: 120 }));
      b.push(texto(bl.t, { size: 21, after: bl.fig ? 40 : 150 }));
      b.push(...figura(bl.fig));
    });
    if (lic.atencao) {
      b.push(caixa([
        texto("Atenção", { caps: true, size: 16, bold: true, cor: PRATICA, after: 50 }),
        texto(lic.atencao, { size: 20, after: 0 }),
      ], { faixa: PRATICA, fundo: "F7F1E8" }));
      b.push(vazio(200));
    }
  }

  /* exercícios */
  if (doAula.length) {
    b.push(texto("Exercícios", { font: SERIF, size: 24, bold: true, cor: AZUL, after: 60, before: 160 }));
    doAula.forEach((q, i) => {
      const t = TIPOS[q.k];
      b.push(new Paragraph({
        spacing: { before: 240, after: 50 },
        children: [
          new TextRun({ text: `${i + 1}. `, font: SANS, size: 21, bold: true, color: TINTA }),
          new TextRun({ text: t.rot.toUpperCase() + "  ", font: SANS, size: 16, bold: true,
            color: t.canal === "papel" ? AZUL : PRATICA, characterSpacing: 16 }),
          new TextRun({ text: "nível " + q.n, font: SANS, size: 16, color: CINZA }),
        ],
      }));
      b.push(new Paragraph({
        spacing: { after: 40, line: 300 }, indent: { left: 340 },
        children: [new TextRun({ text: q.q, font: SANS, size: 21, color: TINTA })],
      }));
      if (instrutor) {
        b.push(new Paragraph({
          spacing: { before: 90, after: 50 }, indent: { left: 340 },
          border: { left: { style: BorderStyle.SINGLE, size: 12, space: 8, color: VERDE } },
          children: [new TextRun({ text: q.g, font: SANS, size: 19, color: "3F4C55" })],
        }));
      } else if (t.canal === "pratica") {
        b.push(new Paragraph({
          spacing: { before: 130, after: 50 }, indent: { left: 340 },
          children: [new TextRun({ text: "Apresentado ao instrutor em ____ / ____ / ______        Visto: ______________",
            font: SANS, size: 19, color: CINZA })],
        }));
      } else {
        b.push(...linhaResposta(q.k === "criar" || q.n === 3 ? 3 : 2));
      }
    });
  } else if (!lic) {
    b.push(caixa([
      texto("Conclusão dos exercícios individuais", { bold: true, after: 70 }),
      texto("Aula reservada às apresentações pendentes do período. Confira nas páginas anteriores os exercícios de prática ainda sem o visto do instrutor.", { after: 0 }),
    ]));
  }

  /* o hino da aula */
  b.push(...hinoDaAula(periodo, num, instrutor));

  /* para casa */
  if (lic && lic.casa) {
    b.push(caixa([
      texto("Para casa", { caps: true, size: 16, bold: true, cor: AZUL, after: 50 }),
      texto(lic.casa, { size: 20, after: 0 }),
    ], { faixa: AZUL, fundo: "F2F4F3" }));
  }

  b.push(quebra());
  return b;
}

/* ---------- o hino da aula ---------- */

function hinoDaAula(periodo, num, instrutor) {
  const fecho = hinosDaAula(periodo, num, HINOS);
  if (!fecho) return [];
  const oficiais = listasOficiais(periodo, num, HINOS);
  const linhas = [texto("O hino da aula", { bold: true, font: SERIF, size: 23, after: 50 })];

  if (fecho.fonte === "oficial") {
    oficiais.forEach(l => {
      const nums = l.hinos.map(h => (l.comp1.has(h.n) ? `${h.n}*` : String(h.n))).join(", ");
      const rot = l.tipo === "exercicio" ? `Executado na aula — ${l.rot.toLowerCase()}`
                : l.tipo === "citado" ? `Citado na aula — ${l.rot.toLowerCase()}`
                : l.rot;
      linhas.push(texto(rot, { bold: true, size: 19, after: 30, before: 90 }));
      linhas.push(texto(nums, { size: 19, after: 30 }));
      if (l.comp1.size) linhas.push(texto("* ler a partir do 1º compasso completo", { size: 16, italico: true, cor: CINZA, after: 30 }));
      if (l.nota) linhas.push(texto(l.nota, { size: 16, italico: true, cor: CINZA, after: 30 }));
      if (l.conf === "conferir" && instrutor) {
        linhas.push(texto("Conferir esta lista no caderno impresso do GEM antes de usar em avaliação: ela vem em duas colunas e a leitura automática do PDF pode tê-las embaralhado.",
          { size: 16, italico: true, cor: PRATICA, after: 30 }));
      }
    });
    linhas.push(texto("Lista do próprio GEM para esta aula.", { size: 16, italico: true, cor: CINZA, after: 110, before: 60 }));
  } else {
    const lista_ = fecho.hinos.map(h => h.n).join(", ").replace(/, (\d+)$/, " e $1");
    linhas.push(texto(`Hinos ${lista_} — ${fecho.porque}.`, { size: 19, italico: true, cor: CINZA, after: fecho.conferir && instrutor ? 40 : 130 }));
    if (fecho.conferir && instrutor) {
      linhas.push(texto(fecho.conferir, { size: 16, italico: true, cor: PRATICA, after: 130 }));
    }
  }

  /* ficha e perguntas dos hinos escolhidos */
  fecho.hinos.forEach(h => {
    if (!h.tom) return;                       // hino fora da extração: só o número
    const ficha = [h.tom + " maior", fcTexto(h), h.marc, metTexto(h), h.ind].filter(Boolean).join(" · ");
    linhas.push(texto(`Hino ${h.n} — ${ficha}`, { bold: true, size: 19, after: 35, before: 70 }));
    fecho.perguntas(h).forEach(([pergunta, gab]) => {
      linhas.push(new Paragraph({
        spacing: { after: 25, line: 280 }, indent: { left: 200 },
        children: [new TextRun({ text: "· " + pergunta, font: SANS, size: 19, color: TINTA })],
      }));
      if (instrutor) {
        linhas.push(new Paragraph({
          spacing: { after: 60 }, indent: { left: 340 },
          children: [new TextRun({ text: gab, font: SANS, size: 18, color: "3F4C55", italics: true })],
        }));
      } else {
        linhas.push(...linhaResposta(1));
      }
    });
  });
  return [caixa(linhas, { faixa: PRATICA, fundo: "F7F1E8" })];
}

/* ---------- análise de hinos, ao fim de cada fase ---------- */

/* Partitura do hino (recortar-hinos.py), fora do Git. Largura de 600 px
   (~16 cm), altura no máximo 620 px (~16 cm). */
const DIR_HINOS = path.join(__dirname, "hinos-img");
function partituras(n) {
  if (!fs.existsSync(DIR_HINOS)) return [];
  return fs.readdirSync(DIR_HINOS).filter(a => a.startsWith(String(n).padStart(3, "0") + "-")).sort().map(a => {
    const buf = fs.readFileSync(path.join(DIR_HINOS, a));
    const { larg, alt } = tamanhoPNG(buf);
    const e = Math.min(600 / larg, 620 / alt);
    return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
      children: [new ImageRun({ type: "png", data: buf, transformation: { width: Math.round(larg * e), height: Math.round(alt * e) } })] });
  });
}

function analise(f, instrutor) {
  const bloco = ANALISES[f];
  if (!bloco || !bloco.length) return [];
  const fase = FASES.find(x => x.f === f);
  const b = [
    quebra(),
    texto(`Fim da fase ${f} · análise de hinos`, { caps: true, size: 16, cor: CINZA, after: 60 }),
    new Paragraph({ spacing: { after: 100 },
      children: [new TextRun({ text: "Analise os hinos", font: SERIF, size: 32, bold: true, color: VERDE })] }),
    texto(`Fase ${f} — ${fase ? fase.nome.toLowerCase() : ""}. Olhe o hino e responda. As perguntas cobrem só o que foi estudado até aqui: as marcadas “novo” são desta fase; as outras revisam as anteriores.`,
      { size: 19, cor: "3F4C55", after: 160 }),
  ];
  if (instrutor && f === 13) {
    b.push(texto("O ritmo inicial foi lido da partitura (largura do primeiro compasso e indicação de regência na margem); conferir no hinário antes de usar em avaliação.",
      { size: 17, italico: true, cor: PRATICA, after: 120 }));
  }
  bloco.forEach(({ h, novas, revisao }, i) => {
    const ficha = [h.tom + " maior", fcTexto(h), h.marc, metTexto(h), h.ind].filter(Boolean).join(" · ");
    const imgs = partituras(h.n);
    if (imgs.length) {
      // como nas fichas do GEM: o hino na página, e as perguntas logo abaixo.
      // A ficha entregaria as respostas: só no instrutor.
      if (i) b.push(quebra());
      b.push(new Paragraph({ spacing: { after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 10, space: 4, color: VERDE } },
        children: [new TextRun({ text: `Hino ${h.n}  `, font: SERIF, size: 26, bold: true, color: TINTA }),
          ...(instrutor ? [new TextRun({ text: ficha, font: SERIF, size: 18, italics: true, color: CINZA })] : [])] }),
        ...imgs);
    }
    const linhas = imgs.length ? [] : [new Paragraph({ spacing: { after: 80 }, children: [
      new TextRun({ text: `Hino ${h.n}  `, font: SERIF, size: 23, bold: true, color: TINTA }),
      new TextRun({ text: ficha, font: SERIF, size: 18, italics: true, color: CINZA })] })];
    [...novas.map(q => [q, true]), ...revisao.map(q => [q, false])].forEach(([[pergunta, gab], nova], i) => {
      linhas.push(new Paragraph({ spacing: { before: 60, after: 20 }, children: [
        new TextRun({ text: `${i + 1}. `, font: SANS, size: 19, bold: true, color: TINTA }),
        ...(nova ? [new TextRun({ text: "NOVO  ", font: SANS, size: 14, bold: true, color: VERDE })] : []),
        new TextRun({ text: pergunta, font: SANS, size: 19, color: TINTA })] }));
      if (instrutor) {
        linhas.push(new Paragraph({ spacing: { after: 40 }, indent: { left: 340 },
          children: [new TextRun({ text: gab, font: SANS, size: 18, italics: true, color: "3F4C55" })] }));
      } else {
        linhas.push(...linhaResposta(1));
      }
    });
    b.push(caixa(linhas, { faixa: VERDE, fundo: "F4F7F2" }), vazio(160));
  });
  return b;
}

/* ---------- curso de regência (só no caderno do instrutor) ---------- */

const MARROM = PRATICA;
function blocosDeRegencia(mod) {
  const b = [];
  mod.blocos.forEach(x => {
    b.push(texto(x.h, { font: SERIF, size: 24, bold: true, before: 160, after: 60 }), texto(x.t, { size: 20 }));
    if (x.fig) b.push(...figura(x.fig));
  });
  return b;
}
function regencia(f) {
  const mod = REGENCIA[f];
  if (!mod) return [];
  const b = [];
  const titulo = (olho, t) => [quebra(), texto(olho, { caps: true, size: 16, cor: CINZA, after: 60 }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: t, font: SERIF, size: 32, bold: true, color: MARROM })] })];
  if (f === 1) {
    const I = REGENCIA.intro;
    b.push(...titulo("Curso de regência · para os instrutores", I.titulo), texto(I.abre, { size: 20, cor: "3F4C55", after: 160 }), ...blocosDeRegencia(I));
  }
  b.push(...titulo(`Curso de regência · módulo ${f} de 16`, mod.titulo), texto(mod.abre, { size: 20, cor: "3F4C55", after: 160 }), ...blocosDeRegencia(mod));
  b.push(caixa([texto("Na aula prática", { caps: true, size: 16, bold: true, cor: MARROM, after: 60 }),
    ...mod.pratica.map(p => texto(`· ${p}`, { size: 19, after: 60 }))], { faixa: MARROM, fundo: "F7F1E8" }), vazio(200));
  b.push(texto("Para reger os hinos da análise desta fase", { font: SERIF, size: 25, bold: true, cor: MARROM, after: 100,
    borda: { bottom: { style: BorderStyle.SINGLE, size: 8, space: 2, color: MARROM } } }));
  (ANALISES[f] || []).forEach(({ h }) => {
    const ficha = [h.tom + " maior", fcTexto(h), h.marc, metTexto(h), h.ind].filter(Boolean).join(" · ");
    b.push(new Paragraph({ spacing: { before: 160, after: 60 }, keepNext: true, children: [
      new TextRun({ text: `Hino ${h.n}  `, font: SERIF, size: 23, bold: true, color: TINTA }),
      new TextRun({ text: ficha, font: SERIF, size: 18, italics: true, color: CINZA })] }));
    dicasDoHino(h, f).forEach(([r, t]) => b.push(new Paragraph({ spacing: { after: 50 }, indent: { left: 340 }, children: [
      new TextRun({ text: `${r.toUpperCase()}  `, font: SANS, size: 15, bold: true, color: MARROM }),
      new TextRun({ text: t, font: SANS, size: 19, color: TINTA })] })));
  });
  return b;
}

/* ---------- repertório e Programa Mínimo (só na apostila geral) ---------- */

function apendices(instrutor) {
  const b = [quebra(), texto("Apêndice", { caps: true, size: 16, cor: CINZA, after: 60 }),
    new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "Repertório de estudo por etapa", font: SERIF, size: 32, bold: true, color: AZUL })] }),
    texto("Hinos para estudar em cada etapa do Programa Mínimo, em ordem de dificuldade. Cada um traz alguma coisa que os anteriores da mesma etapa ainda não trouxeram. A posição do violino é orientação geral; a digitação é a do método do aluno.", { size: 19, after: 160 })];
  repertorio(HINOS).forEach(et => {
    b.push(texto(et.nome, { font: SERIF, size: 25, bold: true, cor: AZUL, before: 200, after: 40 }),
      texto(`Violino: ${et.violino}`, { size: 17, italico: true, cor: CINZA, after: 100 }));
    et.hinos.forEach((x, i) => {
      const ficha = [x.h.tom + " maior", fcTexto(x.h), metTexto(x.h)].filter(Boolean).join(" · ");
      const traz = i === 0 ? `ponto de partida — ${x.tudo.filter(t => !t.startsWith("violino:")).join(", ")}` : x.traz.join(", ");
      b.push(new Paragraph({ spacing: { after: 20 }, children: [
        new TextRun({ text: `Hino ${x.n}  `, font: SANS, size: 20, bold: true, color: TINTA }),
        new TextRun({ text: ficha, font: SANS, size: 18, color: CINZA }),
        ...(instrutor ? [] : [new TextRun({ text: "     visto: ________", font: SANS, size: 16, color: CINZA })])] }),
        texto(`Traz: ${traz}.`, { size: 18, after: 10, indent: { left: 340 } }),
        texto(`Violino: ${x.violino}.`, { size: 17, cor: PRATICA, after: 100, indent: { left: 340 } }));
    });
  });
  return b;
}

/* "Antes de começar": o Programa Mínimo por instrumento, antes das aulas. */
function antesDeComecar() {
  const P = PROGRAMA_MINIMO;
  const ETAPA = ["Para as reuniões de jovens e menores", "Para os cultos oficiais", "Para a oficialização"];
  const b = [texto("Antes de começar", { caps: true, size: 16, cor: CINZA, after: 60 }),
    new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "O caminho na orquestra", font: SERIF, size: 36, bold: true, color: AZUL })] }),
    texto("Todo músico da orquestra passa por três etapas: as reuniões de jovens e menores (hinos 431 a 480), os cultos oficiais (hinário completo) e a oficialização. Em cada uma, o Programa Mínimo da Congregação diz o que é preciso ter estudado. Escolha o seu instrumento e veja, desde já, o caminho.", { size: 20, after: 200 }),
    texto("Para todos os instrumentos", { font: SERIF, size: 25, bold: true, cor: AZUL, after: 60 })];
  P.todos.forEach(t => b.push(texto(`${t.item}: ${t.etapas.map((e, k) => `${ETAPA[k].replace("Para ", "")} — ${e}`).join("; ")}.`, { size: 18, after: 40, indent: { left: 340 } })));
  [["cordas", "Cordas"], ["madeiras", "Madeiras"], ["metais", "Metais"]].forEach(([fam, nome]) => {
    b.push(texto(nome, { font: SERIF, size: 27, bold: true, cor: PRATICA, before: 240, after: 80 }));
    P.instrumentos.filter(i => i.familia === fam).forEach(i => {
      b.push(texto(i.nome, { bold: true, size: 21, before: 100, after: 30 }));
      i.etapas.forEach((e, k) => b.push(new Paragraph({ spacing: { after: 30 }, indent: { left: 340 }, children: [
        new TextRun({ text: `${ETAPA[k]}: `, font: SANS, size: 18, bold: true, color: AZUL }),
        new TextRun({ text: e.metodos.join(" ou ") + ".", font: SANS, size: 18, color: TINTA }),
        ...(e.voz ? [new TextRun({ text: `  ${e.voz}.`, font: SANS, size: 18, bold: true, color: PRATICA })] : [])] })));
    });
  });
  P.observacoes.forEach(o => b.push(texto(`· ${o}`, { size: 18, cor: "3F4C55", after: 30, before: 60 })));
  b.push(texto("Fonte: Congregação Cristã no Brasil — Sugestão de métodos para instrumentos, jan/2018.", { size: 16, italico: true, cor: CINZA }), quebra());
  return b;
}

/* ---------- monta o documento ---------- */

function aulasDoPeriodo(periodo, instrutor) {
  const corpo = [];
  AULAS[periodo].forEach(a => {
    if (instrutor) corpo.push(...roteiro(periodo, a[0]));
    corpo.push(...aula(periodo, a, instrutor));
    const f = faseQueFecha(periodo, a[0]);
    if (f) corpo.push(...analise(f, instrutor), ...(instrutor ? regencia(f) : []));
  });
  return corpo;
}

function documento(periodo, instrutor) {
  const geral = periodo === "geral";
  const corpo = [...capa(periodo, instrutor), ...comoUsar(geral ? 1 : periodo, instrutor)];
  if (geral || periodo === 1) corpo.push(...antesDeComecar());
  if (geral) {
    [1, 2, 3, 4].forEach(p => {
      corpo.push(quebra(), vazio(2400),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
          children: [new TextRun({ text: `${ORDINAL[p]} período`, font: SERIF, size: 52, bold: true, color: AZUL })] }),
        texto(`Fases ${FASES_DO_PERIODO[p][0]} a ${FASES_DO_PERIODO[p].slice(-1)[0]} do MSA · 15 aulas`, { align: AlignmentType.CENTER, cor: CINZA, after: 60 }),
        texto(FASES_DO_PERIODO[p].map(f => FASES.find(x => x.f === f).nome).join(" · "), { align: AlignmentType.CENTER, size: 18, cor: CINZA }),
        quebra());
      corpo.push(...aulasDoPeriodo(p, instrutor));
    });
    corpo.push(...apendices(instrutor), quebra());
  } else {
    corpo.push(...aulasDoPeriodo(periodo, instrutor));
  }
  corpo.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1, spacing: { after: 200 },
      children: [new TextRun({ text: "Referências", font: SERIF, size: 30, bold: true, color: TINTA })],
    }),
    texto("Manual de aplicação das Aulas do MSA — Congregação Cristã no Brasil. Define os quatro períodos, as 16 fases e a sequência das 60 aulas seguida neste caderno, e determina que o conteúdo do MSA seja apresentado por inteiro pelo instrutor."),
    texto("Planos de Aula do MSA, 1º a 4º períodos — CCB/GEM. Origem do roteiro de cada aula no caderno do instrutor."),
    texto("Planejamento do GEM — Atividades das Aulas do MSA (para impressão), 1º a 4º períodos. Origem das listas de hinos de cada aula e das definições usadas nos gabaritos."),
    texto("Programa Mínimo — CCB/Orquestra. Define as três etapas do candidato e as vozes do hinário executadas por cada instrumento."),
    texto("Os exercícios usam o Hinário em Dó, capa preta. O hinário não é reproduzido neste caderno: dele saem apenas informações sobre cada hino — número, tonalidade, fórmula de compasso, marcação, metrônomo e os sinais que ele traz."),
  );

  return new Document({
    creator: "Sistemi Dalessi",
    title: `Estudo do Hinário — ${geral ? "apostila geral" : ORDINAL[periodo] + " Período"} — ${instrutor ? "instrutor" : "candidato"}`,
    description: "Caderno complementar do GEM, alinhado às fases do MSA",
    styles: { default: { document: { run: { font: SANS, size: 21, color: TINTA } } } },
    sections: [{
      properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
      children: corpo,
    }],
  });
}

(async () => {
  const dir = path.join(RAIZ, "apostila");
  fs.mkdirSync(dir, { recursive: true });
  const arg = process.argv[2];
  const periodos = arg === "geral" ? ["geral"] : Number(arg) ? [Number(arg)] : [1, 2, 3, 4, "geral"];
  for (const p of periodos) {
    for (const instrutor of [false, true]) {
      const nome = p === "geral" ? `Apostila-geral-${instrutor ? "instrutor" : "candidato"}.docx`
                                 : `Apostila-${p}o-periodo-${instrutor ? "instrutor" : "candidato"}.docx`;
      fs.writeFileSync(path.join(dir, nome), await Packer.toBuffer(documento(p, instrutor)));
      console.log("gerado:", path.join("apostila", nome));
    }
  }
})();
