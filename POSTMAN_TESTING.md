# SevaTrack API - Postman Testing Guide

## Create User (Signup) - POST Request

### Endpoint
```
POST http://localhost:3000/api/users
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON)

#### Example 1: Create Field Worker
```json
{
  "email": "worker1@example.com",
  "name": "John Worker",
  "password": "password123",
  "role": "worker"
}
```

#### Example 2: Create NGO Admin
```json
{
  "email": "admin@sevatrack.org",
  "name": "Admin User",
  "password": "adminpass123",
  "role": "admin"
}
```

### Response (Success - 201)
```json
{
  "success": true,
  "message": "Worker user created successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "worker1@example.com",
      "name": "John Worker",
      "role": "worker",
      "workerId": "WRK-1715881234567"
    }
  }
}
```

---

## Login with Created User - POST Request

### Endpoint
```
POST http://localhost:3000/api/auth/worker/login
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON)
```json
{
  "email": "worker1@example.com",
  "password": "password123",
  "name": "John Worker"
}
```

### Response (Success - 200)
```json
{
  "success": true,
  "message": "Field worker login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "worker1@example.com",
      "name": "John Worker",
      "workerId": "WRK-1715881234567",
      "role": "worker"
    }
  }
}
```

---

## Get All Users - GET Request

### Endpoint
```
GET http://localhost:3000/api/users
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_jwt_token>"
}
```

### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "email": "worker1@example.com",
        "name": "John Worker",
        "role": "worker",
        "workerId": "WRK-1715881234567",
        "status": "active",
        "isVerified": true,
        "createdAt": "2026-05-16T10:30:00.000Z",
        "updatedAt": "2026-05-16T10:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

## Get User by ID - GET Request

### Endpoint
```
GET http://localhost:3000/api/users/<userId>
```

### Example
```
GET http://localhost:3000/api/users/507f1f77bcf86cd799439011
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_jwt_token>"
}
```

---

## Update User - PATCH Request

### Endpoint
```
PATCH http://localhost:3000/api/users/<userId>
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <admin_token>"
}
```

### Body (JSON)
```json
{
  "name": "Updated Name",
  "status": "active"
}
```

---

## Delete User - DELETE Request

### Endpoint
```
DELETE http://localhost:3000/api/users/<userId>
```

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <admin_token>"
}
```

---

## Step-by-Step Testing Flow

1. **Create a Worker User**
   - Use POST /api/users with worker data
   - Note down the email and password

2. **Login with Created Credentials**
   - Use POST /api/auth/worker/login
   - Copy the JWT token from response

3. **Get All Users** (using the token)
   - Use GET /api/users
   - Add the token in Authorization header

4. **Create an Admin User**
   - Use POST /api/users with admin data (@sevatrack.org domain)

5. **Verify MongoDB**
   - Check your MongoDB cluster to see inserted users

---

## Error Responses

### 400 - Missing Required Fields
```json
{
  "success": false,
  "message": "Email, name, password, and role are required"
}
```

### 409 - User Already Exists
```json
{
  "success": false,
  "message": "User with this email already exists",
  "code": "USER_EXISTS"
}
```

### 403 - Invalid Admin Domain
```json
{
  "success": false,
  "message": "Admin users must use @sevatrack.org email domain",
  "code": "INVALID_ADMIN_DOMAIN"
}
```

### 400 - Invalid Role
```json
{
  "success": false,
  "message": "Role must be either admin or worker"
}
```

### 401 - No Token Provided
```json
{
  "success": false,
  "message": "No token provided"
}
```

---

## Important Notes

✅ **Public Endpoint:** `POST /api/users` - No authentication needed (signup)
🔒 **Protected Endpoints:** GET, PATCH, DELETE - Require JWT token
👨‍💼 **Admin Only:** PATCH, DELETE - Require admin role
🌐 **Domain Validation:** Admins must use @sevatrack.org email
💾 **Database:** All users are stored in MongoDB
🔑 **Password:** Currently stored in plain text (use bcryptjs in production)
