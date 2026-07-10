require("dotenv").config()
const { Pool } = require("pg")

/** @type {import('pg').Pool} */
let pool

/** @type {import('pg').PoolConfig} */
const poolConfig = {
  user: process.env.DB_USER || "user",
  host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST : 'localhost',
  database: process.env.DB_NAME || "cd_database",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
}

try {
  pool = new Pool(process.env.URI_DB ? { connectionString: process.env.URI_DB } : poolConfig)
}
catch (e) {
  console.error(e)
  process.exit(1)
}


module.exports = pool
