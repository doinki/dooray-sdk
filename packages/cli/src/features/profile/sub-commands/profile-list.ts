import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { renderList } from '../../../shared/utils/table';
import { runProfileList } from '../operations/profile-list';

const schema = globalArgsSchema.pick({ jq: true, json: true });

export default defineSubcommand({
  meta: { description: 'List saved profiles', name: 'list' },
  mode: 'local',
  run({ formatter, profileStore }) {
    const result = runProfileList({ profileStore });

    formatter.printData(result, renderPretty);
  },
  schema,
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
