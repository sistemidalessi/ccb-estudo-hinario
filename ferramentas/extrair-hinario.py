#!/usr/bin/env python3
"""Extrai os dados de cabeçalho de cada hino do hinário em PDF.

Por que existe: as questões do banco dizem "o hino indicado" porque não havia
uma tabela com os dados dos hinos. Com ela, cada aula do MSA pode fechar com
hinos escolhidos pelo conceito estudado — fora da ordem do hinário.

Como o hinário se organiza (medido no arquivo real, não suposto):
    y≈18  título
    y≈30  continuação do título, quando ele ocupa duas linhas
    y≈36  número do hino — presente só em parte das páginas
    y≈42  "Maestro <arranjador>" e, às vezes, a marcação "em 2" / "em 6"
    y≈48  TONALIDADE, seguida do compositor original
    y≈66  marcação de metrônomo, no formato "= 56 - 66 (61)"
    y≈84  indicação interpretativa, quando existe
Nem todo hino começa numa página nova: em parte do hinário um hino termina no
alto da página e o seguinte começa logo abaixo, na mesma folha, com o
cabeçalho inteiro repetido ali no meio. Por isso não basta olhar a faixa de
cima — o cabeçalho pode estar em qualquer altura, e o que o identifica é a
forma: título, e uns 24 a 30 pontos abaixo dele, a tonalidade.

Os hinos são contados em sequência e o contador é re-sincronizado toda vez que
um número aparece escrito.

Da partitura sai só informação sobre o hino — fórmula de compasso, ritmo
inicial, se tem nota pontuada, fermata, tercina, ritornelo, e com que arco
começa (a arcada impressa sobre a primeira nota). Nada dela é
reproduzido: nem nota, nem desenho.

Uso:
    pip install pymupdf
    python ferramentas/extrair-hinario.py
    python ferramentas/extrair-hinario.py caminho/do/Hinario.pdf
    python ferramentas/extrair-hinario.py caminho/do/Hinario.pdf --diag

Sem caminho, o script procura o hinário sozinho: varre o computador atrás de
PDFs grandes, mostra os candidatos numerados e pergunta qual é. Digitar caminho
de arquivo no terminal é onde a coisa mais trava na prática, e não precisa.
"""
import csv
import json
import os
import re
import string
import sys
import time
import unicodedata
from pathlib import Path

try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        sys.exit("Falta a biblioteca: pip install pymupdf")

LIXO = re.compile(r"ANDERSON|FERNANDES|DALESSI|\bafdalessi\S*|\S*@\S+\.\w+|\d{3}\.\d{3}\.\d{3}-\d{2}", re.I)
# O hinário não é uniforme na grafia da tonalidade: escreve "Si♭" numa página
# e "Sí♭" — com acento no i — noutra. Por isso a nota é reconhecida sem acento
# nenhum e devolvida já na grafia certa, que é a que o resto do material usa.
NOMES_DE_NOTA = {"do": "Dó", "re": "Ré", "mi": "Mi", "fa": "Fá",
                 "sol": "Sol", "la": "Lá", "si": "Si"}
NOTA = re.compile(r"^([A-Za-zÀ-ÿ]{2,3})(♭|♯)?$")
METRONOMO = re.compile(r"=\s*(\d{2,3})\s*-\s*(\d{2,3})\s*\(?\s*(\d{2,3})?\s*\)?")
MARCACAO = re.compile(r"\b(?:em|in)\s+(2|3|4|6|9|12)\b", re.I)
NUMERO = re.compile(r"^(\d{1,3})\.?$")
# Em parte das páginas o número vem sozinho na linha; noutras vem colado à
# marcação, como "15 em 4". São as duas formas, e não mais que essas.
NUMERO_COM_MARCACAO = re.compile(r"^(\d{1,3})\s+(?:em|in)\s+\d{1,2}$", re.I)
# As indicações interpretativas do hinário são seis, e só seis, conforme o
# caderno de atividades do 4º período do GEM. Uma primeira versão deste script
# procurava termos italianos de andamento (maestoso, adagio, allegro...) e
# devolvia palavras que não são indicação interpretativa nenhuma.
INDICACOES = re.compile(
    r"\b(solene|majestoso|com\s+j[úu]bilo|com\s+venera[çc][ãa]o|"
    r"com\s+submiss[ãa]o|com\s+humildade)\b", re.I)

TOPO = 100   # os cabeçalhos ficam todos acima de y=100
TOPO_RELATORIO = 850  # a segunda leitura e o relatório olham a página inteira:
                      # o hino pode começar no meio dela, ou já no rodapé
ALTURA_TITULO = 18    # altura do título quando o hino abre a página


def nota_canonica(token):
    """"Sí♭" e "Si♭" → "Si♭". Devolve "" quando não é nome de nota."""
    m = NOTA.match(token.strip(".,;:·)(\u2013-"))
    if not m:
        return ""
    nome = NOMES_DE_NOTA.get(sem_acento(m.group(1)))
    return (nome + (m.group(2) or "")) if nome else ""


def linhas_do_topo(pagina, limite=TOPO):
    """Linhas de texto da faixa do cabeçalho, como (y, texto)."""
    palavras = [w for w in pagina.get_text("words") if w[4].strip() and w[1] < limite]
    palavras.sort(key=lambda w: (round(w[1] / 6), w[0]))
    linhas, atual, y_atual = [], [], None
    for w in palavras:
        y = round(w[1] / 6) * 6
        if y != y_atual:
            if atual:
                linhas.append((y_atual, " ".join(atual)))
            atual, y_atual = [], y
        atual.append(w[4])
    if atual:
        linhas.append((y_atual, " ".join(atual)))
    return [(y, re.sub(r"\s+", " ", LIXO.sub("", t)).strip()) for y, t in linhas]


def dados_da_pagina(linhas, contador=0, faixa_tom=(34, 62)):
    """Linhas do cabeçalho de uma página → (dados, contador).
    dados é None quando a página não abre um hino. O campo "impresso" traz o
    número quando ele aparece escrito na página, e None quando não aparece —
    a numeração final é decidida depois, por âncoras, em numerar()."""
    por_y = {y: t for y, t in linhas}
    titulo = ""
    for y, t in linhas:
        if y <= 34 and len(t.strip()) > 3 and not NUMERO.match(t.strip()):
            titulo = t.strip()
            break
    # A tonalidade cai em y=42 ou y=48 conforme o hino, e por isso a faixa
    # padrão é larga. Quem já sabe onde ela está — a segunda leitura sabe —
    # passa a faixa exata, e não corre o risco de pescar palavra de outra linha.
    de, ate = faixa_tom
    texto_tom = " ".join(t for y, t in linhas if de <= y <= ate)
    tom = next((t for t in map(nota_canonica, texto_tom.split()) if t), "")

    if not titulo or not tom:
        return None, contador  # não é a página de abertura de um hino

    contador += 1
    impresso = None
    for y, t in linhas:
        if 24 <= y <= 40:
            m = NUMERO.match(t.strip()) or NUMERO_COM_MARCACAO.match(t.strip())
            if m and 1 <= int(m.group(1)) <= 480:
                impresso = int(m.group(1))
                break

    cabecalho = " ".join(t for _, t in linhas)
    met = METRONOMO.search(cabecalho)
    # A marcação "em 2" / "em 6" cai ora junto da tonalidade, ora na linha do
    # título ("Ó Pai celestial 142 Em 6"). Procura nas duas, nessa ordem.
    # Fora daí (y≈6) há anotações como "Pode agrupar frases em 4", que são
    # orientação de execução e não a marcação do hino — por isso não entram.
    marc = MARCACAO.search(texto_tom) or MARCACAO.search(por_y.get(18, "")) \
        or MARCACAO.search(por_y.get(30, ""))
    ind = INDICACOES.search(cabecalho)
    seg = por_y.get(30, "").strip()
    if seg and seg != titulo and not NUMERO.match(seg):
        titulo = (titulo + " " + seg).strip()

    return {
        "impresso": impresso,
        "titulo": titulo,
        "tom": tom,
        "marcacao": f"em {marc.group(1)}" if marc else "",
        "met": (f"{met.group(1)}-{met.group(2)}" + (f" ({met.group(3)})" if met.group(3) else "")) if met else "",
        "ind": " ".join(ind.group(1).split()).capitalize() if ind else "",
    }, contador


def numerar(hinos):
    """Atribui o número de cada hino a partir dos números impressos.

    Contar as aberturas em sequência erra sempre que uma abertura não é
    reconhecida: o contador atrasa e só volta ao certo no próximo número
    impresso, deixando errados os hinos do meio. Aqui os números impressos são
    âncoras: entre duas âncoras, só se numera quando a quantidade de aberturas
    bate exatamente com a quantidade de números que deveriam existir ali. Não
    batendo, os hinos do trecho ficam marcados como incertos, em vez de
    receberem um número inventado.
    """
    anc = [i for i, h in enumerate(hinos) if h["impresso"] is not None]
    for h in hinos:
        h["n"] = h["impresso"]
        h["conf"] = "impresso" if h["impresso"] is not None else "incerto"

    for a, b in zip(anc, anc[1:]):
        na, nb = hinos[a]["impresso"], hinos[b]["impresso"]
        meio = b - a - 1                      # aberturas entre as duas âncoras
        esperado = nb - na - 1                # números que deveriam caber ali
        if meio == esperado and 0 <= meio:     # sem página perdida no trecho
            for k in range(1, meio + 1):
                hinos[a + k]["n"] = na + k
                hinos[a + k]["conf"] = "inferido"

    # Depois do hino 480 o hinário traz os avulsos, que recomeçam a numeração
    # do 1. Sem marcá-los, eles entrariam na tabela como se fossem os hinos 1 e
    # 4, duplicando os números. O que os denuncia é a queda: vinha-se de um
    # número alto e aparece um de um dígito. Ninguém erra assim no meio do
    # livro — só a virada para a seção dos avulsos faz isso.
    maior = 0
    for i, h in enumerate(hinos):
        if h["impresso"] is None:
            continue
        if maior >= 400 and h["impresso"] <= 10:
            for k in range(i, len(hinos)):
                hinos[k]["conf"] = "avulso"
            break
        maior = max(maior, h["impresso"])

    # antes da primeira âncora e depois da última, conta para trás e para frente
    if anc:
        prim, ult = anc[0], anc[-1]
        for k in range(1, prim + 1):
            if hinos[prim]["impresso"] - k >= 1:
                hinos[prim - k]["n"] = hinos[prim]["impresso"] - k
                hinos[prim - k]["conf"] = "inferido"
        for k in range(1, len(hinos) - ult):
            if hinos[ult + k]["conf"] == "avulso":
                break
            hinos[ult + k]["n"] = hinos[ult]["impresso"] + k
            hinos[ult + k]["conf"] = "inferido"
    return hinos


# --------------------------------------------------------------- partitura ---
#
# A partitura deste PDF não é desenho: é texto, escrito com a fonte Leland (a
# do MuseScore), que segue o padrão SMuFL — cada símbolo musical tem um código
# fixo. Os códigos não aparecem na tela, porque caem na faixa de uso privado do
# Unicode, mas estão lá e podem ser lidos. É assim que sai o que o cabeçalho
# não diz: fórmula de compasso, nota pontuada, fermata, tercina, ritornelo.
#
# O mapa abaixo foi conferido contra o hinário inteiro (24/09/2026), e não
# suposto. Três coisas que a primeira versão errava, e por quê:
#   - o ritornelo não usa as barras de repetição do SMuFL (E040–E043): o
#     MuseScore desenha a barra como traço e escreve só os dois pontos (E044);
#   - a fórmula pode vir como símbolo — C (4/4) e C cortado (2/2) —, e não só
#     como dois algarismos; e 12/8 são três algarismos, não dois;
#   - o número da tercina não é da fonte musical: é um "3" em itálico da fonte
#     de texto (Edwin), posto sobre as notas.
# Tudo o que foi lido bate com as listas do caderno do GEM: os hinos em 3, 6, 9
# e 12, os de compassos alternados, os de fórmula diferente entre estrofe e
# coro, os de tercina, os de fermata e os de ritornelo com casas.
#
# O que a partitura não diz sozinha é o ritmo inicial — ver ritmo_inicial().

SMUFL_DIGITO = range(0xE080, 0xE08A)      # E080..E089 = algarismos 0 a 9 da fórmula
SMUFL_C = 0xE08A                          # C: compasso quaternário, 4/4
SMUFL_C_CORTADO = 0xE08B                  # C cortado: alla breve, 2/2
SMUFL_PONTO = 0xE1E7                      # ponto de aumento
SMUFL_FERMATA = (0xE4C0, 0xE4C1)          # fermata acima e abaixo
SMUFL_PONTO_RITORNELO = 0xE044            # cada um dos dois pontos da barra de repetição
SMUFL_CABECA = range(0xE0A2, 0xE0A5)      # cabeças de nota: semibreve, mínima, preta
SMUFL_PAUSA = range(0xE4E3, 0xE4F6)       # pausas, da semibreve à semicolcheia
SMUFL_ARCO_BAIXO = 0xE610                 # arcada: arco para baixo (⊓)
SMUFL_ARCO_CIMA = 0xE612                  # arcada: arco para cima (V)
# Os que existem no hinário e não servem a nenhuma aula por ora — fica escrito
# o que são, para o relatório não os tratar como desconhecidos.
SMUFL_SABIDOS = {
    0xE000: "chave do sistema", 0xE050: "clave de Sol", 0xE062: "clave de Fá",
    0xE094: "parêntese da fórmula", 0xE095: "parêntese da fórmula",
    0xE0BE: "cabeça triangular", 0xE0C2: "cabeça triangular",
    0xE1C5: "cabeça triangular",
    0xE1D7: "colcheia (texto)", 0xE1D9: "semicolcheia (texto)",
    0xE1F0: "nota em texto", 0xE1F2: "nota em texto", 0xE1FC: "ponto em texto",
    0xE240: "colchete de colcheia", 0xE241: "colchete de colcheia",
    0xE242: "colchete de semicolcheia", 0xE243: "colchete de semicolcheia",
    0xE260: "bemol", 0xE261: "bequadro", 0xE262: "sustenido", 0xE264: "dobrado bemol",
    0xE4A1: "acento", 0xE4A2: "staccato", 0xE4A3: "staccato", 0xE4A4: "tenuto",
    0xE4A5: "tenuto", 0xE4AA: "staccatissimo",
    0xE4CE: "respiração (vírgula)", 0xE4D3: "cesura", 0xE4D4: "cesura",
    0xE520: "p", 0xE522: "f", 0xE52B: "pp", 0xE52C: "mp", 0xE52D: "mf",
    0xE52F: "ff", 0xE534: "fp", 0xE542: "parêntese de dinâmica",
    0xE543: "parêntese de dinâmica",
    0xE655: "pedal",
    0xE7A3: "baqueta", 0xE842: "golpe", 0xE875: "parêntese alto",
    0xE876: "parêntese alto", 0xE879: "parêntese alto", 0xE87A: "parêntese alto",
    0xE8CA: "ponto de acordeão", 0xEA8F: "colchete", 0xEA90: "colchete",
    0xEA91: "parêntese", 0xEA92: "parêntese", 0xEAA4: "trilo",
    0xEB79: "seta", 0xEB7B: "seta", 0xEB7C: "seta", 0xEB7D: "seta", 0xEB7E: "seta",
    0xEC3D: "sustenido (Kievan)",
    0xECA3: "figura do metrônomo", 0xECA5: "figura do metrônomo",
    0xECA7: "figura do metrônomo", 0xECB7: "ponto do metrônomo",
}
SMUFL_CONHECIDOS = (set(SMUFL_DIGITO) | {SMUFL_C, SMUFL_C_CORTADO, SMUFL_PONTO,
                    SMUFL_PONTO_RITORNELO, SMUFL_ARCO_BAIXO, SMUFL_ARCO_CIMA}
                    | set(SMUFL_FERMATA) | set(SMUFL_CABECA)
                    | set(SMUFL_PAUSA) | set(SMUFL_SABIDOS))

USO_PRIVADO = range(0xE000, 0xF900)

# Na margem esquerda de parte dos hinos o hinário traz, em cinza e de lado,
# a indicação de regência do Maestro: "Levare 3" quer dizer que a preparação
# é dada no 3º tempo, e portanto o hino entra no 4º. Não é texto — é imagem
# carimbada —, então é reconhecida pela assinatura da imagem, que se repete
# idêntica em todas as páginas em que aparece.
SELOS = {
    "889e865e13": "Levare 3", "3fbc59c71d": "Levare 2", "3666bc7317": "Levare 4",
    "70added4f5": "Súbito ativo", "532f065d63": "Súbito ativo, ataca o 2º tempo",
}


# Os hinos em que a leitura automática não decide — selo e medida discordam,
# ou a medida cai entre 0,55 e 0,8 — foram olhados um a um na partitura em
# 24/09/2026. A decisão fica escrita aqui, e não no CSV, para sobreviver a uma
# nova rodada do script. Vale o que está aqui sobre a leitura automática.
#   2    4/4, selo Levare 4, mas o 1º compasso tem um tempo só
#   90   3/4, selo Levare 3, mas o 1º compasso tem um tempo só
#   149  4/4, selo Levare 3, mas o 1º compasso tem os quatro tempos
#   285  4/4, selo Levare 3, mas o 1º compasso tem os quatro tempos
#   230  sem fórmula impressa no começo; compassos de quatro semínimas, e o
#        primeiro tem uma só
#   366  4/4 com três tempos no 1º compasso
#   31 53 115  compasso cheio de figuras longas (por isso a medida sai curta)
#   25 66 128 148 172 357 391  começam com três colcheias — tempo e meio
CONFERIDOS_NO_OLHO = {
    2: "anacrúsico", 90: "anacrúsico", 149: "tético", 285: "tético",
    230: "anacrúsico", 366: "anacrúsico", 31: "tético", 53: "tético",
    115: "tético", 25: "anacrúsico", 66: "anacrúsico", 128: "anacrúsico",
    148: "anacrúsico", 172: "anacrúsico", 357: "anacrúsico", 391: "anacrúsico",
}


def elementos_da_pagina(pagina):
    """O que interessa da partitura de uma página.

    Devolve três listas:
      glifos    (y, x, x_fim, código, tamanho, linha de base) de cada símbolo musical
      tercinas  (y, x) de cada "3" de tercina
      selos     (y, rótulo) de cada indicação de regência carimbada
    """
    glifos, tercinas = [], []
    for bloco in pagina.get_text("rawdict")["blocks"]:
        for linha in bloco.get("lines", []):
            for trecho in linha.get("spans", []):
                texto = "".join(c["c"] for c in trecho["chars"])
                if "Italic" in trecho["font"] and texto.strip() == "3":
                    tercinas.append((trecho["bbox"][1], trecho["bbox"][0]))
                for c in trecho["chars"]:
                    cod = ord(c["c"])
                    if cod in USO_PRIVADO:
                        x0, y0, x1, _ = c["bbox"]
                        # origin: a linha de base do glifo. Na fonte musical
                        # ela passa pelo centro da cabeça da nota e, na clave
                        # de Sol, pela linha do Sol — é por ela que se lê a altura
                        glifos.append((y0, x0, x1, cod, trecho["size"], c["origin"][1]))
    selos = []
    for img in pagina.get_image_info(hashes=True):
        rot = SELOS.get(img["digest"].hex()[:10])
        if rot:
            selos.append((img["bbox"][1], rot))
    return glifos, tercinas, selos


def barras_de_compasso(pagina):
    """Barras de compasso: traços verticais finos da altura do sistema.

    As hastes das notas também são traços verticais, mas não passam de uns 25
    pontos; a barra atravessa a pauta dupla inteira, bem mais que isso."""
    barras = []
    for d in pagina.get_drawings():
        r = d["rect"]
        if r.width < 0.6 and r.height > 40 and len(d["items"]) == 1 and d["items"][0][0] == "l":
            barras.append((r.x0, r.y0, r.y1))
    return barras


def formulas(glifos):
    """Fórmulas de compasso na ordem em que aparecem, como (y, x, "3/4").

    Os algarismos de um mesmo número ficam colados lado a lado (o 12 de 12/8
    são dois); numerador e denominador ficam um sobre o outro, centrados na
    mesma vertical, a meia altura de pauta de distância. Como cada fórmula se
    repete nas duas pautas do sistema, a mesma fórmula sai duas vezes — quem
    usa tira as repetições."""
    numeros = []
    for y, x, x1, cod, tam, _ in sorted((g for g in glifos if g[3] in SMUFL_DIGITO),
                                     key=lambda g: (g[0], g[1])):
        ult = numeros[-1] if numeros else None
        if ult and abs(ult["y"] - y) < 1.5 and -0.5 <= x - ult["x1"] < 2:
            ult["v"] = ult["v"] * 10 + cod - 0xE080
            ult["x1"] = x1
        else:
            numeros.append({"y": y, "x": x, "x1": x1, "v": cod - 0xE080, "tam": tam})
    achadas, usados = [], set()
    for i, a in enumerate(numeros):
        if i in usados:
            continue
        meio_a = (a["x"] + a["x1"]) / 2
        for j, b in enumerate(numeros):
            if j in usados or j == i:
                continue
            if 0.35 * a["tam"] < b["y"] - a["y"] < 0.65 * a["tam"] \
                    and abs((b["x"] + b["x1"]) / 2 - meio_a) < 0.25 * a["tam"] \
                    and 1 <= a["v"] <= 12 and b["v"] in (1, 2, 4, 8, 16):
                usados |= {i, j}
                achadas.append((a["y"], a["x"], f"{a['v']}/{b['v']}"))
                break
    for y, x, _, cod, _, _ in glifos:
        if cod == SMUFL_C:
            achadas.append((y, x, "C"))
        elif cod == SMUFL_C_CORTADO:
            achadas.append((y, x, "C cortado"))
    achadas.sort()
    return achadas


def valor_da_formula(f):
    """ "C" → (4, 4); "6/8" → (6, 8)."""
    if f == "C":
        return 4, 4
    if f == "C cortado":
        return 2, 2
    a, b = f.split("/")
    return int(a), int(b)


def razao_do_primeiro_compasso(glifos, barras, formula):
    """Largura do primeiro compasso dividida pela do segundo.

    A duração das notas não é legível direto — quando as colcheias são ligadas
    por barra, a barra é traço desenhado e não símbolo —, mas o espaço que o
    compasso ocupa é: o programa que gravou o hinário distribui as notas pelo
    tempo que elas duram. Um primeiro compasso que ocupa um quarto do segundo
    tem um quarto dos tempos: é anacruse. No hinário inteiro as medidas se
    separam em dois montes, abaixo de 0,55 e acima de 0,8, com pouca coisa no
    meio."""
    y, x, _ = formula
    altura = y + 45            # meio da pauta de cima: por onde a barra passa
    notas = sorted(g[1] for g in glifos
                   if g[3] in SMUFL_CABECA and abs(g[0] - y) < 60 and g[1] > x + 5)
    if not notas:
        return None
    inicio = notas[0]
    xs = []
    for bx in sorted(b[0] for b in barras if b[1] - 2 <= altura <= b[2] + 2):
        # a barra de ritornelo do começo fica antes da primeira nota; a barra
        # dupla são dois traços colados — nenhuma das duas fecha compasso
        if bx > inicio + 3 and (not xs or bx - xs[-1] > 4):
            xs.append(bx)
    if len(xs) < 2 or xs[1] - xs[0] <= 0:
        return None
    return round((xs[0] - inicio) / (xs[1] - xs[0]), 2)


def arco_inicial(glifos, formula):
    """A arcada impressa sobre a primeira nota do hino: "baixo", "cima" ou "".

    Todo hino do hinário traz arcadas — o sinal de arco para baixo (⊓) ou para
    cima (V) sobre a pauta de Sol e sobre a de Fá. Mas elas são seletivas:
    marcam o começo e os pontos em que o arco precisa virar, não cada nota.
    Por isso só a da primeira nota é gravada, que é o dado firme. Conferido em
    24/09/2026: 182 dos 190 téticos começam para baixo; dos anacrúsicos, 203
    começam para cima e 70 para baixo — quando a anacruse tem mais de uma nota
    ou ocupa um tempo inteiro. Onde o hinário marca arcada no primeiro tempo
    forte depois da anacruse, ela é sempre para baixo.
    """
    y, x, _ = formula
    notas = sorted((g for g in glifos if g[3] in SMUFL_CABECA and abs(g[0] - y) < 60 and g[1] > x + 5),
                   key=lambda g: g[1])
    if not notas:
        return ""
    primeira = notas[0][1]
    arcos = sorted((g for g in glifos if g[3] in (SMUFL_ARCO_BAIXO, SMUFL_ARCO_CIMA)
                    and y - 45 <= g[0] <= y + 15), key=lambda g: abs(g[1] - primeira))
    if not arcos or abs(arcos[0][1] - primeira) >= 8:
        return ""
    return "baixo" if arcos[0][3] == SMUFL_ARCO_BAIXO else "cima"


NOTAS_DIATONICAS = ["Sol", "Lá", "Si", "Dó", "Ré", "Mi", "Fá"]   # a partir do Sol4
# acidentes da armadura de cada tonalidade maior do hinário
ARMADURA_NOTAS = {
    "Dó": {}, "Sol": {"Fá": "♯"}, "Ré": {"Fá": "♯", "Dó": "♯"}, "Lá": {"Fá": "♯", "Dó": "♯", "Sol": "♯"},
    "Mi": {"Fá": "♯", "Dó": "♯", "Sol": "♯", "Ré": "♯"}, "Fá": {"Si": "♭"},
    "Si♭": {"Si": "♭", "Mi": "♭"}, "Mi♭": {"Si": "♭", "Mi": "♭", "Lá": "♭"},
    "Lá♭": {"Si": "♭", "Mi": "♭", "Lá": "♭", "Ré": "♭"},
    "Ré♭": {"Si": "♭", "Mi": "♭", "Lá": "♭", "Ré": "♭", "Sol": "♭"},
}


def nome_da_nota(passos, tom=""):
    """Passos diatônicos acima do Sol4 → "Mi5" (com a armadura do tom).
    Acidente ocorrente não entra: é a nota da armadura."""
    idx = NOTAS_DIATONICAS.index("Sol") + passos
    letra = NOTAS_DIATONICAS[idx % 7]
    # a oitava muda no Dó: Sol4 Lá4 Si4 | Dó5
    oitava = 4 + (passos + 4) // 7
    return letra + ARMADURA_NOTAS.get(tom, {}).get(letra, "") + str(oitava)


def ambito(glifos):
    """Sistemas, e a nota mais aguda e a mais grave da pauta de Sol.

    A pauta de Sol traz soprano e contralto: a nota mais aguda dela é do
    soprano, a mais grave é do contralto. A altura sai da linha de base de
    cada cabeça de nota, contada em meios espaços a partir da linha do Sol,
    onde passa a linha de base da clave. Cada nota vai para a clave de Sol
    mais próxima acima dela ou logo abaixo — a pauta de Fá do mesmo sistema
    fica a vários espaços de distância e tem clave própria.
    Devolve (sistemas, passos_max, passos_min), em passos acima do Sol4."""
    sols = [(g[5], g[1]) for g in glifos if g[3] == 0xE050]
    fas = [g[5] for g in glifos if g[3] == 0xE062]
    alto, baixo = None, None
    for g in glifos:
        if g[3] not in SMUFL_CABECA:
            continue
        meio = g[4] * 0.125                   # meio espaço de pauta
        cand = [c for c, _ in sols if -14 * meio <= c - g[5] <= 12 * meio]
        if not cand:
            continue
        linha_sol = min(cand, key=lambda c: abs(c - g[5]))
        # nota mais perto de uma clave de Fá do que da de Sol é do baixo/tenor
        if any(abs(f - g[5]) < abs(linha_sol - g[5]) for f in fas):
            continue
        passos = round((linha_sol - g[5]) / meio)
        alto = passos if alto is None else max(alto, passos)
        baixo = passos if baixo is None else min(baixo, passos)
    return len(sols), alto, baixo


def ritmo_inicial(razao, selo, formula):
    """Tético, anacrúsico ou acéfalo — sempre para conferir. Devolve (ritmo, base).

    Duas fontes, e o ritmo só é afirmado quando elas não se contradizem:
      - o selo de regência do Maestro. "Levare N" dá a preparação no tempo N,
        então o hino entra no tempo seguinte: se N é o último tempo do
        compasso, o hino começa no 1º (tético); senão, começa antes dele
        (anacrúsico). Só vale para compasso simples: no composto não se sabe
        se o Maestro conta os tempos ou os pulsos. "Súbito ativo" está em
        exatamente dois hinos, o 227 e o 377 — os dois começam depois do 1º
        tempo, e o caderno do GEM diz que o hinário tem só dois acéfalos;
      - a largura do primeiro compasso (razao_do_primeiro_compasso).
    Quando as duas discordam, ou a medida cai entre 0,55 e 0,8, fica em branco
    — e o hino vai para CONFERIDOS_NO_OLHO. O selo erra às vezes (o 2, o 90, o
    149 e o 285 contradizem a própria partitura), e é por isso que ele sozinho
    não basta.
    """
    if selo and selo.startswith("Súbito"):
        return "acéfalo", "selo"
    medida = ""
    if razao is not None:
        medida = "anacrúsico" if razao < 0.55 else "tético" if razao >= 0.8 else ""
    if selo and selo.startswith("Levare") and formula:
        num, den = valor_da_formula(formula)
        tempo = int(selo.split()[1])
        if num in (2, 3, 4) and den in (2, 4) and tempo <= num:
            pelo_selo = "tético" if tempo == num else "anacrúsico"
            if medida and medida != pelo_selo:
                return "", "selo e medida discordam"
            return pelo_selo, "selo e medida" if medida else "selo"
    return medida, "medida" if medida else ""


def ler_partitura(doc, hinos):
    """Acrescenta a cada hino o que a partitura diz dele.

    O hino vai do seu cabeçalho até o cabeçalho do seguinte — que pode estar
    no meio de uma página, por isso o corte é por página e altura. Campos:
      fc      fórmulas de compasso, na ordem, sem repetição ("3/4 4/4")
      ritmo   tético / anacrúsico / acéfalo, ou vazio — ver ritmo_inicial()
      rbase   de onde veio o ritmo: selo, medida, os dois, ou a discordância
      sinais  nota pontuada, fermata, tercina, ritornelo
      arco    arcada impressa sobre a primeira nota — ver arco_inicial()
      sis     número de sistemas (pautas duplas) do hino
      agudo   nota mais aguda da pauta de Sol (soprano), com a armadura
      grave   nota mais grave da pauta de Sol (contralto)
    Devolve a contagem dos códigos que o mapa não conhece, com os hinos."""
    cache = {}

    def pagina(n):
        if n not in cache:
            pg = doc[n - 1]
            cache[n] = elementos_da_pagina(pg) + (barras_de_compasso(pg),)
        return cache[n]

    ordem = sorted(hinos, key=lambda h: (h["pag"], h.get("y", 0)))
    desconhecidos = {}
    for i, h in enumerate(ordem):
        prox = ordem[i + 1] if i + 1 < len(ordem) else None
        ultima = prox["pag"] if prox else doc.page_count
        glifos, tercinas, selos, primeira, por_pagina = [], 0, [], None, []
        for n in range(h["pag"], ultima + 1):
            g, t, s, barras = pagina(n)
            de = h.get("y", 0) - 5 if n == h["pag"] else -1e9
            ate = prox.get("y", 0) - 5 if prox and n == prox["pag"] else 1e9
            aqui = [e for e in g if de <= e[0] < ate]
            if primeira is None and formulas(aqui):
                primeira = (aqui, barras)
            glifos += aqui
            por_pagina.append(aqui)
            tercinas += sum(1 for e in t if de <= e[0] < ate)
            selos += [r for y, r in s if de <= y < ate]
        achadas = [f for _, _, f in formulas(glifos)]
        fc = list(dict.fromkeys(achadas))
        cods = {}
        for e in glifos:
            cods[e[3]] = cods.get(e[3], 0) + 1
        sinais = []
        if cods.get(SMUFL_PONTO):
            sinais.append("nota pontuada")
        if any(cods.get(c) for c in SMUFL_FERMATA):
            sinais.append("fermata")
        if tercinas:
            sinais.append("tercina")
        if cods.get(SMUFL_PONTO_RITORNELO, 0) >= 2:
            sinais.append("ritornelo")
        razao, arco = None, ""
        if primeira:
            g1, b1 = primeira
            razao = razao_do_primeiro_compasso(g1, b1, formulas(g1)[0])
            arco = arco_inicial(g1, formulas(g1)[0])
        selo = selos[0] if selos else ""
        ritmo, base = ritmo_inicial(razao, selo, fc[0] if fc else "")
        if h.get("conf") != "avulso" and h.get("n") in CONFERIDOS_NO_OLHO:
            ritmo, base = CONFERIDOS_NO_OLHO[h["n"]], "conferido no olho"
        sis, alto, baixo = 0, None, None
        for aqui in por_pagina:               # altura só se compara na mesma página
            s_, a_, b_ = ambito(aqui)
            sis += s_
            if a_ is not None:
                alto = a_ if alto is None else max(alto, a_)
                baixo = b_ if baixo is None else min(baixo, b_)
        tom = h.get("tom", "")
        h.update(sis=sis, agudo=nome_da_nota(alto, tom) if alto is not None else "",
                 grave=nome_da_nota(baixo, tom) if baixo is not None else "")
        h.update(fc=" ".join(fc), ritmo=ritmo, rbase=base, razao=razao, selo=selo, arco=arco,
                 sinais=", ".join(sinais))
        for c, q in cods.items():
            if c not in SMUFL_CONHECIDOS:
                desconhecidos.setdefault(c, [0, set()])
                desconhecidos[c][0] += q
                desconhecidos[c][1].add(h.get("n"))
    return desconhecidos


# ---------------------------------------------------------------- procura ---
#
# Digitar ou arrastar o caminho de um arquivo para dentro do terminal é a
# parte que mais dá errado — some o espaço, sobra aspas, o Enter escapa antes.
# Então o script procura o arquivo sozinho e só pergunta qual é.

PASTAS_FORA = {
    "appdata", "windows", "program files", "program files (x86)", "programdata",
    "$recycle.bin", "system volume information", "node_modules", "winsxs",
    "recovery", "perflogs", "msocache", "library", "system", "proc", "sys",
}
TAMANHO_MINIMO = 5 * 1024 * 1024   # o hinário tem dezenas de MB
LIMITE_SEGUNDOS = 120
PISTAS = ("hinario", "hino", "analise", "capapreta", "ccb")


def sem_acento(t):
    return "".join(c for c in unicodedata.normalize("NFD", t.lower())
                   if unicodedata.category(c) != "Mn")


def raizes_de_busca():
    """A pasta do usuário primeiro; depois as outras unidades.

    O Google Drive para computador aparece como uma unidade própria (G:, H:),
    fora da pasta do usuário — e é lá que o hinário costuma estar.
    """
    raizes = [Path.home()]
    if os.name == "nt":
        for letra in string.ascii_uppercase[2:]:   # pula A: e B:, que travam
            r = Path(f"{letra}:\\")
            try:
                if r.is_dir():
                    raizes.append(r)
            except OSError:
                pass
    return raizes


def procurar_pdfs():
    """PDFs grandes do computador, os mais parecidos com o hinário primeiro."""
    achados, vistos, inicio, estourou = [], set(), time.time(), False
    for raiz in raizes_de_busca():
        for pasta, subpastas, arquivos in os.walk(raiz, onerror=lambda e: None):
            if time.time() - inicio > LIMITE_SEGUNDOS:
                estourou = True
                break
            subpastas[:] = [d for d in subpastas
                            if d.lower() not in PASTAS_FORA and not d.startswith(".")]
            for nome in arquivos:
                if not nome.lower().endswith(".pdf"):
                    continue
                caminho = Path(pasta) / nome
                try:
                    tam = caminho.stat().st_size
                except OSError:
                    continue
                chave = (nome.lower(), tam)
                if tam >= TAMANHO_MINIMO and chave not in vistos:
                    vistos.add(chave)
                    achados.append((caminho, tam))
        if estourou:
            break
    achados.sort(key=lambda a: (-pontos(a[0]), -a[1]))
    return achados, estourou


def pontos(caminho):
    """Quanto o nome do arquivo e da pasta lembram o hinário."""
    texto = sem_acento(str(caminho)).replace(" ", "")
    return sum(2 if p in ("hinario", "hino") else 1 for p in PISTAS if p in texto)


def escolher_hinario():
    """Procura os candidatos e pergunta qual é o hinário."""
    print("Procurando o hinário no computador. Pode levar um ou dois minutos.")
    print("(É normal a janela parecer parada enquanto isso.)\n")
    achados, estourou = procurar_pdfs()
    if not achados:
        sys.exit("Não achei nenhum PDF grande no computador.\n"
                 "Se o hinário estiver no Google Drive só na nuvem, abra-o uma vez\n"
                 "pelo Explorador de Arquivos para ele baixar, e rode de novo.")
    if estourou:
        print(f"(A procura passou de {LIMITE_SEGUNDOS}s e parou; "
              "se o hinário não estiver na lista, me avise.)\n")

    lista = achados[:15]
    print(f"Achei {len(achados)} arquivo(s) PDF grande(s). O hinário deve ser um destes:\n")
    for i, (caminho, tam) in enumerate(lista, 1):
        print(f"  {i:>2}) {caminho.name}")
        print(f"      {tam / 1048576:.0f} MB — {caminho.parent}")
    print()
    while True:
        try:
            resp = input("Digite o número do hinário e tecle Enter (ou 0 para sair): ").strip()
        except (EOFError, KeyboardInterrupt):
            sys.exit("\nCancelado.")
        if resp == "0":
            sys.exit("Cancelado.")
        if resp.isdigit() and 1 <= int(resp) <= len(lista):
            return str(lista[int(resp) - 1][0])
        print("Não entendi. Digite só o número que está à esquerda do arquivo.")


def conferir_caminho(caminho):
    """Para com mensagem clara em vez de abrir um PDF vazio.

    Sem isto, um caminho vazio — que acontece quando a variável do PowerShell
    não foi preenchida — faz o fitz abrir um documento em branco, e o script
    relata "0 páginas de abertura lidas" como se fosse um resultado.
    """
    if not caminho or not caminho.strip():
        sys.exit("Nenhum caminho foi recebido. Passe o arquivo do hinário:\n"
                 '    python ferramentas/extrair-hinario.py "C:\\caminho\\Hinario.pdf"')
    p = Path(caminho)
    if not p.exists():
        sys.exit(f"Arquivo não encontrado: {p}\n"
                 "Confira o caminho — no PowerShell, arraste o arquivo para a janela "
                 "para colar o caminho certo.")
    if p.suffix.lower() != ".pdf":
        sys.exit(f"Isto não é um PDF: {p.name}")
    if p.stat().st_size < 100_000:
        sys.exit(f"O arquivo tem só {p.stat().st_size / 1024:.0f} KB — o hinário tem dezenas de MB. "
                 "Provavelmente é o arquivo errado.")
    return p


def paginas_suspeitas(hinos, total_paginas):
    """Páginas que quase certamente abrem um hino e não foram reconhecidas.

    Entre dois números impressos, o script sabe quantos hinos deveriam existir
    e quantas aberturas encontrou. Quando encontra menos, as aberturas que
    faltam estão nas páginas daquele trecho que ele descartou — e são essas
    que interessam olhar. Páginas de trechos que fecham a conta são
    continuação de hino, e ficam de fora do relatório para ele não virar um
    despejo de 127 páginas em que nada salta aos olhos.
    """
    anc = [i for i, h in enumerate(hinos) if h["impresso"] is not None]
    reconhecidas = {h["pag"] for h in hinos}
    suspeitas = {}
    for a, b in zip(anc, anc[1:]):
        esperado = hinos[b]["impresso"] - hinos[a]["impresso"] - 1
        achado = b - a - 1
        if achado >= esperado:
            continue
        faltam = esperado - achado
        for pag in range(hinos[a]["pag"] + 1, hinos[b]["pag"]):
            if pag in reconhecidas:
                continue
            suspeitas.setdefault(pag, (hinos[a]["impresso"], hinos[b]["impresso"], faltam))
    return suspeitas


def alturas_de_cabecalho(linhas):
    """Alturas de linha que podem ser o título de um hino nesta página.

    O que identifica um cabeçalho não é estar no alto da página: é a forma.
    Vem o título e, logo abaixo, uma linha que traz a tonalidade — o nome de
    uma nota sozinho, às vezes seguido do compositor. Entre os dois costumam
    ficar o número e o "Maestro Fulano", mas nem sempre: há página em que o
    cabeçalho vem comprimido e a tonalidade está seis pontos abaixo do título.
    Daí a distância aceita ir de 4 a 36. Devolve os pares (título, tonalidade).
    """
    texto = {y: t.strip() for y, t in linhas if t.strip()}
    alturas = sorted(texto)
    for y in alturas:
        # Exigir letras, e não só caracteres: o hinário escreve os sinais de
        # partitura com uma fonte musical cujos glifos são caracteres comuns
        # que não aparecem na tela. Uma linha dessas tem comprimento mas não é
        # título de nada, e sem esta conta ela entraria como se fosse.
        if sum(c.isalpha() for c in texto[y]) < 4 or NUMERO.match(texto[y]):
            continue
        for y2 in alturas:
            if not 4 <= y2 - y <= 36:
                continue
            if any(nota_canonica(tk) for tk in texto[y2].split()):
                yield y, y2
                break


def recuperar(hinos, descartadas, total):
    """Segunda passada, só nas páginas onde a conta diz que falta um hino.

    O cabeçalho de algumas páginas está impresso mais abaixo do que o das
    outras — basta a digitalização ter saído um pouco torta ou deslocada. A
    faixa fixa de leitura não o alcança e a página é descartada como se fosse
    continuação de hino.

    Aqui essas páginas são lidas de novo com as alturas deslocadas, para o
    cabeçalho cair onde as regras esperam, e passam exatamente pelas mesmas
    regras de sempre — nada é afrouxado. O que protege contra inventar hino é
    a página já ter sido eleita suspeita: entre dois números impressos, o
    script sabe quantos hinos deveriam existir ali e viu menos. Numa página
    dessas, achar título e tonalidade é achar o hino que faltava.
    """
    recuperados = []
    for _ in range(3):          # recuperar uma abertura pode revelar outra
        suspeitas = paginas_suspeitas(hinos, total)
        achou = False
        for pag in sorted(suspeitas):
            linhas = descartadas.get(pag)
            if not linhas:
                continue
            # Podem sair vários candidatos a título na mesma página. Entre os
            # que a leitura aceita, vale o que trouxer o número impresso: esse
            # é o cabeçalho de verdade, não um resto de linha lido por engano.
            lidos = []
            for y_titulo, y_tom in alturas_de_cabecalho(linhas):
                delta = y_titulo - ALTURA_TITULO
                pos_tom = ALTURA_TITULO + (y_tom - y_titulo)
                faixa = (max(ALTURA_TITULO + 2, pos_tom - 3), pos_tom + 3)
                # corta o que está acima do título e abaixo da faixa do
                # cabeçalho: numa página de dois hinos, o de cima tem
                # metrônomo e indicação próprios, e eles não são deste.
                recortadas = [(y - delta, t) for y, t in linhas
                              if -6 <= y - delta < TOPO]
                dados, _ = dados_da_pagina(recortadas, faixa_tom=faixa)
                if dados:
                    dados["pag"], dados["y"] = pag, y_titulo
                    lidos.append(dados)
            if not lidos:
                continue
            escolhido = next((d for d in lidos if d["impresso"] is not None), lidos[0])
            hinos.append(escolhido)
            del descartadas[pag]
            recuperados.append(pag)
            achou = True
        if not achou:
            break
        hinos.sort(key=lambda h: (h["pag"], h.get("y", 0)))
        numerar(hinos)
    return recuperados


def ler(caminho, registrar_falhas=True):
    p = conferir_caminho(caminho)
    doc = fitz.open(p)
    print(f"Lendo {p.name} — {doc.page_count} páginas, {p.stat().st_size / 1048576:.0f} MB")
    hinos, contador, descartadas = [], 0, {}
    for i, pagina in enumerate(doc):
        linhas = linhas_do_topo(pagina)
        dados, contador = dados_da_pagina(linhas, contador)
        if dados:
            dados["pag"] = i + 1
            dados["y"] = min([y for y, t in linhas if t.strip()], default=0)
            hinos.append(dados)
        else:
            # guarda uma faixa mais alta: se o cabeçalho desta página estiver
            # abaixo de onde a leitura procura, é assim que ele aparece.
            descartadas[i + 1] = linhas_do_topo(pagina, TOPO_RELATORIO)
    total = doc.page_count
    numerar(hinos)

    recuperados = recuperar(hinos, descartadas, total)
    if recuperados:
        print(f"  {len(recuperados)} aberturas recuperadas numa segunda leitura "
              "(hino que começa no meio da página, e não no alto)")

    print("  lendo a partitura (fórmula de compasso, sinais, ritmo inicial)...")
    desconhecidos = ler_partitura(doc, hinos)
    doc.close()
    relatorio_partitura(hinos, desconhecidos)

    if registrar_falhas:
        suspeitas = paginas_suspeitas(hinos, total)
        numeros = {h["n"] for h in hinos if h["conf"] != "incerto" and h["n"]}
        faltando = [x for x in range(1, 481) if x not in numeros]
        alvo = Path(__file__).parent / "nao-lidas.txt"
        with open(alvo, "w", encoding="utf-8") as f:
            f.write("Páginas que o script NÃO reconheceu como abertura de hino,\n"
                    "e que pela conta dos números impressos deveriam abrir uma.\n\n")
            f.write("RESUMO\n")
            f.write(f"  {total} páginas no PDF\n")
            f.write(f"  {len(hinos)} aberturas reconhecidas\n")
            f.write(f"  {len(descartadas)} páginas descartadas (a maioria é continuação de hino)\n")
            f.write(f"  {len(faltando)} números de 1 a 480 ficaram sem hino\n")
            f.write(f"  {len(suspeitas)} páginas descartadas ainda caem em trecho onde falta hino\n")
            if recuperados:
                f.write(f"  {len(recuperados)} aberturas foram recuperadas na segunda leitura, "
                        f"nas páginas: {', '.join(map(str, recuperados))}\n")
            f.write("\n")
            f.write("Cada bloco abaixo é uma dessas páginas suspeitas: o que há de\n"
                    "legível nela, em qualquer altura, já sem a marca d'água com os\n"
                    "dados pessoais. Página que só tem partitura é continuação de\n"
                    "hino; o hino que falta ali, se existe, está noutra página.\n")
            if not suspeitas:
                f.write("\nNenhuma página suspeita: a conta dos números impressos fecha em\n"
                        "todos os trechos. O que falta, falta do próprio PDF.\n")
            for pag in sorted(suspeitas):
                na, nb, faltam = suspeitas[pag]
                f.write(f"\n{'='*60}\nPÁGINA {pag}"
                        f"   (entre os hinos {na} e {nb}; faltam {faltam} ali)\n")
                # Só as linhas legíveis. O resto da página é a partitura,
                # escrita com uma fonte musical cujos glifos são caracteres
                # que não aparecem na tela: imprimi-los encheria o relatório
                # de linhas em branco e esconderia o que interessa.
                todas = descartadas.get(pag, [])
                linhas = [(y, t) for y, t in todas
                          if sum(c.isalpha() for c in t) >= 2]
                mudas = len([1 for y, t in todas if t]) - len(linhas)
                if not linhas:
                    f.write("  (nada legível na página — só partitura: "
                            "é continuação de hino, não abertura)\n")
                for y, t in linhas:
                    f.write(f"  y={y:>4}  {t[:150]}\n")
                if linhas and mudas:
                    f.write(f"  (e mais {mudas} linha(s) só de partitura)\n")
        print(f"  (relatório das páginas suspeitas em {alvo.name})")
    return hinos


def relatorio_partitura(hinos, desconhecidos):
    """partitura.txt: o que precisa de olho humano antes de virar apostila."""
    alvo = Path(__file__).parent / "partitura.txt"
    validos = [h for h in hinos if h["conf"] != "avulso"]
    with open(alvo, "w", encoding="utf-8") as f:
        f.write("Leitura da partitura — o que conferir.\n\n")
        sem_fc = [h["n"] for h in validos if not h["fc"]]
        f.write(f"Hinos sem fórmula de compasso lida: {sem_fc or 'nenhum'}\n")
        f.write("  (o 230 não tem fórmula impressa no começo; o 434 não está no PDF)\n\n")
        mudam = [(h["n"], h["fc"]) for h in validos if " " in h["fc"].replace("C cortado", "C")]
        f.write("Hinos em que a fórmula muda no meio:\n")
        for n, fc in mudam:
            f.write(f"  {n}: {fc}\n")
        f.write("\nRitmo inicial em branco (o instrutor decide):\n")
        for h in validos:
            if not h["ritmo"]:
                f.write(f"  {h['n']}: {h['rbase'] or 'medida no meio do caminho'}"
                        f" (razão {h['razao']}, selo {h['selo'] or '—'}, {h['fc'] or 'sem fórmula'})\n")
        f.write("\nCódigos da fonte musical que o script não conhece:\n")
        if not desconhecidos:
            f.write("  nenhum — todo símbolo do hinário está identificado.\n")
        for c, (q, ns) in sorted(desconhecidos.items()):
            f.write(f"  U+{c:04X}  {q}x  nos hinos {sorted(n for n in ns if n)[:15]}\n")
    print(f"  (o que conferir da partitura está em {alvo.name})")


def diagnostico(caminho, paginas=10):
    doc = fitz.open(conferir_caminho(caminho))
    saida = Path(__file__).parent / "diagnostico.txt"
    with open(saida, "w", encoding="utf-8") as f:
        f.write(f"arquivo: {caminho}\npáginas no PDF: {doc.page_count}\n")
        for i in range(min(paginas, doc.page_count)):
            pg = doc[i]
            f.write(f"\n{'='*60}\nPÁGINA {i+1}  ({pg.rect.width:.0f} x {pg.rect.height:.0f})\n")
            for y, t in linhas_do_topo(pg):
                if t:
                    f.write(f"  y={y:>4}  {t[:150]}\n")
    doc.close()
    print(f"Diagnóstico gravado em {saida}")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    # Sem caminho não é erro: é o caso comum. O script procura o arquivo.
    caminho = args[0] if args else escolher_hinario()
    if "--diag" in sys.argv:
        diagnostico(caminho)
        return

    hinos = ler(caminho)
    saida = Path(__file__).parent

    # Dois arquivos, de propósito.
    #
    # hinos.csv leva o título junto, para o Anderson conferir de cor se a
    # extração acertou — e fica fora do Git, porque o título é a primeira
    # linha do hino e deste repositório não sai nada do texto do hinário.
    #
    # extracao.csv leva só o que o material publicado usa: número,
    # tonalidade, marcação, metrônomo e indicação. É esse que vai para o Git
    # e é por ele que a tabela do site e da apostila é refeita.
    with open(saida / "hinos.csv", "w", newline="", encoding="utf-8-sig") as f:
        # extrasaction="ignore": os registros carregam campos internos (impresso)
        # que não vão para o CSV. Sem isso, o DictWriter estoura na primeira linha.
        w = csv.DictWriter(f, extrasaction="ignore",
                           fieldnames=["n", "conf", "titulo", "tom", "marcacao", "met", "ind",
                                       "fc", "ritmo", "rbase", "razao", "selo", "sinais", "arco",
                                       "sis", "agudo", "grave", "pag"])
        w.writeheader()
        w.writerows(hinos)

    with open(saida / "extracao.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, extrasaction="ignore",
                           fieldnames=["n", "conf", "tom", "marcacao", "met", "ind",
                                       "fc", "ritmo", "rbase", "sinais", "arco", "sis", "agudo", "grave", "pag"])
        w.writeheader()
        w.writerows(hinos)

    campos = ("n", "titulo", "tom", "marcacao", "met", "ind", "fc", "ritmo", "sinais", "arco")
    confiaveis = [h for h in hinos if h["conf"] not in ("incerto", "avulso") and h["n"]]
    linhas = ",\n".join(
        " {" + ", ".join(f"{k}:{json.dumps(h[k], ensure_ascii=False)}" for k in campos if h[k] not in ("", None)) + "}"
        for h in confiaveis)
    with open(saida / "hinos.js", "w", encoding="utf-8") as f:
        f.write("/* Cabeçalho dos hinos, extraído do hinário. n=número · tom=tonalidade ·\n"
                "   marcacao=movimento de marcação impresso · met=metrônomo · ind=indicação ·\n"
                "   fc=fórmula de compasso · ritmo=ritmo inicial (conferir) · sinais. */\n"
                "const HINOS = [\n" + linhas + "\n];\n")

    avulsos = [h for h in hinos if h["conf"] == "avulso"]
    numeros = {h["n"] for h in confiaveis}
    faltando = [n for n in range(1, 481) if n not in numeros]
    incertos = [h for h in hinos if h["conf"] == "incerto"]
    if not hinos:
        print("\nNenhuma página de abertura de hino foi reconhecida.")
        print("Isso quer dizer que o PDF abriu, mas o cabeçalho não está onde o script procura.")
        print("Rode de novo com --diag: ele grava um relatório do topo das primeiras páginas,")
        print("e é esse relatório que mostra onde os dados realmente estão.")
        return
    print(f"\n{len(hinos)} páginas de abertura lidas.")
    print(f"  número impresso na página: {sum(1 for h in hinos if h['conf']=='impresso')}")
    print(f"  número deduzido com segurança: {sum(1 for h in hinos if h['conf']=='inferido')}")
    print(f"  número incerto (ficam de fora do .js): {len(incertos)}")
    print(f"  avulsos do fim do livro (numeração própria, fora do .js): {len(avulsos)}")
    print(f"  com tonalidade: {sum(1 for h in hinos if h['tom'])}")
    print(f"  com marcação (em 2, em 6...): {sum(1 for h in hinos if h['marcacao'])}")
    print(f"  com metrônomo: {sum(1 for h in hinos if h['met'])}")
    print(f"  com indicação interpretativa: {sum(1 for h in hinos if h['ind'])}")
    print(f"  com fórmula de compasso: {sum(1 for h in hinos if h['fc'])}")
    for r in ("tético", "anacrúsico", "acéfalo"):
        print(f"  ritmo inicial {r} (conferir): {sum(1 for h in hinos if h['ritmo'] == r)}")
    print(f"  ritmo inicial em branco: {sum(1 for h in hinos if not h['ritmo'])}")
    for sn in ("nota pontuada", "fermata", "tercina", "ritornelo"):
        print(f"  com {sn}: {sum(1 for h in hinos if sn in h['sinais'])}")
    for a in ("baixo", "cima"):
        print(f"  começa com arco para {a}: {sum(1 for h in hinos if h['arco'] == a)}")
    if faltando:
        print(f"  números de 1 a 480 ainda sem hino ({len(faltando)}): {faltando[:20]}{' ...' if len(faltando) > 20 else ''}")
    print(f"\nGerados em {saida}/ :")
    print("  hinos.csv     — com os títulos, para você conferir. Fica fora do Git.")
    print("  extracao.csv  — sem os títulos. É este que vai para o repositório.")
    print("  nao-lidas.txt — as páginas que mesmo assim ficaram de fora.")
    print("  partitura.txt — o que conferir da leitura da partitura.")
    print("\nAbra o hinos.csv e veja se uns cinco hinos que você sabe de cor estão certos.")
    print("Depois, no GitHub Desktop: Commit to main e Push origin. Só isso.")


if __name__ == "__main__":
    main()
