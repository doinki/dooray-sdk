import type { DoorayApi } from '@dooray-sdk/client';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { z } from 'zod';

import type { OutputFormatter, Render } from '../formatter/output-formatter';
import type { ArgInput } from '../utils/parse-args';
import { parseArgsOrThrow } from '../utils/parse-args';

interface ProjectScopeContext<Args extends Record<string, unknown>, Result> {
  api: DoorayApi;
  args: { ref: string } & ArgInput;
  /** Optional last-chance guard (e.g. a delete confirmation), run before the project ref is resolved over the network. */
  confirm?: (input: { args: Args }) => Promise<void> | void;
  formatter: OutputFormatter;
  render: Render<Result>;
  run: (input: { api: DoorayApi; args: { projectId: string } & Args }) => Promise<Result>;
  schema: z.ZodType<Args>;
}

export async function runWithProjectScope<Args extends Record<string, unknown>, Result>(
  context: ProjectScopeContext<Args, Result>,
): Promise<{ data: Args; result: Result }> {
  const { api, args, confirm, formatter, render, run, schema } = context;

  const data = parseArgsOrThrow(schema, args);
  await confirm?.({ args: data });
  const projectId = await resolveProjectId({ api, ref: args.ref });
  const result = await run({ api, args: { ...data, projectId } });

  formatter.printData(result, render);

  return { data, result };
}
