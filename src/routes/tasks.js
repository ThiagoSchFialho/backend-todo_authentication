var express = require('express');
var router = express.Router();
const { TaskModel } = require('../models/task.model.js');

const taskModel = new TaskModel();


// Cria uma nova tarefa
router.post('/', async function(req, res, next) {
  const { title, date, time, description, category } = req.body;
  const { user_id } = req.query;

  try {
    if (!user_id) return res.status(400).json({ error: 'Usuário indefinido' });
    if (!title || !date ) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    
    const task = await taskModel.createTask(title, date, time, description, category, user_id);
    res.status(201).json(task);

  } catch (error) {
    console.error('Falha ao criar tarefa', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Recupera todas as tarefas do usuário
router.get('/', async function(req, res, next) {
  const { user_id } = req.query;

  try {
    if (!user_id) return res.status(400).json({ error: 'Usuário indefinido' });

    const tasks = await taskModel.getTasks(user_id);
    res.status(200).json(tasks);

  } catch (error) {
    console.error('Falha ao recuperar tarefas', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualiza uma tarefa
router.put('/:id', async function(req, res, next) {
  const { id } = req.params;
  const { title, date, time, description, category, done} = req.body;
  const { user_id } = req.query;

  console.log(id, title, date, time, description, category, done, user_id);

  try {
    if (!user_id) return res.status(400).json({ error: 'Usuário indefinido' });

    const task = await taskModel.updateTask(id, title, date, time, description, category, done, user_id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    res.status(200).json(task);

  } catch (error) {
    console.error('Falha ao atualizar tarefa', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualiza o status de feita de uma tarefa
router.put('/done/:id', async function(req, res, next) {
  const { id } = req.params;
  const { user_id } = req.query;

  try {
    if (!user_id) return res.status(400).json({ error: 'Usuário indefinido' });

    const task = await taskModel.updateStatusTask(id, user_id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    res.status(200).json(task);

  } catch (error) {
    console.error('Falha ao atualizar tarefa', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Exclui uma tarefa
router.delete('/:id', async function(req, res, next) {
  const { id } = req.params;
  const { user_id } = req.query;

  try{
    if (!user_id) return res.status(400).json({ error: 'Usuário indefinido' });
    if (!id) return res.status(400).json({ error: 'ID da tarefa não informado' });

    const task = await taskModel.deleteTask(id, user_id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    res.status(200).json(task);

  } catch (error) {
    console.error('Falha ao exluir tarefa', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
