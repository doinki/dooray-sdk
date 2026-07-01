import type { DoorayApi } from '@dooray-sdk/client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registerTaskClose } from './close';
import { registerTaskCommentCreate } from './comment-create';
import { registerTaskCommentDelete } from './comment-delete';
import { registerTaskCommentList } from './comment-list';
import { registerTaskCommentUpdate } from './comment-update';
import { registerTaskCommentView } from './comment-view';
import { registerTaskCreate } from './create';
import { registerTaskFileDelete } from './file-delete';
import { registerTaskFileDownload } from './file-download';
import { registerTaskFileList } from './file-list';
import { registerTaskFileUpload } from './file-upload';
import { registerTaskFileView } from './file-view';
import { registerTaskList } from './list';
import { registerTaskMove } from './move';
import { registerTaskSetAssigneeStatus } from './set-assignee-status';
import { registerTaskSetParent } from './set-parent';
import { registerTaskSetStatus } from './set-status';
import { registerTaskUpdate } from './update';
import { registerTaskView } from './view';

export function registerTaskTools(server: McpServer, api: DoorayApi): void {
  registerTaskList(server, api);
  registerTaskView(server, api);
  registerTaskCreate(server, api);
  registerTaskUpdate(server, api);
  registerTaskClose(server, api);
  registerTaskMove(server, api);
  registerTaskSetStatus(server, api);
  registerTaskSetAssigneeStatus(server, api);
  registerTaskSetParent(server, api);
  registerTaskCommentList(server, api);
  registerTaskCommentView(server, api);
  registerTaskCommentCreate(server, api);
  registerTaskCommentUpdate(server, api);
  registerTaskCommentDelete(server, api);
  registerTaskFileList(server, api);
  registerTaskFileView(server, api);
  registerTaskFileDownload(server, api);
  registerTaskFileUpload(server, api);
  registerTaskFileDelete(server, api);
}
