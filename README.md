# MicroMart - Microservices E-commerce Platform

A modern, scalable e-commerce platform built with microservices architecture using Spring Boot and React.

## 🏗️ Architecture Overview

MicroMart follows a microservices architecture pattern with the following components:

```
┌─────────────────┐    ┌──────────────────┐
│  React Frontend │────│   API Gateway    │
│   (Port: 5173)  │    │   (Port: 8080)   │
└─────────────────┘    └──────────────────┘
                                │
                ┌───────────────┼────────────────┐
                │               │                │
        ┌───────▼──────┐ ┌──────▼────────┐ ┌─────▼───────┐
        │ Auth Service │ │Product Service│ │Order Service│
        │ (Port: 9000) │ │ (Port: 9001)  │ │(Port: 9002) │
        └──────────────┘ └───────────────┘ └─────────────┘
                │               │                │
        ┌───────▼──────┐        │          ┌─────▼──────┐
        │Email Service │        │          │   Cart     │
        │ (Port: 9004) │        │          │  Service   │
        └──────────────┘        │          └────────────┘
                                │
                        ┌───────▼───────┐
                        │   Database    │
                        │   (MongoDB)   │
                        └───────────────┘
```

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Responsive Design**: Mobile-first responsive design
- **Real-time Updates**: Dynamic cart and wishlist management
- **Authentication**: JWT-based user authentication
- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add, update, and remove items

### Backend Services

#### 🔐 Auth Service (Port: 9000)
- User registration and login
- JWT token generation and validation
- Password encryption with BCrypt
- Refresh token mechanism
- User profile management
- Wishlist functionality

#### 📦 Product Service (Port: 9001)
- Product CRUD operations
- Category and tag management
- Image upload and management
- Product search and filtering
- Related products suggestions
- Inventory management

#### 🛒 Order Service (Port: 9002)
- Shopping cart management
- Order creation and tracking
- Order history
- Cart persistence
- Quantity management

#### 📧 Email Service (Port: 9004)
- Welcome email notifications
- Order confirmation emails
- Password reset emails
- SMTP integration

#### 🌐 API Gateway (Port: 8080)
- Request routing to microservices
- JWT authentication filter
- CORS configuration
- Load balancing
- Centralized entry point

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Framer Motion** - Animation Library
- **React Toatify** - Alert Message Library

### Backend
- **Java 21** - Programming language
- **Spring Boot 3.5.4 (3.2.11 - api-gateway)** - Framework
- **Spring Security** - Authentication & authorization
- **Spring Cloud Gateway** - API gateway
- **Spring Data MongoDB** - Data persistence
- **MongoDB** - On-Cloud database
- **JWT** - Token-based authentication
- **Maven** - Dependency management
- **Lombok** - Code generation

## 📋 Prerequisites

- **Java 21** or higher
- **Node.js 22** or higher
- **Maven 3.6** or higher
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd micromart
```

### 2. Start Backend Services

#### Start API Gateway
```bash
cd api-gateway
./mvnw spring-boot:run
```

#### Start Auth Service
```bash
cd auth-service
./mvnw spring-boot:run
```

#### Start Product Service
```bash
cd product-service
./mvnw spring-boot:run
```

#### Start Order Service
```bash
cd order-service
./mvnw spring-boot:run
```

#### Start Email Service
```bash
cd email-service
./mvnw spring-boot:run
```

### 3. Start Frontend
```bash
cd vite-project
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8080
- **Auth Service**: http://localhost:9000
- **Product Service**: http://localhost:9001
- **Order Service**: http://localhost:9002
- **Email Service**: http://localhost:9004

## 📁 Project Structure

```
micromart/
├── api-gateway/          # API Gateway service
├── auth-service/         # Authentication service
├── product-service/      # Product management service
├── order-service/        # Order and cart service
├── email-service/        # Email notification service
├── vite-project/         # React frontend
└── README.md
```

## 🔧 Configuration

### Environment Variables
Visit `application.properties or .yml` file in each service of resource directory.
- Check the details and fill the data where asked.

### Database
- Uses MongoDB On-Server database for development

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `GET /auth/profile` - Get user profile

### Products
- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Orders & Cart
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update cart item
- `DELETE /cart/remove` - Remove from cart
- `POST /orders` - Create order

## 🧪 Testing

### Backend Tests
```bash
cd <service-directory>
./mvnw test
```

### Frontend Tests
```bash
cd vite-project
npm run test
```

## 🚀 Deployment

### Docker (Optional)
Each service can be containerized using Docker:

```dockerfile
FROM openjdk:21-jdk-slim
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Production Build
```bash
# Frontend
cd vite-project
npm run build

# Backend services
cd <service-directory>
./mvnw clean package
```

## 👨‍💻 Author

**Ashutosh Kumar**
- GitHub: [@ashutosh-biotech](https://github.com/Ashutosh-biotech)
- LinkedIn: [Ashutosh Kumar](https://www.linkedin.com/in/ashutoshbiotech/)
- Email: ashutoshbiotech2020@gmail.com

---

⭐ **Star this repository if you find it helpful!**
