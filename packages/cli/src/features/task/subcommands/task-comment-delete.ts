import type { TaskCommentDeleteArgs } from '@dooray-sdk/core';
import { runTaskCommentDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmField } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { yesSchema } from '../../../shared/schemas/fields';

const schema = globalArgsSchema.extend({
  commentId: z
    .string()
    .min(1)
    .meta({ hint: 'commentId', positional: true })
    .describe('Comment id (from `dooray task comment-list`).'),
  yes: yesSchema,
} satisfies CommandSchemaShape<TaskCommentDeleteArgs>);

export default defineSubcommand({
  meta: { description: 'Delete a task comment (irreversible)', name: 'comment-delete' },
  async run({ api, args, formatter }) {
    const { data } = await runWithTaskScope({
      api,
      args,
      confirm: confirmField(({ args }) => `Delete comment \`${args.commentId}\`?`),
      formatter,
      render: renderId,
      run: runTaskCommentDelete,
      schema,
    });

    formatter.printInfo(`Deleted comment \`${data.commentId}\`.`);
  },
  schema,
});
