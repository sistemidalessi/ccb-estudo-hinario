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
INDICACOES = re.compile(
    r"\b(maestoso|moderato|andante|andantino|adagio|allegro|allegretto|larghetto|largo|lento|"
    r"vivace|fluido|legatissimo|grandioso|expressivo|marcial|sereno|suave|solene|choroso|"
    r"dolente|majestoso|vibrante|terno|calmo|decidido|jubiloso)\b", re.I)

TOPO = 100  # os cabeçalhos ficam todos acima de y=100


def linhas_do_topo(pagina):
    """Linhas de texto da faixa do cabeçalho, como (y, texto)."""
    palavras = [w for w in pagina.get_text("words") if w[4].strip() and w[1] < TOPO]
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
    tom = next((tk for tk in faixa_tom.split() if NOTA.match(tk)), "")

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
        "ind": ind.group(1).lower() if ind else "",
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


def ler(caminho, registrar_falhas=True):
    doc = fitz.open(caminho)
    hinos, contador, falhas = [], 0, []
    for i, pagina in enumerate(doc):
        linhas = linhas_do_topo(pagina)
        dados, contador = dados_da_pagina(linhas, contador)
        if dados:
            dados["pag"] = i + 1
            hinos.append(dados)
        elif linhas and len(falhas) < 15:
            falhas.append((i + 1, linhas))
    doc.close()
    numerar(hinos)
    if registrar_falhas and falhas:
        alvo = Path(__file__).parent / "nao-lidas.txt"
        with open(alvo, "w", encoding="utf-8") as f:
            f.write("Páginas que o script não reconheceu como abertura de hino.\n"
                    "A primeira costuma ser a capa; as outras é que interessam.\n")
            for pag, linhas in falhas:
                f.write(f"\n{'='*60}\nPÁGINA {pag}\n")
                for y, t in linhas:
                    if t:
                        f.write(f"  y={y:>4}  {t[:150]}\n")
        print(f"  (páginas não reconhecidas registradas em {alvo.name})")
    return hinos


def diagnostico(caminho, paginas=10):
    doc = fitz.open(caminho)
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

    with open(saida / "hinos.csv", "w", newline="", encoding="utf-8-sig") as f:
        # extrasaction="ignore": os registros carregam campos internos (impresso)
        # que não vão para o CSV. Sem isso, o DictWriter estoura na primeira linha.
        w = csv.DictWriter(f, extrasaction="ignore",
                           fieldnames=["n", "conf", "titulo", "tom", "marcacao", "met", "ind", "pag"])
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
    print(f"\nGerados em {saida}/ : hinos.csv e hinos.js")
    print("Confira no CSV alguns hinos que você conhece de cor antes de mandar.")


if __name__ == "__main__":
    main()
