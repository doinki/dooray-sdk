import { resolveTaskId } from '@dooray-sdk/core/resolve';

import type { RefScopeContext } from './run-with-scope';
import { runWithScope } from './run-with-scope';

export async function runWithTaskScope<Args extends Record<string, unknown>, Result>(
  context: RefScopeContext<Args, Result>,
): Promise<{ data: Args; result: Result }> {
  const { confirm, ...core } = context;

  const scope = await runWithScope<Args, Result, { id: string; projectId?: string }>(core, async (data) => {
    const { id, projectId } = resolveTaskId(core.args);
    await confirm?.({ args: data, id, projectId });
    return { id, projectId };
  });

  return { data: scope.data, result: scope.result };
}
