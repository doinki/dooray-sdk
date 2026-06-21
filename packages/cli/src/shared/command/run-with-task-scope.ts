import type { DoorayApi } from '@dooray-sdk/client';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { z } from 'zod';

import type { OutputFormatter, Render } from '../formatter/output-formatter';
import type { ArgInput } from '../schemas/parse-args';
import { parseArgsOrThrow } from '../schemas/parse-args';

interface TaskScopeContext<Args extends Record<string, unknown>, Result> {
  api: DoorayApi;
  args: ArgInput;
  /** Optional last-chance guard (e.g. a delete confirmation), run after the task id is resolved but before the action. */
  confirm?: (input: { args: Args; id: string; projectId?: string }) => Promise<void> | void;
  formatter: OutputFormatter;
  render: Render<Result>;
  run: (input: { api: DoorayApi; args: { id: string; projectId?: string } & Args }) => Promise<Result>;
  schema: z.ZodType<Args>;
}

export async function runWithTaskScope<Args extends Record<string, unknown>, Result>(
  context: TaskScopeContext<Args, Result>,
): Promise<{ data: Args; result: Result }> {
  const { api, args, confirm, formatter, render, run, schema } = context;

  const data = parseArgsOrThrow(schema, args);
  const { id, projectId } = resolveTaskId(args);
  await confirm?.({ args: data, id, projectId });
  const result = await run({ api, args: { ...data, id, projectId } });

  formatter.printData(result, render);

  return { data, result };
}
