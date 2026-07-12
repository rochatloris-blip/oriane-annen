# Design System — Oriane Annen

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--bg` / `bg-bg` | `#090a0c` | Fond principal |
| `--text` | `#f4f5f7` | Texte principal |
| `--muted` | `#9598a3` | Texte secondaire |
| `--line` | `rgba(255,255,255,0.08)` | Bordures |
| `--line-soft` | `rgba(255,255,255,0.05)` | Bordures subtiles |
| `--accent` | `#8b5cf6` (violet-500) | Accent principal |
| `--accent-2` | `#a78bfa` (violet-400) | Accent secondaire |
| `panel` | `#0f1217` | Fond de cartes / panneaux |
| `cyan-400` | `#22d3ee` | Cyan (non utilisé actuellement, réservé) |
| `cyan-500` | `#06b6d4` | Cyan (non utilisé actuellement, réservé) |

Utilisation en Tailwind : `text-violet-400`, `bg-bg`, `border-white/10`, etc.

---

## Typographie

- **Famille :** Inter (Google Fonts)
- **Poids utilisés :** Light (300), Regular (400), Medium (500), Semibold (600)
- **Échelle :**

| Élément | Taille | Poids | Tracking |
|---|---|---|---|
| Héro (h1) | `text-5xl` → `md:text-6xl` → `lg:text-7xl` | Semibold | `tracking-tight` |
| Section (h2) | `text-3xl` → `md:text-4xl` | Semibold | `tracking-tight` |
| Section (h3) | `text-xl` | Medium | `tracking-tight` |
| Corps | `text-base` | Light | normal |
| Petit texte | `text-sm` | Light | normal |
| Légendes | `text-xs` | Variable | normal |
| Badges | `text-[0.65rem]` | Semibold | `tracking-wider` / `tracking-widest` |
| Labels formulaire | `text-[10px]` | Medium | `tracking-widest` |

---

## Espacements

Le site utilise les espacements Tailwind standard :

- **Padding sections :** `py-24 px-6`
- **Padding cartes :** `p-8` / `p-10 md:p-14`
- **Gap grid :** `gap-6` / `gap-16`
- **Gap flex :** `gap-2`, `gap-4`, `gap-8`
- **Container max :** `max-w-6xl` (sections larges), `max-w-5xl` (parcours), `max-w-3xl` (FAQ), `max-w-2xl` (textes centrés)

---

## Composants réutilisables

### `.glass-card`
Carte au verre dépoli utilisée pour les sections à fond semi-transparent.

```
class="glass-card rounded-2xl p-6"
```

### `.btn-gradient`
Bouton avec dégradé violet et ombre.

```
class="btn-gradient text-white px-6 py-3 rounded-xl text-sm font-medium"
```

### `.text-gradient`
Texte avec dégradé blanc → violet.

```
class="text-gradient"
```

### `.input-line`
Champ de formulaire avec bordure inférieure seulement.

```
class="input-line w-full text-white text-sm py-2"
```

### `.reveal`
Animation au scroll (GSAP). Tout élément avec cette classe apparaît avec un fade-in + slide-up lors du défilement.

---

## Layout

- **Header :** Fixe en haut, devient flouté au scroll (`header.scrolled`)
- **Navigation :** Desktop (md+) avec 4 liens, mobile avec icône hamburger
- **Footer :** Logo, navigation secondaire, copyright, liens légaux
- **Background layers (z-index négatif) :**
  - `#bgGL` (canvas Three.js) → `z-[-3]`
  - `.bg-fx` (gradients radiaux) → `z-[-2]`
  - `.grid-bg` (grille subtile) → `z-[-1]`

---

## Breakpoints

- `sm:` — 640px
- `md:` — 768px
- `lg:` — 1024px

---

## Icônes

Utilisation de **Iconify** avec le set **Solar** :

```
<iconify-icon icon="solar:arrow-right-linear" class="text-lg"></iconify-icon>
```

Icônes utilisées : `arrow-right-linear`, `flashlight-linear`, `calendar-date-linear`, `rocket-linear`, `check-circle-linear`, `wallet-linear`, `quote-left-linear`, `user-linear`, `heart-angle-linear`, `users-group-rounded-linear`, `hand-shake-linear`, `alt-arrow-down-linear`, `map-point-linear`, `letter-linear`, `hashtag-linear`, `arrow-right-up-linear`, `plain-2-linear`, `hamburger-menu-linear`.

---

## Animations

- **Smooth scroll :** Lenis (durée 1.1s, easing personnalisé)
- **Révélations au scroll :** GSAP + ScrollTrigger (fade-in + 30px vers le haut, durée 0.8s, start `top 85%`)
- **Hero :** Timeline GSAP séquentielle
- **FAQ :** Accordéon natif (max-height transition, sans GSAP)
- **Background :** WebGL avec Three.js (anneaux violets animés, suit la souris, disparaît au scroll)
- **Préférence utilisateur :** `prefers-reduced-motion: reduce` respectée
