# ModernfyDesign-backend

### [ModernfyDesign frontend](https://github.com/BvChung/ModernfyDesign-frontend)

## Overview

ModernfyDesign backend REST API

## Table of Contents

- [Tech](#tech)<br/>
- [Development](#development)<br/>

## Tech

### Back-End

- [NodeJs](https://nodejs.dev/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [JWT](https://jwt.io/)
- [Zod](https://zod.dev/)

## Development

### Running backend

1. Install dependencies

```
npm i
```

2. Set up `.env`

```bash
# Respective mongoDB connection URI
MONGO_URI =

PORT =
DEPLOYMENT_URL =

# JWT secret strings
JWT_ACCESS_SECRET =
JWT_REFRESH_SECRET =

# Cloudinary account connection
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 

# Cloudinary upload folder
CLOUDINARY_PRODUCT_UPLOAD = 

# MongoDB created guest admin id (_id:)
GUEST_ADMIN_ACCOUNT_ID =
ADMIN_ACCOUNT_ID =
```

3. Starting backend

```
npm run dev
```
