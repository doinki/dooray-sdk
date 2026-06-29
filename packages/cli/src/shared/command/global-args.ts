import { z } from 'zod';

import { jsonEnvDefault } from './json-output';

/** Optional flag whose default is env-derived: no env value → just optional, with no citty default. */
function envDefault<T extends z.ZodType>(schema: T, value: unknown) {
  return value === undefined ? schema.optional() : schema.optional().default(value as never);
}

/** Global flags shared by every subcommand — the canonical zod form. Command schemas `.extend()` it. */
export const globalArgsSchema = z.object({
  jq: z
    .string()
    .optional()
    .meta({ hint: 'expr' })
    .describe('filter the JSON output through jq (implies --json; requires the `jq` binary on PATH)'),
  json: envDefault(z.string(), jsonEnvDefault())
    .meta({ hint: '[a,b...]' })
    .describe(
      'output as JSON — bare for the full object, or a comma-separated field list to project each item (e.g. --json=id,name; defaults to $DOORAY_JSON)',
    ),
  profile: envDefault(z.string(), process.env.DOORAY_PROFILE)
    .meta({ hint: 'name' })
    .describe('Use a different profile for this invocation only (defaults to $DOORAY_PROFILE)'),
  ref: z
    .string()
    .default(process.env.DOORAY_REF ?? '')
    .meta({ hint: 'ref', positional: true })
    .describe('19-digit ID, `<projectId>/<id>`, or Dooray URL (defaults to $DOORAY_REF)'),
  verbose: z
    .boolean()
    .default(process.env.DOORAY_VERBOSE === 'true')
    .describe('verbose logging (stderr; defaults to $DOORAY_VERBOSE)'),
});
