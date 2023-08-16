const express = require('express');
const mysql = require('mysql2/promise'); // Import the promise version of mysql2
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
    host: 'localhost', // Change to your MySQL host
    user: 'root',      // Change to your MySQL username
    password: 'M@ni81060', // Change to your MySQL password
    database: 'mydb', // Change to your MySQL database name
    connectionLimit: 10 // Adjust this as needed
});

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
        connection.release();
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        connection.release();
        const newUser = { id: result.insertId, name, email };
        res.json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
        connection.release();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        connection.release();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
