const pool = require('../db/db.config.js');

class TaskModel {
    async createTask(title, date, time, description, category_id, user_id) {
        try {
            const result = await pool.query(`
                INSERT INTO task (title, date, time, description, category_id, user_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `, [title, date, time, description, category_id, user_id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            throw error;
        }
    }

    async getTasks(user_id) {
        try {
            const result = await pool.query(`
                SELECT * FROM task
                WHERE user_id = $1
                ORDER BY date, time;
            `, [user_id]);

            return result.rows;
        } catch (error) {
            console.error('Erro ao recuperar tarefas', error);
            throw error;
        }        
    }

    async updateTask(id, title, date, time, description, category_id, done, user_id) {
        try {
            const result = await pool.query(`
                UPDATE task
                SET title = $1,
                    date = $2,
                    time = $3,
                    description = $4,
                    category_id = $5,
                    done = $6
                WHERE id = $7 AND user_id = $8
                RETURNING *;
            `, [title, date, time, description, category_id, done, id, user_id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao atualizar tarefa', error);
            throw error;
        }
    }

    async updateStatusTask(id, user_id) {
        try {
            const result = await pool.query(`
                UPDATE task
                SET done = NOT done
                WHERE id = $1 AND user_id = $2
                RETURNING *;
            `, [id, user_id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao atualizar tarefa', error);
            throw error;
        }
    }

    async deleteTask(id, user_id) {
        try {
            const result = await pool.query(`
                DELETE FROM task
                WHERE id = $1 AND user_id = $2
                RETURNING *;
            `, [id, user_id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao deletar tarefa', error);
            throw error;
        }
    }
}

module.exports = { TaskModel };
