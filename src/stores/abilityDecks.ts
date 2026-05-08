import { defineStore } from 'pinia';
import type { AbilityDeckState } from '@/types/deck';
import type { AbilityCard } from '@/types/monster';
import { getMonster } from '@/data/monsters.index';
import { shuffle } from '@/utils/shuffle';

interface AbilityDecksState {
  /** keyed by monster id */
  decks: Record<string, AbilityDeckState>;
}

function freshDeck(cards: AbilityCard[]): AbilityDeckState {
  return {
    drawPile: shuffle(cards.map((c) => c.id)),
    discardPile: [],
    needsShuffle: false,
  };
}

export const useAbilityDecksStore = defineStore('abilityDecks', {
  state: (): AbilityDecksState => ({
    decks: {},
  }),
  getters: {
    /**
     * The id of the most recently drawn card (top of discard), or null.
     */
    currentCardId: (s) => (monsterId: string): string | null => {
      const d = s.decks[monsterId];
      if (!d || d.discardPile.length === 0) return null;
      return d.discardPile[d.discardPile.length - 1] ?? null;
    },

    /** Resolved AbilityCard object for the current top of discard. */
    currentCard:
      (s) =>
      (monsterId: string): AbilityCard | null => {
        const d = s.decks[monsterId];
        if (!d || d.discardPile.length === 0) return null;
        const monster = getMonster(monsterId);
        if (!monster) return null;
        const id = d.discardPile[d.discardPile.length - 1];
        return monster.abilityDeck.find((c) => c.id === id) ?? null;
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
      const monster = getMonster(monsterId);
      if (!monster) return;
      this.decks[monsterId] = freshDeck(monster.abilityDeck);
    },

    /**
     * Draw the top of the draw pile into the discard pile.
     * If the drawn card has the shuffle symbol, mark needsShuffle.
     * If draw pile is empty (shouldn't happen pre-shuffle), reshuffle first.
     */
    draw(monsterId: string): AbilityCard | null {
      this.ensureDeck(monsterId);
      const d = this.decks[monsterId];
      const monster = getMonster(monsterId);
      if (!d || !monster) return null;

      if (d.drawPile.length === 0) {
        this.shuffleDeck(monsterId);
      }

      const cardId = d.drawPile.shift();
      if (!cardId) return null;
      d.discardPile.push(cardId);

      const card = monster.abilityDeck.find((c) => c.id === cardId);
      if (card?.shuffle) d.needsShuffle = true;
      return card ?? null;
    },

    /** Reshuffle: combine discard + draw, clear needsShuffle. */
    shuffleDeck(monsterId: string) {
      const d = this.decks[monsterId];
      const monster = getMonster(monsterId);
      if (!d || !monster) return;
      const all = [...d.drawPile, ...d.discardPile];
      d.drawPile = shuffle(all);
      d.discardPile = [];
      d.needsShuffle = false;
    },

    /** Drop a deck — used when a monster is removed from grid. */
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
