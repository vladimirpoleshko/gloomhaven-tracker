import type { AttackModifierCard } from '@/types/deck';

const monsterImages = import.meta.glob<string>(
  './attack-modifiers/monster/*.png',
  { eager: true, query: '?url', import: 'default' },
);

const monsterModImages = import.meta.glob<string>(
  './attack-modifiers/monster-mod/*.png',
  { eager: true, query: '?url', import: 'default' },
);

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Resolve the image URL for an attack modifier card.
 * Bless/curse pull from the `monster-mod` folder; everything else
 * pulls from the standard `monster` folder.
 */
export function getAttackModifierCardImage(
  card: AttackModifierCard,
): string | undefined {
  const num = pad2(card.imageNumber);
  if (card.kind === 'bless' || card.kind === 'curse') {
    return monsterModImages[`./attack-modifiers/monster-mod/gh-am-mm-${num}.png`];
  }
  return monsterImages[`./attack-modifiers/monster/gh-am-m-${num}.png`];
}

/** Back image for the standard monster modifier deck. */
export function getAttackModifierBackImage(): string | undefined {
  return monsterImages['./attack-modifiers/monster/gh-am-m-back.png'];
}
