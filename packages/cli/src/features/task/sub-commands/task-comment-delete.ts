import { runTaskCommentDelete } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { confirmField, requireTaskRef, taskRefShape } from '../../../shared/schema/fields';
import { parseArgsOrThrow, scopeRef } from '../../../shared/schema/parse-args';

export const taskCommentDeleteArgsSchema = requireTaskRef(
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
  args: argsFromSchema(taskCommentDeleteArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Delete a comment from a task (irreversible)', name: 'comment-delete' },
  async run({ api, args, formatter }) {
    const { commentId, yes } = parseArgsOrThrow(taskCommentDeleteArgsSchema, args);

    await confirmDeletion({
      json: isJsonOutput(args.json),
      message: `Delete comment \`${commentId}\`?`,
      skip: yes,
    });

    const { id, projectId } = resolveTaskId(scopeRef(args));
    const result = await runTaskCommentDelete({ api, args: { commentId, id, projectId } });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted comment \`${commentId}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCommentDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
