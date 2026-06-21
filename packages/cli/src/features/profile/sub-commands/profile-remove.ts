import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { parseArgsOrThrow } from '../../../shared/schemas/parse-args';
import { runProfileRemove } from '../operations/profile-remove';

const schema = z.object({
  name: z.string().trim().min(1).meta({ positional: true }).describe('Profile name to remove'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: [],
  meta: { description: 'Remove a saved profile', name: 'remove' },
  mode: 'local',
  run({ args, formatter, profileStore }) {
    const data = parseArgsOrThrow(schema, args);

    runProfileRemove({ name: data.name, profileStore });

    formatter.printInfo(`Removed profile \`${data.name}\`.`);
  },
});
