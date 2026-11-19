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

export interface MarcaFipe {
  codigo: string;
  nome: string;
}

export interface ModeloFipe {
  codigo: number;
  nome: string;
}

export interface AnoFipe {
  codigo: string;
  nome: string;
}

export declare class FipePro {
  static baseUrl: string;
  static apiKey: string;

  static configure(config?: { apiKey?: string; baseUrl?: string }): void;
  static getHealth(): Promise<{ ok: boolean; servico: string; versao: string }>;
  static getCatalogo(tipo?: 'carros' | 'motos' | 'caminhoes'): Promise<{ ok: boolean; total: number; veiculos: VeiculoFipe[] }>;
  static buscarMarcasFipeLive(tipo?: 'carros' | 'motos' | 'caminhoes'): Promise<MarcaFipe[]>;
  static buscarModelosFipeLive(tipo: string, marcaId: string): Promise<ModeloFipe[]>;
  static buscarAnosFipeLive(tipo: string, marcaId: string, modeloId: string): Promise<AnoFipe[]>;
  static consultarPrecoFipeLive(tipo: string, marcaId: string, modeloId: string, anoId: string, uf?: string): Promise<FipeConsultaResponse>;
  static buscarFipePorTextoLive(termo: string, tipo?: string): Promise<any[]>;
  static resolverUfPorPlaca(placa: string): { uf: string; estadoNome: string; confianca: string };
  static consultarPorCodigoFipe(codigo: string, ano?: number, ufIpva?: string): FipeConsultaResponse;
  static consultarFipePorPlaca(placa: string, uf?: string): { ok: boolean; placa: string; padraoPlaca: string; origemRegistro?: any; avaliacaoFipe: FipeConsultaResponse | null; aviso?: string };
  static decodificarChassiVin(vin: string): DecodificacaoChassiVin;
  static renderFipeCardSvg(fipeData: any): string;
  static getFipeCardSvgUrl(codigo: string, uf?: string): string;
}

export default FipePro;
