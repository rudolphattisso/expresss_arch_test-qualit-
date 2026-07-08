import { ListProductsRepository } from './listProductsRepository';

type ProductSummary = {
    title: string;
    price: number;
};

export class ListProductsUseCase {
    private productRepository: ListProductsRepository;

    constructor(productRepository: ListProductsRepository) {
        this.productRepository = productRepository;
    }

    async execute(): Promise<ProductSummary[]> {
        try {
            const products = await this.productRepository.findAll();
            return products.map(p => ({ title: p.title, price: p.price }));
        } catch (error) {
            throw new Error('erreur lors de la récupération des produits');
        }
    }
}
