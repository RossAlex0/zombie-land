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
        int id PK
        decimal entrance_fee
        int capacity
        string status
        string opening_hours
        string closing_hours
    }

    ACTIVITY {
        int id PK
        string name
        string description
        string picture
        string status
    }

    CATEGORY {
        int id PK
        string label
    }

    CATEGORY_ACTIVITY {
        int activity_id FK
        int category_id FK
    }

    USER {
        int id PK
        string first_name
        string last_name
        string email
        date birth_date
        string password
        string role_id FK
    }

    ROLE {
        int id PK
        string name
    }

    BOOKING {
        int id PK
        string status
        datetime start_at
        datetime end_at
        int duration
        int user_id FK
    }

    TICKET {
        int id PK
        string reservation_number
        string status
        int booking_id FK
    }

    PRICE_MODIFIER {
        int id PK
        string label
        decimal reduction
    }

    TICKET_PRICE_MODIFIER {
        int ticket_id FK
        int price_modifier_id FK
    }

    REFRESH_TOKEN {
        int id PK
        text token
        TIMESTAMP issued_at
        TIMESTAMP expired_at
        int user_id FK
    }
