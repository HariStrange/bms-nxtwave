const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("Error COnnecting to postgres databse", err.message);
    process.exit(1);
  } else {
    console.log("postgres databse connected successfully at:", res.rows[0].now);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
