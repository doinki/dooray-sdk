import type { ArgsDef } from 'citty';
import type { z } from 'zod';

import { globalArgs } from '../command/global-args';

type ArgDef = ArgsDef[string];

/** citty-specific metadata attached to a zod field via `.meta()`. */
export interface ArgMeta {
  /** Short alias(es) for the flag (e.g. `s` → `-s`). Ignored for positionals. */
  alias?: string | string[];
  /** Render the flag's value placeholder in help (e.g. `taskId`, `a[,b...]`). */
  hint?: string;
  /** Treat this field as a positional argument instead of a `--flag`. */
  positional?: boolean;
}

/** Minimal view over zod v4 internals used for introspection. */
interface ZNode {
  _zod?: { def?: { entries?: Record<string, string>; in?: ZNode; innerType?: ZNode; type?: string } };
  description?: string;
  meta?: () => ({ description?: string } & ArgMeta) | undefined;
}

const UPPERCASE = /[A-Z]/g;
const toKebab = (key: string): string => key.replaceAll(UPPERCASE, (c) => `-${c.toLowerCase()}`);

/** Strip optional/default/nullable/pipe wrappers to reach the base type; report whether the field is optional. */
function unwrap(field: ZNode): { base: ZNode; optional: boolean } {
  let cur = field;
  let optional = false;
  for (let i = 0; i < 8; i++) {
    const def = cur._zod?.def;
    if (!def) break;
    if (def.type === 'optional' || def.type === 'default') {
      optional = true;
      cur = def.innerType ?? cur;
      continue;
    }
    if (def.type === 'nullable') {
      cur = def.innerType ?? cur;
      continue;
    }
    if (def.type === 'pipe') {
      cur = def.in ?? cur;
      continue;
    }
    break;
  }
  return { base: cur, optional };
}

function toArgDef(field: ZNode): ArgDef {
  const meta = field.meta?.() ?? {};
  const description = field.description ?? meta.description;
  const { base, optional } = unwrap(field);
  const baseType = base._zod?.def?.type;

  if (meta.positional) return { description, required: !optional, type: 'positional', valueHint: meta.hint };

  if (baseType === 'boolean') return { alias: meta.alias, description, type: 'boolean' };

  if (baseType === 'enum') {
    const options = Object.values(base._zod?.def?.entries ?? {});
    return { alias: meta.alias, description, options, required: optional ? undefined : true, type: 'enum' };
  }

  // Everything else (string / csv string / coerced number) is a string flag for citty; zod coerces/transforms.
  const valueHint = meta.hint ?? (baseType === 'number' ? 'n' : undefined);
  return { alias: meta.alias, description, required: optional ? undefined : true, type: 'string', valueHint };
}

/**
 * Derive citty `args` from a zod object schema — the single source of truth.
 *
 * Reads each field's type, description, enum options, and required-ness, plus citty extras
 * attached via `.meta({ hint, alias, positional })`. A field named `ref` is rendered as the
 * shared `--ref` flag (inherits `$DOORAY_REF`) and made optional.
 */
export function argsFromSchema(schema: z.ZodType): ArgsDef {
  const shape = (schema as unknown as { shape?: Record<string, ZNode> }).shape ?? {};
  const out: ArgsDef = {};

  for (const [key, field] of Object.entries(shape)) {
    if (key === 'ref') {
      const meta = field.meta?.() ?? {};
      out.ref = { ...globalArgs.ref, description: field.description ?? meta.description, required: false };
      continue;
    }
    out[toKebab(key)] = toArgDef(field);
  }

  return out;
}
