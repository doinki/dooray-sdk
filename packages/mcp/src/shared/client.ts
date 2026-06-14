import type { DoorayApi } from '@dooray-sdk/client';
import { createDoorayClient } from '@dooray-sdk/client';
import { DEFAULT_BASE_URL } from '@dooray-sdk/core/constants';
import { DoorayError } from '@dooray-sdk/core/errors';

export function createClient(): DoorayApi {
  const token = process.env.DOORAY_TOKEN?.trim();
  if (!token) {
    throw new DoorayError({
      code: 'unauthorized',
      hint: 'Set the DOORAY_TOKEN environment variable to a Dooray API token.',
      message: 'Missing DOORAY_TOKEN environment variable.',
    });
  }

  const baseUrl = process.env.DOORAY_BASE_URL?.trim() || DEFAULT_BASE_URL;

  return createDoorayClient({ baseUrl, token });
}
