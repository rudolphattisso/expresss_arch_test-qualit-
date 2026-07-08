import { describe, expect, test } from '@jest/globals';
import { DeleteProductUseCase, ProductNotFoundError } from '../deleteProductUseCase';
import { DeleteProductRepository } from '../deleteProductRepository';
import { Product } from '../../Product';

class DeleteProductFoundDummyRepository implements DeleteProductRepository {
    async findOneById(id: number): Promise<Product | null> {
        return Object.assign(Object.create(Product.prototype), {
            id,
            title: 'switch2',
            price: 500,
            description: 'console nintendo'
        });
    }

    async delete(id: number): Promise<void> {
        // Ne fait rien, c'est un dummy
    }
}

class DeleteProductNotFoundRepository implements DeleteProductRepository {
    async findOneById(id: number): Promise<Product | null> {
        return null;
    }

    async delete(id: number): Promise<void> {
        // Ne fait rien, c'est un dummy
    }
}

class DeleteProductDeleteFailRepository implements DeleteProductRepository {
    async findOneById(id: number): Promise<Product | null> {
        return Object.assign(Object.create(Product.prototype), {
            id,
            title: 'switch2',
            price: 500,
            description: 'console nintendo'
        });
    }

    async delete(id: number): Promise<void> {
        throw new Error('database connection failed');
    }
}

describe('US-4 : Supprimer un produit', () => {
    test('Scénario 1 : suppression réussie', async () => {
        // Étant donné qu'il y a un produit enregistré avec l'id 1
        const repository = new DeleteProductFoundDummyRepository();
        const useCase = new DeleteProductUseCase(repository);

        // Quand je supprime le produit
        // Alors aucune erreur ne doit être lancée
        await expect(useCase.execute(1)).resolves.not.toThrow();
    });

    test('Scénario 2 : produit non trouvé', async () => {
        // Étant donné qu'il n'y a pas de produit avec l'id 999
        const repository = new DeleteProductNotFoundRepository();
        const useCase = new DeleteProductUseCase(repository);

        // Quand je tente de supprimer le produit
        // Alors une ProductNotFoundError doit être lancée avec le message «produit non trouvé»
        await expect(useCase.execute(999)).rejects.toThrow(ProductNotFoundError);
        await expect(useCase.execute(999)).rejects.toThrow('produit non trouvé');
    });

    test('Scénario 3 : échec, erreur de suppression non prévue', async () => {
        // Étant donné un produit existant mais une erreur base de données à la suppression
        const repository = new DeleteProductDeleteFailRepository();
        const useCase = new DeleteProductUseCase(repository);

        // Quand je supprime le produit
        // Alors une erreur doit être lancée
        await expect(useCase.execute(1)).rejects.toThrow('erreur lors de la suppression du produit');
    });
});
