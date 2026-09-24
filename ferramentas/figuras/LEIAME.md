# Figuras da apostila

Vinte figuras desenhadas em SVG e fotografadas em PNG para entrar na apostila
e no site. Nada é copiado de material de terceiros. Os símbolos musicais vêm da fonte
**Bravura** (Steinberg, padrão SMuFL, licença SIL OFL — ver `fontes/OFL.txt`),
posicionados pelas medidas oficiais de `fontes/bravura_metadata.json`. A
primeira versão desenhava claves e pausas à mão; ficaram feias, e a pausa de
mínima, errada.

Para regenerar:

    node ferramentas/figuras/gera.js     # escreve figuras.html
    node ferramentas/figuras/render.mjs  # grava assets/figuras/*.png

`render.mjs` usa o Chromium do Playwright com deviceScaleFactor 3, porque o
destino é impressão. `figuras.html` é intermediário e não vai para o Git.

Figuras: pentagrama · claves · endecagrama · figuras (de som e de silêncio) ·
acidentes (ordem na armadura) · ritmos-iniciais · sincopa (e contratempo) ·
tercina · ligaduras · ponto (de aumento) · fermata · mov2 mov3 mov4 mov6 mov9
mov12 (movimentos de solfejo) · formula (de compasso) · acentuacao (métrica) ·
cordas-violino.
