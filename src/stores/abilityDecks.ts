import { defineStore } from 'pinia';
import type { AbilityDeckState } from '@/types/deck';
import { getMonster, getArchetype, DECK_CARD_NUMBERS } from '@/data/monsters.index';
import { shuffle } from '@/utils/shuffle';

interface AbilityDecksState {
  /** Keyed by monster id (one deck per active monster slot in the grid). */
  decks: Record<string, AbilityDeckState>;
}

function freshDeck(): AbilityDeckState {
  return {
    drawPile: shuffle([...DECK_CARD_NUMBERS]),
    discardPile: [],
    needsShuffle: false,
  };
}

export const useAbilityDecksStore = defineStore('abilityDecks', {
  state: (): AbilityDecksState => ({
    decks: {},
  }),
  getters: {
    /** The most recently drawn card number, or null. */
    currentCardNumber: (s) => (monsterId: string): number | null => {
      const d = s.decks[monsterId];
      if (!d || d.discardPile.length === 0) return null;
      return d.discardPile[d.discardPile.length - 1] ?? null;
    },

    needsShuffle: (s) => (monsterId: string): boolean =>
      s.decks[monsterId]?.needsShuffle ?? false,

    deckSize: (s) => (monsterId: string): number => {
      const d = s.decks[monsterId];
      if (!d) return 0;
      return d.drawPile.length + d.discardPile.length;
    },

    drawPileSize: (s) => (monsterId: string): number =>
      s.decks[monsterId]?.drawPile.length ?? 0,
  },
  actions: {
    /** Idempotent — only initializes if not already present. */
    ensureDeck(monsterId: string) {
      if (this.decks[monsterId]) return;
      if (!getMonster(monsterId)) return;
      this.decks[monsterId] = freshDeck();
    },

    /**
     * Draw the top of the draw pile into the discard pile.
     * If the drawn card has the shuffle symbol, mark needsShuffle.
     * If the draw pile is empty, reshuffle first.
     */
    draw(monsterId: string): number | null {
      this.ensureDeck(monsterId);
      const d = this.decks[monsterId];
      const monster = getMonster(monsterId);
      if (!d || !monster) return null;

      if (d.drawPile.length === 0) {
        this.shuffleDeck(monsterId);
      }

      const cardNumber = d.drawPile.shift();
      if (cardNumber === undefined) return null;
      d.discardPile.push(cardNumber);

      const archetype = getArchetype(monster.abilityArchetype);
      if (archetype?.shuffleCards.includes(cardNumber)) {
        d.needsShuffle = true;
      }
      return cardNumber;
    },

    /** Reshuffle: combine discard + draw, clear needsShuffle. */
    shuffleDeck(monsterId: string) {
      const d = this.decks[monsterId];
      if (!d) return;
      const all = [...d.drawPile, ...d.discardPile];
      d.drawPile = shuffle(all);
      d.discardPile = [];
      d.needsShuffle = false;
    },

    /** Drop a deck — used when a monster is removed from the grid. */
    removeDeck(monsterId: string) {
      delete this.decks[monsterId];
    },

    /** End-of-round: shuffle every deck flagged for shuffle. */
    shuffleAllPending() {
      for (const id of Object.keys(this.decks)) {
        if (this.decks[id]?.needsShuffle) {
          this.shuffleDeck(id);
        }
      }
    },

    reset() {
      this.decks = {};
    },
  },
});
