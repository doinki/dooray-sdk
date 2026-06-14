import type { DoorayClient } from '../../lib/dooray-client';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class CalendarEventApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create(
    { body, path }: { body: CalendarEventCreateBody; path: { calendarId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.post<CalendarEventCreateResponse>(
      {
        body,
        path: url`calendar/v1/calendars/${path.calendarId}/events`,
      },
      init,
    );
  }

  public delete(
    {
      body,
      path,
    }: {
      body?: CalendarEventDeleteBody;
      path: { calendarId: string; eventId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<EmptyRestResponse>(
      {
        body,
        path: url`calendar/v1/calendars/${path.calendarId}/events/${path.eventId}/delete`,
      },
      init,
    );
  }

  public get({ path }: { path: { calendarId: string; eventId: string } }, init?: RestRequestInit) {
    return this.#client.get<CalendarEventDetailResponse>(
      {
        path: url`calendar/v1/calendars/${path.calendarId}/events/${path.eventId}`,
      },
      init,
    );
  }

  public list({ params }: { params: CalendarEventListParams }, init?: RestRequestInit) {
    return this.#client.get<CalendarEventListResponse>(
      {
        params,
        path: 'calendar/v1/calendars/*/events',
      },
      init,
    );
  }

  public update(
    {
      body,
      path,
    }: {
      body: CalendarEventUpdateBody;
      path: { calendarId: string; eventId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`calendar/v1/calendars/${path.calendarId}/events/${path.eventId}`,
      },
      init,
    );
  }
}

export interface CalendarEventBody {
  content: string;
  mimeType: '' | 'text/html' | 'text/x-markdown';
}

export type CalendarEventCategory = 'general' | 'milestone' | 'post';

export type CalendarEventStatus = 'accepted' | 'declined' | 'not_confirmed' | 'tentative';

export type CalendarEventUserType = 'cc' | 'from' | 'to';

export type CalendarEventRecurrenceFrequency = 'daily' | 'monthly' | 'weekly' | 'yearly';

export type CalendarEventRecurrenceType = 'modified' | 'none' | 'unmodified';

export interface CalendarEventRecurrenceRule {
  byday?: string;
  bymonth?: string;
  bymonthday?: string;
  frequency: CalendarEventRecurrenceFrequency;
  interval: number;
  timezoneName?: string;
  until?: string;
}

export interface CalendarEventAlarm {
  action: 'app' | 'mail';
  trigger: string;
}

export interface CalendarEventPersonalSettings {
  alarms?: CalendarEventAlarm[];
  busy?: boolean;
  class?: 'private' | 'public';
}

export type CalendarEventUser =
  | {
      emailUser: { emailAddress: string; name?: string };
      type: 'emailUser';
    }
  | {
      member: { organizationMemberId: string };
      type: 'member';
    };

export interface CalendarEvent {
  body?: { content: string; mimeType: '' | 'text/html' | 'text/x-markdown' };
  calendar: { id: string; name: string };
  category: CalendarEventCategory;
  conferencing?: { key: string; serviceType: string; url: string };
  createdAt: string;
  dueDate?: null | string;
  endedAt: null | string;
  files: Array<{ id: string; name: string; size: number | string }> | null;
  id: string;
  location: null | string;
  masterScheduleId: string;
  me: {
    member: { emailAddress: string; name: string; organizationMemberId: string };
    status: CalendarEventStatus;
    type: 'member';
    userType: CalendarEventUserType;
  };
  project?: { id: string; name: string };
  recurrenceId: null | string;
  recurrenceRule?: {
    byday?: string;
    bymonth?: string;
    bymonthday?: string;
    frequency: CalendarEventRecurrenceFrequency;
    interval: number;
    timezoneName?: string;
    until?: string;
  };
  recurrenceType: CalendarEventRecurrenceType;
  startedAt: null | string;
  subject: string;
  tenant: { id: string };
  uid: string;
  updatedAt: string;
  users: {
    cc?: Array<
      | { emailUser: { emailAddress: string; name: string }; status: '' | CalendarEventStatus; type: 'emailUser' }
      | {
          member: { emailAddress: string; name: string; organizationMemberId: string };
          status: '' | CalendarEventStatus;
          type: 'member';
        }
    >;
    from?:
      | { emailUser: { emailAddress: string; name: string }; status: '' | CalendarEventStatus; type: 'emailUser' }
      | {
          member: { emailAddress: string; name: string; organizationMemberId: string };
          status: '' | CalendarEventStatus;
          type: 'member';
        };
    to?: Array<
      | { emailUser: { emailAddress: string; name: string }; status: '' | CalendarEventStatus; type: 'emailUser' }
      | {
          member: { emailAddress: string; name: string; organizationMemberId: string };
          status: '' | CalendarEventStatus;
          type: 'member';
        }
    >;
  } | null;
  wholeDayFlag?: boolean;
}

export interface CalendarEventListParams {
  calendars?: string[];
  category?: CalendarEventCategory;
  postType?: 'fromToCcMe' | 'toCcMe' | 'toMe';
  timeMax: string;
  timeMin: string;
}

export interface CalendarEventListResponse extends RestResponse {
  result: CalendarEvent[];
}

export interface CalendarEventDetailResponse extends RestResponse {
  result: CalendarEvent;
}

export interface CalendarEventCreateBody {
  body?: CalendarEventBody;
  endedAt: string;
  location?: string;
  personalSettings?: CalendarEventPersonalSettings;
  recurrenceRule?: CalendarEventRecurrenceRule;
  startedAt: string;
  subject: string;
  users?: {
    cc?: CalendarEventUser[];
    to?: CalendarEventUser[];
  };
  wholeDayFlag?: boolean;
}

export interface CalendarEventCreateResponse extends RestResponse {
  result: {
    calendar: null;
    category: null;
    createdAt: null;
    endedAt: null;
    files: null;
    id: string;
    location: null;
    masterScheduleId: null;
    recurrenceId: null;
    recurrenceType: null;
    startedAt: null;
    subject: null;
    tenant: null;
    uid: null;
    updatedAt: null;
    wholeDayFlag: null;
  };
}

export interface CalendarEventUpdateBody {
  body?: CalendarEventBody;
  endedAt?: string;
  location?: string;
  personalSettings?: CalendarEventPersonalSettings;
  recurrenceRule?: CalendarEventRecurrenceRule;
  startedAt?: string;
  subject?: string;
  users?: {
    cc?: CalendarEventUser[];
    to?: CalendarEventUser[];
  };
  wholeDayFlag?: boolean;
}

export interface CalendarEventDeleteBody {
  deleteType?: 'this' | 'whole' | 'wholeFromThis';
}
