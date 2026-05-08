<script setup lang="ts">
import { computed } from 'vue';
import type { MonsterCondition } from '@/types/monster';
import type { MonsterInstance } from '@/types/deck';
import { useActiveMonstersStore } from '@/stores/activeMonsters';
import { useScenarioStore } from '@/stores/scenario';
import { getMonster } from '@/data/monsters.index';
import ConditionTracker from './ConditionTracker.vue';

const props = defineProps<{
  monsterId: string;
  instance: MonsterInstance;
}>();

const activeStore = useActiveMonstersStore();
const scenarioStore = useScenarioStore();

const stats = computed(() => {
  const monster = getMonster(props.monsterId);
  if (!monster) return null;
  return monster.stats[scenarioStore.level][props.instance.tier];
});

const maxHp = computed(() => stats.value?.hp ?? 1);
const immunities = computed(() => stats.value?.immunities);

const isDead = computed(() => props.instance.hp <= 0);

const hpPercent = computed(() => {
  if (!maxHp.value) return 0;
  return Math.max(0, Math.min(100, (props.instance.hp / maxHp.value) * 100));
});

function decrementHp() {
  activeStore.adjustInstanceHp(props.monsterId, props.instance.id, -1, maxHp.value);
}

function incrementHp() {
  activeStore.adjustInstanceHp(props.monsterId, props.instance.id, +1, maxHp.value);
}

function handleToggleCondition(c: MonsterCondition) {
  activeStore.toggleCondition(props.monsterId, props.instance.id, c);
}

function handleRemove() {
  activeStore.removeInstance(props.monsterId, props.instance.id);
}
</script>

<template>
  <div
    class="monster-instance"
    :class="{ 'is-elite': instance.tier === 'elite', 'is-dead': isDead }"
  >
    <div class="row">
      <div class="figure">
        <span class="num">{{ instance.figureNumber }}</span>
        <span v-if="instance.tier === 'elite'" class="tier-badge">ELITE</span>
      </div>

      <div class="hp-controls">
        <button class="hp-btn" :disabled="instance.hp <= 0" @click="decrementHp">−</button>
        <div class="hp-display">
          <div class="hp-bar">
            <div class="hp-bar-fill" :style="{ width: `${hpPercent}%` }" />
          </div>
          <div class="hp-text">
            <span class="hp-current">{{ instance.hp }}</span>
            <span class="hp-divider">/</span>
            <span class="hp-max">{{ maxHp }}</span>
          </div>
        </div>
        <button class="hp-btn" :disabled="instance.hp >= maxHp" @click="incrementHp">+</button>
      </div>

      <button class="remove-btn" title="Remove instance" @click="handleRemove">×</button>
    </div>

    <ConditionTracker
      :conditions="instance.conditions"
      :immunities="immunities"
      @toggle="handleToggleCondition"
    />
  </div>
</template>

<style scoped lang="scss">
.monster-instance {
  background: var(--c-bg-elev-1);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: var(--sp-2);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  transition: border-color var(--transition-fast);

  &.is-elite {
    border-left: 3px solid var(--c-elite);
  }

  &.is-dead {
    opacity: 0.45;
    background: repeating-linear-gradient(
      135deg,
      var(--c-bg-elev-1),
      var(--c-bg-elev-1) 4px,
      var(--c-bg) 4px,
      var(--c-bg) 8px
    );
  }
}

.row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--sp-2);
  align-items: center;
}

.figure {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 38px;

  .num {
    font-family: var(--ff-mono);
    font-size: var(--fs-md);
    font-weight: 700;
    color: var(--c-text);
    width: 22px;
    text-align: center;
  }

  .tier-badge {
    font-size: 8px;
    font-weight: 700;
    color: var(--c-elite);
    letter-spacing: 0.1em;
  }
}

.hp-controls {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--sp-1);
  align-items: center;
}

.hp-btn {
  width: 22px;
  height: 22px;
  border-radius: var(--r-sm);
  background: var(--c-bg-elev-2);
  border: 1px solid var(--c-border-strong);
  color: var(--c-text);
  font-size: var(--fs-md);
  font-weight: 700;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    border-color: var(--c-accent);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.hp-display {
  position: relative;
  height: 22px;
}

.hp-bar {
  position: absolute;
  inset: 0;
  background: var(--c-bg-elev-2);
  border-radius: var(--r-sm);
  overflow: hidden;
  border: 1px solid var(--c-border);
}

.hp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-danger), var(--c-accent));
  transition: width var(--transition-med);
}

.hp-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ff-mono);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--c-text);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);

  .hp-divider {
    margin: 0 2px;
    color: var(--c-text-dim);
  }

  .hp-max {
    color: var(--c-text-dim);
  }
}

.remove-btn {
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  color: var(--c-text-faint);
  font-size: var(--fs-md);
  line-height: 1;
  padding: 0;
  border-radius: var(--r-sm);

  &:hover {
    color: var(--c-danger);
    background: var(--c-danger-soft);
  }
}
</style>
