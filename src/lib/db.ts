import { Pool } from 'pg';

let pool: Pool;

if (!process.env.DATABASE_URL) {
    throw new Error('Please define the DATABASE_URL environment variable inside .env');
}

if (process.env.NODE_ENV === 'production') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
} else {
    // In development, use a global variable so we don't exhaust the connection pool
    // when HMR happens (Hot Module Replacement).
    if (!(global as any).postgres) {
        (global as any).postgres = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
    }
    pool = (global as any).postgres;
}

export default pool;
