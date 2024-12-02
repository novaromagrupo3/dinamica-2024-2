const User = require("../../app/models/User");
const bcrypt = require("bcrypt");

function useUserRepository() {
  async function list() {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      raw: true,
    });
    return users;
  }

  async function find(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    return user;
  }

  async function save(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    };

    const userCreated = await User.create(newUser);
    return userCreated;
  }

  async function update(id, data) {
    const updatedFields = {};

    if (data.name) updatedFields.name = data.name;
    if (data.email) updatedFields.email = data.email;
    if (data.password) {
      if (data.password !== data.confirm_password) {
        throw new Error("Os campos senha e confirmar senha são diferentes");
      }
      updatedFields.password = await bcrypt.hash(data.password, 10);
    }

    await User.update(updatedFields, { where: { id } });
    return { id, ...updatedFields };
  }

  async function remove(id) {
    await User.destroy({ where: { id } });
  }

  return {
    list,
    find,
    save,
    update,
    remove,
  };
}

module.exports = useUserRepository;