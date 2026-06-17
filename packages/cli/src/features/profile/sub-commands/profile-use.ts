import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';
import { runProfileUse } from '../operations/profile-use';

export const profileUseArgsSchema = z.object({
  name: z.string().min(1).meta({ positional: true }).describe('Profile name to activate'),
});

export default defineSubcommand({
  args: argsFromSchema(profileUseArgsSchema),
  globalArgs: [],
  meta: { description: 'Switch the active profile', name: 'use' },
  mode: 'local',
  run({ args, formatter, profileStore }) {
    const data = parseArgsOrThrow(profileUseArgsSchema, args);

    runProfileUse({ name: data.name, profileStore });

    formatter.printInfo(`Switched to profile \`${data.name}\`.`);
  },
});
