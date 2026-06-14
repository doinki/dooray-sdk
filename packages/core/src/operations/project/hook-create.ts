import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectHookEvent } from '@dooray-sdk/client/project';

export interface HookCreateArgs {
  embedInlineImages?: boolean;
  events: ProjectHookEvent[];
  includeBody?: boolean;
  projectId: string;
  type?: 'project' | 'task';
  url: string;
}

interface ProjectHookCreateContext {
  api: DoorayApi;
  args: HookCreateArgs;
}

export async function runProjectHookCreate(context: ProjectHookCreateContext) {
  const {
    api,
    args: { embedInlineImages, events, includeBody, projectId, type, url },
  } = context;

  const { result } = await api.projectHook.create({
    body: {
      option: {
        body: {
          embedInlineImage: embedInlineImages,
          include: includeBody,
        },
      },
      sendEvents: events,
      type,
      url,
    },
    path: { projectId },
  });

  return { data: result };
}
