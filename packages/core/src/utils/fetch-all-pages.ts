export async function fetchAllPages<
  T extends { paging: { hasNext: boolean; page: number; size: number }; result: readonly unknown[] },
>(fetcher: (page: number) => Promise<T>): Promise<T> {
  const first = await fetcher(0);
  if (!first.paging.hasNext) return first;

  const bucket = [first.result];

  let response = first;
  for (let page = 1; response.paging.hasNext; page += 1) {
    // oxlint-disable-next-line no-await-in-loop
    response = await fetcher(page);
    bucket.push(response.result);
  }

  const result = bucket.flat();

  return { ...response, paging: { ...response.paging, hasNext: false, page: 0, size: result.length }, result } as T;
}
