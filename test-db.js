require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  console.log('Connecting to Neon PostgreSQL...');
  try {
    const client = await pool.connect();
    console.log(' Successfully connected to Neon database!');

    const res = await client.query('SELECT version(), current_database(), current_user;');
    console.log('DB Info:', res.rows[0]);

    // Check existing tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Existing tables in public schema:', tables.rows.map(r => r.table_name));

    client.release();
    await pool.end();
  } catch (err) {
    console.error(' Database connection error:', err);
    process.exit(1);
  }
}

testConnection();
