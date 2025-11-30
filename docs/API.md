# Erty API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "phone": "+244900000000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conta criada com sucesso",
  "data": {
    "user": { ... },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

### Accounts

#### List Accounts
```http
GET /accounts
Authorization: Bearer <token>
```

#### Create Account
```http
POST /accounts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Conta Corrente",
  "type": "checking",
  "currency": "AOA",
  "initialBalance": 10000,
  "institution": "BFA",
  "color": "#2196F3"
}
```

#### Update Account
```http
PATCH /accounts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nova Nome da Conta"
}
```

#### Delete Account
```http
DELETE /accounts/:id
Authorization: Bearer <token>
```

### Transactions

#### List Transactions
```http
GET /transactions?page=1&limit=50&type=expense&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `type` (string): expense | income | transfer
- `categoryId` (string): Filter by category
- `accountId` (string): Filter by account
- `startDate` (date): Start date (ISO 8601)
- `endDate` (date): End date (ISO 8601)

#### Create Transaction
```http
POST /transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId": "uuid",
  "categoryId": "uuid",
  "type": "expense",
  "amount": 5000,
  "currency": "AOA",
  "description": "Supermercado",
  "date": "2024-01-15T10:30:00Z",
  "paymentMethod": "debit_card",
  "tags": ["alimentação", "casa"]
}
```

#### Get Statistics
```http
GET /transactions/statistics?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "income": 50000,
      "expenses": 35000,
      "balance": 15000,
      "transactions": 45
    },
    "byCategory": [
      {
        "name": "Alimentação",
        "total": 12000,
        "count": 15,
        "percentage": "34.29"
      }
    ]
  }
}
```

### Budgets

#### List Budgets
```http
GET /budgets
Authorization: Bearer <token>
```

#### Create Budget
```http
POST /budgets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Orçamento de Alimentação",
  "categoryId": "uuid",
  "amount": 20000,
  "period": "monthly",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "alertThreshold": 80
}
```

#### Check Budget Alerts
```http
GET /budgets/alerts
Authorization: Bearer <token>
```

### Goals

#### List Goals
```http
GET /goals
Authorization: Bearer <token>
```

#### Create Goal
```http
POST /goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Comprar Carro",
  "description": "Juntar dinheiro para carro novo",
  "targetAmount": 3000000,
  "targetDate": "2025-12-31",
  "category": "car",
  "priority": "high"
}
```

#### Contribute to Goal
```http
POST /goals/:id/contribute
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50000
}
```

### Sync (Offline Support)

#### Sync Transactions
```http
POST /sync/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "transactions": [
    {
      "localId": "local-uuid-1",
      "accountId": "uuid",
      "categoryId": "uuid",
      "type": "expense",
      "amount": 2000,
      "date": "2024-01-15T10:00:00Z",
      "description": "Transporte"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "synced": [
      {
        "localId": "local-uuid-1",
        "serverId": "server-uuid-1",
        "syncedAt": "2024-01-15T11:00:00Z"
      }
    ],
    "conflicts": [],
    "errors": []
  }
}
```

#### Get Updates
```http
GET /sync/updates?lastSyncTime=2024-01-15T10:00:00Z
Authorization: Bearer <token>
```

### AI / FinAI

#### Get Recommendations
```http
GET /ai/recommendations
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "type": "budget_exceeded",
        "priority": "high",
        "title": "Orçamento de Alimentação excedido",
        "message": "Você gastou 120% do orçamento",
        "action": "Considere reduzir gastos nesta categoria"
      }
    ]
  }
}
```

#### Get Insights (Premium)
```http
GET /ai/insights?months=3
Authorization: Bearer <token>
```

#### Predict Expenses (Premium)
```http
GET /ai/predict?months=3
Authorization: Bearer <token>
```

#### Suggest Budget (Premium)
```http
GET /ai/suggest-budget
Authorization: Bearer <token>
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes
- API endpoints: 100 requests per 15 minutes
- Strict endpoints: 10 requests per hour

## Pagination

List endpoints support pagination:

```
GET /transactions?page=1&limit=50
```

Response includes pagination metadata:

```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "total": 250,
      "page": 1,
      "pages": 5
    }
  }
}
```
