import { CalendarApi } from './api/calendar/calendar-api';
import { CalendarEventApi } from './api/calendar/event-api';
import { IncomingHookApi } from './api/common/incoming-hook-api';
import { MemberApi } from './api/common/member-api';
import { ContactApi } from './api/contacts/contact-api';
import { DriveApi } from './api/drive/drive-api';
import { DriveFileApi } from './api/drive/file-api';
import { DriveSharedLinkApi } from './api/drive/shared-link-api';
import { MessengerChannelApi } from './api/messenger/channel-api';
import { MessengerMessageApi } from './api/messenger/message-api';
import { ProjectCategoryApi } from './api/project/category-api';
import { ProjectTaskCommentApi } from './api/project/comment-api';
import { ProjectEmailAddressApi } from './api/project/email-address-api';
import { ProjectHookApi } from './api/project/hook-api';
import { ProjectMemberApi } from './api/project/member-api';
import { ProjectMemberGroupApi } from './api/project/member-group-api';
import { ProjectMilestoneApi } from './api/project/milestone-api';
import { ProjectApi } from './api/project/project-api';
import { ProjectTagApi } from './api/project/tag-api';
import { ProjectTaskApi } from './api/project/task-api';
import { ProjectTaskFileApi } from './api/project/task-file-api';
import { ProjectTemplateApi } from './api/project/template-api';
import { ProjectWorkflowApi } from './api/project/workflow-api';
import { ResourceApi } from './api/reservation/resource-api';
import { ResourceReservationApi } from './api/reservation/resource-reservation-api';
import { WikiCommentApi } from './api/wiki/comment-api';
import { WikiFileApi } from './api/wiki/file-api';
import { WikiPageApi } from './api/wiki/page-api';
import { WikiApi } from './api/wiki/wiki-api';
import type { DoorayClientOptions } from './lib/dooray-client';
import { DoorayClient } from './lib/dooray-client';

export type DoorayApi = ReturnType<typeof createDoorayClient>;

export function createDoorayClient(options: DoorayClientOptions) {
  const client = new DoorayClient(options);

  return lazyApi({
    calendar: () => new CalendarApi(client),
    calendarEvent: () => new CalendarEventApi(client),
    contact: () => new ContactApi(client),
    drive: () => new DriveApi(client),
    driveFile: () => new DriveFileApi(client),
    driveSharedLink: () => new DriveSharedLinkApi(client),
    incomingHook: () => new IncomingHookApi(client),
    member: () => new MemberApi(client),
    messengerChannel: () => new MessengerChannelApi(client),
    messengerMessage: () => new MessengerMessageApi(client),
    project: () => new ProjectApi(client),
    projectCategory: () => new ProjectCategoryApi(client),
    projectEmailAddress: () => new ProjectEmailAddressApi(client),
    projectHook: () => new ProjectHookApi(client),
    projectMember: () => new ProjectMemberApi(client),
    projectMemberGroup: () => new ProjectMemberGroupApi(client),
    projectMilestone: () => new ProjectMilestoneApi(client),
    projectTag: () => new ProjectTagApi(client),
    projectTask: () => new ProjectTaskApi(client),
    projectTaskComment: () => new ProjectTaskCommentApi(client),
    projectTaskFile: () => new ProjectTaskFileApi(client),
    projectTemplate: () => new ProjectTemplateApi(client),
    projectWorkflow: () => new ProjectWorkflowApi(client),
    resource: () => new ResourceApi(client),
    resourceReservation: () => new ResourceReservationApi(client),
    wiki: () => new WikiApi(client),
    wikiComment: () => new WikiCommentApi(client),
    wikiFile: () => new WikiFileApi(client),
    wikiPage: () => new WikiPageApi(client),
  });
}

type LazyApi<T extends Record<string, () => unknown>> = {
  readonly [K in keyof T]: ReturnType<T[K]>;
};

function lazyApi<T extends Record<string, () => unknown>>(factories: T): LazyApi<T> {
  const cache = new Map<string, unknown>();
  const api = {} as LazyApi<T>;

  for (const [key, factory] of Object.entries(factories)) {
    Object.defineProperty(api, key, {
      configurable: true,
      enumerable: true,
      get() {
        if (!cache.has(key)) cache.set(key, factory());
        return cache.get(key);
      },
    });
  }

  return api;
}
