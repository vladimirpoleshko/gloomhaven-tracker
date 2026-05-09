<script setup lang="ts">
import type { MonsterCondition } from '@/types/monster';
import type { MonsterInstance } from '@/types/deck';
import { useActiveMonstersStore } from '@/stores/activeMonsters';
import ConditionTracker from './ConditionTracker.vue';

const props = defineProps<{
  monsterId: string;
  instance: MonsterInstance;
}>();

const activeStore = useActiveMonstersStore();

function decrementHp() {
  activeStore.adjustInstanceHp(props.monsterId, props.instance.id, -1);
}

function incrementHp() {
  activeStore.adjustInstanceHp(props.monsterId, props.instance.id, +1);
}

function handleToggleCondition(c: MonsterCondition) {
  activeStore.toggleCondition(props.monsterId, props.instance.id, c);
}

function handleRemove() {
  activeStore.removeInstance(props.monsterId, props.instance.id);
}
</script>

<template>
  <div class="monster-instance" :class="{ 'is-elite': instance.tier === 'elite' }">
    <div class="row">
      <div class="figure">
        <span class="num">{{ instance.figureNumber }}</span>
        <span v-if="instance.tier === 'elite'" class="tier-badge">ELITE</span>
      </div>

      <div class="hp-controls">
        <button class="hp-btn" :disabled="instance.hp <= 0" @click="decrementHp">−</button>
        <div class="hp-display">
          <span class="hp-label">HP</span>
          <span class="hp-value">{{ instance.hp }}</span>
        </div>
        <button class="hp-btn" @click="incrementHp">+</button>
      </div>

      <button class="remove-btn" title="Remove instance" @click="handleRemove">×</button>
    </div>

    <ConditionTracker
      :conditions="instance.conditions"
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
  width: 24px;
  height: 24px;
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
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  height: 24px;
  background: var(--c-bg-elev-2);
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  padding: 0 var(--sp-2);

  .hp-label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--c-text-faint);
    font-weight: 600;
  }

  .hp-value {
    font-family: var(--ff-mono);
    font-size: var(--fs-md);
    font-weight: 700;
    color: var(--c-text);
    line-height: 24px;
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
