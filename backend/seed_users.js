// seed_users.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '@Kan11113050405',
    database: process.env.DB_DATABASE || 'ku_grade',
  });

  const pass = await bcrypt.hash('admin', 10);
  await conn.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE email=email', ['admin@gmail.com', pass, 'admin']);
  console.log('seeded admin');
  await conn.end();
})();
