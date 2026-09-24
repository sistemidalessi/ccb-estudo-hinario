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
assets/figuras/     as 20 figuras em PNG, geradas (não desenhadas à mão)
.nojekyll           impede o Jekyll de processar o site no Pages

dados/curriculo.js      FASES (16 fases do MSA), TIPOS (8 tipos) e AULAS (as 60)
dados/questoes.js       const Q — o banco de questões, todas com gabarito
dados/planos.js         PLANOS — os 60 Planos de Aula oficiais do GEM
dados/licoes.js         LICOES — o texto didático de cada uma das 60 aulas
dados/hinos.js          HINOS — cabeçalho de 479 hinos, extraído do hinário
dados/hinos-por-aula.js HINOS_AULA — as listas de hinos que o GEM dá por aula

ferramentas/carregar.js       lê os arquivos de dados fora do navegador
ferramentas/hinos-da-aula.js  escolhe os hinos que fecham cada aula
ferramentas/gerar-apostila.js gera as duas apostilas .docx de cada período
ferramentas/extrair-hinario.py extrai o cabeçalho dos hinos do hinário em PDF
ferramentas/figuras/          desenho.js + gera.js + render.mjs → assets/figuras
apostila/                     os .docx gerados (candidato e instrutor)
```

### As duas apostilas

São documentos diferentes, não um com respostas e outro sem:

- **candidato**: abertura da aula, explicação em blocos com figura, o erro que
  mais aparece, exercícios com espaço para responder, os hinos que fecham a
  aula e a tarefa de casa;
- **instrutor**: antes de cada aula, uma página de roteiro tirada do Plano de
  Aula oficial (habilidades, objetivos, conteúdo, duração, recursos,
  metodologia, avaliação); depois, a mesma aula com os gabaritos.

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

Partitura e letra do hinário não são reproduzidas em lugar nenhum. Do hinário
sai só informação **sobre** o hino, nunca o hino: do cabeçalho, número,
tonalidade, marcação de movimento, metrônomo e indicação; da partitura, fórmula
de compasso, ritmo inicial e se há nota pontuada, fermata, tercina, ritornelo.
Os campos da partitura foram decisão do Anderson em 23/09/2026 — são da mesma
natureza da tonalidade. Nada além disso sem perguntar a ele. O material
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
  (o GEM já dá as listas), dinâmica e arcadas (estão lá, na fonte musical, se
  um dia servirem a alguma aula).
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

