import type { DoorayApi } from '@dooray-sdk/client';

import type { COMMENT_SORTS } from '../../constants/task';
import { COMMENT_SORT_FIELDS } from '../../constants/task';
import { MAX_SIZE } from '../../schemas';
import { fetchAllPages } from '../../utils/fetch-all-pages';
import { resolveTaskProjectId } from '../../utils/resolve-task-project-id';
import { toOrder } from './sort-order';

export type CommentSort = (typeof COMMENT_SORTS)[number];

export interface TaskCommentListArgs {
  all?: boolean;
  id: string;
  page?: number;
  projectId?: string;
  size?: number;
  sort?: CommentSort;
}

interface TaskCommentListContext {
  api: DoorayApi;
  args: TaskCommentListArgs;
}

export async function runTaskCommentList({ api, args }: TaskCommentListContext) {
  const projectId = await resolveTaskProjectId(api, args);

  if (args.all) {
    const { paging, result } = await fetchAllPages((page) =>
      api.projectTaskComment.list({
        params: { order: toOrder(args.sort, COMMENT_SORT_FIELDS), page, size: MAX_SIZE },
        path: { projectId, taskId: args.id },
      }),
    );

    return { data: result, paging };
  }

  const { paging, result } = await api.projectTaskComment.list({
    params: { order: toOrder(args.sort, COMMENT_SORT_FIELDS), page: args.page, size: args.size },
    path: { projectId, taskId: args.id },
  });

  return { data: result, paging };
}
