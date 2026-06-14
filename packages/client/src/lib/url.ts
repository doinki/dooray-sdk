export function url(strings: TemplateStringsArray, ...values: Array<number | string>): string {
  return strings.reduce((acc, s, i) => {
    if (i >= values.length) return acc + s;

    const value = values[i];
    if (value == null || value === '')
      throw new TypeError(`url: invalid path segment at position ${i}: ${JSON.stringify(value)}`);

    return acc + s + encodeURIComponent(value);
  }, '');
}
