import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        firstName: string;
        lastName: string;
      };
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}

export {};
