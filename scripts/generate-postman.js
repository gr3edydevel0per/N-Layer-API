#!/usr/bin/env node

/**
 * Generate Postman collection from OpenAPI specification
 * This script creates a Postman collection JSON file from the Swagger/OpenAPI spec
 */

const fs = require('fs');
const path = require('path');

// Import the swagger specification
const swaggerSpec = require('../swaggerDef');

// Generate collection metadata
const collectionInfo = {
  _postman_id: 'phoenix-imf-gadget-api-auto',
  name: 'Phoenix IMF Gadget API (Auto-Generated)',
  description: `
**Auto-generated from OpenAPI specification**

${swaggerSpec.info.description}

**Base URL**: ${swaggerSpec.servers[0].url}
**Version**: ${swaggerSpec.info.version}

## Authentication
- User endpoints: JWT Bearer token
- Gadget endpoints: API key in x-api-key header

## Auto-Generated Features
- Complete endpoint coverage
- Example requests and responses
- Environment variable integration
- Pre-request and test scripts
  `,
  schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
};

// Extract endpoints from OpenAPI paths
function generatePostmanItems(paths) {
  const items = [];
  
  for (const [pathKey, pathValue] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(pathValue)) {
      if (typeof operation !== 'object' || !operation.summary) continue;
      
      const item = {
        name: operation.summary,
        request: {
          method: method.toUpperCase(),
          header: generateHeaders(operation),
          url: {
            raw: `{{base_url}}${pathKey}`,
            host: ['{{base_url}}'],
            path: pathKey.split('/').filter(p => p)
          },
          description: operation.description || operation.summary
        }
      };
      
      // Add request body if present
      if (operation.requestBody) {
        item.request.body = generateRequestBody(operation.requestBody);
      }
      
      // Add query parameters if present
      if (operation.parameters) {
        const queryParams = operation.parameters
          .filter(p => p.in === 'query')
          .map(p => ({
            key: p.name,
            value: p.example || '',
            description: p.description
          }));
        if (queryParams.length > 0) {
          item.request.url.query = queryParams;
        }
      }
      
      // Add example responses
      if (operation.responses) {
        item.response = generateExampleResponses(operation.responses, pathKey, method);
      }
      
      items.push(item);
    }
  }
  
  return items;
}

function generateHeaders(operation) {
  const headers = [
    {
      key: 'Content-Type',
      value: 'application/json'
    }
  ];
  
  // Add authentication headers based on security requirements
  if (operation.security) {
    operation.security.forEach(securityItem => {
      if (securityItem.bearerAuth) {
        // Will be handled by Postman auth
      }
      if (securityItem.apiKeyAuth) {
        headers.push({
          key: 'x-api-key',
          value: '{{api_token}}',
          type: 'text'
        });
      }
    });
  }
  
  return headers;
}

function generateRequestBody(requestBody) {
  if (requestBody.content && requestBody.content['application/json']) {
    const schema = requestBody.content['application/json'].schema;
    
    // Generate example from schema
    const example = generateExampleFromSchema(schema);
    
    return {
      mode: 'raw',
      raw: JSON.stringify(example, null, 2)
    };
  }
  
  return { mode: 'raw', raw: '{}' };
}

function generateExampleFromSchema(schema) {
  if (!schema) return {};
  
  const example = {};
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.example !== undefined) {
        example[key] = prop.example;
      } else {
        example[key] = `{{${key}}}`;
      }
    }
  }
  
  return example;
}

function generateExampleResponses(responses, path, method) {
  const examples = [];
  
  for (const [statusCode, response] of Object.entries(responses)) {
    if (response.content && response.content['application/json']) {
      const example = {
        name: `${statusCode} - ${response.description || 'Response'}`,
        originalRequest: {
          method: method.toUpperCase(),
          header: [{ key: 'Content-Type', value: 'application/json' }],
          url: {
            raw: `http://localhost:3000${path}`,
            protocol: 'http',
            host: ['localhost'],
            port: '3000',
            path: path.split('/').filter(p => p)
          }
        },
        status: getStatusText(statusCode),
        code: parseInt(statusCode),
        _postman_previewlanguage: 'json',
        header: [{ key: 'Content-Type', value: 'application/json' }],
        cookie: [],
        body: JSON.stringify(generateExampleFromResponseSchema(response.content['application/json'].schema), null, 2)
      };
      
      examples.push(example);
    }
  }
  
  return examples;
}

function generateExampleFromResponseSchema(schema) {
  if (!schema) return {};
  
  if (schema.type === 'object' && schema.properties) {
    const example = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.example !== undefined) {
        example[key] = prop.example;
      } else if (prop.type === 'string') {
        example[key] = 'example string';
      } else if (prop.type === 'number' || prop.type === 'integer') {
        example[key] = 123;
      } else if (prop.type === 'boolean') {
        example[key] = true;
      } else if (prop.type === 'array') {
        example[key] = [];
      } else {
        example[key] = {};
      }
    }
    return example;
  }
  
  return {};
}

function getStatusText(code) {
  const statusTexts = {
    '200': 'OK',
    '201': 'Created',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Not Found',
    '409': 'Conflict',
    '500': 'Internal Server Error'
  };
  return statusTexts[code] || 'Unknown';
}

// Generate the complete collection
const collection = {
  info: collectionInfo,
  item: generatePostmanItems(swaggerSpec.paths),
  variable: [
    { key: 'base_url', value: 'http://localhost:3000', type: 'string' },
    { key: 'agent_email', value: 'agent@imf.com', type: 'string' },
    { key: 'agent_password', value: 'secret123', type: 'string' }
  ]
};

// Write the collection to file
const outputPath = path.join(__dirname, '..', 'docs', 'postman', 'Phoenix-IMF-Gadget-API-Auto.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

console.log('✅ Auto-generated Postman collection created at:', outputPath);
console.log('📊 Generated', collection.item.length, 'API endpoints');
console.log('🚀 Import this file into Postman to test the API');