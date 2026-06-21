import type { ProjectCheckNameArgs } from '@dooray-sdk/core';
import { runProjectCheckName } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { parseArgsOrThrow } from '../../../shared/utils/parse-args';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'text' })
    .describe(
      'Candidate project name to validate. Must be unique in the tenant and use allowed characters (Korean/Chinese/Japanese/English/digits and limited symbols)',
    ),
} satisfies Record<keyof ProjectCheckNameArgs, any>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: 'Check whether a project name can be created (available / invalid / taken)',
    name: 'check-name',
  },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(schema, args);

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
