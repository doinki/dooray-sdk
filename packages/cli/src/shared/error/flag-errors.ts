import { DoorayError } from '@dooray-sdk/core/errors';

export function flagValueError(flag: string, value: string, hint: string): DoorayError {
  return new DoorayError({
    code: 'validation',
    hint,
    message: `Invalid value for ${flag}: \`${value}\`.`,
  });
}

export interface FlagIssue {
  flag: string;
  message: string;
  value: string;
}

/** All invalid flags at once — one line per flag in the hint, so users fix everything in a single retry. */
export function flagValuesError(issues: readonly FlagIssue[]): DoorayError {
  return new DoorayError({
    code: 'validation',
    hint: issues.map(({ flag, message }) => `${flag}: ${message}`).join('\n'),
    message: `Invalid values for ${issues.map(({ flag }) => flag).join(', ')}.`,
  });
}
