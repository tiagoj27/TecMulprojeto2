class MenuPausa extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuPausa' });
    }

    create() {
        var tr = window.IdiomasJogo || { t: function(k) { return k; } };
        const larguraJogo = this.cameras.main.width;
        const alturaJogo = this.cameras.main.height;
        const centroX = this.cameras.main.centerX;
        const centroY = this.cameras.main.centerY;

        let fundo = this.add.graphics();
        fundo.fillGradientStyle(0x0a0f1d, 0x0a0f1d, 0x070a14, 0x070a14, 0.85, 0.85, 0.85, 0.85);
        fundo.fillRect(0, 0, larguraJogo, alturaJogo);

        let tituloPausa = this.add.text(centroX, centroY - 80, tr.t('pausaTitulo'), {
            fontSize: '36px',
            fill: '#4fc3f7',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStyle: '900',
            letterSpacing: 4,
            align: 'center'
        }).setOrigin(0.5);

        let hintPausa = this.add.text(centroX, centroY - 30, tr.t('pausaHint'), {
            fontSize: '14px',
            fill: '#546e7a',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        let btnLargura = 220;
        let btnAltura = 50;
        let btnX = centroX;
        let btnY = centroY + 40;

        let bgBotao = this.add.graphics();
        bgBotao.fillStyle(0x2e7d32, 1);
        bgBotao.fillRoundedRect(btnX - btnLargura / 2, btnY - btnAltura / 2, btnLargura, btnAltura, 8);

        let textoBotao = this.add.text(btnX, btnY, tr.t('continuar'), {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStyle: 'bold',
            letterSpacing: 1
        }).setOrigin(0.5);

        let zonaInterativa = this.add.zone(btnX, btnY, btnLargura, btnAltura)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        zonaInterativa.on('pointerover', () => {
            bgBotao.clear();
            bgBotao.fillStyle(0x388e3c, 1);
            bgBotao.fillRoundedRect(btnX - btnLargura / 2, btnY - btnAltura / 2, btnLargura, btnAltura, 8);
            textoBotao.setScale(1.05);
        });

        zonaInterativa.on('pointerout', () => {
            bgBotao.clear();
            bgBotao.fillStyle(0x2e7d32, 1);
            bgBotao.fillRoundedRect(btnX - btnLargura / 2, btnY - btnAltura / 2, btnLargura, btnAltura, 8);
            textoBotao.setScale(1);
        });

        zonaInterativa.on('pointerdown', () => {
            if (window.AudioJogo) AudioJogo.sfx('click');
            this.sair();
        });

        if (window.IdiomasJogo) {
            IdiomasJogo.criarBotao(this, larguraJogo - 96, 42, () => {
                tituloPausa.setText(IdiomasJogo.t('pausaTitulo'));
                hintPausa.setText(IdiomasJogo.t('pausaHint'));
                textoBotao.setText(IdiomasJogo.t('continuar'));
            });
        }

        this.teclaEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.teclaEsc)) {
            this.retomar();
        }
    }

    retomar() {
        if (window.AudioJogo) AudioJogo.sfx('click');
        this.scene.stop('MenuPausa');
        this.scene.resume('CenaQuinta');
    }

    sair() {
        if (window.AudioJogo) AudioJogo.sfx('transition');
        this.scene.stop('MenuPausa');
        this.scene.stop('CenaQuinta');
        this.scene.start('TelaInicio');
    }
}
