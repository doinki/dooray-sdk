import type { DoorayApi } from '@dooray-sdk/client';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { z } from 'zod';

import type { OutputFormatter, Render } from '../formatter/output-formatter';
import type { ArgInput } from '../schemas/parse-args';
import { parseArgsOrThrow } from '../schemas/parse-args';

interface WikiScopeContext<Args extends Record<string, unknown>, Result> {
  api: DoorayApi;
  args: { id?: string; ref?: string } & ArgInput;
  /** Optional last-chance guard (e.g. a delete confirmation), run after the page id is resolved but before the action. */
  confirm?: (input: { args: Args; id: string; projectId?: string }) => Promise<void> | void;
  formatter: OutputFormatter;
  render: Render<Result>;
  run: (input: { api: DoorayApi; args: { id: string; projectId?: string } & Args }) => Promise<Result>;
  schema: z.ZodType<Args>;
}

export async function runWithWikiScope<Args extends Record<string, unknown>, Result>(
  context: WikiScopeContext<Args, Result>,
): Promise<{ data: Args; id: string; result: Result }> {
  const { api, args, confirm, formatter, render, run, schema } = context;

  const data = parseArgsOrThrow(schema, args);
  const { id, projectId } = resolveWikiId(args);
  await confirm?.({ args: data, id, projectId });
  const result = await run({ api, args: { ...data, id, projectId } });

  formatter.printData(result, render);

  return { data, id, result };
}
