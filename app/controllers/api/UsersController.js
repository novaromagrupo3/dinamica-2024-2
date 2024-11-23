const User = require('../../models/User');
const bcrypt = require('bcrypt');

function UserController() {

  async function list(req, res) {

    try {
      const users = await User.findAll({ 
        attributes: { exclude: ['password'] },
        raw: true 
      })
      res.status(200).json(users);
      
    } catch (error) {
      res.status(500).json({
        message: "Erro ao listar usuários"
      });
    }

  }

  async function show(req, res) {

    try {

      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).send({
          message: "Usuário não encontrado"
        })
      }

      res.status(200).json(user);

    } catch (error) {
      return res.status(500).json({
        message: "Erro ao localizar usuário"
      });
    }
    
  }

  async function save(req, res) {
    
    const body = req.body;

    if (body.password != body.confirm_password) {
      return res.status(500).json({
        message: "Os campos senha e confirmar senha são diferentes"
      });
    }

    const hashed_password = await bcrypt.hash(req.body.password, 10);

    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashed_password,
    }

    try {
      const user_created = await User.create(user);
      return res.status(201).json(user_created);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao criar usuário"
      });      
    }
  }

  async function remove(req, res) {
    const id = req.params.id;

    await User.destroy({ where: { id: id } });
    return res.status(200).json({
      message: "Usuário removida."
    });

  }

   // function update(req, res) {
   //   console.log(req.body);
   //   const id = req.body.i 
   //   const user = {
   //     title: req.body.title,
   //     description: req.body.description,
   //     done: req.body.done === '1' ? true : false,
       
        //user.update(user, { where: { id: id } })
        //.then(res.redirect('/users'))
        //.catch((err) => console.log(err))
    

    async function login(req, res) {
      const { username, password } = req.body;

      try {
        // Encontre o usuário pelo nome de usuário
        const user = await User.findOne({
          where: { email: username },
        });

        // Verifique se o usuário existe
        if (!user) {
          return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Verifique a senha usando bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Se as senhas não coincidirem, retorne uma resposta não autorizada
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Senha incorreta' });
        }

        user.password = undefined;
        // Retorne uma resposta de sucesso com o token (ou outra informação que você deseja enviar de volta)
        res.status(200).json({ message: 'Autenticação bem-sucedida', user });
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erro durante a autenticação' });
      }
      
    }

    return {
      save,
      list,
      show,
      remove,
      login,
      //update
    }

  }

module.exports = UserController();
