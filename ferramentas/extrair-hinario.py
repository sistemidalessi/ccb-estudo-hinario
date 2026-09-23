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

A partitura não é lida nem reproduzida: o script olha só a faixa do cabeçalho.

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
# A partitura deste PDF não é desenho: é texto, escrito com uma fonte musical
# do padrão SMuFL, em que cada símbolo tem um código fixo. Os códigos não
# aparecem na tela — caem na faixa de uso privado do Unicode —, mas estão lá e
# podem ser lidos. É assim que sai o que o cabeçalho não diz: fórmula de
# compasso, nota pontuada, fermata, tercina, ritornelo.
#
# Abaixo só entram os códigos de que se tem certeza. O que não estiver aqui é
# contado à parte, em glifos-desconhecidos.txt, para ser conferido antes de
# virar informação — em vez de ser adivinhado.

SMUFL_DIGITO = range(0xE080, 0xE08A)      # E080..E089 = dígitos 0 a 9 da fórmula
SMUFL_PONTO = 0xE1E7                      # ponto de aumento
SMUFL_FERMATA = range(0xE4C0, 0xE4CA)     # fermata, em todas as durações
SMUFL_RESPIRACAO = range(0xE4CE, 0xE4D0)  # vírgula e tique de respiração
SMUFL_PAUSA = range(0xE4E0, 0xE4F0)       # pausas, da máxima à fusa
SMUFL_RITORNELO = range(0xE040, 0xE044)   # barras de repetição
SMUFL_TERCINA = range(0xE880, 0xE88A)     # dígitos de quiáltera
SMUFL_CABECA = range(0xE0A0, 0xE0A8)      # cabeças de nota
SMUFL_CLAVE = {0xE050: "sol", 0xE062: "fá", 0xE05C: "dó"}
SMUFL_ACIDENTE = {0xE260: "bemol", 0xE261: "bequadro", 0xE262: "sustenido"}
SMUFL_CONHECIDOS = (set(SMUFL_DIGITO) | {SMUFL_PONTO} | set(SMUFL_FERMATA)
                    | set(SMUFL_RESPIRACAO) | set(SMUFL_PAUSA)
                    | set(SMUFL_RITORNELO) | set(SMUFL_TERCINA)
                    | set(SMUFL_CABECA) | set(SMUFL_CLAVE) | set(SMUFL_ACIDENTE))

USO_PRIVADO = range(0xE000, 0xF900)


def glifos_da_pagina(pagina):
    """Símbolos musicais da página, como (y, x, código), na ordem da leitura."""
    saida = []
    for bloco in pagina.get_text("rawdict")["blocks"]:
        for linha in bloco.get("lines", []):
            for trecho in linha.get("spans", []):
                for c in trecho.get("chars", []):
                    cod = ord(c["c"])
                    if cod in USO_PRIVADO:
                        saida.append((round(c["bbox"][1]), round(c["bbox"][0]), cod))
    saida.sort(key=lambda g: (round(g[0] / 6), g[1]))
    return saida


def formulas(glifos):
    """Fórmulas de compasso: pares de dígitos empilhados, o de cima sobre o de
    baixo. Na fonte eles saem lado a lado na ordem de leitura, primeiro o
    numerador. Só conta par que dê uma fórmula que existe em música."""
    digitos = [g for g in glifos if g[2] in SMUFL_DIGITO]
    achadas = []
    for (y1, x1, c1), (y2, x2, c2) in zip(digitos, digitos[1:]):
        num, den = c1 - 0xE080, c2 - 0xE080
        if abs(x1 - x2) > 14 or den not in (2, 4, 8, 16) or not 1 <= num <= 12:
            continue
        f = f"{num}/{den}"
        if f not in achadas:
            achadas.append(f)
    return achadas


def ritmo_inicial(glifos):
    """Só o que dá para afirmar: o hino que abre com pausa é acéfalo.

    Distinguir tético de anacrúsico exigiria somar a duração do primeiro
    compasso, e a duração não está legível: quando as notas são ligadas por
    barra, a barra é traço desenhado e não símbolo, e a cabeça de nota sozinha
    não diz se vale semínima ou colcheia. Chutar aqui seria inventar, então
    esses dois ficam em branco, para o instrutor decidir.
    """
    depois = False
    for _, _, cod in glifos:
        if cod in SMUFL_DIGITO:
            depois = True
            continue
        if not depois:
            continue
        if cod in SMUFL_PAUSA:
            return "acéfalo"
        if cod in SMUFL_CABECA:
            return ""
    return ""


def sinais(glifos):
    """O que a partitura deste hino traz, dos sinais que a apostila estuda."""
    cods = {g[2] for g in glifos}
    tem = []
    if SMUFL_PONTO in cods:
        tem.append("nota pontuada")
    if cods & set(SMUFL_FERMATA):
        tem.append("fermata")
    if cods & set(SMUFL_TERCINA):
        tem.append("tercina")
    if cods & set(SMUFL_RITORNELO):
        tem.append("ritornelo")
    if cods & set(SMUFL_RESPIRACAO):
        tem.append("respiração")
    return tem


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
    doc.close()
    numerar(hinos)

    recuperados = recuperar(hinos, descartadas, total)
    if recuperados:
        print(f"  {len(recuperados)} aberturas recuperadas numa segunda leitura "
              "(hino que começa no meio da página, e não no alto)")

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
                           fieldnames=["n", "conf", "titulo", "tom", "marcacao", "met", "ind", "pag"])
        w.writeheader()
        w.writerows(hinos)

    with open(saida / "extracao.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, extrasaction="ignore",
                           fieldnames=["n", "conf", "tom", "marcacao", "met", "ind", "pag"])
        w.writeheader()
        w.writerows(hinos)

    campos = ("n", "titulo", "tom", "marcacao", "met", "ind")
    confiaveis = [h for h in hinos if h["conf"] not in ("incerto", "avulso") and h["n"]]
    linhas = ",\n".join(
        " {" + ", ".join(f"{k}:{json.dumps(h[k], ensure_ascii=False)}" for k in campos if h[k] not in ("", None)) + "}"
        for h in confiaveis)
    with open(saida / "hinos.js", "w", encoding="utf-8") as f:
        f.write("/* Cabeçalho dos hinos, extraído do hinário. n=número · tom=tonalidade ·\n"
                "   marcacao=movimento de marcação impresso · met=metrônomo · ind=indicação.\n"
                "   Ritmo inicial e sinais da partitura não saem daqui. */\n"
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
    if faltando:
        print(f"  números de 1 a 480 ainda sem hino ({len(faltando)}): {faltando[:20]}{' ...' if len(faltando) > 20 else ''}")
    print(f"\nGerados em {saida}/ :")
    print("  hinos.csv     — com os títulos, para você conferir. Fica fora do Git.")
    print("  extracao.csv  — sem os títulos. É este que vai para o repositório.")
    print("  nao-lidas.txt — as páginas que mesmo assim ficaram de fora.")
    print("\nAbra o hinos.csv e veja se uns cinco hinos que você sabe de cor estão certos.")
    print("Depois, no GitHub Desktop: Commit to main e Push origin. Só isso.")


if __name__ == "__main__":
    main()
