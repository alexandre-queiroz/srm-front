# SRM Asset — Design System

> **Capital em movimento.** Sistema de design para os produtos digitais da SRM Asset — gestora de fundos FIDC com plataforma web de antecipação de recebíveis (duplicatas) para cedentes e investidores.

---

## Index

| File / folder           | What's inside                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `README.md`             | This file — context, content fundamentals, visual foundations, iconography                                |
| `SKILL.md`              | Agent-skill manifest so this system can be invoked as a Claude Skill                                      |
| `colors_and_type.css`   | All design tokens — colors, typography, spacing, radii, shadows, motion                                   |
| `assets/`               | Logos (icon + full-typography), color swatches, brand artifacts                                           |
| `preview/`              | One HTML card per token group, registered in the Design System tab                                        |
| `ui_kits/srm-platform/` | High-fidelity recreation of the SRM web platform (login, dashboard, antecipação flow, FIDC investor view) |

---

## 1. Company & product context

**SRM Asset** (or simply _SRM_) is a Brazilian asset-management firm with **17+ anos de mercado**, gerindo fundos FIDC (Fundos de Investimento em Direitos Creditórios). The company operates a digital platform that connects two sides:

- **Cedentes** — empresas que vendem suas duplicatas/recebíveis para antecipar capital de giro.
- **Investidores** — cotistas dos FIDCs que financiam essas operações.

Operating numbers referenced publicly: **~R$ 2 bilhões/ano** em operações de crédito, **2.500+ clientes ativos**, escritórios em São Paulo, Belo Horizonte e Belém. The tagline **"Capital em movimento, simples assim"** anchors the brand voice.

The system covers **one primary digital surface**: the web platform (used by both cedentes and investidores via different role-based views). There is also a marketing site (srm.com.br), but the focus of this kit is the operating platform.

### Sources used to build this system

- **Brand kit**: `uploads/logo.png` (hexagon icon mark) + `uploads/logo-typografy.png` (full lockup with "Capital em movimento" tagline).
- **GitHub repo**: `alexandre-queiroz/srm-front` — referenced as `@ docs (design-system/ subtree)`. **CAVEAT:** the `docs` branch and `design-system/` folder do not exist at time of writing (only an empty `main` branch with a placeholder README). All system definitions below were inferred from the brief, the logos, and Brazilian FIDC fintech conventions. **Please re-attach the codebase if a real design-system subtree exists somewhere** — components, color tokens, and typography choices may need to be reconciled.
- **Brief constraints** (from the user): white as primary surface; blue `#2461AF` and orange `#D45200` as accents (never as dominant background); typography with strong tabular numerals; WCAG AA contrast required on all pairs.

---

## 2. Content fundamentals

### Language

**Portuguese (pt-BR) is the default.** All UI labels, error messages, and marketing copy are written in Brazilian Portuguese. English is only used for technical/code identifiers (variable names, API responses, integration logs).

### Voice

- **Institucional, próximo, direto.** SRM is a regulated asset manager — copy stays factual and confident, never casual or "startup-y", but also never cold or jargon-heavy. Think _Itaú Empresas_ meets _Nubank Negócios_ — sober, but readable.
- **Verbo no infinitivo para CTAs** when the action is contextual (`Antecipar duplicata`, `Aprovar operação`, `Baixar extrato`). Imperative ("Antecipe agora") only on marketing surfaces.
- **Pronome de tratamento**: avoid "você" in pure UI labels; use neutral nominalizations (`Suas operações`, `Seu portfólio`). In help text and onboarding, "você" is fine and warmer.
- **First-person plural ("nós") in marketing & legal**: "Operamos com o aval da CVM", "Nossa carteira hoje gira R$ 2 bilhões/ano". Never first-person singular.

### Casing

- **Sentence case** for buttons, menu items, page titles: `Nova antecipação`, `Painel do cedente`, `Configurações da empresa`.
- **UPPERCASE** reserved for eyebrows, statuses (`PAGO`, `EM ANÁLISE`), and the brand tagline.
- Avoid Title Case Of Every Word — looks like English UI translated literally.

### Numbers & money

**Always pt-BR locale.** This is non-negotiable for a financial product:

- Decimal separator: comma. Thousands: period. `R$ 1.234.567,89`.
- Datas: `12/05/2026` ou `12 mai 2026` (mês abreviado, lowercase, no period: `jan`, `fev`, `mar`, `abr`, `mai`, `jun`, `jul`, `ago`, `set`, `out`, `nov`, `dez`).
- Percentual: `7,25% a.m.` ou `12,40% a.a.` — sempre com o ponto de virada.
- Tabular numerals (`font-variant-numeric: tabular-nums`) are mandatory anywhere numbers appear in lists, tables, or aligned columns. The base `body` style already turns this on.

### Tone examples (real-feel copy)

| Surface        | Don't write                                 | Write                                                                                |
| -------------- | ------------------------------------------- | ------------------------------------------------------------------------------------ |
| Empty state    | "Ops! Nada por aqui ainda 😅"               | "Nenhuma operação ainda. Quando você enviar a primeira duplicata, ela aparece aqui." |
| Success toast  | "Tudo certo! Você arrasou!"                 | "Antecipação enviada. Você recebe a confirmação em até 1 dia útil."                  |
| Error          | "Algo deu errado :("                        | "Não foi possível enviar a duplicata. Verifique o número e tente novamente."         |
| CTA primário   | "Bora antecipar!"                           | "Antecipar duplicata"                                                                |
| Marketing hero | "A melhor plataforma de crédito do Brasil!" | "Antecipe duplicatas em até 1 hora. SRM — capital em movimento."                     |

### Emoji

**Não.** Não usar emoji em UI da plataforma ou copy institucional. Em ambientes informais (e-mails internos, mensagens de suporte mais descontraídas) podem aparecer com moderação, mas a regra geral é: **nenhum emoji em produto, marketing ou comunicação financeira**. Ícones SVG cobrem os casos onde um símbolo seria útil.

### Date/number quick examples

- `R$ 12.430,50` (currency)
- `0,98%` (taxa)
- `28 abr 2026` ou `28/04/2026` (datas)
- `CNPJ 12.345.678/0001-90` (sempre formatado)
- `Boleto Nº 000.182-3` (Nº maiúsculo, ponto separador)

---

## 3. Visual foundations

### Color philosophy

**Branco como protagonista.** A superfície dominante é sempre `#FFFFFF` (ou o quase-branco `--bg-canvas` `#FAFBFC`). O **Azul SRM `#2461AF`** e o **Laranja SRM `#D45200`** entram **como acentos** — nunca como fundo de página inteira, hero gigante ou block colored cards. Eles aparecem em botões primários, links, ícones-chave, valores em destaque, headers de tabela em estado ativo, e barras/badges de status.

**Hierarquia de uso de cor**:

1. **Branco/quase-branco** — 70-80% da tela.
2. **Neutros frios** (`--srm-neutral-*`) — bordas, texto, dividers, sunken wells. ~15-20%.
3. **Azul SRM** — ações primárias, navegação ativa, dados em destaque. ~5-8%.
4. **Laranja SRM** — destaques pontuais (callouts, "novo", KPIs de movimento de capital, ícones de ação secundária). ~1-3%.

Cores semânticas (verde sucesso, amarelo aviso, vermelho perigo) vivem fora dessa paleta e seguem WCAG AA.

### Typography

**Geist Sans** + **Geist Mono** (via Google Fonts). Geometric mas humanista, leitura excelente em telas densas de dados, e suporte nativo a tabular numerals — exatamente o que uma plataforma financeira precisa.

- **Display** (heroes, KPIs grandes): Geist 600, tracking levemente negativo.
- **Headings**: Geist 600.
- **Body**: Geist 400.
- **Numbers em tabelas**: Geist Sans com `font-variant-numeric: tabular-nums lining-nums` — já aplicado globalmente via `body`. Para alinhamento absoluto em listas verticais (saldos, parcelas), usar a classe `.t-num-mono` que troca para Geist Mono.

**Substitution flag:** Se a SRM tiver uma fonte proprietária ou licenciada (ex.: alguma família contratada), troque `--font-sans` e `--font-mono` em `colors_and_type.css`. Geist foi escolhido como o substituto neutro mais próximo do espírito visual da marca (geométrico, técnico, confiável). **Confirme com o time de marca se Geist é aceitável ou se há outra fonte oficial a usar.**

### Spacing

Grid de **4px**. Tokens vão de `--space-1` (4px) a `--space-32` (128px). Em UI densa de dados (tabelas, sidebars, forms compostos) o ritmo dominante é 8/16/24. Em surfaces marketing, 24/48/96.

### Backgrounds

- **Sólido** é a regra. Branco, quase-branco (`--bg-canvas`), neutros sutis.
- **Gradientes**: usados _com extrema parcimônia_. Apenas em UM lugar — hero da plataforma logada (uma faixa diagonal sutil azul-900 → azul-700 atrás do welcome card), e na splash/login. Nada de gradientes bluish-purple ou orange-pink genéricos.
- **Sem imagens full-bleed** dentro da plataforma. O marketing site pode ter imagens corporativas (escritório, equipe, infográficos), sempre com tratamento de cor neutro a frio, sem grain forçado.
- **Sem texturas, ruído ou padrões repetitivos.**
- **Hexágono geométrico do logo** pode aparecer como elemento decorativo discreto em telas vazias (ícone grande em `--srm-blue-100`), nunca como marca-d'água sobre conteúdo.

### Borders

Tudo borda fina, **1px sólida**, cor `--border-subtle` (cards, dividers de tabela) ou `--border-default` (inputs, botões secundários). Nada de bordas grossas decorativas. Nada de borda colorida só à esquerda (anti-pattern AI-slop).

### Shadows

Sistema único de elevação, **sombras suaves e baixas em rgba(11, 29, 56, ...)** — derivam do azul-950 para ficarem harmoniosas com o azul da marca, evitando o cinza "padrão". Cinco níveis (`--shadow-xs` a `--shadow-xl`). Cards de produto geralmente usam `--shadow-sm`; modais usam `--shadow-xl`. **Sem inner-shadow** exceto em wells de input pressionados. **Sem glow effects.**

### Hover, focus, press

- **Hover (botão primário azul)**: escurece para `--srm-blue-600`. Transition 160ms `ease-standard`.
- **Hover (botão ghost / link)**: fundo `--action-ghost-hover` (cinza 50). Cor do texto vai para `--fg-brand-strong`.
- **Press**: escurece um passo a mais (`--srm-blue-700`), sem encolher (`transform: scale`) — a plataforma é institucional, não brinca de squish.
- **Focus**: ring 3px `rgba(36,97,175,0.35)`. Visível em todos os elementos interativos. **Nunca remover outline** — acessibilidade obrigatória.
- **Disabled**: opacidade 60% + cursor `not-allowed` + perde sombra.

### Motion

- **Easing default**: `cubic-bezier(0.2, 0, 0, 1)` — começa rápido, desacelera com calma. Sensação institucional, sem ricochete.
- **Durations**: 80ms (instant — toggle), 160ms (fast — hover), 220ms (base — modal in), 320ms (slow — page transition).
- **Sem bounce, sem overshoot.** Spring physics agressivas não combinam com gestora de FIDC.
- **Fade-up + fade-in** são os entrance patterns padrão. Modais escalam de 0.98 → 1 com fade.
- **Loading**: skeleton blocks com shimmer suave em `--srm-neutral-100` ↔ `--srm-neutral-50`, 1.2s loop.

### Layout rules

- **Header fixo** no topo da plataforma (`--header-h: 64px`), sombra `--shadow-xs` quando há scroll.
- **Sidebar** à esquerda, 248px expandida / 64px colapsada. Sempre visível em desktop; vira drawer no mobile.
- **Content max-width** depende do contexto: dashboards usam `--container-app` (1280px) com sidebar; listagens largas podem ir até `--container-wide`; texto puro fica em `--container-prose` (860px).
- **Tabelas financeiras**: sticky header, zebra stripes sutis (linha alternada em `--bg-surface-alt`), última coluna numérica alinhada à direita com tabular nums.

### Transparency & blur

**Quase nunca.** Não temos vidro fosco aqui. Única exceção: overlay de modal (`rgba(11, 29, 56, 0.5)` com `backdrop-filter: blur(2px)` sutil).

### Corner radii

Conservador e geométrico — espelha o hexágono do logo.

- `2px` ícones pequenos, badges.
- `6px` botões e inputs (default).
- `10px` cards.
- `14px` modais, hero cards.
- `999px` pills (status badges, avatares).

### Cards

- Fundo `--bg-surface` (branco).
- Borda `1px solid --border-subtle`.
- Sombra `--shadow-sm`.
- Radius `--radius-lg` (10px).
- Padding interno: `--space-6` (24px) para cards densos, `--space-8` (32px) para cards "feature".

### Imagery

- Quando houver fotos (marketing): paleta **fria a neutra**, sem grain forçado, sem filtro instagram. Tratamento corporativo, fotografia de luz natural, paleta levemente dessaturada. Pessoas em ambiente de trabalho real, não stock posed.
- Ilustrações: **lineart geométrico** em monoazul (`--srm-blue-500` ou `--srm-blue-300`) sobre branco. **Não usar ilustrações coloridas com paleta arco-íris** — quebra o tom institucional. Hexágonos, formas poligonais, linhas finas combinam com o logo.

---

## 4. Iconography

### Set

**Lucide Icons** (`lucide-react` ou CDN) é o set escolhido — stroke fino (1.5px), geométrico, alinha com o vibe geométrico do logo SRM (hexágono). Free, open source, ampla cobertura para fintech.

**Substitution flag:** A SRM não tem (ainda) um icon font proprietário identificado nos materiais fornecidos. Se houver um set Figma interno ou um SVG sprite no `srm-front`, ele substitui o Lucide. Por enquanto, padronize tudo em Lucide.

### Carregamento

- Em produção React: `import { ArrowRight, FileText, ... } from 'lucide-react'`.
- Em prototypes HTML estáticos: `<script src="https://unpkg.com/lucide@latest"></script>` + `data-lucide="arrow-right"`.

### Regras de uso

- **Tamanhos**: 16px (inline em texto, dentro de botões), 20px (default em UI), 24px (sidebar, headers), 32px (empty states pequenos), 48-64px (empty states grandes).
- **Stroke**: 1.5px sempre — não engrossar.
- **Cor**: herda `currentColor`. Em estado default usa `--fg-2` (texto secundário); em estado ativo/hover usa `--fg-brand` ou `--fg-1`.
- **Spacing em botão**: gap 8px (`--space-2`) entre ícone e label.
- **Alinhamento**: nunca usar emoji como ícone. Nunca usar caracteres unicode (✓, ★, →) como ícone — sempre Lucide.

### Ícones-chave da plataforma SRM

`FileText` (duplicata), `TrendingUp` (rentabilidade), `Wallet` (carteira/saldo), `ArrowDownToLine` (recebimento), `ArrowUpFromLine` (antecipação), `Building2` (empresa cedente), `Users` (cotistas), `ShieldCheck` (compliance), `Clock` (em análise), `CircleCheck` (aprovado/liquidado), `CircleAlert` (atenção), `Receipt` (boleto), `BarChart3` (relatórios), `Settings`.

### Logo como ícone

O hexágono SRM em `assets/logo-icon.png` é o **brand mark**. Aparece:

- Sempre no topo-esquerdo do header da plataforma (com a versão `logo-full.png` em telas wider, e só o hexágono em mobile/sidebar colapsada).
- Como favicon.
- Como elemento decorativo grande (`--srm-blue-100`, transparência 30-40%) em telas vazias.
- **Nunca** como botão clicável genérico, nunca rotacionado, nunca em outras cores além do azul da marca ou branco sobre fundo azul.

---

## 5. Iterate with me

This system was bootstrapped from the brand brief and the two logos — the referenced `srm-front` design-system subtree wasn't accessible. **Please re-attach the codebase** (or paste a Figma link) and I'll reconcile fonts, exact component shapes, and any deviating tokens.

Open questions worth confirming:

1. Is **Geist** acceptable as the primary font, or does SRM have a licensed family I should swap in?
2. The **icon set** — Lucide is the placeholder; is there an internal one?
3. Is there a **dark theme** in scope, or strictly light UI? (Current tokens are light-only — easy to extend.)
4. Marketing-site vs platform — do both share this system, or is there a separate brand-marketing kit?
