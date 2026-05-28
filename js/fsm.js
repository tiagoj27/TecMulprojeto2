// ─── MÁQUINA DE ESTADOS (campo ↔ loja) ───────────────────────────
var Estado = { CAMPO: 'campo', LOJA: 'loja' };

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
        this.mudar(Estado.LOJA);
        game.scene.start('CenaLoja');
    },

    irCampo: function(game, fromShop) {
        if (this.atual === Estado.CAMPO) return;
        this.mudar(Estado.CAMPO);
        if (game.scene.isActive('CenaLoja')) game.scene.stop('CenaLoja');
        game.scene.start('CenaQuinta', { fromShop: !!fromShop });
    }
};
