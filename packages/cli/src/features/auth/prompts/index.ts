import { isCancel, password, select, text } from '@clack/prompts';
import type { DoorayEnvironment } from '@dooray-sdk/core/constants';
import { DOORAY_ENVIRONMENTS } from '@dooray-sdk/core/constants';

import { cancelledError, nonInteractiveError } from '../../../shared/error/cli-errors';

interface InteractivePrompt {
  readProfileName(defaultName: string): Promise<string>;
  readToken(): Promise<string>;
  selectEnvironment(): Promise<DoorayEnvironment>;
}

interface InteractivePromptOptions {
  json?: boolean;
  stdin?: { isTTY?: boolean };
}

export function createInteractivePrompt(options: InteractivePromptOptions = {}): InteractivePrompt {
  const stdin = options.stdin ?? process.stdin;

  function guard(): void {
    if (options.json === true || stdin.isTTY !== true) throw nonInteractiveError();
  }

  function unwrap<T>(value: symbol | T): T {
    if (isCancel(value)) throw cancelledError();
    return value;
  }

  return {
    async readProfileName(defaultName: string) {
      guard();
      const result = unwrap(
        await text({
          defaultValue: defaultName,
          message: 'Profile name',
          placeholder: defaultName,
        }),
      );
      return result.trim();
    },
    async readToken() {
      guard();
      const result = unwrap(
        await password({
          mask: '*',
          message: 'Personal API Token',
          validate: (value) => (value === undefined || value.trim().length === 0 ? 'Enter a token.' : undefined),
        }),
      );
      return result.trim();
    },
    async selectEnvironment() {
      guard();
      return unwrap(
        await select<DoorayEnvironment>({
          message: 'Select an environment',
          options: DOORAY_ENVIRONMENTS.map((env) => ({
            label: `${env.label.padEnd(8)} ${env.baseUrl}`,
            value: env,
          })),
        }),
      );
    },
  };
}
