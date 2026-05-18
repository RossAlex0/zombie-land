# 🔐 Role-Based Access Control (RBAC)

## Rôles définis

| Rôle | Description |
|------|-------------|
| **Visitor** | Utilisateur non authentifié (visiteur du site) |
| **Customer** | Utilisateur connecté avec un compte client |
| **Admin** | Administrateur du parc avec accès complet |

## Légende

- ✅ Accès autorisé
- ❌ Accès refusé
- 🔒 Accès conditionné (propriétaire de la ressource uniquement)

---

## Authentification

| Route | Visitor | Customer | Admin |
|-------|--------|----------|-------|
| POST /api/auth/register | ✅ | ✅ | ✅ |
| POST /api/auth/login | ✅ | ✅ | ✅ |
| POST /api/auth/logout | ❌ | ✅ | ✅ |
| POST /api/auth/refresh | ❌ | ✅ | ✅ |
| POST /api/auth/forgot-password | ✅ | ✅ | ✅ |
| POST /api/auth/reset-password | ✅ | ✅ | ✅ |

## User

| Route | Visitor | Customer | Admin |
|-------|--------|----------|-------|
| GET /api/user | ❌ | ❌ | ✅ |
| GET /api/user/me | ❌ | ✅ | ✅ |
| GET /api/user/:id | ❌ | 🔒 | ✅ |
| PATCH /api/user/me | ❌ | ✅ | ✅ |
| PATCH /api/user/:id | ❌ | ❌ | ✅ |
| DELETE /api/user/:id | ❌ | ❌ | ✅ |

## Ticket

| Route | Visitor | Customer | Admin |
|-------|--------|----------|-------|
| GET /api/ticket | ❌ | ❌ | ✅ |
| GET /api/ticket/me | ❌ | ✅ | ✅ |
| GET /api/ticket/:id | ❌ | 🔒 | ✅ |
| POST /api/ticket | ❌ | ✅ | ✅ |
| PATCH /api/ticket/:id | ❌ | ❌ | ✅ |
| DELETE /api/ticket/:id | ❌ | ❌ | ✅ |

## Booking

| Route | Visitor | Customer | Admin |
|-------|--------|----------|-------|
| GET /api/booking | ❌ | ❌ | ✅ |
| GET /api/booking/me | ❌ | ✅ | ✅ |
| GET /api/booking/:id | ❌ | 🔒 | ✅ |
| POST /api/booking | ❌ | ✅ | ✅ |
| PATCH /api/booking/:id | ❌ | 🔒 | ✅ |
| DELETE /api/booking/:id | ❌ | ❌ | ✅ |

## Activity

| Route | Visitor | Customer | Admin |
|-------|--------|----------|-------|
| GET /api/activity | ✅ | ✅ | ✅ |
| GET /api/activity/:id | ✅ | ✅ | ✅ |
| POST /api/activity | ❌ | ❌ | ✅ |
| PATCH /api/activity/:id | ❌ | ❌ | ✅ |
| DELETE /api/activity/:id | ❌ | ❌ | ✅ |

## Category

| Route | Visitor | Customer | Admin |
|-------|--------|----------|-------|
| GET /api/category | ✅ | ✅ | ✅ |
| GET /api/category/:id | ✅ | ✅ | ✅ |
| POST /api/category | ❌ | ❌ | ✅ |
| PATCH /api/category/:id | ❌ | ❌ | ✅ |
| DELETE /api/category/:id | ❌ | ❌ | ✅ |

## Role

| Route | Visitor | Customer | Admin |
|-------|--------|----------|-------|
| GET /api/role | ❌ | ✅ | ✅ |
| GET /api/role/:id | ❌ | ✅ | ✅ |
| POST /api/role | ❌ | ❌ | ✅ |
| PATCH /api/role/:id | ❌ | ❌ | ✅ |
| DELETE /api/role/:id | ❌ | ❌ | ✅ |

## Price Modifier

| Route | Visitor | Customer | Admin |
|--------|-------|-------------|-------|
| GET  /api/price-modifier | ✅ | ✅ | ✅
| GET  /api/price-modifier/:id | ✅ | ✅ | ✅
| POST  /api/price-modifier | ❌ | ❌ | ✅
| PATCH  /api/price-modifier/:id | ❌ | ❌ | ✅
| DELETE  /api/price-modifier/:id | ❌ | ❌ | ✅

## Refresh Token

| Route | Visitor | Customer | Admin |
|--------|-------|-------------|-------|
| GET /api/refresh-token | ❌ | ✅ | ✅
| GET /api/refresh-token/:id | ❌ | ✅ | ✅
| POST /api/refresh-token | ❌ | ✅ | ✅
| DELETE /api/refresh-token/:id | ❌ | ✅ | ✅

## Configuration (singleton)

| Route | Visitor | Customer | Admin |
|-------|--------|----------|-------|
| GET /api/config | ✅ | ✅ | ✅ |
| PATCH /api/config | ❌ | ❌ | ✅ |
