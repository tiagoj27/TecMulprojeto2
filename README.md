# AgroGT — Quinta Isométrica Turbo Edition

Jogo de gestão de quinta isométrica desenvolvido em **HTML, CSS e JavaScript** com **Phaser 3**.

## Elementos do grupo

| Nome | Número |
|------|--------|
| Gonçalo Brito Rodrigues | A preencher |
| Tiago Amorim Jácome | A preencher |

> Os números devem ser substituídos pelos números oficiais de aluno antes da entrega.

## Versão de Phaser

- **Versão usada:** Phaser **3.60.0**
- **Forma de inclusão:** ficheiro local `phaser.min.js`, carregado diretamente no `index.html`
- **Instalação por npm:** não é necessária
- **CDN:** não é usada para Phaser

## Descrição do jogo

**AgroGT** é um jogo de simulação/gestão agrícola em perspetiva isométrica. O jogador controla um trator, cultiva parcelas, ganha dinheiro com colheitas e usa esse dinheiro para expandir a quinta e comprar melhorias.

O objetivo é evoluir a quinta: desbloquear terreno, melhorar o trator, cumprir missões e contratos, abrir novas zonas como o pomar e a área de animais, e aumentar o rendimento diário.

Funcionalidades implementadas:

- Campo principal isométrico com grelha de cultivo **10x10**
- Movimento do trator por teclado
- Sistema de culturas com custos de plantação, tempos de crescimento e valores de venda
- Sementes desbloqueáveis, incluindo culturas de campo, estufa e pomar
- Rega, adubo, arado e crescimento por ciclos
- Loja/stand com upgrades: trator, arado, terreno, aspersores, silos, empregados, estufa, celeiro, exportador, pomar e animais
- Pomar desbloqueável com árvores/culturas grandes em grelha própria
- Área de animais com galinhas e vacas, alimentação, ovos e leite
- Missões, contratos diários, conquistas, XP e nível da quinta
- Economia com impostos, ração de galinhas, rendimento diário e bónus de venda
- Ecrã inicial, menu de pausa e interface com toasts/popups
- Sistema de idiomas em PT, EN, ES e FR
- Gravação automática no `localStorage` com a chave `quintaSave`

## Jogabilidade e controlos

### Controlos gerais

| Tecla / ação | Função |
|--------------|--------|
| Clique no botão inicial | Começar o jogo |
| Botão de idioma | Alternar idioma |
| ESC no campo | Abrir menu de pausa |
| ESC no menu de pausa | Continuar |

### Campo principal

| Tecla / ação | Função |
|--------------|--------|
| Setas ou WASD | Mover o trator |
| Espaço | Semear ou colher na parcela atual |
| Espaço pressionado com arado acoplado | Arar/plantar em sequência |
| Q | Trocar a semente ativa |
| R | Regar |
| U | Aplicar adubo |
| E | Expandir parcela bloqueada |
| C | Acoplar/desacoplar arado |
| M | Mover aspersor |
| N | Passar para o dia seguinte |
| P | Ir para o pomar, se estiver desbloqueado |
| Entrar no tile do stand | Abrir a loja |
| Entrar no tile do pomar | Abrir o pomar, se estiver desbloqueado |
| Entrar no tile dos animais | Abrir a área de animais, se estiver desbloqueada |

### Loja / stand

| Tecla / ação | Função |
|--------------|--------|
| 1-9 | Comprar o item correspondente da lista visível |
| Setas cima/baixo ou roda do rato | Percorrer a lista de upgrades |
| Clique num item | Comprar item |
| ESC ou V | Sair da loja |
| Botão "SAIR" | Voltar ao campo |
| Botão "Reset" | Apagar a gravação local |

### Pomar

| Tecla / ação | Função |
|--------------|--------|
| Setas ou WASD | Mover seleção/trator |
| Espaço | Plantar ou colher árvores/culturas do pomar |
| Q | Trocar cultura do pomar |
| Tile "QUINTA" | Voltar ao campo |

### Animais

| Tecla / ação | Função |
|--------------|--------|
| Setas ou WASD | Mover seleção/trator |
| Espaço | Alimentar animais na zona selecionada |
| R | Recolher ovos ou leite |
| Tile "LOJA" | Abrir loja dos animais |
| Clique nos botões da loja dos animais | Comprar galinhas ou vacas |
| Tile "QUINTA" | Voltar ao campo |

## Como executar

Não é preciso instalar dependências.

### Opção 1 — Abrir diretamente

Abre o ficheiro `index.html` no browser com duplo-clique.

### Opção 2 — Usar servidor local

Se o browser bloquear algum recurso local, abre a pasta do projeto com Live Server ou executa:

```bash
npx serve .
```

Depois abre o endereço indicado no terminal e entra em `index.html`.

## Estrutura do projeto

```text
TecMulprojeto2/
├── index.html              # Entrada principal do jogo
├── teste.html              # Protótipo/teste antigo do trator 3D
├── phaser.min.js           # Phaser 3.60.0 incluído localmente
├── README.md
├── assets/
│   ├── bg_quinta.png       # Fundo principal usado no campo
│   ├── bg_quintaD.png      # Fundo alternativo/local
│   └── bg_quintas.png      # Fundo alternativo/local
├── css/
│   └── game.css            # Estilos da página, toasts e barra de ciclo
└── js/
    ├── audio.js            # Música e efeitos sonoros gerados por Web Audio
    ├── config.js           # Constantes, dimensões, cores e culturas
    ├── fsm.js              # Máquina de estados: campo, loja, pomar e animais
    ├── i18n.js             # Textos e troca de idioma
    ├── main.js             # Arranque do Phaser e resize
    ├── state.js            # Estado global, economia, loja, save, missões e contratos
    ├── ui.js               # Toasts e popups de moedas
    └── scenes/
        ├── CenaAnimais.js  # Área de animais
        ├── CenaLoja.js     # Stand/upgrades
        ├── CenaPomar.js    # Pomar
        ├── CenaQuinta.js   # Campo principal
        ├── MenuPausa.js    # Menu de pausa
        └── TelaInicio.js   # Ecrã inicial
```

## Aspectos multimédia

| Recurso | Formato / origem | Resolução / tamanho | Utilização |
|---------|------------------|---------------------|------------|
| `assets/bg_quinta.png` | PNG local | 3024x1376, cerca de 7.1 MB | Fundo principal do campo |
| `assets/bg_quintaD.png` | PNG local | 3024x1376, cerca de 6.1 MB | Fundo alternativo/local |
| `assets/bg_quintas.png` | PNG local | 1000x750, cerca de 830 KB | Fundo alternativo/local |
| Trator, parcelas, culturas, animais e UI | Desenho procedural com Phaser Graphics e texto/emoji | Gerado em tempo real | Evita spritesheets e permite escalar com a resolução |
| Sons e música | Web Audio API em `js/audio.js` | Gerado em tempo real | Efeitos de clique, plantação, colheita, água, compra, transição e música simples |
| Fonte visual | Google Fonts, família Exo 2 | Carregada no `index.html` | Texto da interface |

O jogo não usa spritesheets nem ficheiros de áudio externos. A maior parte dos elementos visuais é desenhada por código, o que reduz a quantidade de assets e facilita alterações rápidas ao estilo.

## Roadmap e lacunas conhecidas

- Preencher os nomes completos e números oficiais dos elementos do grupo.
- Não há `package.json`, porque o projeto é executado diretamente no browser.
- Não foram incluídas capturas de ecrã ou GIF no repositório.
- GitHub Pages ainda não está indicado neste README; se for ativado, adicionar aqui o link público.
