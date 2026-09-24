# CLAUDE.md

Guia para o Claude Code ao trabalhar neste repositório.

## O que é isto

**Estudo do Hinário** — banco de questões para o GEM (Grupo de Estudos Musicais)
da Congregação Cristã no Brasil, usado pelo Anderson no ensino de violino.
Aplicação client-side pura, sem build e sem dependências, publicada em
https://sistemidalessi.github.io/ccb-estudo-hinario/

Repositório do portfólio da **Sistemi Dalessi**. Falar sempre em **português**;
UI, comentários e mensagens de commit em pt-BR.

## Arquitetura

Quatro arquivos, nenhuma biblioteca, nenhum passo de build:

```
index.html          estrutura e marcação das quatro telas
assets/estilo.css   tokens de cor (claro/escuro) e todo o layout
assets/app.js       abas, gerador de ficha, modo estudo, banco
assets/figuras/     as 30 figuras em PNG, geradas (não desenhadas à mão)
.nojekyll           impede o Jekyll de processar o site no Pages

dados/curriculo.js      FASES (16 fases do MSA), TIPOS (8 tipos) e AULAS (as 60)
dados/questoes.js       const Q — o banco de questões, todas com gabarito
dados/planos.js         PLANOS — os 60 Planos de Aula oficiais do GEM
dados/licoes.js         LICOES — o texto didático de cada uma das 60 aulas
dados/hinos.js          HINOS — cabeçalho de 479 hinos, extraído do hinário
dados/hinos-por-aula.js HINOS_AULA — as listas de hinos que o GEM dá por aula
dados/programa-minimo.js PROGRAMA_MINIMO — métodos e vozes por instrumento e etapa

ferramentas/carregar.js       lê os arquivos de dados fora do navegador
ferramentas/hinos-da-aula.js  escolhe os hinos que fecham cada aula
ferramentas/analise.js        análise de hinos ao fim de cada fase, com gabarito
ferramentas/repertorio.js     repertório por etapa do Programa Mínimo
ferramentas/gerar-apostila.js gera as duas apostilas .docx de cada período
ferramentas/extrair-hinario.py extrai o cabeçalho dos hinos do hinário em PDF
ferramentas/regencia.js       observações de regência de cada hino da análise
ferramentas/recortar-hinos.py recorta a partitura dos hinos da análise (fora do Git)
ferramentas/figuras/          desenho.js + gera.js + regencia.js + render.mjs → assets/figuras
dados/regencia.js             REGENCIA — o curso de regência dos instrutores (16 módulos)
apostila/                     os .docx gerados (candidato e instrutor)
```

### As duas apostilas

São documentos diferentes, não um com respostas e outro sem:

- **candidato**: abertura da aula, explicação em blocos com figura, o erro que
  mais aparece, exercícios com espaço para responder, os hinos que fecham a
  aula e a tarefa de casa;
- **instrutor**: antes de cada aula, uma página de roteiro tirada do Plano de
  Aula oficial (habilidades, objetivos, conteúdo, duração, recursos,
  metodologia, avaliação); depois, a mesma aula com os gabaritos; e, ao fim
  de cada fase, depois da análise de hinos, o módulo do curso de regência.

`node ferramentas/gerar-apostila.js` gera os oito arquivos; passando um número,
gera só aquele período.

### A ordem dos hinos

O que o Anderson pediu — os hinos fora da ordem do hinário, na ordem de
complexidade da teoria — está nos cadernos **"Atividades das Aulas do MSA
(para impressão)"** do GEM: ao fim de várias aulas há uma lista de hinos para
estudo complementar. Essas listas estão em `dados/hinos-por-aula.js`, e elas
**passam na frente** das regras automáticas de `hinos-da-aula.js`. As regras
ficam para as aulas em que o próprio caderno manda o instrutor escolher.

### O que não entra aqui

Partitura e letra do hinário não entram no repositório nem no site, que são
públicos. A exceção, decidida pelo Anderson em 24/09/2026: a **análise de
hinos** das apostilas traz a partitura do hino (recortada por
`recortar-hinos.py`, sem a marca d'água com os dados dele) — e por isso as
apostilas inteiras ficam fora do Git e só vão para o Drive. Fora da análise,
do hinário sai só informação **sobre** o hino: do cabeçalho, número,
tonalidade, marcação de movimento, metrônomo e indicação; da partitura, fórmula
de compasso, ritmo inicial e se há nota pontuada, fermata, tercina, ritornelo;
e a arcada impressa sobre a primeira nota. Os campos da partitura foram decisão
do Anderson em 23/09/2026, e a arcada em 24/09/2026 — são da mesma natureza da
tonalidade. Nada além disso sem perguntar a ele (a dinâmica, por exemplo, está
na partitura e ainda não foi pedida). O material
do GEM também não é copiado: a apostila se apresenta como complementar, porque
o Manual determina que o conteúdo do MSA seja apresentado por inteiro pelo
instrutor.

A apostila e o site saem do **mesmo banco**: acrescentar uma questão em
`dados/questoes.js` muda os dois. O gerador usa a biblioteca `docx` (npm), a
única dependência do repositório, e é usado só na linha de comando — o site
continua sem dependência nenhuma.

A ordem de carregamento importa: os arquivos de `dados/` vêm antes de `app.js`,
que depende dos globais `FASES`, `TIPOS` e `Q`.

**Hospedagem:** GitHub Pages a partir da branch `main`, pasta raiz. Push na `main`
já publica. Não há Supabase nem backend — o estado (tema escolhido) fica em
`localStorage`, sempre dentro de `try/catch`.

## O modelo de dados

Cada questão é um objeto em `dados/questoes.js`:

```js
{f:8, t:"8.1", k:"entender", n:2, q:"enunciado", g:"gabarito", v:1}
```

- `f` fase do MSA (1 a 16) — o **período é derivado da fase**, nunca gravado
- `t` tópico como no Manual de aplicação: `"8.1"`, `"6.5–6.7"` (travessão, não hífen)
- `k` tipo: `ver` `entender` `erro` `comparar` `criar` (canal papel) ·
  `tocar` `ouvir` `decidir` (canal prática)
- `n` nível 1 a 3
- `g` gabarito — **obrigatório em toda questão**. O material antigo do GEM de
  Diadema não tinha gabarito nenhum, e essa era uma das falhas centrais.
- `v` marca questão específica de violino (opcional)
- `a` número da aula dentro do período (**necessário para entrar na apostila**).
  Todas as 258 questões já têm esse campo.

Ao acrescentar questões, conferir se o tópico `t` existe em `FASES` no
`curriculo.js` — a Trilha conta as questões por tópico e um código errado some
da contagem sem dar erro.

## O currículo do MSA (não alterar sem fonte)

Vem do *Manual de aplicação das Aulas do MSA, v2.7* (documento oficial da CCB):
60 aulas em 4 períodos letivos de 15 aulas.

| Período | Fases |
|---|---|
| 1º | 1 a 3 — som, notas, pentagrama, figuras, compasso em 4, leitura, condução, metrônomo |
| 2º | 4 e 5 — ligadura, ponto, intervalo, compassos em 3 e 2, tercinas, fermata, compasso em 6 |
| 3º | 6 a 9 — tom/semitom, acidentes, escalas, armadura, compassos em 9 e 12, tonalidade, repetição |
| 4º | 10 a 16 — dinâmica, acento métrico, síncopa, ritmos iniciais, notas pontuadas, andamento, frases |

A outra fonte oficial usada é o *Programa Mínimo — CCB/Orquestra (03-2018)*, que
define as três etapas (RJM → cultos oficiais → oficialização) e as vozes de cada
instrumento. Para o violino: nas RJM, hinos 431 a 480 com soprano no natural; nos
cultos oficiais, hinário completo com soprano uma oitava acima; na oficialização,
soprano 8ª acima e contralto no natural.

Os dois PDFs estão no Google Drive do Anderson, em `00 > 00 - CCB - Música`.

## Decisões tomadas e por quê

- **Eixo por conceito, não por hino.** O material original (`Hinos - Análises II.pdf`,
  80 fichas) repetia as mesmas ~30 perguntas em cada hino: "Qual é a Fórmula de
  Compasso?" aparecia 79 vezes em 80 fichas. Pior: misturava conteúdo dos quatro
  períodos numa folha só, então um candidato de 1º período não tinha como responder
  metade dela. Aqui a ficha é montada para o período da turma.
- **Oito tipos de pergunta, em dois canais.** O material antigo era quase todo
  "identificar o que está escrito" e 100% no papel. Os tipos `tocar`, `ouvir` e
  `decidir` existem justamente para tirar o estudo da folha.
- **Sem número de hino embutido nas questões.** As 80 fichas originais traziam a
  partitura como imagem e não dava para saber a que hinos se referiam. As perguntas
  dizem "o hino indicado" e a ficha tem um campo para o número.
- **Sem botão de imprimir.** `window.print()` não funciona dentro do visualizador de
  artifacts; o botão "Copiar texto" gera a ficha em texto puro para colar no Word.
  Manter assim caso o app volte a ser publicado como artifact.

## A apostila

`node ferramentas/gerar-apostila.js 1` (ou 2, 3, 4) gera dois .docx em `apostila/`: o caderno
do candidato (com espaço para escrever; exercícios de prática trazem campo de
visto em vez de linhas) e o do instrutor (mesmo conteúdo com os gabaritos).

A apostila é **material complementar** — o MSA impresso continua sendo o material
didático da aula, como determina o Manual de aplicação. A capa e a página de
instruções dizem isso explicitamente; não remover.

O LibreOffice deste ambiente não abre .docx (falha até com arquivo mínimo), então
a conferência visual foi feita pelo validador de esquema e pela extração do texto
do `word/document.xml`. Para ver o resultado, abrir no Word.

## Os movimentos de solfejo (conferido em 22/09/2026)

Os gabaritos dos movimentos foram escritos primeiro pela prática corrente de
regência e depois corrigidos contra materiais que reproduzem o MSA (msaccb.com.br,
cursodeteoriamusical.com.br e os vídeos das fases 5 e 7). O que ficou valendo:

- **O MSA numera os pontos, não os movimentos.** Cada movimento vai de um ponto ao
  seguinte: o 1º movimento começa no ponto 1 e termina no ponto 2. Os gabaritos
  falam em pontos por causa disso.
- **Compassos simples:** em 2 → abaixo, acima. Em 3 → abaixo, fora, acima.
  Em 4 → abaixo, dentro, fora, acima.
- **Compostos seguem o desenho do simples correspondente**, com três pulsos por
  tempo: 6 segue o desenho do 2 (pontos 1–3 abaixo, 4–6 acima); 9 segue o do 3;
  12 segue o do 4. O movimento que liga um grupo ao seguinte é o mais amplo.
  **Atenção:** o compasso em 6 do MSA não é o padrão clássico de regência
  (2 e 3 para dentro, 4 e 5 para fora) — esse era o erro da primeira versão.
- **Movimentos alternativos:** usar o movimento de marcação do compasso em 2, 3
  ou 4, agrupando três pulsos em cada tempo.
- **Leitura rítmica** no MSA é falar a sílaba **TA** no ritmo das figuras;
  leitura métrica é falar o nome da nota sem cantar; solfejo é cantar na altura.
- **Janela de movimento**: delimitação do espaço do gesto, para não ser nem grande
  nem pequeno demais. Conceito do método, acrescentado ao banco.

Os desenhos dos nove padrões estão em
https://claude.ai/artifact/6AQki1PTcncwzD5f9Mza2S

## Pendente

- **Tabela dos 480 hinos: feita** (24/09/2026). Tom, marcação e metrônomo vêm do
  cabeçalho; fórmula de compasso, ritmo inicial e sinais, da partitura — ver
  "A leitura da partitura" abaixo. O que ainda não se lê: síncopa e contratempo
  (o GEM já dá as listas) e dinâmica (está lá, na fonte musical, se um dia
  servir a alguma aula).
- Registrar acertos e erros por aluno ao longo do semestre (hoje o modo estudo
  esquece tudo ao recarregar). Seria o caso de Supabase, no padrão dos outros
  projetos do portfólio.
- Revisar a terminologia com o Anderson, que é instrutor de violino no GEM.
  Os movimentos de solfejo já foram conferidos contra fontes do MSA (ver abaixo),
  mas o método impresso é que decide.
- As cinco questões da aula 1 do 1º período (origem e finalidade da orquestra)
  são de resposta aberta porque o texto do MSA não estava disponível ao montar o
  banco. Se o MSA for consultado, valem gabaritos mais precisos.

## Segunda rodada — apostila com explicação, figuras e planos oficiais (22/09/2026)

O Anderson abriu a pasta `CONJUNTO DE MATERIAIS DIDÁTICOS` dentro de
`00 - CCB - Música`, no Drive dele, e pediu uma apostila mais completa: com
**explicação do conteúdo** (não só exercícios), **figuras**, **ordem por
complexidade** e **versão do instrutor separada da versão do candidato**.

O que já foi feito:

- **`dados/planos.js`** — os 60 Planos de Aula oficiais do MSA, extraídos dos
  PDFs da CCB que estavam na pasta. Cada um traz tema, tópico, habilidades,
  objetivos, conteúdo, duração, recursos, metodologia e avaliação. É isso que
  deve alimentar o caderno do instrutor, no lugar do roteiro que eu havia
  inventado na primeira versão. O 1º período tem aulas de 40 min, menos a
  aula 1, de 60 min, tratada como inaugural com os pais presentes.
- **Pipeline de figuras**: desenho em SVG, renderizo em PNG com o Chromium do
  Playwright (`deviceScaleFactor: 3`) e embuto no .docx com `ImageRun`. O
  projeto parte da página: tudo é proporcional à distância entre linhas do
  pentagrama, e o gerador aplica a mesma escala física a toda figura.
- **As apostilas saem em .docx e em .pdf**. O PDF vem de
  `ferramentas/gerar-pdf.js`, que monta HTML dos mesmos dados e imprime pelo
  Chromium — o LibreOffice deste ambiente não carrega .docx, e gerar direto dá
  controle real de quebra de página. A conferência do .docx é pelo validador de
  esquema e pela extração do XML; a do PDF, pelo pymupdf.
- **`ferramentas/verificar.js`** prova o que dá para provar: alturas desenhadas
  nas figuras contra um modelo de pauta, integridade dos dados, termos que o
  material oficial desmente e a soma dos tempos de cada compasso. Rodar sempre
  antes de commitar.

O que falta, e é o trabalho de verdade:

1. **Ordem por complexidade.** O Anderson disse que a ordem certa não é a do
   Manual, e sim a dos estudos dos hinos, por complexidade. Esse material está
   na pasta e ainda precisa ser lido com atenção — as pastas `1. Período` a
   `4. Período` têm também os "Atividades das Aulas para impressão", que não
   foram lidos ainda.
2. **Texto de explicação de cada aula.** Hoje a apostila só pergunta. Precisa
   explicar, e o conteúdo vem dos Planos (campo `conteudo`) e do MSA.
3. **Figuras das 60 aulas.** Existem três; faltam as do pentagrama, claves,
   endecagrama, figuras e pausas, ordem dos acidentes, ritmos iniciais,
   síncopa/contratempo, tercina, cordas do violino.
4. **`Ditado e Composição Rítmica`** (Clave de C), que estava na pasta, mostra
   o tipo de atividade que ele valoriza: ditado rítmico, composição e prática
   em conjunto. É material de terceiros — não reproduzir, mas vale ter
   atividades equivalentes próprias.

## A leitura da partitura (24/09/2026)

A partitura do `Hinário_revisado.pdf` é texto na fonte **Leland** (MuseScore),
padrão SMuFL: cada símbolo tem código fixo na faixa de uso privado do Unicode.
`extrair-hinario.py` lê daí fórmula de compasso, nota pontuada, fermata,
ritornelo; a tercina é um "3" em itálico da fonte de texto. Tudo foi conferido
contra as listas do GEM (em 3, 6, 9, 12, alternados, estrofe/coro, tercinas,
fermatas, casas de ritornelo) — bateu em todas.

**Ritmo inicial** é o dado frágil, e está marcado para conferir em toda parte.
Sai de duas fontes: o selo cinza de regência na margem ("Levare 3" = preparação
no 3º tempo, entra no 4º; é imagem, reconhecida pela assinatura) e a largura do
primeiro compasso comparada à do segundo (abaixo de 0,55 = anacruse). Os
dezesseis casos em que as duas discordam ou a medida fica no meio foram olhados
na partitura e estão em `CONFERIDOS_NO_OLHO`, no script. Os dois acéfalos são o
227 e o 377 — os únicos com o selo "súbito ativo", e o caderno do GEM diz que
são só dois.

O script roda aqui mesmo: o hinário está no Drive do Anderson
(`00 - CCB - Música/Hinário_revisado.pdf`) e o computador dele alcança o Drive.
Não é preciso pedir a ele que rode nada.

**Arcadas.** Todo hino traz arco para baixo (⊓, E610) e para cima (V, E612),
mas só no começo e onde o arco vira. Grava-se a da primeira nota (campo `arc`).
Téticos começam para baixo (182 de 190); anacrúsicos, em geral para cima, mas
70 começam para baixo — anacruse de mais de uma nota ou de um tempo inteiro.
Onde há marca no primeiro tempo forte depois da anacruse, é sempre para baixo.
Usada nas aulas 6 e 7 do 4º período, em pergunta marcada "Violino:".

## Apostila geral, análise de hinos e repertório (24/09/2026)

Pedido do Anderson depois de ver as apostilas: um volume com os quatro
períodos (convive com as quatro por período — sai do mesmo banco); ao fim de
cada assunto, dois ou três hinos com as perguntas das fichas "Hinos - Análises
II", só sobre o que já foi ensinado; e hinos para estudar em cada etapa do
Programa Mínimo, com o programa de todos os instrumentos para orientar os
demais instrutores.

- `ferramentas/analise.js` — a análise ao fim de cada uma das 16 fases. Cada
  pergunta das fichas antigas está presa à fase em que o assunto é ensinado
  (`PERGUNTAS`, campo `f`) e o gabarito sai de `dados/hinos.js`. `cabeNaFase`
  impede hino com assunto futuro (6/8 antes da fase 5, ritornelo antes da 9,
  síncopa antes da 12...). Nas fases 1 a 5 os hinos são da faixa 431–480, a
  das reuniões de jovens. Acentuação métrica só onde o banco já a fixou (2, 3,
  4 e 6); 9 e 12 ficam sem essa pergunta. Pergunta que exigiria ler nota a
  nota (quantas frases, que ligadura) não entra: sem gabarito certo, não sai.
- `ferramentas/repertorio.js` — RJM (8 hinos, só 431–480), cultos oficiais
  (10) e oficialização (10, metade mais difícil do hinário), em faixas de
  dificuldade crescente; em cada faixa entra o hino que traz mais novidade
  dentro da etapa. A posição do violino para o soprano 8ª acima vem de `ag`
  (até Si5: 1ª; Dó6–Ré6: 3ª; Mi♭6–Mi6: 3ª com extensão ou 4ª; Fá6: 5ª).
- `dados/programa-minimo.js` — o Programa Mínimo (CCB, jan/2018) transcrito.
- `node ferramentas/gerar-pdf.js geral` (e o mesmo no `gerar-apostila.js`)
  gera só o volume geral. O PDF geral é gerado duas vezes: a primeira passada
  serve para achar a página de cada parte do sumário (via `pdftotext`).
- Arcadas: o hinário de cordas é o **capa marrom**, e traz arcada em todos os
  hinos. A pergunta de violino cita esse hinário. As arcadas lidas vêm do PDF
  revisado; supõe-se que batam com as do capa marrom — o Anderson confirma.

## Terceira rodada — figuras, hino na análise, Programa Mínimo no início (24/09/2026)

O Anderson viu as apostilas e apontou: claves e pausas "horríveis", e a pausa
de mínima errada (pendurada abaixo da linha; ela fica **apoiada sobre a 3ª
linha** — pendurada na 4ª é a de semibreve). Pediu revisão de tudo.

- **Figuras com a fonte Bravura** (SMuFL, OFL, `ferramentas/figuras/fontes/`,
  obtida pelo pacote npm `@vexflow-fonts/bravura`, porque o GitHub da
  Steinberg não está liberado). Claves, cabeças, colchetes, pausas,
  acidentes, fermata e algarismos de fórmula saem da fonte, posicionados
  pelas medidas do `bravura_metadata.json`. Haste pela regra de gravura
  (abaixo da 3ª linha para cima; da 3ª para cima, para baixo). O
  `verificar.js` agora testa as pausas e a direção das hastes.
- **Revisão independente** (um revisor sem contexto leu lições, questões e
  figuras). Corrigido: lições 2-13, 2-14 e 3-6 confundiam o movimento de
  solfejo em 6 e em 9 (seis e nove pontos) com o alternativo (em 2 e em 3);
  hastes erradas em `ligaduras` e `fermata`; tercina "colcheia pontuada +
  duas semicolcheias" (não fecha o tempo); definição de movimento de
  condução; janela de movimento ≠ mesa invisível (são dois itens nos
  Planos); acidente de precaução; casas de ritornelo; ♩ = 72 conta a figura,
  não é sempre a unidade de tempo; subdivisão do pontuado conforme a figura;
  "último compasso completa a anacruse" vira "em geral"; escolha entre 6 e 2
  começa pela marcação impressa; fermata em quatro tempos; estatística das
  tonalidades; lição 2-13 ganhou o 6/4.
- **Confirmados pelo Anderson** na quarta rodada (ver o fim deste arquivo):
  claves de trombone, eufônio e tuba; escala de Ré em duas oitavas; arco no
  p agudo; definição de dinâmica. Falta só: as arcadas lidas batem com as do
  hinário capa marrom?
- **Análise com o hino na página**: `recortar-hinos.py` recorta a partitura
  dos hinos da análise para `ferramentas/hinos-img/` (fora do Git), esvaziando
  o fluxo de conteúdo da marca d'água e encurtando o vão branco entre os
  sistemas, para hino e perguntas caberem juntos. No caderno do aluno a
  linha de ficha (tom, fórmula, metrônomo) sai: entregaria as respostas.
- **Programa Mínimo no início** ("Antes de começar — o caminho na
  orquestra"), por família e instrumento, na apostila geral e na do 1º
  período. O repertório por etapa continua no fim do volume geral.


## Quarta rodada — curso de regência, nome do maestro, metrônomo (24/09/2026)

Pedidos do Anderson:

- **Tirar "Maestro Rômulo Moreira"** das duas apostilas ("para não fazer
  propaganda de ninguém"; título e autor ficam). O nome está no cabeçalho de
  cada hino do PDF; `recortar-hinos.py` o apaga por redação (só o trecho de
  texto — notas e linhas intactas) e falha se ele sobrar. No código o filtro
  procura só a palavra "Maestro", para o nome não ficar no repositório.
- **Curso de regência, só no caderno do instrutor.** Uma vez por mês o GEM
  tem aula prática em que os instrutores regem dois ou três hinos. Ao fim de
  cada fase, depois da análise, vem um módulo (`dados/regencia.js`): técnica
  com figuras, "Na aula prática" e, para cada hino da análise, as observações
  de `ferramentas/regencia.js` — desenho, andamento, entrada e preparação,
  fermata, ritornelo, síncopa, volta entre estrofes. A técnica acompanha o
  MSA: postura e batuta (1), ictus e desenho em 4 (2), preparação (3), 3, 2 e
  corte (4), fermata e 6 (5), mão esquerda (6), 9 e 12 e andamento (7),
  ensaio (8), estrofes e ritornelo (9), dinâmica (10), articulação e 4/4 em 2
  (11), síncopa (12), entradas difíceis e acéfalo (13), subdivisão (14),
  ritardando (15), frase e avaliação do colega (16).
  - Fonte: resumo em palavras próprias do curso comprado por ele (Drive,
    `00 - CCB - Música/03 - Regência`) e de manuais de batuta da internet.
    Autores não citados, pelo mesmo motivo do maestro.
  - Nenhum material da pasta tem figura de como segurar a batuta: a figura
    `reg-batuta` foi feita a partir de manuais de técnica de batuta.
  - `ENTRADA`, em `ferramentas/regencia.js`: em que tempo entra cada hino
    anacrúsico da análise e qual o gesto de preparação — lido no olho, na
    partitura. O `verificar.js` acusa hino da análise sem entrada.
  - Marcação que não é desenho do compasso (o 32 traz "em 4" e "Reger frase
    em 4" num 2/4; são oito hinos): é agrupamento de frase, e rege-se pela
    fórmula — "se é 2/4, se regerá 2/4" (Anderson). Ver `marcacaoDeFrase`.
- **Metrônomo.** Ao montar o curso, apareceu que 267 hinos estavam sem
  metrônomo: as cabeças de nota do primeiro sistema caíam no meio dos números.
  Corrigido (`dados_da_pagina` tira a faixa de uso privado antes de procurar);
  hoje os 480 têm. Com isso a lista de hinos da análise mudou em 13 hinos, e
  as perguntas de lento/rápido e o repertório também.
- **Campo novo `mf`**: a figura do sinal de metrônomo (semínima, colcheia,
  mínima, semínima pontuada). É parte do metrônomo, mas é campo novo —
  avisar o Anderson. Sem ele, "100-138" num 6/8 não diz se são colcheias, e
  a ficha imprimia sempre ♩. `metTexto()` monta o sinal certo; as perguntas
  "o que indicam esses números" dizem a figura, e as de lento/rápido só usam
  hinos em que o número conta a própria unidade de tempo. O 272 (6/8 em 2)
  traz ♩ = 42–52, que só faz sentido como semínima pontuada: a observação de
  regência manda conferir.

Respostas do Anderson (24/09/2026, mesma tarde):
- compasso em 6 na regência: os dois desenhos estão corretos; o curso deixa
  as duas opções, sem misturar no mesmo hino;
- nas aulas práticas rege-se com batuta;
- 2/4 rege-se em 2 — vale para toda marcação que não é desenho da fórmula;
- o ♩ = 42–52 do 272 é semínima pontuada (corrigido em `dados/hinos.js`);
- trombone lê em clave de Fá (tenor); eufônio e tuba, clave de Fá (baixo):
  entraram na figura e na lição das claves;
- a escala de Ré maior em duas oitavas fica como está;
- p no agudo do violino: ponto de contato do lado do espelho, como estava;
  acrescentado que nas posições altas tudo se aproxima do cavalete;
- definição de dinâmica trocada pela que ele trouxe ("variação da
  intensidade sonora — o controle do volume — com que uma nota ou trecho deve
  ser executado"); o "gradual" saiu, porque há mudança súbita.

Atenção: o hinário revisado (o PDF) traz dinâmicas em vermelho, mas o
hinário oficial não traz sinais de dinâmica — a lição 10-1 e o MSA dizem
isso. O curso de regência segue o oficial: a dinâmica se decide pela letra.
