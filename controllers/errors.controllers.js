

exports.handleCustomErrors = (err, req, res, next) => {
    console.log("HELLO")
    console.log(err)
    if (err.status = 404) return res.status(404).send({ msg: err.msg })
    next(err)

}

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code = "42P01") return res.status(404).send({ msg: err.msg })
    next(err)
}

exports.handle500Errors = (err, req, res) => {
    res.status(500).send({ msg: err.msg })
}