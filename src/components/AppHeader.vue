<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario';
import { useActiveMonstersStore } from '@/stores/activeMonsters';
import { useAbilityDecksStore } from '@/stores/abilityDecks';
import { useAttackModifierStore } from '@/stores/attackModifier';
import type { MonsterLevel } from '@/types/monster';
import MonsterSearch from './MonsterSearch.vue';

const scenarioStore = useScenarioStore();
const activeStore = useActiveMonstersStore();
const decksStore = useAbilityDecksStore();
const amStore = useAttackModifierStore();

const LEVELS: MonsterLevel[] = [0, 1, 2, 3, 4, 5, 6, 7];

function handleResetScenario() {
  if (!confirm('Reset the entire scenario? This clears all monsters, decks, round, and elements.')) return;
  activeStore.reset();
  decksStore.reset();
  amStore.reset();
  scenarioStore.reset();
}
</script>

<template>
  <header class="app-header">
    <div class="brand">
      <span class="brand-mark">⚔</span>
      <span class="brand-name">Gloomhaven Tracker</span>
    </div>

    <div class="search-zone">
      <MonsterSearch />
    </div>

    <div class="controls">
      <div class="level-selector">
        <span class="label">Scenario Level</span>
        <div class="level-buttons">
          <button
            v-for="lvl in LEVELS"
            :key="lvl"
            class="level-btn"
            :class="{ 'is-active': scenarioStore.level === lvl }"
            @click="scenarioStore.setLevel(lvl)"
          >
            {{ lvl }}
          </button>
        </div>
      </div>

      <button class="reset-btn" @click="handleResetScenario">Reset</button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--sp-5);
  padding: var(--sp-3) var(--sp-4);
  background: var(--c-bg-elev-1);
  border-bottom: 1px solid var(--c-border-strong);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);

  .brand-mark {
    font-size: var(--fs-xl);
    color: var(--c-accent);
  }

  .brand-name {
    font-family: var(--ff-display);
    font-size: var(--fs-md);
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--c-text);
    text-transform: uppercase;
  }
}

.search-zone {
  display: flex;
  align-items: center;
}

.controls {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}

.level-selector {
  display: flex;
  align-items: center;
  gap: var(--sp-2);

  .label {
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--c-text-dim);
    font-weight: 600;
  }

  .level-buttons {
    display: flex;
    gap: 2px;
    background: var(--c-bg);
    border: 1px solid var(--c-border-strong);
    border-radius: var(--r-sm);
    padding: 2px;
  }

  .level-btn {
    width: 28px;
    height: 28px;
    font-family: var(--ff-mono);
    font-size: var(--fs-sm);
    font-weight: 600;
    color: var(--c-text-muted);
    background: transparent;
    border: none;
    border-radius: 2px;
    transition: all var(--transition-fast);

    &:hover {
      color: var(--c-text);
    }

    &.is-active {
      background: var(--c-accent);
      color: var(--c-bg);
    }
  }
}

.reset-btn {
  padding: var(--sp-2) var(--sp-3);
  background: transparent;
  border: 1px solid var(--c-border-strong);
  border-radius: var(--r-sm);
  color: var(--c-text-dim);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--c-danger);
    color: var(--c-danger);
  }
}
</style>
