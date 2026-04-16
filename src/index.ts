import { buildApp } from './config/app';
import { config } from 'dotenv';
import AppDataSource from './config/db.config';

config({ path: '.env.local' });

AppDataSource.initialize()
    .then(() => {
        const port = Number(process.env.PORT ?? 3000);
        if (!Number.isInteger(port) || port <= 0 || port > 65535) {
            throw new Error(`Invalid PORT value: "${process.env.PORT}"`);
        }

        console.log('Data Source has been initialized!');
        buildApp().listen(port, () => console.log(`Server started on port ${port}`));
    })
    .catch((err: Error) => {
        console.error('Error during Data Source initialization:', err);
    });
