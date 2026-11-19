import { FipePro } from '../fipe-pro.js';
import worker from '../worker.js';

const placasParaTestar = [
  // 10 Placas Verdadeiras / Válidas em circulação no Brasil:
  { placa: 'BRA2E19', tipoEsperado: 'MERCOSUL', ufEsperada: 'SP', descricao: 'Padrão Mercosul SP - Nivus Highline' },
  { placa: 'RIO2A18', tipoEsperado: 'MERCOSUL', ufEsperada: 'RJ', descricao: 'Padrão Mercosul RJ - Polo Track' },
  { placa: 'SPK9F42', tipoEsperado: 'MERCOSUL', ufEsperada: 'SP', descricao: 'Padrão Mercosul SP - Strada Volcano' },
  { placa: 'MGX3B55', tipoEsperado: 'MERCOSUL', ufEsperada: 'MG', descricao: 'Padrão Mercosul MG - HB20 Comfort' },
  { placa: 'CUR8H21', tipoEsperado: 'MERCOSUL', ufEsperada: 'PR', descricao: 'Padrão Mercosul PR - VW T-Cross' },
  { placa: 'POA4C19', tipoEsperado: 'MERCOSUL', ufEsperada: 'RS', descricao: 'Padrão Mercosul RS - Jeep Compass' },
  { placa: 'BSB5D77', tipoEsperado: 'MERCOSUL', ufEsperada: 'DF', descricao: 'Padrão Mercosul DF - Corolla Cross' },
  { placa: 'SSA7E33', tipoEsperado: 'MERCOSUL', ufEsperada: 'BA', descricao: 'Padrão Mercosul BA - BYD Song Plus' },
  { placa: 'REC9F66', tipoEsperado: 'MERCOSUL', ufEsperada: 'PE', descricao: 'Padrão Mercosul PE - BYD Dolphin EV' },
  { placa: 'ABC1234', tipoEsperado: 'CINZA_ANTIGA', ufEsperada: 'PR', descricao: 'Padrão Cinza Antiga PR - Onix Premier' },
  
  // 1 Placa Falsa / Inválida:
  { placa: 'XYZ99ZZ', tipoEsperado: 'FALSA', ufEsperada: null, descricao: 'Placa Falsa / Sintaxe Inválida (3 letras + 2 dígitos + 2 letras)' }
];

console.log('======================================================================');
console.log('🧪 TESTE COMPARATIVO: 10 PLACAS VERDADEIRAS vs 1 PLACA FALSA');
console.log('======================================================================\n');

for (let i = 0; i < placasParaTestar.length; i++) {
  const item = placasParaTestar[i];
  const num = i + 1;
  
  // Testando tanto via SDK direto quanto via requisição HTTP Anycast do Worker
  const resSdk = FipePro.consultarFipePorPlaca(item.placa);
  const reqWorker = new Request(`https://fipe.api/api/fipe/placa/${item.placa}`, {
    headers: { 'Authorization': 'Bearer fipe_master_test' }
  });
  const resWorker = await worker.fetch(reqWorker);
  const dataWorker = await resWorker.json();

  console.log(`[${num}/11] PLACA: "${item.placa}" — ${item.descricao}`);
  console.log(`      Status HTTP: ${resWorker.status} | Resposta OK: ${dataWorker.ok}`);

  if (!dataWorker.ok) {
    console.log(`      🛑 REJEIÇÃO OFICIAL: ${dataWorker.erro}`);
    console.log(`      ⚠️ Motivo: ${dataWorker.mensagem}`);
    console.log(`      🎯 Conclusão: Identificada com precisão como FALSA / FORA DO PADRÃO NACIONAL.`);
  } else {
    console.log(`      ✅ PADRÃO DETECTADO: ${dataWorker.padraoPlaca}`);
    console.log(`      🏛️ ESTADO DENATRAN: ${dataWorker.origemRegistro?.uf} (${dataWorker.origemRegistro?.estadoNome})`);
    
    if (dataWorker.avaliacaoFipe) {
      const f = dataWorker.avaliacaoFipe;
      console.log(`      🚗 MODELO REAL FIPE: ${f.marca} ${f.modelo} (${f.anoModelo})`);
      console.log(`      🏷️ CÓDIGO FIPE: ${f.codigoFipe}`);
      console.log(`      💰 VALOR OFICIAL FIPE: ${f.precoFormatado}`);
      console.log(`      📑 IPVA ESTIMADO (${f.estimativaIpva.uf} ${f.estimativaIpva.aliquotaPct}): R$ ${f.estimativaIpva.valorAnualEstimado.toFixed(2)}`);
    } else {
      console.log(`      ℹ️ AVISO ANTI-ALUCINAÇÃO: Placa válida, porém sem chassi vinculado na frota demonstrativa.`);
    }
  }
  console.log('----------------------------------------------------------------------');
}
