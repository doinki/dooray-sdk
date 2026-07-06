import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { isJsonOutput } from '../../../shared/command/json-output';
import { yesSchema } from '../../../shared/schemas/fields';
import { parseArgsOrThrow } from '../../../shared/schemas/parse-args';
import { runProfileRemove } from '../operations/profile-remove';

const schema = globalArgsSchema.pick({ json: true }).extend({
  name: z.string().min(1).meta({ positional: true }).describe('Profile name to remove'),
  yes: yesSchema,
});

export default defineSubcommand({
  meta: { description: 'Remove a saved profile', name: 'remove' },
  mode: 'local',
  async run({ args, formatter, profileStore }) {
    const data = parseArgsOrThrow(schema, args);

    await confirmDeletion({
      json: isJsonOutput(data.json),
      message: `Remove profile \`${data.name}\` and its stored credentials?`,
      skip: data.yes,
    });

    runProfileRemove({ name: data.name, profileStore });

    formatter.printInfo(`Removed profile \`${data.name}\`.`);
  },
  schema,
});
