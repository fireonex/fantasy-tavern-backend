import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    userId?: string;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'secret_key', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.userId = (user as any)?.userId;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

