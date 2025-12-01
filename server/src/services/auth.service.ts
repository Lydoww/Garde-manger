import authConfig from '@/config/auth.config';
import { prisma } from '@/config/database';
import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface CreateUserDTO {
  email: string;
  password: string;
  username: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

class AuthService {
  async register(userData: CreateUserDTO): Promise<User> {
    const exists = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (exists) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        hashPassword: hashedPassword,
        username: userData.username,
      },
    });
    return user;
  }

  async login(userEmail: string, userPassword: string): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    if (!user) {
      throw new Error('User does not exist');
    }
    const comparedPwd = await bcrypt.compare(userPassword, user.hashPassword);
    if (!comparedPwd) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(token, authConfig.jwtRefresh.secret) as {
        userId: number;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }
      if (user.refreshToken !== token) {
        throw new Error('Invalid refresh token');
      }

      const accessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
      );

      return { accessToken };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      throw error;
    }
  }

  async logout(userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  
}

export const authService = new AuthService();
