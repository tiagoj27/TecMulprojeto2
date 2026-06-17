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
        var ox = JOGO_CENTRO_X, oy = JOGO_CENTRO_Y - 190;
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
        } else {
            if (!G.pomarRega) G.pomarRega = [];
            var mudou = false;
            for (var xx = 0; xx < cols; xx++) {
                if (!G.pomarPlantas[xx]) { G.pomarPlantas[xx] = []; mudou = true; }
                if (!G.pomarTipo[xx]) { G.pomarTipo[xx] = []; mudou = true; }
                if (!G.pomarRega[xx]) { G.pomarRega[xx] = []; mudou = true; }
                for (var yy = 0; yy < rows; yy++) {
                    if (G.pomarPlantas[xx][yy] === undefined) { G.pomarPlantas[xx][yy] = 0; mudou = true; }
                    if (G.pomarTipo[xx][yy] === undefined) { G.pomarTipo[xx][yy] = ''; mudou = true; }
                    if (G.pomarRega[xx][yy] === undefined) { G.pomarRega[xx][yy] = false; mudou = true; }
                }
            }
            if (mudou) guardarJogo();
        }
    }

    toastPomar(msg, tipo, dur, chave) {
        var agora = this.time ? this.time.now : Date.now();
        var id = chave || msg;
        if (this._toastPomarId === id && agora - (this._toastPomarTempo || 0) < 1200) return;
        this._toastPomarId = id;
        this._toastPomarTempo = agora;
        toast(msg, tipo, dur || 1500);
    }

    desenharRelvaPomar(d, tam, x, y) {
        var pontos = [
            [-26, -3], [-15, 8], [-4, -8], [12, 5], [24, -4],
            [-21, 16], [5, 16], [20, 12]
        ];
        d.lineStyle(2, 0x86efac, 0.42);
        for (var i = 0; i < pontos.length; i++) {
            if ((i + x * 2 + y) % 3 === 0) continue;
            var px = pontos[i][0], py = pontos[i][1];
            d.beginPath(); d.moveTo(px, py + 5); d.lineTo(px + 2, py - 1); d.strokePath();
            d.beginPath(); d.moveTo(px + 4, py + 5); d.lineTo(px + 1, py); d.strokePath();
        }
    }

    desenharFrutoPomar(d, tipo, x, y, r) {
        if (tipo === 'pera') {
            d.fillStyle(0x84cc16, 1);
            d.fillEllipse(x, y + 1, r * 1.7, r * 2.2);
            d.fillCircle(x, y - r * 0.55, r * 0.75);
            d.fillStyle(0xfef08a, 0.45);
            d.fillCircle(x - r * 0.35, y - r * 0.2, Math.max(1.2, r * 0.28));
            return;
        }
        if (tipo === 'cereja') {
            d.lineStyle(1.5, 0x365314, 0.9);
            d.beginPath(); d.moveTo(x - r * 0.5, y - r); d.lineTo(x, y - r * 2); d.lineTo(x + r * 0.55, y - r); d.strokePath();
            d.fillStyle(0xb91c1c, 1);
            d.fillCircle(x - r * 0.45, y, r * 0.68);
            d.fillCircle(x + r * 0.55, y + 1, r * 0.68);
            d.fillStyle(0xffffff, 0.35);
            d.fillCircle(x - r * 0.7, y - r * 0.18, Math.max(1, r * 0.18));
            return;
        }
        if (tipo === 'ameixa') {
            d.fillStyle(0x7c3aed, 1);
            d.fillEllipse(x, y, r * 1.7, r * 1.35);
            d.fillStyle(0xf5d0fe, 0.35);
            d.fillCircle(x - r * 0.28, y - r * 0.22, Math.max(1, r * 0.2));
            return;
        }
        if (tipo === 'pessego') {
            d.fillStyle(0xfb923c, 1);
            d.fillCircle(x, y, r * 1.05);
            d.lineStyle(1.3, 0xc2410c, 0.45);
            d.beginPath(); d.moveTo(x, y - r); d.lineTo(x + 1, y + r); d.strokePath();
            d.fillStyle(0xffedd5, 0.42);
            d.fillCircle(x - r * 0.35, y - r * 0.35, Math.max(1, r * 0.24));
            return;
        }
        d.fillStyle(tipo === 'laranja' ? 0xf97316 : 0xef4444, 1);
        d.fillCircle(x, y, r);
        d.fillStyle(tipo === 'laranja' ? 0xffedd5 : 0xffffff, 0.32);
        d.fillCircle(x - r * 0.35, y - r * 0.35, Math.max(1, r * 0.22));
        d.fillStyle(0x365314, 0.9);
        d.fillEllipse(x + r * 0.2, y - r * 0.95, r * 0.9, r * 0.42);
    }

    desenharArvorePomar(d, estado, tipo) {
        var troncoH = 12 + estado * 5;
        var copaY = -13 - troncoH;
        var copaR = 9 + estado * 4;
        var madura = estado >= 5;

        d.fillStyle(0x052e16, 0.42);
        d.fillEllipse(0, 17, 34 + estado * 7, 15 + estado * 2);

        var troncoBase = tipo === 'cereja' ? 0xc08457 : 0x7c2d12;
        var troncoLuz = tipo === 'cereja' ? 0xe0a66f : 0x9a3412;
        d.lineStyle(5, troncoBase, 1);
        d.beginPath(); d.moveTo(0, 8); d.lineTo(0, -troncoH); d.strokePath();
        d.lineStyle(2, troncoLuz, 0.95);
        d.beginPath(); d.moveTo(0, -troncoH + 5); d.lineTo(-10, -troncoH - 7); d.strokePath();
        d.beginPath(); d.moveTo(1, -troncoH + 2); d.lineTo(10, -troncoH - 8); d.strokePath();

        var tons = tipo === 'pera'
            ? [0x65a30d, 0x4d7c0f, 0x84cc16]
            : (tipo === 'laranja'
                ? [0x15803d, 0x166534, 0x22c55e]
                : (tipo === 'cereja'
                    ? [0xf9a8d4, 0xf472b6, 0xfbcfe8]
                    : (tipo === 'ameixa'
                        ? [0x6d8d3d, 0x3f6212, 0x8b5cf6]
                        : (tipo === 'pessego' ? [0x86a64a, 0x4d7c0f, 0xfbbf24] : [0x166534, 0x14532d, 0x16a34a]))));
        d.fillStyle(tons[1], 1);
        d.fillEllipse(0, copaY + 5, copaR * 2.2, copaR * 1.65);
        d.fillStyle(tons[0], 1);
        d.fillCircle(-copaR * 0.55, copaY + 1, copaR * 0.9);
        d.fillCircle(copaR * 0.55, copaY + 2, copaR * 0.88);
        d.fillStyle(tons[2], 0.95);
        d.fillCircle(-copaR * 0.12, copaY - copaR * 0.42, copaR * 0.95);
        d.fillCircle(copaR * 0.18, copaY + copaR * 0.28, copaR * 0.78);
        d.fillStyle(0xffffff, tipo === 'cereja' ? 0.24 : 0.12);
        d.fillCircle(-copaR * 0.4, copaY - copaR * 0.38, Math.max(3, copaR * 0.22));

        if (tipo === 'cereja') {
            d.fillStyle(0xfce7f3, 0.55);
            d.fillCircle(-22, 9, 2.2);
            d.fillCircle(-12, 16, 1.8);
            d.fillCircle(18, 12, 2);
            d.fillCircle(25, 2, 1.6);
        }

        if (!madura) {
            d.lineStyle(2, tipo === 'cereja' ? 0xfce7f3 : 0xbbf7d0, 0.46);
            d.strokeEllipse(0, copaY + 3, copaR * 2.35, copaR * 1.55);
            return;
        }

        var frutos = [
            [-10, -2], [8, 0], [0, 9], [-17, 7], [17, 8], [2, -9]
        ];
        for (var i = 0; i < frutos.length; i++) {
            this.desenharFrutoPomar(d, tipo, frutos[i][0], copaY + frutos[i][1], tipo === 'cereja' ? 3.8 : 4.2);
        }
        d.lineStyle(2, tipo === 'cereja' ? 0xfce7f3 : 0xfef08a, 0.75);
        d.strokeEllipse(0, copaY + 4, copaR * 2.45, copaR * 1.75);
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

        g.fillStyle(0x6b3f1d, 1);
        g.beginPath();
        g.moveTo(-tam, 0);
        g.lineTo(0, tam * 0.5);
        g.lineTo(0, tam * 0.74);
        g.lineTo(-tam, tam * 0.24);
        g.closePath();
        g.fillPath();
        g.fillStyle(0x4b2c16, 1);
        g.beginPath();
        g.moveTo(tam, 0);
        g.lineTo(0, tam * 0.5);
        g.lineTo(0, tam * 0.74);
        g.lineTo(tam, tam * 0.24);
        g.closePath();
        g.fillPath();

        g.lineStyle(2, 0x25451f, 0.95);
        g.fillStyle(0x58a541, 1);
        g.beginPath();
        g.moveTo(0, -tam * 0.5);
        g.lineTo(tam, 0);
        g.lineTo(0, tam * 0.5);
        g.lineTo(-tam, 0);
        g.closePath();
        g.fillPath();
        g.strokePath();
        g.lineStyle(1, 0x9ae66e, 0.28);
        g.beginPath(); g.moveTo(-tam * 0.62, -1); g.lineTo(0, tam * 0.31); g.lineTo(tam * 0.62, -1); g.strokePath();

        var e = G.pomarPlantas[x][y];
        var tipo = G.pomarTipo[x][y];
        this.desenharRelvaPomar(d, tam, x, y);
        if (e > 0) this.desenharArvorePomar(d, e, tipo || 'cereja');

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
        this.cameras.main.setScroll(0, 0);

        this.pCols = 7;
        this.pRows = 7;
        this.gTiles = [];
        this.gDetail = [];
        this.sel = { x: 2, y: 2 };

        this.keys = this.input.keyboard.createCursorKeys();
        this.kW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.kA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.kS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.kD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
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

        this.add.rectangle(JOGO_CENTRO_X, JOGO_CENTRO_Y, JOGO_LARGURA, JOGO_ALTURA, 0x0f1f14);
        this.add.rectangle(JOGO_CENTRO_X, JOGO_CENTRO_Y + 220, JOGO_LARGURA, 340, 0x172b16, 0.72);
        this.add.rectangle(JOGO_CENTRO_X, JOGO_CENTRO_Y - 180, JOGO_LARGURA, 260, 0x263b26, 0.36);
        this.add.text(JOGO_LARGURA - 220, 54, (window.IdiomasJogo ? IdiomasJogo.t('pomar').toUpperCase() : 'POMAR'), {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '22px',
            fontStyle: '900',
            color: '#dcfce7'
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
    }

    update(t, dt) {
        if (!MaquinaEstados.esta(Estado.POMAR)) return;

        var moved = false;
        var saida = this.posSaida();
        var moveLeft = Phaser.Input.Keyboard.JustDown(this.keys.left) || Phaser.Input.Keyboard.JustDown(this.kA);
        var moveRight = Phaser.Input.Keyboard.JustDown(this.keys.right) || Phaser.Input.Keyboard.JustDown(this.kD);
        var moveUp = Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.kW);
        var moveDown = Phaser.Input.Keyboard.JustDown(this.keys.down) || Phaser.Input.Keyboard.JustDown(this.kS);

        if (moveLeft) {
            if (this.sel.x > 0) { this.sel.x--; this.trDir = { x: -1, y: 0 }; moved = true; }
            else if (this.sel.x === 0 && this.sel.y === saida.y) { this.sel.x = saida.x; this.trDir = { x: -1, y: 0 }; moved = true; }
        }
        if (moveRight) {
            if (this.sel.x === saida.x && this.sel.y === saida.y) { this.sel.x = 0; this.trDir = { x: 1, y: 0 }; moved = true; }
            else if (this.sel.x < this.pCols - 1) { this.sel.x++; this.trDir = { x: 1, y: 0 }; moved = true; }
        }
        if (moveUp) {
            if (this.sel.x === saida.x) this.sel.x = 0;
            if (this.sel.y > 0) { this.sel.y--; this.trDir = { x: 0, y: -1 }; moved = true; }
        }
        if (moveDown) {
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
        if (Phaser.Input.Keyboard.JustDown(this.kSpace)) {
            if (tx < 0) return;
            if (G.pomarPlantas[tx][ty] === 0) {
                var culKey = G.sementeAtiva;
                var c = CULTURAS[culKey];
                if (!c || !c.requerPomar) {
                    this.toastPomar('No pomar so da para plantar arvores/culturas grandes', 'war', 1400, 'so-arvores');
                    return;
                }
                if (this.temArvoreAdjacente(tx, ty)) {
                    this.toastPomar('Precisas de 1 bloco de espaco entre arvores', 'war', 1400, 'espaco-arvores');
                    return;
                }
                var cp = custoPlantio(culKey);
                if (G.moedas < cp) { this.toastPomar('Sementes custam ' + cp + ' EUR', 'err', 1400, 'sem-moedas'); return; }
                G.moedas -= cp;
                G.pomarPlantas[tx][ty] = 1;
                G.pomarTipo[tx][ty] = culKey;
                this.drawTile(tx, ty);
                this.updateHUD();
                if (window.AudioJogo) AudioJogo.sfx('plant');
                this.toastPomar(c.nome + ' plantada (-' + cp + ' EUR)', 'ok', 1400, 'plantou');
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
                this.toastPomar('Colheste +' + ganho + ' EUR', 'ok', 1400, 'colheu');
                guardarJogo();
            }
        }
    }
}
