const db = require('../db/connection');

exports.deleteComment = (commentId) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [commentId])
    .then( ( { rows } ) => {
        if (!rows.length) return Promise.reject({ status: 404, msg: "Comment not found"})
        return { deletedComment: rows[0] }
    })

}
