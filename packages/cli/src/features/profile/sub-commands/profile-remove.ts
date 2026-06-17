import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';
import { runProfileRemove } from '../operations/profile-remove';

export const profileRemoveArgsSchema = z.object({
  name: z.string().min(1).meta({ positional: true }).describe('Profile name to remove'),
});

export default defineSubcommand({
  args: argsFromSchema(profileRemoveArgsSchema),
  globalArgs: [],
  meta: { description: 'Unregister a profile', name: 'remove' },
  mode: 'local',
  run({ args, formatter, profileStore }) {
    const data = parseArgsOrThrow(profileRemoveArgsSchema, args);

    runProfileRemove({ name: data.name, profileStore });

    formatter.printInfo(`Removed profile \`${data.name}\`.`);
  },
});
