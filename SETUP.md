# NestJS Backend Setup Complete! 🎉

Your complete NestJS backend for the Speceal image gallery application is now ready. Here's what has been created:

## 📁 Project Structure
```
nest-backend/
├── src/
│   ├── auth/           # Authentication module (JWT, login, register, etc.)
│   ├── users/          # User management
│   ├── images/         # Image upload, management, likes, downloads
│   ├── cloudinary/     # File upload service
│   ├── email/          # Email notifications
│   ├── health/         # Health check endpoint
│   ├── schemas/        # MongoDB schemas
│   ├── types/          # TypeScript interfaces
│   ├── common/         # Shared utilities
│   └── scripts/        # Utility scripts
├── test/               # Test files
├── package.json        # Dependencies and scripts
├── README.md           # Comprehensive documentation
└── .env                # Environment variables
```

## 🚀 Quick Start

### 1. Configure Environment Variables
Edit `.env` file with your actual credentials:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/speceal  # or your MongoDB Atlas URL

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. Start Development Server
```bash
cd nest-backend
npm run start:dev
```

Your server will start at: `http://localhost:5000`

### 3. View API Documentation
Visit: `http://localhost:5000/api/docs` for Swagger documentation

### 4. Health Check
Test: `http://localhost:5000/api/health`

## 🔧 Available Scripts

```bash
# Development
npm run start:dev        # Start with hot reload
npm run start:debug      # Start with debug mode

# Production
npm run build           # Build the project
npm run start:prod      # Start production server

# Testing
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests

# Utilities
npm run create-admin   # Create admin user (after DB setup)
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email` - Verify email

### Images
- `POST /api/images` - Upload image (multipart/form-data)
- `GET /api/images` - Get all images (with filters)
- `GET /api/images/:id` - Get specific image
- `PATCH /api/images/:id` - Update image
- `DELETE /api/images/:id` - Delete image
- `POST /api/images/:id/like` - Like/unlike image
- `POST /api/images/:id/download` - Download image

### Users
- `GET /api/users/profile` - Get profile
- `PATCH /api/users/profile` - Update profile
- `GET /api/users/stats/:id` - Get user stats

## 🔐 Security Features

- ✅ JWT Authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Rate limiting (100 requests/minute)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation with class-validator
- ✅ File upload validation
- ✅ Role-based access control

## 🗄️ Database Models

### User Schema
- Authentication (email, username, password)
- Profile (firstName, lastName, avatar)
- Roles and permissions
- Email verification
- Password reset tokens

### Image Schema
- File information (URL, size, format, dimensions)
- Metadata (title, description, category, tags)
- User interactions (likes, views, downloads)
- Privacy settings (public/private)

## 🌐 Integration Notes

### Frontend Integration
The API is designed to work with your React frontend:
- CORS enabled for `http://localhost:5173`
- JWT tokens for authentication
- Multipart form data for file uploads
- RESTful endpoints with consistent responses

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in `.env`
3. Run `npm run create-admin` to create admin user

### Cloudinary Setup
1. Create Cloudinary account
2. Get cloud name, API key, and secret
3. Update `.env` with your credentials

### Email Setup
1. Configure SMTP settings in `.env`
2. For Gmail: use app passwords
3. Update email templates in `src/email/email.service.ts`

## 🚀 Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production database URL
- Set up proper email service
- Configure Cloudinary for production

### Docker Support (Optional)
You can create a Dockerfile for containerization:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/main"]
```

## 🧪 Testing

Run tests to ensure everything works:
```bash
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
npm run test:cov    # Coverage report
```

## 📞 Support

If you encounter any issues:
1. Check the logs for error messages
2. Ensure all environment variables are set
3. Verify database connection
4. Check Cloudinary credentials
5. Test email configuration

## 🎯 Next Steps

1. **Configure your environment variables**
2. **Set up MongoDB database**
3. **Configure Cloudinary for image uploads**
4. **Set up email service**
5. **Create admin user**: `npm run create-admin`
6. **Start development server**: `npm run start:dev`
7. **Test the API endpoints**
8. **Integrate with your React frontend**

Your NestJS backend is now ready to power your Speceal image gallery application! 🚀
