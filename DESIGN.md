# Mirante — DESIGN.md

Template de site para imobiliária de alto padrão. HTML, CSS e JS puros, sem build.

**Skill que se aplica:** `lucas-patterns` (processo `criar`). A direção completa está em `.lucas/direcao.md`.

## Ideia
"Comece pela vista." A primeira tela é a paisagem; escolher a vista é o gesto principal. Escolher Mar, Serra, Lago ou Cidade troca a foto
(transição WebGL com onda de ruído) e filtra a lista de casas logo abaixo. O filtro fica no endereço (`?vista=serra&quartos=4`).

## Decisões
- Paleta **Concreto** (escolhida pelo Lucas): concreto `#e7e7e3`, grafite `#1d1d1b`, cobre `#8c4a2b`; sobre a foto, texto claro
  com véu escuro e a palavra-chave em pêssego claro. Fontes: Bricolage Grotesque (títulos, `opsz 96 / wdth 100`, peso 300) e
  Hanken Grotesk (texto), ambas hospedadas em `fontes/`.
- **Abertura segue a referência à risca, a pedido do Lucas:** lavagem creme com texto escuro e a palavra-chave em cobre, chão com a própria paisagem desfocada, trilho lateral de ícones, sobretítulo
  com traços (que é o seletor de vista), palavra em cor no título, dois botões (ver casas · passear pelas vistas), ficha vertical
  no canto e três cartões flutuantes. Os cartões só mostram dado verdadeiro: casa em destaque da vista (setas percorrem),
  números contados de `imoveis.js` e a chamada para vender. Isso vence a regra de "uma coisa só na primeira tela".
- Filtros de quartos e valor ficam no topo da lista de casas.
- Ação de cada casa: WhatsApp com o código do imóvel na mensagem.
- Um tamanho de botão (`--btn-h`, `--btn-px`, `--btn-fs`); botão escuro com a seta num círculo claro, como na referência.

## Movimento
- Entrada em ~1,2 s: foto assenta (scale 1.08 → 1), título sobe linha por linha atrás de máscara, cartões por último.
- Rolagem (≥ 961 px de largura e ≥ 640 px de altura): a abertura fica presa, encolhe até 90% e arredonda; a lista sobe por cima.
- Textos da ficha, do botão e do destaque rolam ao trocar de vista ou de casa.
- Tudo depende da classe `.movimento` no `<html>`, decidida no `<head>`: sem ela (movimento reduzido no sistema), tudo aparece parado.
  `?movimento=1` força a prévia.

## Para usar o template
1. Troque os dados e o WhatsApp em `imoveis.js`.
2. Rode `node ferramentas/estatico.mjs` (escreve a lista no HTML para quem abre sem JavaScript).
3. Troque as fotos do Unsplash por fotos próprias e revise `privacidade.html` com o jurídico.
