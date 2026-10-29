# Zticker S

**Zticker S** é um jogo de luta 2D com stickmans feito para navegador, com foco em combate rápido, leitura clara, animações fluidas e controles pensados para PC e mobile em tela horizontal.

## Combate atual

- Arcade: 1 jogador vs CPU
- Versus local para 2 jogadores
- Training Mode
- 4 lutadores: Volt, Rift, Titan e Wraith
- 3 arenas
- Jogo bloqueado em orientação horizontal no mobile
- Sistema de poses interpoladas para animações mais fluidas
- Combo buffer e cancelamento entre golpes
- Cadeia M1 com 4 estágios
- Cadeia M2 pesada
- Rotas mistas M1/M2
- Ataques aéreos próprios para M1 e M2
- Perfect Guard
- Barra de guarda quebrável
- Reversal/counter com M1 ou M2 após bloquear
- Especiais próprios por personagem
- Barra de SUPER
- Hitstop, knockback, launchers, screen shake, afterimages, partículas e efeitos de impacto
- CPU com Casual, Normal, Hard e Nightmare
- Controles touch próprios para horizontal
- Melhor combo salvo via `localStorage`

## Rotas principais

- `M1 > M1 > M1 > M1` → Dragon Breaker
- `M2 > M2 > M2` → Nova Spin
- `M1 > M1 > M2` → Thunder Knee
- `M1 > M2 > M1` → Cursed Palm
- `M2 > M1 > M2` → Heaven Axe
- `Guard > M1` → Zero Frame Counter
- `Guard > M2` → Reversal Kick

## Controles PC

### Player 1
- `A / D`: movimento
- `W`: pulo
- `S`: guarda
- `J`: M1
- `K`: M2
- `L`: especial
- `Shift`: dash
- `Espaço`: SUPER

### Player 2
- Setas: movimento / pulo / guarda
- `U`: M1
- `I`: M2
- `O`: especial
- `0`: dash
- `P`: SUPER

## Estrutura

```text
Zticker-S/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ core.js
│  ├─ animation.js
│  ├─ fighter.js
│  ├─ controls.js
│  ├─ combat.js
│  └─ render.js
├─ README.md
├─ LICENSE
└─ .gitignore
```

## Como rodar

Abra `index.html` em um navegador moderno. No celular, use a orientação horizontal. Quando o navegador permitir, o jogo tenta entrar em fullscreen e solicitar `landscape`; em navegadores que não suportam bloqueio de orientação, uma tela impede o jogo em retrato.

## Próximas etapas

Grabs, parry ofensivo, ataques direcionais, wall bounce, ground bounce, mais personagens, bosses, finishers originais, arcade expandido, tela de configurações, save e empacotamento Android.

## Licença

MIT.
