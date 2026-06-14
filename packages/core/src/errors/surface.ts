export const SURFACE_ERROR_CODES = [
  'cancelled',
  'network',
  'rate_limited',
  'unauthorized',
  'server',
  'validation',
] as const;

export type SurfaceErrorCode = (typeof SURFACE_ERROR_CODES)[number];

export interface SurfaceError {
  code: SurfaceErrorCode;
  hint?: string;
  message: string;
}

export class DoorayError extends Error implements SurfaceError {
  public readonly code: SurfaceErrorCode;
  public readonly hint?: string;

  public constructor(input: SurfaceError) {
    super(input.message);
    this.name = 'DoorayError';
    this.code = input.code;
    this.hint = input.hint;
  }
}

export function isDoorayError(value: unknown): value is DoorayError {
  return value instanceof DoorayError;
}
