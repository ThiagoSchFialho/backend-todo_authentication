const pool = require('../db/db.config.js');

class UserModel {
    async createUser(email, password) {
        try {
            const result = await pool.query(`
                INSERT INTO "user" (email, password)
                VALUES ($1, $2)
                RETURNING *;
            `, [email, password]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao criar usuário', error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const result = await pool.query(`
                SELECT * FROM "user"
                WHERE id = $1;
            `, [id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao recuperar usuário', error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const result = await pool.query(`
                SELECT * FROM "user"
                WHERE email = $1;    
            `, [email]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao recuperar usuário por email', error);
            throw error;
        }
    }

    async updateEmail(id, email) {
        try {
            const result = await pool.query(`
                UPDATE "user"
                SET email = $1
                WHERE id = $2
                RETURNING *;
            `, [email, id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao atualizar email', error);
            throw error;
        }
    }

    async updatePassword(id, password) {
        try {
            const result = await pool.query(`
                UPDATE "user"
                SET password = $1
                WHERE id = $2
                RETURNING *;    
            `, [password, id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao atualizar senha', error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const result = await pool.query(`
                DELETE FROM "user"
                WHERE id = $1
                RETURNING *;  
            `, [id]);

            return result.rows[0];
        } catch (error) {
            console.error('Erro ao excluir usuário', error);
            throw error;
        }
    }
}

module.exports = { UserModel };