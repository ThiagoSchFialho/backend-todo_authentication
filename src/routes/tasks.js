var express = require('express');
var router = express.Router();
const { TaskModel } = require('../models/task.model.js');

const taskModel = new TaskModel();

router.post('/', async function(req, res, next) {
  const task = await taskModel.createTask("Limpar a casa", "2025-08-15", "07:00", "Aspirar e arrumar a casa", "Casa", 1);
  res.json(task);
});

router.get('/', async function(req, res, next) {
  const tasks = await taskModel.getTasks(1);
  res.json(tasks);
});

router.put('/', async function(req, res, next) {
  const task = await taskModel.updateTask(3, "Lavar a louça", "2025-08-15", "08:00", "", "Casa", 1);
  res.json(task);
});

router.delete('/', async function(req, res, next) {
  const task = taskModel.deleteTask(1, 1);
  res.json(task);
})

module.exports = router;
