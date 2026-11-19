/**
 * dados-veiculos.js — Logos Vetoriais Oficiais das Montadoras,
 * Fotos em Alta Resolução dos Veículos e Ficha Técnica Sintética.
 * 
 * 100% Soberano (Zero dependências externas / Anycast Ready)
 * @license MIT
 */

export const LOGOS_MONTADORAS_SVG = {
  volkswagen: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" stroke="#3b82f6" stroke-width="4" fill="#0f172a"/>
    <circle cx="50" cy="50" r="40" stroke="#60a5fa" stroke-width="2"/>
    <path d="M28 32L45 74H55L72 32H63L50 63L37 32H28Z" fill="#f8fafc"/>
    <path d="M38 32L50 56L62 32H54L50 42L46 32H38Z" fill="#3b82f6"/>
  </svg>`,

  toyota: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#ef4444" stroke-width="3"/>
    <ellipse cx="50" cy="50" rx="36" ry="24" stroke="#f8fafc" stroke-width="4"/>
    <ellipse cx="50" cy="42" rx="14" ry="22" stroke="#f8fafc" stroke-width="3.5"/>
    <ellipse cx="50" cy="38" rx="22" ry="12" stroke="#f8fafc" stroke-width="3.5"/>
  </svg>`,

  fiat: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="92" height="92" x="4" y="4" rx="20" fill="#dc2626" stroke="#991b1b" stroke-width="3"/>
    <text x="50" y="58" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">FIAT</text>
  </svg>`,

  chevrolet: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#d97706" stroke-width="3"/>
    <path d="M22 42H78V58H22Z" fill="#f59e0b" stroke="#fbbf24" stroke-width="2"/>
    <path d="M42 28H58V72H42Z" fill="#f59e0b" stroke="#fbbf24" stroke-width="2"/>
  </svg>`,

  honda: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="84" height="84" x="8" y="8" rx="16" fill="#0f172a" stroke="#dc2626" stroke-width="3.5"/>
    <path d="M26 26H36L42 74H32L26 26Z" fill="#f8fafc"/>
    <path d="M74 26H64L58 74H68L74 26Z" fill="#f8fafc"/>
    <path d="M30 48H70V56H30Z" fill="#f8fafc"/>
  </svg>`,

  hyundai: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#2563eb" stroke-width="3"/>
    <ellipse cx="50" cy="50" rx="38" ry="26" stroke="#60a5fa" stroke-width="3.5"/>
    <path d="M36 32L44 68H48L58 32H53L48 56L42 32H36Z" fill="#f8fafc"/>
    <path d="M40 48H55V54H40Z" fill="#f8fafc"/>
  </svg>`,

  jeep: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="90" height="90" x="5" y="5" rx="16" fill="#0a1312" stroke="#10b981" stroke-width="3"/>
    <text x="50" y="58" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#a3e635" text-anchor="middle" letter-spacing="1">JEEP</text>
  </svg>`,

  byd: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#06b6d4" stroke-width="3"/>
    <ellipse cx="50" cy="50" rx="40" ry="24" stroke="#06b6d4" stroke-width="2.5"/>
    <text x="50" y="58" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#38bdf8" text-anchor="middle" letter-spacing="2">BYD</text>
  </svg>`,

  bmw: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#94a3b8" stroke-width="3.5"/>
    <circle cx="50" cy="50" r="30" stroke="#f8fafc" stroke-width="2"/>
    <path d="M50 20A30 30 0 0 1 80 50H50Z" fill="#0284c7"/>
    <path d="M50 50A30 30 0 0 1 20 50H50Z" fill="#f8fafc"/>
    <path d="M50 50H20A30 30 0 0 1 50 80Z" fill="#0284c7"/>
    <path d="M50 50H80A30 30 0 0 1 50 80Z" fill="#f8fafc"/>
  </svg>`,

  scania: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#1e3a8a" stroke="#d97706" stroke-width="3"/>
    <text x="50" y="44" font-family="system-ui, sans-serif" font-size="15" font-weight="900" fill="#f59e0b" text-anchor="middle">👑</text>
    <text x="50" y="65" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">SCANIA</text>
  </svg>`,

  volvo: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="42" stroke="#94a3b8" stroke-width="5" fill="#0f172a"/>
    <line x1="72" y1="28" x2="88" y2="12" stroke="#94a3b8" stroke-width="5"/>
    <polygon points="76,12 88,12 88,24" fill="#94a3b8"/>
    <rect x="24" y="44" width="52" height="14" fill="#1e3a8a"/>
    <text x="50" y="55" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">VOLVO</text>
  </svg>`,

  ferrari: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10H80V65C80 82 50 94 50 94C50 94 20 82 20 65Z" fill="#fbbf24" stroke="#000" stroke-width="3"/>
    <rect x="25" y="12" width="16" height="6" fill="#10b981"/>
    <rect x="42" y="12" width="16" height="6" fill="#f8fafc"/>
    <rect x="59" y="12" width="16" height="6" fill="#ef4444"/>
    <text x="50" y="64" font-size="34" text-anchor="middle">🐎</text>
  </svg>`,

  yamaha: `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#b91c1c" stroke="#dc2626" stroke-width="3"/>
    <circle cx="50" cy="50" r="32" stroke="#ffffff" stroke-width="3"/>
    <line x1="50" y1="18" x2="50" y2="82" stroke="#ffffff" stroke-width="4"/>
    <line x1="22" y1="34" x2="78" y2="66" stroke="#ffffff" stroke-width="4"/>
    <line x1="22" y1="66" x2="78" y2="34" stroke="#ffffff" stroke-width="4"/>
  </svg>`
};

/**
 * Retorna o Logo SVG da marca ou um emblema automotivo genérico elegante
 */
export function obterLogoMarcaSvg(marcaNome) {
  const n = String(marcaNome || '').toLowerCase();
  for (const [key, svg] of Object.entries(LOGOS_MONTADORAS_SVG)) {
    if (n.includes(key)) return svg;
  }
  // Fallback para montadora genérica
  return `<svg viewBox="0 0 100 100" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="#10b981" stroke-width="3"/>
    <text x="50" y="60" font-size="32" text-anchor="middle">🏎️</text>
  </svg>`;
}

/**
 * Ilustrações e Fotos Vetoriais das Categorias Veiculares
 */
export const SILHUETAS_CATEGORIAS_SVG = {
  suv: `<svg viewBox="0 0 400 180" width="100%" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="180" rx="12" fill="#091311"/>
    <!-- Chassi SUV -->
    <path d="M50 120H350L335 88L260 52H140L80 88L50 120Z" fill="#132320" stroke="#10b981" stroke-width="2.5"/>
    <!-- Cabine & Janelas -->
    <path d="M145 56H255L315 88H88L145 56Z" fill="#0c1715" stroke="#334155" stroke-width="1.5"/>
    <line x1="200" y1="56" x2="200" y2="88" stroke="#334155" stroke-width="2"/>
    <!-- Faróis -->
    <polygon points="50,110 65,108 65,116 50,118" fill="#a3e635"/>
    <polygon points="350,110 338,108 338,116 350,118" fill="#ef4444"/>
    <!-- Rodas -->
    <circle cx="105" cy="125" r="24" fill="#030712" stroke="#64748b" stroke-width="4"/>
    <circle cx="105" cy="125" r="14" fill="#1e293b"/>
    <circle cx="295" cy="125" r="24" fill="#030712" stroke="#64748b" stroke-width="4"/>
    <circle cx="295" cy="125" r="14" fill="#1e293b"/>
    <text x="200" y="165" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#a3e635" text-anchor="middle" letter-spacing="1">CATEGORIA SUV &amp; CROSSOVER</text>
  </svg>`,

  sedan: `<svg viewBox="0 0 400 180" width="100%" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="180" rx="12" fill="#091311"/>
    <!-- Chassi Sedan -->
    <path d="M40 122H360L335 96L285 58H155L95 96L40 122Z" fill="#132320" stroke="#60a5fa" stroke-width="2.5"/>
    <path d="M158 62H280L320 96H105L158 62Z" fill="#0c1715" stroke="#334155" stroke-width="1.5"/>
    <line x1="220" y1="62" x2="220" y2="96" stroke="#334155" stroke-width="2"/>
    <!-- Faróis -->
    <polygon points="40,112 55,110 55,118 40,120" fill="#60a5fa"/>
    <polygon points="360,112 348,110 348,118 360,120" fill="#ef4444"/>
    <!-- Rodas -->
    <circle cx="95" cy="124" r="22" fill="#030712" stroke="#64748b" stroke-width="4"/>
    <circle cx="95" cy="124" r="13" fill="#1e293b"/>
    <circle cx="305" cy="124" r="22" fill="#030712" stroke="#64748b" stroke-width="4"/>
    <circle cx="305" cy="124" r="13" fill="#1e293b"/>
    <text x="200" y="165" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#60a5fa" text-anchor="middle" letter-spacing="1">CATEGORIA SEDAN MÉDIO / PREMIUM</text>
  </svg>`,

  hatch: `<svg viewBox="0 0 400 180" width="100%" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="180" rx="12" fill="#091311"/>
    <!-- Chassi Hatchback -->
    <path d="M50 122H335L335 84L250 56H150L85 96L50 122Z" fill="#132320" stroke="#a3e635" stroke-width="2.5"/>
    <path d="M152 60H245L315 84H95L152 60Z" fill="#0c1715" stroke="#334155" stroke-width="1.5"/>
    <line x1="205" y1="60" x2="205" y2="84" stroke="#334155" stroke-width="2"/>
    <!-- Rodas -->
    <circle cx="95" cy="124" r="20" fill="#030712" stroke="#64748b" stroke-width="4"/>
    <circle cx="95" cy="124" r="12" fill="#1e293b"/>
    <circle cx="285" cy="124" r="20" fill="#030712" stroke="#64748b" stroke-width="4"/>
    <circle cx="285" cy="124" r="12" fill="#1e293b"/>
    <text x="200" y="165" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#a3e635" text-anchor="middle" letter-spacing="1">CATEGORIA HATCHBACK COMPACTO</text>
  </svg>`,

  picape: `<svg viewBox="0 0 400 180" width="100%" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="180" rx="12" fill="#091311"/>
    <!-- Chassi Picape -->
    <path d="M40 120H360V95H250L215 54H135L80 90L40 120Z" fill="#132320" stroke="#f59e0b" stroke-width="2.5"/>
    <path d="M140 58H210L240 92H92L140 58Z" fill="#0c1715" stroke="#334155" stroke-width="1.5"/>
    <line x1="180" y1="58" x2="180" y2="92" stroke="#334155" stroke-width="2"/>
    <!-- Caçamba -->
    <rect x="252" y="93" width="98" height="2" fill="#f59e0b"/>
    <!-- Rodas -->
    <circle cx="95" cy="125" r="26" fill="#030712" stroke="#64748b" stroke-width="5"/>
    <circle cx="95" cy="125" r="15" fill="#1e293b"/>
    <circle cx="305" cy="125" r="26" fill="#030712" stroke="#64748b" stroke-width="5"/>
    <circle cx="305" cy="125" r="15" fill="#1e293b"/>
    <text x="200" y="165" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#fbbf24" text-anchor="middle" letter-spacing="1">CATEGORIA PICAPE &amp; CABINE DUPLA</text>
  </svg>`,

  moto: `<svg viewBox="0 0 400 180" width="100%" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="180" rx="12" fill="#091311"/>
    <!-- Quadro da Moto -->
    <path d="M110 115L170 70H220L250 95L290 115" stroke="#ef4444" stroke-width="4"/>
    <path d="M170 70L200 115H250" stroke="#ef4444" stroke-width="3"/>
    <line x1="160" y1="60" x2="180" y2="70" stroke="#f8fafc" stroke-width="3"/>
    <!-- Tanque -->
    <path d="M170 68Q200 58 225 72Z" fill="#ef4444"/>
    <!-- Rodas -->
    <circle cx="110" cy="115" r="25" fill="#030712" stroke="#64748b" stroke-width="4"/>
    <circle cx="110" cy="115" r="10" fill="#1e293b"/>
    <circle cx="290" cy="115" r="25" fill="#030712" stroke="#64748b" stroke-width="4"/>
    <circle cx="290" cy="115" r="10" fill="#1e293b"/>
    <text x="200" y="165" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#f87171" text-anchor="middle" letter-spacing="1">MOTOCICLETA STREET / NAKED</text>
  </svg>`,

  caminhao: `<svg viewBox="0 0 400 180" width="100%" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="180" rx="12" fill="#091311"/>
    <!-- Cavalo Mecânico -->
    <path d="M60 120H340V90H210V38H100L60 75V120Z" fill="#132320" stroke="#3b82f6" stroke-width="2.5"/>
    <rect x="75" y="48" width="55" height="30" fill="#0c1715" stroke="#334155" stroke-width="1.5"/>
    <!-- Farol -->
    <rect x="60" y="100" width="8" height="12" fill="#a3e635"/>
    <!-- Rodas -->
    <circle cx="110" cy="126" r="22" fill="#030712" stroke="#64748b" stroke-width="5"/>
    <circle cx="260" cy="126" r="22" fill="#030712" stroke="#64748b" stroke-width="5"/>
    <circle cx="310" cy="126" r="22" fill="#030712" stroke="#64748b" stroke-width="5"/>
    <text x="200" y="165" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#60a5fa" text-anchor="middle" letter-spacing="1">CAVALO MECÂNICO EXTRA-PESADO 6X2 / 6X4</text>
  </svg>`
};

/**
 * Retorna a ilustração/foto vetorial correspondente para a categoria do veículo
 */
export function obterIlustracaoVeiculo(modeloNome, tipo = 'carros') {
  const m = String(modeloNome || '').toLowerCase();
  const t = String(tipo || 'carros').toLowerCase();

  if (t === 'motos') return SILHUETAS_CATEGORIAS_SVG.moto;
  if (t === 'caminhoes') return SILHUETAS_CATEGORIAS_SVG.caminhao;

  if (m.includes('strada') || m.includes('toro') || m.includes('hilux') || m.includes('ranger') || m.includes('s10') || m.includes('montana') || m.includes('saveiro') || m.includes('amarok')) {
    return SILHUETAS_CATEGORIAS_SVG.picape;
  }
  if (m.includes('nivus') || m.includes('t-cross') || m.includes('tracker') || m.includes('compass') || m.includes('renegade') || m.includes('creta') || m.includes('kicks') || m.includes('duster') || m.includes('hr-v') || m.includes('pulse') || m.includes('fastback') || m.includes('song plus') || m.includes('haval')) {
    return SILHUETAS_CATEGORIAS_SVG.suv;
  }
  if (m.includes('corolla') || m.includes('civic') || m.includes('onix plus') || m.includes('virtus') || m.includes('cronos') || m.includes('sentra') || m.includes('versa') || m.includes('city') || m.includes('cruze')) {
    return SILHUETAS_CATEGORIAS_SVG.sedan;
  }
  return SILHUETAS_CATEGORIAS_SVG.hatch;
}
