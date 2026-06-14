import mime from 'mime';

export const DEFAULT_CONTENT_TYPE = 'application/octet-stream';

export function guessContentType(fileName: string): string {
  return mime.getType(fileName) ?? DEFAULT_CONTENT_TYPE;
}
