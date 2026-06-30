import { runTaskFileList } from '@dooray-sdk/core';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderList } from '../../../shared/utils/table';
import { formatDateTime } from '../../../shared/utils/text';
import { formatCreator } from '../../../shared/utils/user';

const schema = globalArgsSchema;

export default defineSubcommand({
  meta: { description: "List a task's attachments", name: 'file-list' },
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
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (f) => f.id },
    { header: 'name', value: (f) => f.name },
    { header: 'mimeType', value: (f) => f.mimeType },
    { header: 'size', value: (f) => f.size },
    { header: 'author', value: (f) => formatCreator(f.creator) },
    { header: 'createdAt', value: (f) => formatDateTime(f.createdAt) },
  ]);
}
