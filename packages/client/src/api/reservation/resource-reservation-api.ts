import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ResourceReservationApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create({ body }: { body: ResourceReservationCreateBody }, init?: RestRequestInit) {
    return this.#client.post<ResourceReservationCreateResponse>(
      { body, path: 'reservation/v1/resource-reservations' },
      init,
    );
  }

  public delete(
    { body = { deleteType: '' }, path }: { body?: ResourceReservationDeleteBody; path: { reservationId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.delete<EmptyRestResponse>(
      {
        body,
        path: url`reservation/v1/resource-reservations/${path.reservationId}`,
      },
      init,
    );
  }

  public get({ path }: { path: { reservationId: string } }, init?: RestRequestInit) {
    return this.#client.get<ResourceReservationDetailResponse>(
      { path: url`reservation/v1/resource-reservations/${path.reservationId}` },
      init,
    );
  }

  public list({ params }: { params: ResourceReservationListParams }, init?: RestRequestInit) {
    return this.#client.getPaginated<ResourceReservationListResponse>(
      {
        params,
        path: 'reservation/v1/resource-reservations',
      },
      init,
    );
  }

  public update(
    { body, path }: { body: ResourceReservationUpdateBody; path: { reservationId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`reservation/v1/resource-reservations/${path.reservationId}`,
      },
      init,
    );
  }
}

export type ResourceReservationRecurrenceFrequency = 'daily' | 'monthly' | 'weekly' | 'yearly';

export interface ResourceReservationRecurrenceRule {
  byday?: string;
  bymonth?: string;
  bymonthday?: number | string;
  frequency: ResourceReservationRecurrenceFrequency;
  interval: number;
  startedAt?: string;
  timezoneName: string;
  until?: string;
}

export interface ResourceReservationAlarm {
  action: 'mail';
  trigger: string;
}

export interface ResourceReservation {
  endedAt: string;
  id: string;
  resource: {
    id: string;
    name: string;
    operationHour: {
      close: string;
      open: string;
      timezone: string;
    };
  };
  startedAt: string;
  subject: string;
  users: {
    from: ResourceReservationUserFrom;
  };
  wholeDayFlag: boolean;
}

export interface ResourceReservationUserFrom {
  departments?: Array<{ externalKey: string; id: string; name: string }>;
  member: { name: string; organizationMemberId: string };
  type: 'member';
}

export type ResourceReservationListParams = {
  resourceIds?: string[];
  timeMax: string;
  timeMin: string;
} & PageParams;

export interface ResourceReservationListResponse extends CountedRestResponse {
  result: ResourceReservation[];
}

export interface ResourceReservationDetailResponse extends RestResponse {
  result: ResourceReservation;
}

export interface ResourceReservationCreateBody {
  alarms?: ResourceReservationAlarm[];
  class?: 'private' | 'public';
  endedAt: string;
  recurrenceRule?: ResourceReservationRecurrenceRule;
  resourceId: string;
  startedAt: string;
  subject: string;
  wholeDayFlag: boolean;
}

export interface ResourceReservationCreateResponse extends RestResponse {
  result: {
    id: string;
    masterResourceReservationId: string;
  };
}

export interface ResourceReservationUpdateBody {
  alarms?: ResourceReservationAlarm[];
  class?: 'private' | 'public';
  endedAt: string;
  recurrenceRule?: ResourceReservationRecurrenceRule;
  startedAt: string;
  subject: string;
  updateType: 'this' | 'whole' | 'wholeFromThis';
  wholeDayFlag: boolean;
}

export interface ResourceReservationDeleteBody {
  deleteType?: '' | 'this' | 'whole' | 'wholeFromThis';
}
