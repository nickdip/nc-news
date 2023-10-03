const db = require("../db/connection");

exports.fetchUsers = (userName) => {
    return db.query(`SELECT * FROM users;`)
    .then( ( { rows } ) => rows ) 
}