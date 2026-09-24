/* Gera as figuras da apostila em SVG e escreve a página que o render.mjs
   fotografa. Uma figura por id; o nome do arquivo é o id.

   Projeto pensado para a PÁGINA, não para a tela: em gerar-apostila.js cada
   pixel de projeto vale 0,72 ponto, sempre, em todas as figuras. Por isso a
   largura útil aqui é estreita (W = 640 ≈ 16 cm impressos) e os elementos são
   grandes — uma figura desenhada larga encolheria na página e viraria fio de
   cabelo. */
const fs = require("fs"), path = require("path");
const f = require("./desenho.js");
const { COR, D, el, posY, pauta, nota, barra, pausa, claveSol, claveFa, claveDo,
        sustenido, bemol, bequadro, fermata, barraCompasso, formula, rotulo, rotuloDir,
        chave, svg } = f;

const W = 640;                       // largura útil de uma figura de página inteira
const TAM = { titulo: 20, forte: 16, corpo: 15, leg: 13.5, mini: 12.5 };

const FIGS = {};

/* Ligadura (de valor ou de portamento): curva mais grossa no meio, como na
   gravura, do lado oposto às hastes. dy: diferença de altura entre as notas. */
function ligadura(x1, x2, y, embaixo = true, cor = COR.tinta, dy = 0) {
  const s = embaixo ? 1 : -1, mx = (x1 + x2) / 2, alto = 0.9 * D + Math.abs(dy) * 0.25;
  const e1 = 0.1 * D, e2 = 0.3 * D;
  const a = `M${x1 + 4} ${y}`, b = `${x2 - 4} ${y + dy}`;
  return el("path", { d: `${a} Q${mx} ${y + dy / 2 + s * alto} ${b} Q${mx} ${y + dy / 2 + s * (alto - e2)} ${x1 + 4} ${y} z`,
    fill: cor, stroke: cor, "stroke-width": e1, "stroke-linejoin": "round" });
}
const centro = (y, t, o = {}) => rotulo(W / 2, y, t, { centro: 1, tam: o.tam || TAM.leg, cor: o.cor, forte: o.forte });

/* Legenda de rodapé, quebrada em linhas de no máximo `max` caracteres. */
function legenda(y, texto, max = 86) {
  const palavras = texto.split(" ");
  const linhas = [];
  let atual = "";
  for (const p of palavras) {
    if ((atual + " " + p).trim().length > max) { linhas.push(atual.trim()); atual = p; }
    else atual += " " + p;
  }
  if (atual.trim()) linhas.push(atual.trim());
  return { alt: linhas.length * 19, svg: linhas.map((l, i) => centro(y + i * 19, l)).join("") };
}

/* ---------- 1. o pentagrama ---------- */
FIGS["pentagrama"] = () => {
  const topo = 50, x = 128, larg = 336;
  let c = centro(26, "as linhas contam-se de baixo para cima", { tam: TAM.leg });
  c += pauta(x, topo, larg);
  for (let i = 0; i < 5; i++) c += rotuloDir(x - 14, topo + i * D + 6, `${5 - i}ª linha`, { tam: TAM.corpo });
  for (let i = 0; i < 4; i++)
    c += rotulo(x + larg + 14, topo + i * D + D / 2 + 6, `${4 - i}º espaço`, { tam: TAM.corpo, cor: COR.destaque });
  return svg(W, topo + 4 * D + 26, c);
};

/* ---------- 2. as três claves ---------- */
FIGS["claves"] = () => {
  const quais = [
    [claveSol, 2, "clave de Sol", "na 2ª linha", "violino, flauta, oboé, clarinete, saxofone, trompete"],
    [claveFa, 6, "clave de Fá", "na 4ª linha", "violoncelo, fagote"],
    [claveDo, 4, "clave de Dó", "na 3ª linha", "viola"],
  ];
  const x = 40, larg = 220, alt = 8.4 * D;
  let c = "";
  quais.forEach(([fn, linha, nome, onde, quem], i) => {
    const topo = 42 + i * alt;
    c += pauta(x, topo, larg) + fn(x + 56, topo);
    c += el("line", { x1: x, y1: posY(topo, linha), x2: x + larg, y2: posY(topo, linha),
                      stroke: COR.destaque, "stroke-width": 3.2 });
    c += rotulo(x + larg + 28, topo + 2 * D - 4, nome, { tam: TAM.forte, forte: 1, cor: COR.tinta });
    c += rotulo(x + larg + 28, topo + 2 * D + 16, onde, { tam: TAM.corpo, cor: COR.destaque });
    c += rotulo(x + larg + 28, topo + 2 * D + 35, quem, { tam: TAM.mini });
  });
  const leg = legenda(42 + 3 * alt - 2 * D, "a linha em azul é a que dá nome à clave: é ali que mora a nota Sol, Fá ou Dó");
  return svg(W, 42 + 3 * alt - 2 * D + leg.alt + 6, c + leg.svg);
};

/* ---------- 3. o endecagrama ---------- */
FIGS["endecagrama"] = () => {
  const x = 122, larg = 300, topoG = 36, topoF = topoG + 6 * D;
  let c = pauta(x, topoG, larg) + pauta(x, topoF, larg);
  c += claveSol(x + 46, topoG) + claveFa(x + 46, topoF);
  c += nota(x + 200, topoG, -2, 1, { cor: COR.alerta });
  c += rotulo(x + larg + 16, topoG + 5 * D + 6, "Dó3 — o Dó Central", { tam: TAM.forte, forte: 1, cor: COR.alerta });
  c += rotuloDir(x - 14, topoG + 2 * D + 6, "clave de Sol", { tam: TAM.corpo });
  c += rotuloDir(x - 14, topoF + 2 * D + 6, "clave de Fá", { tam: TAM.corpo });
  const base = topoF + 4 * D + 30;
  const leg = legenda(base, "as duas pautas mais a linha do Dó Central formam o endecagrama: onze linhas, do som mais grave ao mais agudo");
  return svg(W, base + leg.alt + 6, c + leg.svg);
};

/* ---------- 4. figuras de som e de silêncio ---------- */
FIGS["figuras"] = () => {
  const linhas = [
    [1, "semibreve", "4 tempos"], [2, "mínima", "2 tempos"], [4, "semínima", "1 tempo"],
    [8, "colcheia", "meio tempo"], [16, "semicolcheia", "um quarto"],
  ];
  const cx = { som: 90, pausa: 236, nome: 400, vale: 546 }, topo = 82, alt = 7.2 * D;
  let c = [["som", "figura de som"], ["pausa", "figura de silêncio"], ["nome", "nome"], ["vale", "vale, em 4/4"]]
    .map(([k, t]) => rotulo(cx[k], 40, t, { centro: 1, tam: TAM.leg, forte: 1, cor: COR.destaque })).join("");
  linhas.forEach(([dur, nome, vale], i) => {
    const y = topo + i * alt, t = y - 2 * D;
    if (i) c += el("line", { x1: 40, y1: y - alt / 2 + 8, x2: W - 40, y2: y - alt / 2 + 8, stroke: COR.borda, "stroke-width": 1 });
    // trecho de pauta atrás da pausa: sem ele, semibreve e mínima ficam iguais
    c += pauta(cx.pausa - 46, t, 92, { fina: 1, cor: COR.borda });
    c += nota(cx.som, t, 4, dur, { haste: "baixo" }) + pausa(cx.pausa, t, dur);
    c += rotulo(cx.nome, y + 6, nome, { centro: 1, tam: TAM.forte, cor: COR.tinta });
    c += rotulo(cx.vale, y + 6, vale, { centro: 1, tam: TAM.forte });
  });
  const base = topo + 4 * alt + 4.8 * D;
  const leg = legenda(base, "cada figura vale o dobro da seguinte — e a pausa ao lado vale o mesmo, em silêncio");
  return svg(W, base + leg.alt + 6, c + leg.svg);
};

/* ---------- 5. ordem dos acidentes na armadura ---------- */
FIGS["acidentes"] = () => {
  // ordem dos sustenidos: Fá Dó Sol Ré Lá Mi Si · dos bemóis, a inversa
  const sus = [[8, "Fá"], [5, "Dó"], [9, "Sol"], [6, "Ré"], [3, "Lá"], [7, "Mi"], [4, "Si"]];
  const bem = [[4, "Si"], [7, "Mi"], [3, "Lá"], [6, "Ré"], [2, "Sol"], [5, "Dó"], [1, "Fá"]];
  const x = 128, larg = 400, topo = 56, topo2 = topo + 9.2 * D;
  let c = "";
  [[topo, sus, sustenido, "sustenidos"], [topo2, bem, bemol, "bemóis"]].forEach(([t, lista, glifo, rot]) => {
    c += pauta(x, t, larg) + claveSol(x + 46, t) + rotuloDir(x - 14, t + 2 * D + 6, rot, { tam: TAM.forte, forte: 1, cor: COR.tinta });
    lista.forEach(([p, n], i) => {
      const px = x + 118 + i * 40;
      c += glifo(px, posY(t, p));
      c += rotulo(px, t + 4 * D + 34, n, { centro: 1, tam: TAM.leg });
    });
  });
  const base = topo2 + 4 * D + 58;
  const leg = legenda(base, "a ordem é sempre esta, e a dos bemóis é a dos sustenidos de trás para a frente");
  return svg(W, base + leg.alt + 6, c + leg.svg);
};

/* ---------- 6. ritmos iniciais ---------- */
FIGS["ritmos-iniciais"] = () => {
  const x = 96, larg = 460, alt = 8.2 * D;
  // Em 4/4: o tético e o acéfalo têm o compasso completo; o anacrúsico traz a
  // nota inicial ANTES da barra, e o primeiro compasso vem inteiro depois dela.
  const casos = [
    ["Tético", "a 1ª nota cai no tempo forte do 1º compasso", t =>
      [0, 1, 2, 3].map(i => nota(x + 130 + i * 96, t, [4, 5, 6, 4][i], 4)).join("")],
    ["Anacrúsico", "a nota inicial vem antes do 1º compasso", t =>
      nota(x + 58, t, 2, 4, { cor: COR.alerta }) + barraCompasso(x + 88, t) +
      [0, 1, 2, 3].map(i => nota(x + 150 + i * 84, t, [4, 5, 6, 4][i], 4)).join("")],
    ["Acéfalo", "o 1º tempo é pausa, e no hinário ela não vem escrita", t =>
      pausa(x + 130, t, 4, COR.alerta) +
      [1, 2, 3].map(i => nota(x + 130 + i * 96, t, [0, 5, 6, 4][i], 4)).join("")],
  ];
  let c = "";
  casos.forEach(([nome, desc, dentro], i) => {
    const t = 64 + i * alt;
    c += rotulo(x, t - 34, nome, { tam: TAM.forte + 2, forte: 1, cor: COR.tinta });
    c += rotulo(x + 116, t - 34, desc, { tam: TAM.mini });
    c += pauta(x, t, larg) + formula(x + 26, t, "4", "4") + dentro(t);
  });
  return svg(W, 64 + 2 * alt + 4 * D + 40, c);
};

/* ---------- 7. síncopa e contratempo ---------- */
FIGS["sincopa"] = () => {
  const x = 150, T = 94, p = 3;                     // T = largura de um tempo; 2º espaço
  const topo = 60, topo2 = topo + 9.4 * D;
  const ticks = (t, fortes) => [0, 1, 2, 3].map(i => {
    const px = x + 96 + i * T, on = fortes.includes(i);
    return el("line", { x1: px, y1: t + 4 * D + 10, x2: px, y2: t + 4 * D + 26,
        stroke: on ? COR.alerta : COR.borda, "stroke-width": on ? 3 : 1.5 })
      + rotulo(px, t + 4 * D + 44, String(i + 1), { centro: 1, tam: TAM.mini, cor: on ? COR.alerta : COR.apagado });
  }).join("");

  let c = pauta(x, topo, 470) + formula(x + 26, topo, "4", "4")
        + pauta(x, topo2, 470) + formula(x + 26, topo2, "4", "4");
  // Síncopa: ♪ ♩ ♪ 𝅗𝅥 — a semínima nasce na parte fraca e atravessa o 2º tempo
  c += el("rect", { x: x + 96 + T / 2 - 6, y: topo - 8, width: T + 12, height: 4 * D + 16, fill: COR.alerta, opacity: .1 });
  c += nota(x + 96, topo, p, 8) + nota(x + 96 + T / 2, topo, p, 4)
     + nota(x + 96 + T * 1.5, topo, p, 8) + nota(x + 96 + T * 2, topo, p, 2);
  c += ticks(topo, [1]);
  // Contratempo: pausa no tempo, nota depois — quatro vezes
  [0, 1, 2, 3].forEach(i => {
    c += pausa(x + 96 + i * T, topo2, 8, COR.alerta) + nota(x + 96 + i * T + T / 2, topo2, p, 8);
  });
  c += ticks(topo2, [0, 1, 2, 3]);
  c += rotuloDir(x - 18, topo + 2 * D - 2, "Síncopa", { tam: TAM.forte + 2, forte: 1, cor: COR.tinta });
  c += rotuloDir(x - 18, topo + 2 * D + 20, "atravessa o tempo", { tam: TAM.mini });
  c += rotuloDir(x - 18, topo2 + 2 * D - 2, "Contratempo", { tam: TAM.forte + 2, forte: 1, cor: COR.tinta });
  c += rotuloDir(x - 18, topo2 + 2 * D + 20, "entra depois dele", { tam: TAM.mini });
  const base = topo2 + 4 * D + 68;
  const leg = legenda(base, "na síncopa o som nasce na parte fraca do tempo e se prolonga pela parte forte do tempo seguinte, sem ser reatacado; no contratempo a parte forte fica em silêncio e o som entra depois");
  return svg(W, base + leg.alt + 6, c + leg.svg);
};

/* ---------- 8. tercina ---------- */
FIGS["tercina"] = () => {
  // 2º espaço: haste para cima pela regra, e o "3" fica do lado da barra
  const topo = 104, x = 60, p = 3, y = posY(topo, p);
  let c = pauta(x, topo, 520) + formula(x + 26, topo, "4", "4");
  const grupo = (x0, n, marcar) => {
    let g = "";
    for (let i = 0; i < n; i++) g += nota(x0 + i * 44, topo, p, 8, { haste: "cima", semFlag: 1 });
    g += barra(x0, x0 + (n - 1) * 44, topo, p, p, true);
    return g;
  };
  c += grupo(x + 120, 2) + chave(x + 104, x + 180, y - 3.7 * D - 30, "1 tempo: duas colcheias");
  c += el("rect", { x: x + 246, y: y - 18, width: 44, height: 36, fill: "#fff" });
  c += rotulo(x + 268, y + 9, "=", { tam: 30, cor: COR.apagado, centro: 1, forte: 1 });
  c += grupo(x + 352, 3) + chave(x + 336, x + 456, y - 3.7 * D - 30, "o mesmo tempo: três colcheias");
  c += rotulo(x + 396, y - 3.7 * D - 10, "3", { centro: 1, tam: 20, forte: 1, cor: COR.alerta });
  const base = topo + 4 * D + 34;
  const leg = legenda(base, "a tercina põe três figuras onde caberiam duas do mesmo valor — o tempo não muda; muda a divisão dele");
  return svg(W, base + leg.alt + 6, c + leg.svg);
};

/* ---------- 9. as duas ligaduras ---------- */
FIGS["ligaduras"] = () => {
  const x = 150, larg = 230, alt = 7.4 * D;
  const bloco = (t, pa, pb, cor, titulo, sub) => {
    let g = pauta(x, t, larg);
    g += nota(x + 74, t, pa, 4) + nota(x + 150, t, pb, 4);
    g += ligadura(x + 74, x + 150, posY(t, pa) + 0.8 * D, true, cor, posY(t, pb) - posY(t, pa));
    g += rotulo(x + larg + 30, t + 2 * D - 4, titulo, { tam: TAM.forte, forte: 1, cor });
    g += rotulo(x + larg + 30, t + 2 * D + 18, sub[0], { tam: TAM.mini });
    g += rotulo(x + larg + 30, t + 2 * D + 36, sub[1], { tam: TAM.mini });
    return g;
  };
  // notas abaixo da 3ª linha: haste para cima pela regra, ligadura por baixo
  let c = bloco(60, 2, 2, COR.destaque, "de VALOR", ["mesma altura · soma as durações", "toca-se uma vez só"]);
  c += bloco(60 + alt, 1, 3, COR.alerta, "de PORTAMENTO", ["alturas diferentes, sem interrupção", "tocam-se as duas, ligadas"]);
  const base = 60 + alt + 4 * D + 34;
  const leg = legenda(base, "no hinário há estas duas ligaduras, e só estas duas");
  return svg(W, base + leg.alt + 6, c + leg.svg);
};

/* ---------- 10. ponto de aumento ---------- */
FIGS["ponto"] = () => {
  const topo = 100, x = 66, p = 3, y = posY(topo, p);
  let c = pauta(x, topo, 508) + formula(x + 26, topo, "4", "4");
  c += nota(x + 130, topo, p, 4, { pontos: 1 });
  c += chave(x + 110, x + 168, y - 3.7 * D - 24, "1 tempo e meio");
  c += el("rect", { x: x + 228, y: y - 18, width: 44, height: 36, fill: "#fff" });
  c += rotulo(x + 250, y + 9, "=", { tam: 30, cor: COR.apagado, centro: 1, forte: 1 });
  c += nota(x + 336, topo, p, 4) + nota(x + 412, topo, p, 8);
  c += ligadura(x + 336, x + 412, y + 0.8 * D, true, COR.destaque);
  c += chave(x + 318, x + 432, y - 3.7 * D - 24, "1 tempo + meio tempo");
  const base = topo + 4 * D + 34;
  const leg = legenda(base, "o ponto vale metade da figura que está à esquerda dele");
  return svg(W, base + leg.alt + 6, c + leg.svg);
};

/* ---------- 11. os quatro tempos da fermata ---------- */
FIGS["fermata"] = () => {
  const topo = 92, x = 60, p = 5;
  let c = pauta(x, topo, 520) + formula(x + 26, topo, "4", "4");
  // da 3ª linha para cima, haste para baixo; a fermata vai acima da pauta
  c += nota(x + 108, topo, p, 4) + nota(x + 160, topo, 4, 4);
  c += nota(x + 226, topo, p, 2) + fermata(x + 226, topo - 0.7 * D);
  c += barraCompasso(x + 330, topo);
  // o compasso seguinte fica em aberto de propósito: é só a retomada
  [0, 1, 2, 3].forEach(i => { c += nota(x + 382 + i * 42, topo, [4, 5, 6, 4][i], 4); });
  c += barraCompasso(x + 520, topo);
  const yb = topo + 6 * D + 4;          // abaixo das hastes, que descem da pauta
  // Os quatro tempos da fermata numa linha só: empilhá-los fazia os tracejados
  // cruzarem o texto uns dos outros.
  c += el("line", { x1: x + 226, y1: yb - 4, x2: x + 226, y2: yb + 22,
                    stroke: COR.alerta, "stroke-width": 1.8, "stroke-dasharray": "4 3" });
  c += el("line", { x1: x + 382, y1: yb - 4, x2: x + 382, y2: yb + 22,
                    stroke: COR.destaque, "stroke-width": 1.8, "stroke-dasharray": "4 3" });
  const etapas = [["1. prolonga o som", COR.alerta], ["2. para, em silêncio", COR.alerta],
                  ["3. respira", COR.alerta], ["4. retoma na velocidade de antes", COR.destaque]];
  let px = 34;
  etapas.forEach(([t, cor], i) => {
    c += rotulo(px, yb + 44, t, { tam: TAM.leg, cor, forte: 1 });
    px += t.length * 6.35 + 8;
    if (i < etapas.length - 1) { c += rotulo(px, yb + 44, "›", { tam: TAM.forte, cor: COR.borda }); px += 16; }
  });
  return svg(W, yb + 64, c);
};

/* ---------- 12. movimentos de solfejo ---------- */
const PONTOS = {
  2: [[168, 172, "abaixo"], [224, 62, "acima"]],
  3: [[146, 172, "abaixo"], [258, 138, "fora"], [208, 60, "acima"]],
  4: [[176, 172, "abaixo"], [70, 162, "dentro"], [268, 148, "fora"], [228, 58, "acima"]],
};
function movimento(base, pulsos, titulo, rodape) {
  const P = PONTOS[base], larg = 380, alt = 272;
  let c = el("defs", {}, el("marker", { id: "mv", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" },
    el("path", { d: "M0 0 L10 5 L0 10 z", fill: COR.tinta })));
  for (let i = 0; i < P.length; i++) {
    const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length];
    const ultimo = i === P.length - 1;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (ultimo ? 0 : -28);
    c += el("path", { d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, fill: "none",
      stroke: ultimo ? COR.borda : COR.tinta, "stroke-width": 2.4,
      "stroke-dasharray": ultimo ? "6 5" : "", "marker-end": "url(#mv)" });
  }
  P.forEach(([px, py, onde], i) => {
    if (pulsos === 1) {
      c += el("circle", { cx: px, cy: py, r: 17, fill: COR.destaque });
      c += rotulo(px, py + 7, String(i + 1), { centro: 1, tam: 18, forte: 1, cor: "#fff" });
    } else {
      c += el("rect", { x: px - 36, y: py - 17, width: 72, height: 34, rx: 17, fill: COR.destaque });
      c += rotulo(px, py + 6, `${i * 3 + 1}·${i * 3 + 2}·${i * 3 + 3}`, { centro: 1, tam: TAM.forte, forte: 1, cor: "#fff" });
    }
    // o rótulo do ponto de cima vai para o lado, senão bate no título
    c += py > 110 ? rotulo(px, py + 44, onde, { centro: 1, tam: TAM.leg })
                  : rotulo(px + (pulsos === 1 ? 26 : 44), py + 6, onde, { tam: TAM.leg });
  });
  c += rotulo(larg / 2, 30, titulo, { centro: 1, tam: 22, forte: 1, cor: COR.tinta });
  if (rodape) c += rotulo(larg / 2, alt - 16, rodape, { centro: 1, tam: TAM.mini });
  return svg(larg, alt, c);
}
FIGS["mov2"] = () => movimento(2, 1, "Movimento em 2", "1 abaixo · 2 acima");
FIGS["mov3"] = () => movimento(3, 1, "Movimento em 3", "1 abaixo · 2 fora · 3 acima");
FIGS["mov4"] = () => movimento(4, 1, "Movimento em 4", "1 abaixo · 2 dentro · 3 fora · 4 acima");
FIGS["mov6"] = () => movimento(2, 3, "Movimento em 6", "o gesto do compasso em 2, com 3 pulsos por tempo");
FIGS["mov9"] = () => movimento(3, 3, "Movimento em 9", "o gesto do compasso em 3, com 3 pulsos por tempo");
FIGS["mov12"] = () => movimento(4, 3, "Movimento em 12", "o gesto do compasso em 4, com 3 pulsos por tempo");

/* ---------- 13. fórmula de compasso ---------- */
FIGS["formula"] = () => {
  const topo = 74, x = 56, larg = 500;
  let c = pauta(x, topo, larg) + formula(x + 38, topo, "4", "4");
  c += el("defs", {}, el("marker", { id: "sf", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" },
    el("path", { d: "M0 0 L10 5 L0 10 z", fill: COR.destaque })));
  c += el("path", { d: `M${x + 56} ${topo - 8} L${x + 112} ${topo - 34}`, fill: "none", stroke: COR.destaque, "stroke-width": 2.4, "marker-end": "url(#sf)" });
  c += el("path", { d: `M${x + 56} ${topo + 4 * D + 8} L${x + 112} ${topo + 4 * D + 40}`, fill: "none", stroke: COR.destaque, "stroke-width": 2.4, "marker-end": "url(#sf)" });
  c += rotulo(x + 120, topo - 30, "número de CIMA — quantos tempos há no compasso", { tam: TAM.corpo, cor: COR.destaque, forte: 1 });
  c += rotulo(x + 120, topo + 4 * D + 46, "número de BAIXO — que figura vale um tempo", { tam: TAM.corpo, cor: COR.destaque, forte: 1 });
  [0, 1, 2, 3].forEach(i => {
    c += nota(x + 186 + i * 72, topo, 3, 4);
    c += rotulo(x + 186 + i * 72, topo + 4 * D + 22, String(i + 1), { centro: 1, tam: TAM.leg });
  });
  c += barraCompasso(x + 470, topo);
  c += rotulo(x + 470, topo + 4 * D + 22, "barra de compasso", { centro: 1, tam: TAM.mini });
  return svg(W, topo + 4 * D + 62, c);
};

/* ---------- 14. acentuação métrica ---------- */
FIGS["acentuacao"] = () => {
  const pesos = [["1º tempo", "FORTE", 104, COR.destaque, "#fff"],
                 ["2º tempo", "fraco", 66, COR.fundo, COR.tinta],
                 ["3º tempo", "meio-forte", 86, COR.claro, "#fff"],
                 ["4º tempo", "fraco", 66, COR.fundo, COR.tinta]];
  let c = "", base = 156, larg = 136, gap = 14, x0 = (W - (4 * larg + 3 * gap)) / 2;
  pesos.forEach(([t, p, h, fundo, cor], i) => {
    const x = x0 + i * (larg + gap);
    c += el("rect", { x, y: base - h, width: larg, height: h, rx: 8, fill: fundo,
                      stroke: fundo === COR.fundo ? COR.borda : "none" });
    c += rotulo(x + larg / 2, base - h + 30, t, { centro: 1, tam: TAM.forte + 2, forte: 1, cor });
    c += rotulo(x + larg / 2, base - h + 54, p, { centro: 1, tam: TAM.corpo, cor: fundo === COR.fundo ? COR.apagado : "#fff" });
  });
  const leg = legenda(base + 32, "a altura de cada bloco é o peso do tempo — é isso que dá o balanço do compasso quaternário");
  return svg(W, base + 32 + leg.alt + 6, c + leg.svg);
};

/* ---------- 15. as cordas soltas do violino ---------- */
FIGS["cordas-violino"] = () => {
  // Alturas reais: Sol3, Ré4, Lá4, Mi5 (Dó central = Dó4 na notação científica).
  // Em clave de Sol, com p=0 na 1ª linha (Mi4):
  //   Sol3 = p-5 (abaixo de duas linhas suplementares) · Ré4 = p-1 (logo abaixo
  //   da 1ª linha) · Lá4 = p3 (2º espaço) · Mi5 = p7 (4º espaço).
  const x = 172, larg = 340, topo = 62;
  let c = pauta(x, topo, larg) + claveSol(x + 48, topo);
  const cordas = [[-5, "Sol", "4ª corda"], [-1, "Ré", "3ª corda"], [3, "Lá", "2ª corda"], [7, "Mi", "1ª corda"]];
  cordas.forEach(([p, n, ord], i) => {
    const px = x + 150 + i * 62;
    c += nota(px, topo, p, 1);
    c += rotulo(px, topo + 4 * D + 66, n, { centro: 1, tam: TAM.forte + 2, forte: 1, cor: COR.destaque });
    c += rotulo(px, topo + 4 * D + 86, ord, { centro: 1, tam: TAM.mini });
  });
  c += rotuloDir(x - 14, topo + 2 * D + 6, "cordas soltas", { tam: TAM.forte, forte: 1, cor: COR.tinta });
  const base = topo + 4 * D + 116;
  const leg = legenda(base, "de cinco em cinco notas (intervalo de 5ª), da mais grave à mais aguda");
  return svg(W, base + leg.alt + 6, c + leg.svg);
};

/* ---------- curso de regência (só no caderno do instrutor) ---------- */
Object.assign(FIGS, require("./regencia.js").FIGS);

/* ---------- página para o render ---------- */
const ids = Object.keys(FIGS);
fs.writeFileSync(path.join(__dirname, "figuras.html"),
`<!doctype html><meta charset="utf-8">
<style>@font-face{font-family:Bravura;src:url(fontes/Bravura.otf)}
body{margin:0;background:#fff;font-family:Calibri,sans-serif}
.f{background:#fff;display:inline-block}
.n{font:12px monospace;color:#999;padding:2px 0 14px 4px}</style>
${ids.map(id => `<div class="f" id="${id}">${FIGS[id]()}</div><div class="n">${id}</div>`).join("\n")}`);
console.log(ids.length + " figuras: " + ids.join(", "));
