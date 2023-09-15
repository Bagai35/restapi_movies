const express = require('express');
const app = express();
const pool = require("./config"); // Импортируйте pool из вашего конфигурационного файла

const port = 8000;

app.get('/categories', (req, res) => {
    db.query('SELECT * FROM category', (error, result) => {
        if(error) throw error
        return res.send({ result })
    })
})


// Создаем подключение к базе данных


app.use(express.json());

// Запрос для получения названий фильмов 
// exxample - http://localhost:8000/films
app.get('/films', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT title FROM film');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Запрос для получения названий фильмов определенного жанра
// example http://localhost:8000/films-by-category/Action
app.get('/films-by-category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const [rows, fields] = await pool.execute('SELECT film.title FROM film INNER JOIN film_category ON film.film_id = film_category.film_id INNER JOIN category ON film_category.category_id = category.category_id WHERE category.name = ?', [category]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Запрос для получения фильмов, в которых играет актер по указанному id
// example http://localhost:8000/films-by-actor-id/1
app.get('/films-by-actor-id/:actorId', async (req, res) => {
    try {
        const actorId = req.params.actorId;
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT film.title FROM film INNER JOIN film_actor ON film.film_id = film_actor.film_id WHERE film_actor.actor_id = ?', [actorId]);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Запрос для получения фильмов, в которых играет актер по указанной фамилии
// example http://localhost:8000/films-by-actor-lastname/CHASE
app.get('/films-by-actor-lastname/:lastName', async (req, res) => {
    try {
        const lastName = req.params.lastName;
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT film.title FROM film INNER JOIN film_actor ON film.film_id = film_actor.film_id INNER JOIN actor ON film_actor.actor_id = actor.actor_id WHERE actor.last_name = ?', [lastName]);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Запрос для получения фильмов, в которых играют актеры, у которых фамилия начинается с определенной буквы
// example http://localhost:8000/films-by-actor-lastname-starting-with/G
app.get('/films-by-actor-lastname-starting-with/:letter', async (req, res) => {
    try {
        const letter = req.params.letter;
        const connection = await pool.getConnection();
        const [rows, fields] = await connection.execute('SELECT film.title FROM film INNER JOIN film_actor ON film.film_id = film_actor.film_id INNER JOIN actor ON film_actor.actor_id = actor.actor_id WHERE actor.last_name LIKE ?', [letter + '%']);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Запрос для получения количества фильмов, сгруппированных по жанру
// example http://localhost:8000/films-count-by-category
app.get('/films-count-by-category', async (req, res) => {
    try {
        const [rows, fields] = await pool.execute('SELECT category.name, COUNT(film.film_id) AS film_count FROM category INNER JOIN film_category ON category.category_id = film_category.category_id INNER JOIN film ON film_category.film_id = film.film_id GROUP BY category.name');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/actors/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { first_name, last_name } = req.body; 
        const connection = await pool.getConnection();
        await connection.execute('UPDATE actor SET first_name = ?, last_name = ? WHERE actor_id = ?', [first_name, last_name, id]);
        connection.release();
        res.status(200).send(`Actor with ID ${id} updated successfully.`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

