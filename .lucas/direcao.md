# Direção — Mirante (template de imobiliária)

**Dor:** template para uma imobiliária de alto padrão que ainda não existe. A dor típica do segmento: o cliente compra a
vista e o estilo de vida, mas os sites obrigam a começar por bairro, quartos e preço, como num portal.

**A ideia:** "Comece pela vista." A busca começa pelo que a pessoa quer ver da janela: Mar, Serra, Lago ou Cidade.
A foto da primeira tela troca para aquela vista e a lista de casas abaixo já vem filtrada.

**Estrutura (lida da referência do Pinterest, sem copiar cor nem fonte):**
1. Foto inteira numa moldura arredondada sobre um chão neutro; marca à esquerda, navegação em pílula no centro real, ação à direita.
2. Título enorme no alto à esquerda; o resto da foto respira.
3. Três cartões flutuantes embaixo (destaque, números, chamada para vender), com dado real. Depois, a pedido do Lucas,
   a abertura passou a seguir a referência à risca e a ocupar a tela inteira; a moldura aparece só na rolagem.

**Peça técnica:** `shader` adaptado — transição WebGL entre as vistas com uma onda de ruído que "revela" a nova paisagem,
e paralaxe leve com o mouse. Reserva: troca suave das `<img>` em CSS. Sem JS: a foto do mar e a lista inteira.

**O que a pessoa conta amanhã:** "No site da imobiliária você escolhe a vista primeiro, e a casa vem depois."

**Conceitos descartados:** busca por hora do dia (a casa na luz de agora); mapa desenhado à mão; "monte sua casa" por cômodos.
