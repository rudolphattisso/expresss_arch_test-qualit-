import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { Product } from '../../Product';
import { buildApp } from '../../../../config/app';
import request from 'supertest';
import { Express } from 'express';

describe('US-2 : Modifier un produit - E2E', () => {
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

    test('Scénario 1 : modification réussie', async () => {
        await dataSource.getRepository(Product).clear();

        const product = new Product({
            title: 'switch2',
            description: 'nouvelle console',
            price: 500
        });
        await dataSource.getRepository(Product).save(product);

        const response = await request(app)
            .post(`/api/product/${product.id}`)
            .send({
                title: 'switch3',
                description: 'console mise à jour',
                price: 5000
            })
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(201);

        const updatedProduct = await dataSource.getRepository(Product).findOneBy({ id: product.id });
        expect(updatedProduct).not.toBeNull();
        expect(updatedProduct?.title).toBe('switch3');
        expect(updatedProduct?.description).toBe('console mise à jour');
        expect(updatedProduct?.price).toBe(5000);
    });
});
