import { DeleteProductRepository } from './deleteProductRepository';

export class ProductNotFoundError extends Error {
    constructor() {
        super('produit non trouvé');
        this.name = 'ProductNotFoundError';
    }
}

export class DeleteProductUseCase {
    private productRepository: DeleteProductRepository;

    constructor(productRepository: DeleteProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(id: number): Promise<void> {
        const product = await this.productRepository.findOneById(id);

        if (!product) {
            throw new ProductNotFoundError();
        }

        try {
            await this.productRepository.delete(id);
        } catch (error) {
            throw new Error('erreur lors de la suppression du produit');
        }
    }
}
