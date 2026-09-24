/* Curso de regência para os instrutores — só no caderno do instrutor.

   Pedido do Anderson (24/09/2026): uma vez por mês o GEM tem uma aula prática
   em que os próprios instrutores regem dois ou três hinos e falam sobre eles.
   O curso acompanha a análise de hinos: um módulo ao fim de cada fase, e os
   hinos da análise são os que se regem naquela aula prática. A técnica
   cresce junto com o conteúdo do MSA — o compasso em 3 entra quando o MSA
   ensina o compasso em 3, a fermata quando o MSA ensina a fermata, e assim
   por diante.

   Fontes: resumo, em palavras próprias, do curso de regência que o Anderson
   comprou (pasta "03 - Regência" no Drive dele: um curso de regência de hinos
   para regentes leigos, uma apostila de aspectos básicos de regência e
   apostilas sobre gesto e ensaio), completado com manuais de técnica de
   batuta publicados na internet. Os autores não são citados na apostila, a
   pedido dele ("para não fazer propaganda de ninguém").

   Dois pontos ficam para o Anderson confirmar com o encarregado — estão
   marcados no próprio texto: o desenho do compasso em 6 que a orquestra usa
   na regência, e o uso de batuta nas aulas práticas.

   Cada módulo: { titulo, abre, blocos: [{h, t, fig}], pratica: [..] }. */
const REGENCIA = {
  intro: {
    titulo: "Curso de regência para instrutores",
    abre: "Uma vez por mês, na aula prática, os instrutores regem. Este curso prepara essa aula: ao fim de cada fase há um módulo de técnica e, para cada hino da análise daquela fase, as observações de regência. A técnica cresce com o material — os primeiros hinos são em 4, sem mudança de compasso; os últimos trazem compasso composto, fermata, ritornelo, mudança de fórmula e entrada acéfala.",
    blocos: [
      { h: "Como funciona a aula prática",
        t: "Cada instrutor rege dois ou três hinos da análise da fase mais recente, com os demais tocando. Antes de reger, ele diz em dois minutos o que vai fazer: o desenho, o andamento, como é a entrada, onde há fermata e como termina. Depois de reger, ouve dos colegas uma coisa que funcionou e uma coisa a mudar — só uma. Quem rege de novo na aula seguinte começa pela coisa a mudar." },
      { h: "Como estudar um hino antes de regê-lo",
        t: "Primeiro, cante a voz do soprano inteira, marcando o compasso com a mão. Depois responda por escrito: em quanto se rege (o hinário às vezes traz a marcação impressa, 'em 2', 'em 6'); qual o andamento, dentro da faixa do metrônomo; em que tempo o hino começa e qual é o gesto de preparação; onde estão as fermatas e o que vem depois de cada uma; como se faz a volta entre as estrofes; como termina. Por fim, ensaie os gestos em silêncio diante de um espelho, com o metrônomo. Quem sabe o hino de cor rege olhando para o grupo, e não para a folha." },
      { h: "O que o regente dá ao grupo",
        t: "O começo, o andamento, o fim, e a respiração entre uma coisa e outra. O gesto de regência não enfeita a música: informa. Por isso vale a regra de todo o curso — o menor gesto que o grupo inteiro consegue ler. Gesto demais cansa e confunde; gesto de menos não é visto do fundo." },
      { h: "Uma observação sobre este material",
        t: "É um resumo, em palavras próprias, de material de curso de regência de hinos e de manuais de técnica de batuta. Onde a prática da orquestra da sua região for outra, vale a orientação do encarregado." },
    ],
  },

  1: {
    titulo: "Postura, plano de regência e batuta",
    abre: "Antes do primeiro tempo, o grupo já leu a postura de quem vai reger. Corpo firme e solto diz 'podem confiar'; corpo travado ou encolhido diz o contrário.",
    blocos: [
      { h: "A postura",
        t: "Pés afastados na largura dos ombros, o peso dividido entre os dois, joelhos soltos. Tronco ereto sem rigidez, ombros baixos, pescoço livre. Os cotovelos ficam um pouco afastados do corpo — um palmo — e o antebraço, mais ou menos paralelo ao chão. A estante fica na altura do peito, sem tapar o gesto nem a visão do grupo: assim os olhos saem do hinário para o grupo sem que a cabeça precise subir e descer. Não se bate o pé nem se conta em voz alta.",
        fig: "reg-postura" },
      { h: "O plano de regência",
        t: "O gesto acontece num espaço à frente do corpo, da cintura até a altura dos ombros, na largura do tronco. É a mesma janela de movimento do MSA, agora voltada para o grupo: nem tão pequena que não se veja do fundo, nem tão grande que o braço canse e o tempo fique impreciso. Os tempos caem todos numa mesma altura, que chamaremos de linha de batida — na altura do umbigo ao peito, conforme o tamanho de quem rege." },
      { h: "A batuta",
        t: "Segura-se entre a polpa do polegar, de lado, e a lateral do indicador, entre a ponta e a articulação do meio. Os outros três dedos envolvem o cabo sem apertar, e o cabo encosta de leve na palma, sem ser empurrado para dentro dela. A palma fica voltada para baixo, e a batuta continua a linha do antebraço, apontando para a frente — nem para o lado, nem para cima. O aperto é o bastante para não cair e pouco o bastante para sentir a ponta: é a ponta que desenha o compasso. Batuta curta é mais fácil de controlar do que batuta longa; para começar, uma de 30 a 35 cm.",
        fig: "reg-batuta" },
      { h: "Sem batuta",
        t: "Com grupo pequeno, como na aula prática, reger com a mão é aceitável. A mão fica aberta, dedos juntos e soltos, palma para baixo; o ponto do tempo é a ponta dos dedos. O que vale para a batuta vale para a mão: o gesto nasce do antebraço, com o punho solto, e não do ombro. Se a orquestra da sua região tem regra para o uso da batuta nas aulas, siga a regra." },
      { h: "Os erros de sempre",
        t: "Segurar a batuta como espada, com o punho fechado; apontá-la para cima; travar o punho, o que deixa o gesto duro; colar o cotovelo no corpo, o que encolhe o gesto; reger olhando só para o hinário." },
    ],
    pratica: [
      "Cada instrutor toma a posição de atenção — braço levantado, batuta pronta, olhar no grupo — e a sustenta dez segundos sem tensão. Os colegas dizem se ela parece firme e solta.",
      "Nos hinos desta fase, só o desenho em 4. Para começar, siga a observação de entrada de cada hino, logo abaixo: ela diz o gesto de preparação — um tempo só. O porquê é o módulo 3.",
    ],
  },

  2: {
    titulo: "O tempo e o desenho em 4",
    abre: "O grupo não segue o braço inteiro: segue o ponto em que o tempo cai. Um tempo claro é uma queda com um rebote, como uma bola que quica.",
    blocos: [
      { h: "O ictus",
        t: "O ponto exato em que o tempo acontece chama-se ictus. O gesto acelera ao chegar nele, como a bola que cai, e sai dele com um rebote para cima, que já leva ao tempo seguinte. Um gesto sem ictus — uma curva contínua, igual do começo ao fim — obriga o grupo a adivinhar onde está o tempo." },
      { h: "Um plano só",
        t: "Os tempos caem na mesma linha de batida — menos o último, que é dado no alto, como o 'acima' do movimento do MSA, e já prepara a queda do 1. Se o 2 cai mais baixo que o 1, ou o 3 mais alto que o 2, o grupo lê um desenho torto e o compasso fica desigual. Entre o 1 e o penúltimo tempo, o que muda é a direção, não a altura do ictus." },
      { h: "O desenho em 4",
        t: "É o mesmo movimento em 4 do MSA: 1 abaixo, 2 dentro, 3 fora, 4 acima. O 1 é o mais forte e o mais vertical — é por ele que todos se reencontram; o 3 cruza para fora com um pouco mais de peso que o 2; o 4 sobe e já prepara o 1. O rebote de cada tempo é pequeno: se ele sobe demais, parece outro tempo.",
        fig: "reg-4" },
      { h: "O olhar",
        t: "O hino estudado deixa os olhos livres. Olhe para o grupo nos começos, nos fins de frase e onde alguém precisa entrar; olhe para a folha só para confirmar." },
    ],
    pratica: [
      "Todos juntos, em silêncio: o desenho em 4 com o metrônomo em 60, depois em 80. Um colega observa só uma coisa — se os quatro tempos caem na mesma altura.",
      "Cada instrutor rege um hino desta fase. O grupo toca sem olhar para o hinário no primeiro compasso de cada sistema, só para o regente.",
    ],
  },

  3: {
    titulo: "A preparação e a entrada",
    abre: "O começo do hino é decidido um tempo antes dele. A preparação diz ao grupo, num gesto só, o andamento, a força e o caráter com que se vai tocar.",
    blocos: [
      { h: "Da atenção à preparação",
        t: "Primeiro a posição de atenção: braço levantado, parado, e o olhar percorrendo o grupo. Só se prepara quando todos estão prontos — instrumento em posição, olhos no regente. Então vem a preparação: um único tempo, o que antecede a entrada, feito no andamento do hino e acompanhado de uma respiração, como se o regente fosse cantar junto. O grupo respira com ele e entra no tempo seguinte." },
      { h: "O que a preparação carrega",
        t: "A velocidade do gesto de preparação é o andamento: preparação lenta, hino lento. O tamanho e o peso são a dinâmica: preparação pequena e leve, entrada suave; ampla e pesada, entrada forte. A forma é a articulação: redonda para o ligado, mais angulosa para o destacado. Uma preparação que não bate com o que vem depois produz uma entrada desencontrada." },
      { h: "Hino tético",
        t: "Começa no 1º tempo. A preparação é o gesto do último tempo do compasso — em 4, o 4, que sobe; do alto ele cai no 1, e o grupo entra." },
      { h: "Hino anacrúsico",
        t: "Começa antes do 1º tempo. A preparação é o tempo imediatamente anterior ao da entrada: se o hino começa no 4º tempo, prepara-se com o gesto do 3 (fora), e o grupo entra no 4 (acima). Os tempos vazios do começo não são marcados — marcar 1, 2, 3 antes de uma entrada no 4 só confunde. Onde o hino começa: conte na partitura quanto falta ao primeiro compasso.",
        fig: "reg-preparacao" },
    ],
    pratica: [
      "Cada instrutor faz três preparações seguidas para o mesmo hino: lenta, no andamento certo e rápida. O grupo só respira, sem tocar, e diz em qual andamento entraria.",
      "Um dos hinos desta fase é anacrúsico: ninguém começa sem dizer antes em que tempo ele entra e qual é o gesto de preparação.",
    ],
  },

  4: {
    titulo: "Os desenhos em 3 e em 2 — e o corte final",
    abre: "O MSA chegou aos compassos em 3 e em 2. Os desenhos de regência são os mesmos movimentos do solfejo, com ictus e rebote. E todo hino que começa precisa terminar: o corte final.",
    blocos: [
      { h: "Em 3",
        t: "1 abaixo, 2 fora, 3 acima. O 2 vai para fora — para a direita de quem rege — e não para dentro; é o erro mais comum de quem vem do compasso em 4. O 3 sobe e prepara o 1.",
        fig: "reg-3" },
      { h: "Em 2",
        t: "1 abaixo, 2 acima. Com só dois tempos, o desenho fica vertical, e o risco é o 1 e o 2 parecerem iguais. O 1 cai com decisão; o rebote do 1 vai um pouco para a direita e sobe até o 2, e do 2 a mão cai de novo no 1. Nos compassos em 2 lentos, o rebote do 1 é maior; nos rápidos, o desenho encolhe.",
        fig: "reg-2" },
      { h: "O corte final",
        t: "No último tempo, depois do valor da nota final, a mão faz um laço pequeno — fecha — e para. O corte tem ictus como qualquer tempo: o grupo tira o som junto no ponto em que a mão fecha. Depois do corte, a mão fica parada um instante, e só então baixa; baixar o braço junto com o corte é cortar o silêncio que fecha o hino.",
        fig: "reg-corte" },
    ],
    pratica: [
      "Cada instrutor rege um hino em 3 ou em 2 desta fase, do começo ao fim, com corte final. Os colegas observam se o 2 do compasso em 3 foi para fora.",
      "Exercício de corte: o grupo sustenta um acorde; o regente corta três vezes, cada vez mais suave, sem mudar o ponto do corte.",
    ],
  },

  5: {
    titulo: "A fermata e o compasso em 6",
    abre: "Duas coisas que o MSA ensina nesta fase mudam a mão de quem rege: a fermata, que suspende o tempo, e o compasso em 6, que pode ser regido em 6 ou em 2.",
    blocos: [
      { h: "A fermata",
        t: "O gesto chega ao tempo da fermata e para no ponto desse tempo — mas a mão fica viva, não cai; enquanto ela está parada, o som continua. A duração é do regente, e o grupo só sabe quanto dura olhando para ele: combine antes, na aula prática, quanto a fermata segura. A saída depende do que vem depois. Se há respiração ou pausa, faz-se um corte pequeno, e o fim do corte já é a preparação do tempo seguinte, no andamento de antes. Se a música continua ligada, não há corte: a mão sai direto no gesto do tempo seguinte.",
        fig: "reg-fermata" },
      { h: "Em 6 ou em 2",
        t: "O compasso 6/8 tem dois tempos, cada um com três colcheias. Quando o andamento é movido, rege-se em 2, cada gesto valendo uma semínima pontuada, com um rebote redondo que 'carrega' as três colcheias. Quando é lento, rege-se em 6, um gesto por colcheia. O hinário muitas vezes traz a marcação impressa ('em 2', 'em 6'): ela manda. Sem marcação, a faixa do metrônomo sozinha não decide — no hinário há 6/8 marcados em 6 e em 2 na mesma faixa. Pese o caráter, a segurança do grupo e quantos gestos por minuto cada opção dá." },
      { h: "O desenho em 6 na regência",
        t: "Aqui há uma diferença a conhecer. O movimento de solfejo em 6 do MSA segue o desenho do compasso em 2: pontos 1 a 3 abaixo, 4 a 6 acima. Na regência de conjunto, a maioria dos manuais usa outro desenho, que parte do compasso em 4: 1 abaixo, 2 e 3 para dentro, 4 e 5 para fora, 6 acima — o 4 é o segundo tempo forte e cruza para fora com peso. O do MSA é o que os manuais chamam de 6 subdividido em 2. Os dois funcionam; o que não pode é o regente misturar os dois no mesmo hino. Confirme com o encarregado qual desenho a orquestra da sua região usa.",
        fig: "reg-6" },
      { h: "A tercina",
        t: "A tercina não muda o gesto: o tempo continua do mesmo tamanho, e as três notas cabem dentro dele. Se o grupo correr na tercina, o regente não a desenha — firma o ictus do tempo seguinte." },
    ],
    pratica: [
      "Cada instrutor rege o hino em 6/8 desta fase das duas maneiras, em 2 e em 6, e o grupo diz qual deu mais segurança no andamento marcado.",
      "Em cada fermata dos hinos desta fase, o regente diz antes quanto vai segurar ('quatro tempos', 'uma respiração') e se há corte ou não.",
    ],
  },

  6: {
    titulo: "A mão esquerda",
    abre: "Até aqui, uma mão fez tudo. A mão esquerda existe para o que a direita não consegue dizer sem perder o tempo.",
    blocos: [
      { h: "A direita marca, a esquerda expressa",
        t: "A mão direita — ou a batuta — é o relógio: não para de dar o tempo. A esquerda entra quando há algo a dizer: chamar a entrada de um naipe, pedir que cresça ou diminua, segurar uma fermata, dar um corte. Quando não há nada a dizer, ela descansa: junto ao corpo, na altura da cintura, relaxada — não pendurada, pronta para voltar." },
      { h: "O erro do espelho",
        t: "Reger com as duas mãos fazendo o mesmo desenho, uma espelhando a outra, é o hábito mais comum e o menos útil: a esquerda gasta sua força repetindo a direita, e quando precisa dizer algo, ninguém mais olha para ela. Espelhar só vale num momento: numa entrada importante ou num corte final, para ser visto por todos." },
      { h: "Gestos da esquerda",
        t: "Palma para cima, subindo devagar: mais som. Palma para baixo, descendo: menos som. Mão aberta e parada: sustenta (fermata). Um fechar de mão: corta. Olhar e mão juntos em direção a um naipe: é a vez de vocês. Cada gesto começa um pouco antes do que ele pede, como toda preparação." },
      { h: "Tom, semitom — e o regente",
        t: "O conteúdo do MSA nesta fase é de ouvido. Vale para quem rege: antes de começar, dê ao grupo a referência da tonalidade — a tônica, ou o acorde — e ouça se ela veio afinada. Afinar a tônica antes do hino é mais fácil do que corrigir depois." },
    ],
    pratica: [
      "Exercício de independência: a direita rege em 4, no metrônomo, enquanto a esquerda sobe devagar de palma para cima por quatro compassos e desce por outros quatro.",
      "Nos hinos desta fase, a esquerda só entra em dois momentos: no começo, para chamar todos, e no corte final. No resto, descansa.",
    ],
  },

  7: {
    titulo: "Compassos em 9 e em 12 — e a escolha do andamento",
    abre: "Os compostos maiores são regidos como os simples que eles repetem. E toda aula prática depende de um andamento escolhido antes, e não na hora.",
    blocos: [
      { h: "Em 9 e em 12",
        t: "O 9/8 tem três tempos de três colcheias; o 12/8, quatro. No andamento movido, rege-se em 3 e em 4, um gesto por semínima pontuada. No lento, cada tempo se subdivide em três — é o movimento em 9 e em 12 do MSA, que o regente já conhece: o desenho do 3 e do 4, com três pulsos em cada direção, sendo o primeiro de cada grupo o maior. A marcação impressa no hinário ('em 9', 'em 4') decide.",
        fig: "mov9" },
      { h: "O andamento",
        t: "O hinário traz uma faixa de metrônomo (por exemplo, ♩ = 63–88). Qualquer andamento dentro dela está certo; o meio da faixa é um bom ponto de partida. Mais para o lento: grupo grande, igreja com eco, hino de caráter solene. Mais para o movido: grupo pequeno, hino de louvor. Escolha antes, confira com o metrônomo, cante mentalmente a primeira frase nesse andamento — e só então prepare. O metrônomo fala da figura impressa ao lado do sinal: num 6/8, em geral a colcheia. Quem rege em 2 divide por três para saber quantos gestos por minuto faz." },
      { h: "Sustentar o andamento",
        t: "O andamento que se escolheu no começo é o do fim. O grupo tende a correr nas partes fáceis e a arrastar nas difíceis; o regente, a acompanhar o grupo. O gesto é que puxa o andamento, e não o contrário." },
    ],
    pratica: [
      "Antes de reger, cada instrutor diz o número de metrônomo que escolheu e por quê. Um colega confere com o metrônomo o andamento do primeiro e do último sistema.",
      "Nos hinos em 9 e em 12 desta fase, rege-se primeiro subdividido, devagar, e depois no andamento, com um gesto por tempo.",
    ],
  },

  8: {
    titulo: "Como conduzir um ensaio",
    abre: "Na aula prática, o regente também ensaia: para, corrige e recomeça. Um bom ensaio parece com uma boa aula — pouca fala, muita música.",
    blocos: [
      { h: "Ensaio não é palestra",
        t: "Pare só quando algo precisa mudar, e diga em uma frase o que mudar: 'segundo sistema, o contralto mais baixo'. Uma correção por vez. Discurso longo esfria o grupo e ninguém guarda mais de uma instrução." },
      { h: "O ciclo do ensaio",
        t: "Tocar o hino inteiro uma vez, sem parar, para ouvir. Escolher o que mais precisa de trabalho. Trabalhar esse trecho — mais devagar, só um naipe, cantando. Voltar a tocar o trecho no andamento. E terminar tocando o hino inteiro de novo: o grupo sai do ensaio com a música, e não com o pedaço." },
      { h: "Para recomeçar",
        t: "Dê o ponto com clareza — número do sistema, do compasso ou da estrofe — e espere todos acharem antes de preparar. Recomece de um começo de frase, não do meio de uma." },
      { h: "Tonalidade e afinação",
        t: "O MSA chegou à tonalidade. No ensaio, isso é prático: dar a tônica antes de começar, ouvir se as notas com acidente ocorrente estão sendo lidas, e parar num acorde para afinar quando algo soa estranho — com a mão parada no alto, como numa fermata." },
    ],
    pratica: [
      "Cada instrutor rege um hino desta fase e faz um ensaio de cinco minutos: toca inteiro, escolhe um trecho, corrige uma coisa, toca inteiro de novo.",
      "Os colegas contam quantas frases o regente disse em cada parada. Mais de duas, e o ensaio virou palestra.",
    ],
  },

  9: {
    titulo: "Estrofes, ritornelo e o corte que prepara",
    abre: "Os hinos se cantam em várias estrofes. Na volta do fim de uma estrofe para o começo da seguinte o grupo se perde com mais facilidade que em qualquer outro ponto.",
    blocos: [
      { h: "O corte entre as estrofes",
        t: "No fim da estrofe, o regente corta — e o fim do corte já é a preparação da estrofe seguinte. O grupo respira junto no corte e entra sem nova contagem. O laço do corte sai para o lado do gesto de preparação. Quando a preparação é o tempo de fora — hino que entra no último tempo de um compasso em 3 ou em 4, ou numa fração do tempo de fora —, o laço sai para fora. Nos outros casos — entrada no 1º tempo, compasso em 2, fração do último tempo —, o laço sai para dentro e sobe, e o tempo da preparação cai dali. O tempo entre as estrofes é fixo: combine com o grupo quantos tempos são e mantenha-o igual em todas.",
        fig: "reg-corte" },
      { h: "O ritornelo",
        t: "Na barra de repetição não se corta: o gesto do último tempo antes da barra já leva de volta ao começo do trecho, sem parada. Nas casas 1 e 2, olhe para o grupo na passagem da primeira para a segunda — é ali que alguém repete de novo. Combine antes, na aula, quantas vezes se repete." },
      { h: "Estrofe e coro",
        t: "Quando o hino tem coro, a volta do coro para a estrofe seguinte segue a mesma regra do corte entre estrofes. Mudanças de caráter entre estrofe e coro — mais forte, mais largo — começam na preparação, não depois." },
    ],
    pratica: [
      "Cada instrutor rege um hino desta fase com duas estrofes seguidas, sem parar entre elas. O grupo diz se a volta foi clara.",
      "Antes de reger, o instrutor mostra no hinário onde estão a barra de repetição e as casas, e diz o que o gesto faz em cada uma.",
    ],
  },

  10: {
    titulo: "Dinâmica no gesto",
    abre: "O grupo toca do tamanho do gesto. Quem rege um hino inteiro do mesmo tamanho pede, sem perceber, um hino inteiro na mesma dinâmica.",
    blocos: [
      { h: "Tamanho e peso",
        t: "Piano: gesto pequeno, leve, perto do corpo. Forte: gesto amplo, com peso no braço. O andamento não muda com o tamanho: o gesto grande percorre mais espaço no mesmo tempo, então anda mais depressa no ar. O regente iniciante tende a arrastar quando o gesto cresce e a apressar quando ele encolhe; o grupo, ao contrário, tende a correr no crescendo. O gesto mantém o andamento nos dois casos.",
        fig: "reg-dinamica" },
      { h: "Crescendo e diminuendo",
        t: "O desenho cresce ou diminui aos poucos, compasso a compasso, junto com a mão esquerda — palma para cima para crescer, para baixo para diminuir. O crescendo começa pequeno: quem já começa grande não tem para onde crescer." },
      { h: "Mudança súbita",
        t: "Um piano súbito se pede na preparação: o último gesto antes dele já é pequeno. Não há como pedir piano depois que o som já saiu forte." },
      { h: "O hinário",
        t: "O hinário revisado traz as dinâmicas impressas — em cor, na partitura. Antes de reger, marque onde elas mudam e decida o tamanho do gesto em cada trecho." },
    ],
    pratica: [
      "Cada instrutor rege um sistema de um hino três vezes — piano, mezzo forte e forte — sem dizer qual. O grupo toca o que vê; depois os colegas dizem se o andamento se manteve igual nas três.",
      "Nos hinos desta fase, o regente mostra com o gesto todas as dinâmicas impressas, sem dizer nenhuma com palavras.",
    ],
  },

  11: {
    titulo: "Acento, articulação e o compasso regido em 2",
    abre: "O MSA chegou ao acento métrico e aos tipos de compasso. No gesto, isso é a diferença entre o tempo forte e o fraco — e entre o ligado e o destacado.",
    blocos: [
      { h: "O peso dos tempos",
        t: "O desenho já carrega o acento métrico: o 1 é o gesto mais vertical e mais pesado; no compasso em 4, o 3 tem um pouco de peso; os outros são leves. Reger todos os tempos com o mesmo peso apaga o balanço do compasso." },
      { h: "Ligado e destacado",
        t: "Para o ligado, gesto redondo, contínuo, com rebote suave — a mão parece passar por dentro de algo espesso. Para o destacado, gesto mais anguloso, com o ictus nítido e uma pequena parada depois dele. Um acento isolado se pede com uma preparação um pouco maior antes do tempo acentuado, não com um golpe maior nele." },
      { h: "4/4 regido em 2",
        t: "Alguns hinos em 4/4 trazem a marcação 'em 2': rege-se um gesto por mínima, com o desenho do compasso em 2 — em geral porque quatro gestos por compasso deixariam o hino pesado ou agitado. O mesmo vale para o C cortado (2/2), que é naturalmente em 2. O grupo continua contando quatro; o regente dá dois." },
      { h: "Mudança de fórmula",
        t: "Quando o hino muda de fórmula no meio — de 3/4 para 4/4, por exemplo —, o desenho muda no compasso da troca. O que precisa estar claro é o 1º tempo do compasso novo: prepare-o com o último tempo do desenho antigo e olhe para o grupo na passagem." },
    ],
    pratica: [
      "O mesmo hino regido duas vezes: uma ligada, outra destacada. O grupo toca o que vê.",
      "O hino desta fase com mudança de fórmula: o regente mostra no hinário o compasso da troca antes de começar.",
    ],
  },

  12: {
    titulo: "Síncopa e contratempo: o pulso não se mexe",
    abre: "Na síncopa, o som cai fora do tempo. A tentação é reger o som. Não se rege: o regente é o tempo, e é justamente contra ele que a síncopa soa.",
    blocos: [
      { h: "Firmar o tempo",
        t: "Nos trechos sincopados, o gesto fica mais nítido, com ictus claro e rebote curto, e não muda de tamanho. Quem rege a síncopa — dando um gesto no meio do tempo — tira do grupo a referência que ele precisa para tocá-la." },
      { h: "O contratempo",
        t: "No contratempo, o som vem logo depois do tempo. O rebote é que o ajuda: um rebote vivo, que sobe logo depois do ictus, mostra onde o som entra. Um rebote preguiçoso faz o contratempo chegar atrasado." },
      { h: "Quando o grupo se perde",
        t: "Síncopa desencontrada quase sempre é pulso inseguro. Ensaie o trecho com o grupo batendo o tempo (em silêncio, no pé ou na perna), depois tocando. O regente segue firme — não acompanha o grupo que acelera." },
    ],
    pratica: [
      "Nos hinos desta fase, antes de reger, o instrutor mostra na partitura onde está a síncopa ou o contratempo e rege esse trecho duas vezes, devagar e no andamento.",
      "Um colega observa só o gesto no trecho sincopado: ele mudou de tamanho ou ganhou um gesto a mais?",
    ],
  },

  13: {
    titulo: "Entradas difíceis: anacruse de fração e acéfalo",
    abre: "O MSA chegou aos ritmos iniciais. Para quem rege, cada um pede um jeito de começar — e os dois mais difíceis são a anacruse de meio tempo e o começo acéfalo.",
    blocos: [
      { h: "Anacruse de fração de tempo",
        t: "Quando o hino começa no meio de um tempo — uma colcheia no fim do 2º tempo de um 6/8 em 2, ou a segunda metade de um tempo —, a preparação é o próprio tempo onde a anacruse está: o regente faz esse gesto, e o grupo entra na parte dele que cabe à anacruse. Não se inventa um gesto para a fração. Se o grupo for inseguro, pode-se dar antes mais um tempo, pequeno — um só." },
      { h: "Anacruse longa",
        t: "Se o hino começa com três tempos antes do primeiro compasso completo — o compasso inicial tem tudo menos o 1 —, a preparação é o 1, pequeno e sem som, e o grupo entra no 2. Aqui, como em toda anacruse, os tempos antes da preparação não se marcam." },
      { h: "Começo acéfalo",
        t: "O hino acéfalo começa com pausa no 1º tempo: o grupo entra depois dela. O 1 então não é silêncio passivo — é o gesto que dá o ataque. Prepare com o último tempo do compasso, como num tético, e dê o 1 seco, firme, incisivo; o grupo entra logo depois, na parte fraca. Um 1 mole deixa cada um entrar numa hora." },
    ],
    pratica: [
      "Cada instrutor rege o começo dos hinos desta fase três vezes seguidas, só os dois primeiros compassos, até o grupo entrar junto sem nenhuma palavra.",
      "Para o hino acéfalo, o grupo primeiro só bate a pausa e a entrada com a mão, olhando o regente; depois toca.",
    ],
  },

  14: {
    titulo: "Subdivisão e notas pontuadas",
    abre: "Nos andamentos lentos, um gesto por tempo deixa espaço demais entre os ictus, e o grupo começa a dividir o tempo cada um do seu jeito. A saída é subdividir.",
    blocos: [
      { h: "Subdividir o gesto",
        t: "No gesto subdividido, cada tempo ganha um segundo ictus, menor, logo depois do principal, na mesma direção: em 4, o 1 cai e dá um pequeno segundo toque antes de ir para o 2. O desenho do compasso continua reconhecível; os toques menores só mostram a metade do tempo. Use a subdivisão onde ela resolve algo — uma frase lenta, um ritardando — e não no hino inteiro." },
      { h: "Notas pontuadas",
        t: "A colcheia pontuada seguida de semicolcheia tende a virar tercina ou a ser apressada. O gesto não desenha o pontuado; ele segura o tempo firme e, se preciso, subdividido — é na subdivisão que a semicolcheia encontra o seu lugar, no fim do tempo, e não no meio." },
      { h: "O compasso composto lento",
        t: "É onde a subdivisão já está no desenho: o 6/8 lento regido em 6, o 9/8 em 9. Se um hino em 6/8 marcado 'em 2' tiver uma passagem lenta — um fim de estrofe com ritardando —, pode-se passar para 6 ali, e voltar ao 2 depois." },
    ],
    pratica: [
      "Um hino desta fase regido abaixo do andamento marcado, duas vezes: sem e com subdivisão nos trechos pontuados. O grupo diz em qual as semicolcheias ficaram juntas.",
      "Os colegas observam se, na subdivisão, o desenho do compasso continuou reconhecível.",
    ],
  },

  15: {
    titulo: "Mudanças de andamento: ritardando e a tempo",
    abre: "O MSA chegou ao andamento. Mudar o andamento no meio do hino é o que mais separa um grupo regido de um grupo que só toca junto.",
    blocos: [
      { h: "O ritardando",
        t: "O gesto alarga aos poucos: cada tempo um pouco mais lento e um pouco maior que o anterior. O grupo precisa ver o ritardando antes de ouvi-lo — ele começa com os olhos e com a mão esquerda, e só então no tempo. Nos fins de hino, onde o ritardando é mais comum, subdividir os últimos tempos ajuda o grupo a ficar junto." },
      { h: "O a tempo",
        t: "A volta ao andamento se faz num gesto de preparação no andamento novo — como um começo. Não há volta gradual: o a tempo é de uma vez." },
      { h: "Accelerando",
        t: "O contrário do ritardando: o gesto encurta aos poucos. É raro nos hinos; quando aparece, o regente cuida de não encolher tanto que o grupo não veja." },
      { h: "A fermata no fim",
        t: "O fim do hino é o lugar da fermata longa: ritardando nos últimos tempos, fermata, corte final. Com o grupo inteiro olhando para o regente, ele pode segurar o quanto o caráter pede." },
    ],
    pratica: [
      "Cada instrutor rege o último sistema de um hino desta fase com ritardando e fermata final, três vezes, sem avisar quanto vai atrasar. O grupo tem de acompanhar só pelo gesto.",
      "Um colega marca com o metrônomo o andamento no começo e depois do a tempo: voltou ao mesmo número?",
    ],
  },

  16: {
    titulo: "A frase — e como avaliar um colega",
    abre: "No fim do MSA, o candidato aprendeu a frase. No fim deste curso, o regente aprende a reger frases, e não compassos.",
    blocos: [
      { h: "Reger a frase",
        t: "Uma frase tem começo, ponto alto e fim. O gesto acompanha: cresce um pouco para o ponto alto e se recolhe para o fim, e a respiração entre uma frase e outra é dada pelo regente, com a mesma respiração da preparação. Nos hinos, as frases acompanham os versos: onde a congregação respira, a orquestra respira junto." },
      { h: "O caráter",
        t: "A indicação no alto do hino — solene, majestoso, com fervor — é o primeiro dado da preparação. Solene: gesto largo, pesado e ligado, preparação sem pressa. Majestoso: gesto amplo e firme, com peso no 1º tempo, sem arrastar. O caráter aparece antes da primeira nota, na postura e na preparação." },
      { h: "Como avaliar um colega",
        t: "Na aula prática, a avaliação de quem rege segue sempre a mesma ordem: o começo foi junto? O andamento se manteve? As fermatas e os cortes foram claros? O fim foi junto? Só depois disso vêm caráter e dinâmica. E a devolutiva é curta: uma coisa que funcionou, uma coisa a mudar." },
      { h: "Depois do curso",
        t: "Os módulos se repetem com hinos novos: a lista de repertório do fim do volume serve para isso. Cada instrutor pode reger, a cada mês, um hino que traga uma dificuldade que ele ainda não enfrentou." },
    ],
    pratica: [
      "Cada instrutor rege os hinos desta fase marcando com o gesto o começo, o ponto alto e o fim de cada frase.",
      "Os colegas avaliam na ordem acima, por escrito, e entregam a folha ao regente.",
    ],
  },
};

if (typeof module !== "undefined") module.exports = { REGENCIA };
