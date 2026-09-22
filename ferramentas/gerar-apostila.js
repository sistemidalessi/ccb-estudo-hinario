/* Gera a apostila impressa de um período a partir do mesmo banco de questões
   que alimenta o site.

   Uso:  node ferramentas/gerar-apostila.js 1
   Saída: apostila/Apostila-1o-periodo-aluno.docx
          apostila/Apostila-1o-periodo-gabarito.docx

   Só gera o período cujas questões já tenham o campo `a` (aula) preenchido.
*/
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, PageBreak, Table, TableRow, TableCell, WidthType, ShadingType,
} = require("docx");
const { carregar } = require("./carregar.js");

const RAIZ = path.join(__dirname, "..");
const { TIPOS, AULAS, Q } = carregar(RAIZ);

const periodo = Number(process.argv[2] || 1);
const FASES_DO_PERIODO = { 1: [1, 2, 3], 2: [4, 5], 3: [6, 7, 8, 9], 4: [10, 11, 12, 13, 14, 15, 16] };
const ORDINAL = { 1: "1º", 2: "2º", 3: "3º", 4: "4º" };

const SERIF = "Cambria";
const SANS = "Calibri";
const TINTA = "16212A";
const AZUL = "1F5673";
const CINZA = "5C6B75";

/* ---------- blocos reutilizáveis ---------- */

const vazio = (espaco = 120) => new Paragraph({ spacing: { after: espaco }, children: [] });

function texto(t, o = {}) {
  return new Paragraph({
    spacing: { after: o.after ?? 120, line: o.line ?? 300 },
    alignment: o.align,
    indent: o.indent,
    children: [new TextRun({
      text: t, font: o.font ?? SANS, size: o.size ?? 21,
      bold: o.bold, italics: o.italico, color: o.cor ?? TINTA, allCaps: o.caps,
      characterSpacing: o.caps ? 16 : undefined,
    })],
  });
}

/* linha pontilhada para o aluno escrever */
function linhaResposta(qtd = 2) {
  return Array.from({ length: qtd }, () => new Paragraph({
    spacing: { before: 200, after: 0 },
    indent: { left: 340 },
    border: { bottom: { style: BorderStyle.DOTTED, size: 6, space: 2, color: "AFBAC0" } },
    children: [new TextRun({ text: "", size: 20 })],
  }));
}

/* caixa cinza de uma linha só, usada nos cabeçalhos de aula e nos avisos */
function caixa(linhas, o = {}) {
  return new Table({
    columnWidths: [9350],
    width: { size: 9350, type: WidthType.DXA },
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
        width: { size: 9350, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: o.fundo ?? "F2F4F3" },
        margins: { top: 140, bottom: 140, left: 200, right: 200 },
        children: linhas,
      })],
    })],
  });
}

/* ---------- capa ---------- */

function capa(gabarito) {
  return [
    vazio(1400),
    texto("Congregação Cristã no Brasil", { align: AlignmentType.CENTER, caps: true, size: 18, cor: CINZA, after: 60 }),
    texto("Grupo de Estudos Musicais", { align: AlignmentType.CENTER, caps: true, size: 18, cor: CINZA, after: 700 }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 160 },
      children: [new TextRun({ text: "Estudo do Hinário", font: SERIF, size: 56, bold: true, color: TINTA })],
    }),
    texto("Caderno de exercícios complementares", { align: AlignmentType.CENTER, font: SERIF, size: 24, italico: true, cor: CINZA, after: 500 }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 100 },
      border: { top: { style: BorderStyle.SINGLE, size: 8, space: 12, color: AZUL } },
      children: [new TextRun({ text: `${ORDINAL[periodo]} Período`, font: SERIF, size: 32, bold: true, color: AZUL })],
    }),
    texto(`Fases ${FASES_DO_PERIODO[periodo][0]} a ${FASES_DO_PERIODO[periodo].slice(-1)[0]} do MSA`,
      { align: AlignmentType.CENTER, size: 20, cor: CINZA, after: gabarito ? 700 : 1100 }),
    ...(gabarito
      ? [caixa([texto("Caderno do instrutor — contém os gabaritos", { caps: true, size: 18, cor: AZUL, after: 0, bold: true })],
          { fundo: "DDE8ED" }), vazio(900)]
      : [
          texto("Nome: ________________________________________________________", { size: 22, after: 280 }),
          texto("Comum congregação: ____________________________________________", { size: 22, after: 280 }),
          texto("Instrumento: ______________________  Ano letivo: ______________", { size: 22, after: 900 }),
        ]),
    texto("Material complementar. O MSA impresso continua sendo o material didático da aula.",
      { align: AlignmentType.CENTER, size: 17, italico: true, cor: CINZA, after: 0 }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ---------- página de instruções ---------- */

function comoUsar(gabarito) {
  const tiposUsados = [...new Set(Q.filter(q => FASES_DO_PERIODO[periodo].includes(q.f)).map(q => q.k))];
  const papel = tiposUsados.filter(k => TIPOS[k].canal === "papel");
  const pratica = tiposUsados.filter(k => TIPOS[k].canal === "pratica");

  return [
    new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 220 },
      children: [new TextRun({ text: "Como usar este caderno", font: SERIF, size: 32, bold: true, color: TINTA })] }),

    texto("Este caderno acompanha as aulas do MSA, aula por aula, na mesma ordem do Manual de aplicação. Ele não substitui o MSA: o conteúdo continua sendo apresentado pelo instrutor a partir do método impresso. O que está aqui são os exercícios de fixação, para serem feitos com o hinário em mãos."),
    texto("O hino de cada exercício é indicado pelo instrutor. Os exercícios seguem o Hinário em Dó, capa preta."),

    vazio(200),
    texto("Os tipos de exercício", { font: SERIF, size: 24, bold: true, after: 140 }),
    texto("No papel — " + papel.map(k => `${TIPOS[k].rot} (${TIPOS[k].desc})`).join(" · ")),
    texto("Na prática — " + pratica.map(k => `${TIPOS[k].rot} (${TIPOS[k].desc})`).join(" · ")),
    texto("Os exercícios de prática não se respondem por escrito: são apresentados ao instrutor, que assina a data ao lado.", { italico: true, cor: CINZA }),

    vazio(200),
    texto("Os níveis", { font: SERIF, size: 24, bold: true, after: 140 }),
    texto("Cada exercício traz um nível de 1 a 3. Nível 1 é reconhecer o que está escrito; nível 2 é explicar por que é assim; nível 3 é aplicar, comparar ou decidir. Não é nota — é para o candidato saber o que ainda falta."),

    vazio(200),
    ...(gabarito
      ? [caixa([texto("Este exemplar traz os gabaritos e é de uso do instrutor. O caderno do candidato é o outro arquivo, sem as respostas.", { after: 0 })], { faixa: "7B2D3A", fundo: "F6ECEE" })]
      : [caixa([texto("Onde a resposta depende do hino escolhido, o gabarito está no caderno do instrutor. Traga suas dúvidas para a aula seguinte — é para isso que elas servem.", { after: 0 })])]),

    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/* ---------- uma aula ---------- */

function aula([num, tops, assunto], gabarito) {
  const doAula = Q.filter(q => q.a === num && FASES_DO_PERIODO[periodo].includes(q.f));
  const blocos = [];

  blocos.push(new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { after: 60 },
    children: [new TextRun({ text: `Aula ${num}`, font: SERIF, size: 30, bold: true, color: AZUL })],
  }));
  blocos.push(new Paragraph({
    spacing: { after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, space: 6, color: "D6DCDA" } },
    children: [new TextRun({ text: assunto, font: SERIF, size: 26, color: TINTA })],
  }));
  blocos.push(texto(tops ? `MSA · tópicos ${tops}` : "MSA · continuação da aula anterior",
    { size: 17, caps: true, cor: CINZA, after: 260 }));

  if (!doAula.length) {
    blocos.push(caixa([
      texto("Avaliação do período", { bold: true, after: 80 }),
      texto("A folha de avaliação é montada pelo instrutor no gerador de fichas, em sistemidalessi.github.io/ccb-estudo-hinario — assim cada turma recebe uma avaliação diferente, cobrindo todas as fases do período.", { after: 0 }),
    ]));
    blocos.push(new Paragraph({ children: [new PageBreak()] }));
    return blocos;
  }

  doAula.forEach((q, i) => {
    const t = TIPOS[q.k];
    blocos.push(new Paragraph({
      spacing: { before: 260, after: 60 },
      children: [
        new TextRun({ text: `${i + 1}. `, font: SANS, size: 21, bold: true, color: TINTA }),
        new TextRun({ text: t.rot.toUpperCase() + "  ", font: SANS, size: 16, bold: true,
          color: t.canal === "papel" ? AZUL : "8A5A2B", characterSpacing: 16 }),
        new TextRun({ text: "nível " + q.n, font: SANS, size: 16, color: CINZA }),
      ],
    }));
    blocos.push(new Paragraph({
      spacing: { after: 40, line: 300 }, indent: { left: 340 },
      children: [new TextRun({ text: q.q, font: SANS, size: 21, color: TINTA })],
    }));

    if (gabarito) {
      blocos.push(new Paragraph({
        spacing: { before: 100, after: 60 }, indent: { left: 340 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, space: 8, color: "4A6B3F" } },
        children: [new TextRun({ text: q.g, font: SANS, size: 19, color: "3F4C55" })],
      }));
    } else if (t.canal === "pratica") {
      blocos.push(new Paragraph({
        spacing: { before: 140, after: 60 }, indent: { left: 340 },
        children: [new TextRun({ text: "Apresentado ao instrutor em ____ / ____ / ______        Visto: ______________",
          font: SANS, size: 19, color: CINZA })],
      }));
    } else {
      blocos.push(...linhaResposta(q.k === "criar" || q.n === 3 ? 3 : 2));
    }
  });

  blocos.push(new Paragraph({ children: [new PageBreak()] }));
  return blocos;
}

/* ---------- monta o documento ---------- */

function documento(gabarito) {
  const corpo = [...capa(gabarito), ...comoUsar(gabarito)];
  AULAS[periodo].forEach(a => corpo.push(...aula(a, gabarito)));
  corpo.push(
    new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 200 },
      children: [new TextRun({ text: "Referências", font: SERIF, size: 30, bold: true, color: TINTA })] }),
    texto("Manual de aplicação das Aulas do MSA, versão 2.7 — Congregação Cristã no Brasil. Define os quatro períodos, as 16 fases e a sequência das 60 aulas seguida neste caderno."),
    texto("Programa Mínimo — CCB/Orquestra, março de 2018. Define as três etapas do candidato e as vozes do hinário executadas por cada instrumento."),
    texto("Os exercícios usam o Hinário em Dó, capa preta, conforme orientação do MSA. O hinário não é reproduzido neste caderno."),
  );

  return new Document({
    creator: "Sistemi Dalessi",
    title: `Estudo do Hinário — ${ORDINAL[periodo]} Período${gabarito ? " — gabarito" : ""}`,
    description: "Caderno de exercícios complementares do GEM, alinhado às fases do MSA",
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
  for (const gab of [false, true]) {
    const nome = `Apostila-${periodo}o-periodo-${gab ? "gabarito" : "aluno"}.docx`;
    fs.writeFileSync(path.join(dir, nome), await Packer.toBuffer(documento(gab)));
    console.log("gerado:", path.join("apostila", nome));
  }
})();
