import ProductRepository from './../typeorm/repositories/ProductsRepository';
import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppErrors';
import Product from '../typeorm/entities/Product';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    const productsExistis = await productsRepository.findByName(name);

    if (productsExistis) {
      throw new AppError('There is already one product whith this name!');
    }
    const product = productsRepository.create({
      name,
      price,
      quantity,
    });

    await productsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
