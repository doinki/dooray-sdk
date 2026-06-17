import columnify from 'columnify';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runProfileList } from '../operations/profile-list';

export default defineSubcommand({
  globalArgs: ['json'],
  meta: { description: 'List registered profiles', name: 'list' },
  mode: 'local',
  run({ formatter, profileStore }) {
    const result = runProfileList({ profileStore });

    formatter.printData(result, renderPretty);
  },
});

function renderPretty({ profiles }: Awaited<ReturnType<typeof runProfileList>>): string {
  if (profiles.length === 0) return 'No profiles registered. Add one with `dooray auth login`.';

  return columnify(
    profiles.map((p) => ({
      '': p.active ? '*' : ' ',
      baseUrl: p.baseUrl,
      environment: p.environmentLabel,
      member: p.memberName ?? '',
      name: p.name,
    })),
    {
      columns: ['', 'name', 'environment', 'baseUrl', 'member'],
      columnSplitter: '   ',
    },
  );
}
