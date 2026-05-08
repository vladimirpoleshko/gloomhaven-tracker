<script setup lang="ts">
import { computed } from 'vue';
import type { MonsterStatBlock, MonsterAttribute } from '@/types/monster';

const props = defineProps<{
  normal: MonsterStatBlock;
  elite: MonsterStatBlock;
}>();

interface Row {
  label: string;
  normal: string;
  elite: string;
}

function formatAttributes(attrs?: Partial<Record<MonsterAttribute, number | true>>): string {
  if (!attrs) return '—';
  const parts: string[] = [];
  for (const [k, v] of Object.entries(attrs)) {
    if (v === true) parts.push(k);
    else parts.push(`${k} ${v}`);
  }
  return parts.length ? parts.join(', ') : '—';
}

const rows = computed<Row[]>(() => {
  const rs: Row[] = [
    { label: 'HP', normal: String(props.normal.hp), elite: String(props.elite.hp) },
    { label: 'Move', normal: String(props.normal.move), elite: String(props.elite.move) },
    { label: 'Attack', normal: String(props.normal.attack), elite: String(props.elite.attack) },
  ];
  if (props.normal.range || props.elite.range) {
    rs.push({
      label: 'Range',
      normal: props.normal.range ? String(props.normal.range) : '—',
      elite: props.elite.range ? String(props.elite.range) : '—',
    });
  }
  if (props.normal.attributes || props.elite.attributes) {
    rs.push({
      label: 'Attr.',
      normal: formatAttributes(props.normal.attributes),
      elite: formatAttributes(props.elite.attributes),
    });
  }
  return rs;
});

const immunitiesText = computed(() => {
  const set = new Set<string>([
    ...(props.normal.immunities ?? []),
    ...(props.elite.immunities ?? []),
  ]);
  return [...set].join(', ');
});
</script>

<template>
  <div class="monster-stats">
    <div class="header">
      <span class="col-label">Stat</span>
      <span class="col-normal">Normal</span>
      <span class="col-elite">Elite</span>
    </div>
    <div v-for="row in rows" :key="row.label" class="row">
      <span class="col-label">{{ row.label }}</span>
      <span class="col-normal">{{ row.normal }}</span>
      <span class="col-elite">{{ row.elite }}</span>
    </div>
    <div v-if="immunitiesText" class="immunities">
      <span class="imm-label">Immune:</span>
      <span class="imm-text">{{ immunitiesText }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.monster-stats {
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: var(--sp-2) var(--sp-3);
  font-size: var(--fs-xs);
}

.header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--sp-2);
  padding-bottom: var(--sp-1);
  border-bottom: 1px solid var(--c-border);
  margin-bottom: 4px;

  span {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--c-text-faint);
    font-weight: 600;
  }

  .col-elite {
    color: var(--c-elite);
  }
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--sp-2);
  padding: 2px 0;
  font-family: var(--ff-mono);

  .col-label {
    color: var(--c-text-dim);
    font-size: var(--fs-xs);
  }

  .col-normal {
    color: var(--c-text);
  }

  .col-elite {
    color: var(--c-elite);
    font-weight: 600;
  }
}

.immunities {
  margin-top: var(--sp-1);
  padding-top: var(--sp-1);
  border-top: 1px solid var(--c-border);
  font-size: 10px;
  display: flex;
  gap: 4px;

  .imm-label {
    color: var(--c-text-faint);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .imm-text {
    color: var(--c-text-dim);
    text-transform: capitalize;
  }
}
</style>
