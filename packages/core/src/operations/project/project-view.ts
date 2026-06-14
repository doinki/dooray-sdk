import type { DoorayApi } from '@dooray-sdk/client';
import type { Milestone, ProjectCategory, Tag } from '@dooray-sdk/client/project';

import type { MilestoneState } from '../../constants/milestone';
import type { Status, StatusClass } from '../../constants/status';
import { fetchAllPages } from '../../utils/fetch-all-pages';

const PROJECT_LIST_PAGE_SIZE = 100;

export interface ProjectViewArgs {
  projectId: string;
}

interface ProjectViewContext {
  api: DoorayApi;
  args: ProjectViewArgs;
}

export interface ProjectMilestoneRow {
  dateRange: null | string;
  id: string;
  name: string;
  state: MilestoneState;
}

interface ProjectStatusRow {
  class: StatusClass;
  id: string;
  name: string;
}

interface ProjectTagRow {
  groupId: string | undefined;
  groupName: string | undefined;
  id: string;
  name: string;
}

export async function runProjectView(context: ProjectViewContext) {
  const {
    api,
    args: { projectId },
  } = context;

  const [
    { result: project },
    { result: statuses },
    { result: milestones },
    { result: tags },
    members,
    { result: categories },
  ] = await Promise.all([
    api.project.get({ path: { projectId } }),
    api.projectWorkflow.list({ path: { projectId } }),
    fetchAllPages((page) =>
      api.projectMilestone.list({ params: { page, size: PROJECT_LIST_PAGE_SIZE }, path: { projectId } }),
    ),
    fetchAllPages((page) =>
      api.projectTag.list({ params: { page, size: PROJECT_LIST_PAGE_SIZE }, path: { projectId } }),
    ),
    fetchAllPages((page) =>
      api.projectMember.list({ params: { page, size: PROJECT_LIST_PAGE_SIZE }, path: { projectId } }),
    ),
    api.projectCategory.list(),
  ]);

  const sortedStatuses = statuses.toSorted((a, b) => a.order - b.order).map(toStatusRow);
  const milestoneRows = milestones.map(toMilestoneRow);

  return {
    categoryPath: buildCategoryPath(project.projectCategoryId, categories),
    closedMilestones: milestoneRows.filter((m) => m.state === 'closed'),
    memberCount: members.paging.totalElements,
    openMilestones: milestoneRows.filter((m) => m.state === 'open'),
    project,
    statuses: sortedStatuses,
    tags: tags.map(toTagRow),
  };
}

function buildCategoryPath(categoryId: null | string | undefined, categories: ProjectCategory[]): null | string {
  if (!categoryId) return null;

  const byId = new Map(categories.map((c) => [c.id, c]));
  const path: string[] = [];
  const seen = new Set<string>();

  let current = byId.get(categoryId);
  while (current) {
    if (seen.has(current.id)) break;
    seen.add(current.id);
    path.unshift(current.name);
    current = current.parentProjectCategoryId ? byId.get(current.parentProjectCategoryId) : undefined;
  }

  return path.length === 0 ? categoryId : `${path.join(' / ')} (${categoryId})`;
}

function toMilestoneRow(m: Milestone): ProjectMilestoneRow {
  const range = [m.startedAt?.slice(0, 10), m.endedAt?.slice(0, 10)].filter(Boolean).join(' ~ ');
  return {
    dateRange: range.length > 0 ? range : null,
    id: m.id,
    name: m.name,
    state: m.status,
  };
}

function toStatusRow(status: Status): ProjectStatusRow {
  return { class: status.class, id: status.id, name: status.name };
}

function toTagRow(t: Tag): ProjectTagRow {
  return { groupId: t.tagGroup?.id, groupName: t.tagGroup?.name, id: t.id, name: t.name };
}
