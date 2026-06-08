// ─── MÁQUINA DE ESTADOS (campo ↔ loja ↔ pomar) ───────────────────
var Estado = { CAMPO: 'campo', LOJA: 'loja', POMAR: 'pomar', ANIMAIS: 'animais' };

var MaquinaEstados = {
    atual: Estado.CAMPO,

    mudar: function(novo) {
        this.atual = novo;
        var grow = document.getElementById('growbar');
        if (grow) grow.style.display = (novo === Estado.CAMPO) ? 'flex' : 'none';
    },

    esta: function(e) { return this.atual === e; },
    podeConduzir: function() { return this.atual === Estado.CAMPO; },

    irLoja: function(game) {
        if (this.atual === Estado.LOJA) return;
        if (window.AudioJogo) AudioJogo.sfx('transition');
        this.mudar(Estado.LOJA);
        game.scene.start('CenaLoja');
    },

    irCampo: function(game, fromShop) {
        if (this.atual === Estado.CAMPO) return;
        if (window.AudioJogo) AudioJogo.sfx('transition');
        this.mudar(Estado.CAMPO);
        if (game.scene.isActive('CenaLoja')) game.scene.stop('CenaLoja');
        if (game.scene.isActive('CenaPomar')) game.scene.stop('CenaPomar');
        if (game.scene.isActive('CenaAnimais')) game.scene.stop('CenaAnimais');
        game.scene.start('CenaQuinta', { fromShop: !!fromShop });
    },

    irPomar: function(game) {
        if (this.atual === Estado.POMAR) return;
        if (window.AudioJogo) AudioJogo.sfx('transition');
        this.mudar(Estado.POMAR);
        if (game.scene.isActive('CenaLoja')) game.scene.stop('CenaLoja');
        game.scene.start('CenaPomar');
    },

    irAnimais: function(game) {
        if (this.atual === Estado.ANIMAIS) return;
        if (window.AudioJogo) AudioJogo.sfx('transition');
        this.mudar(Estado.ANIMAIS);
        if (game.scene.isActive('CenaLoja')) game.scene.stop('CenaLoja');
        if (game.scene.isActive('CenaPomar')) game.scene.stop('CenaPomar');
        game.scene.start('CenaAnimais');
    }
};
