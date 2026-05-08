<script setup lang="ts">
import { computed } from 'vue';
import type { AbilityAction, AbilityCard, AttackModifier } from '@/types/monster';

const props = defineProps<{
  card: AbilityCard | null;
  /** When true, render with a "card back" look (no card drawn yet). */
  empty?: boolean;
}>();

const conditionLabels: Record<string, string> = {
  poison: 'Poison',
  wound: 'Wound',
  muddle: 'Muddle',
  stun: 'Stun',
  immobilize: 'Immobilize',
  disarm: 'Disarm',
  invisible: 'Invisible',
  strengthen: 'Strengthen',
};

const elementLabels: Record<string, string> = {
  fire: 'Fire',
  ice: 'Ice',
  air: 'Air',
  earth: 'Earth',
  light: 'Light',
  dark: 'Dark',
};

function formatModifier(mod: AttackModifier): string {
  switch (mod.type) {
    case 'pierce':
      return `Pierce ${mod.value}`;
    case 'push':
      return `Push ${mod.value}`;
    case 'pull':
      return `Pull ${mod.value}`;
    case 'condition':
      return conditionLabels[mod.condition] ?? mod.condition;
    case 'element-infuse':
      return `Infuse ${elementLabels[mod.element] ?? mod.element}`;
    case 'element-consume':
      return `Consume ${elementLabels[mod.element] ?? mod.element}: ${mod.effect}`;
  }
}

function formatAction(a: AbilityAction): string {
  switch (a.type) {
    case 'move':
      return `Move ${a.value}${a.flying ? ' (flying)' : a.jumping ? ' (jumping)' : ''}`;
    case 'attack': {
      const parts = [`Attack ${a.value >= 0 ? '+' : ''}${a.value}`];
      if (a.range) parts.push(`Range ${a.range}`);
      if (a.target && a.target > 1) parts.push(`Target ${a.target}`);
      if (a.aoe) parts.push(a.aoe);
      if (a.modifiers && a.modifiers.length > 0) {
        parts.push(a.modifiers.map(formatModifier).join(', '));
      }
      return parts.join(' • ');
    }
    case 'shield':
      return `Shield ${a.value}${a.target === 'allies' ? ' (allies)' : ''}${a.range ? ` Range ${a.range}` : ''}`;
    case 'heal':
      return `Heal ${a.value}${a.target === 'allies' ? ' (allies)' : ' (self)'}${a.range ? ` Range ${a.range}` : ''}`;
    case 'retaliate':
      return `Retaliate ${a.value}${a.range ? ` Range ${a.range}` : ''}`;
    case 'condition':
      return `${conditionLabels[a.condition] ?? a.condition}${a.target ? ` (${a.target})` : ''}`;
    case 'element':
      return `${a.action === 'infuse' ? 'Infuse' : 'Consume'} ${elementLabels[a.element] ?? a.element}`;
    case 'summon':
      return `Summon ${a.name} (HP ${a.hp}${a.attack ? `, Atk ${a.attack}` : ''}${a.move ? `, Move ${a.move}` : ''})`;
    case 'text':
      return a.value;
  }
}

const actionLines = computed(() => (props.card ? props.card.actions.map(formatAction) : []));
</script>

<template>
  <div class="ability-card" :class="{ 'is-empty': empty }">
    <template v-if="empty || !card">
      <div class="empty-state">
        <div class="rune">✦</div>
        <div class="empty-label">Draw to begin</div>
      </div>
    </template>
    <template v-else>
      <header class="card-header">
        <span class="initiative">{{ String(card.initiative).padStart(2, '0') }}</span>
        <span class="name">{{ card.name }}</span>
        <span v-if="card.shuffle" class="shuffle-mark" title="Shuffle at end of round">↻</span>
      </header>
      <ol class="actions">
        <li v-for="(line, i) in actionLines" :key="i">{{ line }}</li>
      </ol>
    </template>
  </div>
</template>

<style scoped lang="scss">
.ability-card {
  background: linear-gradient(180deg, var(--c-bg-elev-2) 0%, var(--c-bg-elev-1) 100%);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--r-md);
  padding: var(--sp-3);
  min-height: 110px;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--r-md);
    pointer-events: none;
    background: linear-gradient(180deg, var(--c-accent-soft) 0%, transparent 30%);
  }

  &.is-empty {
    background: repeating-linear-gradient(
      45deg,
      var(--c-bg-elev-1),
      var(--c-bg-elev-1) 6px,
      var(--c-bg-elev-2) 6px,
      var(--c-bg-elev-2) 12px
    );
    border-style: dashed;
    border-color: var(--c-border);
  }
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.card-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: var(--sp-2);
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--c-border);

  .initiative {
    font-family: var(--ff-mono);
    font-size: var(--fs-lg);
    color: var(--c-accent);
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .name {
    font-family: var(--ff-display);
    font-size: var(--fs-md);
    color: var(--c-text);
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .shuffle-mark {
    color: var(--c-warning);
    font-size: var(--fs-md);
    font-weight: bold;
  }
}

.actions {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);

  li {
    font-size: var(--fs-sm);
    color: var(--c-text);
    line-height: 1.45;
    padding-left: var(--sp-3);
    position: relative;

    &::before {
      content: '◆';
      position: absolute;
      left: 0;
      color: var(--c-accent);
      font-size: 8px;
      top: 4px;
    }
  }
}
</style>
