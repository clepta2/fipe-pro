import { FipePro, consultarPorCodigoFipe, consultarFipePorPlaca, decodificarChassiVin, renderFipeCardSvg } from './fipe-pro.js';
import worker from './worker.js';

console.log('🧪 Iniciando Bateria de Testes do Tabela FIPE & Avaliação Veicular Pro API...\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
    console.log(`  ✅ ${message}`);
  } else {
    failCount++;
    console.error(`  ❌ FALHA: ${message}`);
    throw new Error(message);
  }
}

// ─── 1. AUTENTICAÇÃO RFC 6750 & MATRIZ DE PLANOS ───
console.log('--- 1. Padrão de Autenticação RFC 6750 & Resolução de Nível ---');

const resFree = await worker.fetch(new Request('https://api.test/api/fipe/health'), {});
assert(resFree.status === 200, 'Requisição anônima responde HTTP 200');
assert(resFree.headers.get('x-fipe-plan') === 'free', 'Requisição anônima recebe plano free');
assert(resFree.headers.get('x-fipe-ratelimit-limit') === '30', 'Plano free tem limite de 30 RPM');

const resStarter = await worker.fetch(new Request('https://api.test/api/fipe/health', {
  headers: { 'Authorization': 'Bearer fipe_start_live123' }
}), {});
assert(resStarter.headers.get('x-fipe-plan') === 'starter', 'Token fipe_start_ resolve plano starter');
assert(resStarter.headers.get('x-fipe-ratelimit-limit') === '60', 'Plano starter tem 60 RPM');

const resPro = await worker.fetch(new Request('https://api.test/api/fipe/health', {
  headers: { 'x-api-key': 'fipe_pro_live456' }
}), {});
assert(resPro.headers.get('x-fipe-plan') === 'pro', 'Header x-api-key fipe_pro_ resolve plano pro');
assert(resPro.headers.get('x-fipe-ratelimit-limit') === '300', 'Plano pro tem 300 RPM');

const resMaster = await worker.fetch(new Request('https://api.test/api/fipe/health', {
  headers: { 'Authorization': 'Bearer fipe_master_suite' }
}), {});
assert(resMaster.headers.get('x-fipe-plan') === 'master', 'Token fipe_master_ resolve plano master');
assert(resMaster.headers.get('x-fipe-ratelimit-limit') === '3000', 'Plano master tem 3000 RPM');


// ─── 2. RATE LIMITING DINÂMICO & HTTP 429 ───
console.log('\n--- 2. Rate Limiting Dinâmico & Bloqueio HTTP 429 ---');

let atingiu429 = false;
let retryAfterHeader = null;

for (let i = 0; i < 35; i++) {
  const r = await worker.fetch(new Request('https://api.test/api/fipe/health', {
    headers: { 'Authorization': 'Bearer fipe_free_test_flood' }
  }), {});
  if (r.status === 429) {
    atingiu429 = true;
    retryAfterHeader = r.headers.get('Retry-After');
    break;
  }
}
assert(atingiu429, 'Rate limiter bloqueia com HTTP 429 ao ultrapassar cota RPM do plano free');
assert(retryAfterHeader !== null, 'Header Retry-After retornado no 429');


// ─── 3. HEALTHCHECK & METADADOS ───
console.log('\n--- 3. Healthcheck & Metadados ---');

const dataHealth = await (await worker.fetch(new Request('https://api.test/api/fipe/health'), {})).json();
assert(dataHealth.ok === true, 'Health reporta status ok: true');
assert(dataHealth.servico.includes('Tabela FIPE'), 'Nome do serviço validado');
assert(dataHealth.totalVeiculosCadastrados >= 10, 'Mínimo de 10 veículos de referência');
assert(dataHealth.totalUfsIpva === 27, '27 UFs para cálculo de IPVA');


// ─── 4. CATÁLOGO FIPE & FILTROS ───
console.log('\n--- 4. Catálogo FIPE & Filtros por Categoria ---');

const resCat = await worker.fetch(new Request('https://api.test/api/fipe/catalogo'), {});
assert(resCat.status === 200, 'Endpoint /api/fipe/catalogo responde 200');
const dataCat = await resCat.json();
assert(dataCat.total >= 10, 'Total de veículos retornado');

const resMotos = await worker.fetch(new Request('https://api.test/api/fipe/catalogo?tipo=motos'), {});
const dataMotos = await resMotos.json();
assert(dataMotos.veiculos.every(v => v.tipo === 'motos'), 'Filtro por tipo=motos validado');

const resCaminhoes = await worker.fetch(new Request('https://api.test/api/fipe/catalogo?tipo=caminhoes'), {});
const dataCaminhoes = await resCaminhoes.json();
assert(dataCaminhoes.veiculos.every(v => v.tipo === 'caminhoes'), 'Filtro por tipo=caminhoes validado');


// ─── 5. CONSULTA POR CÓDIGO FIPE & IPVA ───
console.log('\n--- 5. Consulta por Código FIPE & Estimativa de IPVA ---');

// 5.1 Nivus em SP (4%)
const resNivus = await worker.fetch(new Request('https://api.test/api/fipe/codigo/005340-6?uf=SP'), {});
assert(resNivus.status === 200, 'Consulta código FIPE 005340-6 responde 200');
const dataNivus = await resNivus.json();
assert(dataNivus.marca === 'Volkswagen', 'Marca do Nivus confirmada');
assert(dataNivus.precoAtual > 100000, 'Preço venal de mercado consistente');
assert(dataNivus.estimativaIpva.aliquotaPct === '4%', 'Alíquota de SP é 4%');
assert(dataNivus.estimativaIpva.valorCotaUnicaComDesconto < dataNivus.estimativaIpva.valorAnualEstimado, 'Desconto de cota única calculado');
assert(dataNivus.custoTotalPropriedadeTCO.totalCustoAnual > 0, 'Custo Total de Propriedade (TCO) calculado');

// 5.2 Corolla em SC (2%)
const resCorolla = await worker.fetch(new Request('https://api.test/api/fipe/codigo/002111-3?uf=SC'), {});
const dataCorolla = await resCorolla.json();
assert(dataCorolla.estimativaIpva.aliquotaPct === '2%', 'Alíquota de SC é 2%');
assert(dataCorolla.marca === 'Toyota', 'Toyota Corolla reconhecido');

// 5.3 Moto CG 160
const resCg = await worker.fetch(new Request('https://api.test/api/fipe/codigo/811145-6?uf=MG'), {});
const dataCg = await resCg.json();
assert(dataCg.tipo === 'motos', 'Tipo identificado como motos');
assert(dataCg.estimativaIpva.aliquotaPct === '2%', 'Alíquota de moto em MG é 2%');

// 5.4 Caminhão Scania
const resScania = await worker.fetch(new Request('https://api.test/api/fipe/codigo/509123-1?uf=SP'), {});
const dataScania = await resScania.json();
assert(dataScania.tipo === 'caminhoes', 'Tipo identificado como caminhoes');
assert(dataScania.estimativaIpva.aliquotaPct === '1.5%', 'Alíquota de caminhão em SP é 1.5%');


// ─── 6. CRUZAMENTO POR PLACA MERCOSUL OU ANTIGA ───
console.log('\n--- 6. Cruzamento por Placa Mercosul & Cinza Antiga ---');

const resPlacaMercosul = await worker.fetch(new Request('https://api.test/api/fipe/placa/COR2E19'), {});
assert(resPlacaMercosul.status === 200, 'Endpoint /api/fipe/placa/COR2E19 responde 200');
const dataPlaca = await resPlacaMercosul.json();
assert(dataPlaca.padraoPlaca === 'MERCOSUL', 'Padrão Mercosul identificado');
assert(dataPlaca.avaliacaoFipe.marca === 'Toyota', 'Modelo cruzado com Toyota');

const resPlacaAntiga = await worker.fetch(new Request('https://api.test/api/fipe/placa/ABC1234'), {});
const dataAntiga = await resPlacaAntiga.json();
assert(dataAntiga.padraoPlaca === 'CINZA_ANTIGA', 'Padrão Cinza Antiga identificado');

const resPlacaInvalida = await worker.fetch(new Request('https://api.test/api/fipe/placa/ABC'), {});
assert(resPlacaInvalida.status === 400, 'Placa com tamanho incorreto rejeitada com HTTP 400');


// ─── 7. DECODIFICADOR DE CHASSI VIN (ISO 3779) ───
console.log('\n--- 7. Decodificador e Validador de Chassi VIN (ISO 3779) ---');

// 7.1 VIN Volkswagen do Brasil (9BW...)
const vinVw = '9BWCA45U1FP012345';
const resVinVw = await worker.fetch(new Request(`https://api.test/api/fipe/chassi/${vinVw}`), {});
assert(resVinVw.status === 200, 'Endpoint /api/fipe/chassi responde 200');
const dataVinVw = await resVinVw.json();
assert(dataVinVw.valido === true, 'Chassi VIN marcado como válido');
assert(dataVinVw.wmi.fabricante.includes('Volkswagen'), 'Fabricante identificado como Volkswagen');
assert(dataVinVw.wmi.paisOrigem === 'Brasil', 'País de origem Brasil identificado');
assert(dataVinVw.vis.anoModelo === 2015, 'Ano modelo F (2015) decodificado');

// 7.2 Rejeição de letras proibidas I, O, Q
const vinProibido = '9BWCA45UIFP012345';
const resVinProibido = await worker.fetch(new Request(`https://api.test/api/fipe/chassi/${vinProibido}`), {});
assert(resVinProibido.status === 400, 'Chassi com letra I rejeitado por violação ISO 3779');

// 7.3 Rejeição de tamanho diferente de 17 caracteres
const vinCurto = '9BWCA45U';
const resVinCurto = await worker.fetch(new Request(`https://api.test/api/fipe/chassi/${vinCurto}`), {});
assert(resVinCurto.status === 400, 'Chassi com tamanho diferente de 17 rejeitado');


// ─── 8. TABELA DE IPVA DAS 27 UFS ───
console.log('\n--- 8. Tabela de Alíquotas de IPVA das 27 UFs ---');

const resIpvaTodas = await worker.fetch(new Request('https://api.test/api/fipe/ipva'), {});
assert(resIpvaTodas.status === 200, 'Endpoint /api/fipe/ipva responde 200');
const dataIpvaTodas = await resIpvaTodas.json();
assert(dataIpvaTodas.totalUfs === 27, 'Todas as 27 UFs presentes na tabela');

const resIpvaRj = await worker.fetch(new Request('https://api.test/api/fipe/ipva/RJ'), {});
const dataIpvaRj = await resIpvaRj.json();
assert(dataIpvaRj.uf === 'RJ' && dataIpvaRj.aliqCarros === 0.04, 'Alíquota de carros do RJ é 4%');


// ─── 9. RENDERIZADOR VETORIAL SVG DE COTAÇÃO FIPE ───
console.log('\n--- 9. Renderizador Vetorial SVG de Cotação FIPE ---');

const resSvg = await worker.fetch(new Request('https://api.test/api/fipe/card/005340-6.svg?uf=SP'), {});
assert(resSvg.status === 200, 'Endpoint /api/fipe/card/:codigo.svg responde 200');
assert(resSvg.headers.get('Content-Type').includes('image/svg+xml'), 'Header image/svg+xml retornado');
const svgText = await resSvg.text();
assert(svgText.includes('TABELA FIPE OFICIAL'), 'Marca dágua oficial no SVG');
assert(svgText.includes('Nivus'), 'Modelo veicular renderizado no SVG');
assert(svgText.includes('IPVA Estimado'), 'Bloco de IPVA renderizado no SVG');


// ─── 10. SDK ISOMÓRFICO FIPEPRO ───
console.log('\n--- 10. Validação do SDK Isomórfico FipePro ---');

const fipeCod = consultarPorCodigoFipe('002111-3', 2025, 'PR');
assert(fipeCod.ok === true && fipeCod.marca === 'Toyota', 'SDK consultarPorCodigoFipe funciona');

const fipePlaca = consultarFipePorPlaca('ONX1E23', 'SP');
assert(fipePlaca.ok === true && fipePlaca.avaliacaoFipe.marca === 'Chevrolet', 'SDK consultarFipePorPlaca funciona');

const chassiDecod = decodificarChassiVin('9BGRD48U1SP123456');
assert(chassiDecod.ok === true && chassiDecod.wmi.fabricante.includes('General Motors'), 'SDK decodificarChassiVin funciona');

const cardSvg = renderFipeCardSvg(fipeCod);
assert(cardSvg.includes('<svg') && cardSvg.includes('Corolla'), 'SDK renderFipeCardSvg gera SVG válido');

console.log(`\n🎉 Todos os ${passCount} testes do FIPE Pro foram executados e APROVADOS com sucesso! Zero falhas (${failCount}).\n`);