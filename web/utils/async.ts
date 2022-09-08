export const bufferIterable = async <T>(
  generator: AsyncIterable<T>,
  callback?: (item: T) => void
) => {
  const buffer: T[] = [];

  for await (const item of generator) {
    buffer.push(item);
    callback?.(item);
  }

  return buffer;
};
