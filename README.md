# Mirante Imóveis — template de imobiliária de alto padrão

**Comece pela vista.** Um site em que a busca começa pelo que se vê da janela (mar, serra, lago ou cidade) e a casa vem depois.

HTML, CSS e JavaScript puros, sem build. Projeto de portfólio de Lucas Sckenal.

## O que tem de diferente

- **Troca de vista em WebGL:** a paisagem muda com uma onda de ruído que nasce no horizonte, e a lista de casas abaixo já vem filtrada.
  Sem WebGL, a foto troca com uma fusão simples.
- **Moldura que nasce na rolagem:** a abertura ocupa a tela; ao rolar, ela fica presa, encolhe até virar uma moldura e a lista sobe por cima.
- **Textos que rolam:** contagem de casas, preço inicial e destaque trocam rolando, atrás de uma máscara.
- **Dado que não mente:** os números da abertura são contados de `imoveis.js`; nenhum depoimento ou métrica inventada.
- **Funciona parado:** com movimento reduzido no sistema, tudo aparece no lugar, sem animação. Sem JavaScript, a lista inteira já está no HTML.
- **Filtro no endereço:** `?vista=serra&quartos=4` abre a busca pronta e pode ser enviado pelo WhatsApp.

## Crédito

O layout da primeira tela (moldura com foto, trilho lateral, sobretítulo com traços e os três cartões flutuantes) foi inspirado
num shot de referência encontrado no Pinterest ("MR L Production — Spaces That Inspire"). Autor: _[preencher com o nome e o link do autor]_.
O conceito "comece pela vista", a troca de vista em WebGL, a moldura na rolagem, os dados e o responsivo são deste projeto.

## Usar como template

1. Troque o WhatsApp, as vistas e os imóveis em `imoveis.js` (tudo ali é exemplo).
2. Rode `node ferramentas/estatico.mjs` para escrever a lista no HTML (para quem abre sem JavaScript).
3. Troque as fotos do Unsplash por fotos próprias e a imagem `og.jpg`.
4. Revise `privacidade.html` com o jurídico da imobiliária.

## Rodar e publicar

```bash
python -m http.server 5178
```

Publicação na Vercel como site estático, sem configuração. `.vercelignore` deixa de fora os arquivos de processo.
Para ver as animações numa máquina com animações do sistema desligadas: `?movimento=1`.

Fotos: [Unsplash](https://unsplash.com). Fontes: Bricolage Grotesque e Hanken Grotesk (SIL Open Font License), recortadas em `fontes/`.
