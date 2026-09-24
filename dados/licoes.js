/* Texto didático de cada aula, escrito para esta apostila.
 *
 * O que é e o que NÃO é: o Manual do GEM determina que o conteúdo do MSA seja
 * apresentado por inteiro pelo instrutor. Este texto é complementar — serve
 * para o candidato reler em casa o que ouviu na aula, com as palavras
 * organizadas de outro jeito e com uma figura ao lado. Não substitui o MSA,
 * não reproduz o MSA e não dispensa a aula.
 *
 * Chave: "<período>-<aula>". Campos:
 *   titulo   título da aula nesta apostila
 *   abre     parágrafo de abertura — o porquê daquele assunto
 *   blocos   [{h: subtítulo, t: texto, fig: nome do PNG em assets/figuras}]
 *   atencao  o erro que mais aparece nessa aula
 *   casa     o que o candidato leva para estudar até a próxima
 */
const LICOES = {

/* ==================== 1º PERÍODO ==================== */

"1-1": {
  titulo: "O GEM, a orquestra e o caminho até a oficialização",
  abre: "Antes de qualquer nota, vale saber onde você está entrando e para quê. O GEM — Grupo de Estudos Musicais — é o grupo em que se estuda; o MSA — Método Simplificado de Aprendizagem Musical — é o material que ali se estuda. São coisas diferentes, e confundi-las atrapalha depois.",
  blocos: [
    { h: "Por que existe o GEM", t: "Para preparar o candidato com condições satisfatórias de executar os hinos e de prestar o exame de oficialização. Não é um curso de música em geral: é o caminho que leva alguém a tocar nos santos cultos." },
    { h: "Para que serve a orquestra", t: "Para auxiliar a irmandade no cantar dos hinos. Essa frase é curta e decide quase tudo o que virá: se a orquestra existe para sustentar o canto, então o que se espera de cada músico é constância, afinação e conjunto — nunca destaque pessoal, nem nota fora do que está escrito." },
    { h: "Como a orquestra é formada", t: "Três famílias de instrumentos — Cordas, Madeiras (os saxofones entram aqui) e Metais — mais o Órgão Eletrônico. A lista dos instrumentos permitidos está no MOO, o Manual de Orientação Orquestral, e a escolha do instrumento passa pelo encarregado local ou regional." },
    { h: "O tempo do curso", t: "Quatro períodos de quinze aulas: sessenta aulas ao todo, cerca de dois anos. Cada período fecha uma etapa, e nenhuma delas se pula." },
  ],
  atencao: "Quem chega achando que \"já sabe tocar\" costuma tropeçar justamente aqui: o GEM não mede o quanto você toca, e sim se você lê, conta e anda junto com o conjunto.",
  casa: "Descubra com o encarregado local qual é o seu instrumento e a sua voz na orquestra. Anote as duas coisas na primeira página deste caderno.",
},

"1-2": {
  titulo: "O que é música, o que é som",
  abre: "A música se apoia em três elementos, e o som em quatro propriedades. Parecem definições de decorar — mas são elas que dão nome ao que você vai ouvir errado no próprio instrumento pelos próximos dois anos.",
  blocos: [
    { h: "Os três elementos", t: "Melodia é a produção ordenada de sons sucessivos: um depois do outro. Harmonia é a produção ordenada de vários sons diferentes soando ao mesmo tempo. Ritmo é a disposição ordenada dos sons no tempo, combinando sons curtos, sons longos e silêncios. Num hino, a sua voz é melodia; o hino inteiro, com as quatro vozes, é harmonia; e o que faz tudo andar junto é o ritmo." },
    { h: "As quatro propriedades do som", t: "Altura: se o som é grave ou agudo. Duração: quanto tempo ele se sustenta. Intensidade: se é forte ou fraco. Timbre: o que permite distinguir um violino de um clarinete tocando a mesma nota, com a mesma força." },
    { h: "Por que separar as quatro", t: "Porque o erro tem endereço. \"Está feio\" não ajuda ninguém. \"Está baixo demais\" é intensidade; \"está desafinado\" é altura; \"você cortou a nota\" é duração; \"o naipe não está soando igual\" é timbre. Nomear é o primeiro passo para corrigir." },
  ],
  atencao: "Altura e intensidade se confundem o tempo todo. Tocar mais agudo não é tocar mais forte. Nas aulas, quando alguém sobe de altura ao pedir mais volume, é este conceito que falta.",
  casa: "Ouça um hino e tente dizer, para um trecho, qual voz tem a melodia e em que momento a harmonia muda de cor.",
},

"1-3": {
  titulo: "As sete notas e onde elas moram",
  abre: "São sete notas, e só sete: Dó, Ré, Mi, Fá, Sol, Lá, Si — da mais grave à mais aguda. Passando do Si, tudo recomeça no Dó, um degrau acima. Esse ciclo de sete é a espinha de toda a leitura.",
  blocos: [
    { h: "As notas se repetem", t: "À medida que o som sobe, as notas se repetem na mesma ordem, de sete em sete. O Dó de baixo e o Dó de cima têm o mesmo nome porque são a mesma nota em alturas diferentes — e é por isso que o soprano do violino pode soar uma oitava acima sem virar outra nota." },
    { h: "Ler é reconhecer, não contar", t: "No começo todo mundo conta: \"Dó, Ré, Mi...\" a partir de uma nota conhecida. Funciona, mas é lento. O objetivo do período é olhar a posição e dizer o nome, sem contar — como se lê uma palavra sem soletrar." },
  ],
  atencao: "Contar sempre a partir do Dó trava a leitura. Escolha três notas de referência no seu instrumento e treine reconhecê-las de imediato; as vizinhas saem sozinhas.",
  casa: "Diga em voz alta as sete notas subindo e descendo, sem hesitar, três vezes por dia. Parece bobo, e é o que destrava a leitura.",
},

"1-4": {
  titulo: "O pentagrama e as claves",
  abre: "A altura do som ganha registro gráfico em cinco linhas e quatro espaços. Onde a nota está desenhada diz qual é a nota — mas só depois que a clave disser a partir de onde se conta.",
  blocos: [
    { h: "Cinco linhas, contadas de baixo para cima", t: "A linha de baixo é a 1ª, a de cima é a 5ª. Os espaços entre elas seguem a mesma contagem. Quando a nota não cabe dentro das cinco linhas, desenham-se linhas suplementares, acima ou abaixo, só onde a nota precisa.", fig: "pentagrama" },
    { h: "As três claves", t: "A clave diz que nota mora em determinada linha, e a partir dela todas as outras se organizam. Clave de Sol na 2ª linha: violino, flauta, clarinete, trompete, saxofone. Clave de Fá na 4ª linha: violoncelo, trombone, tuba, baixo. Clave de Dó na 3ª linha: viola.", fig: "claves" },
    { h: "Por que claves diferentes", t: "Para não encher a partitura de linhas suplementares. Um instrumento grave escrito em clave de Sol viveria abaixo da pauta; em clave de Fá, ele cabe. A clave é uma conveniência de leitura, não uma dificuldade extra." },
  ],
  atencao: "Ler a partitura do colega esquecendo que a clave é outra. Antes de dizer qualquer nome de nota, olhe a clave.",
  casa: "Escreva no início de oito pentagramas a clave do seu instrumento e nomeie as notas que o instrutor indicar.",
},

"1-5": {
  titulo: "As figuras e o que cada uma vale",
  abre: "A altura já tem registro; falta a duração. As figuras de som — e as figuras de silêncio, que são as pausas — dizem quanto tempo cada nota dura, ou quanto tempo se fica calado.",
  blocos: [
    { h: "Cada figura vale o dobro da seguinte", t: "Semibreve, mínima, semínima, colcheia, semicolcheia: a cada passo, o valor cai pela metade. E para cada figura de som existe uma pausa que vale exatamente o mesmo, em silêncio.", fig: "figuras" },
    { h: "As partes da figura", t: "Cabeça (a bolinha, cheia ou vazia), haste (o traço) e colchete (o gancho). É a combinação delas que diz o valor: cabeça vazia sem haste é semibreve; vazia com haste é mínima; cheia com haste é semínima; cheia com haste e um colchete é colcheia." },
    { h: "Vale \"um tempo\" ou vale \"uma semínima\"?", t: "Cuidado com esse atalho. A semínima vale um tempo em 4/4, mas a fórmula de compasso é que decide qual figura ocupa um tempo. Por ora, trabalhe em 4/4 e guarde que isso vai mudar." },
  ],
  atencao: "Encurtar a pausa. A pausa não é um descanso: é uma figura com duração exata, e o compasso só fecha se ela for contada inteira.",
  casa: "Localize num hino as figuras que aparecem e as que não aparecem. Desenhe cada uma e escreva o nome ao lado.",
},

"1-6": {
  titulo: "Compasso e barras de compasso",
  abre: "A música não corre solta: ela se organiza em séries regulares de tempos, e cada série é um compasso. As barras de compasso são as linhas verticais que separam uma série da outra.",
  blocos: [
    { h: "Três barras, três recados", t: "A barra simples é uma linha vertical: fecha um compasso e abre o seguinte. A barra dupla são duas linhas finas: marca o fim de uma seção — costuma anunciar mudança de armadura, de fórmula de compasso ou de andamento. A barra final são duas linhas, a segunda mais grossa: acabou o hino." },
    { h: "Para que serve dividir", t: "Para dar referência. Sem compasso não há tempo forte, sem tempo forte não há conjunto — cada um entraria onde achasse. A barra é o acordo entre todos de onde recomeça a contagem." },
  ],
  atencao: "Confundir barra dupla com barra final e parar no meio do hino. A dupla é fina-fina; a final tem a segunda grossa.",
  casa: "No hino indicado, conte os compassos do primeiro sistema pelas barras — e não pelos grupos de notas, que enganam.",
},

"1-7": {
  titulo: "A fórmula de compasso em 4",
  abre: "Logo depois da clave vêm dois números, um sobre o outro. Não é fração: são duas informações independentes, e é preciso ler as duas.",
  blocos: [
    { h: "O de cima e o de baixo", t: "O número de cima diz quantos tempos há em cada compasso. O de baixo diz qual figura vale um tempo — 4 significa semínima. Em 4/4, portanto: quatro tempos por compasso, cada um valendo uma semínima.", fig: "formula" },
    { h: "Unidade de tempo e unidade de compasso", t: "A unidade de tempo é a figura que preenche um tempo; a unidade de compasso é a figura que preenche o compasso inteiro. Em 4/4, semínima e semibreve, respectivamente." },
  ],
  atencao: "Ler os dois números como se fossem a mesma coisa (\"quatro por quatro, quatro semínimas\") e travar quando aparecer 3/4 ou 6/8. Leia de cima para baixo, sempre nessa ordem.",
  casa: "Abra o hinário em três hinos quaisquer e leia em voz alta a fórmula de compasso de cada um, dizendo o que cada número significa.",
},

"1-8": {
  titulo: "Ritmo e pulsação",
  abre: "Pulsação é a batida constante que corre por baixo da música, como o tique de um relógio. Ritmo é o desenho que as figuras fazem sobre essa batida. Os dois não são a mesma coisa — e é por isso que se pode ter ritmo errado com pulsação certa, ou o contrário.",
  blocos: [
    { h: "O pulso é regular", t: "Batidas constantes, com a mesma duração, marcando o início e o fim de cada tempo. Bata a mão suavemente, ou o pé sem peso — o gesto serve para medir, não para fazer barulho." },
    { h: "Como se faz a leitura rítmica", t: "Fala-se a sílaba TÁ em cada som, na duração exata da figura, mantendo o pulso. Nada de altura, nada de nome de nota: só a duração. Nas lições do MSA o som aparece como uma linha horizontal e a pulsação como uma linha vertical — a notação vem depois." },
    { h: "Um só pulso, uma só voz", t: "Em grupo, o objetivo não é cada um acertar sozinho: é todos na mesma velocidade e na mesma intensidade. Quem fala mais alto que o grupo atrapalha tanto quanto quem erra." },
  ],
  atencao: "Acelerar nas figuras curtas e arrastar nas longas. É o erro mais comum do curso inteiro, e ele nasce aqui.",
  casa: "Marque o pulso com o pé e faça a leitura rítmica dos dois primeiros compassos do hino indicado, falando TÁ.",
},

"1-9": {
  titulo: "Leitura rítmica: proporção entre as figuras",
  abre: "A aula anterior firmou o pulso. Esta trata do que se encaixa nele: a proporção entre as figuras. Uma mínima tem que durar exatamente o dobro de uma semínima — não \"mais ou menos o dobro\".",
  blocos: [
    { h: "A haste para baixo marca o pulso", t: "Nas lições do MSA, as figuras com a haste para baixo valem uma batida. Usá-las como referência ajuda a não perder a conta quando o desenho rítmico se complica." },
    { h: "Falar o número nas pausas", t: "Um recurso do próprio método: na primeira passagem, diga o número em voz alta onde houver pausa; na segunda, faça silêncio ali. A pausa deixa de encolher quando você a conta." },
  ],
  atencao: "Parar o pé quando o ritmo fica difícil. O gesto não pode parar: se ele parar, a referência some e o erro deixa de ser mensurável.",
  casa: "Refaça as lições da aula com o metrônomo em 60, e só aumente quando sair sem hesitação.",
},

"1-10": {
  titulo: "O endecagrama e o Dó Central",
  abre: "As claves separam os instrumentos em regiões, mas todas as regiões pertencem a uma escala só. Juntando a pauta da clave de Sol, a da clave de Fá e a linha que fica entre as duas, obtêm-se onze linhas: o endecagrama.",
  blocos: [
    { h: "Onze linhas, um sistema só", t: "Do som mais grave ao mais agudo, sem cortes. A linha do meio — a 6ª das onze, contando de baixo: cinco da clave de Fá abaixo dela e cinco da clave de Sol acima — é a do Dó3, chamado Dó Central justamente por ocupar esse lugar no meio de tudo.", fig: "endecagrama" },
    { h: "Onde o seu instrumento vive", t: "Cada instrumento ocupa uma faixa do endecagrama. Saber qual é a sua explica por que certas notas do hino são confortáveis e outras exigem posição alta ou corda grave.", fig: "cordas-violino" },
  ],
  atencao: "Achar que a mesma nota muda de altura porque muda de clave. O Dó3, o Dó central, é um só: na clave de Sol fica na linha suplementar abaixo da pauta, na clave de Fá, na linha suplementar acima — e o endecagrama mostra que as duas são a mesma linha.",
  casa: "Localize no endecagrama a nota mais grave e a mais aguda que o seu instrumento toca dentro do hino indicado.",
},

"1-11": {
  titulo: "Leitura rítmica, leitura métrica e solfejo",
  abre: "São três exercícios diferentes, e o curso inteiro se apoia neles. Fazer os três com o mesmo nome — \"ler o hino\" — é perder a graduação que eles têm.",
  blocos: [
    { h: "Leitura rítmica", t: "Fala-se TÁ, executando só a duração das figuras. Não há altura nem nome de nota." },
    { h: "Leitura métrica", t: "Fala-se o nome de cada nota, sem cantar, dentro do mesmo ritmo. Entra a altura no papel, mas não na voz." },
    { h: "Solfejo", t: "Canta-se o nome de cada nota na altura escrita, dentro do ritmo. É a soma dos dois anteriores." },
  ],
  atencao: "Pular direto para o solfejo. Quando a afinação entra antes do ritmo estar firme, o ritmo se desfaz — e o aluno acha que o problema é a voz.",
  casa: "Pegue quatro compassos do hino indicado e faça os três exercícios, nesta ordem, sem passar adiante enquanto o anterior não sair limpo.",
},

"1-12": {
  titulo: "O movimento de condução",
  abre: "O gesto da mão não é enfeite: é o relógio que você carrega. Ele mostra onde cada tempo cai e mantém o pulso quando a leitura aperta.",
  blocos: [
    { h: "A janela de movimento", t: "Imagine à sua frente uma janela: é dentro dela que a mão se move. Os gestos ficam contidos, sem estourar para os lados nem para a frente, nem grandes nem pequenos demais. A mesa invisível é outra orientação do método, sobre o plano em que a mão marca os pontos; o instrutor a apresenta com o MSA." },
    { h: "Como se move a mão", t: "De maneira natural, leve, sem esforço e sem exagero. O pulso acompanha; a mão e o braço não enrijecem. Canhotos fazem o movimento espelhado, com a mão esquerda — não há problema nenhum nisso." },
    { h: "Cada tempo, um movimento", t: "No movimento de condução, cada tempo do compasso corresponde a um movimento. Essa correspondência é o que torna o gesto útil: olhando a mão, sabe-se em que tempo se está." },
  ],
  atencao: "Gesto grande demais. Quanto maior o desenho, mais difícil chegar no tempo — e o movimento começa a atrasar sozinho.",
  casa: "Faça o movimento diante de um espelho por um minuto, sem música, só observando se a mão fica dentro da janela.",
},

"1-13": {
  titulo: "O movimento de solfejo em 4",
  abre: "Quatro tempos, quatro movimentos. O desenho é sempre o mesmo, e o primeiro movimento é sempre para baixo — em qualquer compasso, o tempo forte desce.",
  blocos: [
    { h: "O desenho", t: "1 abaixo · 2 dentro (para o lado do corpo) · 3 fora · 4 acima. Do 4 o gesto volta ao 1, e o ciclo recomeça.", fig: "mov4" },
    { h: "Por que começa embaixo", t: "Porque o tempo forte é o peso do compasso, e o gesto para baixo é o gesto de peso. Quem inicia o primeiro movimento para cima inverte a sensação do compasso inteiro." },
  ],
  atencao: "Fazer os quatro pontos e esquecer que o pulso entre eles tem que ser igual. O gesto correto com velocidade irregular não serve para nada.",
  casa: "Solfeje o primeiro sistema do hino indicado marcando os quatro movimentos com a mão, sem parar o gesto nas passagens difíceis.",
},

"1-14": {
  titulo: "O metrônomo",
  abre: "O metrônomo faz cliques sonoros repetidos, a uma velocidade constante e ajustável. Ele não ensina música: ele mostra, sem discussão, onde você está saindo do pulso.",
  blocos: [
    { h: "Para que serve", t: "Para manter a pulsação musical enquanto se solfeja ou quando se toca o instrumento. É a referência externa que substitui, no estudo em casa, o conjunto que você não tem ali." },
    { h: "Que tipos existem", t: "Mecânicos, digitais e de aplicativo de telefone. Os três servem; o de aplicativo é o que está sempre à mão." },
    { h: "Como usar sem se enganar", t: "Comece ouvindo, sem tocar. Depois acompanhe batendo palmas ou um lápis. Só então toque. Quem já começa tocando costuma ouvir o clique e ignorá-lo." },
  ],
  atencao: "Subir a velocidade antes da hora. O andamento em que se erra é o andamento em que se está estudando o erro.",
  casa: "Ponha o metrônomo em 60 e toque a escala do tom do hino indicado, uma nota por clique. Depois repita em 80.",
},

"1-15": {
  titulo: "Fechamento do 1º período",
  abre: "Quinze aulas depois, o candidato deve ler nota e duração no papel, contar um compasso e manter um pulso. Esta aula é de apresentação individual: cada um mostra o que consolidou.",
  blocos: [
    { h: "O que se cobra", t: "Nome das notas na clave do seu instrumento; nome e valor das figuras e pausas; leitura rítmica com pulso constante; movimento de solfejo em 4 sem interromper o gesto." },
    { h: "O que ainda não se cobra", t: "Afinação impecável, andamento rápido, hino inteiro decorado. Nada disso é objetivo deste período — cobrá-lo agora só serve para desanimar." },
  ],
  atencao: "Chegar nesta aula sem ter estudado em casa. Aqui não há como disfarçar: o pulso irregular aparece nos primeiros quatro compassos.",
  casa: "Releia as anotações das quinze aulas e marque os dois pontos em que você ainda hesita. Leve-os para o instrutor.",
},

/* ==================== 2º PERÍODO ==================== */

"2-1": {
  titulo: "Ligadura, ponto de aumento e intervalo",
  abre: "Três sinais que mexem com duração e distância. Os dois primeiros esticam o som; o terceiro dá nome ao espaço entre duas notas.",
  blocos: [
    { h: "As duas ligaduras do hinário", t: "De valor: liga notas de mesma altura e soma as durações — toca-se uma vez só, sustentando. De portamento: liga notas de alturas diferentes, fazendo o som passar de uma para a outra sem interrupção — tocam-se as duas, ligadas. No hinário existem estas duas, e só estas duas.", fig: "ligaduras" },
    { h: "O ponto de aumento", t: "Colocado à direita da cabeça da figura, aumenta metade da duração dela. Vale para notas e para pausas. Havendo dois pontos, o segundo aumenta metade do valor do primeiro.", fig: "ponto" },
    { h: "Intervalo", t: "É a distância entre dois sons. Melódico quando as notas são ouvidas sucessivamente — é o caso dentro de uma voz. Harmônico quando são ouvidas simultaneamente — é o caso entre soprano e baixo. Simples quando vai de duas a oito notas; composto acima de oito." },
  ],
  atencao: "Reatacar a segunda nota de uma ligadura de valor. Se as duas cabeças estão na mesma altura e ligadas, o som é um só, com as durações somadas.",
  casa: "Localize no hino indicado uma ligadura de valor e uma de portamento, e toque as duas observando o que muda na articulação.",
},

"2-2": {
  titulo: "Fórmula de compasso em 3 e movimento de solfejo em 3",
  abre: "Três tempos por compasso. O desenho da mão muda, e com ele muda o balanço da música — o compasso ternário tem outro andar.",
  blocos: [
    { h: "O que a fórmula diz", t: "O número de cima é 3: três tempos. O de baixo diz a figura que vale um tempo. Em 3/4, semínima; em 3/2, mínima. O pulso não fica mais rápido nem mais lento por causa disso: muda a figura que o representa." },
    { h: "O desenho em 3", t: "1 abaixo · 2 fora · 3 acima, e volta ao 1. Três pontos, três movimentos, e o primeiro sempre para baixo.", fig: "mov3" },
  ],
  atencao: "Tratar o 3º tempo como se fosse forte, por ser o último. No ternário, o peso está no 1º; o 3 é o impulso que devolve o gesto para baixo.",
  casa: "Marque os três movimentos enquanto lê o primeiro sistema de um hino em 3, e diga qual é a unidade de compasso.",
},

"2-3": { titulo: "Leitura métrica em 3 (I)",
  abre: "Três aulas seguidas com o mesmo objetivo: transformar o desenho em 3 em hábito. O conteúdo não é novo — a repetição é que é o ponto.",
  blocos: [
    { h: "Como aproveitar a repetição", t: "Não repita o que já sai. Cada passagem deve atacar um ponto: numa, só o pulso; noutra, só a clareza dos nomes; noutra, só a coincidência do gesto com o tempo forte." },
  ],
  atencao: "Repetir o trecho inteiro do começo toda vez que erra. Isole os dois compassos do erro e trabalhe só eles.",
  casa: "Leitura métrica dos hinos indicados pelo GEM para estas aulas, com o gesto em 3.",
},

"2-4": { titulo: "Leitura métrica em 3 (II)",
  abre: "Segunda das três aulas de fixação. Aqui já se espera que o gesto ande sozinho e a atenção possa ir para o nome das notas.",
  blocos: [
    { h: "Nome de nota sem hesitar", t: "Leitura métrica é dizer o nome no tempo certo. Hesitar meio tempo para lembrar o nome estraga o exercício tanto quanto errar o nome." },
  ],
  atencao: "Baixar a velocidade para conseguir dizer os nomes e não perceber que o pulso ficou irregular. Use o metrônomo.",
  casa: "Continue os hinos da lista, agora sem olhar o gesto — a mão deve funcionar sem ser vigiada.",
},

"2-5": { titulo: "Leitura métrica em 3 (III)",
  abre: "Terceira aula de fixação: é hora de ler um hino do começo ao fim sem parar.",
  blocos: [
    { h: "Do começo ao fim, sem interromper", t: "O critério muda: erros pontuais já não interrompem. Anota-se onde errou, segue-se até o fim, e só depois se volta. Parar a cada erro é o que impede alguém de tocar num culto." },
  ],
  atencao: "Parar para corrigir. Num culto, ninguém para — retoma-se no próximo tempo forte.",
  casa: "Leitura métrica de um hino inteiro da lista, sem parar, marcando a lápis os compassos que falharam.",
},

"2-6": {
  titulo: "Fórmula de compasso em 2 e movimento de solfejo em 2",
  abre: "Dois tempos por compasso: o gesto mais simples do curso, e o mais traiçoeiro, porque a mão tem pouco a fazer e tende a antecipar.",
  blocos: [
    { h: "O que a fórmula diz", t: "Número de cima 2: dois tempos. O de baixo dá a figura do tempo — em 2/4, semínima; em 2/2, mínima." },
    { h: "O desenho em 2", t: "1 abaixo · 2 acima, e volta. Só isso.", fig: "mov2" },
  ],
  atencao: "Encurtar o segundo tempo. Com apenas dois movimentos, a mão sobe cedo demais e o compasso fica torto.",
  casa: "Com o metrônomo entre 60 e 72, faça leitura rítmica, leitura métrica e solfejo do hino indicado; depois procure outro hino em 2 e repita.",
},

"2-7": { titulo: "Leitura em 2 (I)",
  abre: "Primeira das três aulas de fixação do compasso binário.",
  blocos: [{ h: "Onde mora a dificuldade", t: "No binário, o tempo forte volta rápido. É preciso preparar a entrada com antecedência — não há tempo de \"pensar no caminho\"." }],
  atencao: "Adiantar o 1º tempo do compasso seguinte. O gesto de subida tem que durar um tempo inteiro.",
  casa: "Leitura rítmica dos hinos da lista do GEM para estas aulas.",
},

"2-8": { titulo: "Leitura em 2 (II)",
  abre: "Segunda aula de fixação. Entra a leitura métrica sobre o gesto já firme.",
  blocos: [{ h: "Duas coisas ao mesmo tempo", t: "Gesto e nome de nota juntos é o que se treina aqui. Se um dos dois se desfaz, volte ao exercício separado por uma passagem e junte de novo." }],
  atencao: "O gesto parar quando a boca começa a falar. Os dois são independentes — e têm que ser.",
  casa: "Leitura métrica dos hinos da lista, com gesto em 2.",
},

"2-9": { titulo: "Leitura em 2 (III)",
  abre: "Terceira aula: hino inteiro, sem parar, no gesto em 2.",
  blocos: [{ h: "Critério de fechamento", t: "Chegar ao fim mantendo o pulso. A avaliação é essa; a limpeza vem depois." }],
  atencao: "Acelerar ao chegar perto do fim. É quase universal, e o metrônomo denuncia na hora.",
  casa: "Um hino da lista, do começo ao fim, com metrônomo, duas vezes por dia.",
},

"2-10": {
  titulo: "Tercinas",
  abre: "Às vezes o compositor quer três notas onde caberiam duas. A tercina é isso — e o tempo não aumenta por causa dela.",
  blocos: [
    { h: "O que é", t: "Um grupo de três figuras colocado no lugar em que normalmente caberiam duas do mesmo valor. Indica-se pelo número 3 escrito acima ou abaixo do grupo.", fig: "tercina" },
    { h: "Como sentir", t: "Diga \"co-la-ção\" ou \"Ma-ri-a\" dentro de um tempo, mantendo o pé no pulso. As três sílabas têm que ficar iguais entre si e caber exatamente no tempo." },
  ],
  atencao: "Roubar tempo do compasso seguinte para caber a tercina. O erro aparece na entrada do próximo tempo, não dentro da tercina.",
  casa: "Localize uma tercina no hino indicado e toque o compasso inteiro no andamento, conferindo se o tempo seguinte entrou no lugar.",
},

"2-11": { titulo: "Tercinas e solfejo de hinos",
  abre: "Aula de fixação: a tercina agora dentro de um hino, e não isolada num exercício.",
  blocos: [{ h: "Por que muda dentro do hino", t: "Porque ela chega no meio de outro desenho rítmico. Isolada, todo mundo acerta; no contexto, o pulso escorrega." }],
  atencao: "Transformar a tercina em ritmo pontuado (longo-curto). São coisas diferentes, e a diferença se ouve.",
  casa: "Solfejo dos hinos da lista do GEM, com atenção às tercinas e às colcheias pontuadas.",
},

"2-12": {
  titulo: "A fermata",
  abre: "A fermata não é só esticar a nota. São quatro coisas, nesta ordem, e quem faz só a primeira faz metade.",
  blocos: [
    { h: "Os quatro tempos da fermata", t: "Prolonga-se o valor da nota; faz-se uma parada breve, em silêncio; respira-se; retoma-se. O sinal é um arco com um ponto, escrito acima — ou abaixo — da nota ou da pausa.", fig: "fermata" },
    { h: "Quanto tempo dura", t: "Tempo indefinido: decide-se pelo bom gosto e pelo bom senso musical, acompanhando a condução. Não é o dobro nem a metade de nada." },
    { h: "Como soa", t: "A nota não mantém a mesma intensidade do começo ao fim: vai diminuindo gradativamente, até o silêncio. E a retomada vem na mesma velocidade que havia antes da fermata." },
  ],
  atencao: "Emendar um rallentando depois da fermata, por hábito. Sem indicação escrita, retoma-se na mesma velocidade — o resto é modificação indevida de andamento.",
  casa: "Toque o hino indicado até a primeira fermata, faça-a inteira, e retome. Confira as quatro etapas, uma por uma.",
},

"2-13": {
  titulo: "Fórmula de compasso em 6 e movimento de solfejo em 6",
  abre: "Aqui muda a lógica. Em 6/8, o número de cima não conta tempos no sentido de antes: conta pulsos. São seis pulsos, agrupados de três em três, formando dois tempos.",
  blocos: [
    { h: "O que a fórmula diz", t: "Número de cima 6: seis pulsos ou movimentos no compasso. O de baixo diz a figura que representa cada pulso — em 6/8, a colcheia." },
    { h: "O gesto", t: "O desenho é o do compasso em 2, com três pulsos em cada tempo: pulsos 1, 2 e 3 no movimento de baixo; 4, 5 e 6 no de cima. O deslocamento maior da mão acontece entre o 3 e o 4, que é onde o gesto sobe.", fig: "mov6" },
    { h: "Também em 6/4", t: "O hinário tem hinos em 6/4, e a lógica é a mesma: seis pulsos em dois tempos, o mesmo gesto. Muda só a figura: cada pulso é uma semínima, e a unidade de tempo é a mínima pontuada." },
  ],
  atencao: "Fazer os seis pontos com a mesma amplitude. O movimento do 3º para o 4º ponto é o mais amplo: é ele que separa os dois tempos — sem isso, o 6 vira uma fila de pulsos iguais.",
  casa: "Leitura métrica e solfejo dos hinos da lista, na velocidade mínima indicada.",
},

"2-14": { titulo: "Movimento alternativo para solfejo em 6",
  abre: "Quando o gesto em seis fica rápido demais, conduz-se em 2, agrupando três pulsos em cada tempo. É esse o movimento alternativo.",
  blocos: [
    { h: "Quando usar", t: "Quando o movimento da mão está muito rápido e fica difícil alocar as figuras nos tempos, ou quando há notas longas correspondentes a vários pulsos. É recurso de estudo, não regra." },
  ],
  atencao: "Usar o alternativo sempre, por comodidade. Ele existe para destravar uma passagem, não para substituir o gesto normal.",
  casa: "Escolha um hino em 6 e leia o mesmo trecho das duas formas, dizendo qual ajudou mais e por quê.",
},

"2-15": { titulo: "Fechamento do 2º período",
  abre: "Apresentação individual dos exercícios dos tópicos 4.1 a 5.5. Ao fim deste período, o candidato conduz em 2, 3 e 4, entende ligadura, ponto, tercina e fermata.",
  blocos: [{ h: "O que se cobra", t: "Um hino inteiro, em leitura métrica ou solfejo, com gesto correto, pulso constante e as fermatas feitas por inteiro." }],
  atencao: "Deixar a fermata para improvisar na hora. Ela se prepara: onde começa a diminuir, onde para, onde respira.",
  casa: "Prepare o hino que vai apresentar e toque-o três vezes seguidas sem parar, em dias diferentes.",
},

/* ==================== 3º PERÍODO ==================== */

"3-1": {
  titulo: "Tom, semitom e acidentes",
  abre: "Até aqui as notas eram sete nomes. Agora entra a distância entre elas — e os sinais que a alteram.",
  blocos: [
    { h: "Semitom e tom", t: "Semitom é o menor intervalo entre dois sons na música ocidental. Tom é o intervalo formado por dois semitons. Entre as notas naturais, o semitom aparece em dois lugares: Mi–Fá e Si–Dó. Nos demais pares vizinhos há um tom." },
    { h: "Os acidentes", t: "Também chamados sinais de alteração. Escrevem-se à esquerda da nota e modificam a altura dela. O sustenido (♯) eleva a nota em um semitom; o bemol (♭) abaixa em um semitom. Diz-se primeiro o nome da nota e depois o do acidente: Fá sustenido, Si bemol." },
    { h: "Cromático e diatônico", t: "O semitom diatônico ocorre entre notas de nomes diferentes; o cromático, entre notas de mesmo nome — Dó e Dó sustenido. Os semitons naturais, formados por notas sem acidente, são Mi–Fá e Si–Dó." },
    { h: "Uníssono", t: "Dois sons simultâneos na mesma altura. Uníssono enarmônico é quando os dois soam na mesma altura mas se escrevem com nomes diferentes — como Fá♯ e Sol♭." },
  ],
  atencao: "Dizer \"sustenido Fá\" em vez de \"Fá sustenido\". Parece detalhe, mas a ordem é a da leitura e evita confusão na hora de escrever.",
  casa: "No hino indicado, aponte dois semitons e dois tons, e diga se cada semitom é cromático ou diatônico.",
},

"3-2": {
  titulo: "Escalas e escalas diatônicas",
  abre: "Escala é uma sequência de notas consecutivas, ascendentes ou descendentes. Cada grau tem nome, e o primeiro deles — a tônica — é o que dá nome à escala.",
  blocos: [
    { h: "Os graus", t: "Tônica, supertônica, mediante, subdominante, dominante, superdominante e sensível. Na prática do hinário, os que mais pesam são a tônica e a dominante." },
    { h: "Maiores e menores", t: "As escalas diatônicas dividem-se em maiores e menores. Os hinos do Hinário 5 estão todos escritos em tonalidades maiores — o que simplifica muito a leitura da armadura." },
  ],
  atencao: "Chamar de escala qualquer sequência de notas. Escala é consecutiva: sem pular graus.",
  casa: "Escreva a escala do tom do hino indicado, subindo e descendo, e marque onde caem os semitons.",
},

"3-3": {
  titulo: "Escalas maiores com sustenidos",
  abre: "Todas as escalas maiores têm o mesmo padrão de tons e semitons. Sabendo o padrão, dá para construir qualquer uma — e é assim que os sustenidos aparecem, um por vez.",
  blocos: [
    { h: "O padrão", t: "Na forma ascendente: tom, tom, semitom, tom, tom, tom, semitom. Esse desenho não muda nunca; o que muda é a nota de onde se parte." },
    { h: "Como nasce a primeira escala com sustenido", t: "Parte-se da escala modelo de Dó Maior, identifica-se a 5ª nota dela, e essa nota passa a ser a tônica da escala seguinte. Repetindo o procedimento, aparecem Sol, Ré, Lá, Mi, Si, Fá♯ e Dó♯ — e, a cada passo, um sustenido novo." },
  ],
  atencao: "Montar a escala pelo nome das notas em vez de pelo padrão. O padrão é que decide onde entra o acidente.",
  casa: "Construa as escalas maiores com sustenidos e anote, para cada uma, a ordem em que os sustenidos aparecem.",
},

"3-4": {
  titulo: "Escalas maiores com bemóis",
  abre: "Mesmo padrão, caminho oposto. Em vez da 5ª nota, usa-se a 4ª — e em vez de sustenidos, entram bemóis.",
  blocos: [
    { h: "Como nascem", t: "Parte-se de Dó Maior, identifica-se a 4ª nota, e ela vira a tônica da escala seguinte: Fá, Si♭, Mi♭, Lá♭, Ré♭, Sol♭, Dó♭. O bemol serve para abaixar a altura da nota que precisa ser ajustada para manter o padrão." },
    { h: "Por que isso importa no hinário", t: "Porque a maioria dos hinos — cerca de seis em cada dez — está em tons com bemóis: Mi♭, Lá♭, Si♭ e Fá concentram boa parte do hinário, e Sol maior é o segundo tom mais frequente. Estas escalas são as que você vai encontrar todo domingo." },
  ],
  atencao: "Achar que bemol \"eleva\" porque o nome da escala é mais complicada. Bemol abaixa, sempre, um semitom.",
  casa: "Construa as escalas maiores com bemóis e anote a ordem dos bemóis de cada uma.",
},

"3-5": {
  titulo: "Armadura de clave",
  abre: "Em vez de escrever o acidente em toda nota que precisa dele, escreve-se uma vez só, logo depois da clave. Esse conjunto é a armadura de clave.",
  blocos: [
    { h: "O que é e onde fica", t: "O conjunto de acidentes fixados entre a clave e a fórmula de compasso. Todas as notas de mesmo nome que os acidentes da armadura — em qualquer oitava — ficam alteradas por eles, do começo ao fim da peça." },
    { h: "A ordem é fixa", t: "Os sustenidos entram sempre nesta ordem: Fá, Dó, Sol, Ré, Lá, Mi, Si. Os bemóis, na ordem inversa: Si, Mi, Lá, Ré, Sol, Dó, Fá.", fig: "acidentes" },
    { h: "Descobrir o tom pela armadura", t: "É a mesma regra da identificação do nome das escalas. Com a armadura na frente, o tom do hino se lê antes de tocar a primeira nota — e boa parte dos erros de afinação desaparece por causa disso." },
  ],
  atencao: "Ler a armadura e esquecê-la dois compassos depois. Antes de começar, diga em voz alta quais notas estão alteradas naquele hino.",
  casa: "Anote a armadura e o tom dos cinco hinos que você mais toca. Guarde a lista no estojo.",
},

"3-6": {
  titulo: "Fórmula de compasso em 9 e movimento de solfejo em 9",
  abre: "Nove pulsos, agrupados de três em três: três tempos. A lógica é a mesma do compasso em 6, com um grupo a mais.",
  blocos: [
    { h: "O que a fórmula diz", t: "Número de cima 9: nove pulsos ou movimentos. O de baixo diz a figura que representa cada pulso — em 9/8, a colcheia." },
    { h: "O gesto", t: "O desenho é o do compasso em 3, com três pulsos em cada tempo: 1·2·3 abaixo, 4·5·6 fora, 7·8·9 acima.", fig: "mov9" },
  ],
  atencao: "Contar os nove pulsos como se fossem nove tempos. São nove pulsos dentro de três tempos: os movimentos mais amplos — do 3º para o 4º ponto, do 6º para o 7º e do 9º de volta ao 1º — é que mostram onde começa cada tempo.",
  casa: "Estude os hinos da lista do GEM para esta aula; nos marcados com asterisco, comece a leitura a partir do 1º compasso completo.",
},

"3-7": { titulo: "Movimento alternativo para solfejo em 9",
  abre: "Conduzir o gesto em 3, agrupando três pulsos em cada tempo — é esse o movimento alternativo em 9.",
  blocos: [
    { h: "Quando cabe", t: "Quando o movimento da mão fica rápido demais e dificulta alocar as figuras nos tempos, ou quando há notas longas ocupando vários pulsos. Nem todo hino em 9 se beneficia dele." },
  ],
  atencao: "Escolher o movimento por gosto. A escolha se justifica pelo desenho rítmico do hino, não pela preferência de quem toca.",
  casa: "Leitura métrica e solfejo dos hinos indicados, todos a partir do 1º compasso completo.",
},

"3-8": {
  titulo: "Fórmula de compasso em 12 e movimento de solfejo em 12",
  abre: "Doze pulsos, de três em três: quatro tempos. É o maior compasso do hinário, e o mais raro.",
  blocos: [
    { h: "O que a fórmula diz", t: "Número de cima 12: doze pulsos ou movimentos. Em 12/8, a colcheia representa cada pulso." },
    { h: "O gesto", t: "O desenho é o do compasso em 4, com três pulsos em cada tempo: 1·2·3 abaixo, 4·5·6 dentro, 7·8·9 fora, 10·11·12 acima.", fig: "mov12" },
  ],
  atencao: "Perder a conta no meio. Em 12, o alternativo em 4 deixa de ser conveniência e passa a ser quase necessário.",
  casa: "Estude o hino indicado pelo GEM para esta aula.",
},

"3-9": { titulo: "Movimento alternativo para solfejo em 12 (I)",
  abre: "Conduzir em 4, agrupando três pulsos por tempo. Três aulas para firmar.",
  blocos: [{ h: "O que muda na prática", t: "A mão faz quatro pontos; a contagem interna faz doze. Quem consegue separar as duas coisas lê 12/8 com a mesma facilidade com que lê 4/4." }],
  atencao: "Deixar o gesto acelerar porque \"são só quatro pontos\". Cada ponto agora dura três pulsos.",
  casa: "Hinos da lista, lendo por enquanto apenas a seção \"Final\" naqueles que têm casas de ritornello.",
},

"3-10": { titulo: "Movimento alternativo para solfejo em 12 (II)",
  abre: "Segunda aula de fixação, agora com leitura rítmica das lições e solfejo de hinos.",
  blocos: [{ h: "Juntar as peças", t: "Leitura rítmica firme, gesto em 4 agrupado, e só então o solfejo. A ordem é sempre esta." }],
  atencao: "Pular a leitura rítmica porque o hino \"já é conhecido\". Conhecer de ouvido é o que mais atrapalha a leitura.",
  casa: "Leitura rítmica das lições e solfejo dos hinos indicados.",
},

"3-11": { titulo: "Movimento alternativo para solfejo em 12 (III)",
  abre: "Terceira aula: exercício individual de leitura métrica e de solfejo.",
  blocos: [{ h: "Critério", t: "Chegar ao fim sem parar, com o gesto correto e a proporção entre as figuras mantida." }],
  atencao: "Corrigir o gesto no meio e perder o pulso. Se o gesto saiu errado, mantenha o pulso e ajuste no compasso seguinte.",
  casa: "Um hino da lista, inteiro, gravado no celular. Ouça a própria gravação — ela diz mais do que qualquer conselho.",
},

"3-12": {
  titulo: "Tonalidade",
  abre: "Tonalidade é a organização da música em torno da nota principal da escala — a tônica. Saber o tom do hino é saber para onde tudo puxa.",
  blocos: [
    { h: "Maior ou menor", t: "A tonalidade pode ser maior ou menor. Nos nossos hinários, os hinos estão escritos somente em tonalidades maiores." },
    { h: "Como identificar", t: "Pela armadura de clave, com a mesma regra usada para nomear as escalas. Não se identifica olhando a última nota do soprano nem comparando vozes." },
  ],
  atencao: "Deduzir o tom pela última nota. Funciona por coincidência em muitos hinos, e falha justamente naqueles em que importaria acertar.",
  casa: "Diga o tom de dez hinos do hinário olhando apenas a armadura, e confira depois.",
},

"3-13": {
  titulo: "Acidentes ocorrentes e de precaução",
  abre: "Além dos acidentes fixos da armadura, aparecem acidentes no meio da música. Eles têm alcance limitado — e o limite é o compasso.",
  blocos: [
    { h: "Acidente ocorrente", t: "Escrito à esquerda de uma nota, no meio da peça. Altera aquela nota e todas as demais de mesmo nome e mesma altura dentro daquele compasso. Passou a barra de compasso, o efeito acabou." },
    { h: "Quais existem no hinário", t: "Além do bemol e do sustenido: dobrado sustenido, dobrado bemol e bequadro. O bequadro desfaz qualquer alteração anterior e devolve a nota ao estado natural." },
    { h: "Acidente de precaução", t: "Lembra o estado da nota quando pode haver dúvida — o caso mais comum é no compasso seguinte a um acidente ocorrente, avisando que a nota voltou ao que manda a armadura. Não muda nada: serve para evitar erro de leitura." },
    { h: "Ligadura de valor atravessando a barra", t: "Quando uma nota com acidente ocorrente está ligada por ligadura de valor a outra no compasso seguinte, o efeito do acidente se prolonga junto com a soma dos valores." },
  ],
  atencao: "Aplicar o acidente ocorrente à mesma nota em outra oitava. Vale para mesmo nome e mesma altura — a oitava de cima segue como estava.",
  casa: "Localize um acidente ocorrente no hino indicado e diga em voz alta até onde ele vale, antes de tocar.",
},

"3-14": {
  titulo: "Repetição: ritornello e casas",
  abre: "Para não escrever duas vezes o mesmo trecho, a partitura usa barras de repetição. Ler isso errado leva a orquestra inteira para o lugar errado.",
  blocos: [
    { h: "As barras", t: "Barra de início de repetição e barra de final de repetição delimitam o trecho. Sem nenhum outro sinal, o trecho é tocado duas vezes, e depois segue-se adiante." },
    { h: "As casas", t: "A casa 1 se toca na primeira passagem; na repetição, pula-se a casa 1 e vai-se para a casa 2. Havendo três casas, a sequência segue a numeração. Cada casa corresponde a uma passagem, na ordem da numeração." },
  ],
  atencao: "Repetir a casa 1 na volta. A casa 1 existe justamente para ser pulada na repetição.",
  casa: "Percorra o hino indicado em voz alta dizendo só os números dos compassos, na ordem em que serão tocados.",
},

"3-15": { titulo: "Fechamento do 3º período",
  abre: "Apresentação individual dos exercícios dos tópicos 6.1 a 9.1, preferencialmente em grupo, com diversidade de vozes.",
  blocos: [{ h: "O que se cobra", t: "Tom e armadura identificados antes de tocar; compassos em 9 e 12 conduzidos com o gesto agrupado; acidentes ocorrentes respeitados; repetições percorridas na ordem certa." }],
  atencao: "Apresentar sozinho o que se ensaiou sozinho. Toque com alguém de outra voz antes da aula — a dificuldade é outra.",
  casa: "Combine com um colega de voz diferente e ensaiem juntos o hino da apresentação.",
},

/* ==================== 4º PERÍODO ==================== */

"4-1": {
  titulo: "Dinâmica",
  abre: "Dinâmica é a variação da intensidade do som, de maneira gradual — tanto para mais forte quanto para mais fraca. É o que separa tocar as notas certas de tocar música.",
  blocos: [
    { h: "Os dois estilos", t: "Dinâmica natural e dinâmica artificial. A artificial é a que vem escrita em sinais e abreviaturas; a natural é a que nasce do próprio texto e do discurso musical." },
    { h: "Como se aplica no hinário", t: "Nos nossos hinários não há indicação de dinâmica artificial. Segue-se a dinâmica natural, de acordo com a poesia do hino e o discurso musical. Os sinais se estudam para saber lê-los em outros materiais — no hinário, quem dita a dinâmica é o texto." },
  ],
  atencao: "Tocar tudo no mesmo volume porque \"não está escrito nada\". Não estar escrito não significa que seja plano: significa que a poesia decide.",
  casa: "Leia a letra de um hino que você toca e marque onde ela pede mais e onde pede menos. Depois toque seguindo essas marcas.",
},

"4-2": {
  titulo: "Acento métrico, compasso simples e composto",
  abre: "Todo compasso tem um balanço próprio, e ele vem da alternância de tempos fortes e fracos. Esse é o acento métrico — e ele não precisa estar escrito.",
  blocos: [
    { h: "O acento métrico", t: "É a acentuação forte ou fraca dos tempos do compasso, executada de modo natural, conforme a fórmula. No quaternário simples a sequência é: forte, fraco, meio forte, fraco.", fig: "acentuacao" },
    { h: "Compasso simples", t: "Aquele em que a unidade de tempo se divide em duas partes iguais — subdivisão binária. Os números superiores são 2, 3 e 4." },
    { h: "Compasso composto", t: "Aquele em que cada tempo se divide em três pulsos iguais — subdivisão ternária. Os números superiores são 6, 9 e 12." },
  ],
  atencao: "Marcar o acento métrico com sotaque, batendo no tempo forte. Ele organiza o compasso por dentro; exagerá-lo deforma a interpretação.",
  casa: "Classifique dez fórmulas de compasso em binário, ternário ou quaternário e em simples ou composto.",
},

"4-3": {
  titulo: "Compassos alternados",
  abre: "Alguns hinos trocam de fórmula de compasso a cada compasso. Não é erro de impressão: é compasso alternado.",
  blocos: [
    { h: "O que são", t: "A junção de duas ou mais fórmulas de compasso diferentes, aplicadas alternadamente a cada compasso." },
    { h: "Como aparecem no hinário", t: "Numa partitura em geral, as fórmulas vêm no início do pentagrama e também ao longo dele, conforme os compassos alternados surgem. No nosso hinário elas aparecem só junto da armadura de clave — e é sempre a junção de duas fórmulas." },
    { h: "Estrofe e coro com fórmulas diferentes", t: "Há hinos em que a estrofe está numa fórmula e o coro em outra. A velocidade permanece igual nos dois; a única exceção é o hino 422, que traz indicações de velocidades distintas." },
  ],
  atencao: "Mudar a velocidade ao entrar no coro porque a fórmula mudou. A fórmula muda; o pulso, não.",
  casa: "Estude os hinos de compassos alternados e os de fórmula diferente entre estrofe e coro, indicados pelo GEM.",
},

"4-4": {
  titulo: "Síncopa e contratempo",
  abre: "Dois modos de deslocar o som para fora do tempo forte. Parecem iguais de ouvido para quem está começando, e são opostos.",
  blocos: [
    { h: "Síncopa", t: "Articula-se um som no tempo fraco, ou na parte fraca de um tempo, e esse som se prolonga — por ligadura ou não — para o tempo forte, ou parte forte, seguinte. O forte é atravessado, não reatacado.", fig: "sincopa" },
    { h: "Contratempo", t: "As notas são executadas no tempo fraco, ou parte fraca, ficando os tempos fortes preenchidos por pausas. O forte fica em silêncio, e o som entra depois dele." },
    { h: "Regular e irregular", t: "Síncopa regular: as notas têm a mesma duração; irregular: durações diferentes. Contratempo regular: a pausa e a nota têm a mesma duração; irregular: durações diferentes." },
    { h: "Como se toca", t: "Os hinos sincopados não devem ser tocados com acentuação forte sobre a síncopa. A síncopa já desloca o peso por si; reforçá-la com acento tira o hino do caráter." },
  ],
  atencao: "Reatacar a nota no tempo forte. Reatacando, a síncopa desaparece e viram duas notas comuns.",
  casa: "Estude os hinos das listas de síncopa e de contratempo indicadas pelo GEM.",
},

"4-5": { titulo: "Síncopa e contratempo (continuação)",
  abre: "Aula de fixação. As duas listas de hinos do GEM são longas de propósito: é volume que firma o reconhecimento.",
  blocos: [{ h: "Como estudar a lista", t: "Não toque os hinos inteiros. Localize a síncopa ou o contratempo, toque só aquele compasso e o seguinte, e passe ao próximo hino. Vinte hinos assim valem mais do que dois hinos inteiros." }],
  atencao: "O pé parar exatamente no tempo que está em silêncio. No contratempo, é justamente ali que ele precisa marcar.",
  casa: "Leitura métrica das lições propostas e dos hinos das duas listas.",
},

"4-6": {
  titulo: "Ritmos iniciais",
  abre: "Todo hino começa de um jeito, e são só três. Saber qual é decide onde você entra — e é ali que a orquestra mais se desencontra.",
  blocos: [
    { h: "Os três", t: "Tético: a 1ª nota cai no tempo forte do 1º compasso. Anacrúsico: as notas iniciais precedem o 1º compasso. Acéfalo: o ritmo é iniciado por um contratempo — o 1º tempo do 1º compasso é ocupado por pausa, escrita ou não.", fig: "ritmos-iniciais" },
    { h: "Os acéfalos do hinário", t: "São apenas dois hinos no hinário inteiro, e neles a pausa inicial não vem escrita: é subentendida. Por isso o acéfalo engana — não há nada no papel avisando." },
    { h: "Não é só no começo", t: "Fora do início, o hino continua tendo ritmos iniciais: toda frase e toda semifrase tem o seu. O que se chama de \"ritmo inicial do hino\" é apenas o da primeira delas." },
  ],
  atencao: "No anacrúsico, entrar no primeiro tempo forte. A entrada é antes dele, e o último compasso do hino completa o valor que faltou.",
  casa: "Selecione, com o instrutor, alguns hinos anacrúsicos e acéfalos e exercite a entrada de cada um.",
},

"4-7": { titulo: "Ritmos iniciais (continuação)",
  abre: "Fixação: as entradas, uma atrás da outra, em hinos diferentes.",
  blocos: [{ h: "Exercício que funciona", t: "Toque só os dois primeiros compassos de dez hinos seguidos, dizendo antes de cada um qual é o ritmo inicial. Depois, faça o mesmo sem dizer — só entrando." }],
  atencao: "Preparar o arco ou o sopro na hora da entrada. No anacrúsico, é preciso estar pronto um tempo antes.",
  casa: "Leitura métrica das lições propostas, com atenção à entrada.",
},

"4-8": {
  titulo: "Notas pontuadas e a subdivisão",
  abre: "O ponto de aumento já é velho conhecido. O que muda aqui é perceber que a mesma figura pontuada se comporta de modo diferente no compasso simples e no composto.",
  blocos: [
    { h: "Divisão, subdivisão e bi-subdivisão", t: "Quando a semínima é a unidade de tempo (2/4, 3/4, 4/4), duas colcheias são a subdivisão de um tempo, e quatro semicolcheias, a bi-subdivisão. Nomear a camada ajuda a contar sem se perder." },
    { h: "A mesma figura, dois comportamentos", t: "No compasso simples, a colcheia pontuada vale três quartos de tempo e a semicolcheia seguinte, um quarto. No composto, a unidade de tempo já é uma figura pontuada — em 6/8, a semínima pontuada —, e a colcheia pontuada vale metade do tempo: um pulso e meio. É o mesmo desenho no papel, com contas diferentes." },
  ],
  atencao: "Encompridar a figura curta. O ritmo pontuado vira tercina quando a curta ganha tempo — e a diferença se ouve na hora.",
  casa: "Subdivida em voz alta e toque o trecho pontuado do hino indicado, contando 3 + 1.",
},

"4-9": { titulo: "Notas pontuadas (continuação)",
  abre: "Fixação com o metrônomo marcando a subdivisão.",
  blocos: [{ h: "O truque do metrônomo", t: "Ponha o metrônomo marcando as colcheias — não os tempos. O ritmo pontuado se corrige sozinho. Depois volte a marcar só os tempos e veja se ele se manteve." }],
  atencao: "Só conseguir acertar com o metrônomo na subdivisão. O objetivo é manter o ritmo quando a referência sai.",
  casa: "Selecione com o instrutor hinos com notas pontuadas em compasso simples e em composto, e compare as duas execuções.",
},

"4-10": { titulo: "Notas pontuadas (continuação)",
  abre: "Terceira aula: apresentação do hino inteiro, com atenção aos ritmos pontuados.",
  blocos: [{ h: "Por que o ritmo pontuado desencontra a orquestra", t: "Porque cada músico alonga a figura curta de um jeito próprio. A solução não é tocar mais devagar: é todos subdividirem igual." }],
  atencao: "No andamento lento, deixar a figura longa vazar sobre a curta; no rápido, encurtar demais a longa. São erros opostos, no mesmo desenho.",
  casa: "Apresente o hino indicado inteiro, com o ritmo pontuado medido.",
},

"4-11": {
  titulo: "Andamento e poco rallentando",
  abre: "Andamento é a velocidade da peça. No hinário, ele vem escrito como uma faixa — dois números — e essa faixa não é sugestão vaga.",
  blocos: [
    { h: "A marcação metronômica", t: "Os dois números são a velocidade mínima e a máxima. O hino deve ser entoado dentro desses limites, e convém ficar na média. Abaixo da mínima, em regra não — a exceção é a meia hora, que pode ficar abaixo, mas próxima da mínima." },
    { h: "O que mais influi na escolha", t: "O tipo de serviço e o momento do culto; o andamento da introdução, que é a base para a orquestra; e o que o conjunto está efetivamente tocando. Qualquer que seja a velocidade escolhida, a proporção entre as figuras não muda." },
    { h: "Poco rallentando", t: "É a redução gradativa do andamento — só do andamento: a intensidade do som não entra nisso. É a única expressão de modificação de andamento usada nos nossos hinos. E começa exatamente na nota sobre a qual está escrita, não no começo do compasso nem do sistema." },
  ],
  atencao: "Começar o poco rall. no início do compasso em que ele aparece. Ele começa na nota — e nos hinos essa nota costuma coincidir com uma sílaba precisa da poesia.",
  casa: "Marque a lápis, nos hinos indicados, a nota exata em que começa o poco rall., e toque desse ponto até o fim.",
},

"4-12": {
  titulo: "Modificação indevida de andamento",
  abre: "Modificar o andamento onde a partitura não pede é o defeito mais silencioso da orquestra: ninguém percebe na hora, e o hino termina num andamento diferente daquele em que começou.",
  blocos: [
    { h: "Onde costuma acontecer", t: "Acelerando nos trechos fáceis e nas notas curtas; arrastando nos trechos difíceis e nas notas longas; e, muito comumente, emendando um rallentando depois de cada fermata ou fim de estrofe, por hábito." },
    { h: "Como evitar", t: "Executando com atenção, sem alterar o andamento onde não há indicação; e observando o modo como a irmandade está cantando, para adequar a execução ao canto." },
    { h: "Depois da fermata", t: "Não havendo qualquer indicação de modificação de andamento, retoma-se na mesma velocidade utilizada antes da fermata, com precisão e proporção correta entre as figuras." },
  ],
  atencao: "\"Foi só um pouquinho.\" Num conjunto, o pouquinho de cada um se soma — e quem acelera puxa o naipe e o canto atrás.",
  casa: "Toque o hino indicado com metrônomo do começo ao fim e confira se terminou no mesmo andamento em que começou.",
},

"4-13": {
  titulo: "Frases, semifrases e interpretação musical",
  abre: "A música tem pontuação, como o texto. Reconhecê-la é o que permite respirar no lugar certo — e o que separa tocar notas de dizer alguma coisa.",
  blocos: [
    { h: "Frase e semifrase", t: "Frase é o conjunto de notas que forma uma unidade com sentido de conclusão. Semifrase é cada parte da unidade que compõe a frase. Nos nossos hinos, a frase tem normalmente 4 compassos e se divide em 2 semifrases." },
    { h: "O teste da semifrase", t: "Toque um trecho e pergunte-se se ficou faltando alguma coisa. Se a sensação for de que falta mais um trecho para concluir, o que você tocou foi uma semifrase." },
    { h: "As vírgulas de respiração", t: "Não são o que define as semifrases. A semifrase se reconhece pelo sentido musical; a vírgula menor de respiração é outra coisa e nem sempre cai no mesmo lugar." },
    { h: "Interpretação musical", t: "É a arte de compreender as intenções e os sentimentos do compositor e transmiti-los por meio do som do instrumento. Nos hinos, a referência é a poesia: hinos com a mesma fórmula de compasso não se interpretam do mesmo jeito, porque a letra é outra." },
  ],
  atencao: "Respirar onde o fôlego acaba. A respiração é escolhida antes, pela frase e pelo texto — não pela necessidade do momento.",
  casa: "Marque no hino indicado onde você respiraria, e justifique cada respiração pela frase e pela letra.",
},

"4-14": {
  titulo: "Indicações interpretativas",
  abre: "Alguns hinos trazem, escrita, uma palavra que alerta o músico para uma forma de interpretação mais específica. São seis, e só seis.",
  blocos: [
    { h: "Quais são", t: "Solene, Majestoso, Com júbilo, Com veneração, Com submissão e Com humildade. A maioria dos hinos não traz nenhuma delas." },
    { h: "O que elas mudam e o que não mudam", t: "Não mudam as notas nem a velocidade. Mudam o caráter: ataque, intensidade e condução da frase. Em Majestoso ou Solene, mais peso e arco mais largo; em Com veneração, Com submissão ou Com humildade, som contido e trocas disfarçadas; em Com júbilo, ataque mais claro e condução adiante — sem correr." },
    { h: "E quando não há indicação", t: "Cada hino tem expressão própria, que o músico identifica pela poesia. A indicação escrita, quando existe, só reforça o que a poesia já pede." },
  ],
  atencao: "Tratar a indicação como pedido de volume. \"Majestoso\" não é \"mais forte\": é som amplo, com ataque nítido e frase conduzida.",
  casa: "Tome dois hinos no mesmo tom e na mesma fórmula de compasso, com indicações diferentes, e descreva o que muda na execução.",
},

"4-15": {
  titulo: "Fechamento do curso",
  abre: "Sessenta aulas. O candidato que chega aqui lê, conta, conduz, reconhece os sinais do hinário e sabe por que toca de um jeito e não de outro. O que falta agora é tempo de ensaio.",
  blocos: [
    { h: "O que se cobra", t: "Um hino apresentado por inteiro, seguindo todas as indicações escritas, com o candidato sabendo explicar cada escolha que fez." },
    { h: "O que vem depois", t: "O Programa Mínimo do instrumento, em três etapas: Reunião de Jovens e Menores, cultos oficiais e, por fim, a oficialização. O MSA não acaba aqui — ele passa a ser a referência para tudo o que vier." },
  ],
  atencao: "Achar que terminou. O MSA é o começo; o que ele dá é a capacidade de estudar sozinho, com critério.",
  casa: "Escreva, em meia página, o que você leva do MSA para o ensaio que não levava antes. Serve de registro para você e para o instrutor.",
},

};

if (typeof module !== "undefined") module.exports = { LICOES };
