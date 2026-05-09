import { defineStore } from 'pinia';
import type { MonsterCondition } from '@/types/monster';
import type { MonsterInstance } from '@/types/deck';
import { getMonster } from '@/data/monsters.index';

export const MAX_GRID_SIZE = 8;
export const MAX_INSTANCES_PER_TYPE = 10;

/**
 * One slot in the grid: one monster type plus its spawned instances.
 */
export interface ActiveMonster {
  monsterId: string;
  /** Toggle for the spawn button — does NOT change existing instances. */
  spawnTier: 'normal' | 'elite';
  instances: MonsterInstance[];
}

interface ActiveMonstersState {
  /** Order matters — this is the grid display order. */
  active: ActiveMonster[];
}

let instanceCounter = 0;
function nextInstanceId() {
  return `inst-${++instanceCounter}-${Date.now().toString(36)}`;
}

export const useActiveMonstersStore = defineStore('activeMonsters', {
  state: (): ActiveMonstersState => ({
    active: [],
  }),
  getters: {
    isFull: (s) => s.active.length >= MAX_GRID_SIZE,
    hasMonster:
      (s) =>
      (id: string): boolean =>
        s.active.some((m) => m.monsterId === id),
  },
  actions: {
    addMonster(monsterId: string): boolean {
      // Per spec: if already in grid, do nothing.
      if (this.hasMonster(monsterId)) return false;
      if (this.isFull) return false;
      if (!getMonster(monsterId)) return false;

      this.active.push({
        monsterId,
        spawnTier: 'normal',
        instances: [],
      });
      return true;
    },
    removeMonster(monsterId: string) {
      const idx = this.active.findIndex((m) => m.monsterId === monsterId);
      if (idx >= 0) this.active.splice(idx, 1);
    },
    setSpawnTier(monsterId: string, tier: 'normal' | 'elite') {
      const slot = this.active.find((m) => m.monsterId === monsterId);
      if (slot) slot.spawnTier = tier;
    },

    /**
     * Spawn a new instance using the current spawnTier.
     * Auto-assigns the next free figure number 1..MAX_INSTANCES_PER_TYPE.
     * HP starts at 0; the DM ticks it up as damage is taken.
     */
    spawnInstance(monsterId: string): MonsterInstance | null {
      const slot = this.active.find((m) => m.monsterId === monsterId);
      if (!slot) return null;
      if (slot.instances.length >= MAX_INSTANCES_PER_TYPE) return null;

      const used = new Set(slot.instances.map((i) => i.figureNumber));
      let figureNumber = 1;
      while (used.has(figureNumber) && figureNumber <= MAX_INSTANCES_PER_TYPE) {
        figureNumber++;
      }
      if (figureNumber > MAX_INSTANCES_PER_TYPE) return null;

      const inst: MonsterInstance = {
        id: nextInstanceId(),
        figureNumber,
        tier: slot.spawnTier,
        hp: 0,
        conditions: [],
      };
      slot.instances.push(inst);
      // Keep instances sorted by figureNumber for stable display.
      slot.instances.sort((a, b) => a.figureNumber - b.figureNumber);
      return inst;
    },

    removeInstance(monsterId: string, instanceId: string) {
      const slot = this.active.find((m) => m.monsterId === monsterId);
      if (!slot) return;
      const idx = slot.instances.findIndex((i) => i.id === instanceId);
      if (idx >= 0) slot.instances.splice(idx, 1);
    },

    adjustInstanceHp(monsterId: string, instanceId: string, delta: number) {
      const slot = this.active.find((m) => m.monsterId === monsterId);
      const inst = slot?.instances.find((i) => i.id === instanceId);
      if (inst) inst.hp = Math.max(0, inst.hp + delta);
    },

    toggleCondition(monsterId: string, instanceId: string, condition: MonsterCondition) {
      const slot = this.active.find((m) => m.monsterId === monsterId);
      const inst = slot?.instances.find((i) => i.id === instanceId);
      if (!inst) return;
      const idx = inst.conditions.indexOf(condition);
      if (idx >= 0) inst.conditions.splice(idx, 1);
      else inst.conditions.push(condition);
    },

    reset() {
      this.active = [];
    },
  },
});
