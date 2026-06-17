import type { ProjectMilestoneRow } from '@dooray-sdk/core';
import { runProjectView } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { renderList } from '../../../shared/formatter/table';

export default defineSubcommand({
  meta: {
    description: 'Show a project overview — info, statuses, milestones, tags, members, category path',
    name: 'view',
  },
  async run({ api, args, formatter }) {
    const projectId = await resolveProjectId({ api, ref: args.ref });
    const result = await runProjectView({
      api,
      args: { projectId },
    });

    formatter.printData(result, renderPretty);
  },
});

function renderPretty({
  categoryPath,
  closedMilestones,
  memberCount,
  openMilestones,
  project,
  statuses,
  tags,
}: Awaited<ReturnType<typeof runProjectView>>): string {
  const sections: string[] = [];

  sections.push('', 'PROJECT');
  sections.push(
    renderKeyValue([
      ['ID', project.id],
      ['Name', project.code],
      ['Description', project.description],
      ['State', project.state],
      ['Scope', project.scope],
      ['Type', project.type],
      ['Category', categoryPath],
      ['Organization ID', project.organization.id],
      ['Drive ID', project.drive?.id],
      ['Wiki ID', project.wiki?.id],
      ['Members', `${String(memberCount)} members`],
    ]),
  );

  sections.push('', 'TAGS');
  sections.push(
    tags.length === 0
      ? '-'
      : renderList(
          tags,
          [
            { header: 'id', value: (t) => t.id },
            { header: 'name', value: (t) => t.name },
            { header: 'group_id', value: (t) => t.groupId },
            { header: 'group_name', value: (t) => t.groupName },
          ],
          { columnSplitter: '   ' },
        ),
  );

  sections.push('', 'STATUSES');
  sections.push(
    statuses.length === 0
      ? '-'
      : renderList(
          statuses,
          [
            { header: 'id', value: (status) => status.id },
            { header: 'name', value: (status) => status.name },
            { header: 'class', value: (status) => status.class },
          ],
          { columnSplitter: '   ' },
        ),
  );

  sections.push('', 'MILESTONES (OPEN)');
  sections.push(renderMilestones(openMilestones));

  sections.push('', 'MILESTONES (CLOSED)');
  sections.push(renderMilestones(closedMilestones));

  return sections.join('\n');
}

function renderMilestones(rows: ProjectMilestoneRow[]): string {
  if (rows.length === 0) return '-';
  return renderList(
    rows,
    [
      { header: 'id', value: (m) => m.id },
      { header: 'name', value: (m) => m.name },
      { header: 'date_range', value: (m) => m.dateRange },
      { header: 'state', value: (m) => m.state },
    ],
    { columnSplitter: '   ' },
  );
}
