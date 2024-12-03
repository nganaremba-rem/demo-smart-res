# Database Schema

## Users Collection

```javascript
{
  _id: ObjectId,
  phoneNumber: String,
  name: String,
  email: String,
  addresses: [{
    type: String,
    address: String,
    landmark: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Restaurants Collection

```javascript
{
  _id: ObjectId,
  slug: String,  // URL-friendly name for routing
  name: String,
  description: String,
  logo: String,
  coverImage: String,
  contact: {
    email: String,
    phone: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  settings: {
    isActive: Boolean,
    acceptingOrders: Boolean,
    minimumOrderValue: Number,
    deliveryRadius: Number,
    taxPercentage: Number
  },
  customization: {
    primaryColor: String,
    secondaryColor: String,
    fontFamily: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Categories Collection

```javascript
{
  _id: ObjectId,
  restaurantId: ObjectId,
  name: String,
  description: String,
  image: String,
  parentCategoryId: ObjectId,  // For sub-categories
  sortOrder: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Products Collection

```javascript
{
  _id: ObjectId,
  restaurantId: ObjectId,
  categoryId: ObjectId,
  name: String,
  description: String,
  images: [String],
  price: Number,
  discountedPrice: Number,
  customization: [{
    name: String,
    options: [{
      name: String,
      price: Number
    }],
    required: Boolean,
    multiple: Boolean
  }],
  attributes: {
    isVeg: Boolean,
    spiceLevel: String,
    allergens: [String]
  },
  availability: {
    isAvailable: Boolean,
    stockCount: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Admins Collection

```javascript
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  name: String,
  role: String,  // 'SUPER_ADMIN' or 'RESTAURANT_ADMIN'
  restaurantId: ObjectId,  // null for super admin
  permissions: [String],
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Orders Collection

```javascript
{
  _id: ObjectId,
  restaurantId: ObjectId,
  userId: ObjectId,
  orderNumber: String,
  items: [{
    productId: ObjectId,
    name: String,
    quantity: Number,
    price: Number,
    customizations: [{
      name: String,
      option: String,
      price: Number
    }]
  }],
  status: String,  // 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'
  payment: {
    method: String,
    status: String,
    transactionId: String,
    amount: Number
  },
  delivery: {
    address: {
      type: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    instructions: String
  },
  pricing: {
    subtotal: Number,
    tax: Number,
    deliveryFee: Number,
    discount: Number,
    total: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

# Application Architecture

## Backend Structure

```
src/
├── config/
│   ├── database.js
│   ├── aws.js
│   └── redis.js
├── models/
│   ├── User.js
│   ├── Restaurant.js
│   ├── Category.js
│   ├── Product.js
│   ├── Admin.js
│   └── Order.js
├── services/
│   ├── auth/
│   ├── restaurant/
│   ├── order/
│   ├── payment/
│   └── notification/
├── controllers/
│   ├── auth.controller.js
│   ├── restaurant.controller.js
│   ├── admin.controller.js
│   └── order.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── restaurant.middleware.js
│   └── admin.middleware.js
├── utils/
│   ├── validation.js
│   ├── error-handler.js
│   └── logger.js
└── routes/
    ├── auth.routes.js
    ├── restaurant.routes.js
    ├── admin.routes.js
    └── order.routes.js
```

## Scaling Considerations

1. **Database Indexing**

- Create indexes on frequently queried fields
- Compound indexes for restaurant-specific queries
- Text indexes for search functionality

2. **Caching Strategy**

- Implement Redis for:
  - Session management
  - Frequently accessed restaurant data
  - Menu categories and items
  - Order status updates

3. **Authentication & Authorization**

- JWT for admin authentication
- Phone number verification for customers
- Role-based access control for admin panel
- Restaurant-specific middleware for route protection

4. **File Storage**

- Use AWS S3 or similar for:
  - Restaurant logos
  - Product images
  - Menu PDFs
  - Other static assets

5. **API Rate Limiting**

- Implement rate limiting per restaurant
- DDoS protection
- Request throttling

6. **Monitoring & Logging**

- Application performance monitoring
- Error tracking and reporting
- Usage analytics per restaurant
- Audit logs for admin actions

7. **Deployment Strategy**

- Docker containerization
- Kubernetes for orchestration
- Separate deployments per restaurant possible
- CI/CD pipeline setup

8. **Security Measures**

- Data encryption at rest and in transit
- Regular security audits
- Input validation and sanitization
- XSS and CSRF protection

9. **Performance Optimization**

- Database query optimization
- Asset compression and CDN usage
- Lazy loading for images
- API response caching

10. **Backup & Recovery**

- Automated database backups
- Point-in-time recovery
- Disaster recovery plan
- Data retention policies
