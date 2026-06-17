import type { DoorayApi } from '@dooray-sdk/client';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { z } from 'zod';

import type { OutputFormatter, Render } from '../formatter/output-formatter';
import type { ArgInput } from '../schema/parse-args';
import { parseArgsOrThrow, scopeRef } from '../schema/parse-args';

interface WikiScopeContext<Args extends Record<string, unknown>, Result> {
  api: DoorayApi;
  args: ArgInput;
  formatter: OutputFormatter;
  render: Render<Result>;
  run: (input: { api: DoorayApi; args: { id: string; projectId?: string } & Args }) => Promise<Result>;
  schema: z.ZodType<Args>;
}

export async function runWithWikiScope<Args extends Record<string, unknown>, Result>(
  context: WikiScopeContext<Args, Result>,
): Promise<{ data: Args; id: string; result: Result }> {
  const { api, args, formatter, render, run, schema } = context;

  const data = parseArgsOrThrow(schema, args);
  const { id, projectId } = resolveWikiId(scopeRef(args));
  const result = await run({ api, args: { ...data, id, projectId } });

  formatter.printData(result, render);

  return { data, id, result };
}
