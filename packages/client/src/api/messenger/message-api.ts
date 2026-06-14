import type { DoorayClient } from '../../lib/dooray-client';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class MessengerMessageApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public sendWithThread(
    { body, path }: { body: MessageSendWithThreadBody; path: { channelId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.post<MessageSendWithThreadResponse>(
      { body, path: url`messenger/v1/channels/${path.channelId}/threads/create-and-send` },
      init,
    );
  }

  public replyInThread(
    { body, path }: { body: MessageReplyInThreadBody; path: { channelId: string; messageId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.post<MessageReplyInThreadResponse>(
      {
        body,
        path: url`messenger/v1/channels/${path.channelId}/logs/${path.messageId}/threads/create-and-send`,
      },
      init,
    );
  }

  public delete({ path }: { path: { channelId: string; messageId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>(
      {
        path: url`messenger/v1/channels/${path.channelId}/logs/${path.messageId}`,
      },
      init,
    );
  }

  public sendDirect({ body }: { body: MessageSendDirectBody }, init?: RestRequestInit) {
    return this.#client.post<MessageSendDirectResponse>({ body, path: 'messenger/v1/channels/direct-send' }, init);
  }

  public reply(
    { body, path }: { body: MessageReplyBody; path: { channelId: string; messageId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.post<MessageReplyResponse>(
      {
        body,
        path: url`messenger/v1/channels/${path.channelId}/logs/${path.messageId}/reply`,
      },
      init,
    );
  }

  public send({ body, path }: { body: MessageSendBody; path: { channelId: string } }, init?: RestRequestInit) {
    return this.#client.post<MessageSendResponse>(
      { body, path: url`messenger/v1/channels/${path.channelId}/logs` },
      init,
    );
  }

  public update(
    { body, path }: { body: MessageUpdateBody; path: { channelId: string; messageId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`messenger/v1/channels/${path.channelId}/logs/${path.messageId}`,
      },
      init,
    );
  }
}

export interface MessageSendDirectBody {
  organizationMemberId: string;
  text: string;
}

export interface MessageSendDirectResponse extends RestResponse {
  result: {
    channelId: number;
    directMemberId: number;
    flags: number;
    id: number;
    mentionCount: number;
    senderId: number;
    sentAt: number;
    seq: number;
    text: string;
    type: number;
    unreadCount: number;
  };
}

export interface MessageSendBody {
  text: string;
}

export interface MessageSendResponse extends RestResponse {
  result: {
    channelId: string;
    id: string;
  };
}

export interface MessageUpdateBody {
  text: string;
}

export interface MessageReplyBody {
  text: string;
}

export interface MessageReplyResponse extends RestResponse {
  result: {
    channelId: string;
    id: string;
  };
}

export interface MessageSendWithThreadBody {
  text: string;
  threadText?: string;
}

export interface MessageSendWithThreadResponse extends RestResponse {
  result: {
    channelId: string;
    id: string;
  };
}

export interface MessageReplyInThreadBody {
  text: string;
}

export interface MessageReplyInThreadResponse extends RestResponse {
  result: {
    channelId: string;
    id: string;
  };
}
