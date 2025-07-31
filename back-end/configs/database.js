import knex from 'knex';

class Database {
    constructor() {
        this.connection = knex({
            client: 'mysql2',
            connection: {
                host: 'localhost',       
                user: 'root',             
                password: '',    
                database: 'sistema_chamados'
            },
            useNullAsDefault: true,
        });
    }

    getConnection() {
        return this.connection;
    }
}

export default new Database();
