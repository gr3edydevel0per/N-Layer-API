# Phoenix IMF Gadget API Documentation

Complete API documentation and Postman collection for the Phoenix IMF Gadget Management System.

## 📚 Documentation Overview

This repository provides multiple ways to explore and test the Phoenix IMF Gadget API:

1. **Interactive Swagger UI** - Web-based API explorer
2. **Postman Collection** - Complete test suite for Postman
3. **OpenAPI Specification** - Machine-readable API spec

## 🚀 Quick Start

### Access Documentation

- **Swagger UI**: Visit `/api/docs` when the server is running
- **OpenAPI JSON**: Available at `/api/docs.json`
- **Postman Collection**: Import files from `/docs/postman/`

### Start the Server

```bash
npm install
npm start
```

The API will be available at `http://localhost:3000`

## 📖 API Overview

The Phoenix IMF Gadget API provides endpoints for:

- **User Management**: Registration, authentication, and API token generation
- **Gadget Operations**: CRUD operations for spy gadget inventory

### Authentication Flow

1. **Register** a user account → `POST /api/users/register`
2. **Login** to get JWT token → `POST /api/users/login`  
3. **Generate API token** → `POST /api/users/get-token` (requires JWT)
4. **Access gadgets** using API token in `x-api-key` header

## 🔧 Using Postman

### Import Collection and Environment

1. **Import Collection**:
   - Open Postman
   - Click "Import" 
   - Select `docs/postman/Phoenix-IMF-Gadget-API.postman_collection.json`

2. **Import Environment**:
   - Import `docs/postman/Phoenix-IMF-Development.postman_environment.json`
   - Or `docs/postman/Phoenix-IMF-Production.postman_environment.json` for production

3. **Select Environment**:
   - Choose the imported environment from the dropdown in top-right

### Automated Testing Flow

The Postman collection includes automated scripts that:

- Save authentication tokens automatically
- Set up variables for subsequent requests
- Provide detailed logging and error handling

**Recommended Test Sequence:**

1. **Register User** → Saves user info to environment
2. **Login User** → Saves JWT access token  
3. **Get API Token** → Saves API token for gadget operations
4. **Get All Gadgets** → Lists available gadgets
5. **Register New Gadget** → Creates gadget with auto-generated name
6. **Decommission Gadget** → Soft-deletes a gadget

## 📋 API Endpoints

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | User login | No |
| POST | `/api/users/get-token` | Generate API token | JWT Bearer |

### Gadget Operations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/gadgets` | List all gadgets | API Key |
| GET | `/api/gadgets?status=Available` | Filter by status | API Key |
| POST | `/api/gadgets` | Register new gadget | API Key |
| DELETE | `/api/gadgets` | Decommission gadget | API Key |

### API Information

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API information | No |
| GET | `/api/docs` | Swagger UI documentation | No |
| GET | `/api/docs.json` | OpenAPI specification | No |

## 🔐 Authentication Details

### JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Used for**: User operations (get-token endpoint)
- **Expires**: 1 hour (configurable)

### API Key
- **Header**: `x-api-key: <api_token>`
- **Used for**: All gadget operations
- **Expires**: Never (until manually regenerated)

## 📝 Request/Response Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agent@imf.com",
    "password": "secret123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agent@imf.com", 
    "password": "secret123"
  }'
```

### Get API Token
```bash
curl -X POST http://localhost:3000/api/users/get-token \
  -H "Authorization: Bearer <jwt_token>"
```

### List Gadgets
```bash
curl -X GET http://localhost:3000/api/gadgets \
  -H "x-api-key: <api_token>"
```

### Register Gadget
```bash
curl -X POST http://localhost:3000/api/gadgets \
  -H "x-api-key: <api_token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 🎯 Postman Variables

The collection uses these environment variables:

| Variable | Description | Set By |
|----------|-------------|--------|
| `base_url` | API base URL | Manual |
| `agent_email` | Test user email | Manual |
| `agent_password` | Test user password | Manual |
| `access_token` | JWT token | Login request |
| `api_token` | API key | Get-token request |
| `user_id` | Current user ID | Register/Login |
| `sample_gadget_name` | Sample gadget for tests | Get gadgets |

## 🔄 Generating Updated Documentation

To regenerate the OpenAPI specification:

```bash
npm run docs:generate
```

## 🌍 Environment Configuration

### Development
- Base URL: `http://localhost:3000`
- Database: Local PostgreSQL
- Log Level: `info`

### Production  
- Base URL: `https://api.phoenix-imf.com`
- Database: Production PostgreSQL
- Log Level: `error`

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Missing Token |
| 403 | Forbidden / Invalid Token |
| 404 | Not Found |
| 409 | Conflict / Already Exists |
| 500 | Internal Server Error |

## 🔍 Gadget Status Values

- `Available` - Ready for deployment
- `Deployed` - Currently in use by agents
- `Destroyed` - Lost or damaged beyond repair
- `Decommissioned` - Retired from service

## 🛠 Development Tools

- **Swagger UI**: Interactive API documentation
- **Swagger JSDoc**: Generate OpenAPI from code comments
- **Postman**: API testing and documentation
- **Environment Variables**: Configurable settings

## 📞 Support

For issues or questions:
- Check the Swagger UI at `/api/docs`
- Review Postman collection tests
- Examine OpenAPI spec at `/api/docs.json`

---

**Mission: Impossible**
*"Your mission, should you choose to accept it, is to manage IMF gadgets efficiently."*