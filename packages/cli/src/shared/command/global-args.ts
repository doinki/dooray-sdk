import type { ArgsDef } from 'citty';

import { jsonEnvDefault } from './json-output';

export const globalArgs = {
  jq: {
    description: 'filter the JSON output through jq (implies --json; requires the `jq` binary on PATH)',
    type: 'string',
    valueHint: 'expr',
  },
  json: {
    default: jsonEnvDefault(),
    description:
      'output as JSON — bare for the full object, or a comma-separated field list to project each item (e.g. --json=id,name; defaults to $DOORAY_JSON)',
    type: 'string',
    valueHint: '[a,b...]',
  },
  profile: {
    default: process.env.DOORAY_PROFILE,
    description: 'Use a different profile for this invocation only (defaults to $DOORAY_PROFILE)',
    type: 'string',
    valueHint: 'name',
  },
  ref: {
    default: process.env.DOORAY_REF,
    description: '19-digit ID, `<projectId>/<id>`, or Dooray URL (defaults to $DOORAY_REF)',
    required: true,
    type: 'positional',
    valueHint: 'ref',
  },
  verbose: {
    default: process.env.DOORAY_VERBOSE === 'true',
    description: 'verbose logging (stderr; defaults to $DOORAY_VERBOSE)',
    type: 'boolean',
  },
} satisfies ArgsDef;
