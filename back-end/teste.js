import UserModel from './entities/User.js'
async function main() {
  await UserModel.createTable();
  await UserModel.createUser('Ana', 'ana@email.com', '123');
  const users = await UserModel.getUsers();
  console.log(users);
}

main();
