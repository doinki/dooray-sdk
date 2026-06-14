const ID = String.raw`\d{19}`;

export const DOORAY_ID_PATTERN = new RegExp(`^${ID}$`);

export const DOORAY_ID_PAIR_PATTERN = new RegExp(`^(${ID})/(${ID})$`);

export function tryParseUrl(ref: string): null | URL {
  try {
    return new URL(ref);
  } catch {
    return null;
  }
}
