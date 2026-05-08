import { defineStore } from 'pinia';
import type { Element } from '@/types/monster';
import type { ElementState } from '@/types/deck';
import type { MonsterLevel } from '@/types/monster';

const ELEMENTS: Element[] = ['fire', 'ice', 'air', 'earth', 'light', 'dark'];

interface ScenarioState {
  level: MonsterLevel;
  round: number;
  elements: Record<Element, ElementState>;
}

function freshElements(): Record<Element, ElementState> {
  return {
    fire: 'inert',
    ice: 'inert',
    air: 'inert',
    earth: 'inert',
    light: 'inert',
    dark: 'inert',
  };
}

export const useScenarioStore = defineStore('scenario', {
  state: (): ScenarioState => ({
    level: 1,
    round: 1,
    elements: freshElements(),
  }),
  actions: {
    setLevel(level: MonsterLevel) {
      this.level = level;
    },
    incrementRound() {
      this.round += 1;
      this.decayElements();
    },
    decrementRound() {
      if (this.round > 1) this.round -= 1;
    },
    /** Decay each element one step: strong → waning → inert. */
    decayElements() {
      for (const el of ELEMENTS) {
        const current = this.elements[el];
        if (current === 'strong') this.elements[el] = 'waning';
        else if (current === 'waning') this.elements[el] = 'inert';
      }
    },
    /** Cycle the element on click: inert → strong → waning → inert. */
    cycleElement(el: Element) {
      const current = this.elements[el];
      if (current === 'inert') this.elements[el] = 'strong';
      else if (current === 'strong') this.elements[el] = 'waning';
      else this.elements[el] = 'inert';
    },
    infuseElement(el: Element) {
      this.elements[el] = 'strong';
    },
    reset() {
      this.level = 1;
      this.round = 1;
      this.elements = freshElements();
    },
  },
});

export { ELEMENTS };
