import { NextApiRequest, NextApiResponse } from 'next';

export type Next = () => Promise<void>;

export type Middleware<
  RequestT extends NextApiRequest = NextApiRequest,
  ResponseT extends NextApiResponse = NextApiResponse
> = (req: RequestT, res: ResponseT, next: Next) => Promise<void>;

export type ErrorHandler = (res: NextApiResponse, error: unknown) => Promise<void>;
