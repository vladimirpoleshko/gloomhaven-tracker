import type { MonsterCondition } from './monster';

/**
 * A single monster figure on the board.
 */
export interface MonsterInstance {
  /** Stable id for v-for keys etc. */
  id: string;
  /** Standee number (1-10). Auto-assigned to next free. */
  figureNumber: number;
  tier: 'normal' | 'elite';
  hp: number;
  conditions: MonsterCondition[];
}

/**
 * State for a monster type's ability deck on the board.
 */
export interface AbilityDeckState {
  /** Card ids remaining in the draw pile, in shuffled order. */
  drawPile: string[];
  /** Card ids in the discard pile. Most recently drawn = last. */
  discardPile: string[];
  /** Set true when a shuffle symbol is drawn — triggers shuffle at end of round. */
  needsShuffle: boolean;
}

/**
 * Standard attack modifier card. Single shared deck for all monsters.
 */
export type AttackModifierCard =
  | { id: string; kind: 'plus'; value: number } // +0, +1, +2
  | { id: string; kind: 'minus'; value: number } // -1, -2
  | { id: string; kind: 'multiply' } // x2 — triggers shuffle
  | { id: string; kind: 'null' } // null — triggers shuffle
  | { id: string; kind: 'bless' } // single-use, removed when drawn
  | { id: string; kind: 'curse' }; // single-use, removed when drawn

export interface AttackModifierDeckState {
  drawPile: AttackModifierCard[];
  discardPile: AttackModifierCard[];
  needsShuffle: boolean;
  /** Number of bless cards currently in deck (draw + discard). */
  blessCount: number;
  /** Number of curse cards currently in deck (draw + discard). */
  curseCount: number;
}

export type ElementState = 'strong' | 'waning' | 'inert';
