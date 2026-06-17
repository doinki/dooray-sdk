import { createDoorayClient } from '@dooray-sdk/client';
import { toSurfaceError } from '@dooray-sdk/core/errors';
import type { ArgsDef, CommandContext, CommandMeta } from 'citty';
import { defineCommand } from 'citty';

import type { OutputFormatter } from '../formatter/output-formatter';
import { createOutputFormatter } from '../formatter/output-formatter';
import type { ProfileRecord, ProfileStore } from '../profile/profile-store';
import { createDefaultProfileStore } from '../profile/profile-store';
import { resolveProfile } from '../profile/resolve-profile';
import { globalArgs } from './global-args';
import { isJsonOutput, jsonFields } from './json-output';
import { createVerboseClientOptions } from './verbose';

type GlobalArgName = keyof typeof globalArgs;

const DEFAULT_GLOBAL_ARG_NAMES = ['json', 'profile', 'ref', 'verbose'] satisfies readonly GlobalArgName[];

type DefaultGlobalArgNames = typeof DEFAULT_GLOBAL_ARG_NAMES;

type SubcommandArgs<T extends ArgsDef, G extends readonly GlobalArgName[]> = Pick<typeof globalArgs, G[number]> & T;

type DefineSubcommandOptions<T extends ArgsDef, G extends readonly GlobalArgName[] = DefaultGlobalArgNames> =
  | {
      args?: T;
      globalArgs?: G;
      meta?: CommandMeta;
      mode: 'local';
      run: (
        context: { formatter: OutputFormatter; profileStore: ProfileStore } & CommandContext<SubcommandArgs<T, G>>,
      ) => Promise<void> | void;
    }
  | {
      args?: T;
      globalArgs?: G;
      meta?: CommandMeta;
      mode?: 'api';
      run: (
        context: {
          api: ReturnType<typeof createDoorayClient>;
          formatter: OutputFormatter;
          profile: ProfileRecord;
          profileStore: ProfileStore;
        } & CommandContext<SubcommandArgs<T, G>>,
      ) => Promise<void> | void;
    };

export function defineSubcommand<
  const T extends ArgsDef = ArgsDef,
  const G extends readonly GlobalArgName[] = DefaultGlobalArgNames,
>(def: DefineSubcommandOptions<T, G>) {
  const { args, globalArgs = DEFAULT_GLOBAL_ARG_NAMES, meta } = def;

  // `--jq` shapes the JSON output, so it rides along wherever `--json` is offered.
  const globalNames: readonly GlobalArgName[] = globalArgs.includes('json') ? [...globalArgs, 'jq'] : globalArgs;

  const mergedArgs = orderArgs({
    ...pickGlobalArgs(globalNames),
    ...args,
  });

  return defineCommand<SubcommandArgs<T, G>>({
    args: mergedArgs as SubcommandArgs<T, G>,
    meta,
    async run(ctx) {
      const formatter = createOutputFormatter({
        fields: jsonFields(ctx.args.json),
        jq: typeof ctx.args.jq === 'string' && ctx.args.jq ? ctx.args.jq : undefined,
        json: isJsonOutput(ctx.args.json),
      });
      try {
        const profileStore = createDefaultProfileStore();

        if (def.mode === 'local') {
          await def.run({ ...ctx, formatter, profileStore });
        } else {
          const override = typeof ctx.args.profile === 'string' ? ctx.args.profile : undefined;
          const { profile, token } = resolveProfile(profileStore, override);
          const api = createDoorayClient({
            ...createVerboseClientOptions(!!ctx.args.verbose),
            baseUrl: profile.baseUrl,
            token,
          });

          await def.run({ ...ctx, api, formatter, profile, profileStore });
        }
      } catch (error: unknown) {
        const surface = toSurfaceError(error);
        if (surface.code !== 'cancelled') formatter.printError(surface);

        // 실패는 한 종류로만 신호한다 — 성공 0, 그 외 전부 1. 등급별 exit code 정책은 두지 않는다.
        process.exitCode = 1;
      }
    },
  });
}

function orderArgs(args: ArgsDef): ArgsDef {
  const entries = Object.entries(args);

  const positionals = entries.filter(([, def]) => def.type === 'positional');
  const ref = entries.filter(([name]) => name === 'ref');
  const rest = entries
    .filter(([name, def]) => name !== 'ref' && def.type !== 'positional')
    .toSorted(([a], [b]) => a.localeCompare(b));

  return Object.fromEntries([...positionals, ...ref, ...rest]);
}

function pickGlobalArgs<const G extends readonly GlobalArgName[]>(names: G) {
  return Object.fromEntries(names.map((name) => [name, globalArgs[name]])) as Pick<typeof globalArgs, G[number]>;
}
