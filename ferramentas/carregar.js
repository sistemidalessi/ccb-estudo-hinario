// Carrega os arquivos de dados fora do navegador.
// Eles são scripts de página (declaram FASES, TIPOS, Q... com const), então aqui
// são avaliados num contexto isolado e as constantes, exportadas.
// dados/planos.js é opcional: fica fora do Git por ser material interno do GEM
// (ver dados/LEIAME-planos.md). Sem ele, PLANOS vem vazio e o roteiro do
// instrutor simplesmente não sai.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function carregar(raiz = path.join(__dirname, "..")) {
  const ctx = vm.createContext({});
  for (const arq of ["dados/curriculo.js", "dados/questoes.js", "dados/hinos.js"]) {
    vm.runInContext(fs.readFileSync(path.join(raiz, arq), "utf8"), ctx, { filename: arq });
  }
  const planos = path.join(raiz, "dados", "planos.js");
  vm.runInContext(fs.existsSync(planos) ? fs.readFileSync(planos, "utf8") : "const PLANOS = {};",
    ctx, { filename: "dados/planos.js" });
  vm.runInContext("globalThis.__d = { FASES, TIPOS, AULAS, Q, HINOS, PLANOS };", ctx);
  return ctx.__d;
}

module.exports = { carregar };
