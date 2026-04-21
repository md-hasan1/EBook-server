# Postman API Collections - EBook Server

This directory contains comprehensive Postman collections for testing the EBook Server API.

## Files Included

1. **EBook-Server-API.postman_collection.json** - Complete API collection with all routes
2. **EBook-Server-Environment.postman_environment.json** - Environment variables for development

## Getting Started

### Step 1: Import the Collection

1. Open Postman application
2. Click **"Import"** button in the top-left
3. Select **"File"** tab
4. Choose `EBook-Server-API.postman_collection.json`
5. Click **"Import"**

### Step 2: Import the Environment

1. Click on **Settings** (gear icon) → **Environments**
2. Click **"Import"**
3. Select `EBook-Server-Environment.postman_environment.json`
4. Click **"Import"**

### Step 3: Select the Environment

1. In the top-right dropdown, select **"EBook Server Environment"**
2. The environment variables will now be available for all requests

## Environment Variables

The following variables are available for use across all requests:

```
baseUrl        - API base URL (default: http://localhost:5000)
authToken      - JWT authentication token (set after login)
userId         - Current user ID
bookId         - Current book ID
categoryId     - Current category ID
purchaseId     - Current purchase ID
pointId        - Current point ID
redeemId       - Current redeem ID
favouriteId    - Current favourite ID
notificationId - Current notification ID
bannerId       - Current banner ID
recommendedId  - Current recommended book ID
```

## API Collections Overview

### 1. **Auth** - Authentication Routes
- Login
- Logout
- Get Profile
- Change Password
- Forgot Password
- Verify OTP
- Reset Password
- Resend OTP

**Quick Start:**
1. POST `/api/auth/login` with email and password
2. Copy the JWT token from the response
3. Paste it in the `authToken` environment variable

### 2. **Users** - User Management
- Register
- Get All Users (paginated)
- Get User by ID
- Update User Profile
- Update User
- Block User
- Toggle Notification Status
- Delete User
- Delete Multiple Users

### 3. **Books** - Book Catalog
- Get All Books (paginated)
- Get Book by ID
- Create Book
- Update Book
- Delete Book
- Get Books by Name (search)
- Get Recommended Books
- Add Recommended Book
- Delete Recommended Book
- Get Best Selling Books
- Get Books Overview

### 4. **Categories** - Book Categories
- Get All Categories
- Get Category by ID
- Create Category
- Update Category
- Delete Category

### 5. **Purchases** - Purchase Management
- Get All Purchases (paginated)
- Get Purchase by ID
- Create Purchase
- Update Purchase
- Pin Purchase
- Delete Purchase

### 6. **Points** - Points System
- Get All Points (paginated)
- Get Points by ID
- Create Points
- Update Points
- Delete Points

### 7. **Redemption** - Point Redemption
- Get All Redeems (paginated)
- Get Redeem by ID
- Create Redeem
- Update Redeem
- Use Points to Get Book
- Delete Redeem

### 8. **Favorites** - User Favorites
- Get All Favorites (paginated)
- Get User Favorites
- Get Favorite by ID
- Toggle Favorite
- Delete Favorite

### 9. **Notifications** - User Notifications
- Get All Notifications (paginated)
- Get Notification by ID
- Send Notification
- Send Notification to Specific User
- Mark Notification as Read
- Delete Notification

### 10. **Banners** - Promotional Banners
- Get All Banners (paginated)
- Get Banner by ID
- Create Banner
- Update Banner
- Delete Banner

## Usage Examples

### Example 1: Login and Retrieve User Profile

```
1. Send POST /api/auth/login with:
   {
     "email": "user@example.com",
     "password": "password123"
   }

2. Copy the token from response
3. Paste in authToken variable
4. Send GET /api/auth/get-me to retrieve profile
```

### Example 2: Create a Book and Add to Favorites

```
1. Send POST /api/books with book details
2. Copy the bookId from response
3. Paste in bookId variable
4. Send POST /api/favourite/toggle to add to favorites
```

### Example 3: Make a Purchase

```
1. Get bookId from books collection
2. Send POST /api/purchases with:
   {
     "bookId": "{{bookId}}",
     "price": 9.99,
     "paymentMethod": "card"
   }

3. Copy purchaseId from response
4. Use to track purchase status
```

## Pre-request Scripts

For authenticated endpoints, the collection automatically includes the Bearer token from the `authToken` variable in all requests after login.

## Common Error Codes

- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error

## Tips

1. **Always login first** - Get an authToken before making authenticated requests
2. **Save IDs** - After creating resources, save the IDs in environment variables for reuse
3. **Test pagination** - Use `?page=1&limit=10` query parameters on GET endpoints
4. **Check validation** - Review validation schemas in the codebase for required fields
5. **Use examples** - Each request includes example body/parameters

## Modifying Requests

You can customize requests by:
- Changing variable values in the **Environment**
- Editing request bodies to match your test data
- Adding new requests based on the existing patterns
- Creating test scripts in the **Tests** tab

## Troubleshooting

### Token Expires
- Re-login to get a new token
- Update the `authToken` variable with the new token

### 404 Errors
- Verify the resource ID exists
- Check if the resource was created successfully
- Ensure you're using the correct endpoint

### 401 Unauthorized
- Make sure `authToken` variable has a valid token
- Verify the token hasn't expired (login again if needed)

### 400 Validation Errors
- Check request body matches the validation schema
- Verify all required fields are included
- Review error message for specific field errors

## Next Steps

1. Import the collection in Postman
2. Set up the environment variables
3. Login to get an authentication token
4. Start testing API endpoints
5. Export test results if needed

---

**Happy Testing!** 🚀

For more information, refer to the API validation schemas in:
- `src/app/modules/*/validation.ts`
