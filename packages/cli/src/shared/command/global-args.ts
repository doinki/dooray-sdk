import type { ArgsDef } from 'citty';

export const globalArgs = {
  fields: {
    description: 'output only these JSON fields, comma-separated — projects each item (implies --json)',
    type: 'string',
    valueHint: 'a[,b...]',
  },
  jq: {
    description: 'filter the JSON output through jq (implies --json; requires the `jq` binary on PATH)',
    type: 'string',
    valueHint: 'expr',
  },
  json: {
    default: process.env.DOORAY_JSON === 'true',
    description: 'output as JSON (stable contract; defaults to $DOORAY_JSON)',
    type: 'boolean',
  },
  profile: {
    default: process.env.DOORAY_PROFILE,
    description: 'Use a different profile for this invocation only (defaults to $DOORAY_PROFILE)',
    type: 'string',
    valueHint: 'name',
  },
  ref: {
    default: process.env.DOORAY_REF,
    description: '19-digit project ID, `<projectId>/<id>`, or Dooray URL (defaults to $DOORAY_REF)',
    required: true,
    type: 'string',
    valueHint: 'ref',
  },
  verbose: {
    default: process.env.DOORAY_VERBOSE === 'true',
    description: 'verbose logging (stderr; defaults to $DOORAY_VERBOSE)',
    type: 'boolean',
  },
} satisfies ArgsDef;
