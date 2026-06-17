import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';
import { runProfileRemove } from '../operations/profile-remove';

export const profileRemoveArgsSchema = z.object({
  name: z.string().min(1).describe('Profile name to remove'),
});

export default defineSubcommand({
  args: {
    name: { description: profileRemoveArgsSchema.shape.name.description, required: true, type: 'positional' },
  },
  globalArgs: [],
  meta: { description: 'Unregister a profile', name: 'remove' },
  mode: 'local',
  run({ args, formatter, profileStore }) {
    const data = parseArgsOrThrow(profileRemoveArgsSchema, args);

    runProfileRemove({ name: data.name, profileStore });

    formatter.printInfo(`Removed profile \`${data.name}\`.`);
  },
});
