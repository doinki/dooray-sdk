import { runProjectTagCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  color: z.string().trim().min(1).meta({ hint: 'rrggbb' }).describe('6-digit hex color without `#` (e.g. `ffffff`)'),
  name: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'text' })
    .describe('Tag name. Use `<group>:<tag>` (e.g. `Priority:High`) to create the tag inside a tag group'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Create a tag (use `group:tag` to nest it under a tag group)', name: 'tag-create' },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runProjectTagCreate,
      schema,
    });

    formatter.printInfo(`Created tag \`${data.name}\`.`);
  },
});
