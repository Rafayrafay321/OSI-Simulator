import { Request, Response } from 'express';

export const send = (req: Request, res: Response) => {
  res.send('Send Controller');

  res.status(200);
};
