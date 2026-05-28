class CenaQuinta extends Phaser.Scene {
    constructor() {
        super({ key: 'CenaQuinta' });
    }

    create(data) {
        self = this;
        MaquinaEstados.mudar(Estado.CAMPO);
        if (this.game.canvas) {
            this.game.canvas.setAttribute('tabindex', '1');
            this.game.canvas.focus();
        }
        this.keys = this.input.keyboard.createCursorKeys();
        this.kSpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.kE     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.kR     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.kN     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.kQ     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.kU     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
        this.kW     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.kA     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.kS     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.kD     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.kArado = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.kM     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        if (!carregarJogo()) {
            G.eventoDia = { msg: '🌅 Bem-vindo à quinta', cicloMult: 1, ganhoMult: 1, rega: 0 };
            initMissoes();
            initConquistas();
            novoContrato();
        }
        if (!G.missoes) initMissoes();
        if (!G.eventoDia) novoEventoDia();
        if (G.plantas && !G.tipo) {
            G.tipo = [];
            for (var xi = 0; xi < COLS; xi++) {
                G.tipo[xi] = [];
                for (var yi = 0; yi < ROWS; yi++) {
                    G.tipo[xi][yi] = G.plantas[xi][yi] > 0 ? 'girassol' : '';
                }
            }
        }
        prepararEstadoJogo();

        this.terreno  = [];
        this.gTiles   = [];
        this.gDetail  = [];
        this.tLogico  = (data && data.fromShop) ? { x: 2, y: 0 } : { x: 3, y: 3 };
        this.tDirecao = { x: 0, y: 1 };
        this._cooldownLojaAte = (data && data.fromShop) ? this.time.now + 2500 : 0;

        if (!G.plantas) {
            G.plantas = []; G.desbloq = []; G.rega = []; G.tipo = [];
            for (var x = 0; x < COLS; x++) {
                G.plantas[x] = []; G.desbloq[x] = []; G.rega[x] = []; G.tipo[x] = [];
                for (var y = 0; y < ROWS; y++) {
                    G.desbloq[x][y]  = (x < 5 && y < 5);
                    G.plantas[x][y]  = (G.desbloq[x][y] && Phaser.Math.Between(0,3)===1) ? 1 : 0;
                    G.rega[x][y]     = false;
                    G.tipo[x][y]     = G.plantas[x][y] > 0 ? 'girassol' : '';
                }
            }
        }
        normalizarAspersores();

        this.add.rectangle(500, 375, 1000, 750, 0x060d1a);

        for (var x = 0; x < COLS; x++) {
            this.terreno[x] = []; this.gTiles[x] = []; this.gDetail[x] = [];
            for (var y = 0; y < ROWS; y++) {
                var h = Math.sin(x*0.55) * Math.cos(y*0.55) * 22;
                this.terreno[x][y] = h;
                var p = this.iso(x, y);

                var t = this.add.graphics();
                t.setPosition(p.x, p.y - h);
                t.depth = (x + y) * 10;
                this.gTiles[x][y] = t;

                var d = this.add.graphics();
                d.setPosition(p.x, p.y - h);
                d.depth = (x + y) * 10 + 1;
                this.gDetail[x][y] = d;

                this.drawTile(x, y);
            }
        }

        var pl = this.iso(0, 0);
        var lbl = this.add.text(pl.x, pl.y - this.terreno[0][0] - 38, '▲ STAND', {
            fontFamily: "'Exo 2',sans-serif", fontSize: '11px', fontStyle: 'bold',
            color: '#22d3ee', backgroundColor: '#060d1acc', padding: { x:5, y:3 }
        }).setOrigin(0.5).setDepth(9999);
        this.tweens.add({ targets: lbl, alpha: 0.3, duration: 900, yoyo: true, repeat: -1 });

        this.trCont  = this.add.container(0, 0).setDepth(9995);
        this.trShadow = this.add.graphics();
        this.trGfx    = this.add.graphics();
        this.trCont.add([this.trShadow, this.trGfx]);
        this.drawTrator();

        var z0 = this.terreno[this.tLogico.x][this.tLogico.y];
        var p0 = this.iso(this.tLogico.x, this.tLogico.y);
        this.alvoX = p0.x; this.alvoY = p0.y - z0;
        this.trCont.setPosition(this.alvoX, this.alvoY);
        this.aradoCont = this.add.container(0, 0).setDepth(9993);
        this.aradoGfx = this.add.graphics();
        this.aradoCont.add(this.aradoGfx);
        this.desenharArado();
        this.updateArado(true);
        this.criarEmpregados();

        this.cursor = this.add.graphics().setDepth(9994);
        this._ct = 0;

        var ui = this.add.graphics().setDepth(99990);
        ui.fillStyle(0x060d1a, 0.9); ui.lineStyle(1, 0x22d3ee, 0.3);
        ui.fillRoundedRect(10, 10, 285, 138, 10);
        ui.strokeRoundedRect(10, 10, 285, 138, 10);

        this.txtUI = this.add.text(20, 20, '', {
            fontFamily: "'Exo 2',sans-serif", fontSize: '13px', fontStyle: 'bold',
            color: '#e2e8f0', lineSpacing: 6
        }).setDepth(99991);

        var ct = this.add.graphics().setDepth(99990);
        ct.fillStyle(0x060d1a, 0.8); ct.lineStyle(1, 0x1e293b, 0.6);
        ct.fillRoundedRect(10, 130, 285, 175, 10);
        ct.strokeRoundedRect(10, 130, 285, 175, 10);
        this.add.text(20, 140, [
            '   ⌨  CONTROLOS',
            '─────────────────────────',
            '  [WASD]  Mover trator',
            '  [ESPAÇO]  Semear / Colher / arar',
            '  [Q] Semente  [C] Arado  [M] Mover aspersor',
            '  [U] Adubo  [E] Expandir  [N] Dia seguinte',
        ].join('\n'), {
            fontFamily: "'Exo 2',sans-serif", fontSize: '11px',
            color: '#475569', lineSpacing: 5
        }).setDepth(99991);

        var mp = this.add.graphics().setDepth(99990);
        mp.fillStyle(0x060d1a, 0.88); mp.lineStyle(1, 0xfacc15, 0.35);
        mp.fillRoundedRect(700, 10, 290, 200, 10);
        mp.strokeRoundedRect(700, 10, 290, 200, 10);
        this.txtMissoes = this.add.text(715, 22, '', {
            fontFamily: "'Exo 2',sans-serif", fontSize: '11px',
            color: '#94a3b8', lineSpacing: 5
        }).setDepth(99991);
        this.txtContrato = this.add.text(715, 118, '', {
            fontFamily: "'Exo 2',sans-serif", fontSize: '11px',
            color: '#a5b4fc', lineSpacing: 5
        }).setDepth(99991);

        this._cicloInicio  = this.time.now;
        this._proximoCiclo = this.time.now + CICLO_MS;
        this._proximoMov   = 0;

        this.updateUI();
        if (data && data.fromShop) {
            toast('🚜 Campo — podes conduzir outra vez!', 'ok', 2500);
        } else {
            toast('🌻 Bem-vindo à Quinta! Boa colheita!', 'ok', 3000);
        }
    }

    iso(gx, gy) {
        var ox = 500, oy = 200;
        return {
            x: ox + (gx - gy) * TAM,
            y: oy + (gx + gy) * (TAM * 0.5)
        };
    }

    drawTrator() {
        this.trShadow.clear();
        this.trShadow.fillStyle(0x000000, 0.22);
        this.trShadow.fillEllipse(0, 16, 36, 12);

        this.trGfx.clear();
        var cor = G.nivelTrator === 1 ? 0xef4444 : (G.nivelTrator === 3 ? 0x8b5cf6 : 0xeab308);

        this.trGfx.fillStyle(0x111827, 1);
        this.trGfx.fillCircle(-13, 5, 9);
        this.trGfx.fillCircle(13, 5, 9);
        this.trGfx.fillStyle(0x374151, 1);
        this.trGfx.fillCircle(-13, 5, 5);
        this.trGfx.fillCircle(13, 5, 5);
        this.trGfx.fillStyle(cor, 1);
        this.trGfx.fillRoundedRect(-14, -27, 28, 30, 5);
        this.trGfx.fillStyle(0x22d3ee, 0.9);
        this.trGfx.fillRoundedRect(-8, -22, 16, 11, 3);
        this.trGfx.fillStyle(0xffffff, 0.3);
        this.trGfx.fillRect(-7, -21, 5, 4);
        this.trGfx.fillStyle(0x1f2937, 1);
        this.trGfx.fillRect(8, -33, 4, 9);
        if (G.nivelTrator >= 2) {
            this.trGfx.fillStyle(0xf97316, 1);
            this.trGfx.fillCircle(10, -34, 3);
        }
        if (G.nivelTrator >= 3) {
            this.trGfx.fillStyle(0x8b5cf6, 1);
            this.trGfx.fillRect(-16, -30, 4, 8);
            this.trGfx.fillRect(12, -30, 4, 8);
        }
    }

    desenharArado() {
        var g = this.aradoGfx;
        if (!g) return;
        g.clear();
        g.fillStyle(0x000000, 0.2);
        g.fillEllipse(0, 14, 52, 18);
        g.fillStyle(0x475569, 1);
        g.beginPath();
        g.moveTo(0, -TAM * 0.42); g.lineTo(TAM * 0.78, -2); g.lineTo(0, TAM * 0.42); g.lineTo(-TAM * 0.78, -2);
        g.closePath(); g.fillPath();
        g.fillStyle(0x334155, 1);
        g.beginPath();
        g.moveTo(0, TAM * 0.42); g.lineTo(-TAM * 0.78, -2); g.lineTo(-TAM * 0.78, 10); g.lineTo(0, TAM * 0.42 + 12);
        g.closePath(); g.fillPath();
        g.fillStyle(0x1f2937, 1);
        g.beginPath();
        g.moveTo(0, TAM * 0.42); g.lineTo(TAM * 0.78, -2); g.lineTo(TAM * 0.78, 10); g.lineTo(0, TAM * 0.42 + 12);
        g.closePath(); g.fillPath();
        g.lineStyle(2, 0xe2e8f0, 0.8);
        g.beginPath(); g.moveTo(-22, -1); g.lineTo(22, -1); g.strokePath();
        g.fillStyle(0x94a3b8, 1);
        g.fillRect(-18, -13, 36, 8);
        g.fillStyle(0xe2e8f0, 0.9);
        g.fillTriangle(-24, 1, -10, 14, -4, 1);
        g.fillTriangle(4, 1, 10, 14, 24, 1);
    }

    posArado() {
        var dir = this.tDirecao || { x: 0, y: 1 };
        return { x: this.tLogico.x - dir.x, y: this.tLogico.y - dir.y };
    }

    updateArado(imediato) {
        if (!this.aradoCont) return;
        var ativo = !!(G.arado && G.aradoAcoplado);
        var pLog = this.posArado();
        var valido = ativo && pLog.x >= 0 && pLog.x < COLS && pLog.y >= 0 && pLog.y < ROWS;
        this.aradoCont.setVisible(valido);
        if (!valido) return;
        var p = this.iso(pLog.x, pLog.y);
        var y = p.y - this.terreno[pLog.x][pLog.y];
        this.aradoCont.depth = (pLog.x + pLog.y) * 10 + 8;
        if (imediato) this.aradoCont.setPosition(p.x, y);
        else {
            this.aradoCont.x = Phaser.Math.Linear(this.aradoCont.x, p.x, 0.18);
            this.aradoCont.y = Phaser.Math.Linear(this.aradoCont.y, y, 0.18);
        }
    }

    drawTile(x, y) {
        var t  = this.gTiles[x][y];
        var d  = this.gDetail[x][y];
        if (!t || !d) return;
        t.clear(); d.clear();

        var isShop  = (x === 0 && y === 0);
        var unlock  = G.desbloq[x][y];
        var estado  = G.plantas[x][y];
        var regado  = G.rega[x][y];

        var cTop, cL, cR, al = 1;

        if (isShop) {
            cTop = 0x164e63; cL = 0x0e3a4a; cR = 0x0a2c38;
        } else if (!unlock) {
            cTop = 0x1a2535; cL = 0x111c28; cR = 0x0d1620; al = 0.8;
        } else {
            var paleta = [
                [COR.herva,     0x15803d, 0x0f6028],
                [COR.semente,   0x3a1501, 0x2d1001],
                [COR.broto,     0x4d7c0f, 0x3a5e09],
                [COR.crescendo, 0x65a30d, 0x4f7c0a],
                [COR.maduro,    0x84cc16, 0x65a30d],
                [COR.colhivel,  0xca8a04, 0x9a6703],
            ];
            var c = paleta[Math.min(estado, 5)];
            cTop = c[0]; cL = c[1]; cR = c[2];
        }

        t.fillStyle(cTop, al);
        t.beginPath();
        t.moveTo(0, -TAM*0.5); t.lineTo(TAM, 0); t.lineTo(0, TAM*0.5); t.lineTo(-TAM, 0);
        t.closePath(); t.fillPath();

        t.fillStyle(cL, al);
        t.beginPath();
        t.moveTo(0, TAM*0.5); t.lineTo(-TAM, 0); t.lineTo(-TAM, 14); t.lineTo(0, TAM*0.5+14);
        t.closePath(); t.fillPath();

        t.fillStyle(cR, al);
        t.beginPath();
        t.moveTo(0, TAM*0.5); t.lineTo(TAM, 0); t.lineTo(TAM, 14); t.lineTo(0, TAM*0.5+14);
        t.closePath(); t.fillPath();

        t.lineStyle(1, 0x000000, 0.15);
        t.beginPath();
        t.moveTo(0, -TAM*0.5); t.lineTo(TAM, 0); t.lineTo(0, TAM*0.5); t.lineTo(-TAM, 0);
        t.closePath(); t.strokePath();

        if (unlock && !isShop) {
            if (tileEmAreaAspersor(x, y)) {
                d.lineStyle(1, 0x38bdf8, 0.25);
                d.beginPath();
                d.moveTo(0, -TAM*0.35); d.lineTo(TAM*0.68, 0); d.lineTo(0, TAM*0.35); d.lineTo(-TAM*0.68, 0);
                d.closePath(); d.strokePath();
            }
            if (estado === 1) {
                d.fillStyle(0x78350f, 1);
                d.fillCircle(-5, -2, 3); d.fillCircle(4, 1, 3); d.fillCircle(0, -6, 2);
            } else if (estado === 2) {
                d.fillStyle(0x4ade80, 1); d.fillRect(-1, -14, 2, 12); d.fillEllipse(-3, -14, 10, 7);
            } else if (estado === 3) {
                d.fillStyle(0x4ade80, 1); d.fillRect(-1, -20, 2, 18); d.fillEllipse(-5, -18, 13, 9); d.fillEllipse(4, -21, 11, 8);
            } else if (estado === 4) {
                d.fillStyle(0x86efac, 1); d.fillRect(-1, -25, 2, 21); d.fillEllipse(-7, -21, 16, 11); d.fillEllipse(5, -24, 14, 10); d.fillEllipse(-1, -27, 13, 9);
            } else if (estado >= 5) {
                var cul = CULTURAS[G.tipo[x][y] || 'girassol'];
                var fc = cul.fruto || 0xf97316;
                d.fillStyle(0x86efac, 1); d.fillRect(-1, -25, 2, 21); d.fillEllipse(-7, -21, 16, 11); d.fillEllipse(5, -24, 14, 10);
                d.fillStyle(fc, 1); d.fillCircle(-5, -27, 6); d.fillCircle(6, -23, 5);
                d.fillStyle(0xffffff, 0.35); d.fillCircle(-7, -29, 3);
            }
            if (regado && estado < 5) {
                d.fillStyle(0x38bdf8, 0.85); d.fillEllipse(15, -16, 7, 9); d.fillTriangle(11,-13, 19,-13, 15,-21);
            }
            if (temAspersorNoTile(x, y)) {
                d.fillStyle(0x0f172a, 0.45);
                d.fillEllipse(-18, 8, 18, 7);
                d.fillStyle(0x64748b, 1);
                d.fillRect(-20, -12, 4, 20);
                d.fillStyle(0x38bdf8, 1);
                d.fillCircle(-18, -14, 5);
                d.lineStyle(2, 0x7dd3fc, 0.8);
                d.beginPath(); d.moveTo(-18, -14); d.lineTo(-31, -22); d.strokePath();
                d.beginPath(); d.moveTo(-18, -14); d.lineTo(-5, -22); d.strokePath();
                d.fillStyle(0xbae6fd, 0.9);
                d.fillCircle(-33, -23, 2); d.fillCircle(-3, -23, 2);
            }
        } else if (!unlock) {
            d.fillStyle(0x1e293b, 0.7); d.fillRoundedRect(-7, -13, 14, 12, 3);
            d.lineStyle(2, 0x334155, 0.9);
            d.beginPath(); d.arc(-3.5, -15, 7, Math.PI, 0, false); d.strokePath();
        } else if (isShop) {
            d.fillStyle(0x22d3ee, 0.9); d.fillRect(-9, -17, 18, 12);
            d.fillStyle(0xfacc15, 1); d.fillRect(-5, -21, 10, 5);
            d.fillStyle(0x060d1a, 0.8); d.fillRect(-2, -13, 5, 7);
        }
    }

    drawCursor(x, y) {
        this.cursor.clear();
        var p  = this.iso(x, y);
        var h  = this.terreno[x][y];
        var bob = Math.sin(this._ct * 4) * 3;
        var a   = 0.7 + Math.sin(this._ct * 4) * 0.25;
        var cy  = p.y - h - bob;

        this.cursor.lineStyle(2, 0x22d3ee, a);
        this.cursor.beginPath();
        this.cursor.moveTo(p.x,       cy - TAM*0.5);
        this.cursor.lineTo(p.x + TAM, cy);
        this.cursor.lineTo(p.x,       cy + TAM*0.5);
        this.cursor.lineTo(p.x - TAM, cy);
        this.cursor.closePath(); this.cursor.strokePath();

        this.cursor.fillStyle(0x22d3ee, a);
        [[p.x, cy-TAM*0.5],[p.x+TAM,cy],[p.x,cy+TAM*0.5],[p.x-TAM,cy]].forEach(function(c) {
            this.cursor.fillCircle(c[0], c[1], 3);
        }, this);
    }

    criarEmpregados() {
        this.empregadosVisuais = [];
        for (var i = 0; i < (G.empregados || 0); i++) {
            var home = posicaoInfra(POS_EMPREGADOS, i) || { x: 1, y: 1 };
            var p = this.iso(home.x, home.y);
            var h = this.terreno[home.x][home.y];
            var cont = this.add.container(p.x, p.y - h).setDepth((home.x + home.y) * 10 + 8);
            var g = this.add.graphics();
            cont.add(g);
            this.desenharEmpregado(g, i);
            this.empregadosVisuais.push({
                cont: cont, gfx: g, x: home.x, y: home.y,
                alvoX: p.x, alvoY: p.y - h, casa: home, ocupadoAte: 0
            });
        }
    }

    desenharEmpregado(g, idx) {
        var camisa = [0x16a34a, 0x0ea5e9, 0xf97316, 0xa855f7][idx % 4];
        g.clear();
        g.fillStyle(0x000000, 0.22); g.fillEllipse(0, 15, 22, 8);
        g.fillStyle(0xfacc15, 1); g.fillCircle(0, -16, 6);
        g.fillStyle(camisa, 1); g.fillRoundedRect(-7, -10, 14, 19, 4);
        g.fillStyle(0x0f172a, 1); g.fillRect(-6, 7, 5, 10); g.fillRect(1, 7, 5, 10);
        g.lineStyle(2, 0x78350f, 1);
        g.beginPath(); g.moveTo(7, -3); g.lineTo(17, -12); g.strokePath();
        g.fillStyle(0x94a3b8, 1); g.fillRect(15, -17, 3, 9);
    }

    moverEmpregadoPara(idx, x, y, ocupadoMs) {
        if (!this.empregadosVisuais || !this.empregadosVisuais[idx]) return;
        var w = this.empregadosVisuais[idx];
        var p = this.iso(x, y);
        var h = this.terreno[x][y];
        w.x = x; w.y = y; w.alvoX = p.x; w.alvoY = p.y - h;
        w.ocupadoAte = this.time.now + (ocupadoMs || 900);
    }

    animarEmpregado(idx, x, y) {
        this.moverEmpregadoPara(idx, x, y, 1300);
        var w = this.empregadosVisuais && this.empregadosVisuais[idx];
        if (!w) return;
        this.time.delayedCall(1300, function() {
            this.moverEmpregadoPara(idx, w.casa.x, w.casa.y, 400);
        }, [], this);
    }

    passeioEmpregados() {
        if (!this.empregadosVisuais) return;
        for (var i = 0; i < this.empregadosVisuais.length; i++) {
            var w = this.empregadosVisuais[i];
            if (this.time.now < w.ocupadoAte) continue;
            var opcoes = [
                { x: w.x + 1, y: w.y }, { x: w.x - 1, y: w.y },
                { x: w.x, y: w.y + 1 }, { x: w.x, y: w.y - 1 },
                w.casa
            ].filter(function(p) {
                return p.x >= 0 && p.x < COLS && p.y >= 0 && p.y < ROWS &&
                    G.desbloq[p.x][p.y] && !(p.x === 0 && p.y === 0);
            });
            if (opcoes.length > 0) {
                var alvo = opcoes[Phaser.Math.Between(0, opcoes.length - 1)];
                this.moverEmpregadoPara(i, alvo.x, alvo.y, 800);
            }
        }
    }

    updateEmpregados() {
        if (!this.empregadosVisuais) return;
        for (var i = 0; i < this.empregadosVisuais.length; i++) {
            var w = this.empregadosVisuais[i];
            w.cont.x = Phaser.Math.Linear(w.cont.x, w.alvoX, 0.08);
            w.cont.y = Phaser.Math.Linear(w.cont.y, w.alvoY, 0.08);
            w.cont.depth = (w.x + w.y) * 10 + 8;
            w.cont.setScale(w.cont.x > w.alvoX + 1 ? -1 : 1, 1);
        }
    }

    parcelasArado() {
        var dir = this.tDirecao || { x: 0, y: 1 };
        var tras = { x: -dir.x, y: -dir.y };
        var perp = { x: -dir.y, y: dir.x };
        var arado = this.posArado();
        var pontos = [
            { x: arado.x + perp.x, y: arado.y + perp.y },
            { x: arado.x - perp.x, y: arado.y - perp.y },
            { x: arado.x + tras.x + perp.x, y: arado.y + tras.y + perp.y },
            { x: arado.x + tras.x, y: arado.y + tras.y },
            { x: arado.x + tras.x - perp.x, y: arado.y + tras.y - perp.y }
        ];
        var out = [];
        for (var i = 0; i < pontos.length; i++) {
            var p = pontos[i];
            if (p.x >= 0 && p.x < COLS && p.y >= 0 && p.y < ROWS && !(p.x === 0 && p.y === 0)) {
                out.push(p);
            }
        }
        return out;
    }

    plantarComArado(silencioso) {
        if (!G.arado || !G.aradoAcoplado) return false;
        var culKey = G.sementeAtiva;
        var c = CULTURAS[culKey];
        if (c.requerEstufa && !G.estufa) {
            if (!silencioso) toast('🏠 Precisas da Estufa na loja!', 'err');
            return true;
        }
        var alvos = this.parcelasArado().filter(function(p) {
            return G.desbloq[p.x][p.y];
        });
        if (alvos.length === 0) {
            if (!silencioso) toast('⛏️ O arado precisa de terreno desbloqueado à volta', 'war');
            return true;
        }
        var cp = custoPlantio(culKey);
        var plantadas = 0, colhidas = 0, ganhoTotal = 0, alterou = false;
        for (var i = 0; i < alvos.length; i++) {
            var p = alvos[i];
            var mudouTile = false;
            if (G.plantas[p.x][p.y] >= 5) {
                var ganho = ganhoColheita(p.x, p.y);
                var tipoColhido = G.tipo[p.x][p.y];
                G.plantas[p.x][p.y] = 0;
                G.tipo[p.x][p.y] = '';
                G.moedas += ganho;
                G.colheitas++;
                ganhoTotal += ganho;
                colhidas++;
                alterou = true;
                mudouTile = true;
                ganharXP(Math.floor(ganho / 8));
                progContrato('colheita', tipoColhido);
                progMissao('colheitas', 1);
            }
            if (G.plantas[p.x][p.y] === 0 && G.moedas >= cp) {
                G.moedas -= cp;
                G.plantas[p.x][p.y] = 1;
                G.tipo[p.x][p.y] = culKey;
                plantadas++;
                alterou = true;
                mudouTile = true;
            }
            if (mudouTile) this.drawTile(p.x, p.y);
        }
        if (!alterou) {
            if (!silencioso && G.moedas < cp) toast('❌ Sementes custam ' + cp + '€ cada', 'err');
            return true;
        }
        progMissao('riqueza', 0);
        verificarConquistas();
        this.updateUI();
        guardarJogo();
        if (!silencioso) {
            toast('⛏️ Arado: +' + ganhoTotal + '€ / ' + plantadas + ' semeadas', colhidas ? 'ok' : 'war');
        }
        return true;
    }

    redesenharCampo() {
        for (var x = 0; x < COLS; x++) {
            for (var y = 0; y < ROWS; y++) this.drawTile(x, y);
        }
    }

    moverAspersor() {
        var tx = this.tLogico.x, ty = this.tLogico.y;
        if (this.aspersorNaMao !== undefined && this.aspersorNaMao !== null) {
            if (!G.desbloq[tx][ty] || (tx === 0 && ty === 0)) {
                toast('💦 Coloca o aspersor numa parcela desbloqueada', 'war');
                return;
            }
            if (indiceAspersorNoTile(tx, ty) >= 0) {
                toast('💦 Já existe um aspersor aqui', 'war');
                return;
            }
            G.aspersorPos[this.aspersorNaMao] = { x: tx, y: ty };
            G.aspersorEmMovimento = null;
            this.aspersorNaMao = null;
            this.redesenharCampo();
            this.updateUI();
            guardarJogo();
            toast('💦 Aspersor colocado: rega 3×3 à volta', 'ok');
            return;
        }

        var idx = indiceAspersorNoTile(tx, ty);
        if (idx < 0) {
            toast('💦 Encosta o trator a um aspersor e carrega [M]', 'war');
            return;
        }
        this.aspersorNaMao = idx;
        G.aspersorEmMovimento = idx;
        this.redesenharCampo();
        this.updateUI();
        toast('💦 Aspersor na mão. Vai ao novo sítio e carrega [M]', 'ok');
    }

    updateUI() {
        var tx = this.tLogico.x, ty = this.tLogico.y;
        var unlock = G.desbloq[tx][ty];
        var est    = G.plantas[tx][ty];
        var reg    = G.rega[tx][ty];
        var cul    = CULTURAS[G.sementeAtiva];
        var nomes  = ['🌿 Vazio','🌱 Semente','🌿 Broto','🌾 A crescer','🌳 Maduro','✨ Colher!'];
        var label  = !unlock ? '🔒 ' + custoExpansao() + '€' : (tx===0&&ty===0 ? '🏪 Stand' : (nomes[Math.min(est,5)] + (reg?' 💧':'')));
        var ev     = G.eventoDia ? G.eventoDia.msg : '';
        var infra  = '💦' + G.aspersores + ' 👨‍🌾' + G.empregados + ' 🏗️' + G.silos;
        var xpN = xpParaNivel(G.nivelQuinta);
        this.txtUI.setText([
            '   💰 ' + G.moedas + '€   📅 Dia ' + G.dia + (G.combo > 1 ? '  🔥x' + G.combo : ''),
            '   ⭐ Quinta nv.' + G.nivelQuinta + '  XP ' + G.xpQuinta + '/' + xpN,
            '   🚜 Nv.' + G.nivelTrator + '  🌾' + G.colheitas + '  🧪' + G.aduboRestante,
            '   📍 [' + tx + ',' + ty + '] ' + label,
            '   ' + cul.emoji + ' plantar ' + custoPlantio(G.sementeAtiva) + '€ → ~' + cul.ganho + '€' +
                (G.arado ? '  ⛏️' + (G.aradoAcoplado ? 'ON' : 'OFF') : '') +
                (this.aspersorNaMao !== undefined && this.aspersorNaMao !== null ? '  💦MOVER' : ''),
        ].join('\n'));
        if (this.txtMissoes && G.missoes) {
            this.txtMissoes.setText(
                '   🎯 MISSÕES\n' +
                G.missoes.map(function(m) {
                    var p = m.id === 'riqueza' ? G.moedas : (m.id === 'gastar' ? (G.totalGasto || 0) : m.prog);
                    return (m.feita ? '   ✅ ' : '   ○ ') + m.desc + ' ' + Math.min(p, m.alvo) + '/' + m.alvo;
                }).join('\n')
            );
        }
        if (this.txtContrato && G.contrato) {
            var c = G.contrato;
            var conquistasOk = (G.conquistas || []).filter(function(x) { return x.ok; }).length;
            this.txtContrato.setText([
                '   📋 CONTRATO' + (c.feito ? ' ✅' : ''),
                '   ' + c.desc,
                '   ' + (c.feito ? 'Concluído!' : 'Progresso: ' + c.prog + '/' + c.alvo + ' → ' + c.premio + '€'),
                '   🏆 Conquistas: ' + conquistasOk + '/' + (G.conquistas ? G.conquistas.length : 0),
            ].join('\n'));
        }
    }

    update(t, dt) {
        if (!this.keys || !MaquinaEstados.podeConduzir()) return;
        this._ct += dt / 1000;

        this.trCont.x = Phaser.Math.Linear(this.trCont.x, this.alvoX, 0.18);
        this.trCont.y = Phaser.Math.Linear(this.trCont.y, this.alvoY, 0.18);
        this.trCont.depth = (this.tLogico.x + this.tLogico.y) * 10 + 9;
        this.updateArado(false);
        this.updateEmpregados();

        this.drawCursor(this.tLogico.x, this.tLogico.y);

        var fill = document.getElementById('growfill');
        if (fill) {
            var dec = t - this._cicloInicio;
            fill.style.width = Math.min((dec / CICLO_MS) * 100, 100) + '%';
        }

        if (MaquinaEstados.podeConduzir() &&
            this.tLogico.x === 0 && this.tLogico.y === 0 &&
            t > (this._cooldownLojaAte || 0) &&
            Math.abs(this.trCont.x - this.alvoX) < 4) {
            MaquinaEstados.irLoja(this.game);
            return;
        }

        if (t >= this._proximoCiclo) {
            this._cicloInicio  = t;
            this._proximoCiclo = t + CICLO_MS * multCiclo();
            for (var x = 0; x < COLS; x++) {
                for (var y = 0; y < ROWS; y++) {
                    if (!G.desbloq[x][y]) continue;
                    var e = G.plantas[x][y];
                    if (e > 0 && e < 5) {
                        var bonus = G.rega[x][y] ? 1 : 0;
                        var extra = CULTURAS[G.tipo[x][y] || 'girassol'].extraCiclo;
                        var avanco = Math.max(1, 1 + bonus + extra);
                        G.plantas[x][y] = Math.min(e + avanco, 5);
                        G.rega[x][y] = false;
                        this.drawTile(x, y);
                    }
                }
            }
            autoRegaAspersores(this);
            var colhidasAuto = autoColheitaEmpregados(this);
            if (!colhidasAuto) this.passeioEmpregados();
        }

        var tx = this.tLogico.x, ty = this.tLogico.y;

        if (Phaser.Input.Keyboard.JustDown(this.kM)) {
            this.moverAspersor();
        }

        if (Phaser.Input.Keyboard.JustDown(this.kArado)) {
            if (!G.arado) toast('⛏️ Compra o arado no Stand primeiro', 'war');
            else {
                G.aradoAcoplado = !G.aradoAcoplado;
                this.drawTrator();
                this.updateArado(true);
                this.updateUI();
                guardarJogo();
                toast('⛏️ Arado ' + (G.aradoAcoplado ? 'acoplado' : 'desacoplado'), 'ok');
            }
        }

        var usouArado = false;
        if (this.kSpace.isDown && G.arado && G.aradoAcoplado) {
            usouArado = this.plantarComArado(true);
        }

        if (!usouArado && this.kSpace.isDown && G.desbloq[tx][ty] && !(tx === 0 && ty === 0)) {
            if (G.plantas[tx][ty] === 0) {
                var culKey = G.sementeAtiva;
                var c = CULTURAS[culKey];
                if (c.requerEstufa && !G.estufa) {
                    toast('🏠 Precisas da Estufa na loja!', 'err');
                } else {
                var cp = custoPlantio(culKey);
                if (G.moedas < cp) {
                    toast('❌ Sementes custam ' + cp + '€', 'err');
                } else {
                G.moedas -= cp;
                G.plantas[tx][ty] = 1;
                G.tipo[tx][ty] = culKey;
                this.drawTile(tx, ty);
                toast(c.emoji + ' ' + c.nome + ' (-' + cp + '€)', 'ok');
                guardarJogo();
                }
                }
            } else if (G.plantas[tx][ty] >= 5) {
                var ganho = ganhoColheita(tx, ty);
                if (t - G.ultimaColheita < 4000) G.combo++;
                else G.combo = 1;
                G.maxCombo = Math.max(G.maxCombo || 0, G.combo);
                G.ultimaColheita = t;
                if (G.combo >= 3) ganho = Math.round(ganho * 1.25);
                var tipoColhido = G.tipo[tx][ty];
                G.plantas[tx][ty] = 0;
                G.tipo[tx][ty] = '';
                G.moedas += ganho;
                G.colheitas++;
                ganharXP(Math.floor(ganho / 8));
                progContrato('colheita', tipoColhido);
                progMissao('colheitas', 1);
                progMissao('riqueza', 0);
                verificarConquistas();
                this.drawTile(tx, ty);
                this.updateUI();
                var pp = this.iso(tx, ty);
                coinPop(this.game.canvas, pp.x, pp.y - this.terreno[tx][ty] - 30, ganho);
                if (G.combo >= 3) toast('🔥 Combo x' + G.combo + '!', 'war', 1200);
                guardarJogo();
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.kQ)) {
            var ord = ordemSementes();
            var i = ord.indexOf(G.sementeAtiva);
            G.sementeAtiva = ord[(i + 1) % ord.length];
            var c2 = CULTURAS[G.sementeAtiva];
            toast(c2.emoji + ' Semente: ' + c2.nome + ' (' + c2.ganho + '€)', 'ok');
            this.updateUI();
        }

        if (Phaser.Input.Keyboard.JustDown(this.kU) && G.desbloq[tx][ty]) {
            if (G.aduboRestante <= 0) toast('🧪 Sem adubo! Passa o dia [N]', 'err');
            else if (G.plantas[tx][ty] === 0) toast('🧪 Planta primeiro', 'war');
            else if (G.plantas[tx][ty] >= 5) toast('🧪 Já está pronto para colher', 'war');
            else {
                G.aduboRestante--;
                G.plantas[tx][ty] = Math.min(G.plantas[tx][ty] + 2, 5);
                this.drawTile(tx, ty);
                this.updateUI();
                toast('🧪 Adubo aplicado — cresceu mais!', 'ok');
                guardarJogo();
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.kR) && G.desbloq[tx][ty]) {
            if (G.regaRestante <= 0)       toast('💧 Sem água! Usa [N] para passar o dia', 'err');
            else if (G.plantas[tx][ty]===0) toast('🤔 Nada para regar', 'war');
            else if (G.rega[tx][ty])        toast('💧 Já está regado!', 'war');
            else {
                G.rega[tx][ty] = true; G.regaRestante--;
                this.drawTile(tx, ty); this.updateUI();
                toast('💧 Regado! Cresce mais rápido.', 'ok');
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.kE)) {
            if (G.desbloq[tx][ty])           toast('✅ Já desbloqueado', 'war');
            else {
                var ce = custoExpansao();
                if (G.moedas < ce) toast('❌ Precisas de ' + ce + '€', 'err');
                else {
                G.moedas -= ce; G.totalGasto = (G.totalGasto || 0) + ce;
                G.desbloq[tx][ty] = true; G.plantas[tx][ty] = 0;
                G.tipo[tx][ty] = '';
                G.expansoes++; progMissao('expandir', 1); progMissao('riqueza', 0); progMissao('gastar', ce);
                progContrato('expandir', 1);
                this.drawTile(tx, ty); this.updateUI();
                toast('🗺 Expandido! (-' + ce + '€)', 'ok');
                guardarJogo();
                }
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.kN)) {
            var imposto = Math.min(Math.floor(G.moedas * 0.04), 400 + G.dia * 100);
            var racao = custoRacaoGalinhas();
            var rendimento = rendimentoDiario();
            G.dia++;
            G.aduboRestante = 2;
            G.combo = 0;
            novoEventoDia();
            novoContrato();
            G.regaRestante = 5 + (G.eventoDia.rega || 0);
            G.moedas -= imposto + racao;
            G.moedas += rendimento;
            this.updateUI();
            toast('📅 Dia ' + G.dia + ' — ' + G.eventoDia.msg, 'ok', 2800);
            if (imposto > 0) setTimeout(function() { toast('🏛️ Impostos: -' + imposto + '€', 'war', 2500); }, 400);
            if (racao > 0) setTimeout(function() { toast('🐔 Ração: -' + racao + '€', 'war', 2500); }, 700);
            if (rendimento > 0) setTimeout(function() { toast('💼 Rendimento: +' + rendimento + '€', 'ok', 2500); }, 1000);
            guardarJogo();
        }

        if (t < this._proximoMov) return;
        var mov = false;
        var k = this.keys;
        if ((this.kW.isDown || k.up.isDown) && ty > 0) {
            this.tLogico.y--; this.tDirecao = { x: 0, y: -1 }; mov = true;
        } else if ((this.kS.isDown || k.down.isDown) && ty < ROWS - 1) {
            this.tLogico.y++; this.tDirecao = { x: 0, y: 1 }; mov = true;
        }
        if ((this.kA.isDown || k.left.isDown) && tx > 0) {
            this.tLogico.x--; this.tDirecao = { x: -1, y: 0 }; this.trCont.setScale(-1,1); mov = true;
        } else if ((this.kD.isDown || k.right.isDown) && tx < COLS - 1) {
            this.tLogico.x++; this.tDirecao = { x: 1, y: 0 }; this.trCont.setScale(1,1);  mov = true;
        }

        if (mov) {
            var h2 = this.terreno[this.tLogico.x][this.tLogico.y];
            var p2 = this.iso(this.tLogico.x, this.tLogico.y);
            this.alvoX = p2.x; this.alvoY = p2.y - h2;
            this.updateArado(false);
            this._proximoMov = t + G.velTrator;
            this.updateUI();
        }
    }
}
