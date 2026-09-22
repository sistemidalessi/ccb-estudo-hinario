// Carrega dados/curriculo.js e dados/questoes.js fora do navegador.
// Os dois arquivos são scripts de página (declaram FASES, TIPOS e Q com const),
// então aqui eles são avaliados num contexto isolado e as constantes, exportadas.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function carregar(raiz = path.join(__dirname, "..")) {
  const ctx = vm.createContext({});
  for (const arq of ["dados/curriculo.js", "dados/questoes.js", "dados/hinos.js"]) {
    vm.runInContext(fs.readFileSync(path.join(raiz, arq), "utf8"), ctx, { filename: arq });
  }
  vm.runInContext("globalThis.__d = { FASES, TIPOS, AULAS, Q, HINOS };", ctx);
  return ctx.__d;
}

module.exports = { carregar };
