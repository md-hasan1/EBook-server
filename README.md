# EBook Server

A comprehensive **eBook management and distribution platform** that connects readers with digital content. Built with modern technologies to provide seamless browsing, purchasing, notifications, and user management.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Routes](#api-routes)
- [Database](#database)
- [Deployment](#deployment)
- [Testing the API](#-testing-the-api)
- [Best Practices](#-best-practices)
- [Security Features](#-security-features)
- [Contributing](#-contributing)

---

## 🎯 Overview

EBook Server is a full-featured digital library management system designed for eBook distribution and reading. It allows users to browse eBooks, make purchases, earn and redeem points, manage favorites, and receive notifications about new releases and promotions.

**Key Use Cases:**
- Digital book catalog browsing
- Purchase and redemption system
- User authentication and authorization
- Points and rewards management
- Favorite bookmarks and collections
- Push notifications and email alerts
- Book recommendations and discovery

---

## ✨ Features

- **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin, User)
  - Password reset and change functionality
  - Email verification

- **Book Management**
  - Browse eBooks by category
  - Search and filter functionality
  - Book details and metadata
  - Book ratings and reviews
  - Cover images and previews

- **Purchase System**
  - Secure book purchases
  - Purchase history tracking
  - Download links and access control
  - Transaction management

- **Points & Rewards**
  - Earn points on purchases
  - Point balance tracking
  - Redeem points for books or discounts
  - Point transaction history

- **User Features**
  - Favorites and bookmarks
  - Reading lists and collections
  - User profile management
  - Wishlist functionality
  - Purchase history

- **Category Management**
  - Organize books by categories
  - Genre and tag system
  - Category browsing and filtering

- **Notifications**
  - Email notifications (via Brevo SMTP)
  - Firebase push notifications
  - New release alerts
  - Promotional announcements
  - Purchase confirmations

- **Banner & Promotions**
  - Promotional banners
  - Featured books section
  - Special offers management

- **Admin Features**
  - Book catalog management
  - User management
  - Category administration
  - Banner and promotion management
  - Analytics and reporting

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | JWT |
| **Email Service** | Brevo (Sendinblue) |
| **Push Notifications** | Firebase Cloud Messaging |
| **SMS Notifications** | Twilio |
| **File Upload** | Multer |
| **Validation** | Zod |
| **Deployment** | Vercel / Docker |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── db/                    # Database configuration
│   │   ├── db.interface.ts
│   │   └── db.ts
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.ts
│   │   ├── globalErrorHandler.ts
│   │   └── validateRequest.ts
│   ├── modules/               # Feature modules
│   │   ├── Auth/              # Authentication
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   ├── Banner/            # Promotional banners
│   │   ├── Book/              # Book catalog
│   │   │   ├── Book.controller.ts
│   │   │   ├── Book.routes.ts
│   │   │   ├── Book.service.ts
│   │   │   ├── Book.validation.ts
│   │   │   ├── Book.constant.ts
│   │   │   └── Book.interface.ts
│   │   ├── Category/          # Book categories
│   │   ├── favourite/         # Favorite bookmarks
│   │   ├── Notification/      # Notifications
│   │   │   ├── Notification.controller.ts
│   │   │   ├── Notification.routes.ts
│   │   │   ├── Notification.service.ts
│   │   │   ├── firebaseService.ts
│   │   │   └── firebaseAdmin.ts
│   │   ├── Point/             # Points & rewards
│   │   ├── Purchase/          # Book purchases
│   │   ├── Redeem/            # Point redemption
│   │   └── User/              # User management
│   ├── routes/                # API routes
│   └── shared/                # Shared utilities
│       ├── emailSender.ts
│       ├── twilloSender.ts
│       ├── jwtHelpers.ts
│       ├── paginationHelper.ts
│       ├── sendResponse.ts
│       └── ...
├── config/                    # Configuration files
├── errors/                    # Error handling
│   ├── ApiErrors.ts
│   ├── handleZodError.ts
│   └── parsePrismaValidationError.ts
├── helpers/                   # Utility functions
│   ├── fileUploader.ts
│   ├── jwtHelpers.ts
│   └── paginationHelper.ts
├── interfaces/                # TypeScript interfaces
├── app.ts                     # Express app setup
└── server.ts                  # Server entry point

prisma/
└── schema.prisma              # Database schema

.env.example                   # Environment variables template
package.json
tsconfig.json
vercel.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Environment variables** configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/md-hasan1/EBook-server.git
   cd EBook-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Setup the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**
   ```bash
   npm run build
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000` (or your configured port)

**Production API:**
- **Base URL**: `https://ebook-kappa-dusky.vercel.app/api/v1`
- **Status**: Live and deployed on Vercel
- **Live Demo**: https://ebook-kappa-dusky.vercel.app

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ebook_db

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE_IN=7d

# Email Service (Brevo/Sendinblue)
EMAIL_HOST=smtp.brevo.com
EMAIL=your_email@example.com
EMAIL_APP_PASSWORD=your_brevo_smtp_password

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# Twilio (SMS Notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_MESSAGING_SERVICE_SID=your_twilio_messaging_service_sid

# File Upload
MAX_FILE_SIZE=5242880

# Timezone
APP_TIMEZONE=UTC
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Production
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production build

# Database
npx prisma migrate dev   # Create and apply migrations
npx prisma studio       # Open Prisma Studio (database GUI)
npx prisma migrate reset # Reset database (development only)

# Code Generation
npm run generate         # Generate module boilerplate
```

---

## 🔌 API Routes Overview

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/get-me` - Get current user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `POST /api/users` - Create user (register)
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account

### Books
- `GET /api/books` - Get all books with pagination
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create book (admin only)
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/search` - Search books

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Purchases
- `POST /api/purchases` - Create purchase
- `GET /api/purchases` - Get user purchases
- `GET /api/purchases/:id` - Get purchase details
- `GET /api/purchases/books/:bookId` - Get purchase status for book

### Points
- `GET /api/points/balance` - Get user points balance
- `GET /api/points/history` - Get points transaction history
- `POST /api/points/earn` - Earn points (automatic on purchase)

### Redemption
- `POST /api/redeem` - Redeem points
- `GET /api/redeem/history` - Get redemption history
- `GET /api/redeem/:id` - Get redemption details

### Favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:bookId` - Remove from favorites
- `GET /api/favorites` - Get user favorites

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/send` - Send notification (admin)

### Banners
- `GET /api/banners` - Get active banners
- `POST /api/banners` - Create banner (admin)
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner

---

## 💾 Database

### Setup with Prisma

```bash
# Create database migrations
npx prisma migrate dev --name init

# Reset database (development only)
npx prisma migrate reset

# View database in GUI
npx prisma studio
```

### Database Schema
The database schema is defined in [prisma/schema.prisma](prisma/schema.prisma) and includes:
- Users (with roles and authentication)
- Books (with metadata and categories)
- Categories and Classifications
- Purchases and Purchase History
- Points and Rewards
- Redemptions
- Favorites and Bookmarks
- Notifications
- Banners and Promotions

---

## 🚢 Deployment

### Vercel (Production)
The application is currently deployed on Vercel:
- **Production URL**: https://ebook-kappa-dusky.vercel.app
- **API Base URL**: https://ebook-kappa-dusky.vercel.app/api/v1
- **Status**: ✅ Active and Running

#### Deploy to Vercel
```bash
vercel deploy              # Deploy to staging
vercel deploy --prod       # Deploy to production
```

### Docker
```bash
docker-compose up --build
```

#### Environment Variables Setup
Before deploying, ensure all environment variables are configured in:
- **Local Development**: `.env.local` file
- **Vercel**: Project Settings → Environment Variables

**Critical Variables for Deployment:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FIREBASE_*` - Firebase configuration
- `TWILIO_*` - Twilio SMS configuration
- `EMAIL_*` - Email service credentials
- `AUTH_API_KEY` - API key for authentication (base64 encoded)

---

## 📝 Best Practices

- **Error Handling**: Global error handler with Zod validation error parsing
- **Pagination**: Built-in pagination helpers for list endpoints
- **File Upload**: Secure file upload handling with Multer
- **JWT Security**: Secure token-based authentication
- **Validation**: Zod schema validation for all inputs
- **Database**: Prisma migrations for schema management

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing
- Input validation with Zod
- Role-based access control
- File upload restrictions
- Error message sanitization
- CORS configuration

---

## 👥 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit your changes: `git commit -m 'Add feature'`
3. Push to the branch: `git push origin feature/feature-name`
4. Open a Pull Request

---

## 📄 License

ISC

---

## 📧 Support

For support or questions, please contact: mdhasan26096@gmail.com

---

## 🔄 Recent Updates

- ✅ Fixed Git push protection issues by removing secrets from commit history
- ✅ Cleaned up environment variable handling
- ✅ Implemented Twilio and Brevo integration
- ✅ Added Firebase cloud messaging support
- ✅ Created comprehensive Postman API collections for all 60+ routes
- ✅ Added Zod validation schemas for all 10 modules
- ✅ Fixed ESM/CommonJS compatibility issue with native `fetch` API
- ✅ Deployed production API on Vercel at https://ebook-kappa-dusky.vercel.app
- ✅ Generated complete API documentation with validation examples

### Latest Additions

#### Production Deployment
- **Live API**: https://ebook-kappa-dusky.vercel.app/api/v1
- **Status**: ✅ Active and running on Vercel
- **Status Check**: GET https://ebook-kappa-dusky.vercel.app returns `{"success":true,"statusCode":200,"message":"The server is running!"}`

#### Postman Collections
- **EBook-Server-API.postman_collection.json** - Complete collection with 60+ requests across 10 modules
- **EBook-Server-Environment.postman_environment.json** - Environment configuration with all necessary variables
- **POSTMAN_SETUP.md** - Comprehensive setup and usage guide

**Quick Import:**
1. Open Postman → Import → Select collection JSON file
2. Settings → Environments → Import environment JSON file
3. Select "EBook Server Environment" from dropdown
4. Login via Auth > Login and test all endpoints

#### Validation & Error Handling
- All routes protected with Zod validation schemas
- Request body, parameters, and query validation
- Custom error messages for better debugging
- Comprehensive error handling with Prisma integration

---

## 🎯 Testing the API

### Quick Start with Postman
See [POSTMAN_SETUP.md](POSTMAN_SETUP.md) for detailed instructions on importing and using the Postman collection.

### Using cURL
```bash
# Check server status
curl https://ebook-kappa-dusky.vercel.app

# Login
curl -X POST https://ebook-kappa-dusky.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get all books
curl -X GET "https://ebook-kappa-dusky.vercel.app/api/v1/books?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Node.js/TypeScript
```typescript
// Login
const response = await fetch('https://ebook-kappa-dusky.vercel.app/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password123' })
});
const { data } = await response.json();
const token = data.accessToken;

// Get books
const booksResponse = await fetch('https://ebook-kappa-dusky.vercel.app/api/v1/books?page=1&limit=10', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const books = await booksResponse.json();
console.log(books);
```

---

**Happy Coding! 🎉**

