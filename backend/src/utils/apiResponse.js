class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static created(res, data = null, message = 'Resource created successfully') {
    return ApiResponse.success(res, data, message, 201);
  }

  static error(res, message = 'Internal Server Error', statusCode = 500, details = null) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      details,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ApiResponse;
