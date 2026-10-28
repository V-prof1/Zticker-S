# Zticker S

**Zticker S** é um jogo de luta 2D com stickmans feito para navegador, com foco em combate rápido, efeitos fortes e controles que funcionem bem tanto no PC quanto no celular.

## Estado atual

- Arcade: 1 jogador vs CPU
- Versus local para 2 jogadores
- Training Mode
- 4 lutadores: Volt, Rift, Titan e Wraith
- 3 arenas
- Soco, chute, bloqueio, pulo e dash
- Especiais próprios por personagem
- Barra de SUPER
- Combos e contador de dano
- Hitstop, knockback, screen shake e partículas
- CPU com Casual, Normal, Hard e Nightmare
- Controles touch automáticos
- Melhor combo salvo via `localStorage`

## Estrutura

```text
Zticker-S/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ core.js
│  ├─ fighter.js
│  ├─ controls.js
│  ├─ combat.js
│  └─ render.js
├─ README.md
├─ LICENSE
└─ .gitignore
```

## Como rodar

Abra `index.html` em um navegador moderno. Para publicar na web, o projeto pode ser hospedado diretamente com GitHub Pages.

## Próximas etapas

O plano é evoluir a versão web antes do empacotamento mobile: animações mais avançadas, combos direcionais, golpes aéreos, grabs, mais lutadores, bosses, finishers originais, modo arcade expandido, configurações, save e otimização para Android.

## Licença

MIT.
