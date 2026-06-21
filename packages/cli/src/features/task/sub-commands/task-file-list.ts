import { runTaskFileList } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/utils/fields';
import { renderList } from '../../../shared/utils/table';
import { formatDateTime } from '../../../shared/utils/text';

const schema = requireTaskRef(
  z.object({
    ...taskRefShape,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "List a task's attached files", name: 'file-list' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskFileList,
      schema,
    });

    if (result.data.length === 0) formatter.printInfo('No files.');
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (f) => f.id },
    { header: 'name', value: (f) => f.name },
    { header: 'size', value: (f) => f.size },
    { header: 'type', value: (f) => f.mimeType },
    { header: 'created', value: (f) => formatDateTime(f.createdAt) },
  ]);
}
