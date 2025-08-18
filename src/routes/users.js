var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.model');

const userModel = new UserModel();

// Recupera um usuário pelo id
router.get('/:id', async function(req, res, next) {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).json({ error: 'Usuário indefinido' });

    const user = await userModel.getUserById(id)
    
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    return res.status(200).json({ id: user.id, email: user.email });

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

    return res.status(200).json({ id: updatedUser.id, email: updatedUser.email });

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

    return res.status(200).json({ id: updatedUser.id, email: updatedUser.email });

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
    
    return res.status(204);

  } catch (error) {
    console.error('falha ao excluir usuário', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
router.post('/login', async function(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais Incorretas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais Incorretas' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '5h'
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Falha no login' });
  }
});

// Sign UP
router.post('/signup', async function(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const user = await userModel.getUserByEmail(email);
    if (user) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser(email, hashedPassword);

    return res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Falha no cadastro' });
  }

});

module.exports = router;
