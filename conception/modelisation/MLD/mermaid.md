erDiagram
    USER ||--o{ BOOKING : ""
    BOOKING ||--|{ TICKET : ""
    ACTIVITY ||--o{ CATEGORY_ACTIVITY : ""
    CATEGORY ||--o{ CATEGORY_ACTIVITY : ""
    TICKET ||--o{ TICKET_PRICE_MODIFIER : ""
    PRICE_MODIFIER ||--o{ TICKET_PRICE_MODIFIER : ""

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
        int id_activity FK
        int id_category FK
    }

    USER {
        int id PK
        string first_name
        string last_name
        string email
        date birth_date
        string password
        string role
    }

    BOOKING {
        int id PK
        string status
        datetime start_at
        datetime end_at
        int duration
        int id_user FK
    }

    TICKET {
        int id PK
        string reservation_number
        string status
        int id_booking FK
    }

    PRICE_MODIFIER {
        int id PK
        string label
        decimal reduction
    }

    TICKET_PRICE_MODIFIER {
        int id_ticket FK
        int id_price_modifier FK
    }