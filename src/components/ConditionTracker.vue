<script setup lang="ts">
import type { MonsterCondition } from '@/types/monster';

defineProps<{
  conditions: MonsterCondition[];
  immunities?: MonsterCondition[];
}>();

const emit = defineEmits<{
  toggle: [condition: MonsterCondition];
}>();

const ALL_CONDITIONS: { id: MonsterCondition; label: string; symbol: string }[] = [
  { id: 'poison', label: 'Poison', symbol: 'P' },
  { id: 'wound', label: 'Wound', symbol: 'W' },
  { id: 'muddle', label: 'Muddle', symbol: 'M' },
  { id: 'stun', label: 'Stun', symbol: 'S' },
  { id: 'immobilize', label: 'Immobilize', symbol: 'I' },
  { id: 'disarm', label: 'Disarm', symbol: 'D' },
  { id: 'invisible', label: 'Invisible', symbol: 'V' },
  { id: 'strengthen', label: 'Strengthen', symbol: '+' },
];

function isActive(c: MonsterCondition, conditions: MonsterCondition[]): boolean {
  return conditions.includes(c);
}

function isImmune(c: MonsterCondition, immunities?: MonsterCondition[]): boolean {
  return !!immunities?.includes(c);
}
</script>

<template>
  <div class="condition-tracker">
    <button
      v-for="cond in ALL_CONDITIONS"
      :key="cond.id"
      class="cond-btn"
      :class="{
        'is-active': isActive(cond.id, conditions),
        'is-immune': isImmune(cond.id, immunities),
      }"
      :title="`${cond.label}${isImmune(cond.id, immunities) ? ' (immune)' : ''}`"
      :disabled="isImmune(cond.id, immunities)"
      @click="emit('toggle', cond.id)"
    >
      {{ cond.symbol }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.condition-tracker {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
}

.cond-btn {
  width: 100%;
  aspect-ratio: 1;
  font-family: var(--ff-mono);
  font-size: var(--fs-xs);
  font-weight: 700;
  background: var(--c-bg-elev-1);
  color: var(--c-text-faint);
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  transition: all var(--transition-fast);
  padding: 0;

  &:hover:not(:disabled) {
    border-color: var(--c-text-dim);
    color: var(--c-text-dim);
  }

  &.is-active {
    background: var(--c-accent);
    color: var(--c-bg);
    border-color: var(--c-accent);
  }

  &.is-immune {
    background: transparent;
    color: var(--c-text-faint);
    border-style: dashed;
    cursor: not-allowed;
    opacity: 0.4;
  }
}
</style>
