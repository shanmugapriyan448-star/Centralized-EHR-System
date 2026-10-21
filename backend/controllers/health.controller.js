/**
 * Health check controller
 * Endpoint: GET /api/health
 */
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: "OK",
    success: true,
    message: "EHR Backend is running"
  });
};
