import type {
  Monster,
  AbilityArchetype,
  MonsterLevel,
} from '@/types/monster';

/**
 * Image manifests, populated by Vite at build time.
 * Each value is the URL of the asset.
 */
const statCardImages = import.meta.glob<string>(
  './monster-stat-cards/gloomhaven/*.png',
  { eager: true, query: '?url', import: 'default' },
);

const abilityCardImages = import.meta.glob<string>(
  './monster-ability-cards/gloomhaven/**/*.png',
  { eager: true, query: '?url', import: 'default' },
);

/**
 * Source of truth for the monsters available in the search dropdown.
 *
 * `id` matches the stat-card filename slug — the stat card images are
 *   `gh-<id>-0.png` (levels 0-3) and `gh-<id>-4.png` (levels 4-7).
 *
 * `abilityArchetype` is the shared deck used by this monster — for
 *   example all archers (bandit/city/inox) point to `archer`.
 *
 * Entries marked `TODO confirm` were guessed; verify the archetype is
 * correct against the physical card you intend to use.
 */
const MONSTERS_DATA: { id: string; name: string; abilityArchetype: string }[] = [
  { id: 'ancient-artillery',    name: 'Ancient Artillery',    abilityArchetype: 'ancient-artillery' },
  { id: 'bandit-archer',        name: 'Bandit Archer',        abilityArchetype: 'archer' },
  { id: 'bandit-commander',     name: 'Bandit Commander',     abilityArchetype: 'boss' }, // TODO confirm
  { id: 'bandit-guard',         name: 'Bandit Guard',         abilityArchetype: 'guard' },
  { id: 'black-imp',            name: 'Black Imp',            abilityArchetype: 'imp' },
  { id: 'captain-of-the-guard', name: 'Captain of the Guard', abilityArchetype: 'boss' }, // TODO confirm
  { id: 'cave-bear',            name: 'Cave Bear',            abilityArchetype: 'cave-bear' },
  { id: 'city-archer',          name: 'City Archer',          abilityArchetype: 'archer' },
  { id: 'city-guard',           name: 'City Guard',           abilityArchetype: 'guard' },
  { id: 'cultist',              name: 'Cultist',              abilityArchetype: 'cultist' },
  { id: 'dark-rider',           name: 'Dark Rider',           abilityArchetype: 'boss' }, // TODO confirm
  { id: 'deep-terror',          name: 'Deep Terror',          abilityArchetype: 'deep-terror' },
  { id: 'earth-demon',          name: 'Earth Demon',          abilityArchetype: 'earth-demon' },
  { id: 'elder-drake',          name: 'Elder Drake',          abilityArchetype: 'boss' }, // TODO confirm
  { id: 'flame-demon',          name: 'Flame Demon',          abilityArchetype: 'flame-demon' },
  { id: 'forest-imp',           name: 'Forest Imp',           abilityArchetype: 'imp' },
  { id: 'frost-demon',          name: 'Frost Demon',          abilityArchetype: 'frost-demon' },
  { id: 'giant-viper',          name: 'Giant Viper',          abilityArchetype: 'giant-viper' },
  { id: 'harrower-infester',    name: 'Harrower Infester',    abilityArchetype: 'harrower-infester' },
  { id: 'hound',                name: 'Hound',                abilityArchetype: 'hound' },
  { id: 'inox-archer',          name: 'Inox Archer',          abilityArchetype: 'archer' },
  { id: 'inox-bodyguard',       name: 'Inox Bodyguard',       abilityArchetype: 'guard' }, // TODO confirm
  { id: 'inox-guard',           name: 'Inox Guard',           abilityArchetype: 'guard' },
  { id: 'inox-shaman',          name: 'Inox Shaman',          abilityArchetype: 'shaman' },
  { id: 'jekserah',             name: 'Jekserah',             abilityArchetype: 'boss' },
  { id: 'living-bones',         name: 'Living Bones',         abilityArchetype: 'living-bones' },
  { id: 'living-corpse',        name: 'Living Corpse',        abilityArchetype: 'living-corpse' },
  { id: 'living-spirit',        name: 'Living Spirit',        abilityArchetype: 'living-spirit' },
  { id: 'lurker',               name: 'Lurker',               abilityArchetype: 'lurker' },
  { id: 'merciless-overseer',   name: 'Merciless Overseer',   abilityArchetype: 'boss' }, // TODO confirm
  { id: 'night-demon',          name: 'Night Demon',          abilityArchetype: 'night-demon' },
  { id: 'ooze',                 name: 'Ooze',                 abilityArchetype: 'ooze' },
  { id: 'prime-demon',          name: 'Prime Demon',          abilityArchetype: 'boss' },
  { id: 'rending-drake',        name: 'Rending Drake',        abilityArchetype: 'rending-drake' },
  { id: 'savvas-icestorm',      name: 'Savvas Icestorm',      abilityArchetype: 'savvas-icestorm' },
  { id: 'savvas-lavaflow',      name: 'Savvas Lavaflow',      abilityArchetype: 'savvas-lavaflow' },
  { id: 'spitting-drake',       name: 'Spitting Drake',       abilityArchetype: 'spitting-drake' },
  { id: 'stone-golem',          name: 'Stone Golem',          abilityArchetype: 'stone-golem' },
  { id: 'sun-demon',            name: 'Sun Demon',            abilityArchetype: 'sun-demon' },
  { id: 'the-betrayer',         name: 'The Betrayer',         abilityArchetype: 'boss' },
  { id: 'the-colorless',        name: 'The Colorless',        abilityArchetype: 'boss' },
  { id: 'the-gloom',            name: 'The Gloom',            abilityArchetype: 'boss' },
  { id: 'the-sightless-eye',    name: 'The Sightless Eye',    abilityArchetype: 'boss' },
  { id: 'vermling-scout',       name: 'Vermling Scout',       abilityArchetype: 'scout' },
  { id: 'vermling-shaman',      name: 'Vermling Shaman',      abilityArchetype: 'shaman' },
  { id: 'wind-demon',           name: 'Wind Demon',           abilityArchetype: 'wind-demon' },
  { id: 'winged-horror',        name: 'Winged Horror',        abilityArchetype: 'boss' },
];

/**
 * Card numbers (1-8) per archetype that carry the shuffle symbol.
 * Fill in as you confirm against the physical cards. Missing = no
 * auto-shuffle prompt; the DM can shuffle manually.
 */
const ARCHETYPE_SHUFFLE_OVERRIDES: Record<string, number[]> = {
  // Example: 'archer': [3, 7],
};

/**
 * Builds the archetype list by scanning ability-card image filenames.
 * Filenames look like `./monster-ability-cards/gloomhaven/<id>/gh-ma-<abbrev>-<n>.png`.
 */
function buildArchetypes(): AbilityArchetype[] {
  const seen = new Map<string, AbilityArchetype>();
  for (const key of Object.keys(abilityCardImages)) {
    const m = key.match(/\/gloomhaven\/([^/]+)\/gh-ma-([^-]+)-/);
    if (!m) continue;
    const id = m[1];
    const abbrev = m[2];
    if (!id || !abbrev) continue;
    if (!seen.has(id)) {
      seen.set(id, {
        id,
        abbrev,
        shuffleCards: ARCHETYPE_SHUFFLE_OVERRIDES[id] ?? [],
      });
    }
  }
  return [...seen.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export const ARCHETYPES: AbilityArchetype[] = buildArchetypes();

const ARCHETYPES_BY_ID: Record<string, AbilityArchetype> = ARCHETYPES.reduce(
  (acc, a) => {
    acc[a.id] = a;
    return acc;
  },
  {} as Record<string, AbilityArchetype>,
);

export const MONSTERS: Monster[] = MONSTERS_DATA.slice().sort((a, b) =>
  a.name.localeCompare(b.name),
);

const MONSTERS_BY_ID: Record<string, Monster> = MONSTERS.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<string, Monster>,
);

export function getMonster(id: string): Monster | undefined {
  return MONSTERS_BY_ID[id];
}

export function getArchetype(id: string): AbilityArchetype | undefined {
  return ARCHETYPES_BY_ID[id];
}

/**
 * Stat card image URL for a monster at a level.
 * Levels 0-3 use the "-0" side; 4-7 use the "-4" side.
 */
export function getStatCardImage(
  monster: Monster,
  level: MonsterLevel,
): string | undefined {
  const side = level <= 3 ? 0 : 4;
  return statCardImages[
    `./monster-stat-cards/gloomhaven/gh-${monster.id}-${side}.png`
  ];
}

/** Front face image URL for ability card #n in an archetype's deck. */
export function getAbilityCardImage(
  archetype: AbilityArchetype,
  number: number,
): string | undefined {
  return abilityCardImages[
    `./monster-ability-cards/gloomhaven/${archetype.id}/gh-ma-${archetype.abbrev}-${number}.png`
  ];
}

/** Back face image URL for an archetype's deck. */
export function getAbilityCardBackImage(
  archetype: AbilityArchetype,
): string | undefined {
  return abilityCardImages[
    `./monster-ability-cards/gloomhaven/${archetype.id}/gh-ma-${archetype.abbrev}-back.png`
  ];
}

/** Card numbers in every archetype's deck. */
export const DECK_CARD_NUMBERS: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8];
