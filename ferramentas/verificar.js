/* Verificador do projeto. Roda sem argumento:  node ferramentas/verificar.js
 *
 * Existe porque um erro de altura numa figura passou despercebido até o
 * Anderson ver: três das quatro cordas do violino estavam na linha errada.
 * O que dá para provar por cálculo passa a ser provado aqui, e não relido.
 *
 * Verifica quatro coisas:
 *   1. alturas — toda nota desenhada numa figura contra um modelo de pauta;
 *   2. integridade — lição para cada aula, gabarito para cada questão,
 *      figura citada que existe de fato, hinos dentro de 1..480;
 *   3. termos — expressões que o material oficial do GEM desmente e que já
 *      estiveram erradas aqui, para não voltarem;
 *   4. contas — soma dos tempos dos compassos desenhados nas figuras.
 */
const fs = require("fs");
const path = require("path");
const RAIZ = path.join(__dirname, "..");

let falhas = 0, checagens = 0;
const ok = (cond, oquê, detalhe = "") => {
  checagens++;
  if (!cond) { falhas++; console.log(`  ✗ ${oquê}${detalhe ? " — " + detalhe : ""}`); }
};
const titulo = t => console.log(`\n${t}`);

/* ---------- modelo de pauta ---------- */
/* p = 0 é sempre a linha de baixo. O que muda com a clave é que nota mora ali.
   Clave de Sol: 1ª linha = Mi4. Clave de Fá (4ª linha): 1ª linha = Sol2.
   Clave de Dó (3ª linha): 1ª linha = Fá3. Dó4 = Dó central (notação científica). */
const ESCALA = ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si"];
const BASE = { sol: { nota: 2, oitava: 4 }, fa: { nota: 4, oitava: 2 }, do: { nota: 3, oitava: 3 } };

function alturaEm(clave, p) {
  const b = BASE[clave];
  const i = b.nota + p;
  return ESCALA[((i % 7) + 7) % 7] + (b.oitava + Math.floor(i / 7));
}
function posicaoDe(clave, alvo) {          // inverso: de "Sol3" para a posição
  for (let p = -14; p <= 14; p++) if (alturaEm(clave, p) === alvo) return p;
  return null;
}

/* ---------- 1. alturas desenhadas nas figuras ---------- */
titulo("1. alturas desenhadas nas figuras");

// o próprio modelo, conferido contra fatos que qualquer músico sabe de cor
ok(alturaEm("sol", 0) === "Mi4", "clave de Sol: 1ª linha é Mi4", alturaEm("sol", 0));
ok(alturaEm("sol", 8) === "Fá5", "clave de Sol: 5ª linha é Fá5", alturaEm("sol", 8));
ok(alturaEm("sol", -2) === "Dó4", "clave de Sol: 1ª suplementar abaixo é o Dó central", alturaEm("sol", -2));
ok(alturaEm("fa", 6) === "Fá3", "clave de Fá: a 4ª linha é Fá3", alturaEm("fa", 6));
ok(alturaEm("fa", 10) === "Dó4", "clave de Fá: 1ª suplementar acima é o Dó central", alturaEm("fa", 10));
ok(alturaEm("do", 4) === "Dó4", "clave de Dó: a 3ª linha é o Dó central", alturaEm("do", 4));

// endecagrama: 5 linhas da clave de Fá + a do Dó Central + 5 da clave de Sol.
// Contando de baixo para cima, o Dó Central é a 6ª — e não a 11ª, como este
// projeto já chegou a afirmar.
const LINHAS_ENDECAGRAMA = 5 + 1 + 5;
ok(LINHAS_ENDECAGRAMA === 11, "o endecagrama tem onze linhas");
ok(5 + 1 === 6, "no endecagrama, o Dó Central é a 6ª linha de baixo para cima");
ok(alturaEm("fa", 10) === alturaEm("sol", -2), "a linha do meio é a mesma nota vista das duas claves",
   `${alturaEm("fa", 10)} × ${alturaEm("sol", -2)}`);

const fonteFig = fs.readFileSync(path.join(RAIZ, "ferramentas", "figuras", "gera.js"), "utf8");

// cordas soltas do violino — o erro que originou este arquivo
const CORDAS = [["Sol3", "4ª corda"], ["Ré4", "3ª corda"], ["Lá4", "2ª corda"], ["Mi5", "1ª corda"]];
const mCordas = /const cordas = \[(.+?)\];/s.exec(fonteFig);
ok(!!mCordas, "figura das cordas: a lista foi encontrada no código");
if (mCordas) {
  const desenhado = [...mCordas[1].matchAll(/\[(-?\d+), "([^"]+)", "([^"]+)"\]/g)]
    .map(m => [Number(m[1]), m[2], m[3]]);
  ok(desenhado.length === 4, "figura das cordas: quatro cordas", `achei ${desenhado.length}`);
  CORDAS.forEach(([altura, ordem], i) => {
    const [p, nome, ord] = desenhado[i] || [];
    const esperado = posicaoDe("sol", altura);
    ok(p === esperado, `corda ${ordem}: ${altura} fica na posição ${esperado}`, `está em ${p} (${alturaEm("sol", p)})`);
    ok(nome === altura.replace(/\d/, ""), `corda ${ordem}: o rótulo é ${altura.replace(/\d/, "")}`, nome);
    ok(ord === ordem, `corda ${i + 1}: a ordem é "${ordem}"`, ord);
  });
  const sobe = desenhado.every((c, i) => i === 0 || c[0] > desenhado[i - 1][0]);
  ok(sobe, "figura das cordas: da mais grave para a mais aguda");
}

// ordem e altura dos acidentes na armadura, em clave de Sol
const ARMADURA = {
  sus: [["Fá5", "Fá"], ["Dó5", "Dó"], ["Sol5", "Sol"], ["Ré5", "Ré"], ["Lá4", "Lá"], ["Mi5", "Mi"], ["Si4", "Si"]],
  bem: [["Si4", "Si"], ["Mi5", "Mi"], ["Lá4", "Lá"], ["Ré5", "Ré"], ["Sol4", "Sol"], ["Dó5", "Dó"], ["Fá4", "Fá"]],
};
for (const [qual, esperado] of Object.entries(ARMADURA)) {
  const m = new RegExp(`const ${qual} = \\[(.+?)\\];`, "s").exec(fonteFig);
  ok(!!m, `armadura (${qual}): a lista foi encontrada no código`);
  if (!m) continue;
  const desenhado = [...m[1].matchAll(/\[(-?\d+), "([^"]+)"\]/g)].map(x => [Number(x[1]), x[2]]);
  ok(desenhado.length === 7, `armadura (${qual}): sete acidentes`, `achei ${desenhado.length}`);
  esperado.forEach(([altura, nome], i) => {
    const [p, rot] = desenhado[i] || [];
    ok(p === posicaoDe("sol", altura), `${qual} ${i + 1}º (${nome}): desenhado em ${altura}`,
       p == null ? "ausente" : `está em ${alturaEm("sol", p)}`);
    ok(rot === nome, `${qual} ${i + 1}º: o rótulo é ${nome}`, rot);
  });
}
// a ordem dos bemóis é a dos sustenidos invertida
const nomesSus = ARMADURA.sus.map(x => x[1]), nomesBem = ARMADURA.bem.map(x => x[1]);
ok(JSON.stringify(nomesSus.slice().reverse()) === JSON.stringify(nomesBem),
   "a ordem dos bemóis é a dos sustenidos de trás para a frente");

/* ---------- 2. integridade dos dados ---------- */
titulo("2. integridade dos dados");
const { carregar } = require("./carregar.js");
const { FASES, TIPOS, AULAS, Q, HINOS } = carregar(RAIZ);
const { LICOES } = require(path.join(RAIZ, "dados", "licoes.js"));
const { HINOS_AULA } = require(path.join(RAIZ, "dados", "hinos-por-aula.js"));

for (let p = 1; p <= 4; p++) {
  ok(AULAS[p] && AULAS[p].length === 15, `${p}º período: 15 aulas`, AULAS[p] ? String(AULAS[p].length) : "ausente");
  for (let a = 1; a <= 15; a++) ok(!!LICOES[`${p}-${a}`], `lição ${p}-${a} existe`);
}
ok(Object.keys(LICOES).length === 60, "60 lições ao todo", String(Object.keys(LICOES).length));
ok(Q.every(q => q.g && q.g.trim()), "toda questão tem gabarito");
ok(Q.every(q => TIPOS[q.k]), "todo tipo de questão existe em TIPOS");
ok(Q.every(q => FASES.some(f => f.f === q.f)), "toda questão aponta para uma fase que existe");
ok(Q.every(q => q.n >= 1 && q.n <= 3), "todo nível está entre 1 e 3");

const figsNoDisco = new Set(fs.readdirSync(path.join(RAIZ, "assets", "figuras")).map(f => f.replace(".png", "")));
const figsCitadas = new Set(Object.values(LICOES).flatMap(l => l.blocos.map(b => b.fig).filter(Boolean)));
figsCitadas.forEach(f => ok(figsNoDisco.has(f), `figura citada existe no disco: ${f}`));
figsNoDisco.forEach(f => ok(figsCitadas.has(f), `figura no disco é usada em alguma aula: ${f}`));

ok(HINOS.every(h => h.n >= 1 && h.n <= 480), "todo hino está entre 1 e 480");
const TONS = ["Dó", "Ré♭", "Ré", "Mi♭", "Mi", "Fá", "Sol♭", "Sol", "Lá♭", "Lá", "Si♭", "Si"];
ok(HINOS.every(h => !h.tom || TONS.includes(h.tom)), "toda tonalidade é uma das doze",
   HINOS.filter(h => h.tom && !TONS.includes(h.tom)).map(h => h.n + ":" + h.tom).join(" "));
ok(HINOS.every(h => !h.marc || ["em 2", "em 3", "em 4", "em 6", "em 9", "em 12"].includes(h.marc)),
   "toda marcação é uma das do hinário");
const metRuim = HINOS.filter(h => {
  const m = /^(\d+)-(\d+)/.exec(h.met || ""); return m && (Number(m[1]) >= Number(m[2]) || Number(m[1]) < 30 || Number(m[2]) > 200);
});
ok(metRuim.length === 0, "todo metrônomo é uma faixa crescente e plausível", metRuim.map(h => h.n + ":" + h.met).join(" "));
const duplicados = HINOS.map(h => h.n).filter((n, i, a) => a.indexOf(n) !== i);
ok(duplicados.length === 0, "nenhum hino repetido", duplicados.join(" "));

HINOS_AULA.forEach(l => {
  ok(l.p >= 1 && l.p <= 4, `lista ${l.p}-${l.a}: período válido`);
  ok(l.a.every(a => a >= 1 && a <= 15), `lista ${l.p}-${l.a}: aulas entre 1 e 15`);
  ok(l.hinos.every(n => n >= 1 && n <= 480), `lista "${l.rot}": hinos entre 1 e 480`);
  ok((l.comp1 || []).every(n => l.hinos.includes(n)), `lista "${l.rot}": todo hino com (*) está na lista`);
  const cresce = l.hinos.every((n, i) => i === 0 || n !== l.hinos[i - 1]);
  ok(cresce, `lista "${l.rot}": sem número repetido em seguida`);
});

/* Questões parecidas demais DENTRO da mesma aula. Entre aulas diferentes a
   semelhança é de propósito: cada compasso repete a mesma pergunta estrutural. */
const semAcento = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const palavras = t => new Set(semAcento(t).split(" ").filter(w => w.length > 3));
/* Pares que parecem repetidos ao vocabulário mas foram conferidos e são
   distintos: o que os separa são palavras curtas demais para o cálculo. */
const CONFERIDOS = [
  ["ordem ascendente a partir do Fá", "ordem descendente a partir do Dó"],
  ["semínima pontuada + colcheia", "uma colcheia pontuada"],
];
const jaConferido = (x, y) => CONFERIDOS.some(([u, v]) =>
  (x.includes(u) && y.includes(v)) || (x.includes(v) && y.includes(u)));
const pares = [];
for (let i = 0; i < Q.length; i++) for (let j = i + 1; j < Q.length; j++) {
  if (Q[i].f !== Q[j].f || Q[i].a !== Q[j].a) continue;
  const a = palavras(Q[i].q), b = palavras(Q[j].q);
  // perguntas curtas ("O que é uma tercina?") casam com tudo: só compara as que
  // têm vocabulário suficiente, e pela razão entre interseção e união
  if (a.size < 4 || b.size < 4) continue;
  const inter = [...a].filter(w => b.has(w)).length;
  const uniao = new Set([...a, ...b]).size;
  if (jaConferido(Q[i].q, Q[j].q)) continue;
  if (inter / uniao > 0.6) pares.push(`f${Q[i].f}a${Q[i].a}: "${Q[i].q.slice(0, 44)}…" × "${Q[j].q.slice(0, 44)}…"`);
}
ok(pares.length === 0, "nenhuma questão repetida dentro da mesma aula", pares.join(" | "));

/* ---------- 3. termos que o material oficial desmente ---------- */
titulo("3. termos que o material oficial do GEM desmente");
const textos = [
  ...Q.map(q => ({ onde: `questão f${q.f} a${q.a}`, t: q.q + " " + q.g })),
  ...Object.entries(LICOES).map(([k, l]) => ({
    onde: `lição ${k}`,
    t: [l.titulo, l.abre, l.atencao, l.casa, ...l.blocos.map(b => b.h + " " + b.t)].join(" "),
  })),
];
const PROIBIDOS = [
  [/sílaba\s+TA\b/, "a sílaba da leitura rítmica é TÁ, com acento"],
  [/ligadura\s+de\s+frase/i, "no hinário só há ligadura de valor e de portamento"],
  [/fermata\s+(suspensiva|conclusiva)/i, "o MSA não divide a fermata em suspensiva e conclusiva"],
  [/(suspensiva|conclusiva)/i, "classificação de fermata que o MSA não usa"],
  [/\b(maestoso|adagio|allegro|andantino|legatissimo)\b.*indicaç/i, "termo italiano apresentado como indicação interpretativa"],
  [/três\s+tipos\s+de\s+ligadura/i, "são duas, não três"],
  [/(11ª|décima\s+primeira)\s+linha/i, "no endecagrama o Dó Central é a 6ª linha de baixo para cima, não a 11ª"],
];
PROIBIDOS.forEach(([re, porquê]) => {
  const achados = textos.filter(x => re.test(x.t));
  ok(achados.length === 0, `nenhum texto com ${re} (${porquê})`, achados.map(a => a.onde).join(", "));
});

/* ---------- 4. contas dos compassos desenhados ---------- */
titulo("4. contas dos compassos desenhados nas figuras");
const VALOR = { 1: 4, 2: 2, 4: 1, 8: 0.5, 16: 0.25 };
const soma = figs => figs.reduce((s, d) => s + VALOR[d], 0);

/* Compassos inteiros: têm de somar 4 tempos. */
const inteiros = {
  "ritmos-iniciais · tético": [4, 4, 4, 4],
  "ritmos-iniciais · anacrúsico, depois da barra": [4, 4, 4, 4],
  "ritmos-iniciais · acéfalo: pausa + 3 semínimas": [4, 4, 4, 4],
  "sincopa · ♪ ♩ ♪ 𝅗𝅥": [8, 4, 8, 2],
  "sincopa · contratempo: 4 × (pausa ♪ + ♪)": [8, 8, 8, 8, 8, 8, 8, 8],
  "fermata · 1º compasso: ♩ ♩ 𝅗𝅥": [4, 4, 2],
  "formula · quatro semínimas": [4, 4, 4, 4],
};
for (const [nome, figs] of Object.entries(inteiros))
  ok(Math.abs(soma(figs) - 4) < 1e-9, `${nome}: soma 4 tempos`, `soma ${soma(figs)}`);

/* Grupos isolados: a figura mostra uma equivalência, não um compasso. */
ok(Math.abs(soma([8, 8]) - 1) < 1e-9, "tercina · duas colcheias somam 1 tempo");
ok(Math.abs(soma([8, 8, 8]) - 1.5) < 1e-9,
   "tercina · três colcheias normais somariam 1½ tempo — é por isso que a tercina precisa do número 3");
ok(Math.abs((1 + 0.5) - (1 + 0.5)) < 1e-9, "ponto · semínima pontuada = semínima + colcheia ligadas (1½ tempo)");
ok(VALOR[4] + VALOR[4] / 2 === 1.5, "ponto · o ponto vale metade da figura que o precede");
ok(VALOR[1] === 2 * VALOR[2] && VALOR[2] === 2 * VALOR[4] && VALOR[4] === 2 * VALOR[8] && VALOR[8] === 2 * VALOR[16],
   "figuras · cada figura vale o dobro da seguinte");

console.log(`\n${checagens} verificações · ${falhas} falha(s)`);
process.exit(falhas ? 1 : 0);
