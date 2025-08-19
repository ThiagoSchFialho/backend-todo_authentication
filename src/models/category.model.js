const pool = require('../db/db.config.js');

class CategoryModel {
    async createCategory(title, user_id) {
        try {
            const result = await pool.query(`
                INSERT INTO category (title, user_id)
                VALUES ($1, $2)
                RETURNING *;
            `, [title, user_id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            throw error;
        }
    }

    async getCategories(user_id) {
        try {
            const result = await pool.query(`
                SELECT * FROM category
                WHERE user_id = $1
            `, [user_id]);

            return result.rows;
        } catch (error) {
            console.error('Erro ao recuperar categorias', error);
            throw error;
        }        
    }

    async updateCategory(id, title, user_id) {
        try {
            const result = await pool.query(`
                UPDATE category
                SET title = $1
                WHERE id = $2 AND user_id = $3
                RETURNING *;
            `, [title, id, user_id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao atualizar categoria', error);
            throw error;
        }
    }

    async deleteCategory(id, user_id) {
        try {
            const result = await pool.query(`
                DELETE FROM category
                WHERE id = $1 AND user_id = $2
                RETURNING *;
            `, [id, user_id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao deletar categoria', error);
            throw error;
        }
    }
}

module.exports = { CategoryModel };
