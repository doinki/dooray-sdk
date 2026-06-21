import { runProjectTagGroupUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';

export const tagGroupUpdateArgsSchema = z.object({
  id: z
    .string()
    .min(1)
    .meta({ hint: 'tagGroupId', positional: true })
    .describe('Tag group id (the `tagGroup.id` shown in `tag-list`)'),
  required: z.boolean().optional().describe('required = a tag from this group is mandatory on task creation'),
  singleSelect: z
    .boolean()
    .optional()
    .describe('single-select = at most one tag from this group can be assigned to a task'),
});

export default defineSubcommand({
  args: argsFromSchema(tagGroupUpdateArgsSchema),
  meta: {
    description: "Update a tag group's constraints (required / single-select)",
    name: 'tag-group-update',
  },
  async run({ api, args, formatter }) {
    await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runProjectTagGroupUpdate,
      schema: tagGroupUpdateArgsSchema,
    });
  },
});
