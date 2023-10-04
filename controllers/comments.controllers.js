const { deleteComment, updateVotesByCommentId } = require("../models/comments.models")

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    deleteComment(comment_id)
    .then(() => res.sendStatus(204))
    .catch( (err) => next({ msg: "Invalid comment_id",
                            ...err
                            }))


}

exports.patchVotesByCommentId = (req, res, next) => {
    updateVotesByCommentId(req.params.comment_id, req.body.inc_votes).then( (comment) => {
        res.status(200).send({ updatedComment: comment })
    })
    .catch( (err) => next(err))

}