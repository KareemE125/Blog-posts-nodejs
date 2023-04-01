//To be more precise, asyncHandler is a higher-order function that takes a middleware function as its argument, and returns a new middleware function that wraps the original middleware function. 
//When this new middleware function is used in an Express application, it becomes part of the middleware chain, and can be called by next to pass control to the next middleware function in the chain.
// so  asyncHandler itself is not a middleware function, but it is a new middleware function that is part of the middleware chain, and can catch errors propagated by the wrapped middleware function "func" by using next.

export const asyncHandler = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next)
        } catch (error) {

            return next(new Error(error, { cause: error.cause || 500 }))
        }
    }
}

export const GlobalErrorHandling = (error, req, res, next) => {
    res.status(error.cause || 500).json({ message: error.message || "Server Error", error, stack: error.stack })
}