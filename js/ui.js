// ─── TOAST / POPUP DOM ───────────────────────────────────────────
function toast(msg, tipo, dur) {
    if (window.AudioJogo && tipo === 'err') AudioJogo.sfx('error');
    dur = dur || 2500;
    var c = document.getElementById('toasts');
    var el = document.createElement('div');
    el.className = 'toast ' + (tipo || '');
    el.textContent = msg;
    c.appendChild(el);
    setTimeout(function() {
        el.style.animation = 'tOut 0.3s ease forwards';
        setTimeout(function() { el.remove(); }, 300);
    }, dur);
}

function coinPop(canvas, sx, sy, val) {
    var wrap = document.getElementById('game-wrapper');
    var r = canvas.getBoundingClientRect();
    var wr = wrap.getBoundingClientRect();
    var el = document.createElement('div');
    el.className = 'coin-pop';
    el.textContent = '+' + val + '€';
    el.style.left = (sx + r.left - wr.left) + 'px';
    el.style.top  = (sy + r.top  - wr.top)  + 'px';
    wrap.appendChild(el);
    setTimeout(function() { el.remove(); }, 1000);
}
