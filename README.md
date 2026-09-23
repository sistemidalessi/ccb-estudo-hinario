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

## Os hinos, na ordem da teoria

A ideia: cada aula do MSA fecha com um ou dois hinos escolhidos **pelo conceito
que acabou de ser estudado**, e não pela ordem do hinário. A aula de armadura com
sustenidos fecha com hinos em Sol; a de compasso composto, com hinos em 6/8. Os
hinos aparecem fora de ordem de propósito — quem manda é a teoria.

Para isso é preciso uma tabela com os dados de cada hino. O hinário em PDF traz
esses dados no cabeçalho de cada página, e o script os extrai:

```bash
pip install pymupdf
python ferramentas/extrair-hinario.py
```

Sem caminho nenhum: o script procura os PDFs grandes do computador — inclusive
nas unidades do Google Drive, que ficam fora da pasta do usuário —, mostra os
candidatos numerados e pergunta qual é o hinário. Digitar ou arrastar caminho de
arquivo para dentro do terminal é a parte que mais dá errado na prática, e não
precisa. Quem preferir pode passar o caminho do jeito de sempre:

```bash
python ferramentas/extrair-hinario.py caminho/do/Hinario.pdf
```

Saem três arquivos:

- `hinos.csv` — com o título de cada hino, para conferir numa planilha. **Fica
  fora do Git**: o título é a primeira linha do hino, e deste repositório não sai
  nada do texto do hinário.
- `extracao.csv` — os mesmos hinos sem os títulos: número, tonalidade, marcação,
  metrônomo, indicação e página. É este que vai para o repositório. Os hinos
  avulsos do fim do livro aparecem marcados como `avulso`: eles recomeçam a
  numeração do 1 e colidiriam com os primeiros hinos.
- `nao-lidas.txt` — as páginas que o script não reconheceu como abertura de hino
  **e que, pela conta dos números impressos, deveriam abrir uma**.

O script lê **apenas a faixa superior de cada página** — número, título,
tonalidade, metrônomo e indicação interpretativa. A partitura não é lida nem
reproduzida.

**Nem todo hino começa numa página nova.** Em parte do hinário um hino termina
no alto da folha e o seguinte começa logo abaixo, na mesma página, com o
cabeçalho inteiro repetido ali no meio. Quem procura só na faixa de cima perde
esses — eram 94 páginas, e com elas 117 dos 480 hinos ficavam sem ficha. Com a
segunda leitura o resultado passou a ser **479 hinos de 480**: falta só o 434,
que não está no PDF (o 433 e o 435 estão em páginas seguidas, com número
impresso nas duas).

Por isso o script lê cada página duas vezes. Na primeira, procura o cabeçalho
onde ele costuma estar. Depois compara o que achou com o que os números
impressos dizem que deveria haver: entre o hino 143 e o hino 148 têm de caber
quatro hinos, e se só apareceram dois, as duas aberturas que faltam estão
naquelas páginas. Só nelas ele lê de novo, agora procurando o cabeçalho pela
**forma** — título e, de 4 a 36 pontos abaixo, a tonalidade — em qualquer
altura da folha. O que protege contra inventar hino é a página já ter sido
eleita suspeita: numa página onde a conta acusa falta, achar título e
tonalidade é achar o hino que faltava.

O hinário também não é uniforme na grafia: escreve `Si♭` numa página e `Sí♭`,
com acento no i, noutra. A tonalidade é reconhecida sem acento nenhum e
devolvida já na grafia certa.

O que o script **não** consegue: ritmo inicial (tético, anacrúsico, acéfalo) e os
sinais presentes (fermata, tercina, síncopa, ritornelo). Isso depende de olhar a
partitura, e entra depois, à mão ou pelo GEM.

## A apostila impressa

O mesmo banco também gera a apostila do semestre, aula por aula, na sequência do
Manual de aplicação:

```bash
npm install                       # só na primeira vez (biblioteca docx)
node ferramentas/gerar-apostila.js 1     # ou 2, 3, 4
```

Saem dois arquivos em `apostila/`: o **caderno do candidato**, com espaço para
escrever, e o **caderno do instrutor**, igual mas com os gabaritos. Os exercícios
de prática não têm linha para resposta — trazem o campo de visto do instrutor.

Os quatro períodos estão prontos — oito arquivos em `apostila/`, cobrindo as 60
aulas do MSA. As aulas de "conclusão dos exercícios individuais" e de avaliação
não trazem exercícios novos: a primeira remete às apresentações pendentes, a
segunda ao gerador de fichas.

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
