import { prisma } from '@/config/database';
import type { User } from '@prisma/client';

type UpdateUserData = Partial<Pick<User, 'email' | 'username'>>;

class UserService {
  async getUserById(userId: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  }

  async updateUser(userId: number, updateData: UpdateUserData): Promise<User> {
    if (!updateData.email && !updateData.username) {
      throw new Error(
        'At least one field (email or username) must be provided'
      );
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return updatedUser;
  }

  async delete(userId: number): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}

export const userService = new UserService();
