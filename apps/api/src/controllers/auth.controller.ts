import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { MESSAGES, HTTP_STATUS } from '../constants/index';
import authService from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.register(req.body);

  ApiResponse.created(res, MESSAGES.AUTH.REGISTER_SUCCESS, {
    user,
    tokens,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.login(req.body);

  ApiResponse.success(res, MESSAGES.AUTH.LOGIN_SUCCESS, {
    user,
    tokens,
  });
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);

    ApiResponse.success(res, MESSAGES.AUTH.TOKEN_REFRESHED, { tokens });
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);

  ApiResponse.success(res, MESSAGES.AUTH.LOGOUT_SUCCESS);
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  await authService.logoutAll(req.user!.id);

  ApiResponse.success(res, MESSAGES.AUTH.LOGOUT_SUCCESS);
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email);

    ApiResponse.success(res, MESSAGES.AUTH.PASSWORD_RESET_SENT);
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.token, req.body.newPassword);

    ApiResponse.success(res, MESSAGES.AUTH.PASSWORD_RESET_SUCCESS);
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.changePassword(
      req.user!.id,
      req.body.currentPassword,
      req.body.newPassword
    );

    ApiResponse.success(res, MESSAGES.AUTH.PASSWORD_CHANGED);
  }
);

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  ApiResponse.success(res, MESSAGES.USER.PROFILE_FETCHED, {
    user: req.user,
  });
});

export default {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
};
