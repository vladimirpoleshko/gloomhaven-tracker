<script setup lang="ts">
import { computed } from 'vue';
import type { Monster, MonsterLevel } from '@/types/monster';
import { getStatCardImage } from '@/data/monsters.index';

const props = defineProps<{
  monster: Monster;
  level: MonsterLevel;
}>();

const imageUrl = computed(() => getStatCardImage(props.monster, props.level));

const sideLabel = computed(() => (props.level <= 3 ? 'L0–3' : 'L4–7'));

// Each card has 4 levels arranged around its 4 edges; rotating
// counter-clockwise by 90° per level brings the next level upright.
const rotationDeg = computed(() => -((props.level % 4) * 90));
</script>

<template>
  <figure class="monster-stat-card">
    <div class="card-frame">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="card-img"
        :style="{ transform: `rotate(${rotationDeg}deg)` }"
        :alt="`${monster.name} stat card, level ${level}`"
      />
      <div v-else class="missing">Stat card image not found</div>
    </div>
    <figcaption class="caption">{{ sideLabel }}</figcaption>
  </figure>
</template>

<style scoped lang="scss">
.monster-stat-card {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--c-border-strong);
  border-radius: var(--r-md);
  background: var(--c-bg);
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform var(--transition-med);
}

.missing {
  font-size: var(--fs-xs);
  color: var(--c-text-faint);
  font-style: italic;
  padding: var(--sp-3);
  text-align: center;
}

.caption {
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--c-text-faint);
  text-align: right;
  letter-spacing: 0.08em;
}
</style>
