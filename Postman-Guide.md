# Postman Testing Guide for Anaztex International Backend

## 🚀 Setup Instructions

### 1. Import Collection
1. Open Postman
2. Click "Import" in the top left
3. Select the JSON collection file (you'll need to create this manually)
4. The collection will be imported with all endpoints

### 2. Environment Variables
Set these in Postman:
- `baseUrl`: `http://localhost:3001`
- `authToken`: (auto-filled after login)
- `productId`: (set manually for update/delete tests)

## 📋 API Endpoints

### 🔐 Authentication

#### 1. Register User
- **Method**: POST
- **URL**: `{{baseUrl}}/api/users/register`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "address": "123 Main St, City, Country",
    "role": "admin"
}
```

#### 2. Login User
- **Method**: POST
- **URL**: `{{baseUrl}}/api/users/login`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
    "email": "admin@example.com",
    "password": "password123"
}
```
- **⚠️ Important**: After successful login, the token is automatically saved to `{{authToken}}` variable

### 📦 Products

#### 1. Get All Products
- **Method**: GET
- **URL**: `{{baseUrl}}/api/products`
- **Headers**: None required
- **Purpose**: View all products in database

#### 2. Create Product (No Images)
- **Method**: POST
- **URL**: `{{baseUrl}}/api/products`
- **Headers**: 
  - `Authorization: Bearer {{authToken}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
    "name": "Test Product - No Images",
    "description": "This is a test product without images",
    "price": 99.99,
    "category": "Garments",
    "stock": 10,
    "brand": "Test Brand"
}
```

#### 3. Create Product (With Images) 🖼️
- **Method**: POST
- **URL**: `{{baseUrl}}/api/products`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Body**: `form-data`
- **Form Fields**:
  - `name` (text): "Test Product - With Images"
  - `description` (text): "This is a test product with images uploaded to S3"
  - `price` (text): "149.99"
  - `category` (text): "Cosmetics" (determines S3 folder)
  - `stock` (text): "25"
  - `brand` (text): "Cosmetic Brand"
  - `images` (file): Select image file 1
  - `images` (file): Select image file 2
  - `images` (file): Select image file 3 (up to 5 images)

#### 4. Update Product
- **Method**: PUT
- **URL**: `{{baseUrl}}/api/products/{{productId}}`
- **Headers**: 
  - `Authorization: Bearer {{authToken}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
    "name": "Updated Product Name",
    "price": 199.99,
    "description": "Updated description"
}
```

#### 5. Delete Product
- **Method**: DELETE
- **URL**: `{{baseUrl}}/api/products/{{productId}}`
- **Headers**: `Authorization: Bearer {{authToken}}`

## 🧪 Testing Workflow

### Step 1: Start Server
```bash
npm run dev
```
Check console for:
- ✅ MongoDB connection
- ✅ AWS S3 connection
- ✅ Server started on port 3001

### Step 2: Register Admin (First Time Only)
1. Send POST to `/api/users/register`
2. Use admin role in the request

### Step 3: Login
1. Send POST to `/api/users/login`
2. Token automatically saved to environment variables

### Step 4: Test Product Creation
1. **Without Images**: Test basic product creation
2. **With Images**: Test S3 upload functionality

### Step 5: Test Other Operations
1. Get all products to see results
2. Update a product (copy product ID from get response)
3. Delete a product

## 📊 Expected Results

### Successful Product Creation (With Images)
```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Test Product - With Images",
        "description": "This is a test product with images uploaded to S3",
        "price": 149.99,
        "category": "Cosmetics",
        "stock": 25,
        "brand": "Cosmetic Brand",
        "images": [
            "https://anzatexinternational.s3.eu-north-1.amazonaws.com/cosmetics/1640995200000-test1.jpg",
            "https://anzatexinternational.s3.eu-north-1.amazonaws.com/cosmetics/1640995200001-test2.png"
        ],
        "createdAt": "2023-12-31T23:59:59.999Z",
        "__v": 0
    }
}
```

### Console Logs to Watch
- `🔴 REGISTER API HIT` - User registration attempts
- `🟢 LOGIN API HIT` - User login attempts
- `✅ AWS S3 Connection Successful!` - S3 connectivity
- `BODY:` - Product data received
- `FILES:` - Uploaded files information

## 🔧 Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check if you're logged in and token is valid
2. **403 Forbidden**: Check if user has admin role
3. **Bucket Error**: Verify AWS credentials in `.env` file
4. **Image Upload Failed**: Check image file size and format

### Debug Tips
- Check server console for detailed error messages
- Verify S3 bucket exists and has correct permissions
- Ensure images are valid file types (jpg, png, etc.)
- Check that `category` field matches expected values ("Garments" or "Cosmetics")

## 📝 Notes
- Images are uploaded to S3 bucket: `anzatexinternational`
- Folder structure: `garments/` for Garments category, `cosmetics/` for Cosmetics
- Max 5 images per product
- Images are publicly accessible via returned URLs
- All admin operations require authentication and admin role
