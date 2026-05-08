/**
 * Monster types for Gloomhaven 1st edition.
 *
 * Levels go 0-7. Each level has separate normal and elite stat blocks.
 * Each monster type has an 8-card ability deck.
 */

export type MonsterLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Element = 'fire' | 'ice' | 'air' | 'earth' | 'light' | 'dark';

export type MonsterAttribute =
  | 'flying'
  | 'shield'
  | 'retaliate'
  | 'pierce'
  | 'pull'
  | 'push'
  | 'target'
  | 'advantage'
  | 'disadvantage';

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
 * A single stat block for a monster at a specific level + tier.
 * "attributes" carries values like { shield: 1, retaliate: 2 }.
 */
export interface MonsterStatBlock {
  hp: number;
  move: number;
  attack: number;
  range?: number;
  attributes?: Partial<Record<MonsterAttribute, number | true>>;
  immunities?: MonsterCondition[];
}

export interface MonsterLevelStats {
  normal: MonsterStatBlock;
  elite: MonsterStatBlock;
}

/**
 * Discriminated union of structured ability actions.
 * Cards usually have multiple actions in sequence.
 * "text" is the escape hatch for anything that doesn't fit cleanly.
 */
export type AbilityAction =
  | { type: 'move'; value: number; jumping?: boolean; flying?: boolean }
  | {
      type: 'attack';
      value: number;
      range?: number;
      target?: number;
      aoe?: string;
      modifiers?: AttackModifier[];
    }
  | { type: 'shield'; value: number; target?: 'self' | 'allies'; range?: number }
  | { type: 'heal'; value: number; target?: 'self' | 'allies'; range?: number }
  | { type: 'retaliate'; value: number; range?: number; target?: 'self' | 'allies' }
  | {
      type: 'condition';
      condition: MonsterCondition;
      target?: 'self' | 'enemies' | 'allies';
      range?: number;
    }
  | { type: 'element'; action: 'infuse' | 'consume'; element: Element }
  | { type: 'summon'; name: string; hp: number; move?: number; attack?: number }
  | { type: 'text'; value: string };

/**
 * Modifier applied to an attack action — pierce, push, pull, plus condition adds.
 */
export type AttackModifier =
  | { type: 'pierce'; value: number }
  | { type: 'push'; value: number }
  | { type: 'pull'; value: number }
  | { type: 'condition'; condition: MonsterCondition }
  | { type: 'element-infuse'; element: Element }
  | { type: 'element-consume'; element: Element; effect: string };

export interface AbilityCard {
  /** Unique within the deck (e.g. "BG-01"). */
  id: string;
  name: string;
  initiative: number;
  /** True if the shuffle symbol is on this card. */
  shuffle: boolean;
  actions: AbilityAction[];
}

export interface Monster {
  id: string;
  name: string;
  /** Stats keyed by level 0-7. */
  stats: Record<MonsterLevel, MonsterLevelStats>;
  abilityDeck: AbilityCard[];
  /** Default max instances on the board (10 for standard, 6 for bosses). */
  maxInstances?: number;
}
