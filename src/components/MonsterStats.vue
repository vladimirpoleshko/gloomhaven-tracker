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
</script>

<template>
  <figure class="monster-stat-card">
    <img v-if="imageUrl" :src="imageUrl" class="card-img" :alt="`${monster.name} stat card`" />
    <div v-else class="missing">Stat card image not found</div>
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

.card-img {
  width: 100%;
  height: auto;
  display: block;
  border: 1px solid var(--c-border-strong);
  border-radius: var(--r-md);
  background: var(--c-bg);
}

.missing {
  font-size: var(--fs-xs);
  color: var(--c-text-faint);
  font-style: italic;
  padding: var(--sp-3);
  text-align: center;
  border: 1px dashed var(--c-border);
  border-radius: var(--r-md);
}

.caption {
  font-family: var(--ff-mono);
  font-size: 10px;
  color: var(--c-text-faint);
  text-align: right;
  letter-spacing: 0.08em;
}
</style>
