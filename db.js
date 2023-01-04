const Pool = require('pg').Pool

const pool = new Pool({
    user: "harish",
    host: "localhost",
    database: "mallmanagement",
    password: "",
    port: 5432
})

module.exports = pool
