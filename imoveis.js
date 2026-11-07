/* Configuração e dados do template. TUDO aqui é EXEMPLO: troque pelos dados da imobiliária.
   Fotos: Unsplash (licença livre). Troque por fotos próprias antes de publicar. */
window.MIRANTE = {
  whatsapp: '5500000000000', // DDI + DDD + número, só dígitos

  vistas: {
    mar:    { nome: 'Mar',    frase: 'com vista para o mar',   local: 'Litoral catarinense', foto: '1507525428034-b723cf961d3e', alt: 'Vista do mar ao amanhecer' },
    serra:  { nome: 'Serra',  frase: 'com vista para a serra', local: 'Serra da Mantiqueira', foto: '1464822759023-fed622ff2c3b', alt: 'Vale entre montanhas com mata' },
    lago:   { nome: 'Lago',   frase: 'de frente para o lago',  local: 'Represa de Furnas',   foto: '1470770841072-f978cf4d019e', alt: 'Lago calmo ao pé das montanhas' },
    cidade: { nome: 'Cidade', frase: 'com vista para a cidade', local: 'Coberturas no centro', foto: '1477959858617-67f85cf4f1df', alt: 'Cidade vista do alto' }
  },

  imoveis: [
    { codigo: 'MR-104', vista: 'mar',    nome: 'Casa Areia',      bairro: 'Jurerê Internacional', cidade: 'Florianópolis, SC', quartos: 5, area: 620, preco: 11800000, foto: '1613490493576-7fde63acd811' },
    { codigo: 'MR-118', vista: 'mar',    nome: 'Casa das Varandas', bairro: 'Praia Brava',        cidade: 'Itajaí, SC',        quartos: 4, area: 410, preco: 6900000,  foto: '1564013799919-ab600027ffc6' },
    { codigo: 'MR-121', vista: 'mar',    nome: 'Casa Branca',     bairro: 'Lagoinha',             cidade: 'Florianópolis, SC', quartos: 3, area: 280, preco: 3950000,  foto: '1512917774080-9991f1c4c750' },
    { codigo: 'MR-133', vista: 'mar',    nome: 'Casa Maré',       bairro: 'Praia do Rosa',        cidade: 'Imbituba, SC',      quartos: 4, area: 350, preco: 5400000,  foto: '1602343168117-bb8ffe3e2e9f' },

    { codigo: 'SR-207', vista: 'serra',  nome: 'Casa do Vale',    bairro: 'Capivari',             cidade: 'Campos do Jordão, SP', quartos: 5, area: 540, preco: 8700000, foto: '1599809275671-b5942cabc7a2' },
    { codigo: 'SR-212', vista: 'serra',  nome: 'Casa da Figueira', bairro: 'Alto da Boa Vista',   cidade: 'Campos do Jordão, SP', quartos: 4, area: 380, preco: 4600000, foto: '1600585154340-be6161a56a0c' },
    { codigo: 'SR-219', vista: 'serra',  nome: 'Casa Pedra',      bairro: 'Vila Suíça',           cidade: 'Gonçalves, MG',     quartos: 3, area: 260, preco: 2850000,  foto: '1600566753190-17f0baa2a6c3' },

    { codigo: 'LG-305', vista: 'lago',   nome: 'Casa Espelho',    bairro: 'Escarpas do Lago',     cidade: 'Capitólio, MG',     quartos: 6, area: 700, preco: 9800000,  foto: '1582268611958-ebfd161ef9cf' },
    { codigo: 'LG-311', vista: 'lago',   nome: 'Casa Pier',       bairro: 'Escarpas do Lago',     cidade: 'Capitólio, MG',     quartos: 4, area: 420, preco: 5200000,  foto: '1613977257363-707ba9348227' },
    { codigo: 'LG-318', vista: 'lago',   nome: 'Casa Varanda',    bairro: 'Condomínio Marina',    cidade: 'Guapé, MG',         quartos: 4, area: 330, preco: 3400000,  foto: '1416331108676-a22ccb276e35' },

    { codigo: 'CD-402', vista: 'cidade', nome: 'Cobertura Alta',  bairro: 'Itaim Bibi',           cidade: 'São Paulo, SP',     quartos: 4, area: 480, preco: 14500000, foto: '1600596542815-ffad4c1539a9' },
    { codigo: 'CD-409', vista: 'cidade', nome: 'Casa Cubo',       bairro: 'Jardim Europa',        cidade: 'São Paulo, SP',     quartos: 5, area: 590, preco: 12900000, foto: '1580587771525-78b9dba3b914' },
    { codigo: 'CD-415', vista: 'cidade', nome: 'Casa Ripada',     bairro: 'Alto de Pinheiros',    cidade: 'São Paulo, SP',     quartos: 4, area: 400, preco: 6800000,  foto: '1600047509807-ba8f99d2cdde' },
    { codigo: 'CD-420', vista: 'cidade', nome: 'Loft Panorama',   bairro: 'Vila Nova Conceição',  cidade: 'São Paulo, SP',     quartos: 2, area: 190, preco: 3900000,  foto: '1600607687939-ce8a6c25118c' }
  ]
};
