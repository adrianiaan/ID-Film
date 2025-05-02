const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Setup MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // ganti dengan username MySQL Anda
  password: '', // ganti dengan password MySQL Anda
  database: 'movie_db',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('error connecting to database: ', err);
  } else {
    console.log('connected to database');
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API untuk mendapatkan semua film favorit
app.get('/api/favorites', (req, res) => {
  db.query('SELECT * FROM favorites', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// API untuk menambahkan film ke favorit
app.post('/api/favorites', (req, res) => {
  const { movie_id, title, release_date, poster_path, overview } = req.body;

  db.query(
    'INSERT INTO favorites (movie_id, title, release_date, poster_path, overview) VALUES (?, ?, ?, ?, ?)',
    [movie_id, title, release_date, poster_path, overview],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add movie to favorites' });
      }
      // Mengirim respons dalam format JSON dengan pesan
      res.status(201).json({ message: `${title} has been added to favorites!` });
    }
  );
});

// API untuk menghapus film dari favorit
app.delete('/api/favorites/:id', (req, res) => {
  const movieId = req.params.id; // Mengambil `movie_id` dari URL parameter
  console.log(`Deleting movie with ID: ${movieId}`); // Log untuk debug

  db.query('DELETE FROM favorites WHERE movie_id = ?', [movieId], (err, result) => {
    if (err) {
      console.error('Error deleting movie:', err);
      return res.status(500).json({ error: 'Failed to delete movie' });
    }

    // Jika tidak ada film yang dihapus (movie_id tidak ditemukan)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
