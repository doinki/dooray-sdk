import { openAsBlob } from 'node:fs';
import { basename } from 'node:path';

import { guessContentType } from './guess-content-type';

export async function buildMultipartFile(
  filePath: string,
  contentType?: string,
  prependFields?: Record<string, string>,
): Promise<FormData> {
  const blob = await openAsBlob(filePath, { type: contentType ?? guessContentType(filePath) });
  const form = new FormData();

  if (prependFields) for (const [name, value] of Object.entries(prependFields)) form.append(name, value);

  form.append('file', blob, basename(filePath));

  return form;
}
