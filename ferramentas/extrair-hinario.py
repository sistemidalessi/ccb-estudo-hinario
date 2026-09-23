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
Cada hino começa numa página nova, então os hinos são contados em sequência e
o contador é re-sincronizado toda vez que um número aparece escrito.

A partitura não é lida nem reproduzida: o script olha só a faixa do cabeçalho.

Uso:
    pip install pymupdf
    python ferramentas/extrair-hinario.py caminho/do/Hinario.pdf
    python ferramentas/extrair-hinario.py caminho/do/Hinario.pdf --diag
"""
import csv
import json
import re
import sys
from pathlib import Path

try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        sys.exit("Falta a biblioteca: pip install pymupdf")

LIXO = re.compile(r"ANDERSON|FERNANDES|DALESSI|\bafdalessi\S*|\S*@\S+\.\w+|\d{3}\.\d{3}\.\d{3}-\d{2}", re.I)
NOTA = re.compile(r"^(D[oó]|R[eé]|Mi|F[aá]|Sol|L[aá]|Si)(♭|♯)?$")
METRONOMO = re.compile(r"=\s*(\d{2,3})\s*-\s*(\d{2,3})\s*\(?\s*(\d{2,3})?\s*\)?")
MARCACAO = re.compile(r"\b(?:em|in)\s+(2|3|4|6|9|12)\b", re.I)
NUMERO = re.compile(r"^(\d{1,3})\.?$")
# As indicações interpretativas do hinário são seis, e só seis, conforme o
# caderno de atividades do 4º período do GEM. Uma primeira versão deste script
# procurava termos italianos de andamento (maestoso, adagio, allegro...) e
# devolvia palavras que não são indicação interpretativa nenhuma.
INDICACOES = re.compile(
    r"\b(solene|majestoso|com\s+j[úu]bilo|com\s+venera[çc][ãa]o|"
    r"com\s+submiss[ãa]o|com\s+humildade)\b", re.I)

TOPO = 100   # os cabeçalhos ficam todos acima de y=100
TOPO_RELATORIO = 320  # o relatório olha mais abaixo: se o cabeçalho de alguma
                      # página estiver fora da faixa de leitura, é aqui que aparece


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


def dados_da_pagina(linhas, contador=0):
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
    # a tonalidade cai em y=42 ou y=48 conforme o hino: varre as duas
    faixa_tom = " ".join(t for y, t in linhas if 34 <= y <= 62)
    # "Sol," e "Ré." saem do extrator com a pontuação colada e não casavam com
    # NOTA, que é ancorada. Tirar a pontuação das pontas não transforma nenhuma
    # outra palavra em nota: ou já era nota, ou continua não sendo.
    limpos = [tk.strip(".,;:·)(\u2013-") for tk in faixa_tom.split()]
    tom = next((tk for tk in limpos if NOTA.match(tk)), "")

    if not titulo or not tom:
        return None, contador  # não é a página de abertura de um hino

    contador += 1
    impresso = None
    for y, t in linhas:
        if 24 <= y <= 40:
            m = NUMERO.match(t.strip())
            if m and 1 <= int(m.group(1)) <= 480:
                impresso = int(m.group(1))
                break

    cabecalho = " ".join(t for _, t in linhas)
    met = METRONOMO.search(cabecalho)
    # A marcação "em 2" / "em 6" cai ora junto da tonalidade, ora na linha do
    # título ("Ó Pai celestial 142 Em 6"). Procura nas duas, nessa ordem.
    # Fora daí (y≈6) há anotações como "Pode agrupar frases em 4", que são
    # orientação de execução e não a marcação do hino — por isso não entram.
    marc = MARCACAO.search(faixa_tom) or MARCACAO.search(por_y.get(18, "")) \
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

    # antes da primeira âncora e depois da última, conta para trás e para frente
    if anc:
        prim, ult = anc[0], anc[-1]
        for k in range(1, prim + 1):
            if hinos[prim]["impresso"] - k >= 1:
                hinos[prim - k]["n"] = hinos[prim]["impresso"] - k
                hinos[prim - k]["conf"] = "inferido"
        for k in range(1, len(hinos) - ult):
            hinos[ult + k]["n"] = hinos[ult]["impresso"] + k
            hinos[ult + k]["conf"] = "inferido"
    return hinos


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


def recuperar(hinos, descartadas, base, total):
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
            com_texto = [y for y, t in linhas if t]
            if not com_texto:
                continue        # página só de pauta: é continuação mesmo
            delta = min(com_texto) - base
            if delta <= 0:
                continue        # não está deslocada para baixo; não é este o caso
            dados, _ = dados_da_pagina([(y - delta, t) for y, t in linhas])
            if not dados:
                continue
            dados["pag"] = pag
            hinos.append(dados)
            del descartadas[pag]
            recuperados.append(pag)
            achou = True
        if not achou:
            break
        hinos.sort(key=lambda h: h["pag"])
        numerar(hinos)
    return recuperados


def ler(caminho, registrar_falhas=True):
    p = conferir_caminho(caminho)
    doc = fitz.open(p)
    print(f"Lendo {p.name} — {doc.page_count} páginas, {p.stat().st_size / 1048576:.0f} MB")
    hinos, contador, descartadas, topos = [], 0, {}, []
    for i, pagina in enumerate(doc):
        linhas = linhas_do_topo(pagina)
        dados, contador = dados_da_pagina(linhas, contador)
        if dados:
            dados["pag"] = i + 1
            hinos.append(dados)
            alturas = [y for y, t in linhas if t]
            if alturas:
                topos.append(min(alturas))
        else:
            # guarda uma faixa mais alta: se o cabeçalho desta página estiver
            # abaixo de onde a leitura procura, é assim que ele aparece.
            descartadas[i + 1] = linhas_do_topo(pagina, TOPO_RELATORIO)
    total = doc.page_count
    doc.close()
    numerar(hinos)

    # altura em que o cabeçalho começa nas páginas que deram certo — é por ela
    # que as páginas deslocadas são realinhadas na segunda passada.
    recuperados = []
    if topos:
        base = sorted(topos)[len(topos) // 2]
        recuperados = recuperar(hinos, descartadas, base, total)
        if recuperados:
            print(f"  {len(recuperados)} aberturas recuperadas numa segunda leitura "
                  "(cabeçalho impresso mais abaixo do que nas outras páginas)")

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
            f.write("Cada bloco abaixo é uma dessas páginas suspeitas. O texto vem da\n"
                    f"faixa de cima da página (até y={TOPO_RELATORIO}), já sem a marca d'água\n"
                    "com os dados pessoais. A leitura só procura até y=%d: o que\n"
                    "aparecer abaixo disso é justamente o que ela não está vendo.\n" % TOPO)
            if not suspeitas:
                f.write("\nNenhuma página suspeita: a conta dos números impressos fecha em\n"
                        "todos os trechos. O que falta, falta do próprio PDF.\n")
            for pag in sorted(suspeitas):
                na, nb, faltam = suspeitas[pag]
                f.write(f"\n{'='*60}\nPÁGINA {pag}"
                        f"   (entre os hinos {na} e {nb}; faltam {faltam} ali)\n")
                linhas = [(y, t) for y, t in descartadas.get(pag, []) if t]
                if not linhas:
                    f.write("  (nenhum texto na faixa de cima — provável página só de pauta)\n")
                for y, t in linhas:
                    f.write(f"  y={y:>4}  {t[:150]}\n")
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
    if not args:
        sys.exit("Uso: python extrair-hinario.py caminho/do/Hinario.pdf [--diag]")
    if "--diag" in sys.argv:
        diagnostico(args[0])
        return

    hinos = ler(args[0])
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
    confiaveis = [h for h in hinos if h["conf"] != "incerto" and h["n"]]
    linhas = ",\n".join(
        " {" + ", ".join(f"{k}:{json.dumps(h[k], ensure_ascii=False)}" for k in campos if h[k] not in ("", None)) + "}"
        for h in confiaveis)
    with open(saida / "hinos.js", "w", encoding="utf-8") as f:
        f.write("/* Cabeçalho dos hinos, extraído do hinário. n=número · tom=tonalidade ·\n"
                "   marcacao=movimento de marcação impresso · met=metrônomo · ind=indicação.\n"
                "   Ritmo inicial e sinais da partitura não saem daqui. */\n"
                "const HINOS = [\n" + linhas + "\n];\n")

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
