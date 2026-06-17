class CenaAnimais extends Phaser.Scene {
    constructor() {
        super({ key: 'CenaAnimais' });
    }

    animaisCicloMult() {
        return 1.65;
    }

    iso(gx, gy) {
        var tam = 54;
        var ox = JOGO_CENTRO_X, oy = JOGO_CENTRO_Y - 165;
        return {
            x: ox + (gx - gy) * tam,
            y: oy + (gx + gy) * (tam * 0.5)
        };
    }

    posSaida() {
        return { x: -1, y: this.aRows - 1 };
    }

    posLoja() {
        return { x: this.aCols, y: -1 };
    }

    ehSaidaSel() {
        var p = this.posSaida();
        return this.sel && this.sel.x === p.x && this.sel.y === p.y;
    }

    ehLojaSel() {
        var p = this.posLoja();
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

    criarHUD() {
        var sp = this.add.graphics().setDepth(99990);
        sp.fillStyle(0x060d1a, 0.86);
        sp.fillRoundedRect(22, 18, 330, 130, 12);
        sp.lineStyle(1, 0x1e293b, 0.9);
        sp.strokeRoundedRect(22, 18, 330, 130, 12);

        this.txtHUD = this.add.text(36, 34, '', {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '13px',
            color: '#e2e8f0',
            lineSpacing: 6
        }).setDepth(99991);
    }

    updateHUD() {
        var tr = window.IdiomasJogo || { t: function(k) { return k; } };
        var a = G.animaisData;
        var fr = [
            '🐔 ' + tr.t('galinhas') + ': ' + a.galinhas.qtd + '  ' + tr.t('alimentadas') + ': ' + a.galinhas.fed + '/' + a.galinhas.qtd,
            '   ' + tr.t('ovosProntos') + ': ' + a.galinhas.pronto,
            '🐄 ' + tr.t('vacas') + ': ' + a.vacas.qtd + '  ' + tr.t('alimentadas') + ': ' + a.vacas.fed + '/' + a.vacas.qtd,
            '   ' + tr.t('leitePronto') + ': ' + a.vacas.pronto
        ].join('\n');
        this.txtHUD.setText(
            '🐄 ' + tr.t('animais') + '\n' +
            '💰 ' + G.moedas + '€\n' +
            fr + '\n' +
            tr.t('animaisHint')
        );
    }

    initAnimaisState() {
        if (!G.animaisData) {
            G.animaisData = {
                galinhas: { qtd: 1, fed: 0, pronto: 0 },
                vacas: { qtd: 0, fed: 0, pronto: 0 }
            };
            toast('🐔 Primeiro animal grátis! Recebeste 1 galinha.', 'ok', 3200);
            guardarJogo();
        } else {
            if (G.animaisData.galinhas && typeof G.animaisData.galinhas.fed === 'boolean') {
                G.animaisData.galinhas.fed = G.animaisData.galinhas.fed ? (G.animaisData.galinhas.qtd || 0) : 0;
            }
            if (G.animaisData.vacas && typeof G.animaisData.vacas.fed === 'boolean') {
                G.animaisData.vacas.fed = G.animaisData.vacas.fed ? (G.animaisData.vacas.qtd || 0) : 0;
            }
        }
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

    criarLojaUI() {
        this._lojaAberta = false;
        this._lojaEls = [];
        this._lojaCont = this.add.container(0, 0).setDepth(100005).setVisible(false);
        var lojaX = JOGO_LARGURA - 390;
        var lojaTituloX = lojaX + 180;

        var bg = this.add.graphics();
        bg.fillStyle(0x060d1a, 0.94);
        bg.fillRoundedRect(lojaX, 110, 360, 260, 14);
        bg.lineStyle(1, 0x1e293b, 0.9);
        bg.strokeRoundedRect(lojaX, 110, 360, 260, 14);
        bg.lineStyle(2, 0xfbbf24, 0.6);
        bg.beginPath(); bg.moveTo(lojaX + 20, 150); bg.lineTo(lojaX + 340, 150); bg.strokePath();

var title = this.add.text(lojaTituloX, 130, '🛒 ' + (window.IdiomasJogo ? IdiomasJogo.t('lojaAnimais') : 'LOJA DOS ANIMAIS'), {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '15px',
            fontStyle: '900',
            color: '#f8fafc'
        }).setOrigin(0.5);

var info = this.add.text(lojaX + 20, 164, (window.IdiomasJogo ? IdiomasJogo.t('lojaAnimaisInfo') : 'Clique para comprar. A produção só acontece se alimentares.'), {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '11px',
            color: '#64748b'
        });

var btn1 = this.add.text(lojaX + 20, 210, '🐔 ' + (window.IdiomasJogo ? IdiomasJogo.t('comprarGalinha') : '+1 Galinha — 250€'), {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#e2e8f0',
            backgroundColor: '#0b1220cc',
            padding: { x: 12, y: 10 }
        }).setDepth(100006).setInteractive({ useHandCursor: true });
        btn1.on('pointerdown', () => this.comprarAnimal('galinha'));

var btn2 = this.add.text(lojaX + 20, 270, '🐄 ' + (window.IdiomasJogo ? IdiomasJogo.t('comprarVaca') : '+1 Vaca — 650€'), {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#e2e8f0',
            backgroundColor: '#0b1220cc',
            padding: { x: 12, y: 10 }
        }).setDepth(100006).setInteractive({ useHandCursor: true });
        btn2.on('pointerdown', () => this.comprarAnimal('vaca'));

var hint = this.add.text(lojaTituloX, 350, (window.IdiomasJogo ? IdiomasJogo.t('sairLojaAnimais') : 'Sai da loja ao mover para fora da tile') + ' 🛒', {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '10px',
            color: '#475569'
        }).setOrigin(0.5);

        this._lojaCont.add([bg, title, info, btn1, btn2, hint]);
        this._lojaEls = [btn1, btn2];
    }

    abrirLoja() {
        if (this._lojaAberta) return;
        this._lojaAberta = true;
        this._lojaCont.setVisible(true);
    }

    fecharLoja() {
        if (!this._lojaAberta) return;
        this._lojaAberta = false;
        this._lojaCont.setVisible(false);
    }

    comprarAnimal(tipo) {
        var custo = (tipo === 'galinha') ? 250 : 650;
        if (G.moedas < custo) { toast('❌ ' + (window.IdiomasJogo ? IdiomasJogo.msg('saldoInsuficiente', 'Saldo insuficiente') : 'Saldo insuficiente'), 'err'); return; }
        G.moedas -= custo;
        if (tipo === 'galinha') G.animaisData.galinhas.qtd++;
        else G.animaisData.vacas.qtd++;
        if (window.AudioJogo) AudioJogo.sfx('buy');
        toast('✅ ' + (window.IdiomasJogo ? IdiomasJogo.msg('compraFeita', 'Compra feita!') : 'Compra feita!'), 'ok');
        for (var x = 0; x < this.aCols; x++) {
            for (var y = 0; y < this.aRows; y++) this.drawTile(x, y);
        }
        this.updateHUD();
        guardarJogo();
    }

    tipoZonaSel() {
        if (this.sel.x < 0 || this.sel.y < 0) return null;
        if (this.sel.x >= this.aCols || this.sel.y >= this.aRows) return null;
        return (this.sel.x < Math.floor(this.aCols / 2)) ? 'galinha' : 'vaca';
    }

    posicoesGalinhas() {
        return [
            { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
            { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 },
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
            { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }
        ];
    }

    posicoesVacas() {
        return [
            { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 3, y: 1 },
            { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 3, y: 2 },
            { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 3, y: 0 },
            { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 3, y: 3 }
        ];
    }

    animalNoTile(x, y) {
        var a = G.animaisData;
        var gp = this.posicoesGalinhas();
        for (var i = 0; i < Math.min(a.galinhas.qtd || 0, gp.length); i++) {
            if (gp[i].x === x && gp[i].y === y) return { tipo: 'galinha', idx: i };
        }
        var vp = this.posicoesVacas();
        for (var j = 0; j < Math.min(a.vacas.qtd || 0, vp.length); j++) {
            if (vp[j].x === x && vp[j].y === y) return { tipo: 'vaca', idx: j };
        }
        return null;
    }

    desenharGalinha(d, temProduto, alimentada, escala, offX, offY) {
        var s = escala || 1;
        var ox = offX || 0, oy = (offY !== undefined ? offY : -8);

        d.fillStyle(0x0f172a, 0.22);
        d.fillEllipse(ox, 17, 36 * s, 13 * s);

        d.fillStyle(0xfefce8, 1);
        d.fillEllipse(ox - 4 * s, oy + 2 * s, 26 * s, 20 * s);
        d.fillStyle(0xffffff, 1);
        d.fillEllipse(ox + 10 * s, oy - 8 * s, 15 * s, 14 * s);
        d.fillStyle(0xf1f5f9, 0.95);
        d.fillEllipse(ox - 9 * s, oy + 3 * s, 14 * s, 10 * s);
        d.lineStyle(1.6 * s, 0xe2e8f0, 0.9);
        d.strokeEllipse(ox - 4 * s, oy + 2 * s, 26 * s, 20 * s);

        d.fillStyle(0xef4444, 1);
        d.fillCircle(ox + 10 * s, oy - 16 * s, 3.8 * s);
        d.fillCircle(ox + 14 * s, oy - 15 * s, 3.2 * s);
        d.fillCircle(ox + 7 * s, oy - 14 * s, 3 * s);

        d.fillStyle(0xf59e0b, 1);
        d.fillTriangle(ox + 17 * s, oy - 8 * s, ox + 27 * s, oy - 5 * s, ox + 17 * s, oy - 2 * s);
        d.fillStyle(0x111827, 0.95);
        d.fillCircle(ox + 13 * s, oy - 10 * s, 1.6 * s);

        d.lineStyle(2 * s, 0xf59e0b, 0.95);
        d.beginPath(); d.moveTo(ox - 7 * s, oy + 12 * s); d.lineTo(ox - 9 * s, oy + 18 * s); d.strokePath();
        d.beginPath(); d.moveTo(ox + 2 * s, oy + 12 * s); d.lineTo(ox, oy + 18 * s); d.strokePath();

        if (alimentada) {
            d.fillStyle(0x22c55e, 0.95);
            d.fillCircle(ox - 20 * s, oy - 2 * s, 4 * s);
            d.lineStyle(1.5 * s, 0x166534, 0.8);
            d.beginPath(); d.moveTo(ox - 22 * s, oy - 1 * s); d.lineTo(ox - 17 * s, oy - 5 * s); d.strokePath();
        }
        if (temProduto) {
            d.fillStyle(0xfef3c7, 1);
            d.fillEllipse(ox - 15 * s, oy + 14 * s, 10 * s, 8 * s);
            d.fillStyle(0xffffff, 0.5);
            d.fillCircle(ox - 17 * s, oy + 12 * s, 2 * s);
        }
    }

    desenharVaca(d, temProduto, alimentada, escala, offX, offY) {
        var s = escala || 1;
        var ox = offX || 0, oy = (offY !== undefined ? offY : -10);

        d.fillStyle(0x0f172a, 0.24);
        d.fillEllipse(ox, 18, 52 * s, 16 * s);

        d.fillStyle(0xf8fafc, 1);
        d.fillRoundedRect(ox - 22 * s, oy - 9 * s, 43 * s, 25 * s, 9 * s);
        d.fillRoundedRect(ox + 9 * s, oy - 18 * s, 24 * s, 20 * s, 8 * s);
        d.lineStyle(1.5 * s, 0xcbd5e1, 0.9);
        d.strokeRoundedRect(ox - 22 * s, oy - 9 * s, 43 * s, 25 * s, 9 * s);

        d.fillStyle(0x111827, 0.82);
        d.fillEllipse(ox - 10 * s, oy - 2 * s, 13 * s, 10 * s);
        d.fillEllipse(ox + 2 * s, oy + 7 * s, 11 * s, 8 * s);
        d.fillEllipse(ox + 18 * s, oy - 11 * s, 9 * s, 7 * s);

        d.fillStyle(0xfca5a5, 1);
        d.fillEllipse(ox + 24 * s, oy - 2 * s, 17 * s, 10 * s);
        d.fillStyle(0x111827, 0.55);
        d.fillCircle(ox + 20 * s, oy - 2 * s, 1.4 * s);
        d.fillCircle(ox + 28 * s, oy - 2 * s, 1.4 * s);
        d.fillStyle(0x111827, 1);
        d.fillCircle(ox + 19 * s, oy - 11 * s, 1.7 * s);
        d.fillCircle(ox + 28 * s, oy - 11 * s, 1.7 * s);

        d.fillStyle(0xfef3c7, 1);
        d.fillTriangle(ox + 13 * s, oy - 17 * s, ox + 8 * s, oy - 24 * s, ox + 16 * s, oy - 20 * s);
        d.fillTriangle(ox + 30 * s, oy - 17 * s, ox + 36 * s, oy - 24 * s, ox + 28 * s, oy - 20 * s);
        d.fillStyle(0xf8fafc, 1);
        d.fillEllipse(ox + 8 * s, oy - 11 * s, 7 * s, 10 * s);
        d.fillEllipse(ox + 34 * s, oy - 11 * s, 7 * s, 10 * s);

        d.fillStyle(0x334155, 1);
        d.fillRect(ox - 18 * s, oy + 14 * s, 5 * s, 11 * s);
        d.fillRect(ox - 5 * s, oy + 14 * s, 5 * s, 11 * s);
        d.fillRect(ox + 8 * s, oy + 14 * s, 5 * s, 11 * s);
        d.fillRect(ox + 22 * s, oy + 2 * s, 5 * s, 12 * s);

        d.lineStyle(2 * s, 0x111827, 0.72);
        d.beginPath(); d.moveTo(ox - 22 * s, oy - 2 * s); d.lineTo(ox - 31 * s, oy - 11 * s); d.strokePath();
        d.fillStyle(0x111827, 0.78);
        d.fillCircle(ox - 32 * s, oy - 11 * s, 2.3 * s);

        if (alimentada) {
            d.fillStyle(0x22c55e, 0.95);
            d.fillCircle(ox - 24 * s, oy + 2 * s, 4 * s);
            d.lineStyle(1.4 * s, 0x166534, 0.85);
            d.beginPath(); d.moveTo(ox - 26 * s, oy + 2 * s); d.lineTo(ox - 21 * s, oy - 2 * s); d.strokePath();
        }
        if (temProduto) {
            d.fillStyle(0x93c5fd, 1);
            d.fillRoundedRect(ox - 8 * s, oy + 10 * s, 17 * s, 11 * s, 4 * s);
            d.fillStyle(0xffffff, 0.35);
            d.fillCircle(ox - 3 * s, oy + 12 * s, 2.2 * s);
        }
    }

    desenharDetalhesRecinto(d, isGalinhas, x, y) {
        if (isGalinhas) {
            d.lineStyle(2, 0xfde68a, 0.45);
            var palha = [[-28, -2], [-14, 9], [6, -8], [20, 7], [28, -1]];
            for (var i = 0; i < palha.length; i++) {
                var px = palha[i][0], py = palha[i][1];
                d.beginPath(); d.moveTo(px - 5, py); d.lineTo(px + 5, py + 4); d.strokePath();
            }
            d.fillStyle(0xfef3c7, 0.7);
            d.fillEllipse(-30, 10, 9, 6);
            return;
        }

        d.lineStyle(2, 0xbbf7d0, 0.45);
        var relva = [[-26, 5], [-14, -3], [2, 8], [14, -5], [27, 4]];
        for (var j = 0; j < relva.length; j++) {
            var gx = relva[j][0], gy = relva[j][1];
            d.beginPath(); d.moveTo(gx, gy + 6); d.lineTo(gx + 2, gy); d.strokePath();
            d.beginPath(); d.moveTo(gx + 4, gy + 6); d.lineTo(gx + 1, gy + 1); d.strokePath();
        }
        if ((x + y) % 2 === 0) {
            d.fillStyle(0x8b5a2b, 0.85);
            d.fillRoundedRect(-34, -9, 14, 10, 3);
            d.fillStyle(0xfbbf24, 0.55);
            d.fillEllipse(-27, -5, 11, 5);
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

        var isGalinhas = x < Math.floor(this.aCols / 2);
        var top = isGalinhas ? 0xc9983f : 0x62a744;
        var sideA = isGalinhas ? 0x8a5a22 : 0x3c6f31;
        var sideB = isGalinhas ? 0x70451c : 0x2f5729;
        var line = isGalinhas ? 0xfacc15 : 0x86efac;

        g.fillStyle(sideA, 1);
        g.beginPath();
        g.moveTo(-tam, 0);
        g.lineTo(0, tam * 0.5);
        g.lineTo(0, tam * 0.74);
        g.lineTo(-tam, tam * 0.24);
        g.closePath();
        g.fillPath();
        g.fillStyle(sideB, 1);
        g.beginPath();
        g.moveTo(tam, 0);
        g.lineTo(0, tam * 0.5);
        g.lineTo(0, tam * 0.74);
        g.lineTo(tam, tam * 0.24);
        g.closePath();
        g.fillPath();

        g.lineStyle(2, isGalinhas ? 0x6b4218 : 0x285221, 0.95);
        g.fillStyle(top, 1);
        g.beginPath();
        g.moveTo(0, -tam * 0.5);
        g.lineTo(tam, 0);
        g.lineTo(0, tam * 0.5);
        g.lineTo(-tam, 0);
        g.closePath();
        g.fillPath();
        g.strokePath();

        d.lineStyle(2, line, 0.24);
        d.strokeEllipse(0, 4, tam * 1.42, tam * 0.72);
        d.fillStyle(0x000000, 0.08);
        d.fillEllipse(0, 14, 45, 17);
        this.desenharDetalhesRecinto(d, isGalinhas, x, y);

        if (x === 2) {
            d.lineStyle(3, 0x6b3f1d, 0.58);
            d.beginPath(); d.moveTo(36, -16); d.lineTo(48, -10); d.strokePath();
            d.beginPath(); d.moveTo(18, -7); d.lineTo(30, -1); d.strokePath();
        }

        var a = G.animaisData;
        var an = this.animalNoTile(x, y);
        if (an && an.tipo === 'galinha') {
            var temOvos = (a.galinhas.pronto || 0) > 0;
            this.desenharGalinha(d, temOvos, an.idx < (a.galinhas.fed || 0), 1, 0, -8);
            d.fillStyle(0xffffff, 0.12);
            d.fillCircle(-6, -18, 4);
        } else if (an && an.tipo === 'vaca') {
            var temLeite = (a.vacas.pronto || 0) > 0;
            this.desenharVaca(d, temLeite, an.idx < (a.vacas.fed || 0), 0.9, 0, -10);
            d.fillStyle(0xffffff, 0.12);
            d.fillCircle(-8, -18, 4);
        }

        if (this.sel && this.sel.x === x && this.sel.y === y) {
            d.lineStyle(3, 0x22d3ee, 0.95);
            d.strokeEllipse(0, 2, tam * 1.6, tam * 0.8);
            d.lineStyle(6, 0x22d3ee, 0.12);
            d.strokeEllipse(0, 2, tam * 1.75, tam * 0.88);
        }
    }

    create() {
        if (!G.animais) {
            toast('🔒 ' + (window.IdiomasJogo ? IdiomasJogo.msg('animaisIndisp', 'Animais ainda não estão disponíveis') : 'Animais ainda não estão disponíveis'), 'err', 3200);
            MaquinaEstados.irCampo(this.game, false);
            return;
        }

        if (this.game.canvas) {
            this.game.canvas.setAttribute('tabindex', '1');
            this.game.canvas.focus();
        }

        MaquinaEstados.mudar(Estado.ANIMAIS);
        this.cameras.main.setScroll(0, 0);

        this.aCols = 6;
        this.aRows = 4;
        this.gTiles = [];
        this.gDetail = [];
        this.sel = { x: 2, y: 2 };

        this.keys = this.input.keyboard.createCursorKeys();
        this.kW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.kA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.kS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.kD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.kSpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.kR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.kEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.add.rectangle(JOGO_CENTRO_X, JOGO_CENTRO_Y, JOGO_LARGURA, JOGO_ALTURA, 0x142014);
        this.add.rectangle(JOGO_CENTRO_X - 240, JOGO_CENTRO_Y + 165, JOGO_LARGURA * 0.7, 360, 0x3b2a15, 0.34);
        this.add.rectangle(JOGO_CENTRO_X + 260, JOGO_CENTRO_Y + 155, JOGO_LARGURA * 0.72, 360, 0x244b22, 0.44);
        this.add.text(JOGO_LARGURA - 220, 54, (window.IdiomasJogo ? IdiomasJogo.t('animais').toUpperCase() : 'ANIMAIS'), {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '22px',
            fontStyle: '900',
            color: '#fef3c7'
        }).setOrigin(0.5).setDepth(99999);

        this.initAnimaisState();

        for (var x = 0; x < this.aCols; x++) {
            this.gTiles[x] = [];
            this.gDetail[x] = [];
            for (var y = 0; y < this.aRows; y++) {
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
            guardarJogo();
            MaquinaEstados.irCampo(this.game, false);
        });

        var lojaPos = this.posLoja();
        this.tileLoja = this.criarTileAcesso({
            gx: lojaPos.x,
            gy: lojaPos.y,
            label: '🛒 ' + (window.IdiomasJogo ? IdiomasJogo.t('loja').toUpperCase() : 'LOJA'),
            fill: 0x1f2937,
            line: 0xfbbf24,
            pulse: true
        });
        this.tileLoja.zone.on('pointerdown', () => {
            this.sel.x = lojaPos.x;
            this.sel.y = lojaPos.y;
            this.abrirLoja();
            this.updateTrator(true);
        });

        this.criarLojaUI();

        this.criarTrator();
        this.criarHUD();
        this.updateHUD();

        this._cicloInicio = this.time.now;
        this._proximoCiclo = this.time.now + CICLO_MS * this.animaisCicloMult();
    }

    aplicarCiclo() {
        var a = G.animaisData;
        if (a.galinhas.fed > 0) {
            a.galinhas.pronto += a.galinhas.fed;
            a.galinhas.fed = 0;
        }
        if (a.vacas.fed > 0) {
            a.vacas.pronto += a.vacas.fed;
            a.vacas.fed = 0;
        }
        this.updateHUD();
        guardarJogo();
        for (var x = 0; x < this.aCols; x++) for (var y = 0; y < this.aRows; y++) this.drawTile(x, y);
    }

    toastAnimais(msg, tipo, dur, chave) {
        var agora = this.time ? this.time.now : Date.now();
        var id = chave || msg;
        if (this._toastAnimaisId === id && agora - (this._toastAnimaisTempo || 0) < 1200) return;
        this._toastAnimaisId = id;
        this._toastAnimaisTempo = agora;
        toast(msg, tipo, dur || 1500);
    }

    alimentarZona(z) {
        var a = G.animaisData;
        if (z === 'galinha') {
            if (a.galinhas.qtd <= 0) { this.toastAnimais('Nao tens galinhas', 'war', 1400, 'sem-galinhas'); return; }
            var faltamG = Math.max(0, (a.galinhas.qtd || 0) - (a.galinhas.fed || 0));
            if (faltamG <= 0) { this.toastAnimais('As galinhas ja estao todas alimentadas', 'war', 1400, 'galinhas-todas'); return; }
            a.galinhas.fed = a.galinhas.qtd;
            if (window.AudioJogo) AudioJogo.sfx('animal');
            this.toastAnimais('Alimentaste todas as galinhas (' + a.galinhas.fed + '/' + a.galinhas.qtd + ')', 'ok', 1500, 'feed-galinhas');
        } else if (z === 'vaca') {
            if (a.vacas.qtd <= 0) { this.toastAnimais('Nao tens vacas', 'war', 1400, 'sem-vacas'); return; }
            var faltamV = Math.max(0, (a.vacas.qtd || 0) - (a.vacas.fed || 0));
            if (faltamV <= 0) { this.toastAnimais('As vacas ja estao todas alimentadas', 'war', 1400, 'vacas-todas'); return; }
            a.vacas.fed = a.vacas.qtd;
            if (window.AudioJogo) AudioJogo.sfx('animal');
            this.toastAnimais('Alimentaste todas as vacas (' + a.vacas.fed + '/' + a.vacas.qtd + ')', 'ok', 1500, 'feed-vacas');
        }
        this.updateHUD();
        guardarJogo();
        for (var x = 0; x < this.aCols; x++) for (var y = 0; y < this.aRows; y++) this.drawTile(x, y);
    }

    recolherZona(z) {
        var a = G.animaisData;
        if (z === 'galinha') {
            var qtd = a.galinhas.pronto || 0;
            if (qtd <= 0) { toast('🥚 ' + (window.IdiomasJogo ? IdiomasJogo.msg('semOvos', 'Não há ovos prontos') : 'Não há ovos prontos'), 'war'); return; }
            var ganho = qtd * 55;
            a.galinhas.pronto = 0;
            G.moedas += ganho;
            G.colheitas++;
            ganharXP(Math.floor(ganho / 10));
            if (window.AudioJogo) AudioJogo.sfx('harvest');
            toast('✅ Recolheste +' + ganho + '€ em ovos', 'ok');
        } else if (z === 'vaca') {
            var q2 = a.vacas.pronto || 0;
            if (q2 <= 0) { toast('🥛 ' + (window.IdiomasJogo ? IdiomasJogo.msg('semLeite', 'Não há leite pronto') : 'Não há leite pronto'), 'war'); return; }
            var ganho2 = q2 * 85;
            a.vacas.pronto = 0;
            G.moedas += ganho2;
            G.colheitas++;
            ganharXP(Math.floor(ganho2 / 10));
            if (window.AudioJogo) AudioJogo.sfx('harvest');
            toast('✅ Recolheste +' + ganho2 + '€ em leite', 'ok');
        }
        this.updateHUD();
        guardarJogo();
        for (var x = 0; x < this.aCols; x++) for (var y = 0; y < this.aRows; y++) this.drawTile(x, y);
    }

    update(t, dt) {
        if (!MaquinaEstados.esta(Estado.ANIMAIS)) return;

        if (t >= this._proximoCiclo) {
            this._cicloInicio = t;
            this._proximoCiclo = t + CICLO_MS * multCiclo() * this.animaisCicloMult();
            this.aplicarCiclo();
        }

        var moved = false;
        var saida = this.posSaida();
        var loja = this.posLoja();
        var moveLeft = Phaser.Input.Keyboard.JustDown(this.keys.left) || Phaser.Input.Keyboard.JustDown(this.kA);
        var moveRight = Phaser.Input.Keyboard.JustDown(this.keys.right) || Phaser.Input.Keyboard.JustDown(this.kD);
        var moveUp = Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.kW);
        var moveDown = Phaser.Input.Keyboard.JustDown(this.keys.down) || Phaser.Input.Keyboard.JustDown(this.kS);

        if (moveLeft) {
            if (this.sel.x > 0) { this.sel.x--; this.trDir = { x: -1, y: 0 }; moved = true; }
            else if (this.sel.x === 0 && this.sel.y === saida.y) { this.sel.x = saida.x; this.trDir = { x: -1, y: 0 }; moved = true; }
            else if (this.sel.x === loja.x && this.sel.y === loja.y) { this.sel.x = this.aCols - 1; this.sel.y = 0; this.trDir = { x: -1, y: 0 }; moved = true; }
        }
        if (moveRight) {
            if (this.sel.x === saida.x && this.sel.y === saida.y) { this.sel.x = 0; this.trDir = { x: 1, y: 0 }; moved = true; }
            else if (this.sel.x === this.aCols - 1 && this.sel.y === 0) { this.sel.x = loja.x; this.sel.y = loja.y; this.trDir = { x: 1, y: 0 }; moved = true; }
            else if (this.sel.x < this.aCols - 1) { this.sel.x++; this.trDir = { x: 1, y: 0 }; moved = true; }
        }
        if (moveUp) {
            if (this.sel.x === saida.x) this.sel.x = 0;
            if (this.sel.y > 0) { this.sel.y--; this.trDir = { x: 0, y: -1 }; moved = true; }
        }
        if (moveDown) {
            if (this.sel.x === saida.x) this.sel.x = 0;
            if (this.sel.y < this.aRows - 1) { this.sel.y++; this.trDir = { x: 0, y: 1 }; moved = true; }
        }
        if (this.sel.x === saida.x && this.sel.y !== saida.y) this.sel.x = 0;
        if (this.sel.x === loja.x && this.sel.y !== loja.y) { this.sel.x = this.aCols - 1; this.sel.y = 0; }

        if (moved) {
            for (var x = 0; x < this.aCols; x++) for (var y = 0; y < this.aRows; y++) this.drawTile(x, y);
            this.updateTrator(false);
            if (window.AudioJogo) AudioJogo.sfx('move');
            if (this.ehSaidaSel()) {
                toast('🚜 ' + (window.IdiomasJogo ? IdiomasJogo.t('voltarCampo') : 'De volta ao campo!'), 'ok');
                guardarJogo();
                MaquinaEstados.irCampo(this.game, false);
                return;
            }
            if (this.ehLojaSel()) this.abrirLoja();
            else this.fecharLoja();
        }

        this.updateTrator(false);

        if (Phaser.Input.Keyboard.JustDown(this.kSpace)) {
            if (this.ehLojaSel() || this.ehSaidaSel()) return;
            var an = this.animalNoTile(this.sel.x, this.sel.y);
            if (!an) { this.toastAnimais('Aqui nao ha animais', 'war', 1200, 'sem-animais-aqui'); return; }
            this.alimentarZona(an.tipo);
        }

        if (Phaser.Input.Keyboard.JustDown(this.kR)) {
            if (this.ehLojaSel() || this.ehSaidaSel()) return;
            var z2 = this.tipoZonaSel();
            if (z2) this.recolherZona(z2);
        }
    }
}
