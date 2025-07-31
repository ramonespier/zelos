import database from '../configs/database.js';
const db = database.getConnection();
class UserEntity{
    async createTable(){
        const exists = await db.schema.hasTable('users');
        if(!exists){
            await db.schema.createTable('users', table => {
                table.increments('id').primary();
                table.string('nome'), 
                table.string('email')
                table.string('senha')
            });
            console.log('Tabela users criada!!!');
        }
    }

        async createUser(nome, email, senha) {
            await db('users').insert({ nome, email, senha });
            console.log('Usuário inserido!');
          }
        
          async getUsers() {
            return await db('users').select('*');
          }
        }


export default new UserEntity();