class MenuPausa extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuPausa' });
    }

    create() {
        // Fundo escurecido transparente para dar efeito de pausa
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);

        this.add.text(400, 220, 'JOGO PAUSADO', { fontSize: '32px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        // Botão Retomar
        let botaoRetomar = this.add.text(400, 320, 'Continuar (ESC)', { fontSize: '20px', fill: '#000', backgroundColor: '#fff', padding: 10 })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        botaoRetomar.on('pointerdown', () => {
            this.retomar();
        });

        // Configurar a tecla ESC para fechar a pausa também
        this.teclaEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.teclaEsc)) {
            this.retomar();
        }
    }

    retomar() {
        this.scene.stop();
        this.scene.resume('CenaQuinta'); // Despausa o jogo principal
    }
}