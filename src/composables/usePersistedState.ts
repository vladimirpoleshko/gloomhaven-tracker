import { watch } from 'vue';
import type { Pinia, Store } from 'pinia';

const STORAGE_PREFIX = 'gh-tracker:';

/**
 * Persist a Pinia store's state to localStorage.
 * Call once per store after Pinia is installed.
 *
 * The store's $state is hydrated synchronously from localStorage on init,
 * and saved on every mutation (debounced via watch's natural batching).
 */
export function persistStore<S extends Store>(store: S, key: string): void {
  const storageKey = `${STORAGE_PREFIX}${key}`;

  // Hydrate from storage if present.
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      store.$patch(parsed);
    }
  } catch (err) {
    console.warn(`[persist] failed to hydrate ${key}:`, err);
  }

  // Persist on changes.
  watch(
    () => store.$state,
    (state) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (err) {
        console.warn(`[persist] failed to save ${key}:`, err);
      }
    },
    { deep: true }
  );
}

export function clearAllPersistedState(): void {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}

// Pinia is needed in the type signature only; here for re-export convenience.
export type { Pinia };
