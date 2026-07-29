export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource ID" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "This value already exists" });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    message: error.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
}
