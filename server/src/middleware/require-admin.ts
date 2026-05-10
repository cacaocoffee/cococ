import type { Request, Response, NextFunction } from 'express';
import { isValid } from '../lib/admin-tokens.js';

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const match = /^Bearer\s+(.+)$/.exec(header);
  if (!match || !isValid(match[1])) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}
