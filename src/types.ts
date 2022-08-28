import { NextApiRequest, NextApiResponse } from 'next';

export type Next = () => Promise<void>;

export type Middleware<RequestT extends NextApiRequest = NextApiRequest> = (
  req: RequestT,
  res: NextApiResponse,
  next: Next
) => Promise<void>;
