import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderList } from '../../../shared/utils/table';
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

function renderPretty({ data: { profiles } }: Awaited<ReturnType<typeof runProfileList>>): string {
  if (profiles.length === 0) return 'No profiles registered. Add one with `dooray auth login`.';

  return renderList(profiles, [
    { header: '', value: (p) => (p.active ? '*' : ' ') },
    { header: 'name', value: (p) => p.name },
    { header: 'environment', value: (p) => p.environmentLabel },
    { header: 'base_url', value: (p) => p.baseUrl },
    { header: 'member', value: (p) => p.memberName },
  ]);
}
