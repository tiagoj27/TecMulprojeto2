// ─── CONSTANTES E DADOS ESTÁTICOS ────────────────────────────────
var TAM_BASE = 40;
var TAM  = TAM_BASE;
var COLS = 10;
var ROWS = 10;
var CICLO_MS = 2200;
var JOGO_MARGEM = 30;
var JOGO_BASE_LARGURA = 1920;
var JOGO_BASE_ALTURA = 875;
var JOGO_LARGURA = JOGO_BASE_LARGURA;
var JOGO_ALTURA = JOGO_BASE_ALTURA;
var JOGO_CENTRO_X = 500;
var JOGO_CENTRO_Y = 375;
var JOGO_ESCALA = 1;
var QUINTA_OFFSET_X_BASE = 35;
var QUINTA_OFFSET_Y_BASE = 60;
var QUINTA_RELEVO_BASE = 10;
var ISO_ORIGEM_X = 500;
var ISO_ORIGEM_Y = 200;

function atualizarDimensoesJogo() {
    var larguraDisponivel = Math.max(320, Math.floor((window.innerWidth || JOGO_BASE_LARGURA + JOGO_MARGEM * 2) - JOGO_MARGEM * 2));
    var alturaDisponivel = Math.max(240, Math.floor((window.innerHeight || JOGO_BASE_ALTURA + JOGO_MARGEM * 2) - JOGO_MARGEM * 2));
    JOGO_ESCALA = Math.min(larguraDisponivel / JOGO_BASE_LARGURA, alturaDisponivel / JOGO_BASE_ALTURA);
    JOGO_LARGURA = Math.floor(JOGO_BASE_LARGURA * JOGO_ESCALA);
    JOGO_ALTURA = Math.floor(JOGO_BASE_ALTURA * JOGO_ESCALA);
    JOGO_CENTRO_X = JOGO_LARGURA / 2;
    JOGO_CENTRO_Y = JOGO_ALTURA / 2;
    TAM = TAM_BASE * JOGO_ESCALA;
    ISO_ORIGEM_X = JOGO_CENTRO_X + QUINTA_OFFSET_X_BASE * JOGO_ESCALA;
    ISO_ORIGEM_Y = Math.round(JOGO_CENTRO_Y - ((COLS + ROWS - 2) * TAM * 0.5 + 14) / 2 + QUINTA_OFFSET_Y_BASE * JOGO_ESCALA);
    document.documentElement.style.setProperty('--game-width', JOGO_LARGURA + 'px');
    document.documentElement.style.setProperty('--game-height', JOGO_ALTURA + 'px');
}

var COR = {
    terra: 0x6b4a2d, herva: 0x63b76d, semente: 0x5a3a25,
    broto: 0x80b95c, crescendo: 0x9fbc5f, maduro: 0xb9c46a,
    colhivel: 0xd4a84f, bloqueado: 0x2f3225, loja: 0x2f6f5b, regado: 0x68c5cf
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
    maca:     { emoji: '🍎', nome: 'Maçã',     ganho: 520, custoPlantio: 170, extraCiclo: 3, fruto: 0xef4444, requerPomar: true },
    laranja:  { emoji: '🍊', nome: 'Laranja',  ganho: 560, custoPlantio: 185, extraCiclo: 3, fruto: 0xf97316, requerPomar: true },
    pera:     { emoji: '🍐', nome: 'Pêra',     ganho: 480, custoPlantio: 160, extraCiclo: 3, fruto: 0x84cc16, requerPomar: true },

    // --- Nova Cultura Rara / Mística ---
    cogumelo: { emoji: '🍄', nome: 'Cogumelo Cósmico', ganho: 1200, custoPlantio: 400, extraCiclo: 0, fruto: 0x8b5cf6, requerEstufa: true }
};

var ORDEM_SEMENTES_BASE = ['girassol', 'milho', 'morango'];
var ORDEM_SEMENTES_POMAR = ['cereja', 'maca', 'laranja', 'pera'];
