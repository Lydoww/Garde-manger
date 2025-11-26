import { prisma } from '../config/database';
import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';

interface CreateUserDTO {
  email: string;
  password: string;
  username: string;
}

class UserService {
  async createUser(userData: CreateUserDTO): Promise<User> {
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

  async getUserById(userId: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }
}

export const userService = new UserService();
