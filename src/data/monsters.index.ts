import type { Monster } from '@/types/monster';
import banditGuard from './monsters/bandit-guard.json';
import livingBones from './monsters/living-bones.json';
import stoneGolem from './monsters/stone-golem.json';
import cultist from './monsters/cultist.json';

/**
 * Add new monsters by:
 *   1. Creating a JSON file in ./monsters/ following the schema in src/types/monster.ts
 *   2. Importing it here and adding to the array below
 *
 * Note: the JSON data shipped with the project is illustrative — verify stat
 * blocks and ability decks against authoritative sources before using in play.
 */
const allMonsters: Monster[] = [
  banditGuard as unknown as Monster,
  livingBones as unknown as Monster,
  stoneGolem as unknown as Monster,
  cultist as unknown as Monster,
];

export const MONSTERS: Monster[] = allMonsters
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name));

export const MONSTERS_BY_ID: Record<string, Monster> = MONSTERS.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<string, Monster>
);

export function getMonster(id: string): Monster | undefined {
  return MONSTERS_BY_ID[id];
}
