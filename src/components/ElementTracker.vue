<script setup lang="ts">
import { useScenarioStore, ELEMENTS } from '@/stores/scenario';
import type { Element } from '@/types/monster';

const scenarioStore = useScenarioStore();

const ELEMENT_INFO: Record<Element, { label: string; symbol: string }> = {
  fire: { label: 'Fire', symbol: '🜂' },
  ice: { label: 'Ice', symbol: '❄' },
  air: { label: 'Air', symbol: '🜁' },
  earth: { label: 'Earth', symbol: '🜃' },
  light: { label: 'Light', symbol: '☀' },
  dark: { label: 'Dark', symbol: '☾' },
};
</script>

<template>
  <div class="element-tracker">
    <div class="header">
      <span class="label">Elements</span>
      <span class="hint">click to cycle</span>
    </div>
    <div class="grid">
      <button
        v-for="el in ELEMENTS"
        :key="el"
        class="element"
        :class="[`is-${scenarioStore.elements[el]}`, `el-${el}`]"
        :title="`${ELEMENT_INFO[el].label} — ${scenarioStore.elements[el]}`"
        @click="scenarioStore.cycleElement(el)"
      >
        <span class="symbol">{{ ELEMENT_INFO[el].symbol }}</span>
        <span class="name">{{ ELEMENT_INFO[el].label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.element-tracker {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.header {
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

  .hint {
    font-size: 10px;
    color: var(--c-text-faint);
    font-style: italic;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-1);
}

.element {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--sp-2);
  background: var(--c-bg-elev-1);
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  font-size: var(--fs-xs);
  color: var(--c-text-faint);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;

  .symbol {
    font-size: var(--fs-lg);
    line-height: 1;
  }

  .name {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--element-color, transparent);
    opacity: 0;
    transition: opacity var(--transition-med);
  }

  &.el-fire { --element-color: var(--c-fire); }
  &.el-ice { --element-color: var(--c-ice); }
  &.el-air { --element-color: var(--c-air); }
  &.el-earth { --element-color: var(--c-earth); }
  &.el-light { --element-color: var(--c-light); }
  &.el-dark { --element-color: var(--c-dark); }

  &.is-strong {
    color: var(--c-bg);
    border-color: var(--element-color);

    &::before { opacity: 1; }
  }

  &.is-waning {
    color: var(--element-color);
    border-color: var(--element-color);

    &::before { opacity: 0.15; }
  }

  &.is-inert {
    color: var(--c-text-faint);
  }

  .symbol, .name {
    position: relative;
    z-index: 1;
  }

  &:hover {
    border-color: var(--element-color, var(--c-text-dim));
  }
}
</style>
