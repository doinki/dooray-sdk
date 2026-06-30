import { createDoorayClient } from '@dooray-sdk/client';
import { toSurfaceError } from '@dooray-sdk/core/errors';
import type { CommandContext, CommandMeta } from 'citty';
import { defineCommand } from 'citty';
import type { z } from 'zod';

import type { OutputFormatter } from '../formatter/output-formatter';
import { createOutputFormatter } from '../formatter/output-formatter';
import type { ProfileRecord } from '../profile/profile-store';
import { ProfileStore } from '../profile/profile-store';
import { resolveProfile } from '../profile/resolve-profile';
import { argsFromSchema } from '../schemas/derive-args';
import { isJsonOutput, jsonFields } from './json-output';
import { createVerboseClientOptions } from './verbose';

type RunContext<S extends z.ZodObject> = { args: { _: string[] } & z.input<S> } & Omit<CommandContext, 'args'>;

type DefineSubcommandOptions<S extends z.ZodObject> =
  | {
      meta?: CommandMeta;
      mode: 'local';
      run: (
        context: { formatter: OutputFormatter; profileStore: ProfileStore } & RunContext<S>,
      ) => Promise<void> | void;
      schema?: S;
    }
  | {
      meta?: CommandMeta;
      mode?: 'api';
      run: (
        context: {
          api: ReturnType<typeof createDoorayClient>;
          formatter: OutputFormatter;
          profile: ProfileRecord;
          profileStore: ProfileStore;
        } & RunContext<S>,
      ) => Promise<void> | void;
      schema?: S;
    };

export function defineSubcommand<S extends z.ZodObject = z.ZodObject>(def: DefineSubcommandOptions<S>) {
  const { meta, mode, run, schema } = def;

  return defineCommand({
    args: schema ? argsFromSchema(schema) : undefined,
    meta,
    run: async (ctx) => {
      const formatter = createOutputFormatter({
        fields: jsonFields(ctx.args.json),
        jq: typeof ctx.args.jq === 'string' && ctx.args.jq ? ctx.args.jq : undefined,
        json: isJsonOutput(ctx.args.json),
      });

      try {
        const profileStore = new ProfileStore();

        if (mode === 'local') {
          await run({ ...(ctx as unknown as RunContext<S>), formatter, profileStore });
        } else {
          const { profile, token } = resolveProfile(profileStore, ctx.args.profile);

          const api = createDoorayClient({
            ...createVerboseClientOptions(!!ctx.args.verbose),
            baseUrl: profile.baseUrl,
            token,
          });

          await run({ ...(ctx as unknown as RunContext<S>), api, formatter, profile, profileStore });
        }
      } catch (error: unknown) {
        const surface = toSurfaceError(error);
        if (surface.code !== 'cancelled') formatter.printError(surface);

        process.exitCode = 1;
      }
    },
  });
}
