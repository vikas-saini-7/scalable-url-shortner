const { Pool } = require('pg');
const config = require('./env');

const pool = new Pool({
  connectionString: config.database.url,
  // Only use SSL for remote databases (Neon, etc), not local Docker
  ssl: config.database.url.includes('neon.tech') || config.database.url.includes('amazonaws.com') 
    ? { rejectUnauthorized: false } 
    : false,
});

pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

module.exports = pool;
