import { runWikiMove } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';

export const wikiMoveArgsSchema = z
  .object({
    beforeId: z
      .string()
      .trim()
      .optional()
      .describe('Sibling page id to order this page after (from `dooray wiki list`)'),
    id: z
      .string()
      .optional()
      .describe('Wiki page ID (19-digit). Looked up across all accessible wikis when given alone.'),
    includeSubPages: z.boolean().optional().describe('Move child pages along too (default: true)'),
    parentId: z.string().min(1).describe('Destination parent page id (from `dooray wiki list`)'),
    ref: z
      .string()
      .optional()
      .describe(
        'Wiki page to target instead of <pageId>: a 19-digit page ID, `<projectId>/<id>`, or a Dooray wiki URL.',
      ),
    targetProjectId: z
      .string()
      .trim()
      .optional()
      .describe('Destination project id when moving to another wiki (from `dooray wiki project-list`)'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    'before-id': {
      description: wikiMoveArgsSchema.shape.beforeId.description,
      type: 'string',
      valueHint: 'pageId',
    },
    id: {
      description: wikiMoveArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    'include-sub-pages': {
      description: wikiMoveArgsSchema.shape.includeSubPages.description,
      type: 'boolean',
    },
    'parent-id': {
      description: wikiMoveArgsSchema.shape.parentId.description,
      required: true,
      type: 'string',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiMoveArgsSchema.shape.ref.description, required: false },
    'target-project-id': {
      description: wikiMoveArgsSchema.shape.targetProjectId.description,
      type: 'string',
      valueHint: 'projectId',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: 'Reparent a wiki page, optionally ordering it or moving it into another wiki (irreversible)',
    name: 'move',
  },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiMove,
      schema: wikiMoveArgsSchema,
    });

    formatter.printInfo(`Moved wiki page \`${id}\`.`);
  },
});
