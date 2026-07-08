import { describe, expect, test } from '@jest/globals';
import { ListProductsUseCase } from '../listProductsUseCase';
import { ListProductsRepository } from '../listProductsRepository';
import { Product } from '../../Product';

class ListProductsDummyRepository implements ListProductsRepository {
    private products: Product[];

    constructor(products: Product[] = []) {
        this.products = products;
    }

    async findAll(): Promise<Product[]> {
        return this.products;
    }
}

class ListProductsMockFailRepository implements ListProductsRepository {
    async findAll(): Promise<Product[]> {
        throw new Error('database connection failed');
    }
}

describe('US-3 : Lister les produits', () => {
    test('Scénario 1 : liste réussie avec plusieurs produits', async () => {
        // Étant donné qu'il y a des produits enregistrés
        const product1 = new Product({ title: 'switch2', description: 'console nintendo', price: 500 });
        const product2 = new Product({ title: 'ps5', description: 'console sony', price: 600 });
        const repository = new ListProductsDummyRepository([product1, product2]);
        const useCase = new ListProductsUseCase(repository);

        // Quand je liste les produits
        const result = await useCase.execute();

        // Alors je reçois le titre et le prix pour chaque produit
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ title: 'switch2', price: 500 });
        expect(result[1]).toEqual({ title: 'ps5', price: 600 });
    });

    test('Scénario 2 : liste réussie sans produits', async () => {
        // Étant donné qu'il n'y a pas de produit enregistré
        const repository = new ListProductsDummyRepository([]);
        const useCase = new ListProductsUseCase(repository);

        // Quand je liste les produits
        const result = await useCase.execute();

        // Alors je reçois un tableau vide
        expect(result).toEqual([]);
    });

    test('Scénario 3 : liste retourne uniquement titre et prix', async () => {
        // Étant donné un produit avec une description
        const product = new Product({ title: 'switch2', description: 'console nintendo', price: 500 });
        const repository = new ListProductsDummyRepository([product]);
        const useCase = new ListProductsUseCase(repository);

        // Quand je liste les produits
        const result = await useCase.execute();

        // Alors seuls le titre et le prix sont retournés (pas la description, pas l'id)
        expect(result[0]).toStrictEqual({ title: 'switch2', price: 500 });
        expect(result[0]).not.toHaveProperty('description');
        expect(result[0]).not.toHaveProperty('id');
    });

    test('Scénario 4 : échec, erreur de récupération non prévue', async () => {
        // Étant donné une erreur base de données
        const repository = new ListProductsMockFailRepository();
        const useCase = new ListProductsUseCase(repository);

        // Quand je liste les produits
        // Alors une erreur doit être lancée
        await expect(useCase.execute()).rejects.toThrow('erreur lors de la récupération des produits');
    });
});
