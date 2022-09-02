export const bufferIterable = async <T>(generator: AsyncIterable<T>) => {
  const buffer: T[] = [];

  for await (const item of generator) {
    buffer.push(item);
  }

  return buffer;
};
