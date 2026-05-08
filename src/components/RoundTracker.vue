<script setup lang="ts">
import { computed } from 'vue';
import { useScenarioStore } from '@/stores/scenario';
import { useAbilityDecksStore } from '@/stores/abilityDecks';
import { useAttackModifierStore } from '@/stores/attackModifier';

const scenarioStore = useScenarioStore();
const decksStore = useAbilityDecksStore();
const amStore = useAttackModifierStore();

/**
 * End-of-round flow per Gloomhaven rules:
 *   1. Increment round counter
 *   2. Decay elements one step (handled inside scenarioStore.incrementRound)
 *   3. Shuffle any monster ability decks flagged for shuffle
 *   4. Shuffle attack modifier deck if flagged for shuffle
 */
function handleEndOfRound() {
  scenarioStore.incrementRound();
  decksStore.shuffleAllPending();
  if (amStore.needsShuffle) amStore.shuffleDeck();
}

const anyDeckNeedsShuffle = computed(() => {
  if (amStore.needsShuffle) return true;
  for (const id in decksStore.decks) {
    if (decksStore.decks[id]?.needsShuffle) return true;
  }
  return false;
});
</script>

<template>
  <div class="round-tracker">
    <div class="round-display">
      <span class="round-label">Round</span>
      <div class="round-controls">
        <button class="round-btn" @click="scenarioStore.decrementRound">−</button>
        <span class="round-num">{{ scenarioStore.round }}</span>
        <button class="round-btn" @click="scenarioStore.incrementRound">+</button>
      </div>
    </div>
    <button
      class="end-round-btn"
      :class="{ 'has-pending': anyDeckNeedsShuffle }"
      @click="handleEndOfRound"
    >
      <span>End of Round</span>
      <span v-if="anyDeckNeedsShuffle" class="indicator" title="Shuffles pending">↻</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.round-tracker {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.round-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--c-bg-elev-2);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--r-sm);
  padding: var(--sp-2) var(--sp-3);
}

.round-label {
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--c-text-dim);
  font-weight: 600;
}

.round-controls {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.round-btn {
  width: 22px;
  height: 22px;
  background: var(--c-bg);
  border: 1px solid var(--c-border-strong);
  color: var(--c-text);
  font-size: var(--fs-md);
  font-weight: 700;
  line-height: 1;
  border-radius: var(--r-sm);
  padding: 0;

  &:hover {
    border-color: var(--c-accent);
  }
}

.round-num {
  font-family: var(--ff-mono);
  font-size: var(--fs-lg);
  font-weight: 700;
  color: var(--c-accent);
  min-width: 32px;
  text-align: center;
}

.end-round-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  background: var(--c-accent);
  color: var(--c-bg);
  border: 1px solid var(--c-accent);
  border-radius: var(--r-sm);
  font-size: var(--fs-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--c-accent-strong);
  }

  &.has-pending {
    box-shadow: 0 0 0 1px var(--c-warning);
  }

  .indicator {
    font-size: var(--fs-md);
  }
}
</style>
