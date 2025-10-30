import { NotFoundError } from '../error';
import { UserModel } from '../models/user.model';

export const UserService = {
  getUser: async (userId: string) => {
    console.log('userId', userId);
    const user = await UserModel.findById(userId).select(['email', 'name']);
    if (!user) {
      throw new NotFoundError('User Not found');
    }
    return user;
  },
};
