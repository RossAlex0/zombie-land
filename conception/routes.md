# 🚗 Documentation des routes API

## Authentification

| Method | Route | Accès |
|--------|-------|-------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Authentifié |
| POST | /api/auth/refresh | Authentifié |
| POST | /api/auth/forgot-password | Public |
| POST | /api/auth/reset-password | Public |

## User

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/user | Admin |
| GET | /api/user/:id | Admin |
| GET | /api/user/me | Authentifié |
| PATCH | /api/user/me | Authentifié |
| PATCH | /api/user/:id | Admin |
| DELETE | /api/user/:id | Admin |

## Ticket

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/ticket | Public |
| GET | /api/ticket/:id | Public |
| GET | /api/ticket/me | Authentifié |
| POST | /api/ticket | Authentifié |
| PATCH | /api/ticket/:id | Admin |
| DELETE | /api/ticket/:id | Admin |


## Booking

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/booking | Admin |
| GET | /api/booking/me | Authentifié |
| GET | /api/booking/:id | Authentifié |
| POST | /api/booking | Authentifié |
| PATCH | /api/booking/:id | Authentifié (propriétaire) |
| DELETE | /api/booking/:id | Admin |

## Activity

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/activity | Public |
| GET | /api/activity/:id | Public |
| POST | /api/activity | Admin |
| PATCH | /api/activity/:id | Admin |
| DELETE | /api/activity/:id | Admin |


## Catégory

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/category | Public |
| GET | /api/category/:id | Public |
| POST | /api/category | Admin |
| PATCH | /api/category/:id | Admin |
| DELETE | /api/activity/:id | Admin |

## Role

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/role | Authentifié |
| GET | /api/role/:id | Authentifié |
| POST | /api/role | Admin |
| PATCH | /api/role/:id | Admin |
| DELETE | /api/role/:id | Admin |

## Configuration ( singleton ) 

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/config | Public |
| POST | /api/config | Admin |
| PATCH | /api/config/:id | Admin|