<script setup lang="ts">
import { computed } from 'vue';
import { useActiveMonstersStore, MAX_INSTANCES_PER_TYPE } from '@/stores/activeMonsters';
import { useScenarioStore } from '@/stores/scenario';
import { useAbilityDecksStore } from '@/stores/abilityDecks';
import { getMonster } from '@/data/monsters.index';
import type { ActiveMonster } from '@/stores/activeMonsters';
import MonsterStats from './MonsterStats.vue';
import MonsterInstance from './MonsterInstance.vue';
import AbilityDeck from './AbilityDeck.vue';

const props = defineProps<{
  slot: ActiveMonster;
}>();

const activeStore = useActiveMonstersStore();
const scenarioStore = useScenarioStore();
const decksStore = useAbilityDecksStore();

const monster = computed(() => getMonster(props.slot.monsterId));

const levelStats = computed(() => {
  if (!monster.value) return null;
  return monster.value.stats[scenarioStore.level];
});

const canSpawnMore = computed(
  () => props.slot.instances.length < MAX_INSTANCES_PER_TYPE
);

const isElite = computed(() => props.slot.spawnTier === 'elite');

function toggleSpawnTier() {
  activeStore.setSpawnTier(props.slot.monsterId, isElite.value ? 'normal' : 'elite');
}

function handleSpawn() {
  if (!levelStats.value) return;
  const tierStats = levelStats.value[props.slot.spawnTier];
  activeStore.spawnInstance(props.slot.monsterId, tierStats.hp);
}

function handleRemoveBox() {
  activeStore.removeMonster(props.slot.monsterId);
  decksStore.removeDeck(props.slot.monsterId);
}

// Initialize the deck when the box mounts.
decksStore.ensureDeck(props.slot.monsterId);
</script>

<template>
  <article v-if="monster && levelStats" class="monster-box">
    <header class="box-header">
      <div class="title-block">
        <h2 class="title">{{ monster.name }}</h2>
        <span class="level-tag">L{{ scenarioStore.level }}</span>
      </div>
      <button class="close-btn" title="Remove monster" @click="handleRemoveBox">×</button>
    </header>

    <div class="content">
      <section class="stats-section">
        <MonsterStats :normal="levelStats.normal" :elite="levelStats.elite" />
      </section>

      <section class="deck-section">
        <AbilityDeck :monster-id="slot.monsterId" />
      </section>

      <section class="instances-section">
        <div class="instances-header">
          <span class="label">Figures</span>
          <span class="count">{{ slot.instances.length }} / {{ MAX_INSTANCES_PER_TYPE }}</span>
        </div>

        <div class="instances-list">
          <MonsterInstance
            v-for="inst in slot.instances"
            :key="inst.id"
            :monster-id="slot.monsterId"
            :instance="inst"
          />
          <div v-if="slot.instances.length === 0" class="no-instances">
            No figures spawned
          </div>
        </div>

        <div class="spawn-controls">
          <button
            class="tier-toggle"
            :class="{ 'is-elite': isElite }"
            @click="toggleSpawnTier"
          >
            <span class="dot" />
            <span class="text">{{ isElite ? 'Elite' : 'Normal' }}</span>
          </button>
          <button
            class="spawn-btn"
            :disabled="!canSpawnMore"
            @click="handleSpawn"
          >
            + Add Figure
          </button>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped lang="scss">
.monster-box {
  background: var(--c-bg-elev-1);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 1px 0 0 rgba(255, 255, 255, 0.02) inset,
    0 4px 16px rgba(0, 0, 0, 0.3);
}

.box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-3) var(--sp-4);
  background: linear-gradient(180deg, var(--c-bg-elev-3) 0%, var(--c-bg-elev-2) 100%);
  border-bottom: 1px solid var(--c-border-strong);

  .title-block {
    display: flex;
    align-items: baseline;
    gap: var(--sp-2);
  }

  .title {
    margin: 0;
    font-family: var(--ff-display);
    font-size: var(--fs-lg);
    font-weight: 600;
    color: var(--c-text);
    letter-spacing: 0.04em;
  }

  .level-tag {
    font-family: var(--ff-mono);
    font-size: var(--fs-xs);
    color: var(--c-accent);
    padding: 2px 6px;
    background: var(--c-accent-soft);
    border-radius: var(--r-sm);
    letter-spacing: 0.05em;
  }
}

.close-btn {
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: var(--c-text-faint);
  font-size: var(--fs-xl);
  line-height: 1;
  padding: 0;
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--c-danger);
    background: var(--c-danger-soft);
  }
}

.content {
  padding: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  flex: 1;
  min-height: 0;
}

.stats-section,
.deck-section {
  flex-shrink: 0;
}

.instances-section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  flex: 1;
  min-height: 0;
}

.instances-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--c-text-dim);
    font-weight: 600;
  }

  .count {
    font-family: var(--ff-mono);
    font-size: var(--fs-xs);
    color: var(--c-text-muted);
  }
}

.instances-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  max-height: 320px;
  overflow-y: auto;
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--c-border-strong);
    border-radius: 3px;
  }
}

.no-instances {
  text-align: center;
  font-size: var(--fs-xs);
  color: var(--c-text-faint);
  padding: var(--sp-3);
  font-style: italic;
}

.spawn-controls {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--sp-2);
  margin-top: auto;
}

.tier-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: var(--sp-2) var(--sp-3);
  background: var(--c-bg-elev-2);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--r-sm);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--c-text);
  font-weight: 600;
  transition: all var(--transition-fast);

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--c-text-muted);
    transition: background var(--transition-fast);
  }

  &:hover {
    border-color: var(--c-accent);
  }

  &.is-elite {
    border-color: var(--c-elite);
    color: var(--c-elite);

    .dot {
      background: var(--c-elite);
      box-shadow: 0 0 6px var(--c-elite);
    }
  }
}

.spawn-btn {
  padding: var(--sp-2) var(--sp-3);
  background: var(--c-accent);
  color: var(--c-bg);
  border: 1px solid var(--c-accent);
  border-radius: var(--r-sm);
  font-size: var(--fs-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    background: var(--c-accent-strong);
    border-color: var(--c-accent-strong);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
