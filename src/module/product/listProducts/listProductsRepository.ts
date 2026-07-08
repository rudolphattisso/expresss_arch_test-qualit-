import { Product } from '../Product';

export interface ListProductsRepository {
    findAll(): Promise<Product[]>;
}
