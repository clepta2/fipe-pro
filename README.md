# 🚗 Tabela FIPE & Precificação Veicular Pro API

> **API e SDK Oficial de Alta Performance na Borda Cloudflare Anycast (<2ms) para Cotação Oficial FIPE de Carros, Motos e Caminhões, Série Histórica de Preços, Depreciação, Decodificador de Chassi VIN (ISO 3779), Alíquotas de IPVA das 27 UFs e Custo de Propriedade (TCO).**

[![Status](https://img.shields.io/badge/Status-Produção%20Tier--1-success.svg)](#)
[![Infra](https://img.shields.io/badge/Infra-Cloudflare%20Workers%20Anycast-orange.svg)](#)
[![Latência](https://img.shields.io/badge/Latência-%3C2ms%20RAM%20Edge-blue.svg)](#)
[![Auth](https://img.shields.io/badge/Auth-RFC%206750%20Bearer%20Token-emerald.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 🧭 Visão Geral

O **Fipe Pro** centraliza a precificação e inteligência veicular nacional:
1. **Cotação Oficial da Tabela FIPE:** Valores médios de mercado de carros, motos e caminhões novos e usados, com código FIPE de 7 dígitos.
2. **Série Histórica e Depreciação (12 Meses):** Histórico mês a mês com taxa anual de desvalorização calculada.
3. **Decodificador e Validador de Chassi VIN (ISO 3779):** Resolução de WMI (World Manufacturer Identifier), ano-modelo (VIS) e checagem de dígito verificador Módulo 11.
4. **Calculadora Oficial de IPVA das 27 UFs:** Alíquotas oficiais de todas as 27 Unidades Federativas do Brasil aplicadas ao valor venal com cálculo de desconto em cota única e parcelamento em até 5x.
5. **Custo Total de Propriedade (TCO):** Estimativa consolidada de IPVA + seguro médio + revisões preventivas + depreciação projetada em 12 meses.
6. **Cruzamento por Placa:** Identifica padrão Mercosul ou Antiga e cruza com a cotação FIPE correspondente.
7. **Renderizador Vetorial SVG de Cards:** Gera cards visuais em SVG prontos para redes sociais, classificados e apps.

---

## 📦 Matriz de Planos & Vazão Contínua

| Plano | Limite RPM | Cota Diária | Prefixo de Chave | Latência |
|---|---|---|---|---|
| **Free / Sandbox** | 30 RPM | 500 req/dia | `fipe_free_` | &lt; 5ms Anycast |
| **Starter (24/7)** | 60 RPM | 86.400 req/dia (1 req/s) | `fipe_start_` | &lt; 2ms Anycast |
| **Pro** | 300 RPM | 250.000 req/dia (5 req/s) | `fipe_pro_` | &lt; 1ms Anycast |
| **Business** | 1.200 RPM | 1.000.000 req/dia (20 req/s) | `fipe_biz_` | &lt; 1ms Anycast |
| **Master Admin** | 3.000 RPM | Ilimitada (Bypass) | `fipe_master_` | &lt; 1ms Anycast |

---

## 🚀 Endpoints REST

- `GET /api/fipe/codigo/:codigo?uf=SP&ano=2025`: Consulta por código FIPE e calcula IPVA.
- `GET /api/fipe/placa/:placa`: Consulta FIPE cruzando pela placa do veículo.
- `GET /api/fipe/chassi/:vin`: Decodificador completo de Chassi VIN (ISO 3779).
- `GET /api/fipe/ipva/:uf`: Alíquotas oficiais de IPVA da UF (ou todas as 27 UFs).
- `GET /api/fipe/card/:codigo.svg`: Renderizador do card vetorial SVG da cotação.
- `GET /api/fipe/catalogo`: Catálogo completo de veículos cadastrados.

---

## 💻 Uso do SDK Isomórfico

```javascript
import { FipePro } from 'fipe-pro';

// 1. Consultar por Código FIPE
const fipe = FipePro.consultarPorCodigoFipe('005340-6', 2025, 'SP');
console.log('Modelo:', fipe.modelo);
console.log('Preço FIPE:', fipe.precoFormatado);
console.log('IPVA Estimado (SP 4%):', fipe.estimativaIpva.valorAnualEstimado);

// 2. Decodificar Chassi VIN ISO 3779
const vin = FipePro.decodificarChassiVin('9BWCA45U1FP012345');
console.log('Montadora:', vin.wmi.fabricante);
console.log('Ano Modelo:', vin.vis.anoModelo);
```

---

## 📄 Licença

Distribuído sob licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
