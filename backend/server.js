const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise'); // ใช้ promise pool
const bcrypt = require('bcrypt');
require('dotenv').config();

// MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'ku_grade',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

process.on('SIGINT', async () => {
  console.log('Shutting down, closing DB pool...');
  await pool.end();
  process.exit(0);
});


// Helper: อ่าน body
function getRequestBody(req, limitBytes = 1e6) { // ~1MB
  return new Promise((resolve, reject) => {
    let body = '';
    let received = 0;
    req.on('data', chunk => {
      received += chunk.length;
      if (received > limitBytes) {
        req.destroy(); // ปิด connection
        return reject({ type: 'too_large' });
      }
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (err) {
        reject({ type: 'invalid_json', err });
      }
    });
    req.on('error', err => reject({ type: 'stream_error', err }));
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ---------------- Register ----------------
  if (method === 'POST' && path === '/register') {
    try {
      const body = await getRequestBody(req);
      console.log("body will send:", body);

      const {
        student_id, // ไม่ใช้ใน insert ถ้าเป็น AUTO_INCREMENT
        username,
        password,
        Fname,
        Lname,
        faculty,
        dept,
        email,
        phone
      } = body;

      if (!student_id || !username || !password || !Fname || !Lname || !faculty || !dept || !email || !phone) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing fields' }));
      }

      const [rows] = await pool.query('SELECT student_id FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Email already exists' }));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
        `INSERT INTO users
       (student_id, username, password, Fname, Lname, faculty, dept, email, phone, create_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [student_id, username, hashedPassword, Fname, Lname, faculty, dept, email, phone]
      );

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User registered successfully', userId: student_id }));
    } catch (err) {
      console.error("Register error:", err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Database insert failed', details: err.message }));
    }
    return;
  }


  // ---------------- Login ----------------
  if (method === 'POST' && path === '/login') {
    try {
      const body = await getRequestBody(req);
      const { email, password } = body;

      if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing fields' }));
      }

      const [rows] = await pool.query('SELECT * FROM old_users WHERE email = ?', [email]);
      if (rows.length === 0) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid email or password' }));
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid email or password' }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email }
      }));
    } catch (err) {
      console.error("Login error:", err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Login failed', details: err.message }));
    }
    return;
  }

  // ---------------- Get All Users ----------------
  if (method === 'GET' && path === '/old_users') {
    try {
      const [results] = await pool.query('SELECT id, name, email, created_at FROM old_users');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
    } catch (err) {
      console.error("DB ERROR:", err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Database query failed', details: err.message }));
    }
    return;
  }

  // ---------------- 404 ----------------
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});