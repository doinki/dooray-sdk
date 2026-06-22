import type { Member } from '@dooray-sdk/client/common';

import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export function renderMember({ data }: { data: Member }): string {
  return renderKeyValue([
    ['id', data.id],
    ['name', data.name],
    ['userCode', data.userCode],
    ['externalEmail', data.externalEmailAddress],
    ['locale', data.locale],
    ['timezone', data.timezoneName],
  ]);
}
