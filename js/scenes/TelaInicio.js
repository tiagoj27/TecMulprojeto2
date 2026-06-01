class TelaInicio extends Phaser.Scene {
    constructor() {
        super({ key: 'TelaInicio' }); // Define a chave desta cena
    }

    create() {
        // Fundo ou Título do Jogo
        this.add.text(400, 200, 'QUINTA ISOMÉTRICA\nTurbo Edition', { 
            fontSize: '42px', 
            fill: '#fff', 
            align: 'center',
            fontStyle: 'bold' 
        }).setOrigin(0.5);

        // Botão Jogar
        let botaoJogar = this.add.text(400, 400, 'INICIAR JOGO', { 
            fontSize: '24px', 
            fill: '#fff', 
            backgroundColor: '#2e7d32', // Verde
            padding: { x: 20, y: 10 } 
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // Quando clicar, avança para a cena principal(CenaQuinta)
        botaoJogar.on('pointerdown', () => {
            this.scene.start('CenaQuinta'); 
        });
    }
}