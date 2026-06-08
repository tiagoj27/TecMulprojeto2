window.addEventListener('load', function() {
    if (window.AudioJogo) AudioJogo.bindUnlock();
    if (window.IdiomasJogo) IdiomasJogo.atualizarDom();
    MaquinaEstados.mudar(Estado.CAMPO);
    new Phaser.Game({
        type: Phaser.CANVAS,
        width: 1000,
        height: 750,
        backgroundColor: '#060d1a',
        parent: 'game-wrapper',
        scene: [TelaInicio, CenaQuinta, CenaPomar, CenaAnimais, CenaLoja, MenuPausa]
    });
});
