import type { Member } from '@dooray-sdk/client/common';

import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export function renderMember({ data }: { data: Member }): string {
  return renderKeyValue([
    ['ID', data.id],
    ['Name', data.name],
    ['User Code', data.userCode],
    ['External Email', data.externalEmailAddress],
    ['Locale', data.locale],
    ['Timezone', data.timezoneName],
  ]);
}
