export interface VeiculoFipe {
  codigoFipe: string;
  marca: string;
  modelo: string;
  tipo: 'carros' | 'motos' | 'caminhoes';
  categoria?: string;
  combustivel: string;
  anoModelo: number;
  precoAtual: number;
  precoFormatado: string;
  mesReferencia: string;
  depreciacaoAnualPct: number;
  historico12Meses: Array<{ mes: string; valor: number }>;
}

export interface FipeConsultaResponse extends VeiculoFipe {
  ok: boolean;
  anoConsultado: number;
  estimativaIpva: {
    uf: string;
    estadoNome: string;
    aliquotaPct: string;
    valorVenalBase: number;
    valorAnualEstimado: number;
    descontoCotaUnica: string;
    valorCotaUnicaComDesconto: number;
    parcelamentoMaximo: string;
  };
  custoTotalPropriedadeTCO: {
    periodo: string;
    ipvaEstimado: number;
    seguroMedioEstimado: number;
    revisoesEManutencaoEstimada: number;
    depreciacaoProjetada: number;
    totalCustoAnual: number;
  };
}

export interface DecodificacaoChassiVin {
  ok: boolean;
  chassiVin: string;
  valido: boolean;
  norma: string;
  wmi: {
    codigo: string;
    fabricante: string;
    paisOrigem: string;
  };
  vds: {
    codigo: string;
    descricao: string;
  };
  vis: {
    codigo: string;
    anoModelo: number;
    digitoAno: string;
    plantaFabricacao: string;
    numeroDeSerieSequencial: string;
  };
  digitoVerificador: {
    posicao9: string;
    digitoCalculado: string;
    valido: boolean;
  };
}

export declare class FipePro {
  static baseUrl: string;
  static apiKey: string;

  static configure(config?: { apiKey?: string; baseUrl?: string }): void;
  static getHealth(): Promise<{ ok: boolean; servico: string; versao: string }>;
  static getCatalogo(tipo?: 'carros' | 'motos' | 'caminhoes'): Promise<{ ok: boolean; total: number; veiculos: VeiculoFipe[] }>;
  static consultarPorCodigoFipe(codigo: string, ano?: number, ufIpva?: string): FipeConsultaResponse;
  static consultarFipePorPlaca(placa: string, uf?: string): { ok: boolean; placa: string; padraoPlaca: string; avaliacaoFipe: FipeConsultaResponse };
  static decodificarChassiVin(vin: string): DecodificacaoChassiVin;
  static getFipeCardSvgUrl(codigo: string, uf?: string): string;
}

export default FipePro;
