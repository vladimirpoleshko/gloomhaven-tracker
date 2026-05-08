<script setup lang="ts">
import { computed, ref } from 'vue';
import { MONSTERS } from '@/data/monsters.index';
import { useActiveMonstersStore } from '@/stores/activeMonsters';

const activeStore = useActiveMonstersStore();
const query = ref('');
const isFocused = ref(false);

const matches = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];
  return MONSTERS.filter((m) => m.name.toLowerCase().startsWith(q)).slice(0, 8);
});

const showDropdown = computed(() => isFocused.value && matches.value.length > 0);

function handleSelect(id: string) {
  const wasAdded = activeStore.addMonster(id);
  if (wasAdded) {
    query.value = '';
  }
}

function isAlreadyActive(id: string): boolean {
  return activeStore.hasMonster(id);
}

function handleBlur() {
  // Delay so click on suggestion still fires.
  setTimeout(() => {
    isFocused.value = false;
  }, 150);
}
</script>

<template>
  <div class="monster-search">
    <div class="input-wrap">
      <span class="icon">⌕</span>
      <input
        v-model="query"
        type="text"
        placeholder="Search monsters..."
        class="search-input"
        :disabled="activeStore.isFull"
        @focus="isFocused = true"
        @blur="handleBlur"
      />
      <span v-if="activeStore.isFull" class="full-tag">Grid full</span>
    </div>
    <div v-if="showDropdown" class="dropdown">
      <button
        v-for="m in matches"
        :key="m.id"
        class="suggestion"
        :disabled="isAlreadyActive(m.id) || activeStore.isFull"
        @mousedown.prevent="handleSelect(m.id)"
      >
        <span class="name">{{ m.name }}</span>
        <span v-if="isAlreadyActive(m.id)" class="status">on board</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.monster-search {
  position: relative;
  width: 320px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;

  .icon {
    position: absolute;
    left: var(--sp-3);
    color: var(--c-text-muted);
    font-size: var(--fs-md);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    background: var(--c-bg-elev-1);
    border: 1px solid var(--c-border-strong);
    border-radius: var(--r-sm);
    padding: var(--sp-2) var(--sp-3) var(--sp-2) calc(var(--sp-3) + 16px);
    color: var(--c-text);
    font-size: var(--fs-md);
    transition: border-color var(--transition-fast);

    &:focus {
      outline: none;
      border-color: var(--c-accent);
    }

    &::placeholder {
      color: var(--c-text-faint);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .full-tag {
    position: absolute;
    right: var(--sp-3);
    font-size: var(--fs-xs);
    color: var(--c-danger);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--c-bg-elev-2);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--r-sm);
  z-index: 50;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.suggestion {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  padding: var(--sp-2) var(--sp-3);
  color: var(--c-text);
  font-size: var(--fs-md);
  text-align: left;
  transition: background var(--transition-fast);

  & + .suggestion {
    border-top: 1px solid var(--c-border);
  }

  &:hover:not(:disabled) {
    background: var(--c-accent-soft);
  }

  &:disabled {
    color: var(--c-text-faint);
    cursor: not-allowed;
  }

  .name {
    font-family: var(--ff-display);
    letter-spacing: 0.02em;
  }

  .status {
    font-size: var(--fs-xs);
    color: var(--c-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
}
</style>
