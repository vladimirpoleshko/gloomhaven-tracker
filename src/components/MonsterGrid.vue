<script setup lang="ts">
import { useActiveMonstersStore, MAX_GRID_SIZE } from '@/stores/activeMonsters';
import MonsterBox from './MonsterBox.vue';

const activeStore = useActiveMonstersStore();
</script>

<template>
  <div class="monster-grid">
    <MonsterBox
      v-for="slot in activeStore.active"
      :key="slot.monsterId"
      :slot="slot"
    />
    <div
      v-if="activeStore.active.length === 0"
      class="empty-grid"
    >
      <div class="empty-rune">⚔</div>
      <div class="empty-title">No monsters on the board</div>
      <div class="empty-hint">
        Search and add up to {{ MAX_GRID_SIZE }} monster types from the toolbar above
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.monster-grid {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 320px;
  gap: var(--sp-3);
  padding: var(--sp-4);
  flex: 1;
  height: 100%;
  align-content: start;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--c-accent);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--c-accent-strong);
  }
}

.empty-grid {
  grid-column: 1 / -1;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-3);
  color: var(--c-text-muted);
  border: 1px dashed var(--c-border);
  border-radius: var(--r-lg);
  background: var(--c-surface-glow);

  .empty-rune {
    font-size: 48px;
    color: var(--c-text-faint);
  }

  .empty-title {
    font-family: var(--ff-display);
    font-size: var(--fs-xl);
    color: var(--c-text-dim);
    letter-spacing: 0.05em;
  }

  .empty-hint {
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
    text-align: center;
    max-width: 360px;
  }
}
</style>
