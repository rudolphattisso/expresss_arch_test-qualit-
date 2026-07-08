import { DeleteProductTypeOrmRepository } from './deleteProductTypeOrmRepository';
import { DeleteProductUseCase, ProductNotFoundError } from './deleteProductUseCase';

const express = require('express');
const router = express.Router();
import { Request, Response } from 'express';

router.delete('/product/:id', async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);

    const deleteProductTypeOrmRepository = new DeleteProductTypeOrmRepository();
    const deleteProductUseCase = new DeleteProductUseCase(deleteProductTypeOrmRepository);

    try {
        await deleteProductUseCase.execute(id);
    } catch (error) {
        if (error instanceof ProductNotFoundError) {
            return response.status(404).json({ message: error.message });
        }
        if (error instanceof Error) {
            return response.status(400).json({ message: error.message });
        }
        return response.status(500).json({ message: 'Internal server error' });
    }

    return response.status(201).json();
});

module.exports = router;
