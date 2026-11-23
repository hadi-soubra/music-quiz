import { COMPOSERS, ComposerId } from './tracks';

export interface Match {
  composer: ComposerId;
  /** Closest name, but not spelled like an accepted spelling: worth a "Did you mean…?". */
  misspelled: boolean;
}

/**
 * Spellings that count as exact besides each composer's `name`. Accents are ignored,
 * so Händel and Schönberg already match handel / schonberg.
 */
const ALSO_ACCEPTED: Partial<Record<ComposerId, string[]>> = {
  handel: ['haendel'],
  tchaikovsky: ['tchaikovski', 'tschaikowsky', 'tchaikowsky', 'chaikovsky'],
  rachmaninoff: ['rachmaninov'],
  schoenberg: ['schonberg'],
};

const SPELLINGS = COMPOSERS.map((c) => ({
  id: c.id,
  words: [c.name, ...(ALSO_ACCEPTED[c.id] ?? [])].map((s) => words(s).join('')),
}));

/** Lowercase letter-only words, accents stripped: "J.S. Bach" -> ["j", "s", "bach"]. */
function words(text: string): string[] {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);
}

/** Edit distance where swapping two neighbouring letters counts as one slip. */
function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/** How far off a word can be and still be suggested: roughly a third of the name. */
function slipsAllowed(name: string): number {
  return name.length >= 8 ? 3 : name.length >= 5 ? 2 : 1;
}

/**
 * Work out which composer a typed answer means. Any word of the answer can carry the
 * surname, so "Bach", "J.S. Bach" and "Johann Sebastian Bach" all work, and "Mozert"
 * comes back as a misspelled Mozart. Returns null when nothing is close enough, or when
 * two composers are equally close.
 */
export function matchComposer(answer: string): Match | null {
  const typed = words(answer);
  let best: { id: ComposerId; slips: number } | null = null;
  let tied = false;

  for (const { id, words: spellings } of SPELLINGS) {
    for (const spelling of spellings) {
      for (const word of typed) {
        const slips = distance(word, spelling);
        if (slips > slipsAllowed(spelling)) continue;
        if (!best || slips < best.slips) {
          best = { id, slips };
          tied = false;
        } else if (slips === best.slips && id !== best.id) {
          tied = true;
        }
      }
    }
  }

  return best && !tied ? { composer: best.id, misspelled: best.slips > 0 } : null;
}
