<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  /** URL of the drawn card's image. */
  frontUrl?: string;
  /** URL of the deck's back image, used when no card is drawn. */
  backUrl?: string;
}>();

const showFront = computed(() => Boolean(props.frontUrl));
const src = computed(() => props.frontUrl ?? props.backUrl);
</script>

<template>
  <div class="ability-card" :class="{ 'is-back': !showFront }">
    <img v-if="src" :src="src" class="card-img" alt="" />
    <div v-else class="empty-state">
      <div class="rune">✦</div>
      <div class="empty-label">No image</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ability-card {
  background: var(--c-bg);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--r-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  color: var(--c-text-muted);

  .rune {
    font-size: var(--fs-2xl);
    color: var(--c-text-faint);
  }

  .empty-label {
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
}
</style>
