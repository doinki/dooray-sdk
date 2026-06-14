import { createWriteStream } from 'node:fs';
import { rename, rm, stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import type { DoorayApi } from '@dooray-sdk/client';

import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';

export interface TaskFileDownloadArgs {
  fileId: string;
  id: string;
  outputPath: string;
  projectId?: string;
}

interface TaskFileDownloadContext {
  api: DoorayApi;
  args: TaskFileDownloadArgs;
}

export async function runTaskFileDownload({ api, args }: TaskFileDownloadContext) {
  const projectId = await resolveTaskProjectId(api, args);

  const { response } = await api.projectTaskFile.download({
    path: { fileId: args.fileId, projectId, taskId: args.id },
  });

  if (!response.body) throw new Error('Download response had no body.');

  const tempPath = `${args.outputPath}.${process.pid}.tmp`;

  try {
    await pipeline(
      Readable.fromWeb(response.body as unknown as Parameters<typeof Readable.fromWeb>[0]),
      createWriteStream(tempPath),
    );
    await rename(tempPath, args.outputPath);
  } catch (error) {
    await rm(tempPath, { force: true });
    throw error;
  }

  const { size } = await stat(args.outputPath);

  return {
    data: { path: args.outputPath, size },
  };
}
