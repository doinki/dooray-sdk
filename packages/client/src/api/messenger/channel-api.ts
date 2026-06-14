import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class MessengerChannelApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create({ body, params }: { body: ChannelCreateBody; params: ChannelCreateParams }, init?: RestRequestInit) {
    return this.#client.post<ChannelCreateResponse>({ body, params, path: 'messenger/v1/channels' }, init);
  }

  public addMembers(
    { body, path }: { body: ChannelAddMembersBody; path: { channelId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.post<EmptyRestResponse>(
      { body, path: url`messenger/v1/channels/${path.channelId}/members/join` },
      init,
    );
  }

  public removeMembers(
    { body, path }: { body: ChannelRemoveMembersBody; path: { channelId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.post<EmptyRestResponse>(
      { body, path: url`messenger/v1/channels/${path.channelId}/members/leave` },
      init,
    );
  }

  public list(_?: unknown, init?: RestRequestInit) {
    return this.#client.get<ChannelListResponse>({ path: 'messenger/v1/channels' }, init);
  }
}

export type ChannelType = 'bot' | 'direct' | 'me' | 'private';

export type ChannelStatus = 'archived' | 'deleted' | 'normal' | 'system';

export type ChannelRole = 'admin' | 'creator' | 'member';

export interface Channel {
  archivedAt: null | string;
  capacity: number;
  createdAt: string;
  displayed: boolean;
  id: string;
  me: { member: { organizationMemberId: string }; role: ChannelRole; type: 'member' };
  organization: { id: string };
  status: ChannelStatus;
  title: string;
  type: ChannelType;
  updatedAt: string;
  users: { participants: Array<{ member: { organizationMemberId: string }; type: 'member' }> };
}

export interface ChannelListResponse extends CountedRestResponse {
  result: Channel[];
}

export interface ChannelCreateParams {
  idType: 'email' | 'member-id';
}

export interface ChannelCreateBody {
  capacity: number | string;
  memberIds: string[];
  title?: string;
  type: 'direct' | 'private';
}

export interface ChannelCreateResponse extends RestResponse {
  result: {
    id: string;
  };
}

export interface ChannelAddMembersBody {
  memberIds: string[];
}

export interface ChannelRemoveMembersBody {
  memberIds: string[];
}
