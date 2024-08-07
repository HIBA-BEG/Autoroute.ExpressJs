const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'autoroute'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(express.static('public'));

app.use(bodyParser.json());

app.post('/trajets', (req, res) => {
  const { pt_entree, pt_sortie, type, date_time } = req.body;
  const query = 'INSERT INTO trajet (pt_entree, pt_sortie, type, date_time) VALUES (?, ?, ?, ?)';
  db.query(query, [pt_entree, pt_sortie, type, date_time], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId });
  });
});

app.get('/trajets', (req, res) => {
  db.query('SELECT * FROM trajet', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get('/trajets/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM trajet WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Trajet not found' });
    }
    res.json(results[0]);
  });
});

app.put('/trajets/:id', (req, res) => {
  const { id } = req.params;
  const { pt_entree, pt_sortie, type, date_time } = req.body;
  const query = 'UPDATE trajet SET pt_entree = ?, pt_sortie = ?, type = ?, date_time = ? WHERE id = ?';
  db.query(query, [pt_entree, pt_sortie, type, date_time, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Trajet not found' });
    }
    res.json({ message: 'Trajet updated successfully' });
  });
});

app.delete('/trajets/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete trajet with ID: ${id}`);
  db.query('DELETE FROM trajet WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Trajet not found' });
    }
    res.json({ message: 'Trajet deleted successfully' });
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
