import database from "../configs/database.js";
const db = database.getConnection();

class AdministradorEntity{
    async createTable(){
        const exists = await db.schema.hasTable('administradores');

        if(!exists){
            await db.schema.createTable('administradores', table => {
                    table.increments('id').primary();
                    table.string('nome');
                    table.string('email');
                    table.string('senha');
            });
            console.log('Tabela de administradores criada!!!')
        }
    }

    async createUsers(nome, email, senha){
        await db('administradores').insert({
            nome,
            email,
            senha
        })

    }
        async getUsers(){
            return await db('administradores').select('*');
        }

    }

