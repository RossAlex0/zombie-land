erDiagram
USER ||--o{ BOOKING : ""
BOOKING ||--|{ TICKET : ""
ACTIVITY ||--o{ CATEGORY_ACTIVITY : ""
CATEGORY ||--o{ CATEGORY_ACTIVITY : ""
TICKET ||--o{ TICKET_PRICE_MODIFIER : ""
PRICE_MODIFIER ||--o{ TICKET_PRICE_MODIFIER : ""
ROLE ||--o{ USER : ""
REFRESH_TOKEN ||--o{ USER : ""

    CONFIGURATION {
        _ id PK
        _ entry_price
        _ capacity
        _ status
        _ opening_hours
        _ closing_hours
    }

    ACTIVITY {
        _ id PK
        _ name
        _ description
        _ picture
        _ status
    }

    CATEGORY {
        _ id PK
        _ label
    }

    CATEGORY_ACTIVITY {
        _ activity_id FK
        _ category_id FK
    }

    ROLE {
        _ id PK
        _ name
    }

    USER {
        _ id PK
        _ first_name
        _ last_name
        _ email
        _ birth_date
        _ password
        _ role_id FK
    }

    BOOKING {
        _ id PK
        _ status
        _ start_at
        _ end_at
        _ duration
        _ user_id FK
    }

    TICKET {
        _ id PK
        _ reservation_number
        _ status
        _ booking_id FK
    }

    PRICE_MODIFIER {
        _ id PK
        _ label
        _ reduction
    }

    TICKET_PRICE_MODIFIER {
        _ ticket_id FK
        _ price_modifier_id FK
    }

    REFRESH_TOKEN {
        _ id PK
        _ token
        _ issued_at
        _ expired_at
        _ user_id FK
    }
