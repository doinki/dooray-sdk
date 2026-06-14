import type { RestResponseError } from '@dooray-sdk/client/lib';
import { CONTRACT_VIOLATION_RESULT_CODE } from '@dooray-sdk/client/lib';

import type { SurfaceError, SurfaceErrorCode } from './surface';

const REST_STATUS_MAP: Record<number, { code: SurfaceErrorCode; hint: string; prefix: string }> = {
  401: {
    code: 'unauthorized',
    hint: 'Check that your Dooray API token is valid and not expired.',
    prefix: 'Authentication failed',
  },
  403: {
    code: 'unauthorized',
    hint: 'Your token lacks permission for this resource.',
    prefix: 'Permission denied',
  },
  404: {
    code: 'validation',
    hint: 'Check the id — the resource does not exist or is not visible to your token.',
    prefix: 'Not found',
  },
  409: {
    code: 'validation',
    hint: 'The resource already exists or has changed. Re-fetch, then retry.',
    prefix: 'Conflict',
  },
  415: {
    code: 'validation',
    hint: 'Set the correct Content-Type for the request.',
    prefix: 'Unsupported media type',
  },
};

export function fromRestResponseError(error: RestResponseError): SurfaceError {
  const status = error.response.status;
  const resultCode = error.data.header.resultCode;
  const resultMessage = error.data.header.resultMessage;
  const detail = resultMessage ? ` - ${resultMessage}` : '';

  if (resultCode === CONTRACT_VIOLATION_RESULT_CODE) {
    return {
      code: 'server',
      hint: 'The Dooray API returned an unexpected response. Retry, and report it if it persists.',
      message: `Unexpected response from the Dooray API${detail}.`,
    };
  }

  if (status === 429) {
    const rl = readRateLimitHeaders(error.response.headers);
    return {
      code: 'rate_limited',
      hint: formatRateLimitHint(rl),
      message: `Rate limit exceeded${detail}${formatRateLimitSuffix(rl)}.`,
    };
  }

  const mapped = REST_STATUS_MAP[status];
  if (mapped) {
    return {
      code: mapped.code,
      hint: mapped.hint,
      message: `${mapped.prefix}${detail}.`,
    };
  }

  if (status >= 500) {
    return {
      code: 'server',
      hint: 'A temporary Dooray API error. Try again shortly.',
      message: `Dooray API server error${detail}.`,
    };
  }

  return {
    code: 'validation',
    hint: 'Check the request parameters.',
    message: `Bad request${detail}.`,
  };
}

interface RateLimitInfo {
  burstCapacity?: number;
  remaining?: number;
  replenishRateRps?: number;
  requestedTokens?: number;
}

function readRateLimitHeaders(headers: Headers): RateLimitInfo {
  return {
    burstCapacity: numberOrUndefined(headers.get('X-RateLimit-Burst-Capacity')),
    remaining: numberOrUndefined(headers.get('X-RateLimit-Remaining')),
    replenishRateRps: numberOrUndefined(headers.get('X-RateLimit-Replenish-Rate')),
    requestedTokens: numberOrUndefined(headers.get('X-RateLimit-Requested-Tokens')),
  };
}

function formatRateLimitSuffix(info: RateLimitInfo): string {
  const parts: string[] = [];

  if (info.remaining != null) parts.push(`remaining ${info.remaining}`);
  if (info.requestedTokens != null) parts.push(`requested ${info.requestedTokens}`);
  if (info.burstCapacity != null) parts.push(`burst ${info.burstCapacity}`);
  if (info.replenishRateRps != null) parts.push(`replenish ${info.replenishRateRps}/s`);

  return parts.length === 0 ? '' : ` [${parts.join(', ')}]`;
}

function formatRateLimitHint(info: RateLimitInfo): string {
  const base = 'Dooray API rate limit reached.';

  if (info.replenishRateRps != null && info.replenishRateRps > 0) {
    const shortfall = Math.max((info.requestedTokens ?? 1) - (info.remaining ?? 0), 1);
    const waitSec = Math.ceil(shortfall / info.replenishRateRps);
    return `${base} Retry in about ${String(waitSec)}s.`;
  }

  return `${base} Retry in a moment.`;
}

function numberOrUndefined(value: null | string): number | undefined {
  if (value == null) return;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}
