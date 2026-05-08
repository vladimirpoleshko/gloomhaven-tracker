import type { AttackModifierCard } from '@/types/deck';

/**
 * Build the standard 20-card attack modifier deck.
 *  6× +0
 *  5× +1
 *  5× -1
 *  1× +2
 *  1× -2
 *  1× ×2
 *  1× null
 */
export function buildBaseAttackModifierDeck(): AttackModifierCard[] {
  const cards: AttackModifierCard[] = [];
  let n = 0;
  const nextId = () => `am-${n++}`;

  for (let i = 0; i < 6; i++) cards.push({ id: nextId(), kind: 'plus', value: 0 });
  for (let i = 0; i < 5; i++) cards.push({ id: nextId(), kind: 'plus', value: 1 });
  for (let i = 0; i < 5; i++) cards.push({ id: nextId(), kind: 'minus', value: 1 });
  cards.push({ id: nextId(), kind: 'plus', value: 2 });
  cards.push({ id: nextId(), kind: 'minus', value: 2 });
  cards.push({ id: nextId(), kind: 'multiply' });
  cards.push({ id: nextId(), kind: 'null' });

  return cards;
}

export function makeBlessCard(): AttackModifierCard {
  return { id: `bless-${cryptoId()}`, kind: 'bless' };
}

export function makeCurseCard(): AttackModifierCard {
  return { id: `curse-${cryptoId()}`, kind: 'curse' };
}

function cryptoId(): string {
  // Short unique-enough id for client-side card identity.
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Returns true if drawing this card forces a shuffle at end of round.
 */
export function isShuffleTriggerCard(card: AttackModifierCard): boolean {
  return card.kind === 'multiply' || card.kind === 'null';
}

/**
 * Returns true if this card is single-use (removed when drawn — not put back in deck).
 */
export function isSingleUseCard(card: AttackModifierCard): boolean {
  return card.kind === 'bless' || card.kind === 'curse';
}

/**
 * Human-readable label for display.
 */
export function attackModifierLabel(card: AttackModifierCard): string {
  switch (card.kind) {
    case 'plus':
      return card.value === 0 ? '±0' : `+${card.value}`;
    case 'minus':
      return `−${card.value}`;
    case 'multiply':
      return '×2';
    case 'null':
      return 'NULL';
    case 'bless':
      return 'Bless';
    case 'curse':
      return 'Curse';
  }
}
