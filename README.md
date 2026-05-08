# Gloomhaven Tracker

A Vue 3 + TypeScript companion app for tracking Gloomhaven (1st edition) monsters during play.

## Features

- Search and add up to 8 monster types to the board
- Track HP and conditions for each individual monster figure (up to 10 per type, normal/elite)
- Per-type ability deck with auto-shuffle on shuffle symbol
- Shared attack modifier deck with bless/curse support
- Element tracker (strong → waning → inert decay)
- Round tracker with end-of-round flow that handles all pending shuffles
- Full state persisted to localStorage
- Designed for desktop (16" MacBook Pro target resolution)

## Stack

- Vue 3 (Composition API, `<script setup>`)
- TypeScript with strict mode
- Vite
- Pinia (state management)
- SCSS (scoped per component, no UI libraries)

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Project structure

```
src/
  types/          # TypeScript types (monster, deck)
  data/           # Monster JSON files + index
  stores/         # Pinia stores
  composables/    # Reusable logic (persistence)
  utils/          # Pure helpers (shuffle, deck building)
  components/     # Vue components, all SCSS scoped
  styles/         # Global tokens
```

## Adding monsters

1. Create a new JSON file in `src/data/monsters/` following the schema in `src/types/monster.ts`.
2. Import and register it in `src/data/monsters.index.ts`.

The schema is type-checked, so if you cast incorrectly TypeScript will complain when you import it.

### Schema cheat sheet

```jsonc
{
  "id": "unique-kebab-case",
  "name": "Display Name",
  "maxInstances": 10,
  "stats": {
    "0": { "normal": { "hp": 5, "move": 2, "attack": 2 },
           "elite":  { "hp": 9, "move": 2, "attack": 3, "attributes": { "shield": 1 } } },
    "1": { ... },
    // ... through "7"
  },
  "abilityDeck": [
    {
      "id": "XX-01",
      "name": "Card Name",
      "initiative": 25,
      "shuffle": false,        // true if the shuffle symbol is on this card
      "actions": [
        { "type": "move", "value": 2 },
        { "type": "attack", "value": 1, "modifiers": [{ "type": "push", "value": 2 }] }
      ]
    }
    // 8 cards total
  ]
}
```

### Action types

- `{ type: "move", value: N, jumping?, flying? }`
- `{ type: "attack", value: N, range?, target?, aoe?, modifiers? }`
- `{ type: "shield", value: N, target?: "self"|"allies", range? }`
- `{ type: "heal", value: N, target?, range? }`
- `{ type: "retaliate", value: N, range?, target? }`
- `{ type: "condition", condition: "wound"|"poison"|..., target? }`
- `{ type: "element", action: "infuse"|"consume", element: "fire"|... }`
- `{ type: "summon", name, hp, move?, attack? }`
- `{ type: "text", value: "free-form fallback" }` — use for anything that doesn't fit cleanly

### Attack modifiers

Inside an `attack` action's `modifiers` array:
- `{ type: "pierce", value: N }`
- `{ type: "push", value: N }`
- `{ type: "pull", value: N }`
- `{ type: "condition", condition: "wound" }` — applies the condition on hit
- `{ type: "element-infuse", element: "fire" }`
- `{ type: "element-consume", element: "fire", effect: "..." }`


## Behavioral notes

- **Adding a monster already on the board**: no-op.
- **HP on level change**: max HP updates, current HP stays; you may end up over the new max which is fine.
- **Dead instances**: stay on the board (grayed out and crosshatched) until manually removed via the × button.
- **Wound**: shown as an icon — you apply the damage manually, the app does not auto-tick it.
- **End of round button**: increments round, decays elements, and shuffles all decks (monster ability decks + attack modifier deck) that are flagged for shuffle.
- **Bless/curse**: clicking + adds a card to the draw pile, − removes one. When drawn during play, single-use cards are removed from the deck and the counter decrements automatically.

## Reset

Use the **Reset** button in the header to clear all state — board, decks, round, elements. Confirms before destroying state.
