# Figuras da apostila

Vinte figuras desenhadas em SVG e fotografadas em PNG para entrar na apostila
e no site. Nada é copiado de material de terceiros: `desenho.js` traz claves,
figuras, pausas e acidentes como caminhos vetoriais escritos aqui — não há
fonte musical instalada no ambiente e o download de uma é bloqueado.

Para regenerar:

    node ferramentas/figuras/gera.js     # escreve figuras.html
    node ferramentas/figuras/render.mjs  # grava assets/figuras/*.png

`render.mjs` usa o Chromium do Playwright com deviceScaleFactor 2.5, porque o
destino é impressão. `figuras.html` é intermediário e não vai para o Git.

Figuras: pentagrama · claves · endecagrama · figuras (de som e de silêncio) ·
acidentes (ordem na armadura) · ritmos-iniciais · sincopa (e contratempo) ·
tercina · ligaduras · ponto (de aumento) · fermata · mov2 mov3 mov4 mov6 mov9
mov12 (movimentos de solfejo) · formula (de compasso) · acentuacao (métrica) ·
cordas-violino.
