import type { ArgsDef } from 'citty';
import type { z } from 'zod';

type ArgDef = ArgsDef[string];

export type CommandSchemaShape<TArgs> = Omit<{ [K in keyof TArgs]: z.ZodType<TArgs[K]> }, 'id' | 'projectId'> &
  Record<string, z.ZodType>;

export function argsFromSchema(schema: z.ZodObject): ArgsDef {
  return Object.fromEntries(Object.entries(schema.shape).map(([key, field]) => [toKebab(key), toArgDef(field)]));
}

const UPPERCASE = /[A-Z]/g;
const toKebab = (key: string): string => key.replaceAll(UPPERCASE, (c) => `-${c.toLowerCase()}`);

export interface ArgMeta {
  alias?: string | string[];
  hint?: string;
  positional?: boolean;
}

interface ZNode {
  _zod?: { def?: { entries?: Record<string, string>; in?: ZNode; innerType?: ZNode; type?: string } };
  description?: string;
  meta?: () => ({ description?: string } & ArgMeta) | undefined;
}

function toArgDef(field: ZNode): ArgDef {
  const meta = field.meta?.() ?? {};
  const description = field.description ?? meta.description;

  const { base, optional } = unwrap(field);
  const baseType = base._zod?.def?.type;

  if (meta.positional) return { description, required: !optional, type: 'positional', valueHint: meta.hint };

  if (baseType === 'boolean') return { alias: meta.alias, description, required: !optional, type: 'boolean' };

  if (baseType === 'enum') {
    const options = Object.values(base._zod?.def?.entries ?? {});

    return { alias: meta.alias, description, options, required: !optional, type: 'enum' };
  }

  const valueHint = meta.hint ?? (baseType === 'number' ? 'n' : undefined);

  return { alias: meta.alias, description, required: !optional, type: 'string', valueHint };
}

function unwrap(field: ZNode): { base: ZNode; optional: boolean } {
  let cur = field;
  let optional = false;

  for (let i = 0; i < 16; i++) {
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
