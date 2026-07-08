import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { Product } from '../../Product';
import { buildApp } from '../../../../config/app';
import request from 'supertest';
import { Express } from 'express';

describe('US-3 : Lister les produits - E2E', () => {
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

    test('Scénario 1 : liste réussie avec des produits', async () => {
        // Étant donné deux produits enregistrés en base
        await dataSource.getRepository(Product).clear();

        const product1 = new Product({ title: 'switch2', description: 'console nintendo', price: 500 });
        const product2 = new Product({ title: 'ps5', description: 'console sony', price: 600 });
        await dataSource.getRepository(Product).save(product1);
        await dataSource.getRepository(Product).save(product2);

        // Quand je liste les produits
        const response = await request(app)
            .get('/api/product')
            .set('Content-Type', 'application/json');

        // Alors je reçois 200 avec un tableau contenant titre et prix de chaque produit
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toEqual({ title: 'switch2', price: 500 });
        expect(response.body[1]).toEqual({ title: 'ps5', price: 600 });
    });

    test('Scénario 2 : liste réussie sans produits', async () => {
        // Étant donné qu'il n'y a pas de produit enregistré
        await dataSource.getRepository(Product).clear();

        // Quand je liste les produits
        const response = await request(app)
            .get('/api/product')
            .set('Content-Type', 'application/json');

        // Alors je reçois 200 avec un tableau vide
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('Scénario 3 : la réponse ne contient que le titre et le prix', async () => {
        // Étant donné un produit avec une description
        await dataSource.getRepository(Product).clear();

        const product = new Product({ title: 'switch2', description: 'console nintendo', price: 500 });
        await dataSource.getRepository(Product).save(product);

        // Quand je liste les produits
        const response = await request(app)
            .get('/api/product')
            .set('Content-Type', 'application/json');

        // Alors la réponse ne contient pas la description ni l'id
        expect(response.status).toBe(200);
        expect(response.body[0]).toStrictEqual({ title: 'switch2', price: 500 });
        expect(response.body[0]).not.toHaveProperty('description');
        expect(response.body[0]).not.toHaveProperty('id');
    });
});
