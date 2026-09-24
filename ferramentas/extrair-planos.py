#!/usr/bin/env python3
"""Refaz dados/planos.js a partir dos quatro PDFs "Planos de Aulas do MSA".

Por que existe: dados/planos.js fica fora do Git (ver dados/LEIAME-planos.md),
e por isso some a cada máquina nova ou sessão nova. Sem ele, o caderno do
instrutor sai sem a página de roteiro. Este script o refaz em segundos a partir
dos PDFs oficiais, que ficam no Drive do Anderson, em
00 - CCB - Música / CONJUNTO DE MATERIAIS DIDÁTICOS / N. Período / Planos de Aula.

Uso:
    python ferramentas/extrair-planos.py p1.pdf p2.pdf p3.pdf p4.pdf

A ordem dos arquivos não importa: o período é lido do cabeçalho de cada PDF.

Como o PDF se organiza: cada aula começa com a linha "4º Período – Aula 08";
depois vêm FASE, AULA, TÓPICO, VERSÃO e as seções Tema, Habilidades,
Objetivos, Conteúdo, Duração, Recursos didáticos básicos, Recursos didáticos
complementares, Metodologia, Avaliação e Referências. Os itens começam com um
marcador — "▪" do 2º período em diante; no 1º, um símbolo da fonte Wingdings
que sai como caractere de uso privado, e que às vezes se perde no último item
da seção.
"""
import json
import re
import sys
from pathlib import Path

import pymupdf

SECOES = [
    ("tema", r"Tema"), ("habilidades", r"Habilidades"), ("objetivos", r"Objetivos"),
    ("conteudo", r"Conteúdo"), ("duracao", r"Duração"),
    ("recursos", r"Recursos didáticos básicos"),
    ("extras", r"Recursos didáticos complementares"),
    ("metodologia", r"Metodologia"), ("avaliacao", r"Avaliação"),
    ("refs", r"Referências"),
]
MARCADOR = re.compile(r"^[▪•-]\s*")
CABECA_AULA = re.compile(r"^(\d)º Período\s+[–-]\s+Aula\s+(\d{1,2})\b")


def linhas_do_pdf(caminho):
    doc = pymupdf.open(caminho)
    periodo, saida = None, []
    for pg in doc:
        for ln in pg.get_text().splitlines():
            t = ln.strip()
            m = re.search(r"Planos de Aulas do MSA\s+[–-]\s+(\d)º Período", t)
            if m:
                periodo = int(m.group(1))
                continue
            if (not t or t.startswith("Grupo de Estudos Musicais") or re.fullmatch(r"_+", t)
                    or t.startswith("Congregação Cristã no Brasil")):
                continue
            saida.append(t)
    return periodo, saida


def juntar_secoes(linhas):
    """As palavras "Recursos / didáticos / básicos" vêm em três linhas: junta."""
    texto = "\n".join(linhas)
    texto = re.sub(r"Recursos\s*\n\s*didáticos\s*\n\s*básicos", "Recursos didáticos básicos", texto)
    texto = re.sub(r"Recursos\s*\n\s*didáticos\s*\n\s*complementares", "Recursos didáticos complementares", texto)
    return [l.strip() for l in texto.split("\n")]


def itens(linhas):
    """Linhas de uma seção → lista de itens. Item novo quando há marcador, ou
    quando a linha anterior fechou frase e esta começa com maiúscula (é o caso
    do marcador perdido no último item, no PDF do 1º período)."""
    out = []
    for l in linhas:
        tem_marca = bool(MARCADOR.match(l))
        l = MARCADOR.sub("", l).strip()
        if not l:
            continue
        novo = tem_marca or not out or (out[-1].rstrip().endswith((".", ";", ":")) and l[:1].isupper())
        if novo:
            out.append(l)
        else:
            out[-1] = (out[-1].rstrip() + " " + l).replace("- ", "-") if out[-1].endswith("-") else out[-1].rstrip() + " " + l
    # sem o ponto final: na apostila cada item é uma linha de lista
    return [re.sub(r"(?<!\.)\.$", "", re.sub(r"\s+", " ", x).strip()) for x in out]


def planos_do_periodo(periodo, linhas):
    aulas, atual = [], None
    for l in linhas:
        m = CABECA_AULA.match(l)
        if m and int(m.group(1)) == periodo:
            atual = {"a": int(m.group(2)), "linhas": []}
            aulas.append(atual)
        elif atual is not None:
            atual["linhas"].append(l)
    # o índice do PDF também tem "4º Período – Aula 01 .....": descarta as
    # entradas sem corpo e fica com a última ocorrência de cada aula
    por_aula = {}
    for a in aulas:
        if any(l.startswith("Tema") for l in a["linhas"]):
            por_aula[a["a"]] = a
    planos = []
    for num in sorted(por_aula):
        ls = juntar_secoes(por_aula[num]["linhas"])
        corpo = "\n".join(ls)
        fase = re.search(r"FASE\s*\n?\s*(\d+)", corpo)
        topico = re.search(r"TÓPICOS?:\s*(.+)", corpo)
        topico = topico.group(1).strip() if topico else ""
        fase = int(fase.group(1)) if fase else None
        # O PDF do 1º período repete "FASE 01" nas aulas 13 a 15, que são da
        # fase 3 (tópicos 3.4 a 3.6). O tópico não mente: a fase é o número
        # antes do ponto.
        m = re.match(r"(\d+)\.", topico)
        if m:
            fase = int(m.group(1))
        plano = {"p": periodo, "fase": fase, "a": num, "topico": topico}
        # corta nas seções
        marcas = []
        for chave, rotulo in SECOES:
            for i, l in enumerate(ls):
                if l == rotulo or l.rstrip() == rotulo:
                    marcas.append((i, chave))
                    break
        marcas.sort()
        for k, (i, chave) in enumerate(marcas):
            fim = marcas[k + 1][0] if k + 1 < len(marcas) else len(ls)
            bloco = ls[i + 1:fim]
            if chave == "tema":
                plano["tema"] = re.sub(r"(?<!\.)\.$", "", re.sub(r"\s+", " ", " ".join(bloco)).strip())
            elif chave == "duracao":
                plano["duracao"] = " ".join(itens(bloco))
            else:
                plano[chave] = itens(bloco)
        planos.append(plano)
    return planos


def main():
    arquivos = sys.argv[1:]
    if not arquivos:
        sys.exit(__doc__)
    PLANOS = {}
    for arq in arquivos:
        periodo, linhas = linhas_do_pdf(arq)
        if not periodo:
            sys.exit(f"Não achei o período no cabeçalho de {arq}")
        PLANOS[periodo] = planos_do_periodo(periodo, linhas)
        print(f"{periodo}º período: {len(PLANOS[periodo])} planos — {Path(arq).name}")
    alvo = Path(__file__).resolve().parent.parent / "dados" / "planos.js"
    with open(alvo, "w", encoding="utf-8") as f:
        f.write("/* Planos de Aula oficiais do MSA — material interno do GEM, fora do Git.\n"
                "   Gerado por ferramentas/extrair-planos.py; ver dados/LEIAME-planos.md. */\n")
        f.write("const PLANOS = " + json.dumps(PLANOS, ensure_ascii=False, indent=1) + ";\n")
        f.write('if (typeof module !== "undefined") module.exports = { PLANOS };\n')
    print(f"Gravado em {alvo}")


if __name__ == "__main__":
    main()
