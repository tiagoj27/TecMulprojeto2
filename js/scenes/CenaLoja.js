class CenaLoja extends Phaser.Scene {
    constructor() {
        super({ key: 'CenaLoja' });
    }

    sairLoja() {
        if (!MaquinaEstados.esta(Estado.LOJA) || this._aSair) return;
        this._aSair = true;
        if (window.AudioJogo) AudioJogo.sfx('click');
        toast('👋 ' + (window.IdiomasJogo ? IdiomasJogo.t('voltarCampo') : 'De volta ao campo!'), 'ok');
        MaquinaEstados.irCampo(this.game, true);
    }

    comprarIndice(idx) {
        var cat = getCatalogoLoja();
        if (idx < 0 || idx >= cat.length) return;
        if (comprarLojaItem(cat[idx].id)) {
            this.drawLojaLista();
            this.drawTratorLoja();
            this.updateNivel();
            this.updateSaldo();
            this.updateStats();
            if (this.trShow) {
                this.tweens.add({
                    targets: this.trShow, scaleX: 1.1, scaleY: 1.1,
                    duration: 160, yoyo: true, ease: 'Back.easeOut'
                });
            }
        }
    }

    limiteScrollLoja() {
        return Math.max(0, getCatalogoLoja().length * 80 - 420);
    }

    aplicarScrollLoja(delta) {
        var prox = (this._lojaScroll || 0) + delta;
        this._lojaScroll = Phaser.Math.Clamp(prox, 0, this.limiteScrollLoja());
        this.drawLojaLista();
    }

    drawLojaLista() {
        var self = this;
        if (this._lojaCards) {
            this._lojaCards.forEach(function(o) {
                if (o.bg) o.bg.destroy();
                if (o.txt) o.txt.destroy();
                if (o.zone) o.zone.destroy();
            });
        }
        this._lojaCards = [];
        if (this.lojaListaGfx) this.lojaListaGfx.clear();
        else this.lojaListaGfx = this.add.graphics().setDepth(50);

        var cat = getCatalogoLoja();
        var cx = 530, cw = 420, ch = 72, startY = 168;
        var scroll = this._lojaScroll || 0;

        cat.forEach(function(it, i) {
            var y = startY + i * (ch + 8) - scroll;
            if (y < 155 || y > 615) return;
            var nv = nivelLoja(it.id);
            var maxed = nv >= it.max;
            var custo = maxed ? null : custoLojaItem(it);
            var can = custo !== null && G.moedas >= custo;

            var bg = self.add.graphics().setDepth(90);
            bg.fillStyle(maxed ? 0x052e16 : (can ? 0x0c1a2e : 0x1f0808), 0.85);
            bg.fillRoundedRect(cx, y, cw, ch, 8);
            bg.lineStyle(2, maxed ? 0x4ade80 : (can ? 0x38bdf8 : 0xf87171), 0.75);
            bg.strokeRoundedRect(cx, y, cw, ch, 8);

            var num = (i + 1) % 10;
            var nomeItem = window.IdiomasJogo ? IdiomasJogo.itemLoja(it.id, 'nome', it.nome) : it.nome;
            var descItem = window.IdiomasJogo ? IdiomasJogo.itemLoja(it.id, 'desc', it.desc) : it.desc;
            var linha1 = it.emoji + ' ' + nomeItem + (maxed ? ' ✓' : ' — ' + custo + '€');
            var linha2 = descItem + (maxed ? '' : '  [' + num + '] ' + (window.IdiomasJogo ? IdiomasJogo.t('comprar') : 'comprar'));
            var txt = self.add.text(cx + 14, y + ch/2, linha1 + '\n' + linha2, {
                fontFamily: "'Exo 2',sans-serif", fontSize: '12px', fontStyle: 'bold',
                color: maxed ? '#4ade80' : (can ? '#e2e8f0' : '#f87171'), lineSpacing: 4
            }).setOrigin(0, 0.5).setDepth(95);

            var zone = null;
            if (!maxed) {
                zone = self.add.zone(cx + cw/2, y + ch/2, cw, ch)
                    .setInteractive({ useHandCursor: true }).setDepth(96)
                    .on('pointerdown', (function(ii) { return function() { self.comprarIndice(ii); }; })(i));
            }
            self._lojaCards.push({ bg: bg, txt: txt, zone: zone });
        });

        if (this.txtLojaScroll) this.txtLojaScroll.destroy();
        this.txtLojaScroll = this.add.text(740, 628, (window.IdiomasJogo ? IdiomasJogo.t('lojaAjudaScroll') : 'Roda do rato para ver mais · [1-9] comprar'), {
            fontFamily: "'Exo 2',sans-serif", fontSize: '10px', color: '#475569'
        }).setOrigin(0.5).setDepth(100);
    }

    create() {
        if (this.game.canvas) {
            this.game.canvas.setAttribute('tabindex', '1');
            this.game.canvas.focus();
        }
        this._layoutOffsetX = Math.max(0, Math.round((JOGO_LARGURA - 1000) / 2));
        this._layoutOffsetY = Math.max(0, Math.round((JOGO_ALTURA - 750) / 2));
        this.cameras.main.setScroll(-this._layoutOffsetX, -this._layoutOffsetY);

        this._aSair = false;
        MaquinaEstados.mudar(Estado.LOJA);
        this.keys = this.input.keyboard.createCursorKeys();
        this.kT     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.kEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.kSpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.kEsc   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.kVoltar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this._lojaScroll = 0;
        this._lojaCards = [];
        this._teclasNum = [
            Phaser.Input.Keyboard.KeyCodes.ONE, Phaser.Input.Keyboard.KeyCodes.TWO,
            Phaser.Input.Keyboard.KeyCodes.THREE, Phaser.Input.Keyboard.KeyCodes.FOUR,
            Phaser.Input.Keyboard.KeyCodes.FIVE, Phaser.Input.Keyboard.KeyCodes.SIX,
            Phaser.Input.Keyboard.KeyCodes.SEVEN, Phaser.Input.Keyboard.KeyCodes.EIGHT,
            Phaser.Input.Keyboard.KeyCodes.NINE
        ];
        this.kNum = [];
        for (var ki = 0; ki < this._teclasNum.length; ki++) {
            this.kNum.push(this.input.keyboard.addKey(this._teclasNum[ki]));
        }
        this.input.on('wheel', function(pointer, over, dx, dy) {
            this.aplicarScrollLoja(dy * 0.4);
        }, this);
        if (this.game.canvas) {
            var self = this;
            this._wheelDomHandler = function(ev) {
                ev.preventDefault();
                self.aplicarScrollLoja(ev.deltaY * 0.35);
            };
            this.game.canvas.addEventListener('wheel', this._wheelDomHandler, { passive: false });
            this.events.once('shutdown', function() {
                if (this._wheelDomHandler && this.game.canvas) {
                    this.game.canvas.removeEventListener('wheel', this._wheelDomHandler);
                }
                this._wheelDomHandler = null;
            }, this);
        }

        var bg = this.add.graphics();
        var offX = this._layoutOffsetX;
        var offY = this._layoutOffsetY;
        bg.fillGradientStyle(0x0a0f1e, 0x0a0f1e, 0x111827, 0x111827, 1);
        bg.fillRect(-offX, -offY, JOGO_LARGURA, JOGO_ALTURA);

        bg.lineStyle(1, 0x1e293b, 0.4);
        for (var i = -offX; i < JOGO_LARGURA - offX; i += 60) { bg.beginPath(); bg.moveTo(i, -offY); bg.lineTo(i, JOGO_ALTURA - offY); bg.strokePath(); }
        for (var j = -offY; j < JOGO_ALTURA - offY;  j += 60) { bg.beginPath(); bg.moveTo(-offX, j); bg.lineTo(JOGO_LARGURA - offX, j); bg.strokePath(); }

        var glow = this.add.graphics();
        glow.fillGradientStyle(0x0ea5e9, 0x0ea5e9, 0x0a0f1e, 0x0a0f1e, 0.06, 0.06, 0, 0);
        glow.fillRect(-offX, -offY, JOGO_LARGURA, 200 + offY);

        this.add.text(500, 52, (window.IdiomasJogo ? IdiomasJogo.t('standTitulo') : 'STAND DA QUINTA'), {
            fontFamily: "'Press Start 2P',monospace",
            fontSize: '26px', color: '#facc15',
            shadow: { blur: 25, color: '#f97316', fill: true }
        }).setOrigin(0.5);
        this.add.text(500, 90, '— ' + (window.IdiomasJogo ? IdiomasJogo.t('standSubtitulo') : 'a garagem dos campeões') + ' —', {
            fontFamily: "'Exo 2',sans-serif",
            fontSize: '13px', fontStyle: 'italic', color: '#475569'
        }).setOrigin(0.5);

        var saidaGfx = this.add.graphics();
        saidaGfx.fillStyle(0x0e7490, 0.85); saidaGfx.fillRect(0, 280, 72, 150);
        saidaGfx.lineStyle(2, 0x22d3ee, 1);  saidaGfx.strokeRect(0, 280, 72, 150);

        this.btnSair = this.add.text(36, 355, '◀  ' + (window.IdiomasJogo ? IdiomasJogo.t('sair') : 'SAIR'), {
            fontFamily: "'Exo 2',sans-serif", fontSize: '14px', fontStyle: 'bold',
            color: '#22d3ee', backgroundColor: '#0e7490ee',
            padding: { x: 12, y: 10 }
        }).setOrigin(0.5).setDepth(10000)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.sairLoja, this)
            .on('pointerover', function() { this.setStyle({ color: '#facc15' }); }, this)
            .on('pointerout', function() { this.setStyle({ color: '#22d3ee' }); }, this);
        this.tweens.add({ targets: this.btnSair, x: 30, duration: 600, yoyo: true, repeat: -1 });

        var pod = this.add.graphics();
        pod.fillStyle(0x6d28d9, 0.08); pod.fillRoundedRect(130, 130, 320, 420, 16);
        pod.lineStyle(1, 0x7c3aed, 0.4); pod.strokeRoundedRect(130, 130, 320, 420, 16);
        this.add.text(290, 158, '🚜  ' + (window.IdiomasJogo ? IdiomasJogo.t('meuTrator') : 'O MEU TRATOR'), {
            fontFamily: "'Exo 2',sans-serif", fontSize: '13px', fontStyle: 'bold', color: '#a78bfa'
        }).setOrigin(0.5);

        var pPlat = this.add.graphics();
        pPlat.fillStyle(0x1e293b, 1); pPlat.fillEllipse(290, 420, 180, 40);
        pPlat.lineStyle(1, 0x334155, 0.6); pPlat.strokeEllipse(290, 420, 180, 40);

        this.trShow = this.add.container(290, 340);
        this.trGfx = this.add.graphics();
        this.trShow.add(this.trGfx);
        this.drawTratorLoja();
        this.tweens.add({ targets: this.trShow, y: '-=9', duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        this.txtNivel = this.add.text(290, 460, '', {
            fontFamily: "'Exo 2',sans-serif", fontSize: '13px', fontStyle: 'bold',
            color: '#e2e8f0', align: 'center', lineSpacing: 5
        }).setOrigin(0.5);
        this.updateNivel();

        var sp = this.add.graphics();
        sp.fillStyle(0x060d1a, 0.96); sp.fillRoundedRect(510, 120, 460, 620, 16);
        sp.lineStyle(1, 0x1e293b, 0.8); sp.strokeRoundedRect(510, 120, 460, 620, 16);
        sp.lineStyle(2, 0xfacc15, 0.5);
        sp.beginPath(); sp.moveTo(530,160); sp.lineTo(950,160); sp.strokePath();
        this.add.text(740, 140, '🛒  ' + (window.IdiomasJogo ? IdiomasJogo.t('upgradesDisponiveis') : 'UPGRADES DISPONÍVEIS'), {
            fontFamily: "'Exo 2',sans-serif", fontSize: '15px', fontStyle: 'bold', color: '#f8fafc'
        }).setOrigin(0.5);

        this.drawLojaLista();

        var sY = 640;
        sp.lineStyle(1, 0x1e293b, 0.8);
        sp.beginPath(); sp.moveTo(530, sY-10); sp.lineTo(950, sY-10); sp.strokePath();
        this.add.text(740, sY+5, '📊  ' + (window.IdiomasJogo ? IdiomasJogo.t('estatisticas') : 'ESTATÍSTICAS'), {
            fontFamily: "'Exo 2',sans-serif", fontSize: '12px', fontStyle: 'bold', color: '#475569'
        }).setOrigin(0.5);
        this.txtStats = this.add.text(740, sY+28, '', {
            fontFamily: "'Exo 2',sans-serif", fontSize: '13px', color: '#64748b',
            lineSpacing: 7, align: 'center'
        }).setOrigin(0.5);
        this.updateStats();

        var salBg = this.add.graphics().setDepth(999);
        salBg.fillStyle(0x060d1a, 0.92); salBg.lineStyle(1,0xfacc15,0.4);
        salBg.fillRoundedRect(335, 700, 330, 40, 10);
        salBg.strokeRoundedRect(335, 700, 330, 40, 10);
        this.txtSaldo = this.add.text(500, 720, '', {
            fontFamily: "'Exo 2',sans-serif", fontSize: '17px', fontStyle: 'bold',
            color: '#facc15', shadow: { blur: 8, color: '#f97316', fill: true }
        }).setOrigin(0.5).setDepth(1000);
        this.updateSaldo();
        this.add.text(500, 668, (window.IdiomasJogo ? IdiomasJogo.t('lojaAjudaCompra') : '[1-9] comprar  ·  [ESC]/[V]/◀ SAIR'), {
            fontFamily: "'Exo 2',sans-serif", fontSize: '11px', color: '#64748b'
        }).setOrigin(0.5).setDepth(1000);
        this.add.text(880, 22, '🗑️ ' + (window.IdiomasJogo ? IdiomasJogo.t('reset') : 'Reset'), {
            fontFamily: "'Exo 2',sans-serif", fontSize: '11px', color: '#f87171',
            backgroundColor: '#1f0808cc', padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setDepth(10001)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', function() { resetarGravacao(); });
        toast('🛒 ' + (window.IdiomasJogo ? IdiomasJogo.t('standToast') : 'Stand — gasta € em upgrades! [1-9] ou clica'), 'ok', 3500);
    }

    drawTratorLoja() {
        var g = this.trGfx, s = 2.3, x = 0, y = 0;
        var cor = G.nivelTrator === 1 ? 0xef4444 : (G.nivelTrator === 3 ? 0x8b5cf6 : 0xeab308);
        g.clear();
        g.fillStyle(0x000000, 0.18); g.fillEllipse(x, y + 22*s, 55*s, 18);
        g.fillStyle(0x111827, 1);
        g.fillCircle(x-17*s, y+8*s, 13*s); g.fillCircle(x+17*s, y+8*s, 13*s);
        g.fillStyle(0x374151, 1);
        g.fillCircle(x-17*s, y+8*s, 7*s); g.fillCircle(x+17*s, y+8*s, 7*s);
        g.fillStyle(cor, 1);
        g.fillRoundedRect(x-19*s, y-30*s, 38*s, 36*s, 6);
        g.fillStyle(0x22d3ee, 0.92);
        g.fillRoundedRect(x-11*s, y-24*s, 22*s, 13*s, 4);
        g.fillStyle(0xffffff, 0.3);
        g.fillRect(x-9*s, y-22*s, 6*s, 5*s);
        g.fillStyle(0x1f2937, 1);
        g.fillRect(x+10*s, y-42*s, 6*s, 14*s);
        if (G.nivelTrator >= 2) { g.fillStyle(0xf97316,1); g.fillCircle(x+13*s, y-43*s, 6); }
        if (G.nivelTrator >= 3) { g.fillStyle(0x8b5cf6,1); g.fillRect(x-20*s,y-28*s,4*s,10); g.fillRect(x+16*s,y-28*s,4*s,10); }
        if (G.arado && G.aradoAcoplado) {
            g.lineStyle(4, 0x94a3b8, 1);
            g.beginPath(); g.moveTo(x, y+8*s); g.lineTo(x, y+38*s); g.strokePath();
            g.fillStyle(0x475569, 1);
            g.fillTriangle(x-22*s, y+44*s, x, y+30*s, x+22*s, y+44*s);
            g.fillStyle(0xe2e8f0, 0.85);
            g.fillRect(x-24*s, y+43*s, 48*s, 6);
        }
    }

    updateNivel() {
        var tr = window.IdiomasJogo || { t: function(k) { return k; } };
        var nomes = ['—','🔴 CLÁSSICO','🟡 TURBO','🚀 HIPER'];
        this.txtNivel.setText(
            tr.t('trator') + ' ' + G.nivelTrator + ' — ' + (nomes[G.nivelTrator]||'') + '\n' +
            '⭐ ' + tr.t('nivelQuinta') + (G.nivelQuinta||1) + '  ' + tr.t('gasto') + ': ' + (G.totalGasto || 0) + '€'
        );
    }

    updateStats() {
        var tr = window.IdiomasJogo || { t: function(k) { return k; } };
        this.txtStats.setText([
            '🌾 ' + tr.t('colheitas') + ': ' + G.colheitas + '  🗺 ' + tr.t('exp') + ': ' + G.expansoes,
            '💦' + G.aspersores + ' 👨‍🌾' + G.empregados + ' 🐔' + G.galinheiro,
            '🏗️ ' + tr.t('silos') + ':' + G.silos + ' ' + tr.t('celeiro') + ':' + G.celeiroNv + ' ⚡' + G.irradiadores,
            '✨ ' + tr.t('ouro') + ':' + (G.ouroNv||0) + ' 🚢 ' + tr.t('exportador') + ':' + (G.exportador ? tr.t('sim') : tr.t('nao')),
            '⛏️ ' + tr.t('arado') + ':' + (G.arado ? (G.aradoAcoplado ? 'ON' : 'OFF') : tr.t('nao')) + '  ' + tr.t('terrenoMais') + ':' + (G.ampliacoesTerreno || 0),
        ].join('\n'));
    }

    updateSaldo() {
        this.txtSaldo.setText('💰  ' + (window.IdiomasJogo ? IdiomasJogo.t('saldo') : 'Saldo') + ': ' + G.moedas + '€');
    }

    update() {
        if (!MaquinaEstados.esta(Estado.LOJA)) return;

        if (Phaser.Input.Keyboard.JustDown(this.kEsc) ||
            Phaser.Input.Keyboard.JustDown(this.kVoltar)) {
            this.sairLoja();
            return;
        }

        var cat = getCatalogoLoja();
        for (var i = 0; i < this.kNum.length && i < cat.length; i++) {
            if (Phaser.Input.Keyboard.JustDown(this.kNum[i])) {
                this.comprarIndice(i);
                return;
            }
        }
        if (this.keys && this.keys.up && this.keys.up.isDown) this.aplicarScrollLoja(-14);
        if (this.keys && this.keys.down && this.keys.down.isDown) this.aplicarScrollLoja(14);
    }
}
