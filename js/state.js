// ─── ESTADO, ECONOMIA, LOJA, SAVE ───────────────────────────────
var G = {
    moedas: 250, nivelTrator: 1, velTrator: 155,
    plantas: null, desbloq: null, rega: null, tipo: null,
    colheitas: 0, expansoes: 0, dia: 1, regaRestante: 5,
    sementeAtiva: 'girassol', bonusColheita: 1, upgradeOuro: false,
    aduboRestante: 2, combo: 0, maxCombo: 0, ultimaColheita: 0,
    eventoDia: null, missoes: null,
    aspersores: 0, aspersorPos: null, silos: 0, empregados: 0, celeiroNv: 0,
    estufa: false, ouroNv: 0, eliteSem: null, totalGasto: 0,
    nivelQuinta: 1, xpQuinta: 0,
    galinheiro: 0, irradiadores: 0, exportador: false,
    contrato: null, conquistas: null,
    arado: false, aradoAcoplado: false, ampliacoesTerreno: 0,
    pomar: false, pomarPlantas: null, pomarTipo: null, pomarRega: null,
    animais: false, animaisData: null, sementesCompradas: null
    , sementeCampoAtiva: 'girassol', sementePomarAtiva: 'cereja'
};

var LOJA_CATALOGO = [
    { id: 'trator2', emoji: '🚜', nome: 'Trator Turbo', max: 1, custoBase: 420, mult: 1,
      desc: 'Mais rápido, mas controlável', requer: function() { return G.nivelTrator < 2; },
      aplicar: function() { G.nivelTrator = 2; G.velTrator = velocidadeTratorNivel(2); } },
    { id: 'ouro', emoji: '✨', nome: 'Colheita Ouro', max: 1, custoBase: 520, mult: 1,
      desc: '+30% valor colheitas', requer: function() { return G.ouroNv < 1; },
      aplicar: function() { G.ouroNv = 1; } },
    { id: 'arado', emoji: '⛏️', nome: 'Arado', max: 1, custoBase: 160, mult: 1,
      desc: 'Acopla com [C] e ara ao segurar espaço', requer: function() { return !G.arado; },
      aplicar: function() { G.arado = true; G.aradoAcoplado = true; } },
    { id: 'terreno', emoji: '🗺', nome: 'Ampliar terreno', max: 8, custoBase: 560, mult: 1.42,
      desc: 'Desbloqueia 6 parcelas próximas', aplicar: function() {
          var n = desbloquearTerreno(6);
          G.ampliacoesTerreno = (G.ampliacoesTerreno || 0) + 1;
          if (n > 0) {
              progMissao('expandir', n);
              for (var i = 0; i < n; i++) progContrato('expandir');
          }
      } },
    { id: 'aspersor', emoji: '💦', nome: 'Aspersor', max: 6, custoBase: 1150, mult: 1.62,
      desc: 'Rega 3×3; move com [M]', aplicar: function() { G.aspersores++; normalizarAspersores(); } },
    { id: 'silo', emoji: '🏗️', nome: 'Silo', max: 5, custoBase: 2400, mult: 1.75,
      desc: '+200€ rendimento/dia', aplicar: function() { G.silos++; } },
    { id: 'galinheiro', emoji: '🐔', nome: 'Galinheiro', max: 4, custoBase: 2600, mult: 1.7,
      desc: '+180€/dia (ração 90€/dia)', aplicar: function() { G.galinheiro++; } },
    { id: 'empregado', emoji: '👨‍🌾', nome: 'Empregado', max: 4, custoBase: 4200, mult: 1.9,
      desc: 'Colhe 1 planta/ciclo', aplicar: function() { G.empregados++; } },
    { id: 'estufa', emoji: '🏠', nome: 'Estufa', max: 1, custoBase: 9500, mult: 1,
      desc: 'Desbloqueia lavanda e cogumelo', requer: function() { return !G.estufa; },
      aplicar: function() { G.estufa = true; } },
    { id: 'ouro2', emoji: '👑', nome: 'Colheita Ouro II', max: 1, custoBase: 8200, mult: 1,
      desc: '+25% extra nas colheitas', requer: function() { return G.ouroNv >= 1 && G.ouroNv < 2; },
      aplicar: function() { G.ouroNv = 2; } },
    { id: 'irradiador', emoji: '⚡', nome: 'Irradiador', max: 3, custoBase: 7000, mult: 1.85,
      desc: 'Ciclos 12% mais rápidos', aplicar: function() { G.irradiadores++; } },
    { id: 'trator3', emoji: '🚀', nome: 'Trator Hiper', max: 1, custoBase: 13500, mult: 1,
      desc: 'Ainda mais rápido sem fugir das mãos', requer: function() { return G.nivelTrator >= 2 && G.nivelTrator < 3; },
      aplicar: function() { G.nivelTrator = 3; G.velTrator = velocidadeTratorNivel(3); } },
    { id: 'celeiro', emoji: '🌾', nome: 'Celeiro', max: 4, custoBase: 6200, mult: 1.85,
      desc: '+500€ rendimento/dia', aplicar: function() { G.celeiroNv++; } },
    { id: 'exportador', emoji: '🚢', nome: 'Exportador', max: 1, custoBase: 19000, mult: 1,
      desc: '+20% em todas as vendas', requer: function() { return !G.exportador; },
      aplicar: function() { G.exportador = true; } },
    { id: 'elite', emoji: '⭐', nome: 'Sementes Elite', max: 1, custoBase: 3600, mult: 1,
      desc: '+30% ganho cultura atual', requer: function() { return !(G.eliteSem && G.eliteSem[G.sementeAtiva]); },
      aplicar: function() {
          if (!G.eliteSem) G.eliteSem = {};
          G.eliteSem[G.sementeAtiva] = true;
      } },
    { id: 'pomar', emoji: '🍎', nome: 'Pomar', max: 1, custoBase: 7200, mult: 1,
      desc: 'Desbloqueia o pomar (árvores e culturas grandes)', requer: function() { return !G.pomar && terrenoTodoDesbloqueado(); },
      aplicar: function() { G.pomar = true; } }
    ,
    { id: 'animais', emoji: '🐄', nome: 'Animais', max: 1, custoBase: 10500, mult: 1,
      desc: 'Desbloqueia a área de animais (galinhas e vacas)', requer: function() { return !G.animais && terrenoTodoDesbloqueado(); },
      aplicar: function() { G.animais = true; } }
    ,
    { id: 'semente_cenoura', emoji: '🥕', nome: 'Sementes de Cenoura', max: 1, custoBase: 220, mult: 1,
      desc: 'Desbloqueia cenoura no campo', requer: function() { return !sementeDesbloqueada('cenoura'); },
      aplicar: function() { comprarSemente('cenoura'); } },
    { id: 'semente_batata', emoji: '🥔', nome: 'Sementes de Batata', max: 1, custoBase: 480, mult: 1,
      desc: 'Desbloqueia batata no campo', requer: function() { return !sementeDesbloqueada('batata'); },
      aplicar: function() { comprarSemente('batata'); } },
    { id: 'semente_tomate', emoji: '🍅', nome: 'Sementes de Tomate', max: 1, custoBase: 950, mult: 1,
      desc: 'Desbloqueia tomate no campo', requer: function() { return !sementeDesbloqueada('tomate'); },
      aplicar: function() { comprarSemente('tomate'); } },
    { id: 'semente_pimento', emoji: '🌶️', nome: 'Sementes de Pimento', max: 1, custoBase: 1450, mult: 1,
      desc: 'Desbloqueia pimento no campo', requer: function() { return !sementeDesbloqueada('pimento'); },
      aplicar: function() { comprarSemente('pimento'); } },
    { id: 'semente_abobora', emoji: '🎃', nome: 'Sementes de Abóbora', max: 1, custoBase: 2600, mult: 1,
      desc: 'Desbloqueia abóbora no campo', requer: function() { return !sementeDesbloqueada('abóbora'); },
      aplicar: function() { comprarSemente('abóbora'); } },
    { id: 'semente_melancia', emoji: '🍉', nome: 'Sementes de Melancia', max: 1, custoBase: 3600, mult: 1,
      desc: 'Desbloqueia melancia no campo', requer: function() { return !sementeDesbloqueada('melancia'); },
      aplicar: function() { comprarSemente('melancia'); } },
    { id: 'semente_cogumelo', emoji: '🍄', nome: 'Esporos de Cogumelo', max: 1, custoBase: 5200, mult: 1,
      desc: 'Desbloqueia cogumelo na estufa', requer: function() { return G.estufa && !sementeDesbloqueada('cogumelo'); },
      aplicar: function() { comprarSemente('cogumelo'); } },
    { id: 'semente_ameixa', emoji: '🟣', nome: 'Muda de Ameixa', max: 1, custoBase: 4600, mult: 1,
      desc: 'Desbloqueia ameixeira no pomar', requer: function() { return G.pomar && !sementeDesbloqueada('ameixa'); },
      aplicar: function() { comprarSemente('ameixa'); } },
    { id: 'semente_pessego', emoji: '🍑', nome: 'Muda de Pêssego', max: 1, custoBase: 5400, mult: 1,
      desc: 'Desbloqueia pessegueiro no pomar', requer: function() { return G.pomar && !sementeDesbloqueada('pessego'); },
      aplicar: function() { comprarSemente('pessego'); } }
];

function velocidadeTratorNivel(nivel) {
    if (nivel >= 3) return 85;
    if (nivel >= 2) return 110;
    return 155;
}

function ordemSementes() {
    var o = (ORDEM_SEMENTES_BASE || []).filter(function(tipo) {
        return sementeDesbloqueada(tipo) && CULTURAS[tipo] && !CULTURAS[tipo].requerPomar && !CULTURAS[tipo].requerEstufa;
    });
    if (G.estufa && ORDEM_SEMENTES_ESTUFA) {
        o = o.concat(ORDEM_SEMENTES_ESTUFA.filter(function(tipo) {
            return sementeDesbloqueada(tipo) && CULTURAS[tipo] && CULTURAS[tipo].requerEstufa && !CULTURAS[tipo].requerPomar;
        }));
    }
    return o.length ? o : ['girassol'];
}

function ordemSementesPomar() {
    var o = (ORDEM_SEMENTES_POMAR || []).filter(function(tipo) {
        return sementeDesbloqueada(tipo) && CULTURAS[tipo] && CULTURAS[tipo].requerPomar;
    });
    return o.length ? o : ['cereja'];
}

function sementesIniciais() {
    return {
        girassol: true, milho: true, morango: true, lavanda: true,
        cereja: true, maca: true, laranja: true, pera: true
    };
}

function normalizarSementesCompradas() {
    if (!G.sementesCompradas) G.sementesCompradas = {};
    var iniciais = sementesIniciais();
    Object.keys(iniciais).forEach(function(k) { G.sementesCompradas[k] = true; });
}

function sementeDesbloqueada(tipo) {
    if (!G.sementesCompradas) normalizarSementesCompradas();
    return !!G.sementesCompradas[tipo];
}

function comprarSemente(tipo) {
    normalizarSementesCompradas();
    G.sementesCompradas[tipo] = true;
}

function custoExpansao() {
    var e = G.expansoes || 0;
    return Math.floor(120 + e * 85 + Math.pow(e, 1.65) * 22);
}

function custoPlantio(tipo) {
    var c = CULTURAS[tipo];
    if (!c) return 99;
    var v = c.custoPlantio;
    if (G.eliteSem && G.eliteSem[tipo]) v = Math.floor(v * 0.75);
    return v;
}

function desbloquearTerreno(qtd) {
    if (!G.desbloq) return 0;
    var cand = [];
    for (var x = 0; x < COLS; x++) {
        for (var y = 0; y < ROWS; y++) {
            if (G.desbloq[x][y]) continue;
            var perto = (x > 0 && G.desbloq[x - 1][y]) ||
                        (x < COLS - 1 && G.desbloq[x + 1][y]) ||
                        (y > 0 && G.desbloq[x][y - 1]) ||
                        (y < ROWS - 1 && G.desbloq[x][y + 1]);
            if (perto) cand.push({ x: x, y: y, d: Math.abs(x - 4) + Math.abs(y - 4) });
        }
    }
    cand.sort(function(a, b) { return a.d - b.d; });
    var total = Math.min(qtd || 1, cand.length);
    for (var i = 0; i < total; i++) {
        var p = cand[i];
        G.desbloq[p.x][p.y] = true;
        G.plantas[p.x][p.y] = 0;
        G.rega[p.x][p.y] = false;
        G.tipo[p.x][p.y] = '';
    }
    G.expansoes += total;
    return total;
}

function terrenoTodoDesbloqueado() {
    if (!G.desbloq) return false;
    for (var x = 0; x < COLS; x++) {
        for (var y = 0; y < ROWS; y++) {
            if (!G.desbloq[x] || !G.desbloq[x][y]) return false;
        }
    }
    return true;
}

var POS_ASPERSORES = [[1,1], [3,1], [1,3], [3,3], [2,2], [4,4]];
var POS_EMPREGADOS = [[4,1], [1,4], [4,3], [3,4]];

function parcelasDesbloqueadas() {
    var out = [];
    if (!G.desbloq) return out;
    for (var x = 0; x < COLS; x++) {
        for (var y = 0; y < ROWS; y++) {
            if (x === 0 && y === 0) continue;
            if (G.desbloq[x] && G.desbloq[x][y]) out.push({ x: x, y: y });
        }
    }
    return out;
}

function posicaoInfra(lista, idx) {
    var pos = lista[idx];
    if (pos && G.desbloq && G.desbloq[pos[0]] && G.desbloq[pos[0]][pos[1]]) {
        return { x: pos[0], y: pos[1] };
    }
    var livres = parcelasDesbloqueadas();
    return livres.length ? livres[idx % livres.length] : null;
}

function posicaoAspersor(idx) {
    normalizarAspersores();
    return G.aspersorPos && G.aspersorPos[idx] ? G.aspersorPos[idx] : null;
}

function normalizarAspersores() {
    if (!G.aspersorPos) G.aspersorPos = [];
    for (var i = 0; i < (G.aspersores || 0); i++) {
        if (G.aspersorPos[i] === null) continue;
        var p = G.aspersorPos[i];
        var ok = p && p.x >= 0 && p.x < COLS && p.y >= 0 && p.y < ROWS &&
            G.desbloq && G.desbloq[p.x] && G.desbloq[p.x][p.y] && !(p.x === 0 && p.y === 0);
        if (!ok) {
            var fallback = posicaoInfra(POS_ASPERSORES, i);
            G.aspersorPos[i] = fallback ? { x: fallback.x, y: fallback.y } : null;
        }
    }
    G.aspersorPos.length = G.aspersores || 0;
}

function indiceAspersorNoTile(x, y) {
    normalizarAspersores();
    for (var i = 0; i < (G.aspersores || 0); i++) {
        if (G.aspersorEmMovimento === i) continue;
        var p = G.aspersorPos[i];
        if (p && p.x === x && p.y === y) return i;
    }
    return -1;
}

function temAspersorNoTile(x, y) {
    return indiceAspersorNoTile(x, y) >= 0;
}

function tileEmAreaAspersor(x, y) {
    normalizarAspersores();
    for (var i = 0; i < (G.aspersores || 0); i++) {
        if (G.aspersorEmMovimento === i) continue;
        var p = G.aspersorPos[i];
        if (p && Math.abs(p.x - x) <= 1 && Math.abs(p.y - y) <= 1) return true;
    }
    return false;
}

function temEmpregadoNoTile(x, y) {
    var qtd = Math.min(G.empregados || 0, POS_EMPREGADOS.length);
    for (var i = 0; i < qtd; i++) {
        var p = posicaoInfra(POS_EMPREGADOS, i);
        if (p && p.x === x && p.y === y) return true;
    }
    return false;
}

function xpParaNivel(n) {
    return Math.floor(450 * Math.pow(1.42, (n || 1) - 1));
}

function bonusNivelQuinta() {
    return 1 + ((G.nivelQuinta || 1) - 1) * 0.03;
}

function ganharXP(qtd) {
    G.xpQuinta = (G.xpQuinta || 0) + qtd;
    var need = xpParaNivel(G.nivelQuinta);
    while (G.xpQuinta >= need) {
        G.xpQuinta -= need;
        G.nivelQuinta = (G.nivelQuinta || 1) + 1;
        need = xpParaNivel(G.nivelQuinta);
        toast('⭐ Quinta subiu para nível ' + G.nivelQuinta + '!', 'ok', 3500);
        verificarConquistas();
    }
}

function multCiclo() {
    var m = (G.eventoDia && G.eventoDia.cicloMult) || 1;
    m *= Math.pow(0.88, G.irradiadores || 0);
    return m;
}

function initConquistas() {
    G.conquistas = [
        { id: 'c1', desc: 'Primeira colheita', ok: false, premio: 50 },
        { id: 'c2', desc: '10 colheitas', ok: false, premio: 200, alvo: 10 },
        { id: 'c3', desc: 'Quinta nível 5', ok: false, premio: 1000, nv: 5 },
        { id: 'c4', desc: 'Comprar estufa', ok: false, premio: 500 },
        { id: 'c5', desc: 'Gastar 25000€', ok: false, premio: 2000, gasto: 25000 },
        { id: 'c6', desc: 'Contrato concluído', ok: false, premio: 300 }
    ];
}

function verificarConquistas() {
    if (!G.conquistas) return;
    G.conquistas.forEach(function(c) {
        if (c.ok) return;
        var feito = false;
        if (c.id === 'c1' && G.colheitas >= 1) feito = true;
        if (c.id === 'c2' && G.colheitas >= 10) feito = true;
        if (c.id === 'c3' && G.nivelQuinta >= 5) feito = true;
        if (c.id === 'c4' && G.estufa) feito = true;
        if (c.id === 'c5' && (G.totalGasto || 0) >= 25000) feito = true;
        if (c.id === 'c6' && G._contratosFeitos) feito = true;
        if (feito) {
            c.ok = true;
            G.moedas += c.premio;
            if (window.AudioJogo) AudioJogo.sfx('harvest');
            toast('🏆 ' + c.desc + ' (+' + c.premio + '€)', 'ok', 4000);
        }
    });
}

function novoContrato() {
    var tipos = ordemSementes();
    var tipo = tipos[Phaser.Math.Between(0, tipos.length - 1)];
    var modelos = [
        { tipo: 'colheitas', desc: 'Colher ' + Phaser.Math.Between(6, 14) + ' plantas', alvo: 0, premio: Phaser.Math.Between(600, 1200) },
        { tipo: 'cultura', cultura: tipo, desc: 'Colher 4× ' + CULTURAS[tipo].emoji + ' ' + CULTURAS[tipo].nome, alvo: 4, premio: Phaser.Math.Between(900, 1600) },
        { tipo: 'expandir', desc: 'Expandir ' + Phaser.Math.Between(2, 4) + ' parcelas', alvo: Phaser.Math.Between(2, 4), premio: Phaser.Math.Between(800, 1400) }
    ];
    var m = modelos[Phaser.Math.Between(0, modelos.length - 1)];
    if (m.tipo === 'colheitas') m.alvo = parseInt(m.desc.match(/\d+/)[0], 10);
    G.contrato = { tipo: m.tipo, cultura: m.cultura, desc: m.desc, alvo: m.alvo, prog: 0, premio: m.premio, feito: false };
}

function progContrato(ev, extra) {
    if (!G.contrato || G.contrato.feito) return;
    var c = G.contrato;
    if (c.tipo === 'colheitas' && ev === 'colheita') c.prog++;
    if (c.tipo === 'cultura' && ev === 'colheita' && extra === c.cultura) c.prog++;
    if (c.tipo === 'expandir' && ev === 'expandir') c.prog++;
    if (c.prog >= c.alvo) {
        c.feito = true;
        G.moedas += c.premio;
        G._contratosFeitos = (G._contratosFeitos || 0) + 1;
        if (window.AudioJogo) AudioJogo.sfx('harvest');
        toast('📋 Contrato cumprido! (+' + c.premio + '€)', 'ok', 4000);
        verificarConquistas();
    }
}

function initMissoes() {
    G.missoes = [
        { id: 'colheitas', desc: 'Colher 8 plantas', alvo: 8, prog: 0, premio: 150, feita: false },
        { id: 'expandir',  desc: 'Expandir 3 parcelas', alvo: 3, prog: 0, premio: 200, feita: false },
        { id: 'riqueza',   desc: 'Acumular 2000€', alvo: 2000, prog: 0, premio: 120, feita: false },
        { id: 'gastar',    desc: 'Gastar 8000€ na loja', alvo: 8000, prog: 0, premio: 500, feita: false }
    ];
}

function progMissao(id, n) {
    if (!G.missoes) return;
    G.missoes.forEach(function(m) {
        if (m.feita || m.id !== id) return;
        if (id === 'riqueza') m.prog = G.moedas;
        else if (id === 'gastar') m.prog = Math.min(m.alvo, G.totalGasto || 0);
        else m.prog = Math.min(m.alvo, m.prog + (n || 1));
        if (m.prog >= m.alvo) {
            m.feita = true;
            G.moedas += m.premio;
            if (window.AudioJogo) AudioJogo.sfx('harvest');
            toast('🎯 Missão: ' + m.desc + ' (+' + m.premio + '€)', 'ok', 4000);
        }
    });
    guardarJogo();
}

function novoEventoDia() {
    var lista = [
        { msg: '☀️ Sol forte — ciclos 25% mais rápidos', cicloMult: 0.75, ganhoMult: 1, rega: 0 },
        { msg: '🌧️ Chuva — +3 regas extra', cicloMult: 1, ganhoMult: 1, rega: 3 },
        { msg: '🎪 Feira — colheitas +50%', cicloMult: 1, ganhoMult: 1.5, rega: 0 },
        { msg: '🌙 Dia calmo', cicloMult: 1, ganhoMult: 1, rega: 0 }
    ];
    G.eventoDia = lista[Phaser.Math.Between(0, lista.length - 1)];
}

function aplicarBonusColheita() {
    var b = 1;
    if (G.ouroNv >= 1) b *= 1.30;
    if (G.ouroNv >= 2) b *= 1.25;
    if (G.exportador) b *= 1.2;
    G.bonusColheita = b;
    G.upgradeOuro = G.ouroNv >= 1;
}

function ganhoColheita(tx, ty) {
    var tipo = G.tipo[tx][ty] || 'girassol';
    var base = CULTURAS[tipo].ganho;
    if (G.eliteSem && G.eliteSem[tipo]) base = Math.round(base * 1.3);
    var ev = (G.eventoDia && G.eventoDia.ganhoMult) || 1;
    return Math.round(base * G.bonusColheita * ev * bonusNivelQuinta());
}

function nivelLoja(id) {
    if (id === 'trator2') return G.nivelTrator >= 2 ? 1 : 0;
    if (id === 'trator3') return G.nivelTrator >= 3 ? 1 : 0;
    if (id === 'arado') return G.arado ? 1 : 0;
    if (id === 'terreno') return G.ampliacoesTerreno || 0;
    if (id === 'ouro') return G.ouroNv >= 1 ? 1 : 0;
    if (id === 'ouro2') return G.ouroNv >= 2 ? 1 : 0;
    if (id === 'aspersor') return G.aspersores;
    if (id === 'silo') return G.silos;
    if (id === 'empregado') return G.empregados;
    if (id === 'celeiro') return G.celeiroNv;
    if (id === 'estufa') return G.estufa ? 1 : 0;
    if (id === 'galinheiro') return G.galinheiro;
    if (id === 'irradiador') return G.irradiadores;
    if (id === 'exportador') return G.exportador ? 1 : 0;
    if (id === 'elite') return G.eliteSem && G.eliteSem[G.sementeAtiva] ? 1 : 0;
    if (id === 'pomar') return G.pomar ? 1 : 0;
    if (id === 'animais') return G.animais ? 1 : 0;
    if (id.indexOf('semente_') === 0) {
        var mapa = {
            semente_cenoura: 'cenoura',
            semente_batata: 'batata',
            semente_tomate: 'tomate',
            semente_pimento: 'pimento',
            semente_abobora: 'abóbora',
            semente_melancia: 'melancia',
            semente_cogumelo: 'cogumelo',
            semente_ameixa: 'ameixa',
            semente_pessego: 'pessego'
        };
        return mapa[id] && sementeDesbloqueada(mapa[id]) ? 1 : 0;
    }
    return 0;
}

function getCatalogoLoja() {
    return LOJA_CATALOGO.filter(function(it) {
        if (it.requer && !it.requer()) return false;
        if (it.max !== undefined && nivelLoja(it.id) >= it.max) return it.mostrarMax !== false;
        return true;
    });
}

function custoLojaItem(it) {
    var nv = nivelLoja(it.id);
    if (nv >= it.max) return null;
    return Math.floor(it.custoBase * Math.pow(it.mult || 1, nv));
}

function comprarLojaItem(id) {
    var it = null;
    LOJA_CATALOGO.forEach(function(x) { if (x.id === id) it = x; });
    if (!it) return false;
    if (nivelLoja(id) >= it.max) { toast('✅ ' + (window.IdiomasJogo ? IdiomasJogo.msg('jaMaximo', 'Já no máximo!') : 'Já no máximo!'), 'war'); return false; }
    if (it.requer && !it.requer()) { toast('🔒 ' + (window.IdiomasJogo ? IdiomasJogo.msg('requisitoFalta', 'Requisito em falta') : 'Requisito em falta'), 'err'); return false; }
    var custo = custoLojaItem(it);
    if (G.moedas < custo) {
        toast('❌ ' + (window.IdiomasJogo ? IdiomasJogo.msg('precisasValor', 'Precisas de {valor}€', { valor: custo }) : 'Precisas de ' + custo + '€') + ' (' + G.moedas + '€)', 'err');
        return false;
    }
    G.moedas -= custo;
    G.totalGasto = (G.totalGasto || 0) + custo;
    it.aplicar();
    aplicarBonusColheita();
    progMissao('gastar', custo);
    progMissao('riqueza', 0);
    verificarConquistas();
    guardarJogo();
    if (window.AudioJogo) AudioJogo.sfx('buy');
    var nomeItem = window.IdiomasJogo ? IdiomasJogo.itemLoja(it.id, 'nome', it.nome) : it.nome;
    var msgCompra = window.IdiomasJogo ? IdiomasJogo.msg('itemComprado', '{nome} comprado! (-{valor}€)', { nome: nomeItem, valor: custo }) : nomeItem + ' comprado! (-' + custo + '€)';
    toast(it.emoji + ' ' + msgCompra, 'ok', 3000);
    return true;
}

function custoRacaoGalinhas() {
    return (G.galinheiro || 0) * 90;
}

function rendimentoDiario() {
    return (G.silos || 0) * 200 + (G.celeiroNv || 0) * 500 + (G.galinheiro || 0) * 180;
}

function autoRegaAspersores(scene) {
    if (!G.aspersores) return;
    normalizarAspersores();
    var aplicadas = 0;
    for (var a = 0; a < G.aspersores; a++) {
        if (G.aspersorEmMovimento === a) continue;
        var asp = G.aspersorPos[a];
        if (!asp) continue;
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                var x = asp.x + dx, y = asp.y + dy;
                if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
                if (!G.desbloq[x][y] || G.plantas[x][y] === 0 || G.plantas[x][y] >= 5 || G.rega[x][y]) continue;
                G.rega[x][y] = true;
                scene.drawTile(x, y);
                aplicadas++;
            }
        }
    }
    if (aplicadas > 0) {
        scene.updateUI();
        guardarJogo();
    }
}

function autoColheitaEmpregados(scene) {
    if (!G.empregados) return 0;
    var colhidas = 0;
    for (var e = 0; e < G.empregados && colhidas < G.empregados; e++) {
        for (var x = 0; x < COLS; x++) {
            var found = false;
            for (var y = 0; y < ROWS; y++) {
                if (G.desbloq[x][y] && G.plantas[x][y] >= 5 && !(x === 0 && y === 0)) {
                    var ganho = ganhoColheita(x, y);
                    var tipo = G.tipo[x][y];
                    if (scene.animarEmpregado) scene.animarEmpregado(e, x, y);
                    G.plantas[x][y] = 0;
                    G.tipo[x][y] = '';
                    G.moedas += ganho;
                    G.colheitas++;
                    ganharXP(Math.floor(ganho / 8));
                    progContrato('colheita', tipo);
                    scene.drawTile(x, y);
                    colhidas++;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }
    if (colhidas > 0) {
        scene.updateUI();
        guardarJogo();
    }
    return colhidas;
}

function guardarJogo() {
    try {
        localStorage.setItem('quintaSave', JSON.stringify({
            moedas: G.moedas, nivelTrator: G.nivelTrator, velTrator: G.velTrator,
            plantas: G.plantas, desbloq: G.desbloq, rega: G.rega, tipo: G.tipo,
            colheitas: G.colheitas, expansoes: G.expansoes, dia: G.dia,
            regaRestante: G.regaRestante, sementeAtiva: G.sementeAtiva,
            bonusColheita: G.bonusColheita, upgradeOuro: G.upgradeOuro, ouroNv: G.ouroNv,
            aduboRestante: G.aduboRestante, combo: G.combo, maxCombo: G.maxCombo,
            eventoDia: G.eventoDia, missoes: G.missoes,
            aspersores: G.aspersores, aspersorPos: G.aspersorPos, silos: G.silos, empregados: G.empregados,
            celeiroNv: G.celeiroNv, estufa: G.estufa, eliteSem: G.eliteSem,
            totalGasto: G.totalGasto, nivelQuinta: G.nivelQuinta, xpQuinta: G.xpQuinta,
            galinheiro: G.galinheiro, irradiadores: G.irradiadores, exportador: G.exportador,
            contrato: G.contrato, conquistas: G.conquistas, _contratosFeitos: G._contratosFeitos,
            arado: G.arado, aradoAcoplado: G.aradoAcoplado, ampliacoesTerreno: G.ampliacoesTerreno,
            pomar: G.pomar, pomarPlantas: G.pomarPlantas, pomarTipo: G.pomarTipo, pomarRega: G.pomarRega,
            animais: G.animais, animaisData: G.animaisData, sementesCompradas: G.sementesCompradas
            , sementeCampoAtiva: G.sementeCampoAtiva, sementePomarAtiva: G.sementePomarAtiva
        }));
    } catch (e) {}
}

function carregarJogo() {
    try {
        var raw = localStorage.getItem('quintaSave');
        if (!raw) return false;
        var s = JSON.parse(raw);
        Object.keys(s).forEach(function(k) { if (s[k] !== undefined) G[k] = s[k]; });
        return true;
    } catch (e) { return false; }
}

function prepararEstadoJogo() {
    if (!G.eliteSem) G.eliteSem = {};
    if (G.upgradeOuro && !G.ouroNv) G.ouroNv = 1;
    aplicarBonusColheita();
    if (!G.totalGasto) G.totalGasto = 0;
    G.aspersores = G.aspersores || 0;
    G.aspersorEmMovimento = null;
    normalizarAspersores();
    G.silos = G.silos || 0;
    G.empregados = G.empregados || 0;
    G.celeiroNv = G.celeiroNv || 0;
    G.ouroNv = G.ouroNv || 0;
    G.galinheiro = G.galinheiro || 0;
    G.irradiadores = G.irradiadores || 0;
    G.exportador = !!G.exportador;
    G.arado = !!G.arado;
    G.aradoAcoplado = !!(G.arado && G.aradoAcoplado);
    G.ampliacoesTerreno = G.ampliacoesTerreno || 0;
    G.pomar = !!G.pomar;
    if (!G.pomarPlantas) G.pomarPlantas = null;
    if (!G.pomarTipo) G.pomarTipo = null;
    if (!G.pomarRega) G.pomarRega = null;
    G.animais = !!G.animais;
    if (!G.animaisData) G.animaisData = null;
    normalizarSementesCompradas();
    if (!G.sementeCampoAtiva) G.sementeCampoAtiva = 'girassol';
    if (!G.sementePomarAtiva) G.sementePomarAtiva = 'cereja';
    if (!sementeDesbloqueada(G.sementeAtiva)) G.sementeAtiva = 'girassol';
    if (!sementeDesbloqueada(G.sementeCampoAtiva)) G.sementeCampoAtiva = 'girassol';
    if (!sementeDesbloqueada(G.sementePomarAtiva)) G.sementePomarAtiva = 'cereja';
    G.velTrator = velocidadeTratorNivel(G.nivelTrator || 1);
    G.nivelQuinta = G.nivelQuinta || 1;
    G.xpQuinta = G.xpQuinta || 0;
    if (!G.conquistas) initConquistas();
    if (!G.contrato) novoContrato();
}

function resetarGravacao() {
    localStorage.removeItem('quintaSave');
    toast('🗑️ Gravação apagada — recarrega a página', 'war', 4000);
}
