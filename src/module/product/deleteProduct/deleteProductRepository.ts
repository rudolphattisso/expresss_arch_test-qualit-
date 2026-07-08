import { Product } from '../Product';

export interface DeleteProductRepository {
    findOneById(id: number): Promise<Product | null>;
    delete(id: number): Promise<void>;
}
