import type { DoorayApi } from '@dooray-sdk/client';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { z } from 'zod';

import type { OutputFormatter, Render } from '../formatter/output-formatter';
import type { ArgInput } from '../schemas/parse-args';
import { runWithScope } from './run-with-scope';

interface ProjectScopeContext<Args extends Record<string, unknown>, Result> {
  api: DoorayApi;
  args: { ref?: string } & ArgInput;
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
  const { confirm, ...core } = context;

  const scope = await runWithScope<Args, Result, { projectId: string }>(core, async (data) => {
    await confirm?.({ args: data });
    return { projectId: await resolveProjectId({ api: core.api, ref: core.args.ref ?? '' }) };
  });

  return { data: scope.data, result: scope.result };
}
