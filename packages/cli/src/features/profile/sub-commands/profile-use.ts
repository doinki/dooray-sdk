import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { parseArgsOrThrow } from '../../../shared/schemas/parse-args';
import { runProfileUse } from '../operations/profile-use';

const schema = z.object({
  name: z.string().trim().min(1).meta({ positional: true }).describe('Profile name to activate'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: [],
  meta: { description: 'Switch the active profile', name: 'use' },
  mode: 'local',
  run({ args, formatter, profileStore }) {
    const data = parseArgsOrThrow(schema, args);

    runProfileUse({ name: data.name, profileStore });

    formatter.printInfo(`Switched to profile \`${data.name}\`.`);
  },
});
