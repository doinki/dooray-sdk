import { password, select, text } from '@clack/prompts';
import type { DoorayEnvironment } from '@dooray-sdk/core/constants';
import { DOORAY_ENVIRONMENTS } from '@dooray-sdk/core/constants';

import { nonInteractiveError } from '../../../shared/error/cli-errors';
import { assertInteractive, unwrapPrompt } from '../../../shared/prompts/interactive';

interface AuthLoginPromptOptions {
  json?: boolean;
  stdin?: { isTTY?: boolean };
}

export class AuthLoginPrompt {
  private readonly json: boolean;
  private readonly stdin: { isTTY?: boolean };

  public constructor(options: AuthLoginPromptOptions = {}) {
    this.json = options.json === true;
    this.stdin = options.stdin ?? process.stdin;
  }

  public async readProfileName(defaultName: string): Promise<string> {
    this.guard();
    const result = unwrapPrompt(
      await text({
        defaultValue: defaultName,
        message: 'Profile name',
        placeholder: defaultName,
      }),
    );
    return result.trim();
  }

  public async readToken(): Promise<string> {
    this.guard();
    const result = unwrapPrompt(
      await password({
        mask: '*',
        message: 'Personal API Token',
        validate: (value) => (value === undefined || value.trim().length === 0 ? 'Enter a token.' : undefined),
      }),
    );
    return result.trim();
  }

  public async selectEnvironment(): Promise<DoorayEnvironment> {
    this.guard();
    return unwrapPrompt(
      await select<DoorayEnvironment>({
        message: 'Select an environment',
        options: DOORAY_ENVIRONMENTS.map((env) => ({
          label: `${env.label.padEnd(8)} ${env.baseUrl}`,
          value: env,
        })),
      }),
    );
  }

  private guard(): void {
    assertInteractive({ json: this.json, stdin: this.stdin }, nonInteractiveError);
  }
}
