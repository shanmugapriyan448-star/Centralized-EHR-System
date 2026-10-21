/**
 * 404 Handler for unknown routes
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
};

/**
 * Centralized Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message
  });
};
