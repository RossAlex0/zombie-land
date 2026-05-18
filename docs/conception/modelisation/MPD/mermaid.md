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
        SERIAL id PK
        DECIMAL_10_2 entry_price "NOT NULL"
        INTEGER capacity "NOT NULL"
        VARCHAR_50 status "NOT NULL DEFAULT 'active'"
        TIME opening_hours "NOT NULL"
        TIME closing_hours "NOT NULL"
        TIMESTAMP created_at "DEFAULT NOW()"
        TIMESTAMP updated_at "DEFAULT NOW()"
    }

    ACTIVITY {
        SERIAL id PK
        VARCHAR_100 name "NOT NULL"
        TEXT description
        VARCHAR_255 picture
        VARCHAR_50 status "NOT NULL DEFAULT 'active'"
        TIMESTAMP created_at "DEFAULT NOW()"
        TIMESTAMP updated_at "DEFAULT NOW()"
    }

    CATEGORY {
        SERIAL id PK
        VARCHAR_100 label "NOT NULL UNIQUE"
        TIMESTAMP created_at "DEFAULT NOW()"
        TIMESTAMP updated_at "DEFAULT NOW()"
    }

    CATEGORY_ACTIVITY {
        INTEGER activity_id PK "REFERENCES ACTIVITY(id) ON DELETE CASCADE"
        INTEGER category_id PK "REFERENCES CATEGORY(id) ON DELETE CASCADE"
        TIMESTAMP created_at "DEFAULT NOW()"
    }

    ROLE {
        SERIAL id PK
        VARCHAR_50 name "NOT NULL UNIQUE"
        TIMESTAMP created_at "DEFAULT NOW()"
    }

    USER {
        SERIAL id PK
        VARCHAR_100 first_name "NOT NULL"
        VARCHAR_100 last_name "NOT NULL"
        VARCHAR_255 email "NOT NULL UNIQUE"
        DATE birth_date "NOT NULL"
        VARCHAR_255 password "NOT NULL"
        INTEGER role_id FK "REFERENCES ROLE(id) NOT NULL DEFAUT 1"
        TIMESTAMP created_at "DEFAULT NOW()"
        TIMESTAMP updated_at "DEFAULT NOW()"
        INTEGER refresh_token_id FK "REFERENCES ROLE(id)"
    }

    BOOKING {
        SERIAL id PK
        VARCHAR_50 status "NOT NULL DEFAULT 'pending'"
        TIMESTAMP start_at "NOT NULL"
        TIMESTAMP end_at "NOT NULL"
        INTEGER duration "NOT NULL"
        INTEGER id_user FK "REFERENCES USER(id) NOT NULL"
        TIMESTAMP created_at "DEFAULT NOW()"
        TIMESTAMP updated_at "DEFAULT NOW()"
    }

    TICKET {
        SERIAL id PK
        VARCHAR_50 reservation_number "NOT NULL UNIQUE"
        VARCHAR_50 status "NOT NULL DEFAULT 'valid'"
        INTEGER booking_id FK "REFERENCES BOOKING(id) NOT NULL"
        TIMESTAMP validity_date  NOT NULL
        TIMESTAMP created_at "DEFAULT NOW()"
        TIMESTAMP updated_at "DEFAULT NOW()"
    }

    PRICE_MODIFIER {
        SERIAL id PK
        VARCHAR_100 label "NOT NULL"
        DECIMAL_5_2 reduction "NOT NULL"
        TIMESTAMP created_at "DEFAULT NOW()"
        TIMESTAMP updated_at "DEFAULT NOW()"
    }

    TICKET_PRICE_MODIFIER {
        INTEGER ticket_id PK "REFERENCES TICKET(id) ON DELETE CASCADE"
        INTEGER price_modifier_id PK "REFERENCES PRICE_MODIFIER(id) ON DELETE CASCADE"
        TIMESTAMP created_at "DEFAULT NOW()"
    }

    REFRESH_TOKEN {
        SERIAL id Pk
        TEXT token "NOT NULL"
        TIMESTAMP issued_at "NOT NULL DEFAULT NOW()"
        TIMESTAMP expired_at  "NOT NULL"
        INTEGER user_id "NOT NULL"
    }