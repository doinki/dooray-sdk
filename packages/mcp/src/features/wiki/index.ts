import type { DoorayApi } from '@dooray-sdk/client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registerWikiCommentCreate } from './comment-create';
import { registerWikiCommentDelete } from './comment-delete';
import { registerWikiCommentList } from './comment-list';
import { registerWikiCommentUpdate } from './comment-update';
import { registerWikiCommentView } from './comment-view';
import { registerWikiCreate } from './create';
import { registerWikiDelete } from './delete';
import { registerWikiFileDelete } from './file-delete';
import { registerWikiFileDownload } from './file-download';
import { registerWikiFileUpload } from './file-upload';
import { registerWikiList } from './list';
import { registerWikiMove } from './move';
import { registerWikiProjectFileDownload } from './project-file-download';
import { registerWikiProjectFileUpload } from './project-file-upload';
import { registerWikiProjectList } from './project-list';
import { registerWikiSharedLinkList } from './shared-link-list';
import { registerWikiUpdate } from './update';
import { registerWikiUpdateBody } from './update-body';
import { registerWikiUpdateCc } from './update-cc';
import { registerWikiUpdateTitle } from './update-title';
import { registerWikiView } from './view';

export function registerWikiTools(server: McpServer, api: DoorayApi): void {
  registerWikiList(server, api);
  registerWikiView(server, api);
  registerWikiCreate(server, api);
  registerWikiUpdate(server, api);
  registerWikiUpdateTitle(server, api);
  registerWikiUpdateBody(server, api);
  registerWikiUpdateCc(server, api);
  registerWikiDelete(server, api);
  registerWikiMove(server, api);
  registerWikiCommentList(server, api);
  registerWikiCommentView(server, api);
  registerWikiCommentCreate(server, api);
  registerWikiCommentUpdate(server, api);
  registerWikiCommentDelete(server, api);
  registerWikiFileUpload(server, api);
  registerWikiFileDownload(server, api);
  registerWikiFileDelete(server, api);
  registerWikiSharedLinkList(server, api);
  registerWikiProjectList(server, api);
  registerWikiProjectFileUpload(server, api);
  registerWikiProjectFileDownload(server, api);
}
