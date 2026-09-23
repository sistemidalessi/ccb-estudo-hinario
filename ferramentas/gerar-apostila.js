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
const { hinosDaAula, listasOficiais } = require("./hinos-da-aula.js");

const RAIZ = path.join(__dirname, "..");
const { TIPOS, AULAS, Q, HINOS, PLANOS } = carregar(RAIZ);
const { LICOES } = require(path.join(RAIZ, "dados", "licoes.js"));

const FASES_DO_PERIODO = { 1: [1, 2, 3], 2: [4, 5], 3: [6, 7, 8, 9], 4: [10, 11, 12, 13, 14, 15, 16] };
const ORDINAL = { 1: "1º", 2: "2º", 3: "3º", 4: "4º" };

const SERIF = "Cambria";
const SANS = "Calibri";
const TINTA = "16212A";
const AZUL = "1F5673";
const CINZA = "5C6B75";
const PRATICA = "8A5A2B";
const VERDE = "4A6B3F";
const LARGURA = 9350;                 // largura útil, em DXA
const MAX_FIG = 470;                  // largura máxima da figura, em pontos

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
    const escala = Math.min(MAX_FIG / larg, 1);
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
  const fases = FASES_DO_PERIODO[periodo];
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
      children: [new TextRun({ text: `${ORDINAL[periodo]} Período`, font: SERIF, size: 32, bold: true, color: AZUL })],
    }),
    texto(`Fases ${fases[0]} a ${fases[fases.length - 1]} do MSA · 15 aulas`,
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
  ];

  comum.push(instrutor
    ? caixa([
        texto("Sobre os hinos de cada aula", { bold: true, after: 60 }),
        texto("Quando o caderno de atividades do GEM traz a lista de hinos daquela aula, é ela que aparece — inclusive a observação de ler a partir do 1º compasso completo. Onde o caderno manda o instrutor selecionar os hinos, ou onde não há lista, os hinos são escolhidos pelos dados do próprio hinário: tonalidade, marcação e metrônomo.", { after: 0 }),
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
    linhas.push(texto(`Hinos ${lista_} — ${fecho.porque}.`, { size: 19, italico: true, cor: CINZA, after: 130 }));
  }

  /* ficha e perguntas dos hinos escolhidos */
  fecho.hinos.forEach(h => {
    if (!h.tom) return;                       // hino fora da extração: só o número
    const ficha = [h.tom + " maior", h.marc, h.met ? "♩ = " + h.met : "", h.ind].filter(Boolean).join(" · ");
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

/* ---------- monta o documento ---------- */

function documento(periodo, instrutor) {
  const corpo = [...capa(periodo, instrutor), ...comoUsar(periodo, instrutor)];
  AULAS[periodo].forEach(a => {
    if (instrutor) corpo.push(...roteiro(periodo, a[0]));
    corpo.push(...aula(periodo, a, instrutor));
  });
  corpo.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1, spacing: { after: 200 },
      children: [new TextRun({ text: "Referências", font: SERIF, size: 30, bold: true, color: TINTA })],
    }),
    texto("Manual de aplicação das Aulas do MSA — Congregação Cristã no Brasil. Define os quatro períodos, as 16 fases e a sequência das 60 aulas seguida neste caderno, e determina que o conteúdo do MSA seja apresentado por inteiro pelo instrutor."),
    texto("Planos de Aula do MSA, 1º a 4º períodos — CCB/GEM. Origem do roteiro de cada aula no caderno do instrutor."),
    texto("Planejamento do GEM — Atividades das Aulas do MSA (para impressão), 1º a 4º períodos. Origem das listas de hinos de cada aula e das definições usadas nos gabaritos."),
    texto("Programa Mínimo — CCB/Orquestra. Define as três etapas do candidato e as vozes do hinário executadas por cada instrumento."),
    texto("Os exercícios usam o Hinário em Dó, capa preta. O hinário não é reproduzido neste caderno: dele saem apenas número, tonalidade, marcação e metrônomo."),
  );

  return new Document({
    creator: "Sistemi Dalessi",
    title: `Estudo do Hinário — ${ORDINAL[periodo]} Período — ${instrutor ? "instrutor" : "candidato"}`,
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
  const pedido = Number(process.argv[2]);
  const periodos = pedido ? [pedido] : [1, 2, 3, 4];
  for (const p of periodos) {
    for (const instrutor of [false, true]) {
      const nome = `Apostila-${p}o-periodo-${instrutor ? "instrutor" : "candidato"}.docx`;
      fs.writeFileSync(path.join(dir, nome), await Packer.toBuffer(documento(p, instrutor)));
      console.log("gerado:", path.join("apostila", nome));
    }
  }
})();
