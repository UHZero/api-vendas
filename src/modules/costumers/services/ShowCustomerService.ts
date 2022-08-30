import AppError from '@shared/errors/AppErrors';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CostumersRepository';

interface IRequest {
  id: string;
}
class ShowCustomerService {
  public async execute({ id }: IRequest): Promise<Customer> {
    const customersepository = getCustomRepository(CustomersRepository);

    const customer = await customersepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found!');
    }

    return customer;
  }
}

export default ShowCustomerService;