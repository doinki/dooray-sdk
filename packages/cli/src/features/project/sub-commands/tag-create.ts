import { runProjectTagCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const tagCreateArgsSchema = z.object({
  color: z.string().trim().min(1).describe('6-digit hex color without `#` (e.g. `ffffff`)'),
  name: z
    .string()
    .trim()
    .min(1)
    .describe('Tag name. Use `<group>:<tag>` (e.g. `Priority:High`) to create the tag inside a tag group'),
});

export default defineSubcommand({
  args: {
    color: {
      description: tagCreateArgsSchema.shape.color.description,
      required: true,
      type: 'string',
      valueHint: 'rrggbb',
    },
    name: {
      description: tagCreateArgsSchema.shape.name.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
  },
  meta: { description: 'Create a tag (use `group:tag` to nest it under a tag group)', name: 'tag-create' },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectTagCreate,
      schema: tagCreateArgsSchema,
    });

    formatter.printInfo(`Created tag \`${data.name}\`.`);
  },
});

function renderPretty({ data: result }: Awaited<ReturnType<typeof runProjectTagCreate>>): string {
  return renderKeyValue([['ID', result.id]]);
}
