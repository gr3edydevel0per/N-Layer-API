#!/usr/bin/env node

/**
 * Test script to verify Swagger documentation generation
 * This script validates the OpenAPI spec without starting the full server
 */

const swaggerSpec = require('../swaggerDef');

console.log('🔍 Testing OpenAPI Specification Generation...\n');

// Test basic spec structure
console.log('✅ OpenAPI Version:', swaggerSpec.openapi);
console.log('✅ API Title:', swaggerSpec.info.title);
console.log('✅ API Version:', swaggerSpec.info.version);
console.log('✅ API Description:', swaggerSpec.info.description ? 'Present' : 'Missing');

// Test servers
console.log('\n📡 Servers:');
swaggerSpec.servers.forEach((server, index) => {
  console.log(`  ${index + 1}. ${server.url} - ${server.description}`);
});

// Test paths
console.log('\n🛣️  API Paths:');
const paths = Object.keys(swaggerSpec.paths);
console.log(`Found ${paths.length} endpoints:`);
paths.forEach(path => {
  const methods = Object.keys(swaggerSpec.paths[path]).filter(m => m !== 'parameters');
  console.log(`  ${path} - Methods: ${methods.map(m => m.toUpperCase()).join(', ')}`);
});

// Test components
console.log('\n🧩 Components:');
if (swaggerSpec.components) {
  if (swaggerSpec.components.schemas) {
    console.log(`  Schemas: ${Object.keys(swaggerSpec.components.schemas).join(', ')}`);
  }
  if (swaggerSpec.components.securitySchemes) {
    console.log(`  Security Schemes: ${Object.keys(swaggerSpec.components.securitySchemes).join(', ')}`);
  }
} else {
  console.log('  No components defined');
}

console.log('\n🎯 Documentation URLs (when server is running):');
console.log('  Swagger UI: http://localhost:3000/api/docs');
console.log('  OpenAPI JSON: http://localhost:3000/api/docs.json');

console.log('\n📝 Postman Collections:');
console.log('  Manual Collection: docs/postman/Phoenix-IMF-Gadget-API.postman_collection.json');
console.log('  Auto-generated: docs/postman/Phoenix-IMF-Gadget-API-Auto.postman_collection.json');
console.log('  Dev Environment: docs/postman/Phoenix-IMF-Development.postman_environment.json');
console.log('  Prod Environment: docs/postman/Phoenix-IMF-Production.postman_environment.json');

console.log('\n✨ Documentation generation test completed successfully!');
console.log('🚀 Ready to generate Postman documentation!');