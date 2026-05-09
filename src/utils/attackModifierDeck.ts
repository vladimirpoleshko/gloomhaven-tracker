import type { AttackModifierCard } from '@/types/deck';

/**
 * Build the standard 20-card attack modifier deck.
 *  6× +0   (image 01–06)
 *  5× +1   (image 07–11)
 *  5× -1   (image 12–16)
 *  1× -2   (image 17)
 *  1× +2   (image 18)
 *  1× null (image 19)
 *  1× ×2   (image 20)
 */
export function buildBaseAttackModifierDeck(): AttackModifierCard[] {
  const cards: AttackModifierCard[] = [];
  let n = 0;
  const nextId = () => `am-${n++}`;

  for (let i = 0; i < 6; i++) {
    cards.push({ id: nextId(), kind: 'plus', value: 0, imageNumber: i + 1 });
  }
  for (let i = 0; i < 5; i++) {
    cards.push({ id: nextId(), kind: 'plus', value: 1, imageNumber: i + 7 });
  }
  for (let i = 0; i < 5; i++) {
    cards.push({ id: nextId(), kind: 'minus', value: 1, imageNumber: i + 12 });
  }
  cards.push({ id: nextId(), kind: 'minus', value: 2, imageNumber: 17 });
  cards.push({ id: nextId(), kind: 'plus', value: 2, imageNumber: 18 });
  cards.push({ id: nextId(), kind: 'null', imageNumber: 19 });
  cards.push({ id: nextId(), kind: 'multiply', imageNumber: 20 });

  return cards;
}

/** Bless deck only ships one image. */
const BLESS_IMAGE_NUMBER = 11;
/** Curse deck has 10 art variants — pick one at random per card. */
const CURSE_IMAGE_COUNT = 10;

export function makeBlessCard(): AttackModifierCard {
  return { id: `bless-${cryptoId()}`, kind: 'bless', imageNumber: BLESS_IMAGE_NUMBER };
}

export function makeCurseCard(): AttackModifierCard {
  const imageNumber = 1 + Math.floor(Math.random() * CURSE_IMAGE_COUNT);
  return { id: `curse-${cryptoId()}`, kind: 'curse', imageNumber };
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
