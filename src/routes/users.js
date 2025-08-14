var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/user.model');

const userModel = new UserModel();

// Cria um novo usuário
router.post('/', async function(req, res, next) {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ error: 'Dados obrigatórios não informados' });

    const userCheck = await userModel.getUserByEmail(email);
    if (userCheck) return res.status(409).json({ error: 'email indisponivel' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(email, hashedPassword);

    return res.status(201).json(user);

  } catch (error) {
    console.error('Falha ao criar usuário', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Recupera um usuário pelo id
router.get('/:id', async function(req, res, next) {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).json({ error: 'Usuário indefinido' });

    const user = await userModel.getUserById(id)
    
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    return res.status(200).json(user);

  } catch (error) {
    console.error('falha ao recuperar usuário', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Recupera um usuário pelo email
router.get('/', async function(req, res, next) {
  const { email } = req.query;

  try {
    if (!email) return res.status(400).json({ error: 'Usuário indefinido' });

    const user = await userModel.getUserByEmail(email);
    
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    return res.status(200).json(user);

  } catch (error) {
    console.error('falha ao recuperar usuário', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualiza o email do usuário
router.put('/email/:id', async function(req, res, next) {
  const { id } = req.params;
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ error: 'Email indefinido' });
    if (!id) return res.status(400).json({ error: 'Usuário indefinido' });

    const user = await userModel.getUserById(id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const updatedUser = await userModel.updateEmail(id, email);

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error('falha ao atualizar usuário', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualiza a senha do usuário
router.put('/password/:id', async function(req, res, next) {
  const { id } = req.params;
  const { password } = req.body;

  try {
    if (!password) return res.status(400).json({ error: 'Senha indefinida' });
    if (!id) return res.status(400).json({ error: 'Usuário indefinido' });

    const user = await userModel.getUserById(id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userModel.updatePassword(id, hashedPassword);

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error('falha ao atualizar usuário', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Exclui um usuário
router.delete('/:id', async function(req, res, next) {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).json({ error: 'Usuário indefinido' });

    const userCheck = await userModel.getUserById(id);
    if (!userCheck) return res.status(404).json({ error: 'Usuário não encontrado' });

    const user = await userModel.deleteUser(id);
    
    return res.status(204).json(user);

  } catch (error) {
    console.error('falha ao excluir usuário', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

module.exports = router;
