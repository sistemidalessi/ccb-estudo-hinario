#!/usr/bin/env python3
"""Extrai os dados de cabeçalho de cada hino do hinário em PDF.

Por que existe: as questões do banco dizem "o hino indicado" porque não havia
uma tabela com os dados dos hinos. Com essa tabela, cada aula do MSA pode
fechar com hinos escolhidos pelo conceito que acabou de ser estudado — fora da
ordem do hinário, na ordem da teoria.

O que ele lê: só a faixa superior de cada página, onde fica o cabeçalho do hino
(número, título, tonalidade, marcação de metrônomo, indicação interpretativa).
A partitura não é lida nem reproduzida.

Uso:
    pip install pymupdf
    python ferramentas/extrair-hinario.py caminho/do/Hinario.pdf

Saída (na pasta do script):
    hinos.csv     para você conferir e corrigir numa planilha
    hinos.js      no formato que o site e a apostila consomem

Se a saída vier torta, rode com --debug para ver o texto cru dos cabeçalhos das
primeiras páginas e me mande essas linhas: o ajuste é no padrão, não no resto.
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
        import fitz  # versões antigas da mesma biblioteca
    except ImportError:
        sys.exit("Falta a biblioteca: pip install pymupdf")

# a marca d'água personalizada do exemplar, que polui o texto
LIXO = re.compile(r"ANDERSON|FERNANDES|DALESSI|\bafdalessi\S*|\S*@\S+\.\w+|\d{3}\.\d{3}\.\d{3}-\d{2}", re.I)

NOTA = r"(?:D[oó]|R[eé]|Mi|F[aá]|Sol|L[aá]|Si)"
# o bemol/sustenido não é caractere de palavra: nada de \b depois dele
NUM_TOM = re.compile(r"\b(\d{1,3})\s+(" + NOTA + r")(♭|♯|b|#)?")
TOM_SOZINHO = re.compile(r"^(" + NOTA + r")(♭|♯|b|#)?$")
METRONOMO = re.compile(r"(\d{2,3})\s*-\s*(\d{2,3})\s*\(?\s*(\d{2,3})?\s*\)?")
COMPASSO = re.compile(r"\b([234689]|12)\s*/\s*([248])\b")
# indicações que aparecem no alto da página, antes da pauta
INDICACOES = re.compile(
    r"\b(maestoso|moderato|andante|adagio|allegro|larghetto|largo|lento|vivace|"
    r"fluido|legatissimo|grandioso|expressivo|marcial|sereno|suave|solene)\b", re.I)

FAIXA_CABECALHO = 0.16  # 16% do topo da página


def cabecalho(pagina):
    """Texto da faixa superior da página, na ordem de leitura."""
    altura = pagina.rect.height
    palavras = pagina.get_text("words")  # x0, y0, x1, y1, palavra, ...
    do_topo = [p for p in palavras if p[1] < altura * FAIXA_CABECALHO]
    do_topo.sort(key=lambda p: (round(p[1] / 6), p[0]))  # linha, depois coluna
    texto = " ".join(p[4] for p in do_topo)
    return re.sub(r"\s+", " ", LIXO.sub("", texto)).strip()


def ler(caminho, debug=False):
    doc = fitz.open(caminho)
    achados = {}
    for i, pagina in enumerate(doc):
        txt = cabecalho(pagina)
        if debug and i < 12:
            print(f"[pág {i+1}] {txt[:160]}")
        m = NUM_TOM.search(txt)
        if not m:
            continue
        n = int(m.group(1))
        if not 1 <= n <= 480 or n in achados:
            continue  # o hino já foi pego na primeira página dele
        met = METRONOMO.search(txt)
        comp = COMPASSO.search(txt)
        ind = INDICACOES.search(txt)
        achados[n] = {
            "n": n,
            "tom": m.group(2) + (m.group(3) or "").replace("b", "♭").replace("#", "♯"),
            "met": f"{met.group(1)}-{met.group(2)}" + (f" ({met.group(3)})" if met.group(3) else "") if met else "",
            "comp": f"{comp.group(1)}/{comp.group(2)}" if comp else "",
            "ind": ind.group(1).lower() if ind else "",
            "pag": i + 1,
        }
    doc.close()
    return [achados[k] for k in sorted(achados)]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    debug = "--debug" in sys.argv
    if not args:
        sys.exit("Uso: python extrair-hinario.py caminho/do/Hinario.pdf [--debug]")

    hinos = ler(args[0], debug)
    saida = Path(__file__).parent

    with open(saida / "hinos.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=["n", "tom", "comp", "met", "ind", "pag"])
        w.writeheader()
        w.writerows(hinos)

    linhas = ",\n".join(
        " {" + ", ".join(f'{k}:{json.dumps(h[k], ensure_ascii=False)}' for k in ("n", "tom", "comp", "met", "ind") if h[k] != "") + "}"
        for h in hinos)
    with open(saida / "hinos.js", "w", encoding="utf-8") as f:
        f.write("/* Dados de cabeçalho dos hinos, extraídos do hinário.\n"
                "   n=número · tom=tonalidade · comp=fórmula de compasso ·\n"
                "   met=marcação de metrônomo · ind=indicação interpretativa.\n"
                "   Ritmo inicial e sinais (fermata, tercina, síncopa) não saem daqui:\n"
                "   dependem de olhar a partitura. */\n"
                "const HINOS = [\n" + linhas + "\n];\n")

    faltando = [n for n in range(1, 481) if n not in {h["n"] for h in hinos}]
    com_comp = sum(1 for h in hinos if h["comp"])
    print(f"\n{len(hinos)} hinos extraídos de 480.")
    print(f"  com tonalidade: {sum(1 for h in hinos if h['tom'])}")
    print(f"  com fórmula de compasso: {com_comp}")
    print(f"  com metrônomo: {sum(1 for h in hinos if h['met'])}")
    if faltando:
        print(f"  não encontrados ({len(faltando)}): {faltando[:25]}{' ...' if len(faltando) > 25 else ''}")
    print(f"\nArquivos gerados em {saida}/ : hinos.csv e hinos.js")


if __name__ == "__main__":
    main()
