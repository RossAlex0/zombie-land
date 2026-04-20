# Documentation des routes API

## Authentification

| Method | Route | Accès |
|--------|-------|-------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Authentifié |
| POST | /api/auth/refresh | Authentifié |
| POST | /api/auth/forgot-password | Public |
| POST | /api/auth/reset-password | Public |

## Utilisateurs

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/users | Admin |
| GET | /api/users/:id | Admin |
| GET | /api/users/me | Authentifié |
| PUT | /api/users/me | Authentifié |
| PUT | /api/users/:id | Admin |
| DELETE | /api/users/:id | Admin |

## Billets (Ticket Types)

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/tickets | Public |
| GET | /api/tickets/:id | Public |
| POST | /api/tickets | Admin |
| PUT | /api/tickets/:id | Admin |
| DELETE | /api/tickets/:id | Admin |

## Disponibilités (Billets par jour)

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/availability | Public |
| GET | /api/availability/:date | Public |
| POST | /api/availability | Admin |
| PUT | /api/availability/:id | Admin |

## Réservations

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/bookings | Admin |
| GET | /api/bookings/me | Authentifié |
| GET | /api/bookings/:id | Authentifié (propriétaire ou Admin) |
| POST | /api/bookings | Authentifié |
| PUT | /api/bookings/:id/cancel | Authentifié (propriétaire ou Admin) |
| DELETE | /api/bookings/:id | Admin |

## Activities

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/activity | Public |
| GET | /api/activity/:id | Public |
| POST | /api/activity | Authentifié |
| PUT | /api/activity/:id/cancel | Authentifié (propriétaire ou Admin) |
| DELETE | /api/activity/:id | Admin |


## Catégories

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/category | Public |
| GET | /api/category/:id | Public |
| POST | /api/category | Authentifié |
| PUT | /api/activity/:id/cancel | Authentifié (propriétaire ou Admin) |
| DELETE | /api/activity/:id | Admin |

## Configuration ( singleton ) ====> A voir ??? <====

| Method | Route | Accès |
|--------|-------|-------|
| GET | /api/config | Admin |
| POST | /api/config | Admin |
| PATCH | /api/config/:id/cancel | Admin|