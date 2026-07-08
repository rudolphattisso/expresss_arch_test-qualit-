import AppDataSource from '../../../config/db.config';
import { Product } from '../Product';
import { DeleteProductRepository } from './deleteProductRepository';
import { Repository } from 'typeorm';

export class DeleteProductTypeOrmRepository implements DeleteProductRepository {
    private productRepository: Repository<Product>;

    constructor() {
        this.productRepository = AppDataSource.getRepository(Product);
    }

    async findOneById(id: number): Promise<Product | null> {
        return await this.productRepository.findOneBy({ id });
    }

    async delete(id: number): Promise<void> {
        await this.productRepository.delete(id);
    }
}
