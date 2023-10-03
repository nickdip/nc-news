

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status === 404) res.status(404).send({ msg: err.msg })
    next(err)
}

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02") res.status(400).send({ msg: "Invalid article_id" })
    next(err)
}

exports.handle500Errors = (err, req, res, next) => {
    if (err) res.status(500).send({ msg: "Unhandled Error" })
    next()
}