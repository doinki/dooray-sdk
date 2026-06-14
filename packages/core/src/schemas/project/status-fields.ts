import { z } from 'zod';

import { STATUS_CLASSES, STATUS_LOCALES } from '../../constants/status';

export const statusClassSchema = z
  .enum(STATUS_CLASSES)
  .describe(
    'Status class — backlog: 대기 (not yet started); registered: 등록/할 일 (todo); working: 진행 (in progress); closed: 완료 (done)',
  );

export const localeNamesSchema = z
  .array(
    z.object({
      locale: z.enum(STATUS_LOCALES).describe(`Locale code. Allowed: ${STATUS_LOCALES.join(', ')}`),
      name: z.string().min(1).describe('Display name for the locale'),
    }),
  )
  .optional()
  .describe('Per-locale display names. Allowed locales: en_US, ja_JP, ko_KR, zh_CN');
