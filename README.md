# Speceal NestJS Backend

A comprehensive NestJS backend for the Speceal image gallery application with authentication, image management, and user management features.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Email verification
  - Password reset functionality
  - Role-based access control (User/Admin)
  - Refresh token support

- **Image Management**
  - Upload images to Cloudinary
  - Image categorization and tagging
  - Like/unlike functionality
  - Download tracking
  - View counting
  - Public/private image settings

- **User Management**
  - User profiles
  - User statistics
  - Admin user management

- **Additional Features**
  - Rate limiting
  - File validation
  - Comprehensive error handling
  - API documentation with Swagger
  - Health check endpoint

## Technology Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Security**: Helmet, CORS, Rate limiting

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nest-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
- MongoDB connection string
- JWT secrets
- Cloudinary credentials
- Email service configuration

## Environment Variables

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/speceal

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@speceal.com

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production Build
```bash
npm run build
npm run start:prod
```

### Watch Mode
```bash
npm run start:debug
```

## API Documentation

When running in development mode, Swagger documentation is available at:
```
http://localhost:5000/api/docs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email` - Verify email address
- `PATCH /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `GET /api/users/stats/:id` - Get user statistics
- `GET /api/users` - Get all users (Admin only)
- `PATCH /api/users/deactivate/:id` - Deactivate user (Admin only)

### Images
- `POST /api/images` - Upload new image
- `GET /api/images` - Get all public images (with filtering)
- `GET /api/images/my-images` - Get current user's images
- `GET /api/images/stats` - Get image statistics
- `GET /api/images/categories` - Get all categories
- `GET /api/images/trending-tags` - Get trending tags
- `GET /api/images/:id` - Get specific image
- `PATCH /api/images/:id` - Update image
- `DELETE /api/images/:id` - Delete image
- `POST /api/images/:id/like` - Like/unlike image
- `POST /api/images/:id/download` - Download image

### Health
- `GET /api/health` - Health check

## Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── decorators/         # Custom decorators
│   ├── dto/               # Data transfer objects
│   ├── guards/            # Auth guards
│   ├── strategies/        # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/                 # Users module
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── images/                # Images module
│   ├── dto/
│   ├── images.controller.ts
│   ├── images.module.ts
│   └── images.service.ts
├── cloudinary/            # Cloudinary service
├── email/                 # Email service
├── health/                # Health check
├── schemas/               # Mongoose schemas
├── types/                 # TypeScript interfaces
├── common/                # Shared utilities
├── app.module.ts
└── main.ts
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **JWT**: Secure authentication
- **Validation**: Input validation and sanitization
- **File Upload**: Type and size restrictions

## Error Handling

The application includes comprehensive error handling with:
- Custom exception filters
- Validation errors
- Database errors
- File upload errors
- Authentication errors

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Start the application:
```bash
npm run start:prod
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
