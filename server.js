const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
// Configuração do banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'XrE5hcy!%dUjEL',
  database: 'cadastro',
});

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Middleware para processar dados do corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rota para receber os dados do frontend
app.post('/enviar-dados', (req, res) => {
  const { email, name, message } = req.body;
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  // Inserir os dados no banco de dados
  const query = `INSERT INTO cadastro.registros (email, nome, mensagem) VALUES (?, ?, ?)`;
  connection.query(query, [email, name, message], (err) => {
    if (err) {
      console.error('Erro ao inserir dados no banco de dados:', err);
      res
        .status(500)
        .json({ error: 'Erro ao inserir dados no banco de dados' });
      return;
    }
    console.log('Dados inseridos com sucesso no banco de dados');
    res
      .status(200)
      .json({ message: 'Dados inseridos com sucesso no banco de dados' });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
