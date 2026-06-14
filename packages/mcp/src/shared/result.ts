import { toSurfaceError } from '@dooray-sdk/core/errors';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function jsonResult(data: unknown): CallToolResult {
  const payload = Array.isArray(data) ? { data } : data;

  return {
    content: [{ text: JSON.stringify(payload), type: 'text' }],
    ...(isObjectLike(payload) ? { structuredContent: payload } : {}),
  };
}

function errorResult(error: unknown): CallToolResult {
  const body = toSurfaceError(error);

  return { content: [{ text: JSON.stringify({ error: body }), type: 'text' }], isError: true };
}

export async function runTool(handler: () => Promise<unknown>): Promise<CallToolResult> {
  try {
    return jsonResult(await handler());
  } catch (error: unknown) {
    return errorResult(error);
  }
}
