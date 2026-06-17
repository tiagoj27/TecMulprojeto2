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
    cenoura:  { emoji: '🥕', nome: 'Cenoura',  ganho: 30,  custoPlantio: 9,   extraCiclo: 1, fruto: 0xf97316 },
    morango:  { emoji: '🍓', nome: 'Morango',  ganho: 48,  custoPlantio: 14,  extraCiclo: 1, fruto: 0xef4444 },
    girassol: { emoji: '🌻', nome: 'Girassol', ganho: 68,  custoPlantio: 20,  extraCiclo: 0, fruto: 0xf97316 },
    batata:   { emoji: '🥔', nome: 'Batata',   ganho: 82,  custoPlantio: 24,  extraCiclo: 0, fruto: 0xd97706 },
    milho:    { emoji: '🌽', nome: 'Milho',    ganho: 112, custoPlantio: 34,  extraCiclo: 0, fruto: 0xfde047 },
    tomate:   { emoji: '🍅', nome: 'Tomate',   ganho: 150, custoPlantio: 46,  extraCiclo: 2, fruto: 0xdc2626 },
    pimento:  { emoji: '🌶️', nome: 'Pimento',  ganho: 185, custoPlantio: 58,  extraCiclo: 1, fruto: 0x22c55e },
    abóbora:  { emoji: '🎃', nome: 'Abóbora',  ganho: 360, custoPlantio: 120, extraCiclo: 0, fruto: 0xea580c },
    melancia: { emoji: '🍉', nome: 'Melancia', ganho: 420, custoPlantio: 150, extraCiclo: 1, fruto: 0x16a34a },

    // --- Estufa ---
    lavanda:  { emoji: '💜', nome: 'Lavanda',  ganho: 330, custoPlantio: 105, extraCiclo: 0, fruto: 0xa78bfa, requerEstufa: true },
    cogumelo: { emoji: '🍄', nome: 'Cogumelo', ganho: 650, custoPlantio: 260, extraCiclo: 0, fruto: 0x8b5cf6, requerEstufa: true },

    // --- Pomar ---
    cereja:   { emoji: '🍒', nome: 'Cereja',   ganho: 570, custoPlantio: 190, extraCiclo: 4, fruto: 0x991b1b, requerPomar: true },
    maca:     { emoji: '🍎', nome: 'Maçã',     ganho: 520, custoPlantio: 175, extraCiclo: 3, fruto: 0xef4444, requerPomar: true },
    laranja:  { emoji: '🍊', nome: 'Laranja',  ganho: 560, custoPlantio: 195, extraCiclo: 3, fruto: 0xf97316, requerPomar: true },
    pera:     { emoji: '🍐', nome: 'Pêra',     ganho: 490, custoPlantio: 165, extraCiclo: 3, fruto: 0x84cc16, requerPomar: true },
    ameixa:   { emoji: '🟣', nome: 'Ameixa',   ganho: 610, custoPlantio: 210, extraCiclo: 3, fruto: 0x7c3aed, requerPomar: true },
    pessego:  { emoji: '🍑', nome: 'Pêssego',  ganho: 660, custoPlantio: 230, extraCiclo: 4, fruto: 0xfb923c, requerPomar: true }
};

var ORDEM_SEMENTES_BASE = ['cenoura', 'morango', 'girassol', 'batata', 'milho', 'tomate', 'pimento', 'abóbora', 'melancia'];
var ORDEM_SEMENTES_ESTUFA = ['lavanda', 'cogumelo'];
var ORDEM_SEMENTES_POMAR = ['cereja', 'maca', 'laranja', 'pera', 'ameixa', 'pessego'];
