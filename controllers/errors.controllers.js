

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status = 404) return res.status(404).send({ msg: err.msg })
    next(err)

}

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code = "22P02") return res.status(404).send({ msg: err.msg })
    next(err)
}

exports.handle500Errors = (err, req, res, next) => {
    if (err) res.status(500).send({ msg: err.msg })
    next()
}