import AppDataSource from '../../../config/db.config';
import { Product } from '../Product';
import { ListProductsRepository } from './listProductsRepository';

export class ListProductsTypeOrmRepository implements ListProductsRepository {
    async findAll(): Promise<Product[]> {
        const typeOrmRepository = AppDataSource.getRepository<Product>(Product);
        return await typeOrmRepository.find();
    }
}
