import { delay } from '~/utils/promise';

export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number,
  delayMs: number
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    await delay(delayMs);
    return await retry(fn, retries - 1, delayMs);
  }
};
