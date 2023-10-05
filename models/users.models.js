const db = require("../db/connection");

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then( ( { rows } ) => rows ) 
}

exports.fetchUserByUsername = (userName) => {
    return db.query(`SELECT * FROM users WHERE username = $1;`, [userName])
    .then( ( { rows } ) => {
        if (rows.length === 0) return Promise.reject({status: 404, msg: "User not found"})
        return rows 
    })

}