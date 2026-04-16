import { describe, expect, test } from '@jest/globals';
import { CreateProductUseCase } from '../createProductUseCase';
import { CreateProductRepository } from '../createProductRepository';
import { Product } from '../../Product';

class CreateProductDummyRepository implements CreateProductRepository {
    async save(product: Product): Promise<void> {
        // Ne fait rien, c'est un dummy
    }
}

class CreateProductMockFailRepository implements CreateProductRepository {
    async save(product: Product): Promise<void> {
        throw new Error('fail gtredeapkdzepnip ');
    }
}

describe('US-1 : Créer un produit', () => {
    test('Scénario 1 : création réussie', async () => {
        // Étant donné qu'il n'y a pas de produit enregistré
        const createProductRepository = new CreateProductDummyRepository();
        const createProductUseCase = new CreateProductUseCase(createProductRepository);

        await expect(
            // Quand je créé un produit avec en titre «switch2», description «nouvelle console» et un prix à 500
            createProductUseCase.execute({
                title: 'switch2',
                description: 'nouvelle console',
                price: 500
            })
            // Alors le produit doit être créé
        ).resolves.not.toThrow();
    });

    test('Scénario 2 : echec, titre trop court', async () => {
        //Étant donné qu'il n'y a pas de produit enregistré
        const createProductRepository = new CreateProductDummyRepository();

        const createProductUseCase = new CreateProductUseCase(createProductRepository);

        await expect(
            // Quand je créé un produit avec en titre «sw»
            createProductUseCase.execute({
                title: 'sw',
                description: 'nouvelle console',
                price: 500
            })
            // Alors une erreur doit être envoyée "titre trop court»
        ).rejects.toThrow('titre trop court');
    });

    test('Scénario 3 : echec, prix négatif', async () => {
        //Étant donné qu'il n'y a pas de produit enregistré
        const createProductRepository = new CreateProductDummyRepository();
        const createProductUseCase = new CreateProductUseCase(createProductRepository);

        await expect(
            // Quand je créé un produit avec en prix -10
            createProductUseCase.execute({
                title: 'switch2',
                description: 'nouvelle console',
                price: -10
            })
            // Alors une erreur doit être envoyée "le prix doit être supérieur à 0»
        ).rejects.toThrow('le prix doit être supérieur à 0');
    });

    test('Scénario 4 : création échouée, prix supérieur à 10000', async () => {
        //Étant donné qu'il n'y a pas de produit enregistré
        const createProductRepository = new CreateProductDummyRepository();
        const createProductUseCase = new CreateProductUseCase(createProductRepository);

        await expect(
            // Quand je créé un produit avec en prix 11000
            createProductUseCase.execute({
                title: 'switch2',
                description: 'nouvelle console',
                price: 11000
            })
            // Alors une erreur doit être envoyée "le prix doit être inférieur à 10000»
        ).rejects.toThrow('le prix doit être inférieur à 10000');
    });

    //    - Exemple 5/ Scénario 5 : création échouée, échec de sauvegarde non prévue
    //       - Étant donné qu'il n'y a pas de produit enregistré
    //       - Quand je créé un produit, si la sauvegarde échoue
    //       - Alors une erreur doit être envoyée «erreur lors de la création du produit»

    test('Scénario 5 : création échouée, échec de sauvegarde non prévue', async () => {
        //Étant donné qu'il n'y a pas de produit enregistré
        const createProductRepository = new CreateProductMockFailRepository();
        const createProductUseCase = new CreateProductUseCase(createProductRepository);

        await expect(
            // Quand je créé un produit
            createProductUseCase.execute({
                title: 'switch2',
                description: 'nouvelle console',
                price: 500
            })
            // Alors une erreur doit être envoyée «erreur lors de la création du produit»
        ).rejects.toThrow('erreur lors de la création du produit');
    });

    test('Scénario 6 : création échouée, titre trop long (plus de 20 caractères)', async () => {
        //Étant donné qu'il n'y a pas de produit enregistré
        const createProductRepository = new CreateProductDummyRepository();
        const createProductUseCase = new CreateProductUseCase(createProductRepository);

        await expect(
            // Quand je créé un produit avec un titre de 21 caractères
            createProductUseCase.execute({
                title: '123456789012345678901', // 21 caractères
                description: 'nouvelle console',
                price: 500
            })
            // Alors une erreur doit être envoyée "le titre doit faire 20 caractères max"
        ).rejects.toThrow('le titre doit faire 20 caractères max');
    });

    test('Scénario 7 : création échouée, description contient @', async () => {
        //Étant donné qu'il n'y a pas de produit enregistré
        const createProductRepository = new CreateProductDummyRepository();
        const createProductUseCase = new CreateProductUseCase(createProductRepository);

        await expect(
            // Quand je créé un produit avec une description contenant @
            createProductUseCase.execute({
                title: 'switch2',
                description: 'nouvelle@console',
                price: 500
            })
            // Alors une erreur doit être envoyée "la description ne doit pas contenir @"
        ).rejects.toThrow('la description ne doit pas contenir @');
    });

    test('Scénario 8 : création échouée, titre commence par un espace', async () => {
        //Étant donné qu'il n'y a pas de produit enregistré
        const createProductRepository = new CreateProductDummyRepository();
        const createProductUseCase = new CreateProductUseCase(createProductRepository);

        await expect(
            // Quand je créé un produit avec un titre commençant par un espace
            createProductUseCase.execute({
                title: ' switch2',
                description: 'nouvelle console',
                price: 500
            })
            // Alors une erreur doit être envoyée "le titre ne doit pas commencer par un espace"
        ).rejects.toThrow('le titre ne doit pas commencer par un espace');
    });
});
