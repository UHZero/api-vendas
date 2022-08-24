import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppErrors';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UsersTokensRepository from '../typeorm/repositories/UsersTokensRepository';
import Ethereal from '@config/mail/Ethereal';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UsersTokensRepository);

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists!');
    }

    const token = await userTokensRepository.generate(user.id);

    await Ethereal.sendMail({
      to: email,
      body: `Password Recovery Key: ${token?.token}`,
    });
  }
}

export default SendForgotPasswordEmailService;
