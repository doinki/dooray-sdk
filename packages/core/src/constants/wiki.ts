import type { WikiFileType } from '@dooray-sdk/client/wiki';

export const WIKI_FILE_TYPES = ['general', 'inline_image'] as const satisfies readonly WikiFileType[];

export type WikiFileTypeInput = (typeof WIKI_FILE_TYPES)[number];

export const DEFAULT_WIKI_FILE_TYPE: WikiFileTypeInput = 'general';

export const WIKI_SHARED_LINK_STATES = ['valid', 'invalid'] as const;

export type WikiSharedLinkState = (typeof WIKI_SHARED_LINK_STATES)[number];
