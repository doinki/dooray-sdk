import { openAsBlob } from 'node:fs';
import { basename } from 'node:path';

import { guessContentType } from './guess-content-type';

export async function buildMultipartFile(filePath: string, contentType?: string): Promise<FormData> {
  const blob = await openAsBlob(filePath, { type: contentType ?? guessContentType(filePath) });
  const form = new FormData();

  form.append('file', blob, basename(filePath));

  return form;
}
