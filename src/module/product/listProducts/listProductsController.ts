import { ListProductsTypeOrmRepository } from './listProductsTypeOrmRepository';

const express = require('express');
const router = express.Router();
import { Request, Response } from 'express';
import { ListProductsUseCase } from './listProductsUseCase';

router.get('/product', async (request: Request, response: Response) => {
    const listProductsTypeOrmRepository = new ListProductsTypeOrmRepository();
    const listProductsUseCase = new ListProductsUseCase(listProductsTypeOrmRepository);

    try {
        const products = await listProductsUseCase.execute();
        return response.status(200).json(products);
    } catch (error) {
        if (error instanceof Error) {
            return response.status(400).json({ message: error.message });
        }
        return response.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
