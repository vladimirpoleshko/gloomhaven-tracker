<script setup lang="ts">
import RoundTracker from './RoundTracker.vue';
import ElementTracker from './ElementTracker.vue';
import AttackModifierDeck from './AttackModifierDeck.vue';
</script>

<template>
  <aside class="scenario-sidebar">
    <section class="panel">
      <RoundTracker />
    </section>
    <section class="panel">
      <ElementTracker />
    </section>
    <section class="panel">
      <AttackModifierDeck />
    </section>
  </aside>
</template>

<style scoped lang="scss">
.scenario-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--c-bg-elev-1);
  border-right: 1px solid var(--c-border-strong);
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--c-border-strong);
    border-radius: 3px;
  }
}

.panel {
  display: flex;
  flex-direction: column;

  & + .panel {
    padding-top: var(--sp-4);
    border-top: 1px solid var(--c-border);
  }
}
</style>
