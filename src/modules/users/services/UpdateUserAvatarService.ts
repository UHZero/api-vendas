import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppErrors';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import User from '../typeorm/entities/User';
import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);
    const storageProvider = new DiskStorageProvider();
    const user = await usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found!');
    }

    if (user.avatar) {
      await storageProvider.deleteFile(user.avatar);
    }

    const fileName = await storageProvider.saveFile(avatarFileName);

    user.avatar = fileName;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
