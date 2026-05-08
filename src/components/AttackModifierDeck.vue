<script setup lang="ts">
import { computed } from 'vue';
import { useAttackModifierStore, MAX_BLESS, MAX_CURSE } from '@/stores/attackModifier';
import { attackModifierLabel } from '@/utils/attackModifierDeck';
import type { AttackModifierCard } from '@/types/deck';

const amStore = useAttackModifierStore();

const currentCard = computed<AttackModifierCard | null>(() => amStore.currentCard);
const cardLabel = computed(() => (currentCard.value ? attackModifierLabel(currentCard.value) : '—'));
const cardKind = computed(() => currentCard.value?.kind ?? 'empty');
</script>

<template>
  <div class="am-deck">
    <div class="header">
      <span class="label">Attack Modifier</span>
      <span class="counter">
        <span class="remaining">{{ amStore.drawPileSize }}</span>
        <span class="divider">/</span>
        <span class="total">{{ amStore.drawPileSize + amStore.discardPileSize }}</span>
      </span>
    </div>

    <div class="card-display" :class="`kind-${cardKind}`">
      <span class="card-text">{{ cardLabel }}</span>
      <span v-if="amStore.needsShuffle" class="shuffle-flag" title="Shuffle at end of round">↻</span>
    </div>

    <div class="primary-controls">
      <button class="btn btn-primary" @click="amStore.draw">Draw</button>
      <button
        class="btn btn-ghost"
        :class="{ 'is-pulsing': amStore.needsShuffle }"
        @click="amStore.shuffleDeck"
      >
        Shuffle
      </button>
    </div>

    <div class="modifiers">
      <div class="mod-row">
        <span class="mod-label">Bless</span>
        <div class="mod-controls">
          <button
            class="mod-btn"
            :disabled="amStore.blessCount === 0"
            @click="amStore.removeBless"
          >−</button>
          <span class="mod-count">{{ amStore.blessCount }}</span>
          <button
            class="mod-btn"
            :disabled="amStore.blessCount >= MAX_BLESS"
            @click="amStore.addBless"
          >+</button>
        </div>
      </div>
      <div class="mod-row">
        <span class="mod-label">Curse</span>
        <div class="mod-controls">
          <button
            class="mod-btn"
            :disabled="amStore.curseCount === 0"
            @click="amStore.removeCurse"
          >−</button>
          <span class="mod-count">{{ amStore.curseCount }}</span>
          <button
            class="mod-btn"
            :disabled="amStore.curseCount >= MAX_CURSE"
            @click="amStore.addCurse"
          >+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.am-deck {
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

.card-display {
  background: linear-gradient(180deg, var(--c-bg-elev-2) 0%, var(--c-bg-elev-1) 100%);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--r-md);
  padding: var(--sp-4);
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .card-text {
    font-family: var(--ff-display);
    font-size: var(--fs-2xl);
    font-weight: 700;
    color: var(--c-text);
    letter-spacing: 0.04em;
  }

  .shuffle-flag {
    position: absolute;
    top: var(--sp-2);
    right: var(--sp-2);
    color: var(--c-warning);
    font-size: var(--fs-md);
    font-weight: 700;
  }

  &.kind-multiply .card-text {
    color: var(--c-accent-strong);
  }

  &.kind-null .card-text {
    color: var(--c-danger);
  }

  &.kind-bless .card-text {
    color: var(--c-light);
  }

  &.kind-curse .card-text {
    color: var(--c-dark);
  }
}

.primary-controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--sp-2);
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

  &.btn-primary {
    background: var(--c-accent);
    border-color: var(--c-accent);
    color: var(--c-bg);
    font-weight: 600;

    &:hover {
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
    animation: pulse-am 1.6s ease-in-out infinite;
  }
}

@keyframes pulse-am {
  0%, 100% {
    box-shadow: 0 0 0 0 var(--c-accent-soft);
  }
  50% {
    box-shadow: 0 0 0 4px transparent;
  }
}

.modifiers {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: var(--sp-2);
  border-top: 1px solid var(--c-border);
}

.mod-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
}

.mod-label {
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--c-text-dim);
  font-weight: 600;
}

.mod-controls {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
}

.mod-btn {
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

  &:hover:not(:disabled) {
    border-color: var(--c-accent);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.mod-count {
  font-family: var(--ff-mono);
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--c-text);
  min-width: 24px;
  text-align: center;
}
</style>
