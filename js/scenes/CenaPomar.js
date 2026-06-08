class CenaPomar extends Phaser.Scene {
    constructor() {
        super({ key: 'CenaPomar' });
    }

    pomarCicloMult() {
        return 1.45;
    }

    temArvoreAdjacente(x, y) {
        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                var xx = x + dx, yy = y + dy;
                if (xx < 0 || yy < 0 || xx >= this.pCols || yy >= this.pRows) continue;
                if (G.pomarPlantas[xx][yy] > 0) return true;
            }
        }
        return false;
    }

    posSaida() {
        return { x: -1, y: this.pRows - 1 };
    }

    ehSaidaSel() {
        var p = this.posSaida();
        return this.sel && this.sel.x === p.x && this.sel.y === p.y;
    }

    criarTileAcesso(opts) {
        var tam = 54;
        var p = this.iso(opts.gx, opts.gy);

        var g = this.add.graphics().setDepth(99998);
        g.setPosition(p.x, p.y);
        g.fillStyle(opts.fill || 0x164e63, 0.95);
        g.lineStyle(2, opts.line || 0x22d3ee, 0.95);
        g.beginPath();
        g.moveTo(0, -tam * 0.5);
        g.lineTo(tam, 0);
        g.lineTo(0, tam * 0.5);
        g.lineTo(-tam, 0);
        g.closePath();
        g.fillPath();
        g.strokePath();

        var zone = this.add.zone(p.x, p.y, tam * 2, tam)
            .setDepth(99999)
            .setInteractive(new Phaser.Geom.Polygon([
                0, -tam * 0.5,
                tam, 0,
                0, tam * 0.5,
                -tam, 0
            ]), Phaser.Geom.Polygon.Contains);

        if (opts.pulse) {
            this.tweens.add({ targets: g, alpha: 0.55, duration: 850, yoyo: true, repeat: -1 });
        }

        var txt = this.add.text(p.x, p.y - 2, opts.label || '', {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: opts.fontSize || '11px',
            fontStyle: 'bold',
            color: opts.textColor || '#e2e8f0'
        }).setOrigin(0.5).setDepth(100000);

        return { g: g, zone: zone, txt: txt };
    }

    criarTrator() {
        this.trCont = this.add.container(0, 0).setDepth(99995);
        this.trShadow = this.add.graphics();
        this.trGfx = this.add.graphics();
        this.trCont.add([this.trShadow, this.trGfx]);
        this.drawTrator();
        this.trDir = { x: 0, y: 1 };
        this.updateTrator(true);
    }

    drawTrator() {
        if (!this.trShadow || !this.trGfx) return;
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

    updateTrator(imediato) {
        if (!this.trCont) return;
        var p = this.iso(this.sel.x, this.sel.y);
        if (imediato) this.trCont.setPosition(p.x, p.y);
        else {
            this.trCont.x = Phaser.Math.Linear(this.trCont.x, p.x, 0.22);
            this.trCont.y = Phaser.Math.Linear(this.trCont.y, p.y, 0.22);
        }
        this.trCont.depth = Math.max(0, (this.sel.x + this.sel.y) * 10 + 9);
        if (this.trDir && this.trDir.x < 0) this.trCont.setScale(-1, 1);
        if (this.trDir && this.trDir.x > 0) this.trCont.setScale(1, 1);
    }

    updateSaidaUI() {
        if (!this.tileSaida) return;
        var sel = this.ehSaidaSel();
        this.tileSaida.g.setAlpha(sel ? 1 : 0.78);
        this.tileSaida.txt.setAlpha(sel ? 1 : 0.9);
        this.tileSaida.g.setScale(sel ? 1.06 : 1);
        this.tileSaida.txt.setScale(sel ? 1.06 : 1);
    }

    iso(gx, gy) {
        var tam = 54;
        var ox = 520, oy = 185;
        return {
            x: ox + (gx - gy) * tam,
            y: oy + (gx + gy) * (tam * 0.5)
        };
    }

    criarHUD() {
        var sp = this.add.graphics().setDepth(99990);
        sp.fillStyle(0x060d1a, 0.86);
        sp.fillRoundedRect(22, 18, 310, 110, 12);
        sp.lineStyle(1, 0x1e293b, 0.9);
        sp.strokeRoundedRect(22, 18, 310, 110, 12);

        this.txtHUD = this.add.text(36, 34, '', {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '13px',
            color: '#e2e8f0',
            lineSpacing: 6
        }).setDepth(99991);
    }

    updateHUD() {
        var tr = window.IdiomasJogo || { t: function(k) { return k; } };
        var s = CULTURAS[G.sementeAtiva];
        var nome = s ? (s.emoji + ' ' + s.nome) : G.sementeAtiva;
        this.txtHUD.setText(
            '🍎 ' + tr.t('pomar') + '\n' +
            '💰 ' + G.moedas + '€\n' +
            '🌱 ' + tr.t('semente') + ': ' + nome + '  [Q]\n' +
            tr.t('pomarHint')
        );
    }

    initPomarState() {
        var cols = this.pCols, rows = this.pRows;
        if (!G.pomarPlantas || !G.pomarTipo) {
            G.pomarPlantas = [];
            G.pomarTipo = [];
            G.pomarRega = [];
            for (var x = 0; x < cols; x++) {
                G.pomarPlantas[x] = [];
                G.pomarTipo[x] = [];
                G.pomarRega[x] = [];
                for (var y = 0; y < rows; y++) {
                    G.pomarPlantas[x][y] = 0;
                    G.pomarTipo[x][y] = '';
                    G.pomarRega[x][y] = false;
                }
            }
            guardarJogo();
        }
    }

    drawTile(x, y) {
        var g = this.gTiles[x][y];
        var d = this.gDetail[x][y];
        var p = this.iso(x, y);
        g.setPosition(p.x, p.y);
        d.setPosition(p.x, p.y);

        var tam = 54;
        g.clear();
        d.clear();

        g.lineStyle(2, 0x0b1220, 0.9);
        g.fillStyle(0x14532d, 1);
        g.beginPath();
        g.moveTo(0, -tam * 0.5);
        g.lineTo(tam, 0);
        g.lineTo(0, tam * 0.5);
        g.lineTo(-tam, 0);
        g.closePath();
        g.fillPath();
        g.strokePath();

        var e = G.pomarPlantas[x][y];
        var tipo = G.pomarTipo[x][y];
        if (e > 0) {
            var c = CULTURAS[tipo] || CULTURAS['cereja'];
            var cor = c.fruto || 0xfacc15;

            var troncoH = 10 + e * 5;
            var copaY = -10 - troncoH;
            var copaR = 10 + e * 4;

            d.fillStyle(0x052e16, 0.7);
            d.fillEllipse(0, 14, 34 + e * 5, 14 + e * 2);

            d.fillStyle(0x7c2d12, 1);
            d.fillRoundedRect(-4, -troncoH, 8, troncoH + 8, 3);
            d.fillStyle(0x92400e, 0.75);
            d.fillRect(-2, -troncoH + 2, 4, troncoH + 2);

            d.fillStyle(0x166534, 0.98);
            d.fillCircle(0, copaY, copaR);
            d.fillCircle(-copaR * 0.55, copaY + 2, Math.max(6, copaR * 0.75));
            d.fillCircle(copaR * 0.55, copaY + 2, Math.max(6, copaR * 0.75));
            d.fillStyle(0xffffff, 0.12);
            d.fillCircle(-3, copaY - 4, Math.max(3, copaR * 0.28));

            if (e >= 5) {
                d.fillStyle(cor, 0.95);
                d.fillCircle(-6, copaY + 4, 4);
                d.fillCircle(6, copaY + 6, 4);
                d.fillCircle(0, copaY + 12, 4);
                d.lineStyle(2, 0xfacc15, 0.85);
                d.strokeCircle(0, copaY, copaR + 2);
            }
        }

        if (this.sel && this.sel.x === x && this.sel.y === y) {
            d.lineStyle(3, 0x22d3ee, 0.95);
            d.strokeEllipse(0, 2, tam * 1.6, tam * 0.8);
            d.lineStyle(6, 0x22d3ee, 0.12);
            d.strokeEllipse(0, 2, tam * 1.75, tam * 0.88);
        }
    }

    create() {
        if (!G.pomar) {
            toast('🔒 ' + (window.IdiomasJogo ? IdiomasJogo.msg('pomarBloq', 'Pomar ainda não está desbloqueado') : 'Pomar ainda não está desbloqueado'), 'err', 3200);
            MaquinaEstados.irCampo(this.game, false);
            return;
        }

        if (this.game.canvas) {
            this.game.canvas.setAttribute('tabindex', '1');
            this.game.canvas.focus();
        }

        MaquinaEstados.mudar(Estado.POMAR);

        this.pCols = 6;
        this.pRows = 6;
        this.gTiles = [];
        this.gDetail = [];
        this.sel = { x: 2, y: 2 };

        this.keys = this.input.keyboard.createCursorKeys();
        this.kSpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.kQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.kEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        G.sementeCampoAtiva = (G.sementeAtiva && !(CULTURAS[G.sementeAtiva] && CULTURAS[G.sementeAtiva].requerPomar))
            ? G.sementeAtiva
            : (G.sementeCampoAtiva || 'girassol');

        var ord = ordemSementesPomar();
        if (ord.length) {
            var prefer = G.sementePomarAtiva || ord[0];
            G.sementeAtiva = ord.indexOf(prefer) >= 0 ? prefer : ord[0];
            G.sementePomarAtiva = G.sementeAtiva;
        }

        this.add.rectangle(500, 375, 1000, 750, 0x060d1a);
        this.add.rectangle(500, 375, 1000, 750, 0x0b1220, 0.18);
        this.add.rectangle(500, 375, 920, 650, 0x000000, 0.12);
        this.add.text(780, 54, '🍎 ' + (window.IdiomasJogo ? IdiomasJogo.t('pomar').toUpperCase() : 'POMAR'), {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '22px',
            fontStyle: '900',
            color: '#e2e8f0'
        }).setOrigin(0.5).setDepth(99999);

        this.initPomarState();

        for (var x = 0; x < this.pCols; x++) {
            this.gTiles[x] = [];
            this.gDetail[x] = [];
            for (var y = 0; y < this.pRows; y++) {
                var t = this.add.graphics().setDepth((x + y) * 10);
                var d = this.add.graphics().setDepth((x + y) * 10 + 1);
                this.gTiles[x][y] = t;
                this.gDetail[x][y] = d;
                this.drawTile(x, y);
            }
        }

        var saidaPos = this.posSaida();
        this.tileSaida = this.criarTileAcesso({
            gx: saidaPos.x,
            gy: saidaPos.y,
            label: '🚜 ' + (window.IdiomasJogo ? IdiomasJogo.t('campo').toUpperCase() : 'QUINTA'),
            fill: 0x0b2a35,
            line: 0x22d3ee,
            pulse: true
        });
        this.tileSaida.zone.on('pointerdown', () => {
            toast('🚜 ' + (window.IdiomasJogo ? IdiomasJogo.t('voltarCampo') : 'De volta ao campo!'), 'ok');
            G.sementePomarAtiva = G.sementeAtiva;
            G.sementeAtiva = G.sementeCampoAtiva || 'girassol';
            guardarJogo();
            MaquinaEstados.irCampo(this.game, false);
        });
        this.updateSaidaUI();

        this.criarTrator();

        this.criarHUD();
        this.updateHUD();

        this._cicloInicio = this.time.now;
        this._proximoCiclo = this.time.now + CICLO_MS * this.pomarCicloMult();

        toast('🍎 ' + (window.IdiomasJogo ? IdiomasJogo.t('pomar') : 'Pomar') + '!', 'ok', 3200);
    }

    update(t, dt) {
        if (!MaquinaEstados.esta(Estado.POMAR)) return;

        var moved = false;
        var saida = this.posSaida();
        if (Phaser.Input.Keyboard.JustDown(this.keys.left)) {
            if (this.sel.x > 0) { this.sel.x--; this.trDir = { x: -1, y: 0 }; moved = true; }
            else if (this.sel.x === 0 && this.sel.y === saida.y) { this.sel.x = saida.x; this.trDir = { x: -1, y: 0 }; moved = true; }
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.right)) {
            if (this.sel.x === saida.x && this.sel.y === saida.y) { this.sel.x = 0; this.trDir = { x: 1, y: 0 }; moved = true; }
            else if (this.sel.x < this.pCols - 1) { this.sel.x++; this.trDir = { x: 1, y: 0 }; moved = true; }
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
            if (this.sel.x === saida.x) this.sel.x = 0;
            if (this.sel.y > 0) { this.sel.y--; this.trDir = { x: 0, y: -1 }; moved = true; }
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.down)) {
            if (this.sel.x === saida.x) this.sel.x = 0;
            if (this.sel.y < this.pRows - 1) { this.sel.y++; this.trDir = { x: 0, y: 1 }; moved = true; }
        }
        if (this.sel.x === saida.x && this.sel.y !== saida.y) this.sel.x = 0;
        if (moved) {
            for (var x = 0; x < this.pCols; x++) for (var y = 0; y < this.pRows; y++) this.drawTile(x, y);
            this.updateSaidaUI();
            this.updateTrator(false);
            if (window.AudioJogo) AudioJogo.sfx('move');
            if (this.ehSaidaSel()) {
                toast('🚜 ' + (window.IdiomasJogo ? IdiomasJogo.t('voltarCampo') : 'De volta ao campo!'), 'ok');
                G.sementePomarAtiva = G.sementeAtiva;
                G.sementeAtiva = G.sementeCampoAtiva || 'girassol';
                guardarJogo();
                MaquinaEstados.irCampo(this.game, false);
                return;
            }
        }
        this.updateTrator(false);

        if (Phaser.Input.Keyboard.JustDown(this.kQ)) {
            var ord = ordemSementesPomar();
            if (!ord.length) return;
            var i = ord.indexOf(G.sementeAtiva);
            if (i < 0) i = 0;
            G.sementeAtiva = ord[(i + 1) % ord.length];
            G.sementePomarAtiva = G.sementeAtiva;
            var c2 = CULTURAS[G.sementeAtiva];
            if (window.AudioJogo) AudioJogo.sfx('click');
            toast(c2.emoji + ' ' + (window.IdiomasJogo ? IdiomasJogo.t('semente') : 'Semente') + ': ' + c2.nome + ' (' + c2.ganho + '€)', 'ok');
            this.updateHUD();
            guardarJogo();
        }

        if (t >= this._proximoCiclo) {
            this._cicloInicio = t;
            this._proximoCiclo = t + CICLO_MS * multCiclo() * this.pomarCicloMult();
            for (var xx = 0; xx < this.pCols; xx++) {
                for (var yy = 0; yy < this.pRows; yy++) {
                    var e = G.pomarPlantas[xx][yy];
                    if (e > 0 && e < 5) {
                        var tipo = G.pomarTipo[xx][yy] || 'cereja';
                        var extra = (CULTURAS[tipo] && CULTURAS[tipo].extraCiclo) || 0;
                        var avanco = Math.max(1, 1 + Math.floor(extra / 2));
                        G.pomarPlantas[xx][yy] = Math.min(e + avanco, 5);
                        this.drawTile(xx, yy);
                    }
                }
            }
            guardarJogo();
        }

        var tx = this.sel.x, ty = this.sel.y;
        if (this.kSpace.isDown) {
            if (tx < 0) return;
            if (G.pomarPlantas[tx][ty] === 0) {
                var culKey = G.sementeAtiva;
                var c = CULTURAS[culKey];
                if (!c || !c.requerPomar) {
                    toast('🍎 ' + (window.IdiomasJogo ? IdiomasJogo.msg('pomarSoArvores', 'No pomar só dá para plantar árvores/culturas grandes') : 'No pomar só dá para plantar árvores/culturas grandes'), 'war');
                    return;
                }
                if (this.temArvoreAdjacente(tx, ty)) {
                    toast('📏 ' + (window.IdiomasJogo ? IdiomasJogo.msg('espacoArvores', 'Precisas de 1 bloco de espaço entre árvores') : 'Precisas de 1 bloco de espaço entre árvores'), 'war');
                    return;
                }
                var cp = custoPlantio(culKey);
                if (G.moedas < cp) { toast('❌ ' + (window.IdiomasJogo ? IdiomasJogo.msg('sementesCustam', 'Sementes custam {valor}€', { valor: cp }) : 'Sementes custam ' + cp + '€'), 'err'); return; }
                G.moedas -= cp;
                G.pomarPlantas[tx][ty] = 1;
                G.pomarTipo[tx][ty] = culKey;
                this.drawTile(tx, ty);
                this.updateHUD();
                if (window.AudioJogo) AudioJogo.sfx('plant');
                toast(c.emoji + ' ' + c.nome + ' (-' + cp + '€)', 'ok');
                guardarJogo();
            } else if (G.pomarPlantas[tx][ty] >= 5) {
                var tipoColhido = G.pomarTipo[tx][ty] || 'cereja';
                var ganho = Math.round(CULTURAS[tipoColhido].ganho * G.bonusColheita * bonusNivelQuinta());
                G.pomarPlantas[tx][ty] = 0;
                G.pomarTipo[tx][ty] = '';
                G.moedas += ganho;
                G.colheitas++;
                ganharXP(Math.floor(ganho / 8));
                progContrato('colheita', tipoColhido);
                progMissao('colheitas', 1);
                verificarConquistas();
                this.drawTile(tx, ty);
                this.updateHUD();
                var pp = this.iso(tx, ty);
                coinPop(this.game.canvas, pp.x, pp.y - 40, ganho);
                if (window.AudioJogo) AudioJogo.sfx('harvest');
                toast('✅ ' + (window.IdiomasJogo ? IdiomasJogo.msg('colheste', 'Colheste +{valor}€', { valor: ganho }) : 'Colheste +' + ganho + '€'), 'ok');
                guardarJogo();
            }
        }
    }
}
