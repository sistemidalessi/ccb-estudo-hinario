const f = require("./desenho.js");
const { D, posY } = f;
const topo = 40, x0 = 30;
let c = f.pauta(x0, topo, 820);
c += f.claveSol(x0 + 40, topo) + f.claveFa(x0 + 110, topo) + f.claveDo(x0 + 190, topo);
c += f.formula(x0 + 250, topo, "4", "4");
[0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((p, i) => { c += f.nota(x0 + 300 + i * 26, topo, p, 4); });
c += f.nota(x0 + 560, topo, 1, 1) + f.nota(x0 + 595, topo, 3, 2) + f.nota(x0 + 630, topo, 5, 4)
   + f.nota(x0 + 665, topo, 2, 8) + f.nota(x0 + 700, topo, 4, 16) + f.nota(x0 + 740, topo, 3, 4, { pontos: 1 });
c += f.nota(x0 + 780, topo, -2, 4) + f.nota(x0 + 810, topo, 12, 4);
const t2 = topo + 130;
c += f.pauta(x0, t2, 820);
[1, 2, 4, 8, 16].forEach((d, i) => { c += f.pausa(x0 + 60 + i * 60, t2, d); });
c += f.sustenido(x0 + 400, posY(t2, 4)) + f.bemol(x0 + 440, posY(t2, 4)) + f.bequadro(x0 + 480, posY(t2, 4));
c += f.fermata(x0 + 540, posY(t2, 9)) + f.nota(x0 + 540, t2, 4, 2);
c += f.barraCompasso(x0 + 620, t2) + f.barraCompasso(x0 + 680, t2, "dupla") + f.barraCompasso(x0 + 750, t2, "final");
require("fs").writeFileSync("/tmp/fig/prova.html",
  `<body style="margin:0;background:#fff"><div id="p">${f.svg(880, 300, c)}</div></body>`);
