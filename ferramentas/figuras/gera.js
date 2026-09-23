/* Gera as figuras da apostila em SVG e escreve a página que o render.mjs
   fotografa. Uma figura por id; o nome do arquivo é o id. */
const fs = require("fs"), path = require("path");
const f = require("./desenho.js");
const { COR, D, el, posY, pauta, nota, barra, pausa, claveSol, claveFa, claveDo,
        sustenido, bemol, bequadro, fermata, barraCompasso, formula, rotulo, chave, svg } = f;

const FIGS = {};
const txt = (x, y, t, o) => rotulo(x, y, t, o);
const legenda = (larg, y, t) => rotulo(larg / 2, y, t, { centro: 1, tam: 17 });

/* ---------- 1. o pentagrama ---------- */
FIGS["pentagrama"] = () => {
  const topo = 46, x = 150, larg = 420;
  let c = pauta(x, topo, larg);
  for (let i = 0; i < 5; i++) {
    const y = topo + i * D, n = 5 - i;
    c += txt(x - 12, y + 6, `${n}ª linha`, { tam: 16 }) .replace('x="'+(x-12)+'"', 'x="'+(x-12)+'" text-anchor="end"');
  }
  for (let i = 0; i < 4; i++) {
    const y = topo + i * D + D / 2, n = 4 - i;
    c += rotulo(x + larg + 12, y + 6, `${n}º espaço`, { tam: 16, cor: COR.destaque });
  }
  c += txt(x + 40, topo - 22, "as linhas contam-se de baixo para cima", { tam: 16, cor: COR.apagado });
  return svg(760, 130, c);
};

/* ---------- 2. as três claves ---------- */
FIGS["claves"] = () => {
  const topo = 50;
  const quais = [
    [claveSol, "clave de Sol", "na 2ª linha", "violino, flauta, clarinete, trompete, sax"],
    [claveFa, "clave de Fá", "na 4ª linha", "violoncelo, trombone, tuba, baixo"],
    [claveDo, "clave de Dó", "na 3ª linha", "viola"],
  ];
  const linhaDaClave = [2, 6, 4];
  let c = "";
  quais.forEach(([fn, nome, onde, quem], i) => {
    const x = 30 + i * 310, larg = 250;
    c += pauta(x, topo, larg) + fn(x + 62, topo);
    c += el("line", { x1: x, y1: posY(topo, linhaDaClave[i]), x2: x + larg,
                      y2: posY(topo, linhaDaClave[i]), stroke: COR.destaque, "stroke-width": 3 });
    c += rotulo(x + larg / 2, topo + 112, nome, { centro: 1, tam: 20, forte: 1, cor: COR.tinta });
    c += rotulo(x + larg / 2, topo + 134, onde, { centro: 1, tam: 16, cor: COR.destaque });
    c += rotulo(x + larg / 2, topo + 154, quem, { centro: 1, tam: 14 });
  });
  c += legenda(950, topo + 188, "a linha em azul é a que dá nome à clave: é ali que mora a nota Sol, Fá ou Dó");
  return svg(950, topo + 206, c);
};

/* ---------- 3. o endecagrama ---------- */
FIGS["endecagrama"] = () => {
  const x = 190, larg = 460, topoG = 40, topoF = topoG + 6 * D;
  let c = pauta(x, topoG, larg) + pauta(x, topoF, larg);
  const yDo = topoG + 5 * D;                        // a 11ª linha, no meio
  c += claveSol(x + 44, topoG) + claveFa(x + 44, topoF);
  c += nota(x + 240, topoG, -2, 1, { cor: COR.alerta });
  c += rotulo(x + 274, yDo + 6, "Dó3 — o Dó Central", { tam: 18, forte: 1, cor: COR.alerta });
  c += f.rotuloDir(x - 12, topoG + 2 * D + 6, "clave de Sol", { tam: 16 });
  c += f.rotuloDir(x - 12, topoF + 2 * D + 6, "clave de Fá", { tam: 16 });
  c += legenda(760, topoF + 5 * D + 30, "as duas pautas mais a linha do Dó Central formam o endecagrama:");
  c += legenda(760, topoF + 5 * D + 50, "onze linhas, do som mais grave ao mais agudo");
  return svg(760, topoF + 5 * D + 68, c);
};

/* ---------- 4. figuras de som e de silêncio ---------- */
FIGS["figuras"] = () => {
  const linhas = [
    [1, "semibreve", "4 tempos"], [2, "mínima", "2 tempos"], [4, "semínima", "1 tempo"],
    [8, "colcheia", "½ tempo"], [16, "semicolcheia", "¼ de tempo"],
  ];
  const topo = 76, alt = 84;
  let c = rotulo(150, 40, "figura de som", { tam: 17, forte: 1, centro: 1, cor: COR.destaque })
        + rotulo(340, 40, "figura de silêncio", { tam: 17, forte: 1, centro: 1, cor: COR.destaque })
        + rotulo(510, 40, "nome", { tam: 17, forte: 1, centro: 1, cor: COR.destaque })
        + rotulo(660, 40, "vale, em 4/4", { tam: 17, forte: 1, centro: 1, cor: COR.destaque });
  linhas.forEach(([dur, nome, vale], i) => {
    const y = topo + i * alt, t = y - 2 * D;
    if (i) c += el("line", { x1: 60, y1: y - alt / 2 + 6, x2: 720, y2: y - alt / 2 + 6, stroke: COR.borda, "stroke-width": 1 });
    // trecho de pauta atrás da pausa: sem ele, semibreve e mínima ficam iguais
    c += pauta(300, t, 80, { fina: 1, cor: COR.borda });
    c += nota(150, t, 4, dur, { haste: "baixo" }) + pausa(340, t, dur);
    c += rotulo(510, y + 6, nome, { centro: 1, tam: 19, cor: COR.tinta });
    c += rotulo(660, y + 6, vale, { centro: 1, tam: 19 });
  });
  c += legenda(760, topo + 4 * alt + 78, "cada figura vale o dobro da seguinte — e a pausa ao lado vale o mesmo, em silêncio");
  return svg(760, topo + 4 * alt + 96, c);
};

/* ---------- 5. ordem dos acidentes na armadura ---------- */
FIGS["acidentes"] = () => {
  const topo = 50, topo2 = topo + 120, x = 170, larg = 520;
  // ordem dos sustenidos: Fá Dó Sol Ré Lá Mi Si — posições na clave de Sol
  const sus = [[8, "Fá"], [5, "Dó"], [9, "Sol"], [6, "Ré"], [3, "Lá"], [7, "Mi"], [4, "Si"]];
  const bem = [[4, "Si"], [7, "Mi"], [3, "Lá"], [6, "Ré"], [2, "Sol"], [5, "Dó"], [1, "Fá"]];
  let c = pauta(x, topo, larg) + claveSol(x + 44, topo)
        + pauta(x, topo2, larg) + claveSol(x + 44, topo2);
  sus.forEach(([p, n], i) => {
    c += sustenido(x + 110 + i * 46, posY(topo, p));
    c += rotulo(x + 110 + i * 46, topo + 5 * D + 16, n, { centro: 1, tam: 16 });
  });
  bem.forEach(([p, n], i) => {
    c += bemol(x + 110 + i * 46, posY(topo2, p));
    c += rotulo(x + 110 + i * 46, topo2 + 5 * D + 16, n, { centro: 1, tam: 16 });
  });
  c += rotulo(x - 14, topo + 2 * D + 6, "sustenidos", { tam: 18, forte: 1, cor: COR.tinta })
        .replace(`x="${x - 14}"`, `x="${x - 14}" text-anchor="end"`);
  c += rotulo(x - 14, topo2 + 2 * D + 6, "bemóis", { tam: 18, forte: 1, cor: COR.tinta })
        .replace(`x="${x - 14}"`, `x="${x - 14}" text-anchor="end"`);
  c += legenda(760, topo2 + 5 * D + 44, "a ordem é sempre esta, e a dos bemóis é a dos sustenidos de trás para a frente");
  return svg(760, topo2 + 5 * D + 62, c);
};

/* ---------- 6. ritmos iniciais ---------- */
FIGS["ritmos-iniciais"] = () => {
  const casos = [
    ["Tético", "a 1ª nota cai no tempo forte", (x, t) =>
      nota(x, t, 4, 4) + nota(x + 52, t, 5, 4) + nota(x + 104, t, 6, 4) + nota(x + 156, t, 4, 4)],
    ["Anacrúsico", "a nota inicial vem antes do 1º compasso", (x, t) =>
      nota(x - 44, t, 2, 4, { cor: COR.alerta }) + barraCompasso(x - 18, t) +
      nota(x, t, 4, 4) + nota(x + 52, t, 5, 4) + nota(x + 104, t, 6, 4)],
    ["Acéfalo", "o 1º tempo é pausa — no hinário, não escrita", (x, t) =>
      pausa(x, t, 4, COR.alerta) + nota(x + 52, t, 5, 4) + nota(x + 104, t, 6, 4) + nota(x + 156, t, 4, 4)],
  ];
  let c = "", y = 50;
  casos.forEach(([nome, desc, dentro]) => {
    const x = 420, t = y;
    c += pauta(x - 100, t, 320) + formula(x - 78, t, "4", "4") + dentro(x + 20, t);
    c += f.rotuloDir(x - 118, t + 2 * D - 2, nome, { tam: 20, forte: 1, cor: COR.tinta });
    c += f.rotuloDir(x - 118, t + 2 * D + 20, desc, { tam: 14 });
    y += 118;
  });
  return svg(760, y + 4, c);
};

/* ---------- 7. síncopa e contratempo ---------- */
FIGS["sincopa"] = () => {
  const topo = 60, topo2 = topo + 150, x = 250, T = 62;   // T = largura de um tempo
  const p = 5;
  const ticks = (t, destaque) => [0, 1, 2, 3].map(i => {
    const px = x + 70 + i * T;
    return el("line", { x1: px, y1: t + 4 * D + 8, x2: px, y2: t + 4 * D + 22,
      stroke: destaque.includes(i) ? COR.alerta : COR.borda, "stroke-width": destaque.includes(i) ? 2.8 : 1.4 })
      + rotulo(px, t + 4 * D + 38, String(i + 1), { centro: 1, tam: 14, cor: destaque.includes(i) ? COR.alerta : COR.apagado });
  }).join("");

  let c = pauta(x, topo, 360) + formula(x + 22, topo, "4", "4")
        + pauta(x, topo2, 360) + formula(x + 22, topo2, "4", "4");
  // Síncopa: ♪ ♩ ♪ 𝅗𝅥 — a semínima nasce na parte fraca e atravessa o 2º tempo
  c += nota(x + 70, topo, p, 8, { haste: "cima" });
  c += nota(x + 70 + T / 2, topo, p, 4, { haste: "cima" });
  c += nota(x + 70 + T * 1.5, topo, p, 8, { haste: "cima" });
  c += nota(x + 70 + T * 2, topo, p, 2, { haste: "cima" });
  c += el("rect", { x: x + 70 + T / 2 - 4, y: topo - 6, width: T + 8, height: 4 * D + 12,
                    fill: COR.alerta, opacity: 0.09 });
  c += ticks(topo, [1]);
  c += rotulo(x + 180, topo + 4 * D + 60, "a nota nasce na parte fraca e atravessa o 2º tempo, sem ser reatacada",
              { tam: 16, centro: 1, cor: COR.alerta });
  // Contratempo: pausa no tempo, nota depois — quatro vezes
  [0, 1, 2, 3].forEach(i => {
    c += pausa(x + 70 + i * T, topo2, 8, COR.alerta);
    c += nota(x + 70 + i * T + T / 2, topo2, p, 8, { haste: "cima" });
  });
  c += ticks(topo2, [0, 1, 2, 3]);
  c += rotulo(x + 180, topo2 + 4 * D + 60, "o tempo fica em silêncio; o som entra sempre depois dele",
              { tam: 16, centro: 1, cor: COR.alerta });
  c += f.rotuloDir(x - 20, topo + 2 * D, "Síncopa", { tam: 21, forte: 1, cor: COR.tinta });
  c += f.rotuloDir(x - 20, topo2 + 2 * D, "Contratempo", { tam: 21, forte: 1, cor: COR.tinta });
  return svg(760, topo2 + 4 * D + 80, c);
};

/* ---------- 8. tercina ---------- */
FIGS["tercina"] = () => {
  const topo = 100, x = 120;
  let c = pauta(x, topo, 540) + formula(x + 22, topo, "4", "4");
  const p = 5, y = posY(topo, p);
  const par = (x0, n, cor) => {
    let g = "";
    for (let i = 0; i < n; i++) g += nota(x0 + i * 40, topo, p, 8, { haste: "cima", semFlag: 1 });
    g += barra(x0 + 8.4, x0 + (n - 1) * 40 + 8.4, topo, p, p, true);
    if (cor) g += rotulo(x0 + ((n - 1) * 40) / 2, y - 66, "3", { centro: 1, tam: 21, forte: 1, cor });
    return g;
  };
  c += par(x + 110, 2) + chave(x + 104, x + 160, y - 84, "1 tempo: duas colcheias");
  c += rotulo(x + 280, y + 4, "=", { tam: 26, cor: COR.apagado, centro: 1 });
  c += par(x + 370, 3, COR.alerta) + chave(x + 364, x + 460, y - 84, "o mesmo tempo: três colcheias");
  c += legenda(760, topo + 4 * D + 44, "a tercina põe três figuras onde caberiam duas do mesmo valor —");
  c += legenda(760, topo + 4 * D + 64, "o tempo não muda; muda a divisão dele");
  return svg(760, topo + 4 * D + 82, c);
};

/* ---------- 9. ligaduras ---------- */
FIGS["ligaduras"] = () => {
  const topo = 56, x = 90;
  let c = "";
  const bloco = (x0, pa, pb, cor, titulo, l1, l2) => {
    let g = pauta(x0, topo, 260);
    g += nota(x0 + 90, topo, pa, 4, { haste: "cima" }) + nota(x0 + 150, topo, pb, 4, { haste: "cima" });
    g += el("path", { d: `M${x0 + 90} ${posY(topo, pa) + 14} q30 24 60 ${posY(topo, pb) - posY(topo, pa)}`,
                      fill: "none", stroke: cor, "stroke-width": 2.4 });
    g += rotulo(x0 + 130, topo + 4 * D + 40, titulo, { centro: 1, tam: 19, forte: 1, cor });
    g += rotulo(x0 + 130, topo + 4 * D + 62, l1, { centro: 1, tam: 15 });
    g += rotulo(x0 + 130, topo + 4 * D + 82, l2, { centro: 1, tam: 15 });
    return g;
  };
  c += bloco(x, 5, 5, COR.destaque, "de VALOR", "mesma altura · soma as durações", "toca-se uma vez só");
  c += bloco(x + 330, 3, 6, COR.alerta, "de PORTAMENTO", "alturas diferentes · sem interrupção", "tocam-se as duas, ligadas");
  c += legenda(760, topo + 4 * D + 116, "no hinário há estas duas ligaduras, e só estas duas");
  return svg(760, topo + 4 * D + 134, c);
};

/* ---------- 10. ponto de aumento ---------- */
FIGS["ponto"] = () => {
  const topo = 100, x = 130;
  let c = pauta(x, topo, 520) + formula(x + 22, topo, "4", "4");
  const p = 5, y = posY(topo, p);
  c += nota(x + 110, topo, p, 4, { haste: "cima", pontos: 1 });
  c += chave(x + 96, x + 144, y - 84, "1 tempo e meio");
  c += rotulo(x + 200, y + 4, "=", { tam: 26, cor: COR.apagado, centro: 1 });
  c += nota(x + 270, topo, p, 4, { haste: "cima" }) + nota(x + 330, topo, p, 8, { haste: "cima" });
  c += el("path", { d: `M${x + 270} ${y + 14} q30 22 60 0`, fill: "none", stroke: COR.destaque, "stroke-width": 2.2 });
  c += chave(x + 258, x + 344, y - 84, "1 tempo + meio tempo");
  c += legenda(760, topo + 4 * D + 46, "o ponto vale metade da figura que está à esquerda dele");
  return svg(760, topo + 4 * D + 64, c);
};

/* ---------- 11. fermata ---------- */
FIGS["fermata"] = () => {
  const topo = 70, x = 120;
  let c = pauta(x, topo, 540) + formula(x + 22, topo, "4", "4");
  const p = 5;
  c += nota(x + 90, topo, p, 4, { haste: "cima" }) + nota(x + 140, topo, 4, 4, { haste: "cima" });
  c += nota(x + 210, topo, p, 2, { haste: "cima" }) + fermata(x + 210, posY(topo, p) - 70);
  c += barraCompasso(x + 330, topo);
  c += nota(x + 380, topo, 4, 4, { haste: "cima" }) + nota(x + 430, topo, 5, 4, { haste: "cima" });
  const yb = topo + 4 * D + 16;
  const passos = [
    [x + 210, "1. prolonga o som", COR.destaque, 0],
    [x + 262, "2. para, em silêncio", COR.alerta, 1],
    [x + 306, "3. respira", COR.alerta, 2],
    [x + 400, "4. retoma na mesma velocidade de antes", COR.destaque, 3],
  ];
  passos.forEach(([px, t, cor, fila]) => {
    const alvo = yb + 16 + fila * 24;
    c += el("line", { x1: px, y1: yb - 8, x2: px, y2: alvo - 12, stroke: cor, "stroke-width": 1.5, "stroke-dasharray": "4 3" });
    c += rotulo(px, alvo, t, { centro: 1, tam: 15, cor });
  });
  return svg(760, yb + 16 + 3 * 24 + 22, c);
};

/* ---------- 12. movimentos de solfejo ---------- */
const PONTOS = {
  2: [[150, 166, "abaixo"], [202, 66, "acima"]],
  3: [[132, 166, "abaixo"], [232, 136, "fora"], [188, 64, "acima"]],
  4: [[158, 166, "abaixo"], [62, 158, "dentro"], [242, 146, "fora"], [206, 62, "acima"]],
};
function movimento(base, pulsos, titulo, nota_) {
  const P = PONTOS[base], larg = 400, alt = 268;
  let c = el("defs", {}, el("marker", { id: "mv", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" },
    el("path", { d: "M0 0 L10 5 L0 10 z", fill: COR.tinta })));
  for (let i = 0; i < P.length; i++) {
    const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length];
    const ultimo = i === P.length - 1;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (ultimo ? 0 : -26);
    c += el("path", { d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, fill: "none",
      stroke: ultimo ? COR.borda : COR.tinta, "stroke-width": 2,
      "stroke-dasharray": ultimo ? "5 4" : "", "marker-end": "url(#mv)" });
  }
  P.forEach(([px, py, onde], i) => {
    if (pulsos === 1) {
      c += el("circle", { cx: px, cy: py, r: 15, fill: COR.destaque });
      c += rotulo(px, py + 6, String(i + 1), { centro: 1, tam: 17, forte: 1, cor: "#fff" });
    } else {
      c += el("rect", { x: px - 32, y: py - 15, width: 64, height: 30, rx: 15, fill: COR.destaque });
      c += rotulo(px, py + 6, `${i * 3 + 1}·${i * 3 + 2}·${i * 3 + 3}`, { centro: 1, tam: 15, forte: 1, cor: "#fff" });
    }
    // o rótulo do ponto de cima vai para o lado, senão bate no título
    c += py > 100 ? rotulo(px, py + 40, onde, { centro: 1, tam: 14 })
                  : rotulo(px + (pulsos === 1 ? 24 : 42), py + 5, onde, { tam: 14 });
  });
  c += rotulo(larg / 2, 28, titulo, { centro: 1, tam: 21, forte: 1, cor: COR.tinta });
  if (nota_) c += rotulo(larg / 2, alt - 14, nota_, { centro: 1, tam: 14 });
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
  const topo = 70, x = 70, larg = 600;
  let c = pauta(x, topo, larg) + formula(x + 40, topo, "4", "4");
  c += el("defs", {}, el("marker", { id: "sf", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" },
    el("path", { d: "M0 0 L10 5 L0 10 z", fill: COR.destaque })));
  c += el("path", { d: `M${x + 56} ${topo - 6} L${x + 120} ${topo - 32}`, fill: "none", stroke: COR.destaque, "stroke-width": 2.2, "marker-end": "url(#sf)" });
  c += el("path", { d: `M${x + 56} ${topo + 4 * D + 6} L${x + 120} ${topo + 4 * D + 32}`, fill: "none", stroke: COR.destaque, "stroke-width": 2.2, "marker-end": "url(#sf)" });
  c += rotulo(x + 128, topo - 28, "número de CIMA — quantos tempos há no compasso", { tam: 18, cor: COR.destaque, forte: 1 });
  c += rotulo(x + 128, topo + 4 * D + 38, "número de BAIXO — que figura vale um tempo (4 = semínima)", { tam: 18, cor: COR.destaque, forte: 1 });
  [0, 1, 2, 3].forEach(i => {
    c += nota(x + 190 + i * 86, topo, 5, 4, { haste: "cima" });
    c += rotulo(x + 190 + i * 86, topo + 4 * D + 20, String(i + 1), { centro: 1, tam: 17 });
  });
  c += barraCompasso(x + 560, topo);
  c += f.rotuloDir(x + 576, topo + 4 * D + 42, "barra de compasso", { tam: 15 });
  return svg(760, topo + 4 * D + 76, c);
};

/* ---------- 14. acentuação métrica ---------- */
FIGS["acentuacao"] = () => {
  const pesos = [["1º tempo", "FORTE", 96, COR.destaque, "#fff"],
                 ["2º tempo", "fraco", 62, COR.fundo, COR.tinta],
                 ["3º tempo", "meio-forte", 80, COR.claro, "#fff"],
                 ["4º tempo", "fraco", 62, COR.fundo, COR.tinta]];
  let c = "", base = 150;
  pesos.forEach(([t, p, h, fundo, cor], i) => {
    const x = 60 + i * 172;
    c += el("rect", { x, y: base - h, width: 156, height: h, rx: 8, fill: fundo, stroke: fundo === COR.fundo ? COR.borda : "none" });
    c += rotulo(x + 78, base - h + 32, t, { centro: 1, tam: 22, forte: 1, cor });
    c += rotulo(x + 78, base - h + 58, p, { centro: 1, tam: 19, cor: fundo === COR.fundo ? COR.apagado : "#fff" });
  });
  c += legenda(760, base + 34, "a altura de cada bloco é o peso do tempo — é isso que dá o balanço do compasso quaternário");
  return svg(760, base + 54, c);
};

/* ---------- 15. as cordas do violino ---------- */
FIGS["cordas-violino"] = () => {
  const topo = 50, x = 210, larg = 420;
  let c = pauta(x, topo, larg) + claveSol(x + 44, topo);
  const cordas = [[-2, "Sol", "4ª corda"], [1, "Ré", "3ª"], [4, "Lá", "2ª"], [7, "Mi", "1ª corda"]];
  cordas.forEach(([p, n, ord], i) => {
    const px = x + 160 + i * 84;
    c += nota(px, topo, p, 1);
    c += rotulo(px, topo + 5 * D + 30, n, { centro: 1, tam: 19, forte: 1, cor: COR.destaque });
    c += rotulo(px, topo + 5 * D + 50, ord, { centro: 1, tam: 14 });
  });
  c += f.rotuloDir(x - 14, topo + 2 * D + 6, "cordas soltas", { tam: 18, forte: 1, cor: COR.tinta });
  c += legenda(760, topo + 5 * D + 80, "de cinco em cinco notas (intervalo de 5ª), da mais grave à mais aguda");
  return svg(760, topo + 5 * D + 98, c);
};

/* ---------- página para o render ---------- */
const ids = Object.keys(FIGS);
const corpo = ids.map(id =>
  `<div class="f" id="${id}">${FIGS[id]()}</div>
   <div class="n">${id}</div>`).join("\n");
fs.writeFileSync(path.join(__dirname, "figuras.html"),
`<!doctype html><meta charset="utf-8">
<style>body{margin:0;background:#fff;font-family:Calibri,sans-serif}
.f{background:#fff;display:inline-block}
.n{font:12px monospace;color:#999;padding:2px 0 14px 4px}</style>
${corpo}`);
console.log(ids.length + " figuras: " + ids.join(", "));
