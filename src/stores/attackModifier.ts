import { defineStore } from 'pinia';
import type { AttackModifierCard, AttackModifierDeckState } from '@/types/deck';
import {
  buildBaseAttackModifierDeck,
  isShuffleTriggerCard,
  isSingleUseCard,
  makeBlessCard,
  makeCurseCard,
} from '@/utils/attackModifierDeck';
import { shuffle } from '@/utils/shuffle';

const MAX_BLESS = 10;
const MAX_CURSE = 10;

function freshDeck(): AttackModifierDeckState {
  return {
    drawPile: shuffle(buildBaseAttackModifierDeck()),
    discardPile: [],
    needsShuffle: false,
    blessCount: 0,
    curseCount: 0,
  };
}

export const useAttackModifierStore = defineStore('attackModifier', {
  state: (): AttackModifierDeckState => freshDeck(),
  getters: {
    currentCard: (s): AttackModifierCard | null =>
      s.discardPile.length > 0 ? (s.discardPile[s.discardPile.length - 1] ?? null) : null,
    drawPileSize: (s) => s.drawPile.length,
    discardPileSize: (s) => s.discardPile.length,
  },
  actions: {
    /**
     * Draw the top card. If it's a single-use bless/curse, do not put it back —
     * it's removed from the deck (decrement counter).
     * If it's ×2 or null, set needsShuffle.
     */
    draw(): AttackModifierCard | null {
      if (this.drawPile.length === 0) {
        this.shuffleDeck();
      }
      const card = this.drawPile.shift();
      if (!card) return null;

      if (isSingleUseCard(card)) {
        // Removed from deck entirely.
        if (card.kind === 'bless') this.blessCount = Math.max(0, this.blessCount - 1);
        if (card.kind === 'curse') this.curseCount = Math.max(0, this.curseCount - 1);
        this.discardPile.push(card); // Show what was drawn this turn — clear on shuffle.
      } else {
        this.discardPile.push(card);
        if (isShuffleTriggerCard(card)) this.needsShuffle = true;
      }
      return card;
    },

    /**
     * Shuffle: combine non-single-use cards from draw+discard, drop single-use cards
     * that were already drawn (they're gone), and reshuffle.
     * Single-use cards still in the draw pile remain in the deck.
     */
    shuffleDeck() {
      // Discard pile may contain drawn bless/curse — those should be removed.
      const remainingDiscard = this.discardPile.filter((c) => !isSingleUseCard(c));
      const all = [...this.drawPile, ...remainingDiscard];
      this.drawPile = shuffle(all);
      this.discardPile = [];
      this.needsShuffle = false;
    },

    addBless() {
      if (this.blessCount >= MAX_BLESS) return;
      this.drawPile.push(makeBlessCard());
      this.drawPile = shuffle(this.drawPile);
      this.blessCount += 1;
    },

    removeBless() {
      // Remove one bless from the draw pile if present (UI affordance).
      const idx = this.drawPile.findIndex((c) => c.kind === 'bless');
      if (idx >= 0) {
        this.drawPile.splice(idx, 1);
        this.blessCount = Math.max(0, this.blessCount - 1);
      } else if (this.blessCount > 0) {
        // Edge case: bless might be in discard — just decrement counter.
        this.blessCount -= 1;
      }
    },

    addCurse() {
      if (this.curseCount >= MAX_CURSE) return;
      this.drawPile.push(makeCurseCard());
      this.drawPile = shuffle(this.drawPile);
      this.curseCount += 1;
    },

    removeCurse() {
      const idx = this.drawPile.findIndex((c) => c.kind === 'curse');
      if (idx >= 0) {
        this.drawPile.splice(idx, 1);
        this.curseCount = Math.max(0, this.curseCount - 1);
      } else if (this.curseCount > 0) {
        this.curseCount -= 1;
      }
    },

    reset() {
      const fresh = freshDeck();
      this.drawPile = fresh.drawPile;
      this.discardPile = fresh.discardPile;
      this.needsShuffle = fresh.needsShuffle;
      this.blessCount = fresh.blessCount;
      this.curseCount = fresh.curseCount;
    },
  },
});

export { MAX_BLESS, MAX_CURSE };
