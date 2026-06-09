window.addEventListener('load', function() {
<<<<<<< Updated upstream
    if (window.AudioJogo) AudioJogo.bindUnlock();
    if (window.IdiomasJogo) IdiomasJogo.atualizarDom();
=======
    atualizarDimensoesJogo();
>>>>>>> Stashed changes
    MaquinaEstados.mudar(Estado.CAMPO);
    new Phaser.Game({
    var game = new Phaser.Game({
        type: Phaser.CANVAS,
        width: 1000,
        height: 750,
        width: JOGO_LARGURA,
        height: JOGO_ALTURA,
        render: {
            roundPixels: true
        },
        backgroundColor: '#060d1a',
        parent: 'game-wrapper',
        scene: [TelaInicio, CenaQuinta, CenaPomar, CenaAnimais, CenaLoja, MenuPausa]
    });

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
