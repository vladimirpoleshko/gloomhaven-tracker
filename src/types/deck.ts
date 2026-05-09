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
  /**
   * Free counter the DM ticks up as damage is dealt. Starts at 0,
   * no max — the stat-card image shows the monster's HP and the DM
   * decides when the figure is dead.
   */
  hp: number;
  conditions: MonsterCondition[];
}

/**
 * State for a monster's ability deck on the board.
 */
export interface AbilityDeckState {
  /** Card numbers (1-8) remaining in the draw pile, in shuffled order. */
  drawPile: number[];
  /** Card numbers in the discard pile. Most recently drawn = last. */
  discardPile: number[];
  /** Set true when a shuffle symbol is drawn — triggers shuffle at end of round. */
  needsShuffle: boolean;
}

/**
 * Standard attack modifier card. Single shared deck for all monsters.
 *
 * `imageNumber` points at the source image:
 *   plus/minus/multiply/null → ./attack-modifiers/monster/gh-am-m-<NN>.png
 *   bless/curse              → ./attack-modifiers/monster-mod/gh-am-mm-<NN>.png
 */
export type AttackModifierCard =
  | { id: string; kind: 'plus'; value: number; imageNumber: number } // +0, +1, +2
  | { id: string; kind: 'minus'; value: number; imageNumber: number } // -1, -2
  | { id: string; kind: 'multiply'; imageNumber: number } // x2 — triggers shuffle
  | { id: string; kind: 'null'; imageNumber: number } // null — triggers shuffle
  | { id: string; kind: 'bless'; imageNumber: number } // single-use, removed when drawn
  | { id: string; kind: 'curse'; imageNumber: number }; // single-use, removed when drawn

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
