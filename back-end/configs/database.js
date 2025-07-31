import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Database {
    constructor() {
        this.connection = knex({
            client: 'sqlite3',
            connection: {
                filename: path.resolve(__dirname, 'db.sqlite')
            },
            useNullAsDefault: true,
        });
    }

    getConnection() {
        return this.connection;
    }
}

export default new Database();
