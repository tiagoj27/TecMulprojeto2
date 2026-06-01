# Quinta Isométrica — Turbo Edition

Jogo de quinta isométrico em Phaser 3 (HTML + JavaScript).

## Como jogar

Abre **`index.html`** no browser (duplo-clique ou servidor local).

> O ficheiro `html.html` antigo redireciona para `index.html`.

## Estrutura do projeto

```
Tecmul2/
├── index.html          # Entrada do jogo
├── html.html           # Redirecionamento (legado)
├── README.md
├── css/
│   └── game.css        # Estilos (toasts, barra de ciclo)
└── js/
    ├── config.js       # Constantes, cores, culturas
    ├── ui.js           # Toasts e popups de moedas
    ├── state.js        # Estado G, economia, loja, save, contratos
    ├── fsm.js          # Máquina de estados campo ↔ loja
    ├── main.js         # Arranque Phaser
    └── scenes/
        ├── CenaQuinta.js   # Campo (trator, plantas)
        └── CenaLoja.js     # Stand / upgrades
```

## Controlo rápido

| Tecla | Campo | Loja |
|-------|-------|------|
| Setas | Mover trator | — |
| Espaço | Semear / colher | — |
| Q | Mudar semente | — |
| U | Adubo | — |
| E | Expandir parcela | — |
| N | Dia seguinte | — |
| P | Ir para o Pomar (se desbloqueado) | — |
| -1,0 | Entrar no Stand (tile fora do grid) | — |
| 1–9 | — | Comprar item |
| ESC / V | — | Sair |
| ◀ SAIR | — | Sair (clique) |

## Progressão

- **Nível da quinta** — XP ao colher; bónus permanente de vendas
- **Contratos** — objectivos diários com prémio em €
- **Conquistas** — marcos com recompensa única
- **Loja** — trator, infraestrutura, estufa, exportador, etc.
- **Economia** — sementes pagas, expansão cara, impostos e ração de galinhas

Gravação automática em `localStorage` (`quintaSave`). Na loja: **🗑️ Reset** apaga a gravação.
