
const logger = require('../utils/logger');
const AuthUtils = require('../utils/authUtils');

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token
    const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      const error = AuthUtils.createAuthErrorResponse('Access token required');
      return res.status(error.statusCode).json(error.response);
    }

    // Validate user by token (using auth service)
    const { user, decoded } = await AuthUtils.verifyToken(token)

    // Attach to request
    req.user = user;
    req.tokenPayload = decoded;
    
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    const statusCode = error.message.includes('not found') || 
                      error.message.includes('Invalid') || 
                      error.message.includes('expired') ? 401 : 500;
    
    const errorResponse = AuthUtils.createAuthErrorResponse(
      statusCode === 500 ? 'Internal server error' : error.message,
      statusCode
    );
    
    return res.status(errorResponse.statusCode).json(errorResponse.response);
  }
};

module.exports = authMiddleware;