#!/usr/bin/env python3
"""Recorta do hinário em PDF a partitura dos hinos que entram na análise.

Por que existe: o Anderson pediu que a análise de hinos ao fim de cada fase
traga o próprio hino na página, como as fichas antigas do GEM — "nem sempre
os alunos estão com o hinário naquele momento". A decisão é dele (24/09/2026).

Cuidados:
- as imagens NÃO vão para o Git (o repositório é público): ficam em
  ferramentas/hinos-img/, que está no .gitignore, e as apostilas que as
  embutem também ficam fora dele;
- o PDF do hinário traz, no meio de cada página, uma marca d'água com o nome,
  o e-mail e o CPF do Anderson. Ela é um fluxo de conteúdo à parte, só com
  esse texto em Helvetica cinza; aqui esse fluxo é esvaziado numa cópia em
  memória antes de renderizar, e nenhuma nota é tocada. A verificação no fim
  confere que o texto sumiu.

O hino vai do seu cabeçalho até o cabeçalho do seguinte — que pode estar no
meio da página —, e pode ocupar mais de uma página: sai uma imagem por página.

Uso:
    node ferramentas/analise.js --lista > /tmp/lista.json
    python ferramentas/recortar-hinos.py caminho/do/Hinario.pdf /tmp/lista.json
"""
import importlib.util
import io
import contextlib
import json
import re
import sys
from pathlib import Path

import pymupdf
from PIL import Image, ImageChops

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI / "hinos-img"
ESCALA = 2.4          # ~173 dpi: nítido na impressão, sem pesar demais o PDF
MARCA = re.compile(rb"ANDERSON|afdalessi|\d{3}\.\d{3}\.\d{3}-\d{2}")
MAESTRO = re.compile(r"\bMaestro\b")   # é o único trecho do hinário com essa palavra


def carregar_extrator():
    spec = importlib.util.spec_from_file_location("extrator", AQUI / "extrair-hinario.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def tirar_marca_dagua(doc):
    """Esvazia o fluxo de conteúdo que só desenha a marca d'água."""
    for pagina in doc:
        for xref in pagina.get_contents():
            fluxo = doc.xref_stream(xref)
            if not MARCA.search(fluxo):
                continue
            # tiram-se só os blocos de texto (BT…ET); o resto do fluxo — o "Q"
            # que fecha o estado gráfico, a troca de cor — fica, para não
            # desequilibrar o conteúdo que vem antes
            resto = re.sub(rb"BT.*?ET", b"", fluxo, flags=re.S)
            if MARCA.search(resto):
                raise SystemExit(f"Marca d'água em formato inesperado na página {pagina.number + 1}")
            doc.update_stream(xref, resto)


def tirar_maestro(doc):
    """O cabeçalho de cada hino traz o nome do maestro responsável pela
    revisão. O Anderson pediu
    que saia (24/09/2026), "para não fazer propaganda de ninguém"; título e
    autor ficam. É um trecho de texto só, e sai por redação: nenhuma nota nem
    linha é tocada (images/graphics = NONE)."""
    for pagina in doc:
        achou = False
        for bloco in pagina.get_text("dict")["blocks"]:
            for linha in bloco.get("lines", []):
                for sp in linha["spans"]:
                    if MAESTRO.search(sp["text"]):
                        r = pymupdf.Rect(sp["bbox"])
                        pagina.add_redact_annot(r + (0.5, 0.5, -0.5, -0.5))
                        achou = True
        if achou:
            pagina.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE,
                                    graphics=pymupdf.PDF_REDACT_LINE_ART_NONE)


def aparar(img):
    """Tira o branco em volta, deixando uma margem pequena."""
    fundo = Image.new(img.mode, img.size, (255, 255, 255))
    caixa = ImageChops.difference(img, fundo).getbbox()
    if not caixa:
        return img
    m = 12
    return img.crop((max(0, caixa[0] - m), max(0, caixa[1] - m),
                     min(img.width, caixa[2] + m), min(img.height, caixa[3] + m)))


def apertar(img, maximo=34):
    """Encurta as faixas brancas entre os sistemas: o hinário deixa um vão
    grande entre eles, e sem isso o hino não cabe com as perguntas na mesma
    página. Nada que tenha tinta é cortado — só linhas inteiramente brancas."""
    cinza = img.convert("L")
    larg, alt = cinza.size
    dados = cinza.load()
    branca = [all(dados[x, y] > 245 for x in range(0, larg, 3)) for y in range(alt)]
    manter, corrida = [], 0
    for y in range(alt):
        corrida = corrida + 1 if branca[y] else 0
        if corrida <= maximo:
            manter.append(y)
    if len(manter) == alt:
        return img
    nova = Image.new(img.mode, (larg, len(manter)), (255, 255, 255))
    for i, y in enumerate(manter):
        nova.paste(img.crop((0, y, larg, y + 1)), (0, i))
    return nova


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    pdf, lista = sys.argv[1], sys.argv[2]
    numeros = set(json.load(open(lista)))
    ext = carregar_extrator()
    with contextlib.redirect_stdout(io.StringIO()):
        hinos = ext.ler(pdf, registrar_falhas=False)
    # os avulsos do fim do livro não entram, mas servem de fronteira: sem
    # eles, o hino 480 iria até a última página
    ordem = sorted(hinos, key=lambda h: (h["pag"], h.get("y", 0)))

    doc = pymupdf.open(pdf)
    tirar_marca_dagua(doc)
    tirar_maestro(doc)
    SAIDA.mkdir(exist_ok=True)
    feitos = {}
    for i, h in enumerate(ordem):
        if h["conf"] == "avulso" or h["n"] not in numeros:
            continue
        prox = ordem[i + 1] if i + 1 < len(ordem) else None
        ultima = prox["pag"] if prox else doc.page_count
        partes = []
        for n in range(h["pag"], ultima + 1):
            pg = doc[n - 1]
            topo = max(0, h.get("y", 0) - 8) if n == h["pag"] else 0
            fim = prox.get("y", 0) - 6 if prox and n == prox["pag"] else pg.rect.height
            if fim - topo < 40:            # o próximo hino começa no alto: nada deste aqui
                continue
            pix = pg.get_pixmap(matrix=pymupdf.Matrix(ESCALA, ESCALA),
                                clip=pymupdf.Rect(0, topo, pg.rect.width, fim), alpha=False)
            img = apertar(aparar(Image.frombytes("RGB", (pix.width, pix.height), pix.samples)))
            if img.height < 60:
                continue
            partes.append(img)
        for k, img in enumerate(partes, 1):
            destino = SAIDA / f"{h['n']:03d}-{k}.png"
            img.quantize(colors=48, method=Image.Quantize.MEDIANCUT).save(destino, optimize=True)
        feitos[h["n"]] = len(partes)

    # prova: o texto da marca não existe mais em nenhuma página usada
    for n in {h["pag"] for h in ordem if h["n"] in numeros and h["conf"] != "avulso"}:
        texto = doc[n - 1].get_text()
        if MARCA.search(texto.encode("utf-8")):
            raise SystemExit(f"A marca d'água continua na página {n}")
        if MAESTRO.search(texto):
            raise SystemExit(f"O nome do maestro continua na página {n}")
    faltam = sorted(numeros - set(feitos))
    print(f"{sum(feitos.values())} imagens de {len(feitos)} hinos em {SAIDA.name}/"
          + (f" — sem imagem: {faltam}" if faltam else ""))


if __name__ == "__main__":
    main()
