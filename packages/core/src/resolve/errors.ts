export class RefError extends Error {
  public readonly ref?: string;

  public constructor(ref?: string) {
    super(`Cannot parse ref: \`${ref}\`.`);
    this.name = 'RefError';
    this.ref = ref;
  }
}
