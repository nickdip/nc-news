const db = require('../db/connection');

exports.deleteComment = (commentId) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [commentId])
    .then( ( { rows } ) => {
        if (!rows.length) return Promise.reject({ status: 404, msg: "Comment not found"})
        return { deletedComment: rows[0] }
    })

}

exports.updateVotesByCommentId = (commentId, votes) => {


    if (isNaN(votes)) return Promise.reject({ status: 400, msg: "Invalid vote"})

    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [votes, commentId]).then( ( { rows } ) => {
        if (!rows.length) return Promise.reject({ status: 404, msg: "Comment not found"})
        return rows[0]
    })

}