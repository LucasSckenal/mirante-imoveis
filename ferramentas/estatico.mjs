// Escreve a lista completa de casas dentro do index.html, para a página nunca abrir vazia sem JavaScript.
// Rode depois de mudar imoveis.js:  node ferramentas/estatico.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const raiz = new URL('../', import.meta.url);
const ctx = { window: {} };
ctx.globalThis = ctx.window;
vm.createContext(ctx);
for (const f of ['imoveis.js', 'cartao.js']) vm.runInContext(readFileSync(new URL(f, raiz), 'utf8'), ctx);

const M = ctx.window.MIRANTE;
const lista = [...M.imoveis].sort((a, b) => b.preco - a.preco);
const html = lista.map((c, i) => '        ' + ctx.window.cartao(c, M.whatsapp, i === 0)).join('\n');

const arq = new URL('index.html', raiz);
const pagina = readFileSync(arq, 'utf8').replace(
  /(<!-- casas:inicio[^>]*-->)[\s\S]*?(<!-- casas:fim -->)/,
  `$1\n${html}\n$2`
);
writeFileSync(arq, pagina);
console.log(`${lista.length} casas escritas no index.html`);
