class MenuPausa extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuPausa' });
    }

    create() {
        // 1. Obter o centro exato da câmara dinamicamente
        const larguraJogo = this.cameras.main.width;
        const alturaJogo = this.cameras.main.height;
        const centroX = this.cameras.main.centerX;
        const centroY = this.cameras.main.centerY;

        // 2. Fundo com gradiente escuro, mas com opacidade (0.85) para ver a quinta ao fundo
        let fundo = this.add.graphics();
        fundo.fillGradientStyle(0x0a0f1d, 0x0a0f1d, 0x070a14, 0x070a14, 0.85, 0.85, 0.85, 0.85);
        fundo.fillRect(0, 0, larguraJogo, alturaJogo);

        // 3. Texto de Título de Pausa (Estilo Azul-Ciano do jogo)
        this.add.text(centroX, centroY - 80, 'JOGO PAUSADO', { 
            fontSize: '36px', 
            fill: '#4fc3f7', 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStyle: '900',
            letterSpacing: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Subtítulo com instrução rápida
        this.add.text(centroX, centroY - 30, 'Pressiona ESC para voltar', { 
            fontSize: '14px', 
            fill: '#546e7a', 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 4. Configuração do Botão "CONTINUAR" (Arredondado e Centrado)
        let btnLargura = 220;
        let btnAltura = 50;
        let btnX = centroX;
        let btnY = centroY + 40;

        // Desenhar fundo verde do botão
        let bgBotao = this.add.graphics();
        bgBotao.fillStyle(0x2e7d32, 1);
        bgBotao.fillRoundedRect(btnX - btnLargura/2, btnY - btnAltura/2, btnLargura, btnAltura, 8);

        // Texto do botão
        let textoBotao = this.add.text(btnX, btnY, 'CONTINUAR', { 
            fontSize: '16px', 
            fill: '#ffffff', 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontStyle: 'bold',
            letterSpacing: 1
        }).setOrigin(0.5);

        // Zona interativa para cliques e hovers
        let zonaInterativa = this.add.zone(btnX, btnY, btnLargura, btnAltura)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // --- Efeitos Visuais de Hover ---
        zonaInterativa.on('pointerover', () => {
            bgBotao.clear();
            bgBotao.fillStyle(0x388e3c, 1); // Verde mais claro
            bgBotao.fillRoundedRect(btnX - btnLargura/2, btnY - btnAltura/2, btnLargura, btnAltura, 8);
            textoBotao.setScale(1.05);
        });

        zonaInterativa.on('pointerout', () => {
            bgBotao.clear();
            bgBotao.fillStyle(0x2e7d32, 1); // Verde original
            bgBotao.fillRoundedRect(btnX - btnLargura/2, btnY - btnAltura/2, btnLargura, btnAltura, 8);
            textoBotao.setScale(1);
        });

        // Evento de Clique para fechar a pausa
        zonaInterativa.on('pointerdown', () => {
            this.sair();

        });

        // 5. Configurar novamente a tecla ESC para fechar o menu
        this.teclaEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.teclaEsc)) {
            this.retomar();
        }
    }

    retomar() {
        this.scene.stop('MenuPausa');
        this.scene.resume('CenaQuinta');
    }

    sair() {
        this.scene.stop('MenuPausa');
        this.scene.stop('CenaQuinta');
        this.scene.start('TelaInicio');
    }
}