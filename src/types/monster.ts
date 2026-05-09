/**
 * Monster types for Gloomhaven 1st edition.
 *
 * Stat cards and ability cards are rendered from image assets.
 * The app keeps only the minimum data needed for tracking: identity,
 * which ability deck archetype a monster uses, and which cards in
 * that deck have the shuffle symbol.
 */

export type MonsterLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Element = 'fire' | 'ice' | 'air' | 'earth' | 'light' | 'dark';

/**
 * Conditions monsters can have applied to them.
 * Bless and curse are excluded — those affect attack modifier decks
 * and are tracked separately on the player/monster shared deck.
 */
export type MonsterCondition =
  | 'poison'
  | 'wound'
  | 'muddle'
  | 'stun'
  | 'immobilize'
  | 'disarm'
  | 'invisible'
  | 'strengthen';

/**
 * One playable monster (e.g. "Bandit Archer", "Inox Shaman").
 *
 * `id` doubles as the stat-card slug — the stat card images are named
 * `gh-<id>-0.png` (levels 0-3) and `gh-<id>-4.png` (levels 4-7).
 *
 * `abilityArchetype` points to the shared ability deck archetype
 * (e.g. all archers — bandit, city, inox — share the `archer` deck).
 */
export interface Monster {
  id: string;
  name: string;
  abilityArchetype: string;
}

/**
 * One ability deck archetype. The 8 cards live as images named
 * `gh-ma-<abbrev>-1.png` … `-8.png`, plus `-back.png`.
 * `shuffleCards` lists the card numbers that carry the shuffle symbol.
 * Empty list = no auto-shuffle prompt for this archetype (DM handles it).
 */
export interface AbilityArchetype {
  id: string;
  abbrev: string;
  shuffleCards: number[];
}

/**
 * A reference to a single card in an archetype's deck.
 * Cards are identified by archetype + number; image URLs are
 * resolved at render time via the manifest helpers.
 */
export interface AbilityCardRef {
  archetypeId: string;
  number: number;
}
