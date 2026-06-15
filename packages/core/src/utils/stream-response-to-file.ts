import { createWriteStream } from 'node:fs';
import { rename, rm, stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export async function streamResponseToFile(
  response: Response,
  outputPath: string,
): Promise<{ path: string; size: number }> {
  if (!response.body) throw new Error('Download response had no body.');

  const tempPath = `${outputPath}.${process.pid}.tmp`;

  try {
    await pipeline(
      Readable.fromWeb(response.body as unknown as Parameters<typeof Readable.fromWeb>[0]),
      createWriteStream(tempPath),
    );
    await rename(tempPath, outputPath);
  } catch (error) {
    await rm(tempPath, { force: true });
    throw error;
  }

  const { size } = await stat(outputPath);

  return { path: outputPath, size };
}
