const useUserRepository = require("../../app/repositories/UsersRepository");
const userRepository = useUserRepository();

test('Listando usuários', async () => {
  const users = await userRepository.list();

  expect(users).not.toBeNull();
  expect(users.length).toBeGreaterThan(0);
});

test('Salvar usuário com sucesso', async () => {
  const user = await userRepository.save({
    name: "João Silva",
    email: "joao.silva@example.com",
    password: "senha123",
    confirm_password: "senha123",
  });

  expect(user.id).not.toBeNull();
  expect(user.name).toBe("João Silva");
  expect(user.email).toBe("joao.silva@example.com");
});

test('Encontrando usuário pelo ID', async () => {
  const userData = {
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    password: "senha456",
    confirm_password: "senha456",
  };

  const newUser = await userRepository.save(userData);

  const user = await userRepository.find(newUser.id);

  expect(user).not.toBeNull();
  expect(user.id).toBe(newUser.id);
  expect(user.name).toBe(userData.name);
  expect(user.email).toBe(userData.email);
});

test('Atualizando um usuário já existente', async () => {
  const userData = {
    name: "Pedro Santos",
    email: "pedro.santos@example.com",
    password: "senha789",
    confirm_password: "senha789",
  };

  const newUser = await userRepository.save(userData);

  const updatedData = {
    name: "Pedro Santos Atualizado",
    email: "pedro.atualizado@example.com",
    password: "novaSenha123",
    confirm_password: "novaSenha123",
  };

  const updatedUser = await userRepository.update(newUser.id, updatedData);

  expect(updatedUser.id).toBe(newUser.id);
  expect(updatedUser.name).toBe(updatedData.name);
  expect(updatedUser.email).toBe(updatedData.email);
});

test('Removendo usuário do banco de dados', async () => {
  const newUser = await userRepository.save({
    name: "Carlos Almeida",
    email: "carlos.almeida@example.com",
    password: "senha321",
    confirm_password: "senha321",
  });

  await userRepository.remove(newUser.id);

  const user = await userRepository.find(newUser.id);

  expect(user).toBeNull();
});