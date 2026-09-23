# `dados/planos.js` não fica no Git

Os **Planos de Aula do MSA** são material interno do GEM: os próprios cadernos
de atividades dizem que o conteúdo do instrutor não deve ser compartilhado.
Este repositório é público, então `dados/planos.js` está no `.gitignore` e
precisa existir só na máquina de quem gera a apostila.

**De onde ele vem:** dos quatro PDFs *Planos de Aula — 1º a 4º período*, na
pasta `CONJUNTO DE MATERIAIS DIDÁTICOS`. O formato esperado é:

```js
const PLANOS = {
  1: [ { p, fase, a, topico, tema, habilidades[], objetivos[], conteudo[],
         duracao, recursos[], extras[], metodologia[], avaliacao[], refs[] }, … ],
  2: [ … ], 3: [ … ], 4: [ … ],
};
if (typeof module !== "undefined") module.exports = { PLANOS };
```

**Sem o arquivo, nada quebra:** a apostila do instrutor sai sem a página de
roteiro (e avisa isso no lugar), e o site simplesmente não mostra o roteiro.
Gabaritos, explicação, figuras, exercícios e hinos não dependem dele.

## Os cadernos do instrutor também ficam fora do Git

Pela mesma razão: o caderno do instrutor traz, antes de cada aula, uma página
de roteiro tirada do Plano de Aula. Tirar `planos.js` do repositório e deixar o
PDF que o contém seria inútil. `apostila/*instrutor*` está no `.gitignore`;
quem tiver `dados/planos.js` na máquina gera os dois cadernos com um comando.

Os cadernos do **candidato** continuam versionados: eles não têm roteiro nem
gabarito, só a explicação escrita para esta apostila, as figuras e os
exercícios.
