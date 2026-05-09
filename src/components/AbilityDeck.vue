<script setup lang="ts">
import { computed } from 'vue';
import AbilityCard from './AbilityCard.vue';
import { useAbilityDecksStore } from '@/stores/abilityDecks';
import {
  getMonster,
  getArchetype,
  getAbilityCardImage,
  getAbilityCardBackImage,
} from '@/data/monsters.index';

const props = defineProps<{
  monsterId: string;
}>();

const decksStore = useAbilityDecksStore();

const archetype = computed(() => {
  const monster = getMonster(props.monsterId);
  if (!monster) return undefined;
  return getArchetype(monster.abilityArchetype);
});

const currentNumber = computed(() => decksStore.currentCardNumber(props.monsterId));
const drawPileSize = computed(() => decksStore.drawPileSize(props.monsterId));
const totalSize = computed(() => decksStore.deckSize(props.monsterId));
const needsShuffle = computed(() => decksStore.needsShuffle(props.monsterId));

const frontUrl = computed(() => {
  if (!archetype.value || currentNumber.value === null) return undefined;
  return getAbilityCardImage(archetype.value, currentNumber.value);
});

const backUrl = computed(() => {
  if (!archetype.value) return undefined;
  return getAbilityCardBackImage(archetype.value);
});

function handleDraw() {
  decksStore.draw(props.monsterId);
}

function handleShuffle() {
  decksStore.shuffleDeck(props.monsterId);
}
</script>

<template>
  <div class="ability-deck">
    <div class="header">
      <span class="label">Ability Deck</span>
      <span class="counter">
        <span class="remaining">{{ drawPileSize }}</span>
        <span class="divider">/</span>
        <span class="total">{{ totalSize }}</span>
      </span>
    </div>

    <div class="grid">
      <AbilityCard :front-url="frontUrl" :back-url="backUrl" />

      <div class="controls">
        <button
          class="btn btn-primary"
          :disabled="totalSize === 0"
          @click="handleDraw"
        >
          Draw Card
        </button>
        <button
          class="btn btn-ghost"
          :class="{ 'is-pulsing': needsShuffle }"
          :disabled="totalSize === 0"
          @click="handleShuffle"
          title="Shuffle deck"
        >
          ↻
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ability-deck {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .label {
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--c-text-dim);
    font-weight: 600;
  }

  .counter {
    font-family: var(--ff-mono);
    font-size: var(--fs-xs);
    color: var(--c-text-muted);

    .remaining {
      color: var(--c-text);
    }
    .divider {
      margin: 0 2px;
      color: var(--c-text-faint);
    }
  }
}

.grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--sp-2);
}

.controls {
  display: flex;
  flex-direction: column;

  .btn-primary {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    margin-bottom: var(--sp-2);
    flex: 1;
  }
}

.btn {
  border: 1px solid var(--c-border-strong);
  background: var(--c-bg-elev-2);
  color: var(--c-text);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--r-sm);
  font-size: var(--fs-sm);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    border-color: var(--c-accent);
    background: var(--c-bg-elev-3);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &.btn-primary {
    background: var(--c-accent);
    border-color: var(--c-accent);
    color: var(--c-bg);
    font-weight: 600;

    &:hover:not(:disabled) {
      background: var(--c-accent-strong);
      border-color: var(--c-accent-strong);
    }
  }

  &.btn-ghost {
    background: transparent;
  }

  &.is-pulsing {
    border-color: var(--c-warning);
    color: var(--c-warning);
    animation: pulse 1.6s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 var(--c-accent-soft);
  }
  50% {
    box-shadow: 0 0 0 4px transparent;
  }
}
</style>
