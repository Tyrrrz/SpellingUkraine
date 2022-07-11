import { NextApiHandler } from 'next';

export const endpoint = <T = unknown>(method: string, handler: NextApiHandler<T>) => {
  const outerHandler: NextApiHandler<T> = async (req, res) => {
    if (req.method !== method) {
      res.status(405).end(`Method '${req.method}' not allowed, expected '${method}'`);
      return;
    }

    try {
      await handler(req, res);
    } catch (err) {
      console.error(err);
      res.status(500).end(err);
    }
  };

  return outerHandler;
};

export const get = <T = unknown>(handler: NextApiHandler<T>) => endpoint('GET', handler);
export const post = <T = unknown>(handler: NextApiHandler<T>) => endpoint('POST', handler);
