import { DoorayError } from '@dooray-sdk/core/errors';

export function noActiveProfileError(): DoorayError {
  return new DoorayError({
    code: 'validation',
    hint: 'Log in first with `dooray auth login`.',
    message: 'No active profile.',
  });
}

export function unknownProfileError(name: string): DoorayError {
  return new DoorayError({
    code: 'validation',
    hint: 'Use `dooray profile list` to see registered profiles.',
    message: `Not a registered profile: \`${name}\`.`,
  });
}
