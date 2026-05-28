// ─── CONSTANTES E DADOS ESTÁTICOS ────────────────────────────────
var TAM  = 42;
var COLS = 10;
var ROWS = 10;
var CICLO_MS = 2200;

var COR = {
    terra: 0x1a3a1a, herva: 0x22c55e, semente: 0x451a03,
    broto: 0x65a30d, crescendo: 0x84cc16, maduro: 0xa3e635,
    colhivel: 0xfacc15, bloqueado: 0x1e293b, loja: 0x164e63, regado: 0x0ea5e9
};

var CULTURAS = {
    // --- Originais ---
    girassol: { emoji: '🌻', nome: 'Girassol', ganho: 65,  custoPlantio: 18,  extraCiclo: 0, fruto: 0xf97316 },
    milho:    { emoji: '🌽', nome: 'Milho',    ganho: 110, custoPlantio: 32,  extraCiclo: 0, fruto: 0xfde047 },
    morango:  { emoji: '🍓', nome: 'Morango',  ganho: 45,  custoPlantio: 12,  extraCiclo: 1, fruto: 0xef4444 },
    lavanda:  { emoji: '💜', nome: 'Lavanda',  ganho: 320, custoPlantio: 95,  extraCiclo: 0, fruto: 0xa78bfa, requerEstufa: true },

    // --- Novas Culturas (Básicas e Intermédias) ---
    cenoura:  { emoji: '🥕', nome: 'Cenoura',  ganho: 35,  custoPlantio: 10,  extraCiclo: 0, fruto: 0xf97316 }, // Barata e rápida
    batata:   { emoji: '🥔', nome: 'Batata',   ganho: 80,  custoPlantio: 22,  extraCiclo: 0, fruto: 0xd97706 },
    tomate:   { emoji: '🍅', nome: 'Tomate',   ganho: 140, custoPlantio: 40,  extraCiclo: 2, fruto: 0xdc2626 }, // Dá várias colheitas (extraCiclo)

    // --- Novas Culturas (Avançadas e Árvores) ---
    abóbora:  { emoji: '🎃', nome: 'Abóbora',  ganho: 450, custoPlantio: 130, extraCiclo: 0, fruto: 0xea580c }, // Demora mas lucra muito
    cereja:   { emoji: '🍒', nome: 'Cereja',   ganho: 600, custoPlantio: 200, extraCiclo: 4, fruto: 0x991b1b, requerPomar: true }, // Requisito especial

    // --- Nova Cultura Rara / Mística ---
    cogumelo: { emoji: '🍄', nome: 'Cogumelo Cósmico', ganho: 1200, custoPlantio: 400, extraCiclo: 0, fruto: 0x8b5cf6, requerEstufa: true }
};

var ORDEM_SEMENTES_BASE = ['girassol', 'milho', 'morango'];
