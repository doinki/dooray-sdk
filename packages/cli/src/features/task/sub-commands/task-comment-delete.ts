import { runTaskCommentDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { confirmField, requireTaskRef, taskRefShape } from '../../../shared/utils/fields';

const schema = requireTaskRef(
  z.object({
    ...taskRefShape,
    commentId: z
      .string()
      .min(1)
      .meta({ hint: 'commentId' })
      .describe('Comment id to delete (from `dooray task comment-list`)'),
    yes: confirmField,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Delete a comment from a task (irreversible)', name: 'comment-delete' },
  async run({ api, args, formatter }) {
    const { data } = await runWithTaskScope({
      api,
      args,
      confirm: ({ args: a }) =>
        confirmDeletion({ json: isJsonOutput(args.json), message: `Delete comment \`${a.commentId}\`?`, skip: a.yes }),
      formatter,
      render: renderId,
      run: runTaskCommentDelete,
      schema,
    });

    formatter.printInfo(`Deleted comment \`${data.commentId}\`.`);
  },
});
