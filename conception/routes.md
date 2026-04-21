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
| GET | /api/users | Admin |
| GET | /api/users/:id | Admin |
| GET | /api/users/me | Authentifié |
| PATCH | /api/users/me | Authentifié |
| PATCH | /api/users/:id | Admin |
| DELETE | /api/users/:id | Admin |

## Ticket

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/tickets | Public |
| GET | /api/tickets/:id | Public |
| GET | /api/tickets/me | Authentifié |
| POST | /api/tickets | Authentifié |
| PATCH | /api/tickets/:id | Admin |
| DELETE | /api/tickets/:id | Admin |


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

## Configuration ( singleton ) 

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/config | Public |
| POST | /api/config | Admin |
| PATCH | /api/config/:id | Admin|