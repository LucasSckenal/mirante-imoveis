/* Mirante — a busca começa pela vista.
   1) filtro e lista (funciona sempre)  2) transição WebGL entre vistas (se der; senão, troca suave das imagens). */
(function () {
  'use strict';
  var M = window.MIRANTE;
  var $ = function (s) { return document.querySelector(s); };
  /* ?movimento=1: prévia para quem tem as animações do sistema desligadas e quer ver como fica.
     Ignora a preferência só nesta visita; sem o parâmetro, o site respeita o movimento reduzido. */
  // A decisão é tomada no <head> (classe .movimento no <html>), antes da primeira pintura.
  var reduz = { get matches() { return !document.documentElement.classList.contains('movimento'); } };

  var el = {
    moldura: $('#moldura'), img: $('#vista-img'), canvas: $('#vista-gl'),
    vistas: $('#vistas'), botoesVista: document.querySelectorAll('#vistas [data-vista]'),
    verTexto: $('#ver-texto'), fQuartos: $('#f-quartos'), fAte: $('#f-ate'),
    fichaLocal: $('#ficha-local'), fichaN: $('#ficha-n'), fichaDe: $('#ficha-de'),
    prox: $('#prox-vista'), proxImg: $('#prox-img'),
    passeio: $('#passeio'), passeioTexto: $('#passeio-texto'),
    dImg: $('#destaque-img'), dNome: $('#destaque-nome'), dN: $('#destaque-n'), dDesc: $('#destaque-desc'), dLink: $('#destaque-link'),
    casas: $('#casas'), casasN: $('#casas-n'), casasVista: $('#casas-vista'), grade: $('#grade'), vazio: $('#vazio'), limpar: $('#limpar')
  };
  var ordem = Object.keys(M.vistas);
  var w = window.cartao.whats;

  /* ---------- estado, lido do endereço para o link poder ser compartilhado ---------- */
  var q = new URLSearchParams(location.search);
  var estado = {
    vista: M.vistas[q.get('vista')] ? q.get('vista') : 'mar',
    quartos: +q.get('quartos') || 0,
    ate: +q.get('ate') || 0,
    destaque: 0
  };
  el.fQuartos.value = String(estado.quartos);
  el.fAte.value = String(estado.ate);
  if (!el.fQuartos.value) el.fQuartos.value = '0';
  if (!el.fAte.value) el.fAte.value = '0';

  var daVista = function () {
    return M.imoveis.filter(function (c) { return c.vista === estado.vista; })
      .sort(function (a, b) { return b.preco - a.preco; });
  };
  var filtrar = function () {
    return daVista().filter(function (c) {
      return c.quartos >= estado.quartos && (!estado.ate || c.preco <= estado.ate);
    });
  };
  var plural = function (n) { return n === 1 ? '1 casa' : n + ' casas'; };
  var mi = function (v) { return 'R$ ' + (v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi'; };
  var dois = function (n) { return (n < 10 ? '0' : '') + n; };

  /* texto que rola: o antigo sobe e sai, o novo sobe por baixo, atrás de uma máscara.
     Com movimento reduzido (ou sem mudança), só troca. */
  var rolar = function (node, texto) {
    texto = String(texto);
    var atual = node.dataset.texto !== undefined ? node.dataset.texto : node.textContent;
    if (atual === texto) return;
    node.dataset.texto = texto;
    if (reduz.matches || !atual) { node.textContent = texto; return; }
    var caixa = document.createElement('span'); caixa.className = 'rola';
    var sai = document.createElement('span'); sai.className = 'rola-sai'; sai.textContent = atual; sai.setAttribute('aria-hidden', 'true');
    var entra = document.createElement('span'); entra.className = 'rola-entra'; entra.textContent = texto;
    caixa.appendChild(sai); caixa.appendChild(entra);
    node.textContent = ''; node.appendChild(caixa);
    clearTimeout(node._rola);
    node._rola = setTimeout(function () { if (node.dataset.texto === texto) node.textContent = texto; }, 750);
  };

  /* números do cartão do meio: contados dos imóveis, nunca escritos à mão */
  $('#n-imoveis').textContent = M.imoveis.length;
  $('#n-vistas').textContent = ordem.length;
  $('#n-cidades').textContent = new Set(M.imoveis.map(function (c) { return c.cidade; })).size;

  var desenhar = function (animar) {
    var lista = filtrar();
    var v = M.vistas[estado.vista];
    rolar(el.verTexto, lista.length ? 'Ver ' + (lista.length === 1 ? 'a casa' : 'as ' + lista.length + ' casas') : 'Ver as casas');
    el.casasN.textContent = lista.length ? plural(lista.length) + ' ' + v.frase : 'Casas ' + v.frase;
    el.casasVista.textContent = v.nome;
    el.grade.innerHTML = lista.map(function (c, i) { return window.cartao(c, M.whatsapp, i === 0); }).join('');
    el.vazio.hidden = lista.length > 0;
    if (animar) {
      el.grade.classList.remove('troca');
      void el.grade.offsetWidth;
      el.grade.classList.add('troca');
    }
  };

  /* ficha da vista e próxima vista no trilho */
  var desenharVista = function () {
    var v = M.vistas[estado.vista];
    var todas = daVista();
    rolar(el.fichaLocal, v.local);
    rolar(el.fichaN, plural(todas.length));
    rolar(el.fichaDe, todas.length ? 'Desde ' + mi(todas[todas.length - 1].preco) : '');
    var prox = ordem[(ordem.indexOf(estado.vista) + 1) % ordem.length];
    el.prox.setAttribute('aria-label', 'Próxima vista: ' + M.vistas[prox].nome);
    el.proxImg.src = window.cartao.foto(M.vistas[prox].foto, 160);
  };

  /* cartão de destaque: percorre as casas da vista */
  var desenharDestaque = function (animar) {
    var todas = daVista();
    if (!todas.length) return;
    estado.destaque = (estado.destaque + todas.length) % todas.length;
    var c = todas[estado.destaque];
    var pintar = function () {
      el.dImg.src = window.cartao.foto(c.foto, 420);
      el.dImg.alt = 'Fachada da ' + c.nome;
      rolar(el.dNome, c.nome);
      rolar(el.dN, dois(estado.destaque + 1) + ' / ' + dois(todas.length));
      el.dDesc.textContent = c.bairro + ' · ' + c.cidade;
      $('#destaque-preco').innerHTML = mi(c.preco) + ' <small>· ' + c.quartos + ' qts · ' + c.area.toLocaleString('pt-BR') + ' m²</small>';
      el.dLink.href = w(M.whatsapp, 'Olá! Quero saber mais do imóvel ' + c.codigo + ' (' + c.nome + ', ' + c.bairro + ').');
      el.dImg.classList.remove('sai');
      var tr = $('#tracos');
      tr.innerHTML = todas.map(function (_, i) { return '<i' + (i === estado.destaque ? ' class="on"' : '') + '></i>'; }).join('');
    };
    if (!animar) return pintar();
    el.dImg.classList.add('sai');
    var pre = new Image(); pre.src = window.cartao.foto(c.foto, 420);
    var depois = function () { setTimeout(pintar, reduz.matches ? 0 : 180); };
    (pre.decode ? pre.decode() : Promise.resolve()).then(depois, depois);
  };
  $('#destaque-ant').addEventListener('click', function () { estado.destaque--; desenharDestaque(true); });
  $('#destaque-prox').addEventListener('click', function () { estado.destaque++; desenharDestaque(true); });
  el.dLink.target = '_blank'; el.dLink.rel = 'noopener';

  var gravarEndereco = function () {
    var p = new URLSearchParams(location.search);
    p.set('vista', estado.vista);
    estado.quartos ? p.set('quartos', estado.quartos) : p.delete('quartos');
    estado.ate ? p.set('ate', estado.ate) : p.delete('ate');
    history.replaceState(null, '', '?' + p.toString() + location.hash);
  };

  /* ---------- trocar a vista ---------- */
  var escolher = function (vista, foco) {
    if (!M.vistas[vista]) return;
    var mudou = vista !== estado.vista;
    estado.vista = vista;
    el.botoesVista.forEach(function (b) {
      var sim = b.dataset.vista === vista;
      b.setAttribute('aria-checked', String(sim));
      b.tabIndex = sim ? 0 : -1;
      if (sim && foco) b.focus();
    });
    desenhar(mudou);
    if (mudou) { estado.destaque = 0; desenharDestaque(true); desenharVista(); }
    $('#barra-passeio').style.width = ((ordem.indexOf(vista) + 1) / ordem.length * 100) + '%';
    gravarEndereco();
    if (mudou) paisagem.ir(vista);
  };
  var proxima = function () { escolher(ordem[(ordem.indexOf(estado.vista) + 1) % ordem.length]); };

  el.vistas.addEventListener('click', function (e) {
    var b = e.target.closest('[data-vista]');
    if (b) { parar(); escolher(b.dataset.vista); }
  });
  // setas no grupo de rádio, como o teclado espera
  el.vistas.addEventListener('keydown', function (e) {
    var i = ordem.indexOf(estado.vista);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (i + 1) % ordem.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (i - 1 + ordem.length) % ordem.length;
    else return;
    e.preventDefault(); parar();
    escolher(ordem[i], true);
  });
  el.prox.addEventListener('click', function () { parar(); proxima(); });

  /* passeio: troca de vista sozinho a cada 5 s, até a pessoa mexer */
  var timer = null;
  var marcar = function (ligado) {
    el.passeio.setAttribute('aria-pressed', String(ligado));
    el.passeioTexto.textContent = ligado ? 'Pausar o passeio' : 'Passear pelas vistas';
  };
  var parar = function () { if (timer) { clearInterval(timer); timer = null; marcar(false); } };
  var alternar = function () {
    if (timer) return parar();
    proxima();
    timer = setInterval(function () { if (!document.hidden) proxima(); }, 5000);
    marcar(true);
  };
  el.passeio.addEventListener('click', alternar);

  [el.fQuartos, el.fAte].forEach(function (s) {
    s.addEventListener('change', function () {
      estado.quartos = +el.fQuartos.value;
      estado.ate = +el.fAte.value;
      desenhar(true);
      gravarEndereco();
    });
  });

  el.limpar.addEventListener('click', function () {
    estado.quartos = 0; estado.ate = 0;
    el.fQuartos.value = '0'; el.fAte.value = '0';
    desenhar(true); gravarEndereco();
  });

  /* WhatsApp nos botões gerais */
  $('#topo-whats').href = w(M.whatsapp, 'Olá! Procuro uma casa com vista.');
  $('#rodape-whats').href = w(M.whatsapp, 'Olá! Procuro uma casa com vista.');
  $('#vender-whats').href = w(M.whatsapp, 'Olá! Quero avaliar minha casa para vender.');
  $('#corretor-mais').href = w(M.whatsapp, 'Olá! Procuro uma casa com vista.');
  ['#topo-whats', '#rodape-whats', '#vender-whats', '#corretor-mais'].forEach(function (s) { var a = $(s); a.target = '_blank'; a.rel = 'noopener'; });
  $('#ano').textContent = new Date().getFullYear();

  /* ---------- a paisagem ---------- */
  var urlVista = function (vista, larg) { return window.cartao.foto(M.vistas[vista].foto, larg); };

  // Reserva: sem WebGL, a <img> troca com uma fusão curta.
  var reserva = {
    ir: function (vista) {
      var v = M.vistas[vista];
      var nova = new Image();
      nova.src = urlVista(vista, 1600);
      el.img.classList.add('sai');
      var trocar = function () {
        el.img.srcset = urlVista(vista, 900) + ' 900w, ' + urlVista(vista, 1600) + ' 1600w, ' + urlVista(vista, 2400) + ' 2400w';
        el.img.src = urlVista(vista, 1600);
        el.img.alt = v.alt;
        el.img.classList.remove('sai');
      };
      (nova.decode ? nova.decode() : Promise.resolve()).then(trocar, trocar);
    }
  };

  var paisagem = reserva;

  var criarGL = function () {
    var gl = el.canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) return null;

    var vs = 'attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision mediump float;',
      'varying vec2 uv;',
      'uniform sampler2D uA, uB;',
      'uniform float uAspA, uAspB, uAspC, uProg, uTempo;',
      'uniform vec2 uMouse;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
      ' return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
      'float fbm(vec2 p){return .55*n(p)+.3*n(p*2.1)+.15*n(p*4.3);}',
      'vec2 cobre(vec2 u,float img){vec2 s=uAspC>img?vec2(1.,img/uAspC):vec2(uAspC/img,1.);return (u-.5)*s+.5;}',
      'void main(){',
      ' vec2 u=(uv-.5)/1.04+.5+uMouse*.012;',             // leve zoom para a paralaxe não mostrar borda
      ' float v=.5*fbm(u*vec2(3.,2.)+uTempo*.05)+.5*(1.-u.y*.6+u.x*.4)*.75;', // a onda nasce no horizonte e varre
      ' float p=uProg*1.4-.2;',
      ' float m=smoothstep(p+.1,p-.1,v);',
      ' float borda=m*(1.-m)*4.;',
      ' vec2 d=vec2(.035,.02)*borda;',
      ' vec4 a=texture2D(uA,cobre(u+d,uAspA));',
      ' vec4 b=texture2D(uB,cobre(u-d,uAspB));',
      ' vec3 c=mix(a.rgb,b.rgb,m)+borda*.06;',            // um brilho finíssimo na frente da onda
      ' gl_FragColor=vec4(c,1.);',
      '}'
    ].join('\n');

    var sh = function (tipo, src) {
      var s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    var a = sh(gl.VERTEX_SHADER, vs), b = sh(gl.FRAGMENT_SHADER, fs);
    if (!a || !b) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, a); gl.attachShader(prog, b); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ['uA', 'uB', 'uAspA', 'uAspB', 'uAspC', 'uProg', 'uTempo', 'uMouse'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });
    gl.uniform1i(U.uA, 0); gl.uniform1i(U.uB, 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    var texturas = {}; // vista -> {tex, asp} ou Promise
    var carregar = function (vista) {
      if (texturas[vista]) return texturas[vista];
      texturas[vista] = new Promise(function (ok, falha) {
        var im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload = function () {
          var t = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, t);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          ok({ tex: t, asp: im.naturalWidth / im.naturalHeight });
        };
        im.onerror = falha;
        im.src = urlVista(vista, el.canvas.width > 1700 ? 2400 : 1600);
      });
      return texturas[vista];
    };

    var atual = null, proxima = null, prog01 = 1, inicio = 0, DUR = reduz.matches ? 450 : 1500;
    var mouse = [0, 0], alvo = [0, 0], visivel = true, rodando = false, t0 = performance.now();

    var medir = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var r = el.moldura.getBoundingClientRect();
      el.canvas.width = Math.round(r.width * dpr);
      el.canvas.height = Math.round(r.height * dpr);
      gl.viewport(0, 0, el.canvas.width, el.canvas.height);
      gl.uniform1f(U.uAspC, r.width / r.height);
      pedir();
    };

    var quadro = function (agora) {
      rodando = false;
      if (!atual || !visivel) return;
      var anima = false;
      if (proxima) {
        prog01 = Math.min(1, (agora - inicio) / DUR);
        if (prog01 >= 1) { atual = proxima; proxima = null; prog01 = 1; }
        else anima = true;
      }
      if (!reduz.matches) {
        mouse[0] += (alvo[0] - mouse[0]) * .06;
        mouse[1] += (alvo[1] - mouse[1]) * .06;
        if (Math.abs(alvo[0] - mouse[0]) + Math.abs(alvo[1] - mouse[1]) > .001) anima = true;
      }
      var A = atual, B = proxima || atual;
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, A.tex);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, B.tex);
      gl.uniform1f(U.uAspA, A.asp); gl.uniform1f(U.uAspB, B.asp);
      // curva de saída suave, a mesma do resto do site
      var e = proxima ? 1 - Math.pow(1 - prog01, 3) : 0;
      gl.uniform1f(U.uProg, e);
      gl.uniform1f(U.uTempo, (agora - t0) / 1000);
      gl.uniform2f(U.uMouse, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (anima) pedir();
    };
    var pedir = function () { if (!rodando && visivel) { rodando = true; requestAnimationFrame(quadro); } };

    // para fora da tela e com a aba escondida
    new IntersectionObserver(function (es) { visivel = es[0].isIntersecting && !document.hidden; pedir(); }).observe(el.moldura);
    document.addEventListener('visibilitychange', function () { visivel = !document.hidden; pedir(); });
    window.addEventListener('resize', medir);
    el.moldura.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = el.moldura.getBoundingClientRect();
      alvo = [(e.clientX - r.left) / r.width - .5, -((e.clientY - r.top) / r.height - .5)];
      pedir();
    });
    el.canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault(); el.moldura.classList.remove('gl'); paisagem = reserva;
    });

    medir();

    return {
      iniciar: function (vista) {
        return carregar(vista).then(function (t) {
          atual = t; medir(); el.moldura.classList.add('gl');
          // as outras vistas descem depois, sem disputar com a primeira tela
          var resto = function () { Object.keys(M.vistas).forEach(carregar); };
          'requestIdleCallback' in window ? requestIdleCallback(resto, { timeout: 3000 }) : setTimeout(resto, 1500);
        });
      },
      ir: function (vista) {
        el.img.src = urlVista(vista, 1600); el.img.removeAttribute('srcset'); el.img.alt = M.vistas[vista].alt;
        carregar(vista).then(function (t) {
          if (proxima) atual = proxima;      // clique no meio da onda: parte do que já chegou
          proxima = t; inicio = performance.now(); prog01 = 0; pedir();
        }, function () { reserva.ir(vista); });
      }
    };
  };

  /* ---------- começo ---------- */
  escolher(estado.vista);
  desenharDestaque(false);
  if (estado.vista !== 'mar') { reserva.ir(estado.vista); desenharVista(); }
  else { el.fichaN.textContent = plural(daVista().length); el.fichaDe.textContent = 'Desde ' + mi(daVista().slice(-1)[0].preco); }

  var conexao = navigator.connection || {};
  if (!conexao.saveData) {
    try {
      var g = criarGL();
      if (g) g.iniciar(estado.vista).then(function () { paisagem = g; }, function () { /* fica a reserva */ });
    } catch (err) { /* sem WebGL: a reserva já está valendo */ }
  }

  /* rolagem: só escreve --p (0 a 1); o CSS decide o que fazer com ela */
  (function () {
    var pedido = false, ultimo = -1;
    var aplicar = function () {
      pedido = false;
      var p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * .75)));
      p = Math.round(p * 1000) / 1000;
      if (p !== ultimo) { el.moldura.style.setProperty('--p', p); ultimo = p; }
    };
    window.addEventListener('scroll', function () { if (!pedido) { pedido = true; requestAnimationFrame(aplicar); } }, { passive: true });
    aplicar();
  })();

  console.log('%cMirante', 'font: 600 14px sans-serif', '— template de imobiliária. Troque os dados em imoveis.js.');
})();
