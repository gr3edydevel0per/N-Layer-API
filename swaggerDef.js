const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Phoenix IMF Gadget API',
      version: '1.0.0',
      description: 'API for managing IMF spy gadgets with user authentication and token-based access control.',
      contact: {
        name: 'Phoenix IMF Team',
        email: 'support@phoenix-imf.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.phoenix-imf.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for user authentication'
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key for accessing gadget endpoints'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
              example: 1
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'agent@imf.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              maxLength: 100,
              description: 'User password',
              example: 'secret123'
            },
            api_token: {
              type: 'string',
              description: 'API token for gadget access',
              example: 'api_token_xyz123'
            }
          }
        },
        Gadget: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'Gadget ID',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Gadget name',
              example: 'Invisibility Cloak MK-7'
            },
            status: {
              type: 'string',
              enum: ['Available', 'Deployed', 'Destroyed', 'Decommissioned'],
              description: 'Current status of the gadget',
              example: 'Available'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: []
  },
  apis: ['./routes/*.js', './controllers/*.js'], // paths to files containing OpenAPI definitions
};

module.exports = swaggerJsdoc(options);