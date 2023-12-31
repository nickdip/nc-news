

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status === 404 || err.status === 400) res.status(err.status).send({ msg: err.msg })
    next(err)
}

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23503") res.status(400).send({ msg: "PSQL Error inserting data" })
    next(err)
}

exports.handle500Errors = (err, req, res, next) => {
    if (err) res.status(500).send({ msg: "Unhandled Error" })
    return err
}