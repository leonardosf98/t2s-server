require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'cadastro',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/send', (req, res) => {
  const { email, name, message } = req.body;
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  const query = `INSERT INTO cadastro.registros (email, nome, mensagem) VALUES (?, ?, ?)`;
  connection.query(query, [email, name, message], (err) => {
    if (err) {
      res
        .status(500)
        .json({ error: 'Erro ao inserir dados no banco de dados' });
      return;
    }
    res
      .status(200)
      .json({ message: 'Dados inseridos com sucesso no banco de dados' });
  });
});

app.listen(port, () => {
  console.log(`Servidor está sendo executado na porta ${port}`);
});
