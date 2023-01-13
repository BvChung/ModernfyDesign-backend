# MordernfyDesign-backend

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
CLOUDINARY_CLOUD_NAME = drphuekm9
CLOUDINARY_API_KEY = 285238876546457
CLOUDINARY_API_SECRET = sXwJzF-nUxFPZKvbjWPe5HY25kE

# Cloudinary upload folder
CLOUDINARY_PRODUCT_UPLOAD = commerce_products

# MongoDB created guest admin id (_id:)
GUEST_ADMIN_ACCOUNT_ID = 6321829716505e77a630034b
```

3. Starting backend

```
npm run dev
```
