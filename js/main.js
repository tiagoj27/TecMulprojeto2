window.addEventListener('load', function() {
    if (window.AudioJogo) AudioJogo.bindUnlock();
    if (window.IdiomasJogo) IdiomasJogo.atualizarDom();
    atualizarDimensoesJogo();
    MaquinaEstados.mudar(Estado.CAMPO);

    var game = new Phaser.Game({
        type: Phaser.CANVAS,
        width: JOGO_LARGURA,
        height: JOGO_ALTURA,
        render: {
            roundPixels: true
        },
        backgroundColor: '#060d1a',
        parent: 'game-wrapper',
        scene: [TelaInicio, CenaQuinta, CenaPomar, CenaAnimais, CenaLoja, MenuPausa]
    });
    window.game = game;

    function reiniciarCenaAtual() {
        atualizarDimensoesJogo();
        game.scale.resize(JOGO_LARGURA, JOGO_ALTURA);

        var cena = 'CenaQuinta';
        if (MaquinaEstados.esta(Estado.LOJA)) cena = 'CenaLoja';
        else if (MaquinaEstados.esta(Estado.POMAR)) cena = 'CenaPomar';
        else if (MaquinaEstados.esta(Estado.ANIMAIS)) cena = 'CenaAnimais';

        if (game.scene.isActive('MenuPausa')) game.scene.stop('MenuPausa');
        game.scene.start(cena);
    }

    var resizeTimer = null;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(reiniciarCenaAtual, 180);
    });
});
