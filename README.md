# Estudo do Hinário

Banco de questões para o **GEM — Grupo de Estudos Musicais** da Congregação Cristã
no Brasil, organizado pelas **16 fases do MSA** (Método Simplificado de
Aprendizagem Musical), com gerador de fichas, gabarito e modo de estudo.

**Site:** https://sistemidalessi.github.io/ccb-estudo-hinario/

## O que é

O material tradicional de estudo do hinário é uma ficha por hino, sempre com as
mesmas perguntas. Aqui o eixo é outro: **cada pergunta pertence a uma fase e a um
tópico do MSA**, e a ficha é montada na hora para o período em que a turma está.
O aluno de 1º período recebe perguntas de 1º período; o de 4º, perguntas de 4º.

Quatro telas:

| Tela | Para que serve |
|---|---|
| **Trilha** | O currículo do MSA inteiro — 4 períodos, 16 fases, 60 aulas — com a contagem de questões por tópico |
| **Gerar ficha** | Monta uma ficha diferente a cada clique, com ou sem gabarito, e copia o texto pronto para colar no Word |
| **Modo estudo** | Uma pergunta por vez; o que o aluno erra volta na mesma rodada, o que acerta não |
| **Banco** | Todas as questões, com filtro por fase, por tipo e por busca livre |

## Os oito tipos de pergunta

Divididos em dois canais, porque o material antigo era 100% papel:

**No papel** — Identificar (nomear o que está escrito) · Explicar (por que é assim) ·
Achar o erro · Comparar (dois hinos) · Produzir (escrever ou marcar algo novo)

**Na prática** — Tocar (com o instrumento na mão) · Ouvir (o instrutor toca, o aluno
responde) · Decidir (situação real de ensaio)

Cada questão tem ainda um **nível de 1 a 3**, para o instrutor ver de relance se a
folha ficou fácil demais.

## Como acrescentar questões

Todas as questões estão em [`dados/questoes.js`](dados/questoes.js), um array de
objetos. Para acrescentar uma, copie qualquer linha e mude os campos:

```js
{f:8, t:"8.1", k:"entender", n:2,
 q:"Qual a regra prática para achar a tonalidade maior numa armadura de bemóis?",
 g:"O penúltimo bemol é a tônica — com um bemol só, Fá maior."}
```

| Campo | O que é |
|---|---|
| `f` | Fase do MSA, de 1 a 16 |
| `t` | Tópico, como aparece no Manual de aplicação (`"8.1"`, `"6.5–6.7"`) |
| `k` | Tipo: `ver` `entender` `erro` `comparar` `criar` `tocar` `ouvir` `decidir` |
| `n` | Nível, de 1 a 3 |
| `q` | O enunciado |
| `g` | O gabarito — **obrigatório**, é o que faltava no material antigo |
| `v` | `1` se a questão é específica de violino (opcional) |

O período é deduzido da fase, então não precisa ser informado. A lista de fases e
tópicos está em [`dados/curriculo.js`](dados/curriculo.js) e segue o *Manual de
aplicação das Aulas do MSA (v2.7)*.

## A apostila impressa

O mesmo banco também gera a apostila do semestre, aula por aula, na sequência do
Manual de aplicação:

```bash
npm install                       # só na primeira vez (biblioteca docx)
node ferramentas/gerar-apostila.js 1
```

Saem dois arquivos em `apostila/`: o **caderno do candidato**, com espaço para
escrever, e o **caderno do instrutor**, igual mas com os gabaritos. Os exercícios
de prática não têm linha para resposta — trazem o campo de visto do instrutor.

Hoje só o 1º período está pronto: os outros três dependem de mapear as questões
das fases 4 a 16 às respectivas aulas (o campo `a` de cada questão).

## Referências usadas

- **Manual de aplicação das Aulas do MSA, v2.7** — 60 aulas em 4 períodos: 1º com
  as fases 1 a 3, 2º com 4 e 5, 3º com 6 a 9, 4º com 10 a 16.
- **Programa Mínimo — CCB/Orquestra (03-2018)** — as três etapas (Reuniões de Jovens
  e Menores, cultos oficiais, oficialização) e as vozes que cada instrumento executa.
- Os exercícios referenciam o **Hinário em Dó, capa preta**, como pede o MSA.

O hinário em si não é reproduzido aqui: as questões trabalham sobre o hino que o
instrutor indicar, com o hinário em mãos.

## Como rodar

É HTML, CSS e JavaScript puros, sem dependências e sem build. Abrir o
`index.html` no navegador já funciona; o push na branch `main` publica no
GitHub Pages.
