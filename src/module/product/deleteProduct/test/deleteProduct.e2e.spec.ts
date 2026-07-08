import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { Product } from '../../Product';
import { buildApp } from '../../../../config/app';
import request from 'supertest';
import { Express } from 'express';

describe('US-4 : Supprimer un produit - E2E', () => {
    let container: StartedPostgreSqlContainer;
    let dataSource: DataSource;
    let app: Express;

    beforeAll(async () => {
        container = await new PostgreSqlContainer('postgres:16').withExposedPorts(5432).start();

        dataSource = new DataSource({
            type: 'postgres',
            host: container.getHost(),
            port: container.getPort(),
            username: container.getUsername(),
            password: container.getPassword(),
            database: container.getDatabase(),
            logging: false,
            entities: [Product],
            synchronize: true,
            entitySkipConstructor: true
        });

        await dataSource.initialize();

        const AppDataSource = require('../../../../config/db.config').default;

        app = buildApp();

        Object.assign(AppDataSource, dataSource);
    });

    afterAll(async () => {
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
        if (container) {
            await container.stop();
        }
    });

    test('Scénario 1 : suppression réussie', async () => {
        // Étant donné un produit enregistré en base
        await dataSource.getRepository(Product).clear();

        const product = new Product({ title: 'switch2', description: 'console nintendo', price: 500 });
        await dataSource.getRepository(Product).save(product);

        // Quand je supprime le produit
        const response = await request(app)
            .delete(`/api/product/${product.id}`)
            .set('Content-Type', 'application/json');

        // Alors je reçois une réponse 201 et le produit est supprimé de la base
        expect(response.status).toBe(201);
        const products = await dataSource.getRepository(Product).find();
        expect(products).toHaveLength(0);
    });

    test('Scénario 2 : produit non trouvé', async () => {
        // Étant donné qu'il n'y a pas de produit avec cet id
        await dataSource.getRepository(Product).clear();

        // Quand je tente de supprimer un produit inexistant
        const response = await request(app)
            .delete('/api/product/999')
            .set('Content-Type', 'application/json');

        // Alors je reçois une réponse 404 avec un message d'erreur
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('produit non trouvé');
    });
});
