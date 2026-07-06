import type { ProjectCheckNameArgs } from '@dooray-sdk/core';
import { runProjectCheckName } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { parseArgsOrThrow } from '../../../shared/schemas/parse-args';

const schema = globalArgsSchema.omit({ ref: true }).extend({
  name: z.string().min(1).meta({ hint: 'text' }).describe('Project name to check.'),
} satisfies CommandSchemaShape<ProjectCheckNameArgs>);

export default defineSubcommand({
  meta: {
    description: 'Check whether a project name is available (unused and within the allowed charset)',
    name: 'check-name',
  },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(schema, args);

    // Throws (name taken / invalid charset) unless the name is available.
    const result = await runProjectCheckName({ api, args: data });

    formatter.printData(result, (r) => renderKeyValue([['name', r.data.name]]));
    formatter.printInfo(`\`${result.data.name}\` is available.`);
  },
  schema,
});
