import { runProjectCheckName } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const projectCheckNameArgsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .describe(
      'Candidate project name to validate. Must be unique in the tenant and use allowed characters (Korean/Chinese/Japanese/English/digits and limited symbols)',
    ),
});

export default defineSubcommand({
  args: {
    name: {
      description: projectCheckNameArgsSchema.shape.name.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: 'Check whether a project name can be created (available / invalid / taken)',
    name: 'check-name',
  },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(projectCheckNameArgsSchema, args);

    const result = await runProjectCheckName({
      api,
      args: data,
    });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Project name \`${data.name}\` is available.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectCheckName>>): string {
  return renderKeyValue([['Name', data.name]]);
}
