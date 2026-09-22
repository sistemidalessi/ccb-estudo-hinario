/* ---------------- banco ---------------- */
/* f=fase  t=tópico  k=tipo  n=nível(1-3)  q=enunciado  g=gabarito  v=específico de violino */
const Q = [
/* ---- FASE 1 ---- */
{f:1,t:"1.1–1.3",k:"ver",n:1,q:"Quais são as quatro propriedades do som?",g:"Altura, duração, intensidade e timbre."},
{f:1,t:"1.1–1.3",k:"entender",n:2,q:"Duas pessoas tocam a mesma nota, com a mesma duração e a mesma intensidade — uma no violino, outra no clarinete. Qual propriedade do som permite distinguir as duas?",g:"O timbre."},
{f:1,t:"1.1–1.3",k:"entender",n:2,q:"Quando o encarregado pede “mais suave”, que propriedade do som ele está pedindo para mudar? E quando pede “mais agudo”?",g:"“Mais suave” muda a intensidade; “mais agudo” muda a altura."},
{f:1,t:"1.1–1.3",k:"decidir",n:3,q:"No ensaio o naipe toca as mesmas notas, com as mesmas durações, mas o conjunto soa desigual. Que propriedade do som provavelmente não está igual entre os músicos?",g:"A intensidade — cada um tocando com volume diferente. (Se o desconforto for de afinação, aí o problema é de altura.)"},
{f:1,t:"1.4",k:"ver",n:1,q:"Escreva as sete notas musicais em ordem ascendente a partir do Fá.",g:"Fá, Sol, Lá, Si, Dó, Ré, Mi."},
{f:1,t:"1.4",k:"tocar",n:1,v:1,q:"Toque as quatro cordas soltas do violino, da mais grave para a mais aguda, e diga o nome de cada uma.",g:"Sol, Ré, Lá, Mi — de quinta em quinta."},
{f:1,t:"1.5",k:"ver",n:1,q:"Quantas linhas e quantos espaços tem o pentagrama, e em que sentido são contados?",g:"Cinco linhas e quatro espaços, contados sempre de baixo para cima."},
{f:1,t:"1.5",k:"entender",n:2,q:"O que é uma linha suplementar e para que ela serve?",g:"É uma linha curta acrescentada acima ou abaixo do pentagrama, para escrever notas que não cabem nas cinco linhas."},
{f:1,t:"1.6",k:"ver",n:1,q:"Que clave está escrita na sua parte? E na do violoncelo?",g:"Violino, flauta, clarinete e trompete: clave de Sol (2ª linha). Violoncelo, trombone, fagote e tuba: clave de Fá (4ª linha)."},
{f:1,t:"1.6",k:"entender",n:3,q:"Por que a viola usa clave de Dó na 3ª linha em vez da clave de Sol?",g:"Porque a região média da viola cairia cheia de linhas suplementares na clave de Sol. A clave de Dó na 3ª linha centraliza a tessitura dela dentro do pentagrama."},
{f:1,t:"1.6",k:"comparar",n:2,q:"Abra o hinário no hino indicado: que clave está na voz do soprano e qual está na do baixo? Justifique a diferença.",g:"Soprano em clave de Sol e baixo em clave de Fá, porque cada clave serve à região (aguda ou grave) da voz correspondente."},

/* ---- FASE 2 ---- */
{f:2,t:"2.1",k:"ver",n:1,q:"Escreva as figuras da semibreve à semicolcheia e o valor de cada uma em relação à semibreve.",g:"Semibreve (1), mínima (1/2), semínima (1/4), colcheia (1/8), semicolcheia (1/16)."},
{f:2,t:"2.1",k:"ver",n:1,q:"Quantas colcheias cabem em uma mínima? E quantas semicolcheias em uma semínima?",g:"Quatro colcheias; quatro semicolcheias."},
{f:2,t:"2.1",k:"erro",n:3,q:"Um aluno afirma que “a semínima vale sempre 1 tempo”. Em que casos isso é falso?",g:"Sempre que a unidade de tempo não for a semínima: em 6/8 a unidade de tempo é a semínima pontuada e a semínima vale 2/3 de tempo; em 2/2 a unidade é a mínima e a semínima vale meio tempo."},
{f:2,t:"2.2–2.3",k:"ver",n:1,q:"Para que serve a barra de compasso?",g:"Para dividir a pauta em compassos, delimitando grupos regulares de tempos."},
{f:2,t:"2.2–2.3",k:"ver",n:1,q:"Qual a diferença entre barra dupla e barra final?",g:"A barra dupla (duas barras finas) marca uma mudança — de seção, de armadura, de fórmula de compasso — sem encerrar. A barra final (uma fina e uma grossa) encerra o hino."},
{f:2,t:"2.2–2.3",k:"decidir",n:2,q:"No hino indicado há uma barra dupla no meio da peça. O que ela está avisando? Confira o que muda depois dela.",g:"Que começa uma nova seção ou que algo mudou: armadura, fórmula de compasso ou andamento. O aluno deve apontar o que efetivamente mudou naquele hino."},
{f:2,t:"2.4",k:"ver",n:1,q:"Em 4/4, o que indica o número de cima e o que indica o número de baixo?",g:"O de cima, quantos tempos há em cada compasso (4). O de baixo, a figura que preenche um tempo (4 = semínima)."},
{f:2,t:"2.4",k:"ver",n:1,q:"Em 4/4: qual é a unidade de tempo e qual é a unidade de compasso?",g:"Unidade de tempo: semínima. Unidade de compasso: semibreve."},
{f:2,t:"2.4",k:"ver",n:1,q:"Marque a acentuação métrica do compasso 4/4.",g:"1º forte · 2º fraco · 3º meio-forte · 4º fraco."},
{f:2,t:"2.4",k:"erro",n:2,q:"Um compasso 4/4 foi escrito com: mínima + semínima + colcheia. Está correto? Se não, o que falta ou sobra?",g:"Está errado: 2 + 1 + ½ = 3½ tempos. Falta meio tempo, ou seja, uma colcheia."},
{f:2,t:"2.4",k:"erro",n:2,q:"Um compasso 4/4 foi escrito com: semibreve + semínima. Onde está o erro?",g:"Sobra um tempo — a semibreve sozinha já preenche os quatro tempos do compasso."},
{f:2,t:"2.4",k:"criar",n:3,q:"Escreva três compassos diferentes em 4/4, cada um usando pelo menos uma pausa, todos com a soma correta.",g:"Conferir a soma de cada compasso: tem de dar exatamente 4 tempos, contando as pausas."},
{f:2,t:"2.5–2.6",k:"entender",n:2,q:"Qual a diferença entre pulso e ritmo?",g:"O pulso é a batida regular e constante que sustenta a música; o ritmo é a organização das durações sobre esse pulso."},
{f:2,t:"2.5–2.6",k:"tocar",n:1,q:"Marque o pulso com o pé e faça a linguagem rítmica dos dois primeiros compassos do hino indicado.",g:"Avaliar se o pulso permaneceu constante do primeiro ao último compasso — e não se acelerou nas figuras curtas."},
{f:2,t:"2.5–2.6",k:"ouvir",n:2,q:"O instrutor bate palmas apenas o ritmo dos quatro primeiros compassos de um hino já estudado. Descubra qual é.",g:"Conforme o hino escolhido pelo instrutor. Vale pedir a justificativa: o que no ritmo entregou o hino."},

/* ---- FASE 3 ---- */
{f:3,t:"3.1",k:"ver",n:1,q:"O que é o endecagrama?",g:"A união das pautas de clave de Sol e de clave de Fá por uma linha suplementar central, formando onze linhas."},
{f:3,t:"3.1",k:"entender",n:2,q:"No endecagrama, que nota ocupa a linha suplementar do meio? Por que ela é a referência entre as duas claves?",g:"O Dó central. É a nota que fecha a pauta de baixo e abre a de cima, servindo de ponte entre as duas claves."},
{f:3,t:"3.2",k:"entender",n:2,q:"Qual a diferença entre leitura rítmica, leitura métrica e solfejo?",g:"Leitura rítmica: só as durações. Leitura métrica: os nomes das notas no ritmo certo, marcando o compasso, sem entoar. Solfejo: cantar as notas, com afinação."},
{f:3,t:"3.2",k:"tocar",n:2,q:"Faça a leitura métrica do primeiro sistema do hino indicado, marcando os movimentos do compasso.",g:"Avaliar clareza dos nomes das notas, constância do pulso e coincidência do gesto com o tempo forte."},
{f:3,t:"3.3–3.4",k:"ver",n:1,q:"Descreva o movimento de condução em 4.",g:"1º para baixo, 2º para dentro, 3º para fora, 4º para cima."},
{f:3,t:"3.3–3.4",k:"entender",n:2,q:"Em qualquer fórmula de compasso, para onde vai sempre o gesto do primeiro tempo? Por quê?",g:"Sempre para baixo, porque o 1º tempo é o forte — é a referência visual de onde o compasso começa."},
{f:3,t:"3.5",k:"ver",n:1,q:"O que significa a marcação ♩ = 72?",g:"Que a semínima é a unidade de tempo e que se executam 72 semínimas por minuto."},
{f:3,t:"3.5",k:"comparar",n:2,q:"Dois hinos trazem ♩ = 60 e ♩ = 92. Qual é o mais lento? Quanto tempo dura um compasso 4/4 em cada um?",g:"O de ♩=60 é mais lento. Em ♩=60 o compasso 4/4 dura 4 segundos; em ♩=92, cerca de 2,6 segundos."},
{f:3,t:"3.5",k:"decidir",n:3,q:"O hino está marcado ♩=88, mas a congregação canta bem mais devagar. O que a marcação significa nesse caso?",g:"A marcação é a referência de andamento escrita na partitura; no culto quem determina a execução é a condução do encarregado. Saber a marcação serve para estudar em casa no andamento certo."},

/* ---- FASE 4 ---- */
{f:4,t:"4.1",k:"ver",n:1,q:"Quais são os tipos de ligadura e o que cada um indica?",g:"De valor: une notas de mesma altura, somando as durações. De frase (expressão): delimita o fraseado. De portamento/legato: liga notas de alturas diferentes, executadas sem interrupção."},
{f:4,t:"4.1",k:"erro",n:2,q:"Uma ligadura une um Lá e um Dó. Pode ser ligadura de valor? Justifique.",g:"Não. Ligadura de valor só une notas de mesma altura. Nesse caso é ligadura de expressão ou de portamento/legato."},
{f:4,t:"4.1",k:"tocar",n:2,v:1,q:"Localize no hino indicado uma ligadura de frase e uma de valor. Toque as duas — o que muda na sua arcada em cada caso?",g:"Na ligadura de valor não se reataca a nota: sustenta-se pelo tempo somado. Na de frase, as notas tocam na mesma arcada, sem cortar o som entre elas."},
{f:4,t:"4.2",k:"ver",n:1,q:"O que o ponto de aumento faz com a figura?",g:"Aumenta metade do valor dela."},
{f:4,t:"4.2",k:"ver",n:2,q:"Em 4/4, quanto vale uma semínima pontuada? E uma mínima pontuada?",g:"Semínima pontuada: 1½ tempo. Mínima pontuada: 3 tempos."},
{f:4,t:"4.2",k:"entender",n:3,q:"Por que o segundo ponto de aumento vale menos que o primeiro?",g:"Porque cada ponto acrescenta metade do valor do ponto anterior, e não metade da figura original."},
{f:4,t:"4.3",k:"ver",n:1,q:"O que é intervalo?",g:"A distância de altura entre duas notas."},
{f:4,t:"4.3",k:"tocar",n:2,v:1,q:"Toque Sol e Si na corda Sol: que intervalo é esse? Agora toque as cordas Sol e Ré soltas — que intervalo formam?",g:"Sol–Si é uma terça (maior). Sol–Ré é uma quinta (justa) — é sempre o intervalo entre duas cordas vizinhas do violino."},
{f:4,t:"4.4–4.5",k:"ver",n:1,q:"Em 3/4: quantos tempos, qual a unidade de tempo e qual a unidade de compasso?",g:"Três tempos; unidade de tempo semínima; unidade de compasso mínima pontuada."},
{f:4,t:"4.4–4.5",k:"ver",n:1,q:"Qual a acentuação métrica do compasso 3/4?",g:"1º forte · 2º fraco · 3º fraco."},
{f:4,t:"4.6–4.7",k:"ver",n:1,q:"Em 2/4: acentuação métrica, unidade de tempo e unidade de compasso.",g:"1º forte, 2º fraco; unidade de tempo semínima; unidade de compasso mínima."},
{f:4,t:"4.6–4.7",k:"comparar",n:3,q:"Procure no hinário um hino em 2/4 e outro em 3/4. Toque o primeiro sistema de cada um: o que muda na sensação de condução?",g:"Em 2/4 o ciclo forte–fraco é curto e marcial; em 3/4 há dois tempos fracos depois do forte, o que dá sensação de balanço mais largo."},

/* ---- FASE 5 ---- */
{f:5,t:"5.1",k:"ver",n:1,q:"O que é uma tercina?",g:"Uma quiáltera de três notas executadas no valor de duas figuras iguais."},
{f:5,t:"5.1",k:"erro",n:2,q:"Em 4/4, um aluno tocou uma tercina de colcheias ocupando dois tempos. Qual o erro?",g:"A tercina de colcheias ocupa o valor de duas colcheias, ou seja, um tempo — não dois."},
{f:5,t:"5.1",k:"tocar",n:2,q:"Fale a tercina em voz alta três vezes seguidas, mantendo o pé no pulso, e depois toque-a no hino indicado.",g:"Avaliar se as três notas ficaram iguais entre si e se couberam exatamente dentro de um tempo."},
{f:5,t:"5.2",k:"ver",n:1,q:"Qual a diferença entre fermata suspensiva e fermata conclusiva?",g:"Suspensiva: prolongamento leve, a música continua depois. Conclusiva: prolongamento mais acentuado, com terminação gradual, no final do hino ou da seção."},
{f:5,t:"5.2",k:"decidir",n:2,q:"Há fermata no fim do primeiro período do hino. Quem decide quanto tempo ela dura, e o que você faz enquanto isso?",g:"Quem decide é a condução. O músico sustenta o som firme e afinado até o gesto de saída, sem antecipar nem deixar cair a intensidade."},
{f:5,t:"5.3–5.5",k:"ver",n:1,q:"Em 6/8: quantos movimentos, quantos tempos, e quais são a unidade de movimento, a unidade de tempo e a unidade de compasso?",g:"Seis movimentos e dois tempos. Unidade de movimento: colcheia. Unidade de tempo: semínima pontuada. Unidade de compasso: mínima pontuada."},
{f:5,t:"5.3–5.5",k:"ver",n:2,q:"Marque a acentuação métrica do 6/8 nos seis movimentos.",g:"1º forte · 4º meio-forte · os demais fracos."},
{f:5,t:"5.3–5.5",k:"entender",n:3,q:"Por que em 6/8 a unidade de tempo é uma figura pontuada?",g:"Porque cada tempo se divide em três colcheias, e só uma figura pontuada representa uma divisão ternária."},

/* ---- FASE 6 ---- */
{f:6,t:"6.1",k:"ver",n:1,q:"Onde estão os semitons naturais da escala de Dó maior?",g:"Entre Mi e Fá, e entre Si e Dó."},
{f:6,t:"6.1",k:"entender",n:2,q:"Qual a diferença entre tom e semitom? Dê um exemplo de cada no hino indicado.",g:"O semitom é a menor distância entre duas notas do sistema; o tom equivale a dois semitons. Exemplos conforme o hino."},
{f:6,t:"6.2",k:"ver",n:1,q:"Qual é o efeito do sustenido, do bemol e do bequadro?",g:"Sustenido eleva a nota meio tom; bemol abaixa meio tom; bequadro cancela o acidente anterior, voltando a nota ao estado natural."},
{f:6,t:"6.3–6.4",k:"ver",n:1,q:"Qual é a fórmula da escala maior, em tons e semitons?",g:"T – T – S – T – T – T – S."},
{f:6,t:"6.3–6.4",k:"comparar",n:2,q:"Qual a diferença entre escala diatônica e escala cromática?",g:"A diatônica tem sete notas de nomes diferentes, com tons e semitons alternados conforme a fórmula. A cromática tem doze, todas distantes de meio tom."},
{f:6,t:"6.5–6.7",k:"ver",n:2,q:"Diga a ordem dos sustenidos e a ordem dos bemóis.",g:"Sustenidos: Fá, Dó, Sol, Ré, Lá, Mi, Si. Bemóis: a ordem inversa — Si, Mi, Lá, Ré, Sol, Dó, Fá."},
{f:6,t:"6.5–6.7",k:"tocar",n:2,v:1,q:"Toque a escala de Ré maior em duas oitavas e diga quais são os dois sustenidos e em que dedos eles caem.",g:"Fá♯ e Dó♯. Conferir a afinação dos dois: são os que costumam ficar baixos."},
{f:6,t:"6.5–6.7",k:"criar",n:3,q:"Escreva a escala de Si bemol maior e marque onde caem os semitons.",g:"Si♭ Dó Ré Mi♭ Fá Sol Lá Si♭ — semitons entre Ré–Mi♭ e entre Lá–Si♭."},
{f:6,t:"6.5–6.7",k:"entender",n:3,v:1,q:"Por que Sol, Ré, Lá e Mi maior soam mais ressonantes no violino do que Lá bemol ou Ré bemol maior?",g:"Porque suas tônicas e dominantes coincidem com as cordas soltas, que vibram por simpatia e reforçam o som. Nas tonalidades com muitos bemóis isso não acontece, e a afinação exige mais atenção do ouvido."},

/* ---- FASE 7 ---- */
{f:7,t:"7.1",k:"ver",n:1,q:"O que é a armadura de clave e onde ela fica escrita?",g:"É o conjunto de acidentes fixos, escrito logo depois da clave, no início de cada pauta; vale para o hino inteiro."},
{f:7,t:"7.1",k:"ver",n:1,q:"Quais são os acidentes fixos do hino indicado, em ordem?",g:"Conforme o hino — conferir se o aluno os disse na ordem correta da armadura, e não na ordem em que aparecem na melodia."},
{f:7,t:"7.1",k:"erro",n:2,q:"Um aluno tocou o Fá natural no meio do hino, mesmo havendo Fá♯ na armadura, e disse que “não tinha sustenido escrito naquela nota”. Onde está o engano?",g:"O acidente da armadura vale para todos os Fá do hino, em qualquer oitava, sem precisar ser reescrito. Só um bequadro cancelaria."},
{f:7,t:"7.2–7.4",k:"ver",n:2,q:"Em 9/8: quantos movimentos, quantos tempos, e quais são a unidade de movimento e a unidade de tempo?",g:"Nove movimentos e três tempos; unidade de movimento colcheia; unidade de tempo semínima pontuada."},
{f:7,t:"7.2–7.4",k:"entender",n:3,q:"Em 9/8 a unidade de compasso é indefinida. Por quê?",g:"Porque nove colcheias não correspondem a nenhuma figura única: mínima pontuada dá seis e semibreve pontuada dá doze. Não existe figura que preencha o compasso sozinha."},
{f:7,t:"7.5–7.7",k:"ver",n:2,q:"Em 12/8: quantos movimentos, quantos tempos, unidade de tempo e unidade de compasso?",g:"Doze movimentos e quatro tempos; unidade de tempo semínima pontuada; unidade de compasso semibreve pontuada."},
{f:7,t:"7.5–7.7",k:"comparar",n:3,q:"12/8 e 4/4 têm os dois quatro tempos. O que realmente os diferencia?",g:"A divisão do tempo: em 4/4 cada tempo se divide em dois (compasso simples); em 12/8, em três (compasso composto)."},

/* ---- FASE 8 ---- */
{f:8,t:"8.1",k:"ver",n:1,q:"Uma armadura com dois sustenidos corresponde a que tonalidade maior? E qual a relativa menor?",g:"Ré maior; relativa menor, Si menor."},
{f:8,t:"8.1",k:"entender",n:2,q:"Qual a regra prática para achar a tonalidade maior numa armadura de sustenidos? E numa de bemóis?",g:"Sustenidos: meio tom acima do último sustenido. Bemóis: o penúltimo bemol é a tônica — com um bemol só, Fá maior."},
{f:8,t:"8.1",k:"decidir",n:3,q:"A armadura tem três bemóis. Como decidir se o hino está em Mi bemol maior ou em Dó menor?",g:"Pela nota e pelo acorde final, e pela presença da sensível da menor (Si natural) ao longo do hino."},
{f:8,t:"8.1",k:"ver",n:1,q:"Preencha, para o hino indicado: tonalidade escrita e tonalidade de execução.",g:"Escrita é a que está no hinário. Execução é a que soa no seu instrumento: no violino, na flauta e no violoncelo são iguais; no clarinete em Si♭, no sax alto em Mi♭ e no trompete em Si♭, não."},
{f:8,t:"8.1",k:"entender",n:3,q:"Por que o clarinete lê uma nota e soa outra, e o violino não?",g:"Porque o clarinete é instrumento transpositor: o Dó que ele lê soa Si♭. O violino é instrumento em Dó — lê e soa a mesma nota."},
{f:8,t:"8.2",k:"ver",n:1,q:"O que é acidente ocorrente e até onde ele vale?",g:"É o acidente escrito no meio da música, antes de uma nota. Vale até o fim do compasso em que aparece, para as notas de mesmo nome e mesma altura."},
{f:8,t:"8.2",k:"ver",n:1,q:"O que é acidente de precaução?",g:"Um acidente que não altera nada: é escrito só para lembrar ao executante a altura correta e evitar o erro."},
{f:8,t:"8.2",k:"erro",n:3,q:"No hino, um Si bemol ocorrente aparece no segundo tempo de um compasso. O aluno tocou Si natural no quarto tempo do mesmo compasso. Está certo?",g:"Não. O acidente ocorrente vale até o fim daquele compasso: o Si do quarto tempo também é bemol, a não ser que haja bequadro escrito."},

/* ---- FASE 9 ---- */
{f:9,t:"9.1",k:"ver",n:1,q:"O que é ritornelo e o que ele manda fazer?",g:"É a barra de repetição: manda repetir o trecho compreendido entre as barras de repetição (ou desde o início, se não houver a de abertura)."},
{f:9,t:"9.1",k:"ver",n:1,q:"O que indicam as casas 1 e 2?",g:"Finais diferentes para o mesmo trecho: a casa 1 na primeira vez, a casa 2 na repetição, pulando a casa 1."},
{f:9,t:"9.1",k:"decidir",n:2,q:"O encarregado pede: “do compasso 9, com a repetição, casa 2”. Onde você começa e por onde passa?",g:"Começa no compasso 9, toca até a casa 1, volta ao ritornelo e, na segunda vez, pula a casa 1 e toca a casa 2."},
{f:9,t:"9.1",k:"ver",n:2,q:"O que significam D.C. e D.S.? E o que é “ao Fine”?",g:"D.C. (Da Capo): voltar ao início. D.S. (Dal Segno): voltar ao sinal 𝄋. “ao Fine”: tocar até onde estiver escrito Fine, e encerrar ali."},
{f:9,t:"9.1",k:"tocar",n:2,q:"Percorra o hino indicado em voz alta, dizendo apenas os números dos compassos na ordem em que serão tocados, respeitando repetições e casas.",g:"Avaliar se o percurso está correto do primeiro ao último compasso — este exercício revela o erro antes que ele apareça no ensaio."},

/* ---- FASE 10 ---- */
{f:10,t:"10.1",k:"ver",n:1,q:"Coloque em ordem crescente de intensidade: mf, pp, f, p, ff, mp.",g:"pp · p · mp · mf · f · ff."},
{f:10,t:"10.1",k:"entender",n:2,q:"Qual a diferença entre f e crescendo?",g:"f é um nível de intensidade, fixo. Crescendo é o aumento gradual de intensidade até chegar a outro nível."},
{f:10,t:"10.1",k:"decidir",n:2,v:1,q:"O hino pede p num trecho agudo. O que muda no seu arco?",g:"Menos peso do braço, arco mais lento e ponto de contato mais próximo da escala — mantendo o som apoiado, sem deixar a nota “soprar”."},
{f:10,t:"10.1",k:"decidir",n:2,q:"Nas retomadas, depois da respiração, o som volta forte ou fraco? Por quê?",g:"Fraco. A retomada depois da respiração não recebe acento — quem recebe acento é o tempo forte do compasso, não a entrada do fôlego."},
{f:10,t:"10.1",k:"ouvir",n:3,q:"O instrutor toca a mesma frase duas vezes: uma com crescendo e outra em intensidade fixa. Diga qual é qual e onde o crescendo começou.",g:"Conforme a execução. O aluno deve identificar o ponto de partida do crescendo, não só notar que houve."},

/* ---- FASE 11 ---- */
{f:11,t:"11.1",k:"entender",n:2,q:"O que é acento métrico e por que ele não precisa estar escrito na partitura?",g:"É a alternância natural de tempos fortes e fracos determinada pela fórmula de compasso. Não se escreve porque decorre da própria métrica."},
{f:11,t:"11.2–11.3",k:"entender",n:2,q:"Qual a diferença entre compasso simples e compasso composto?",g:"No simples, a unidade de tempo é figura simples e cada tempo se divide em dois. No composto, a unidade de tempo é figura pontuada e cada tempo se divide em três."},
{f:11,t:"11.2–11.3",k:"ver",n:2,q:"Classifique cada um em binário, ternário ou quaternário, e em simples ou composto: 2/4, 3/4, 4/4, 6/8, 9/8, 12/8.",g:"2/4 binário simples · 3/4 ternário simples · 4/4 quaternário simples · 6/8 binário composto · 9/8 ternário composto · 12/8 quaternário composto."},
{f:11,t:"11.4",k:"ver",n:2,q:"O que é compasso alternado?",g:"É quando a fórmula de compasso muda no decorrer da música, alternando entre fórmulas diferentes."},
{f:11,t:"11.4",k:"decidir",n:3,q:"O hino muda de 4/4 para 3/4 no meio. O que você confere antes de tocar?",g:"Onde está a barra dupla da mudança, se a unidade de tempo continua sendo a semínima (o pulso não muda) e como fica a condução no compasso da virada."},

/* ---- FASE 12 ---- */
{f:12,t:"12.1–12.2",k:"entender",n:2,q:"Qual a diferença entre síncopa e contratempo?",g:"Na síncopa, o som começa em parte fraca e se prolonga sobre a parte forte seguinte. No contratempo, a parte forte é ocupada por pausa e o som entra depois, sem prolongar-se sobre ela."},
{f:12,t:"12.1–12.2",k:"erro",n:3,q:"Um aluno diz que “toda nota fora do tempo forte é síncopa”. Corrija.",g:"Só é síncopa se a nota iniciada na parte fraca atravessar a parte forte seguinte. Se houver pausa no forte e o som entrar depois, é contratempo — e há ainda notas fracas que não são nem uma coisa nem outra."},
{f:12,t:"12.1–12.2",k:"tocar",n:2,q:"Localize no hino indicado uma síncopa e toque só aquele compasso, marcando o pulso com o pé.",g:"Avaliar se o pé continuou marcando o tempo forte enquanto o som o atravessava — é aí que o aluno costuma perder o compasso."},
{f:12,t:"12.1–12.2",k:"ouvir",n:3,q:"O instrutor toca dois compassos: um com síncopa e um com contratempo. Diga qual é cada um.",g:"Conforme a execução. Pedir que o aluno explique o que ouviu: se houve silêncio no tempo forte (contratempo) ou som atravessando-o (síncopa)."},

/* ---- FASE 13 ---- */
{f:13,t:"13.1",k:"ver",n:1,q:"Quais são os três ritmos iniciais e como se define cada um?",g:"Tético: começa no tempo forte, compasso completo. Anacrúsico: começa em tempo fraco, com o primeiro compasso incompleto (anacruse). Acéfalo: o tempo forte é ocupado por pausa e a melodia entra depois dela."},
{f:13,t:"13.1",k:"ver",n:1,q:"Qual é o ritmo inicial do hino indicado? Em que tempo ou movimento ele começa?",g:"Conforme o hino. Exigir as duas respostas: o tipo e o tempo exato de entrada."},
{f:13,t:"13.1",k:"entender",n:3,q:"Olhando só o hinário, como confirmar que um hino é anacrúsico?",g:"O primeiro compasso está incompleto, e o último compasso do hino completa exatamente o valor que falta nele."},
{f:13,t:"13.1",k:"decidir",n:2,q:"O hino é anacrúsico. Onde a entrada é dada e em que momento você começa a tocar?",g:"O gesto preparatório cai no tempo anterior; o músico entra no tempo (ou movimento) em que a anacruse está escrita, não no primeiro tempo forte."},
{f:13,t:"13.1",k:"comparar",n:3,q:"Escolha um hino tético e um anacrúsico. Toque a entrada dos dois: o que muda na sua preparação?",g:"No tético, o arco/sopro parte junto com o gesto para baixo. No anacrúsico é preciso estar pronto um tempo antes, porque a entrada acontece antes do primeiro tempo forte."},

/* ---- FASE 14 ---- */
{f:14,t:"14.1",k:"ver",n:2,q:"Em 4/4, quanto vale semínima pontuada + colcheia?",g:"Dois tempos: 1½ + ½."},
{f:14,t:"14.1",k:"erro",n:2,q:"Um aluno toca “semínima pontuada + colcheia” como se fosse “mínima + colcheia”. Qual o erro e como corrigi-lo?",g:"Ele alongou a pontuada: ela vale 1½ tempo, não 2. Corrige-se subdividindo o tempo em colcheias e contando 3 + 1."},
{f:14,t:"14.1",k:"entender",n:3,q:"Por que a figura pontuada se comporta de modo diferente no compasso simples e no composto?",g:"No compasso simples ela representa um tempo e meio; no composto ela é a própria unidade de tempo, valendo um tempo inteiro."},
{f:14,t:"14.1",k:"tocar",n:2,q:"Toque o trecho pontuado do hino indicado duas vezes: primeiro subdividindo em voz alta, depois no andamento.",g:"Avaliar se a colcheia curta ficou curta mesmo — o erro típico é encompridá-la e transformar o ritmo pontuado em tercina."},

/* ---- FASE 15 ---- */
{f:15,t:"15.1",k:"ver",n:1,q:"Cite três indicações de andamento e classifique cada uma em lento, moderado ou rápido.",g:"Por exemplo: Adagio (lento), Andante ou Moderato (moderado), Allegro (rápido)."},
{f:15,t:"15.1",k:"ver",n:1,q:"Qual é o andamento do hino indicado — lento, moderado ou rápido — e qual a velocidade média marcada?",g:"Conforme o hino: classificar e ler a marcação metronômica escrita."},
{f:15,t:"15.2",k:"ver",n:1,q:"O que indica poco rallentando e onde ele costuma aparecer nos hinos?",g:"Retardar pouco a pouco. Costuma aparecer no final do hino ou no fecho de um período."},
{f:15,t:"15.2",k:"tocar",n:2,q:"Marque com lápis, no hino indicado, exatamente em que nota começa o poco rall. e toque desse ponto até o fim.",g:"Avaliar se o retardamento foi gradual e coletivo — e se começou na nota marcada, não antes."},
{f:15,t:"15.3",k:"decidir",n:3,q:"O que é modificação indevida de andamento e onde ela costuma acontecer?",g:"É alterar o andamento onde a partitura não pede. Costuma acontecer acelerando nos trechos fáceis ou nas notas curtas, e arrastando nos trechos difíceis e nas notas longas."},
{f:15,t:"15.3",k:"ouvir",n:2,q:"O instrutor toca o mesmo hino duas vezes, uma delas com aceleração indevida. Identifique qual e em que ponto ela começou.",g:"Conforme a execução. Pedir que o aluno aponte o compasso, não apenas “no meio”."},

/* ---- FASE 16 ---- */
{f:16,t:"16.1",k:"ver",n:1,q:"O que é frase e o que é semifrase?",g:"Frase é a unidade musical com sentido completo; semifrase é cada uma das partes menores que a compõem."},
{f:16,t:"16.1",k:"entender",n:2,q:"Como localizar o fim de uma frase no hino?",g:"Pelo repouso da melodia, pelas respirações indicadas e pelo sentido do texto do hino — os três costumam coincidir."},
{f:16,t:"16.1",k:"criar",n:3,q:"Marque no hino indicado onde você respiraria, e justifique cada respiração pela frase e pelo texto.",g:"Avaliar se as respirações caem em fim de frase ou semifrase, e não no meio de uma palavra ou de um desenho melódico."},
{f:16,t:"16.2",k:"entender",n:2,q:"O que significa dizer que um hino deve ser executado “com respeito”? Cite duas coisas concretas que mudam na sua execução.",g:"Resposta aberta. Espera-se: andamento estável, som sustentado e sem exageros, ataque suave, atenção ao conjunto em vez de destaque individual."},
{f:16,t:"16.3",k:"ver",n:1,q:"O que determinam as indicações “com grandiosidade e bem marcado” e “bem legato e suave”?",g:"A primeira pede som amplo, ataque nítido e separação entre as notas. A segunda pede notas ligadas, sem reataque perceptível, e intensidade contida."},
{f:16,t:"16.3",k:"decidir",n:3,v:1,q:"O hino traz “bem legato”. O que muda na sua arcada?",g:"Mais notas dentro da mesma arcada onde houver ligadura, trocas de arco disfarçadas (sem acento na virada) e velocidade de arco constante ao longo da frase."},
{f:16,t:"16.3",k:"comparar",n:3,q:"Tome dois hinos no mesmo tom e na mesma fórmula de compasso, mas com indicações interpretativas diferentes. O que muda na execução?",g:"Avaliar se o aluno cita elementos concretos: ataque, ligadura, intensidade, condução da frase e andamento — e não apenas “um é mais alegre”."},

/* ---- transversais: instrumento e conjunto ---- */
{f:8,t:"8.1",k:"ver",n:2,v:1,q:"Segundo o Programa Mínimo, que voz do hinário o violino executa, e em que oitava, para os cultos oficiais?",g:"A voz do soprano, uma oitava acima do escrito. Nas Reuniões de Jovens e Menores, hinos 431 a 480 com soprano no natural; para a oficialização, hinário completo com soprano uma oitava acima e contralto no natural."},
{f:16,t:"16.2",k:"decidir",n:3,q:"No ensaio, o seu naipe está afinado entre si mas soa destacado do resto da orquestra. O que você verifica primeiro?",g:"Intensidade e ataque: normalmente o naipe está tocando mais forte ou entrando com ataque mais duro que o conjunto. Depois, conferir se a oitava executada é a correta para o instrumento."},
{f:3,t:"3.2",k:"criar",n:3,q:"Escolha um hino que você já toca e escreva três perguntas sobre ele para um colega — uma de identificar, uma de explicar e uma para tocar.",g:"Quem formula a pergunta precisa conhecer a resposta: este exercício mostra ao instrutor o que o aluno realmente domina."},
{f:13,t:"13.1",k:"ouvir",n:3,q:"O instrutor toca a entrada de três hinos. Diga, só de ouvido, qual é tético, qual é anacrúsico e qual é acéfalo.",g:"Conforme a execução. Dica para o aluno: no anacrúsico o som chega antes do peso do compasso; no acéfalo há um silêncio exatamente onde o peso deveria estar."}
];
