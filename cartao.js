/* O cartão de uma casa. Usado no navegador (app.js) e na geração da lista estática (ferramentas/estatico.mjs),
   para a página nunca abrir vazia sem JavaScript. */
(function (w) {
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  var foto = function (id, largura) {
    return 'https://images.unsplash.com/photo-' + id + '?w=' + largura + '&q=70&auto=format&fit=crop';
  };
  var preco = function (v) {
    if (v >= 1e6) return 'R$ ' + (v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi';
    return 'R$ ' + v.toLocaleString('pt-BR');
  };
  var whats = function (numero, texto) {
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
  };

  w.cartao = function (c, numero, grande) {
    var msg = 'Olá! Quero saber mais do imóvel ' + c.codigo + ' (' + c.nome + ', ' + c.bairro + ').';
    var larg = grande ? 1400 : 800;
    return '' +
      '<li class="casa" data-codigo="' + esc(c.codigo) + '">' +
        '<a href="' + whats(numero, msg) + '" target="_blank" rel="noopener" aria-label="' + esc(c.nome + ', ' + c.bairro + ', ' + preco(c.preco) + '. Falar com corretor no WhatsApp') + '">' +
          '<div class="casa-foto">' +
            '<img src="' + foto(c.foto, larg) + '" srcset="' + foto(c.foto, 600) + ' 600w, ' + foto(c.foto, 1000) + ' 1000w, ' + foto(c.foto, 1600) + ' 1600w" ' +
              'sizes="' + (grande ? '(max-width: 960px) 100vw, 66vw' : '(max-width: 760px) 100vw, (max-width: 960px) 50vw, 33vw') + '" ' +
              'alt="Fachada da ' + esc(c.nome) + '" loading="lazy" decoding="async" width="800" height="600">' +
            '<span class="casa-codigo tab">' + esc(c.codigo) + '</span>' +
          '</div>' +
          '<div class="casa-texto">' +
            '<p class="casa-nome">' + esc(c.nome) + '</p>' +
            '<p class="casa-preco">' + preco(c.preco) + '</p>' +
            '<p class="casa-onde">' + esc(c.bairro) + ' · ' + esc(c.cidade) + '</p>' +
            '<p class="casa-ficha">' + c.quartos + ' qts · ' + c.area.toLocaleString('pt-BR') + ' m²</p>' +
            '<span class="casa-acao">Falar sobre esta casa</span>' +
          '</div>' +
        '</a>' +
      '</li>';
  };
  w.cartao.whats = whats;
  w.cartao.foto = foto;
})(typeof window !== 'undefined' ? window : globalThis);
