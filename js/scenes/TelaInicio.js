class TelaInicio extends Phaser.Scene {
    constructor() {
        super({ key: 'TelaInicio' });
    }

    create() {
    // 1. Obter o centro exato da câmara e do jogo dinamicamente
    const larguraJogo = this.cameras.main.width;
    const alturaJogo = this.cameras.main.height;
    const centroX = this.cameras.main.centerX;
    const centroY = this.cameras.main.centerY;

    // 2. Criar o fundo com gradiente ocupando o tamanho total dinâmico
    let fundo = this.add.graphics();
    fundo.fillGradientStyle(0x0a0f1d, 0x0a0f1d, 0x070a14, 0x070a14, 1);
    fundo.fillRect(0, 0, larguraJogo, alturaJogo);

    // 3. Título Principal centrado dinamicamente
    let titulo = this.add.text(centroX, centroY - 120, 'QUINTA ISOMÉTRICA', { 
        fontSize: '46px', 
        fill: '#ffffff', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontStyle: '900',
        letterSpacing: 2,
        align: 'center'
    }).setOrigin(0.5);

    // Subtítulo centrado dinamicamente
    let subtitulo = this.add.text(centroX, centroY - 60, 'TURBO EDITION', { 
        fontSize: '22px', 
        fill: '#4fc3f7', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontStyle: 'bold',
        letterSpacing: 6,
        align: 'center'
    }).setOrigin(0.5);

    // 4. Estilização do Botão de Início (Posicionado com base no centro dinâmico)
    let btnLargura = 220;
    let btnAltura = 50;
    let btnX = centroX;
    let btnY = centroY + 60; // Desce 60 pixeis a partir do centro do ecrã

    // Desenhar o fundo do botão com cantos arredondados
    let bgBotao = this.add.graphics();
    bgBotao.fillStyle(0x2e7d32, 1);
    bgBotao.fillRoundedRect(btnX - btnLargura/2, btnY - btnAltura/2, btnLargura, btnAltura, 8);

    // Texto por cima do fundo do botão
    let textoBotao = this.add.text(btnX, btnY, 'INICIAR JOGO', { 
        fontSize: '18px', 
        fill: '#ffffff', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontStyle: 'bold',
        letterSpacing: 1
    }).setOrigin(0.5);

    // Criar a zona invisível interativa por cima do botão
    let zonaInterativa = this.add.zone(btnX, btnY, btnLargura, btnAltura)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

    // --- Efeitos Visuais (Hover) ---
    zonaInterativa.on('pointerover', () => {
        bgBotao.clear();
        bgBotao.fillStyle(0x388e3c, 1); // Verde mais claro
        bgBotao.fillRoundedRect(btnX - btnLargura/2, btnY - btnAltura/2, btnLargura, btnAltura, 8);
        textoBotao.setScale(1.05);
    });

    zonaInterativa.on('pointerout', () => {
        bgBotao.clear();
        bgBotao.fillStyle(0x2e7d32, 1);
        bgBotao.fillRoundedRect(btnX - btnLargura/2, btnY - btnAltura/2, btnLargura, btnAltura, 8);
        textoBotao.setScale(1);
    });

    // Clique: Arranca o jogo principal
    zonaInterativa.on('pointerdown', () => {
        this.scene.start('CenaQuinta');
    });

    // 5. Rodapé de Créditos discreto alinhado ao fundo do ecrã
    this.add.text(centroX, alturaJogo - 50, 'Desenvolvido para Tecnologias Multimédia II', { 
        fontSize: '12px', 
        fill: '#546e7a',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    }).setOrigin(0.5);
    }
}