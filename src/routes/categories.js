var express = require('express');
var router = express.Router();
const { CategoryModel } = require('../models/category.model.js');

const categoryModel = new CategoryModel();


// Cria uma nova categoria
router.post('/', async function(req, res, next) {
  const { title } = req.body;
  const { user_id } = req.query;

  try {
    if (!user_id) return res.status(400).json({ error: 'Usuário indefinido' });
    if (!title) return res.status(400).json({ error: 'Campo obrigatório ausente' });
    
    const category = await categoryModel.createCategory(title, user_id);
    res.status(201).json(category);

  } catch (error) {
    console.error('Falha ao criar categoria', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Recupera todas as categorias do usuário
router.get('/', async function(req, res, next) {
  const { user_id } = req.query;

  try {
    if (!user_id) return res.status(400).json({ error: 'Usuário indefinido' });

    const categories = await categoryModel.getCategories(user_id);
    res.status(200).json(categories);

  } catch (error) {
    console.error('Falha ao recuperar categorias', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualiza uma categoria
router.put('/:id', async function(req, res, next) {
  const { id } = req.params;
  const { title } = req.body;
  const { user_id } = req.query;

  try {
    if (!user_id) return res.status(400).json({ error: 'Usuário indefinido' });
    if (!title) return res.status(400).json({ error: 'Campo obrigatório ausente' });

    const category = await categoryModel.updateCategory(id, title, user_id);
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada' });

    res.status(200).json(category);

  } catch (error) {
    console.error('Falha ao atualizar categoria', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Exclui uma categoria
router.delete('/:id', async function(req, res, next) {
  const { id } = req.params;
  const { user_id } = req.query;

  try{
    if (!user_id) return res.status(400).json({ error: 'Usuário indefinido' });
    if (!id) return res.status(400).json({ error: 'ID da categoria não informado' });

    const category = await categoryModel.deleteCategory(id, user_id);
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada' });

    res.status(200).json(category);

  } catch (error) {
    console.error('Falha ao exluir categoria', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
