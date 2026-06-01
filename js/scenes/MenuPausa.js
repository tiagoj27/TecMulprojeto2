class MenuPausa extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuPausa' });
    }

   create() {
    // Fundo escurecido semi-transparente
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);

    // Texto de Pausa
    this.add.text(400, 200, 'JOGO PAUSADO', { fontSize: '32px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

    // Botão Voltar ao Jogo
    let botaoRetomar = this.add.text(400, 320, 'Continuar (ESC)', { fontSize: '20px', fill: '#000', backgroundColor: '#fff', padding: 10 })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

    botaoRetomar.on('pointerdown', () => {
        this.retomar();
    });

    // Forçar o mapeamento do ESC diretamente nesta cena ativa
    this.teclaEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
}

update() {
    // Se carregar em ESC enquanto o menu está aberto, fecha-o
    if (Phaser.Input.Keyboard.JustDown(this.teclaEsc)) {
        this.retomar();
    }
}

retomar() {
    this.scene.stop('MenuPausa');     // Fecha esta cena de pausa
    this.scene.resume('CenaQuinta');  // Reativa a quinta
}
}