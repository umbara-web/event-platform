import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // In a real app we'd validate with Zod here
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const result = await authService.registerService({
      name,
      email,
      password,
      phone,
      role: role || 'ATTENDEE', // Default role
    });

    res.status(201).json({
      message: 'Registrasi berhasil',
      data: {
        id: result.id,
        email: result.email,
        name: result.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email dan password harus diisi' });
    }

    const result = await authService.loginService({ email, password } as any);

    res.status(200).json({
      message: 'Login berhasil',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
