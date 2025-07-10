# Phoenix-IMF-Gadget-API



## 📚 Documentation

This API includes complete documentation in multiple formats:

### 🌐 Interactive Documentation
- **Swagger UI**: Visit `/api/docs` when server is running
- **OpenAPI Spec**: Available at `/api/docs.json`

### 📮 Postman Collections
- **Manual Collection**: `docs/postman/Phoenix-IMF-Gadget-API.postman_collection.json`
- **Auto-generated Collection**: `docs/postman/Phoenix-IMF-Gadget-API-Auto.postman_collection.json`
- **Development Environment**: `docs/postman/Phoenix-IMF-Development.postman_environment.json`
- **Production Environment**: `docs/postman/Phoenix-IMF-Production.postman_environment.json`

### 📖 Documentation Guide
See `docs/README.md` for complete documentation usage instructions.

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **View documentation**:
   - Open `http://localhost:3000/api/docs` for Swagger UI
   - Import Postman collections from `docs/postman/` folder

## 🔧 API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login (get JWT token)  
- `POST /api/users/get-token` - Generate API token (requires JWT)

### Gadget Operations
- `GET /api/gadgets` - List gadgets (optional status filter)
- `POST /api/gadgets` - Register new gadget
- `DELETE /api/gadgets` - Decommission gadget

## 🔐 Authentication

1. **Register/Login** → Get JWT access token
2. **Get API Token** → Use JWT to generate API key
3. **Access Gadgets** → Use API key in `x-api-key` header

## 📝 Documentation Scripts

- `npm run docs:generate` - Generate OpenAPI specification
- `npm run postman:generate` - Generate Postman collection from OpenAPI
- `npm run docs:build` - Generate all documentation

## 🛠 Development

```bash
npm run dev  # Start with nodemon
npm run test-docs  # Test documentation generation
```


