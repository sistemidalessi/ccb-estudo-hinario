/* ---------------- banco ---------------- */
/* f=fase  t=tópico  k=tipo  n=nível(1-3)  q=enunciado  g=gabarito  v=específico de violino */
const Q = [
/* ---- FASE 1 ---- */
/* aula 1 — Introdução: origem e finalidade da orquestra na CCB */
{f:1,a:1,t:"Introdução",k:"ver",n:1,q:"Segundo o MSA, qual é a finalidade da orquestra na Congregação Cristã no Brasil?",g:"Conforme o texto do MSA. Em resumo: acompanhar os hinos de louvores e súplicas nos serviços divinos — a orquestra serve ao cantar da irmandade."},
{f:1,a:1,t:"Introdução",k:"entender",n:2,q:"Por que se diz que o músico acompanha o cantar da irmandade, e não se apresenta?",g:"Resposta aberta. Espera-se: o hino é da igreja reunida; a orquestra sustenta e conduz o canto, e por isso o conjunto vale mais do que o destaque individual."},
{f:1,a:1,t:"Introdução",k:"ver",n:1,q:"Quantas aulas tem cada período do GEM, e quantos períodos são até completar o MSA?",g:"Quinze aulas por período e quatro períodos — dois anos, somando 60 aulas."},
{f:1,a:1,t:"Introdução",k:"entender",n:2,q:"O que é o GEM e o que é o MSA? Não são a mesma coisa.",g:"GEM é o Grupo de Estudos Musicais — o grupo e o lugar onde se estuda. MSA é o Método Simplificado de Aprendizagem Musical — o material que ali se estuda."},
{f:1,a:1,t:"Introdução",k:"decidir",n:2,q:"Cite três compromissos que o candidato assume ao entrar no GEM.",g:"Resposta aberta: frequência às aulas, estudo em casa entre uma aula e outra, cuidado com o instrumento. Conferir com a orientação do encarregado local."},

/* aula 2 — 1.1 a 1.3: música, som, elementos e propriedades */
{f:1,a:2,t:"1.1–1.3",k:"ver",n:1,q:"Quais são as quatro propriedades do som?",g:"Altura, duração, intensidade e timbre."},
{f:1,a:2,t:"1.1–1.3",k:"ver",n:1,q:"Quais são os elementos da música?",g:"Melodia, harmonia e ritmo."},
{f:1,a:2,t:"1.1–1.3",k:"entender",n:2,q:"O que diferencia som de ruído?",g:"O som nasce de vibrações regulares e tem altura definida; o ruído vem de vibrações irregulares e não tem altura definida."},
{f:1,a:2,t:"1.1–1.3",k:"entender",n:2,q:"Duas pessoas tocam a mesma nota, com a mesma duração e a mesma intensidade — uma no violino, outra no clarinete. Qual propriedade do som permite distinguir as duas?",g:"O timbre."},
{f:1,a:2,t:"1.1–1.3",k:"entender",n:2,q:"Quando o encarregado pede “mais suave”, que propriedade do som ele está pedindo para mudar? E quando pede “mais agudo”?",g:"“Mais suave” muda a intensidade; “mais agudo” muda a altura."},
{f:1,a:2,t:"1.1–1.3",k:"decidir",n:3,q:"No ensaio o naipe toca as mesmas notas, com as mesmas durações, mas o conjunto soa desigual. Que propriedade do som provavelmente não está igual entre os músicos?",g:"A intensidade — cada um tocando com volume diferente. Se o incômodo for de afinação, aí o problema é de altura."},

/* aula 3 — 1.4: notas musicais */
{f:1,a:3,t:"1.4",k:"ver",n:1,q:"Escreva as sete notas musicais em ordem ascendente a partir do Fá.",g:"Fá, Sol, Lá, Si, Dó, Ré, Mi."},
{f:1,a:3,t:"1.4",k:"ver",n:1,q:"Escreva as sete notas em ordem descendente a partir do Dó.",g:"Dó, Si, Lá, Sol, Fá, Mi, Ré."},
{f:1,a:3,t:"1.4",k:"entender",n:2,q:"Por que os nomes das notas voltam a se repetir depois do Si?",g:"Porque a série recomeça na oitava: a nota seguinte tem o mesmo nome, mas soa mais aguda."},
{f:1,a:3,t:"1.4",k:"tocar",n:1,v:1,q:"Toque as quatro cordas soltas do violino, da mais grave para a mais aguda, e diga o nome de cada uma.",g:"Sol, Ré, Lá, Mi — de quinta em quinta."},
{f:1,a:3,t:"1.4",k:"tocar",n:2,v:1,q:"Toque as notas da corda Sol e as da corda Ré, dizendo o nome de cada uma em voz alta antes de tocá-la.",g:"Avaliar se o aluno nomeia a nota antes do som, e não depois de ouvir — é o que forma a leitura."},

/* aula 4 — 1.5 e 1.6: pentagrama e claves */
{f:1,a:4,t:"1.5",k:"ver",n:1,q:"Quantas linhas e quantos espaços tem o pentagrama, e em que sentido são contados?",g:"Cinco linhas e quatro espaços, contados sempre de baixo para cima."},
{f:1,a:4,t:"1.5",k:"entender",n:2,q:"O que é uma linha suplementar e para que ela serve?",g:"É uma linha curta acrescentada acima ou abaixo do pentagrama, para escrever notas que não cabem nas cinco linhas."},
{f:1,a:4,t:"1.6",k:"ver",n:1,q:"Quantas claves existem e quais são usadas na nossa orquestra?",g:"Três claves — Sol, Fá e Dó. Na orquestra usamos a de Sol, a de Fá na 4ª linha e a de Dó na 3ª linha, esta na viola."},
{f:1,a:4,t:"1.6",k:"ver",n:1,q:"Que clave está escrita na sua parte? E na do violoncelo?",g:"Violino, flauta, clarinete e trompete: clave de Sol (2ª linha). Violoncelo, trombone, fagote e tuba: clave de Fá (4ª linha)."},
{f:1,a:4,t:"1.6",k:"entender",n:3,q:"Por que a viola usa clave de Dó na 3ª linha em vez da clave de Sol?",g:"Porque a região média da viola cairia cheia de linhas suplementares na clave de Sol. A clave de Dó na 3ª linha centraliza a tessitura dela dentro do pentagrama."},
{f:1,a:4,t:"1.6",k:"comparar",n:2,q:"Abra o hinário no hino indicado: que clave está na voz do soprano e qual está na do baixo? Justifique a diferença.",g:"Soprano em clave de Sol e baixo em clave de Fá, porque cada clave serve à região — aguda ou grave — da voz correspondente."},

/* ---- FASE 2 ---- */
/* aula 5 — 2.1: figuras musicais */
{f:2,a:5,t:"2.1",k:"ver",n:1,q:"Escreva as figuras da semibreve à semicolcheia e o valor de cada uma em relação à semibreve.",g:"Semibreve (1), mínima (1/2), semínima (1/4), colcheia (1/8), semicolcheia (1/16)."},
{f:2,a:5,t:"2.1",k:"ver",n:1,q:"Quantas colcheias cabem em uma mínima? E quantas semicolcheias em uma semínima?",g:"Quatro colcheias; quatro semicolcheias."},
{f:2,a:5,t:"2.1",k:"ver",n:2,q:"Quantas semínimas cabem em uma semibreve? E quantas semicolcheias?",g:"Quatro semínimas; dezesseis semicolcheias."},
{f:2,a:5,t:"2.1",k:"ver",n:1,q:"O que são as pausas e como se relacionam com as figuras?",g:"São os sinais de silêncio. Cada figura tem a sua pausa equivalente, com exatamente a mesma duração."},
{f:2,a:5,t:"2.1",k:"erro",n:2,q:"Um aluno diz que “a pausa não vale nada porque não tem som”. Corrija.",g:"A pausa tem duração exata, igual à da figura correspondente: é silêncio medido. Quem não conta a pausa perde o compasso."},
{f:2,a:5,t:"2.1",k:"erro",n:3,q:"Um aluno afirma que “a semínima vale sempre 1 tempo”. Em que casos isso é falso?",g:"Sempre que a unidade de tempo não for a semínima: em 6/8 a unidade de tempo é a semínima pontuada e a semínima vale 2/3 de tempo; em 2/2 a unidade é a mínima e a semínima vale meio tempo."},

/* aula 6 — 2.2 e 2.3: compasso e barras de compasso */
{f:2,a:6,t:"2.2–2.3",k:"ver",n:1,q:"O que é compasso?",g:"É a divisão da música em grupos regulares de tempos, delimitados pelas barras de compasso."},
{f:2,a:6,t:"2.2–2.3",k:"ver",n:1,q:"Para que serve a barra de compasso?",g:"Para dividir a pauta em compassos, delimitando grupos regulares de tempos."},
{f:2,a:6,t:"2.2–2.3",k:"ver",n:1,q:"Qual a diferença entre barra dupla e barra final?",g:"A barra dupla (duas barras finas) marca uma mudança — de seção, de armadura, de fórmula de compasso — sem encerrar. A barra final (uma fina e uma grossa) encerra o hino."},
{f:2,a:6,t:"2.2–2.3",k:"ver",n:2,q:"Quantos compassos tem o primeiro sistema do hino indicado?",g:"Conforme o hino — contar pelas barras de compasso, e não pelos grupos de notas."},
{f:2,a:6,t:"2.2–2.3",k:"decidir",n:2,q:"No hino indicado há uma barra dupla no meio da peça. O que ela está avisando? Confira o que muda depois dela.",g:"Que começa uma nova seção ou que algo mudou: armadura, fórmula de compasso ou andamento. O aluno deve apontar o que efetivamente mudou naquele hino."},

/* aula 7 — 2.4: fórmula de compasso em 4 */
{f:2,a:7,t:"2.4",k:"ver",n:1,q:"Em 4/4, o que indica o número de cima e o que indica o número de baixo?",g:"O de cima, quantos tempos há em cada compasso (4). O de baixo, a figura que preenche um tempo (4 = semínima)."},
{f:2,a:7,t:"2.4",k:"ver",n:1,q:"Em 4/4: qual é a unidade de tempo e qual é a unidade de compasso?",g:"Unidade de tempo: semínima. Unidade de compasso: semibreve."},
{f:2,a:7,t:"2.4",k:"ver",n:1,q:"Marque a acentuação métrica do compasso 4/4.",g:"1º forte · 2º fraco · 3º meio-forte · 4º fraco."},
{f:2,a:7,t:"2.4",k:"erro",n:2,q:"Um compasso 4/4 foi escrito com: mínima + semínima + colcheia. Está correto? Se não, o que falta ou sobra?",g:"Está errado: 2 + 1 + ½ = 3½ tempos. Falta meio tempo, ou seja, uma colcheia."},
{f:2,a:7,t:"2.4",k:"erro",n:2,q:"Um compasso 4/4 foi escrito com: semibreve + semínima. Onde está o erro?",g:"Sobra um tempo — a semibreve sozinha já preenche os quatro tempos do compasso."},
{f:2,a:7,t:"2.4",k:"criar",n:3,q:"Escreva três compassos diferentes em 4/4, cada um usando pelo menos uma pausa, todos com a soma correta.",g:"Conferir a soma de cada compasso: tem de dar exatamente quatro tempos, contando as pausas."},

/* aulas 8 e 9 — 2.5 e 2.6: ritmo, pulsação e exercícios rítmicos */
{f:2,a:8,t:"2.5–2.6",k:"entender",n:2,q:"Qual a diferença entre pulso e ritmo?",g:"O pulso é a batida regular e constante que sustenta a música; o ritmo é a organização das durações sobre esse pulso."},
{f:2,a:8,t:"2.5–2.6",k:"tocar",n:1,q:"Marque o pulso com o pé e faça a linguagem rítmica dos dois primeiros compassos do hino indicado.",g:"Avaliar se o pulso permaneceu constante do primeiro ao último compasso — e não acelerou nas figuras curtas."},
{f:2,a:8,t:"2.5–2.6",k:"erro",n:2,q:"Ao ler um trecho de colcheias, o aluno acelerou. Que erro é esse e como se corrige?",g:"Ele trocou o pulso pela figura: as colcheias são mais rápidas, mas o pulso continua o mesmo. Corrige-se marcando o pulso com o pé e mantendo-o enquanto se lê."},
{f:2,a:9,t:"2.5–2.6",k:"ouvir",n:2,q:"O instrutor bate palmas apenas o ritmo dos quatro primeiros compassos de um hino já estudado. Descubra qual é.",g:"Conforme o hino escolhido. Vale pedir a justificativa: o que no ritmo entregou o hino."},
{f:2,a:9,t:"2.5–2.6",k:"ouvir",n:2,q:"O instrutor executa dois trechos: em um mantém o pulso, no outro acelera aos poucos. Diga qual manteve.",g:"Conforme a execução. Pedir que o aluno aponte onde percebeu a mudança."},
{f:2,a:9,t:"2.5–2.6",k:"criar",n:3,q:"Escreva um exercício rítmico de quatro compassos em 4/4 e execute-o para a turma, marcando o pulso.",g:"Conferir a soma de cada compasso e, na execução, a constância do pulso."},

/* ---- FASE 3 ---- */
/* aula 10 — 3.1: endecagrama */
{f:3,a:10,t:"3.1",k:"ver",n:1,q:"O que é o endecagrama?",g:"A união das pautas de clave de Sol e de clave de Fá por uma linha suplementar central, formando onze linhas."},
{f:3,a:10,t:"3.1",k:"ver",n:2,q:"No endecagrama, que clave fica na pauta de cima e qual na de baixo?",g:"Clave de Sol na pauta de cima; clave de Fá na de baixo."},
{f:3,a:10,t:"3.1",k:"entender",n:2,q:"No endecagrama, que nota ocupa a linha suplementar do meio? Por que ela é a referência entre as duas claves?",g:"O Dó central. É a nota que fecha a pauta de baixo e abre a de cima, servindo de ponte entre as duas claves."},
{f:3,a:10,t:"3.1",k:"tocar",n:2,q:"Localize no endecagrama a nota mais grave e a mais aguda que o seu instrumento toca dentro do hino indicado.",g:"Conforme o hino e o instrumento. O exercício mostra ao aluno em que faixa do endecagrama ele trabalha."},

/* aula 11 — 3.2: leitura rítmica, leitura métrica e solfejo */
{f:3,a:11,t:"3.2",k:"entender",n:2,q:"Qual a diferença entre leitura rítmica, leitura métrica e solfejo?",g:"Leitura rítmica: só as durações. Leitura métrica: os nomes das notas no ritmo certo, marcando o compasso, sem entoar. Solfejo: cantar as notas, com afinação."},
{f:3,a:11,t:"3.2",k:"tocar",n:2,q:"Faça a leitura métrica do primeiro sistema do hino indicado, marcando os movimentos do compasso.",g:"Avaliar clareza dos nomes das notas, constância do pulso e coincidência do gesto com o tempo forte."},
{f:3,a:11,t:"3.2",k:"tocar",n:3,q:"Faça a leitura rítmica e, em seguida, o solfejo do primeiro sistema do hino indicado.",g:"Avaliar se o ritmo se manteve igual nas duas passagens — é comum o ritmo se desfazer quando entra a afinação."},
{f:3,a:11,t:"3.2",k:"decidir",n:3,q:"Por que se estuda o hino primeiro pela leitura rítmica e só depois pelo solfejo?",g:"Porque separa as dificuldades: primeiro se resolve a duração, depois a altura. Tentar as duas ao mesmo tempo é onde o aluno trava."},
{f:3,a:11,t:"3.2",k:"criar",n:3,q:"Escolha um hino que você já toca e escreva três perguntas sobre ele para um colega — uma de identificar, uma de explicar e uma para tocar.",g:"Quem formula a pergunta precisa conhecer a resposta: este exercício mostra ao instrutor o que o aluno realmente domina."},

/* aulas 12 e 13 — 3.3 e 3.4: movimentos de condução e de solfejo em 4 */
{f:3,a:12,t:"3.3–3.4",k:"ver",n:1,q:"Descreva o movimento de condução em 4.",g:"1º para baixo, 2º para dentro, 3º para fora, 4º para cima."},
{f:3,a:12,t:"3.3–3.4",k:"entender",n:2,q:"Em qualquer fórmula de compasso, para onde vai sempre o gesto do primeiro tempo? Por quê?",g:"Sempre para baixo, porque o 1º tempo é o forte — é a referência visual de onde o compasso começa."},
{f:3,a:12,t:"3.3–3.4",k:"entender",n:2,q:"Qual a diferença entre o movimento de condução e o movimento de solfejo?",g:"O de condução é o gesto do regente, que conduz o conjunto. O de solfejo é o movimento que o próprio candidato faz com a mão para marcar os tempos enquanto lê ou solfeja."},
{f:3,a:13,t:"3.3–3.4",k:"tocar",n:2,q:"Solfeje o primeiro sistema do hino indicado marcando os quatro movimentos com a mão.",g:"Avaliar se o gesto e a voz andam juntos — o gesto não pode parar quando a leitura fica difícil."},
{f:3,a:13,t:"3.3–3.4",k:"erro",n:2,q:"Durante o solfejo em 4, o aluno fez o 1º tempo para cima. Qual é o erro e por que ele atrapalha?",g:"O 1º tempo é sempre para baixo, por ser o tempo forte. Invertido, o aluno perde a referência e todo o compasso sai deslocado."},

/* aula 14 — 3.5: metrônomo */
{f:3,a:14,t:"3.5",k:"ver",n:1,q:"Para que serve o metrônomo?",g:"Para marcar o pulso em velocidade constante, servindo de referência de andamento no estudo."},
{f:3,a:14,t:"3.5",k:"ver",n:1,q:"O que significa a marcação ♩ = 72?",g:"Que a semínima é a unidade de tempo e que se executam 72 semínimas por minuto."},
{f:3,a:14,t:"3.5",k:"comparar",n:2,q:"Dois hinos trazem ♩ = 60 e ♩ = 92. Qual é o mais lento? Quanto tempo dura um compasso 4/4 em cada um?",g:"O de ♩=60 é o mais lento. Em ♩=60 o compasso 4/4 dura 4 segundos; em ♩=92, cerca de 2,6 segundos."},
{f:3,a:14,t:"3.5",k:"tocar",n:2,q:"Ponha o metrônomo em ♩=60 e toque a escala do tom do hino indicado, uma nota por clique. Depois repita em ♩=80.",g:"Avaliar se a nota cai junto com o clique, e não logo antes ou logo depois."},
{f:3,a:14,t:"3.5",k:"decidir",n:3,q:"O hino está marcado ♩=88, mas a congregação canta bem mais devagar. O que a marcação significa nesse caso?",g:"A marcação é a referência de andamento escrita na partitura; no culto quem determina a execução é a condução do encarregado. Saber a marcação serve para estudar em casa no andamento certo."},

/* ---- FASE 4 ---- */
/* aula 1 — 4.1, 4.2, 4.3: ligadura, ponto de aumento, intervalo */
{f:4,a:1,t:"4.1",k:"ver",n:1,q:"Quais são os tipos de ligadura e o que cada um indica?",g:"De valor: une notas de mesma altura, somando as durações. De frase (expressão): delimita o fraseado. De portamento/legato: liga notas de alturas diferentes, executadas sem interrupção."},
{f:4,a:1,t:"4.1",k:"erro",n:2,q:"Uma ligadura une um Lá e um Dó. Pode ser ligadura de valor? Justifique.",g:"Não. Ligadura de valor só une notas de mesma altura. Nesse caso é ligadura de expressão ou de portamento/legato."},
{f:4,a:1,t:"4.1",k:"tocar",n:2,v:1,q:"Localize no hino indicado uma ligadura de frase e uma de valor. Toque as duas — o que muda na sua arcada em cada caso?",g:"Na ligadura de valor não se reataca a nota: sustenta-se pelo tempo somado. Na de frase, as notas tocam na mesma arcada, sem cortar o som entre elas."},
{f:4,a:1,t:"4.2",k:"ver",n:1,q:"O que o ponto de aumento faz com a figura?",g:"Aumenta metade do valor dela."},
{f:4,a:1,t:"4.2",k:"ver",n:2,q:"Em 4/4, quanto vale uma semínima pontuada? E uma mínima pontuada?",g:"Semínima pontuada: 1½ tempo. Mínima pontuada: 3 tempos."},
{f:4,a:1,t:"4.2",k:"entender",n:3,q:"Por que o segundo ponto de aumento vale menos que o primeiro?",g:"Porque cada ponto acrescenta metade do valor do ponto anterior, e não metade da figura original."},
{f:4,a:1,t:"4.3",k:"ver",n:1,q:"O que é intervalo?",g:"A distância de altura entre duas notas."},
{f:4,a:1,t:"4.3",k:"ver",n:2,q:"Como se conta um intervalo entre duas notas?",g:"Contando as notas de uma ponta à outra, incluindo as duas: de Dó a Mi são três notas — terça."},
{f:4,a:1,t:"4.3",k:"tocar",n:2,v:1,q:"Toque Sol e Si na corda Sol: que intervalo é esse? Agora toque as cordas Sol e Ré soltas — que intervalo formam?",g:"Sol–Si é uma terça (maior). Sol–Ré é uma quinta (justa) — é sempre o intervalo entre duas cordas vizinhas do violino."},

/* aula 2 — 4.4 e 4.5: fórmula de compasso em 3 e movimento de solfejo em 3 */
{f:4,a:2,t:"4.4–4.5",k:"ver",n:1,q:"Em 3/4: quantos tempos, qual a unidade de tempo e qual a unidade de compasso?",g:"Três tempos; unidade de tempo semínima; unidade de compasso mínima pontuada."},
{f:4,a:2,t:"4.4–4.5",k:"ver",n:1,q:"Qual a acentuação métrica do compasso 3/4?",g:"1º forte · 2º fraco · 3º fraco."},
{f:4,a:2,t:"4.4–4.5",k:"ver",n:1,q:"Descreva o movimento de solfejo em 3.",g:"1º para baixo, 2º para fora, 3º para cima."},
{f:4,a:2,t:"4.4–4.5",k:"entender",n:2,q:"Por que o último movimento do compasso vai para cima?",g:"Porque prepara o retorno ao tempo forte: a mão sobe para poder descer no 1º tempo do compasso seguinte."},
{f:4,a:2,t:"4.4–4.5",k:"tocar",n:2,q:"Marque os três movimentos com a mão, contando 1-2-3 em voz alta, por dez compassos seguidos, sem parar.",g:"Avaliar a constância: o erro comum é encurtar o 3º movimento e antecipar o tempo forte."},

/* aula 3 — 4.5: leitura rítmica em 3 */
{f:4,a:3,t:"4.4–4.5",k:"tocar",n:2,q:"Faça a leitura rítmica do primeiro sistema de um hino em 3/4, marcando os três movimentos.",g:"Avaliar se o gesto se manteve enquanto a voz lia — os dois não podem se separar."},
{f:4,a:3,t:"4.4–4.5",k:"ouvir",n:2,q:"O instrutor toca dois hinos, um em 2/4 e outro em 3/4. Diga qual é qual apenas pela acentuação.",g:"Conforme a execução. O aluno deve perceber de quantos em quantos tempos o apoio volta."},
{f:4,a:3,t:"4.4–4.5",k:"erro",n:2,q:"Lendo um compasso 3/4, o aluno fez quatro movimentos. Onde ele se perdeu?",g:"Acrescentou um movimento: em 3/4 são três. Costuma acontecer quando há pausa no 3º tempo e o aluno a conta duas vezes."},
{f:4,a:3,t:"4.4–4.5",k:"tocar",n:3,q:"Leia o mesmo trecho duas vezes: primeiro só o ritmo, depois dizendo os nomes das notas no mesmo andamento.",g:"Avaliar se o ritmo se manteve idêntico nas duas passagens."},

/* aula 4 — leitura métrica em 3 */
{f:4,a:4,t:"4.4–4.5",k:"tocar",n:2,q:"Faça a leitura métrica do primeiro sistema de um hino em 3/4.",g:"Nomes das notas no ritmo certo, marcando os movimentos, sem entoar."},
{f:4,a:4,t:"4.4–4.5",k:"decidir",n:2,q:"Na leitura métrica, o que se faz com as pausas?",g:"Contam-se no movimento, em silêncio: o gesto continua e a voz para."},
{f:4,a:4,t:"4.4–4.5",k:"erro",n:2,q:"Ao chegar numa mínima, o aluno parou o gesto e recomeçou depois. Qual é o erro?",g:"O gesto não para nunca. A mínima ocupa dois movimentos, e a mão marca os dois enquanto a nota soa."},
{f:4,a:4,t:"4.4–4.5",k:"tocar",n:2,q:"Repita a leitura métrica com o metrônomo em ♩=60.",g:"Avaliar se os movimentos caem junto com o clique."},

/* aula 5 — leitura métrica em 3 (continuação) */
{f:4,a:5,t:"4.4–4.5",k:"tocar",n:3,q:"Faça a leitura métrica do hino indicado inteiro, do começo ao fim, sem parar.",g:"O critério aqui é chegar ao fim sem interromper — erros pontuais se anotam e se refazem depois."},
{f:4,a:5,t:"4.4–4.5",k:"ouvir",n:2,q:"Ouça a leitura de um colega e aponte um compasso em que o gesto e a voz se desencontraram.",g:"Conforme a execução. Ouvir o erro do outro é o que ensina a ouvir o próprio."},
{f:4,a:5,t:"4.4–4.5",k:"decidir",n:3,q:"Quando você erra no meio da leitura, o certo é parar e voltar ou seguir em frente?",g:"Seguir. Parar quebra o pulso e ensina a parar. Anota-se o compasso e se volta nele depois."},
{f:4,a:5,t:"4.4–4.5",k:"comparar",n:3,q:"Compare sua leitura de hoje com a da aula 3: o que melhorou e o que continua difícil?",g:"Resposta aberta. Serve para o candidato nomear a própria dificuldade — é o que dirige o estudo em casa."},

/* aula 6 — 4.6 e 4.7: fórmula de compasso em 2 e movimento de solfejo em 2 */
{f:4,a:6,t:"4.6–4.7",k:"ver",n:1,q:"Em 2/4: acentuação métrica, unidade de tempo e unidade de compasso.",g:"1º forte, 2º fraco; unidade de tempo semínima; unidade de compasso mínima."},
{f:4,a:6,t:"4.6–4.7",k:"ver",n:1,q:"Descreva o movimento de solfejo em 2.",g:"1º para baixo, 2º para cima."},
{f:4,a:6,t:"4.6–4.7",k:"entender",n:2,q:"Por que o 2/4 é chamado binário?",g:"Porque tem dois tempos — um forte e um fraco —, formando o ciclo mais curto possível de acentuação."},
{f:4,a:6,t:"4.6–4.7",k:"comparar",n:3,q:"Procure no hinário um hino em 2/4 e outro em 3/4. Toque o primeiro sistema de cada um: o que muda na sensação de condução?",g:"Em 2/4 o ciclo forte–fraco é curto e marcial; em 3/4 há dois tempos fracos depois do forte, o que dá sensação de balanço mais largo."},
{f:4,a:6,t:"4.6–4.7",k:"tocar",n:2,q:"Marque os dois movimentos e leia o ritmo do primeiro sistema de um hino em 2/4.",g:"Avaliar se o 1º movimento continuou sendo o mais marcado."},

/* aula 7 — 4.7: leitura rítmica em 2 */
{f:4,a:7,t:"4.6–4.7",k:"tocar",n:2,q:"Faça a leitura rítmica de um sistema em 2/4 marcando os movimentos, com metrônomo em ♩=60 e depois em ♩=88.",g:"Avaliar se o desenho rítmico se manteve igual nos dois andamentos."},
{f:4,a:7,t:"4.6–4.7",k:"erro",n:2,q:"Em 2/4, o aluno acentuou o 2º tempo. O que isso provoca no conjunto?",g:"Desloca o peso do compasso: o canto sente o apoio no lugar errado e o andamento tende a correr."},
{f:4,a:7,t:"4.6–4.7",k:"ouvir",n:2,q:"O instrutor executa o mesmo trecho acentuando ora o 1º, ora o 2º tempo. Diga qual está certo e por quê.",g:"Conforme a execução. O certo é o 1º tempo — é ele o forte em qualquer fórmula."},
{f:4,a:7,t:"4.6–4.7",k:"tocar",n:3,q:"Leia o ritmo de um sistema em 2/4 sem o metrônomo e depois ligue o metrônomo para conferir se você se manteve.",g:"Avaliar a diferença: quem acelera sozinho descobre isso na hora em que o clique volta."},

/* aula 8 — leitura métrica em 2 */
{f:4,a:8,t:"4.6–4.7",k:"tocar",n:2,q:"Faça a leitura métrica de um sistema em 2/4.",g:"Nomes das notas no ritmo, marcando os dois movimentos, sem entoar."},
{f:4,a:8,t:"4.6–4.7",k:"ver",n:2,q:"Quantos movimentos você faz num compasso 2/4 que tem quatro colcheias?",g:"Dois. Os movimentos marcam os tempos, não as figuras: as quatro colcheias cabem dentro dos dois movimentos."},
{f:4,a:8,t:"4.6–4.7",k:"erro",n:2,q:"Há uma ligadura de valor entre as duas primeiras notas do compasso, e o aluno disse o nome das duas. Está certo?",g:"Não. Na ligadura de valor diz-se o nome uma vez só e sustenta-se pelas duas durações somadas."},
{f:4,a:8,t:"4.6–4.7",k:"decidir",n:2,q:"Como você estuda em casa um trecho que não sai?",g:"Resposta aberta. Espera-se: isolar o compasso, subdividir, tocar lento com metrônomo e aumentar a velocidade aos poucos — nunca repetir o trecho inteiro no andamento."},

/* aula 9 — leitura métrica em 2 (continuação) */
{f:4,a:9,t:"4.6–4.7",k:"tocar",n:3,q:"Apresente a leitura métrica completa do hino indicado, do começo ao fim, sem parar.",g:"Exercício individual de apresentação. Avaliar constância do pulso e clareza dos nomes."},
{f:4,a:9,t:"4.6–4.7",k:"ouvir",n:2,q:"Na leitura de um colega, verifique se ele manteve o pulso durante as pausas.",g:"Conforme a execução. A pausa é onde o pulso mais se perde."},
{f:4,a:9,t:"4.6–4.7",k:"criar",n:3,q:"Escreva quatro compassos em 2/4, com pelo menos uma pausa em cada, e leia-os metricamente.",g:"Conferir a soma de cada compasso: dois tempos exatos, contando as pausas."},

/* ---- FASE 5 ---- */
/* aula 10 — 5.1: tercinas */
{f:5,a:10,t:"5.1",k:"ver",n:1,q:"O que é uma tercina?",g:"Uma quiáltera de três notas executadas no valor de duas figuras iguais."},
{f:5,a:10,t:"5.1",k:"ver",n:1,q:"Como se reconhece uma tercina na partitura?",g:"Pelo número 3 escrito sobre (ou sob) o grupo de notas, em geral com colchete ou ligadura de grupo."},
{f:5,a:10,t:"5.1",k:"erro",n:2,q:"Em 4/4, um aluno tocou uma tercina de colcheias ocupando dois tempos. Qual o erro?",g:"A tercina de colcheias ocupa o valor de duas colcheias, ou seja, um tempo — não dois."},
{f:5,a:10,t:"5.1",k:"tocar",n:2,q:"Fale a tercina em voz alta três vezes seguidas, mantendo o pé no pulso, e depois toque-a no hino indicado.",g:"Avaliar se as três notas ficaram iguais entre si e se couberam exatamente dentro de um tempo."},
{f:5,a:10,t:"5.1",k:"comparar",n:3,q:"Compare três colcheias de uma tercina com três colcheias de um compasso em 6/8: soam iguais? Por quê?",g:"O desenho é parecido, mas em 6/8 as três colcheias são a divisão normal do tempo. Na tercina, são três notas ocupando o espaço de duas — exceção dentro de um compasso simples."},

/* aula 11 — tercinas (continuação) */
{f:5,a:11,t:"5.1",k:"tocar",n:2,q:"Localize uma tercina no hino indicado e toque o compasso inteiro no andamento.",g:"Avaliar se o tempo seguinte entrou no lugar certo — é ali que a tercina mal medida aparece."},
{f:5,a:11,t:"5.1",k:"ouvir",n:2,q:"O instrutor toca duas vezes: uma com a tercina correta e outra alongando a primeira nota. Diga qual está certa.",g:"Conforme a execução. Na tercina as três notas têm exatamente a mesma duração."},
{f:5,a:11,t:"5.1",k:"erro",n:2,q:"O aluno tocou a tercina como colcheia pontuada seguida de duas semicolcheias. O que aconteceu?",g:"Ele transformou a tercina em ritmo pontuado. As três notas da tercina são iguais entre si."},
{f:5,a:11,t:"5.1",k:"tocar",n:3,q:"Toque a tercina com o metrônomo, um clique por tempo e três notas por clique.",g:"Avaliar se a primeira nota de cada grupo cai exatamente no clique."},

/* aula 12 — 5.2: fermata */
{f:5,a:12,t:"5.2",k:"ver",n:1,q:"Qual a diferença entre fermata suspensiva e fermata conclusiva?",g:"Suspensiva: prolongamento leve, a música continua depois. Conclusiva: prolongamento mais acentuado, com terminação gradual, no final do hino ou da seção."},
{f:5,a:12,t:"5.2",k:"ver",n:1,q:"Como é o sinal da fermata e onde ele se escreve?",g:"Um arco com um ponto no centro, escrito acima (ou abaixo) da nota ou da pausa que se prolonga."},
{f:5,a:12,t:"5.2",k:"ver",n:2,q:"A fermata pode cair sobre uma pausa?",g:"Pode. Prolonga-se o silêncio do mesmo modo, até o gesto de saída."},
{f:5,a:12,t:"5.2",k:"decidir",n:2,q:"Há fermata no fim do primeiro período do hino. Quem decide quanto tempo ela dura, e o que você faz enquanto isso?",g:"Quem decide é a condução. O músico sustenta o som firme e afinado até o gesto de saída, sem antecipar nem deixar cair a intensidade."},
{f:5,a:12,t:"5.2",k:"tocar",n:2,q:"Localize as fermatas do hino indicado e diga, para cada uma, se é suspensiva ou conclusiva.",g:"Conforme o hino. Em geral as internas são suspensivas e a final é conclusiva."},

/* aula 13 — 5.3 e 5.4: fórmula de compasso em 6 e movimento de solfejo em 6 */
{f:5,a:13,t:"5.3–5.5",k:"ver",n:1,q:"Em 6/8: quantos movimentos, quantos tempos, e quais são a unidade de movimento, a unidade de tempo e a unidade de compasso?",g:"Seis movimentos e dois tempos. Unidade de movimento: colcheia. Unidade de tempo: semínima pontuada. Unidade de compasso: mínima pontuada."},
{f:5,a:13,t:"5.3–5.5",k:"ver",n:2,q:"Marque a acentuação métrica do 6/8 nos seis movimentos.",g:"1º forte · 4º meio-forte · os demais fracos."},
{f:5,a:13,t:"5.3–5.5",k:"ver",n:1,q:"Descreva o movimento de solfejo em 6.",g:"1º para baixo, 2º e 3º para dentro, 4º e 5º para fora, 6º para cima."},
{f:5,a:13,t:"5.3–5.5",k:"entender",n:3,q:"Por que em 6/8 a unidade de tempo é uma figura pontuada?",g:"Porque cada tempo se divide em três colcheias, e só uma figura pontuada representa uma divisão ternária."},
{f:5,a:13,t:"5.3–5.5",k:"tocar",n:2,q:"Marque os seis movimentos contando 1-2-3-4-5-6, por dez compassos, mantendo o pulso.",g:"Avaliar se o 4º movimento ficou perceptivelmente mais marcado que o 2º, 3º, 5º e 6º."},

/* aula 14 — 5.5: movimento alternativo de solfejo em 6 */
{f:5,a:14,t:"5.3–5.5",k:"ver",n:1,q:"O que é o movimento alternativo de solfejo em 6?",g:"Conduzir o compasso 6/8 em dois movimentos em vez de seis — um por tempo, agrupando três colcheias em cada."},
{f:5,a:14,t:"5.3–5.5",k:"entender",n:2,q:"Quando se usa o movimento alternativo?",g:"Quando o andamento é rápido: em seis movimentos o gesto ficaria apressado e perderia a clareza dos dois tempos reais."},
{f:5,a:14,t:"5.3–5.5",k:"tocar",n:2,q:"Leia o mesmo trecho em 6/8 duas vezes: primeiro em seis movimentos, depois em dois.",g:"Avaliar se o ritmo se manteve idêntico — muda o gesto, não a música."},
{f:5,a:14,t:"5.3–5.5",k:"comparar",n:3,q:"O que muda na sensação do hino quando se conduz em 2 em vez de 6?",g:"Em 2 o compasso ganha fluência e as três colcheias passam a soar como subdivisão; em 6 cada colcheia ganha peso e o andamento tende a ficar mais lento."},
{f:5,a:14,t:"5.3–5.5",k:"decidir",n:3,q:"Como decidir, num hino, entre seis e dois movimentos?",g:"Pelo andamento marcado e pela condução do encarregado: hinos lentos pedem os seis movimentos; os rápidos, os dois."},

/* ---- FASE 6 ---- */
/* aula 1 — 6.1 e 6.2: tom e semitom, acidentes */
{f:6,a:1,t:"6.1",k:"ver",n:1,q:"Onde estão os semitons naturais da escala de Dó maior?",g:"Entre Mi e Fá, e entre Si e Dó."},
{f:6,a:1,t:"6.1",k:"ver",n:2,q:"Quantos semitons há em um tom?",g:"Dois."},
{f:6,a:1,t:"6.1",k:"entender",n:2,q:"Qual a diferença entre tom e semitom? Dê um exemplo de cada no hino indicado.",g:"O semitom é a menor distância entre duas notas do nosso sistema; o tom equivale a dois semitons. Exemplos conforme o hino."},
{f:6,a:1,t:"6.1",k:"erro",n:2,q:"Um aluno diz que entre Mi e Fá existe um tom. Corrija.",g:"Entre Mi e Fá há um semitom natural — não existe nota intermediária. O mesmo acontece entre Si e Dó."},
{f:6,a:1,t:"6.2",k:"ver",n:1,q:"Qual é o efeito do sustenido, do bemol e do bequadro?",g:"Sustenido eleva a nota meio tom; bemol abaixa meio tom; bequadro cancela o acidente anterior, voltando a nota ao estado natural."},

/* aula 2 — 6.3 e 6.4: escalas e escalas diatônicas */
{f:6,a:2,t:"6.3–6.4",k:"ver",n:1,q:"O que é escala?",g:"Sucessão de notas em ordem, ascendente ou descendente, dentro de uma oitava."},
{f:6,a:2,t:"6.3–6.4",k:"ver",n:1,q:"Qual é a fórmula da escala maior, em tons e semitons?",g:"T – T – S – T – T – T – S."},
{f:6,a:2,t:"6.3–6.4",k:"ver",n:2,q:"Quantas notas tem a escala diatônica e quantas tem a cromática?",g:"A diatônica, sete (mais a oitava); a cromática, doze (mais a oitava)."},
{f:6,a:2,t:"6.3–6.4",k:"comparar",n:2,q:"Qual a diferença entre escala diatônica e escala cromática?",g:"A diatônica tem sete notas de nomes diferentes, com tons e semitons alternados conforme a fórmula. A cromática tem doze, todas distantes de meio tom."},
{f:6,a:2,t:"6.3–6.4",k:"tocar",n:2,q:"Toque a escala de Dó maior ascendente e descendente, dizendo em voz alta onde estão os semitons.",g:"Entre o 3º e o 4º graus (Mi–Fá) e entre o 7º e o 8º (Si–Dó)."},

/* aula 3 — 6.5 e 6.6: escalas maiores, escalas maiores com sustenidos */
{f:6,a:3,t:"6.5–6.7",k:"ver",n:2,q:"Diga a ordem dos sustenidos.",g:"Fá, Dó, Sol, Ré, Lá, Mi, Si."},
{f:6,a:3,t:"6.5–6.7",k:"ver",n:2,q:"Escreva a escala de Sol maior e diga qual nota recebe sustenido.",g:"Sol Lá Si Dó Ré Mi Fá♯ Sol — o Fá."},
{f:6,a:3,t:"6.5–6.7",k:"entender",n:3,q:"Por que a escala de Sol maior precisa do Fá♯?",g:"Para manter a fórmula T-T-S-T-T-T-S. Sem o sustenido, o semitom cairia entre Mi e Fá, ou seja, no lugar errado da escala."},
{f:6,a:3,t:"6.5–6.7",k:"tocar",n:2,v:1,q:"Toque a escala de Ré maior em duas oitavas e diga quais são os dois sustenidos e em que dedos eles caem.",g:"Fá♯ e Dó♯. Conferir a afinação dos dois: são os que costumam ficar baixos."},
{f:6,a:3,t:"6.5–6.7",k:"criar",n:3,q:"Escreva a escala de Ré maior e marque onde caem os semitons.",g:"Ré Mi Fá♯ Sol Lá Si Dó♯ Ré — semitons entre Fá♯–Sol e entre Dó♯–Ré."},

/* aula 4 — 6.7: escalas maiores com bemóis */
{f:6,a:4,t:"6.5–6.7",k:"ver",n:2,q:"Diga a ordem dos bemóis.",g:"Si, Mi, Lá, Ré, Sol, Dó, Fá — exatamente a ordem inversa da dos sustenidos."},
{f:6,a:4,t:"6.5–6.7",k:"ver",n:2,q:"Escreva a escala de Fá maior e diga qual nota recebe bemol.",g:"Fá Sol Lá Si♭ Dó Ré Mi Fá — o Si."},
{f:6,a:4,t:"6.5–6.7",k:"criar",n:3,q:"Escreva a escala de Si bemol maior e marque onde caem os semitons.",g:"Si♭ Dó Ré Mi♭ Fá Sol Lá Si♭ — semitons entre Ré–Mi♭ e entre Lá–Si♭."},
{f:6,a:4,t:"6.5–6.7",k:"tocar",n:2,q:"Toque as escalas de Fá maior e de Si bemol maior, dizendo os bemóis antes de começar cada uma.",g:"Fá maior: Si♭. Si bemol maior: Si♭ e Mi♭."},
{f:6,a:4,t:"6.5–6.7",k:"entender",n:3,v:1,q:"Por que Sol, Ré, Lá e Mi maior soam mais ressonantes no violino do que Lá bemol ou Ré bemol maior?",g:"Porque suas tônicas e dominantes coincidem com as cordas soltas, que vibram por simpatia e reforçam o som. Nas tonalidades com muitos bemóis isso não acontece, e a afinação exige mais atenção do ouvido."},

/* ---- FASE 7 ---- */
/* aula 5 — 7.1: armadura de clave */
{f:7,a:5,t:"7.1",k:"ver",n:1,q:"O que é a armadura de clave e onde ela fica escrita?",g:"É o conjunto de acidentes fixos, escrito logo depois da clave, no início de cada pauta; vale para o hino inteiro."},
{f:7,a:5,t:"7.1",k:"ver",n:1,q:"Quais são os acidentes fixos do hino indicado, em ordem?",g:"Conforme o hino — conferir se o aluno os disse na ordem da armadura, e não na ordem em que aparecem na melodia."},
{f:7,a:5,t:"7.1",k:"ver",n:2,q:"A armadura se repete em todas as pautas do hino ou aparece só na primeira?",g:"Repete-se no início de cada pauta. A fórmula de compasso é que aparece uma vez só."},
{f:7,a:5,t:"7.1",k:"erro",n:2,q:"Um aluno tocou Fá natural no meio do hino, mesmo havendo Fá♯ na armadura, e disse que “não tinha sustenido escrito naquela nota”. Onde está o engano?",g:"O acidente da armadura vale para todos os Fá do hino, em qualquer oitava, sem precisar ser reescrito. Só um bequadro o cancelaria."},
{f:7,a:5,t:"7.1",k:"comparar",n:2,q:"Compare a armadura do hino indicado com a de outro hino do hinário: qual tem mais acidentes, e o que isso muda para você na execução?",g:"Conforme os hinos. Espera-se que o aluno relacione o número de acidentes à dificuldade de leitura e de afinação no seu instrumento."},

/* aula 6 — 7.2 e 7.3: fórmula de compasso em 9 e movimento de solfejo em 9 */
{f:7,a:6,t:"7.2–7.4",k:"ver",n:2,q:"Em 9/8: quantos movimentos, quantos tempos, e quais são a unidade de movimento e a unidade de tempo?",g:"Nove movimentos e três tempos; unidade de movimento colcheia; unidade de tempo semínima pontuada."},
{f:7,a:6,t:"7.2–7.4",k:"ver",n:2,q:"Quantos tempos tem o 9/8 e como cada um deles se divide?",g:"Três tempos, cada um dividido em três colcheias."},
{f:7,a:6,t:"7.2–7.4",k:"ver",n:1,q:"Descreva o movimento de solfejo em 9.",g:"Três grupos de três, seguindo o desenho do compasso em 3: 1º, 2º e 3º para baixo; 4º, 5º e 6º para fora; 7º, 8º e 9º para cima."},
{f:7,a:6,t:"7.2–7.4",k:"entender",n:3,q:"Em 9/8 a unidade de compasso é indefinida. Por quê?",g:"Porque nove colcheias não correspondem a nenhuma figura única: a mínima pontuada dá seis e a semibreve pontuada dá doze. Não existe figura que preencha o compasso sozinha."},
{f:7,a:6,t:"7.2–7.4",k:"tocar",n:2,q:"Marque os nove movimentos contando em voz alta, por oito compassos seguidos.",g:"Avaliar se os acentos caíram no 1º, no 4º e no 7º movimentos."},

/* aula 7 — 7.4: movimento alternativo em 9 */
{f:7,a:7,t:"7.2–7.4",k:"ver",n:1,q:"O que é o movimento alternativo de solfejo em 9?",g:"Conduzir em três movimentos — um por tempo — em vez de nove."},
{f:7,a:7,t:"7.2–7.4",k:"entender",n:2,q:"Quando se usa o movimento alternativo em 9?",g:"Em andamentos rápidos, onde nove gestos ficariam apressados e perderiam a clareza dos três tempos reais."},
{f:7,a:7,t:"7.2–7.4",k:"tocar",n:2,q:"Leia um trecho em 9/8 duas vezes: em nove movimentos e depois em três.",g:"Avaliar se o ritmo se manteve igual nas duas leituras."},
{f:7,a:7,t:"7.2–7.4",k:"comparar",n:3,q:"O que muda entre conduzir em 9 e conduzir em 3?",g:"Em 3 o compasso ganha fluência e as colcheias viram subdivisão; em 9 cada colcheia ganha peso e o andamento tende a ficar mais lento."},

/* aula 8 — 7.5 e 7.6: fórmula de compasso em 12 e movimento de solfejo em 12 */
{f:7,a:8,t:"7.5–7.7",k:"ver",n:2,q:"Em 12/8: quantos movimentos, quantos tempos, unidade de tempo e unidade de compasso?",g:"Doze movimentos e quatro tempos; unidade de tempo semínima pontuada; unidade de compasso semibreve pontuada."},
{f:7,a:8,t:"7.5–7.7",k:"ver",n:2,q:"Qual a unidade de compasso do 12/8, e por quê?",g:"Semibreve pontuada — doze colcheias equivalem exatamente a ela."},
{f:7,a:8,t:"7.5–7.7",k:"ver",n:1,q:"Descreva o movimento de solfejo em 12.",g:"Quatro grupos de três, seguindo o desenho do compasso em 4: baixo, dentro, fora e cima."},
{f:7,a:8,t:"7.5–7.7",k:"comparar",n:3,q:"12/8 e 4/4 têm os dois quatro tempos. O que realmente os diferencia?",g:"A divisão do tempo: em 4/4 cada tempo se divide em dois (compasso simples); em 12/8, em três (compasso composto)."},

/* aula 9 — 7.7: movimento alternativo em 12 */
{f:7,a:9,t:"7.5–7.7",k:"ver",n:1,q:"O que é o movimento alternativo de solfejo em 12?",g:"Conduzir em quatro movimentos, um por tempo, em vez de doze."},
{f:7,a:9,t:"7.5–7.7",k:"tocar",n:2,q:"Leia um trecho em 12/8 em quatro movimentos, com o metrônomo marcando os tempos.",g:"Avaliar se as três colcheias de cada tempo ficaram iguais entre si."},
{f:7,a:9,t:"7.5–7.7",k:"entender",n:3,q:"Por que o 12/8 conduzido em 4 se parece tanto com o 4/4?",g:"Porque os dois têm quatro tempos. O que muda é a subdivisão: ternária no 12/8, binária no 4/4."},

/* aula 10 — movimento alternativo em 12 (continuação) */
{f:7,a:10,t:"7.5–7.7",k:"tocar",n:2,q:"Faça a leitura métrica de um sistema em 12/8, em quatro movimentos, com metrônomo.",g:"Avaliar se o gesto se manteve nos trechos de figuras longas."},
{f:7,a:10,t:"7.5–7.7",k:"ouvir",n:2,q:"O instrutor toca um trecho em 4/4 e outro em 12/8. Diga qual é o composto e como percebeu.",g:"Conforme a execução. O composto se reconhece pela subdivisão em três dentro de cada tempo."},
{f:7,a:10,t:"7.5–7.7",k:"erro",n:2,q:"O aluno contou o 12/8 como se fossem doze tempos. Qual o problema prático?",g:"O andamento fica arrastado e a frase se perde. São quatro tempos, com três colcheias em cada."},

/* aula 11 — movimento alternativo em 12 (continuação) */
{f:7,a:11,t:"7.5–7.7",k:"tocar",n:3,q:"Apresente a leitura completa do hino em compasso composto indicado pelo instrutor.",g:"Exercício individual de apresentação. Avaliar constância do pulso e clareza da subdivisão."},
{f:7,a:11,t:"7.5–7.7",k:"criar",n:3,q:"Escreva dois compassos em 6/8 e dois em 9/8, com a soma correta em cada um.",g:"6/8: seis colcheias por compasso. 9/8: nove. Conferir também o agrupamento das hastes, de três em três."},
{f:7,a:11,t:"7.5–7.7",k:"decidir",n:3,q:"Abrindo o hinário, como você identifica rapidamente se o compasso é simples ou composto?",g:"Pelo número de cima da fórmula: 2, 3 e 4 são simples; 6, 9 e 12 são compostos. E pela escrita, que agrupa as figuras de três em três."},

/* ---- FASE 8 ---- */
/* aula 12 — 8.1: tonalidade */
{f:8,a:12,t:"8.1",k:"ver",n:1,q:"Uma armadura com dois sustenidos corresponde a que tonalidade maior? E qual a relativa menor?",g:"Ré maior; relativa menor, Si menor."},
{f:8,a:12,t:"8.1",k:"entender",n:2,q:"Qual a regra prática para achar a tonalidade maior numa armadura de sustenidos? E numa de bemóis?",g:"Sustenidos: meio tom acima do último sustenido. Bemóis: o penúltimo bemol é a tônica — com um bemol só, Fá maior."},
{f:8,a:12,t:"8.1",k:"decidir",n:3,q:"A armadura tem três bemóis. Como decidir se o hino está em Mi bemol maior ou em Dó menor?",g:"Pela nota e pelo acorde final, e pela presença da sensível da menor (Si natural) ao longo do hino."},
{f:8,a:12,t:"8.1",k:"ver",n:1,q:"Preencha, para o hino indicado: tonalidade escrita e tonalidade de execução.",g:"Escrita é a que está no hinário. Execução é a que soa no seu instrumento: no violino, na flauta e no violoncelo são iguais; no clarinete em Si♭, no sax alto em Mi♭ e no trompete em Si♭, não."},
{f:8,a:12,t:"8.1",k:"entender",n:3,q:"Por que o clarinete lê uma nota e soa outra, e o violino não?",g:"Porque o clarinete é instrumento transpositor: o Dó que ele lê soa Si♭. O violino é instrumento em Dó — lê e soa a mesma nota."},
{f:8,a:12,t:"8.1",k:"ver",n:2,v:1,q:"Segundo o Programa Mínimo, que voz do hinário o violino executa, e em que oitava, para os cultos oficiais?",g:"A voz do soprano, uma oitava acima do escrito. Nas Reuniões de Jovens e Menores, hinos 431 a 480 com soprano no natural; para a oficialização, hinário completo com soprano uma oitava acima e contralto no natural."},

/* aula 13 — 8.2: acidentes ocorrentes e de precaução */
{f:8,a:13,t:"8.2",k:"ver",n:1,q:"O que é acidente ocorrente e até onde ele vale?",g:"É o acidente escrito no meio da música, antes de uma nota. Vale até o fim do compasso em que aparece, para as notas de mesmo nome e mesma altura."},
{f:8,a:13,t:"8.2",k:"ver",n:1,q:"O que é acidente de precaução?",g:"Um acidente que não altera nada: é escrito só para lembrar ao executante a altura correta e evitar o erro."},
{f:8,a:13,t:"8.2",k:"ver",n:2,q:"Um acidente ocorrente vale também para a mesma nota em outra oitava?",g:"Não. Vale para a nota de mesmo nome e mesma altura, dentro daquele compasso."},
{f:8,a:13,t:"8.2",k:"erro",n:3,q:"No hino, um Si bemol ocorrente aparece no segundo tempo de um compasso. O aluno tocou Si natural no quarto tempo do mesmo compasso. Está certo?",g:"Não. O acidente ocorrente vale até o fim daquele compasso: o Si do quarto tempo também é bemol, a não ser que haja bequadro escrito."},
{f:8,a:13,t:"8.2",k:"tocar",n:2,q:"Localize no hino indicado um acidente ocorrente e diga em voz alta até onde ele vale, antes de tocar o trecho.",g:"Conforme o hino. O aluno deve apontar a barra de compasso onde o efeito termina."},

/* ---- FASE 9 ---- */
/* aula 14 — 9.1: barra de compasso, repetição */
{f:9,a:14,t:"9.1",k:"ver",n:1,q:"O que é ritornelo e o que ele manda fazer?",g:"É a barra de repetição: manda repetir o trecho compreendido entre as barras de repetição — ou desde o início, se não houver a de abertura."},
{f:9,a:14,t:"9.1",k:"ver",n:1,q:"O que indicam as casas 1 e 2?",g:"Finais diferentes para o mesmo trecho: a casa 1 na primeira vez, a casa 2 na repetição, pulando a casa 1."},
{f:9,a:14,t:"9.1",k:"ver",n:2,q:"O que significam D.C. e D.S.? E o que é “ao Fine”?",g:"D.C. (Da Capo): voltar ao início. D.S. (Dal Segno): voltar ao sinal. “ao Fine”: tocar até onde estiver escrito Fine e encerrar ali."},
{f:9,a:14,t:"9.1",k:"decidir",n:2,q:"O encarregado pede: “do compasso 9, com a repetição, casa 2”. Onde você começa e por onde passa?",g:"Começa no compasso 9, toca até a casa 1, volta ao ritornelo e, na segunda vez, pula a casa 1 e toca a casa 2."},
{f:9,a:14,t:"9.1",k:"tocar",n:2,q:"Percorra o hino indicado em voz alta, dizendo apenas os números dos compassos na ordem em que serão tocados, respeitando repetições e casas.",g:"Avaliar se o percurso está correto do primeiro ao último compasso — este exercício revela o erro antes que ele apareça no ensaio."},

/* ---- FASE 10 ---- */
/* aula 1 — 10.1: dinâmica */
{f:10,a:1,t:"10.1",k:"ver",n:1,q:"Coloque em ordem crescente de intensidade: mf, pp, f, p, ff, mp.",g:"pp · p · mp · mf · f · ff."},
{f:10,a:1,t:"10.1",k:"ver",n:1,q:"O que significam os sinais em forma de ângulo escritos sob a pauta, abrindo e fechando?",g:"Crescendo (abrindo) e diminuendo (fechando) — aumento e diminuição gradual da intensidade."},
{f:10,a:1,t:"10.1",k:"entender",n:2,q:"Qual a diferença entre f e crescendo?",g:"f é um nível de intensidade, fixo. Crescendo é o aumento gradual de intensidade até chegar a outro nível."},
{f:10,a:1,t:"10.1",k:"decidir",n:2,v:1,q:"O hino pede p num trecho agudo. O que muda no seu arco?",g:"Menos peso do braço, arco mais lento e ponto de contato mais próximo da escala — mantendo o som apoiado, sem deixar a nota “soprar”."},
{f:10,a:1,t:"10.1",k:"decidir",n:2,q:"Nas retomadas, depois da respiração, o som volta forte ou fraco? Por quê?",g:"Fraco. A retomada depois da respiração não recebe acento — quem recebe acento é o tempo forte do compasso, não a entrada do fôlego."},
{f:10,a:1,t:"10.1",k:"ouvir",n:3,q:"O instrutor toca a mesma frase duas vezes: uma com crescendo e outra em intensidade fixa. Diga qual é qual e onde o crescendo começou.",g:"Conforme a execução. O aluno deve identificar o ponto de partida do crescendo, e não apenas notar que houve."},

/* ---- FASE 11 ---- */
/* aula 2 — 11.1, 11.2 e 11.3: acento métrico, compasso simples e composto */
{f:11,a:2,t:"11.1",k:"entender",n:2,q:"O que é acento métrico e por que ele não precisa estar escrito na partitura?",g:"É a alternância natural de tempos fortes e fracos determinada pela fórmula de compasso. Não se escreve porque decorre da própria métrica."},
{f:11,a:2,t:"11.2–11.3",k:"entender",n:2,q:"Qual a diferença entre compasso simples e compasso composto?",g:"No simples, a unidade de tempo é figura simples e cada tempo se divide em dois. No composto, a unidade de tempo é figura pontuada e cada tempo se divide em três."},
{f:11,a:2,t:"11.2–11.3",k:"ver",n:2,q:"Classifique cada um em binário, ternário ou quaternário, e em simples ou composto: 2/4, 3/4, 4/4, 6/8, 9/8, 12/8.",g:"2/4 binário simples · 3/4 ternário simples · 4/4 quaternário simples · 6/8 binário composto · 9/8 ternário composto · 12/8 quaternário composto."},
{f:11,a:2,t:"11.2–11.3",k:"ver",n:2,q:"Como saber, só pela fórmula, se o compasso é simples ou composto?",g:"Pelo número de cima: 2, 3 e 4 indicam compasso simples; 6, 9 e 12 indicam composto."},
{f:11,a:2,t:"11.2–11.3",k:"erro",n:2,q:"Um aluno classificou o 6/8 como ternário porque tem seis movimentos. Corrija.",g:"6/8 é binário composto: tem dois tempos, cada um com três colcheias. Os seis são movimentos, não tempos."},

/* aula 3 — 11.4: compassos alternados */
{f:11,a:3,t:"11.4",k:"ver",n:2,q:"O que é compasso alternado?",g:"É quando a fórmula de compasso muda no decorrer da música, alternando entre fórmulas diferentes."},
{f:11,a:3,t:"11.4",k:"ver",n:1,q:"Como o compasso alternado aparece escrito na partitura?",g:"A nova fórmula é escrita no compasso em que passa a valer, geralmente depois de uma barra dupla."},
{f:11,a:3,t:"11.4",k:"decidir",n:3,q:"O hino muda de 4/4 para 3/4 no meio. O que você confere antes de tocar?",g:"Onde está a barra dupla da mudança, se a unidade de tempo continua sendo a semínima (o pulso não muda) e como fica a condução no compasso da virada."},
{f:11,a:3,t:"11.4",k:"tocar",n:2,q:"Leia um trecho que muda de fórmula, marcando os movimentos de cada compasso.",g:"Avaliar se o pulso se manteve na virada — é ali que o conjunto se desencontra."},
{f:11,a:3,t:"11.4",k:"ouvir",n:2,q:"O instrutor executa um trecho com mudança de compasso. Aponte em que compasso ela ocorre.",g:"Conforme a execução."},

/* ---- FASE 12 ---- */
/* aula 4 — 12.1 e 12.2: síncopa e contratempo */
{f:12,a:4,t:"12.1–12.2",k:"ver",n:1,q:"O que é síncopa?",g:"Som que começa em parte fraca (ou em tempo fraco) e se prolonga sobre a parte forte seguinte."},
{f:12,a:4,t:"12.1–12.2",k:"ver",n:1,q:"O que é contratempo?",g:"Som que entra em parte fraca, precedido de pausa na parte forte, sem prolongar-se sobre ela."},
{f:12,a:4,t:"12.1–12.2",k:"entender",n:2,q:"Qual a diferença entre síncopa e contratempo?",g:"Na síncopa o som atravessa a parte forte. No contratempo a parte forte é ocupada por pausa e o som entra depois, sem atravessá-la."},
{f:12,a:4,t:"12.1–12.2",k:"erro",n:3,q:"Um aluno diz que “toda nota fora do tempo forte é síncopa”. Corrija.",g:"Só é síncopa se a nota iniciada na parte fraca atravessar a parte forte seguinte. Se houver pausa no forte e o som entrar depois, é contratempo — e há ainda notas fracas que não são nem uma coisa nem outra."},
{f:12,a:4,t:"12.1–12.2",k:"tocar",n:2,q:"Localize no hino indicado uma síncopa e toque só aquele compasso, marcando o pulso com o pé.",g:"Avaliar se o pé continuou marcando o tempo forte enquanto o som o atravessava — é aí que o aluno costuma perder o compasso."},

/* aula 5 — síncopa e contratempo (continuação) */
{f:12,a:5,t:"12.1–12.2",k:"ouvir",n:3,q:"O instrutor toca dois compassos: um com síncopa e um com contratempo. Diga qual é cada um.",g:"Conforme a execução. Pedir que o aluno explique o que ouviu: se houve silêncio no tempo forte (contratempo) ou som atravessando-o (síncopa)."},
{f:12,a:5,t:"12.1–12.2",k:"tocar",n:2,q:"Toque um compasso com contratempo mantendo o pé no tempo forte, em silêncio.",g:"O pé marca o forte vazio: é o que impede a entrada de adiantar."},
{f:12,a:5,t:"12.1–12.2",k:"erro",n:2,q:"Ao tocar uma síncopa, o aluno reatacou a nota no tempo forte. O que ele desfez?",g:"A própria síncopa: a nota deve atravessar o tempo forte sem ser atacada de novo. Reatacando, viram duas notas comuns."},
{f:12,a:5,t:"12.1–12.2",k:"criar",n:3,q:"Escreva dois compassos em 4/4: um com síncopa e outro com contratempo. Marque qual é qual.",g:"Conferir a soma dos tempos e se a diferença entre os dois ficou clara na escrita."},

/* ---- FASE 13 ---- */
/* aula 6 — 13.1: ritmos iniciais */
{f:13,a:6,t:"13.1",k:"ver",n:1,q:"Quais são os três ritmos iniciais e como se define cada um?",g:"Tético: começa no tempo forte, compasso completo. Anacrúsico: começa em tempo fraco, com o primeiro compasso incompleto (anacruse). Acéfalo: o tempo forte é ocupado por pausa e a melodia entra depois dela."},
{f:13,a:6,t:"13.1",k:"ver",n:1,q:"Qual é o ritmo inicial do hino indicado? Em que tempo ou movimento ele começa?",g:"Conforme o hino. Exigir as duas respostas: o tipo e o tempo exato de entrada."},
{f:13,a:6,t:"13.1",k:"entender",n:3,q:"Olhando só o hinário, como confirmar que um hino é anacrúsico?",g:"O primeiro compasso está incompleto, e o último compasso do hino completa exatamente o valor que falta nele."},
{f:13,a:6,t:"13.1",k:"decidir",n:2,q:"O hino é anacrúsico. Onde a entrada é dada e em que momento você começa a tocar?",g:"O gesto preparatório cai no tempo anterior; o músico entra no tempo (ou movimento) em que a anacruse está escrita, e não no primeiro tempo forte."},
{f:13,a:6,t:"13.1",k:"ouvir",n:3,q:"O instrutor toca a entrada de três hinos. Diga, só de ouvido, qual é tético, qual é anacrúsico e qual é acéfalo.",g:"Conforme a execução. No anacrúsico o som chega antes do peso do compasso; no acéfalo há um silêncio exatamente onde o peso deveria estar."},

/* aula 7 — ritmos iniciais (continuação) */
{f:13,a:7,t:"13.1",k:"comparar",n:3,q:"Escolha um hino tético e um anacrúsico. Toque a entrada dos dois: o que muda na sua preparação?",g:"No tético, o arco ou o sopro parte junto com o gesto para baixo. No anacrúsico é preciso estar pronto um tempo antes, porque a entrada acontece antes do primeiro tempo forte."},
{f:13,a:7,t:"13.1",k:"tocar",n:2,q:"Procure no hinário um hino acéfalo e toque a entrada, contando em voz alta o tempo da pausa.",g:"Avaliar se a pausa foi contada inteira — encurtá-la é o erro típico."},
{f:13,a:7,t:"13.1",k:"decidir",n:2,q:"Num hino anacrúsico, como se comporta o último compasso?",g:"Ele completa o valor que faltava na anacruse, de modo que os dois somados formem um compasso inteiro."},
{f:13,a:7,t:"13.1",k:"criar",n:3,q:"Escreva três inícios de melodia em 4/4: um tético, um anacrúsico e um acéfalo.",g:"Conferir: no anacrúsico o primeiro compasso fica incompleto; no acéfalo o compasso está completo, mas começa com pausa."},

/* ---- FASE 14 ---- */
/* aula 8 — 14.1: notas pontuadas */
{f:14,a:8,t:"14.1",k:"ver",n:1,q:"Quanto vale o ponto de aumento?",g:"Metade do valor da figura que o precede."},
{f:14,a:8,t:"14.1",k:"ver",n:2,q:"Em 4/4, quanto vale semínima pontuada + colcheia?",g:"Dois tempos: 1½ + ½."},
{f:14,a:8,t:"14.1",k:"ver",n:2,q:"Em 4/4, quanto vale uma colcheia pontuada?",g:"Três quartos de tempo — meio tempo da colcheia mais um quarto do ponto."},
{f:14,a:8,t:"14.1",k:"erro",n:2,q:"Um aluno toca “semínima pontuada + colcheia” como se fosse “mínima + colcheia”. Qual o erro e como corrigi-lo?",g:"Ele alongou a pontuada: ela vale 1½ tempo, não 2. Corrige-se subdividindo o tempo em colcheias e contando 3 + 1."},
{f:14,a:8,t:"14.1",k:"entender",n:3,q:"Por que a figura pontuada se comporta de modo diferente no compasso simples e no composto?",g:"No compasso simples ela representa um tempo e meio; no composto ela é a própria unidade de tempo, valendo um tempo inteiro."},

/* aula 9 — notas pontuadas (continuação) */
{f:14,a:9,t:"14.1",k:"tocar",n:2,q:"Toque o trecho pontuado do hino indicado duas vezes: primeiro subdividindo em voz alta, depois no andamento.",g:"Avaliar se a colcheia curta ficou curta mesmo — o erro típico é encompridá-la e transformar o ritmo pontuado em tercina."},
{f:14,a:9,t:"14.1",k:"erro",n:2,q:"O aluno transformou “pontuada + colcheia” em tercina. Como isso soa e como se corrige?",g:"Soa balançado, em três partes iguais. Corrige-se subdividindo em quatro semicolcheias e contando 3 + 1."},
{f:14,a:9,t:"14.1",k:"ouvir",n:2,q:"O instrutor toca o mesmo compasso pontuado de duas formas: correta e como tercina. Diga qual é qual.",g:"Conforme a execução."},
{f:14,a:9,t:"14.1",k:"tocar",n:3,q:"Toque o trecho pontuado com o metrônomo marcando as colcheias, e depois marcando só os tempos.",g:"Avaliar se o ritmo se manteve quando a referência da subdivisão saiu."},

/* aula 10 — notas pontuadas (continuação) */
{f:14,a:10,t:"14.1",k:"tocar",n:3,q:"Apresente o hino indicado inteiro, com atenção aos ritmos pontuados.",g:"Exercício individual de apresentação."},
{f:14,a:10,t:"14.1",k:"comparar",n:3,q:"Compare um ritmo pontuado num hino lento e num hino rápido: em qual deles a colcheia curta tende a ser encompridada?",g:"No lento, porque há mais tempo para a nota longa “vazar” sobre a curta. No rápido o erro costuma ser o contrário: encurtar demais a longa."},
{f:14,a:10,t:"14.1",k:"decidir",n:3,q:"Por que o ritmo pontuado é um dos pontos em que a orquestra mais se desencontra?",g:"Porque cada músico alonga a colcheia curta de um jeito. A solução é todos subdividirem igual, contando as semicolcheias."},

/* ---- FASE 15 ---- */
/* aula 11 — 15.1 e 15.2: andamento e poco rallentando */
{f:15,a:11,t:"15.1",k:"ver",n:1,q:"Cite três indicações de andamento e classifique cada uma em lento, moderado ou rápido.",g:"Por exemplo: Adagio (lento), Andante ou Moderato (moderado), Allegro (rápido)."},
{f:15,a:11,t:"15.1",k:"ver",n:1,q:"Qual é o andamento do hino indicado — lento, moderado ou rápido — e qual a velocidade média marcada?",g:"Conforme o hino: classificar e ler a marcação metronômica escrita."},
{f:15,a:11,t:"15.2",k:"ver",n:1,q:"O que indica poco rallentando e onde ele costuma aparecer nos hinos?",g:"Retardar pouco a pouco. Costuma aparecer no final do hino ou no fecho de um período."},
{f:15,a:11,t:"15.2",k:"tocar",n:2,q:"Marque a lápis, no hino indicado, em que nota começa o poco rall. e toque desse ponto até o fim.",g:"Avaliar se o retardamento foi gradual e se começou na nota marcada, não antes."},

/* aula 12 — 15.3: modificação indevida de andamento */
{f:15,a:12,t:"15.3",k:"decidir",n:3,q:"O que é modificação indevida de andamento e onde ela costuma acontecer?",g:"É alterar o andamento onde a partitura não pede. Costuma acontecer acelerando nos trechos fáceis ou nas notas curtas, e arrastando nos trechos difíceis e nas notas longas."},
{f:15,a:12,t:"15.3",k:"entender",n:2,q:"Por que acelerar de leve num trecho fácil é um problema, mesmo que ninguém perceba na hora?",g:"Porque o conjunto se apoia num pulso comum: quem acelera puxa o naipe e o canto atrás, e o hino termina num andamento diferente daquele em que começou."},
{f:15,a:12,t:"15.3",k:"ouvir",n:2,q:"O instrutor toca o mesmo hino duas vezes, uma delas com aceleração indevida. Identifique qual e em que compasso ela começou.",g:"Conforme a execução. Pedir o compasso, não apenas “no meio”."},
{f:15,a:12,t:"15.3",k:"tocar",n:2,q:"Toque o hino indicado com metrônomo do começo ao fim e verifique se terminou no mesmo andamento em que começou.",g:"Avaliar em que ponto o aluno se afastou do clique — normalmente nos trechos de figuras curtas."},

/* ---- FASE 16 ---- */
/* aula 13 — 16.1 e 16.2: frases, semifrases e interpretação */
{f:16,a:13,t:"16.1",k:"ver",n:1,q:"O que é frase e o que é semifrase?",g:"Frase é a unidade musical com sentido completo; semifrase é cada uma das partes menores que a compõem."},
{f:16,a:13,t:"16.1",k:"entender",n:2,q:"Como localizar o fim de uma frase no hino?",g:"Pelo repouso da melodia, pelas respirações indicadas e pelo sentido do texto do hino — os três costumam coincidir."},
{f:16,a:13,t:"16.1",k:"criar",n:3,q:"Marque no hino indicado onde você respiraria, e justifique cada respiração pela frase e pelo texto.",g:"Avaliar se as respirações caem em fim de frase ou de semifrase, e não no meio de uma palavra ou de um desenho melódico."},
{f:16,a:13,t:"16.2",k:"entender",n:2,q:"O que significa dizer que um hino deve ser executado “com respeito”? Cite duas coisas concretas que mudam na sua execução.",g:"Resposta aberta. Espera-se: andamento estável, som sustentado e sem exageros, ataque suave e atenção ao conjunto em vez de destaque individual."},
{f:16,a:13,t:"16.2",k:"decidir",n:3,q:"No ensaio, o seu naipe está afinado entre si mas soa destacado do resto da orquestra. O que você verifica primeiro?",g:"Intensidade e ataque: normalmente o naipe está tocando mais forte ou entrando com ataque mais duro que o conjunto. Depois, conferir se a oitava executada é a correta para o instrumento."},

/* aula 14 — 16.3: indicações interpretativas */
{f:16,a:14,t:"16.3",k:"ver",n:1,q:"O que determinam as indicações “com grandiosidade e bem marcado” e “bem legato e suave”?",g:"A primeira pede som amplo, ataque nítido e separação entre as notas. A segunda pede notas ligadas, sem reataque perceptível, e intensidade contida."},
{f:16,a:14,t:"16.3",k:"decidir",n:3,v:1,q:"O hino traz “bem legato”. O que muda na sua arcada?",g:"Mais notas dentro da mesma arcada onde houver ligadura, trocas de arco disfarçadas (sem acento na virada) e velocidade de arco constante ao longo da frase."},
{f:16,a:14,t:"16.3",k:"comparar",n:3,q:"Tome dois hinos no mesmo tom e na mesma fórmula de compasso, mas com indicações interpretativas diferentes. O que muda na execução?",g:"Avaliar se o aluno cita elementos concretos: ataque, ligadura, intensidade, condução da frase e andamento — e não apenas “um é mais alegre”."},

/* aula 15 — indicações interpretativas (continuação) */
{f:16,a:15,t:"16.3",k:"tocar",n:3,q:"Toque o hino indicado seguindo todas as indicações interpretativas escritas, e explique cada escolha que fez.",g:"Exercício individual de apresentação. Avaliar se cada escolha tem apoio no que está escrito."},
{f:16,a:15,t:"16.3",k:"criar",n:3,q:"Escreva, com suas palavras, uma indicação interpretativa para um hino que você toca, e justifique-a pela letra e pela melodia.",g:"Resposta aberta. Serve para o candidato perceber que a indicação nasce do sentido do hino, e não de gosto pessoal."},
{f:16,a:15,t:"16.2",k:"decidir",n:3,q:"Ao fim do 4º período, o que você leva do MSA para o ensaio que não levava antes?",g:"Resposta aberta — fecha o curso e serve de registro para o instrutor."},
];
