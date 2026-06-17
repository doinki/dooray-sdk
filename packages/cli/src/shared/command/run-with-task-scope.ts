import type { DoorayApi } from '@dooray-sdk/client';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { z } from 'zod';

import type { OutputFormatter, Render } from '../formatter/output-formatter';
import type { ArgInput } from '../schema/parse-args';
import { parseArgsOrThrow } from '../schema/parse-args';

interface TaskScopeContext<Args extends Record<string, unknown>, Result> {
  api: DoorayApi;
  args: { id?: string; ref?: string } & ArgInput;
  formatter: OutputFormatter;
  render: Render<Result>;
  run: (input: { api: DoorayApi; args: { id: string; projectId?: string } & Args }) => Promise<Result>;
  schema: z.ZodType<Args>;
}

export async function runWithTaskScope<Args extends Record<string, unknown>, Result>(
  context: TaskScopeContext<Args, Result>,
): Promise<{ data: Args; result: Result }> {
  const { api, args, formatter, render, run, schema } = context;

  const data = parseArgsOrThrow(schema, args);
  const { id, projectId } = resolveTaskId({ id: args.id, ref: args.ref });
  const result = await run({ api, args: { ...data, id, projectId } });

  formatter.printData(result, render);

  return { data, result };
}
