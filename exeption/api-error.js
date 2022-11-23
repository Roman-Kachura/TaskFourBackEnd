class ApiError {
    responseError(status, message, response) {
        response.status(status);
        return response.json({status, message});
    }

    errorMiddleWares(err, req, res) {
        if (typeof err === typeof Error) return res.status(err.status).json({message: err.message, errors: err.errors});

        return res.status ? res.status(500).json({message: 'So-so, something went wrong!'}) : res.json({
            status: 500,
            message: 'So-so, something went wrong!'
        })
    }
}

module.exports = new ApiError();