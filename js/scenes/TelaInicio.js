class TelaInicio extends Phaser.Scene {
    constructor() {
        super({ key: 'TelaInicio' });
    }

    create() {
        var tr = window.IdiomasJogo || { t: function(k) { return k; } };
        const larguraJogo = this.cameras.main.width;
        const alturaJogo = this.cameras.main.height;
        const centroX = this.cameras.main.centerX;
        const centroY = this.cameras.main.centerY;

        let fundo = this.add.graphics();
        fundo.fillGradientStyle(0x0a0f1d, 0x0a0f1d, 0x070a14, 0x070a14, 1);
        fundo.fillRect(0, 0, larguraJogo, alturaJogo);

        this.add.text(centroX, centroY - 120, 'AgroGT ', {
            fontSize: '46px',
            fill: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStyle: '900',
            letterSpacing: 2,
            align: 'center'
        }).setOrigin(0.5);

        let subtitulo = this.add.text(centroX, centroY - 60, tr.t('subtitulo'), {
            fontSize: '22px',
            fill: '#4fc3f7',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStyle: 'bold',
            letterSpacing: 6,
            align: 'center'
        }).setOrigin(0.5);

        let btnLargura = 220;
        let btnAltura = 50;
        let btnX = centroX;
        let btnY = centroY + 60;

        let bgBotao = this.add.graphics();
        bgBotao.fillStyle(0x2e7d32, 1);
        bgBotao.fillRoundedRect(btnX - btnLargura / 2, btnY - btnAltura / 2, btnLargura, btnAltura, 8);

        let textoBotao = this.add.text(btnX, btnY, tr.t('iniciar'), {
            fontSize: '18px',
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
            if (window.AudioJogo) {
                AudioJogo.start();
                AudioJogo.sfx('start');
            }
            this.scene.start('CenaQuinta');
        });

        let creditos = this.add.text(centroX, alturaJogo - 50, tr.t('creditos'), {
            fontSize: '12px',
            fill: '#546e7a',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }).setOrigin(0.5);

        if (window.IdiomasJogo) {
            IdiomasJogo.criarBotao(this, larguraJogo - 96, 42, () => {
                subtitulo.setText(IdiomasJogo.t('subtitulo'));
                textoBotao.setText(IdiomasJogo.t('iniciar'));
                creditos.setText(IdiomasJogo.t('creditos'));
            });
        }
    }
}
