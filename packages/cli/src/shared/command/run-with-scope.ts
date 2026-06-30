import type { DoorayApi } from '@dooray-sdk/client';
import type { z } from 'zod';

import type { OutputFormatter, Render } from '../formatter/output-formatter';
import type { ArgInput } from '../schemas/parse-args';
import { parseArgsOrThrow } from '../schemas/parse-args';

interface ScopeCore<Args extends Record<string, unknown>, Result, Ids> {
  api: DoorayApi;
  args: ArgInput;
  formatter: OutputFormatter;
  render: Render<Result>;
  run: (input: { api: DoorayApi; args: Args & Ids }) => Promise<Result>;
  schema: z.ZodType<Args>;
}

/**
 * Context for a ref-resolved scope (task / wiki): a synchronously-resolved `id`
 * (plus optional `projectId`), with `confirm` run after resolution but before the action.
 * The two share this shape exactly — only the `resolve*Id` call differs in the wrapper.
 */
export interface RefScopeContext<Args extends Record<string, unknown>, Result> {
  api: DoorayApi;
  args: { id?: string; ref?: string } & ArgInput;
  confirm?: (input: { args: Args; id: string; projectId?: string }) => Promise<void> | void;
  formatter: OutputFormatter;
  render: Render<Result>;
  run: (input: { api: DoorayApi; args: { id: string; projectId?: string } & Args }) => Promise<Result>;
  schema: z.ZodType<Args>;
}

/** Shared skeleton: parse args, let `prepare` resolve ids (and confirm in the right order), run, print. */
export async function runWithScope<Args extends Record<string, unknown>, Result, Ids>(
  core: ScopeCore<Args, Result, Ids>,
  prepare: (data: Args) => Ids | Promise<Ids>,
): Promise<{ data: Args; ids: Ids; result: Result }> {
  const data = parseArgsOrThrow(core.schema, core.args);
  const ids = await prepare(data);
  const result = await core.run({ api: core.api, args: { ...data, ...ids } });

  core.formatter.printData(result, core.render);

  return { data, ids, result };
}
