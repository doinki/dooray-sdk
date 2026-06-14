import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class CalendarApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create({ body }: { body: CalendarCreateBody }, init?: RestRequestInit) {
    return this.#client.post<CalendarCreateResponse>({ body, path: 'calendar/v1/calendars' }, init);
  }

  public delete({ path }: { path: { calendarId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>({ path: url`calendar/v1/calendars/${path.calendarId}` }, init);
  }

  public get({ path }: { path: { calendarId: string } }, init?: RestRequestInit) {
    return this.#client.get<CalendarDetailResponse>({ path: url`calendar/v1/calendars/${path.calendarId}` }, init);
  }

  public list({ params }: { params?: CalendarListParams } = {}, init?: RestRequestInit) {
    return this.#client.getPaginated<CalendarListResponse>(
      {
        params,
        path: 'calendar/v1/calendars',
      },
      init,
    );
  }

  public setMembers(
    { body, path }: { body: CalendarSetMembersBody; path: { calendarId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`calendar/v1/calendars/${path.calendarId}/members`,
      },
      init,
    );
  }
}

export type CalendarType = 'private' | 'project' | 'subscription';

export type CalendarRole = 'all' | 'delegatee' | 'opaque_view' | 'owner' | 'read_write' | 'view';

export interface CalendarAlarm {
  action: 'app' | 'custom' | 'mail';
  option?: {
    params: Record<string, unknown>;
    type: 'dooray' | 'slack';
  };
  trigger: string;
  wholeDayTrigger?: string;
}

export interface CalendarNotification {
  alarms: CalendarAlarm[];
  enabled: boolean;
}

export interface CalendarMeInput {
  color: string;
  notification?: CalendarNotification;
}

export type CalendarMember =
  | {
      distributionList: { emailAddress: string };
      role: CalendarRole;
      type: 'distributionList';
    }
  | {
      member: { organizationMemberId: string };
      role: CalendarRole;
      type: 'member';
    };

export interface CalendarSummary {
  createdAt: string;
  id: string;
  me: {
    checked: boolean;
    color: string;
    default: boolean;
    listed: boolean;
    order: number;
    role: CalendarRole;
  };
  name: string;
  ownerOrganizationMemberId: string;
  projectId?: string;
  type: CalendarType;
}

export interface Calendar {
  calendarMemberList?: Array<{
    member: { organizationMemberId: string };
    role: CalendarRole;
    type: 'member';
  }>;
  createdAt: string;
  id: string;
  me: {
    checked: boolean;
    color: string;
    default: boolean;
    listed: boolean;
    order: number;
    role: CalendarRole;
  };
  name: string;
  ownerOrganizationMemberId: string;
  projectId?: string;
  type: CalendarType;
}

export type CalendarListParams = PageParams;

export interface CalendarListResponse extends CountedRestResponse {
  result: CalendarSummary[];
}

export interface CalendarDetailResponse extends RestResponse {
  result: Calendar;
}

export interface CalendarCreatePrivateBody {
  calendarMemberList?: CalendarMember[];
  me?: CalendarMeInput;
  name: string;
  type: 'private';
}

export interface CalendarCreateSubscriptionBody {
  calendarUrl: string;
  me?: { color: string };
  name: string;
  type: 'subscription';
}

export type CalendarCreateBody = CalendarCreatePrivateBody | CalendarCreateSubscriptionBody;

export interface CalendarCreateResponse extends RestResponse {
  result: {
    id: string;
  };
}

export interface CalendarSetMembersBody {
  calendarMemberList: CalendarMember[];
}
