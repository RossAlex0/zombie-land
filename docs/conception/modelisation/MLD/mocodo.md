

```
MLD

Mermaid : https://mermaid.live/edit#pako:eNqVVG1v2jAQ_iuWP1MUSsJCvjEKKEIrFUsndUKyTHKARRJHF6dbB_z3OjSEl0CbOR8c33N-7vH5zhvqywCoQwEfBF8ij2Yx0eP552BKttu7O7kh3yeTsfs4Ig6ZUf3t8YMtd9luiOf2xwPvzKPX99xfrvdyYOn3vMFoMn1hJXDqfUDreRfhCt-PFXuauv0B-zF5cIeuFn_qfwHV2lfomjwO3dHztOe5k0ey-TDmQ8SKiIA8jY-mAHwR8ZBArJDHPrAFwPkGnyfcF-rtaE0VinipJ66ytGKWCcR6ZiuZYYHuDsrKxHwuqmCKeQQVYwCpjyJRQsYVLBG-yhA-VVpqKW-vlpaQzyG8wcBuH4txX4lXnT0yHFcwnytYSjxiJfO-kmvpWghMFbuaqZDfQiDiIjypAa2DzAWqFct_q2nlafpHYlABUIZwofzQY7XEX1ZQHl2JCHIAFePqCgRxcAbk7EGG_LwgigxnKWA1u0Un1pKIoCle9-wszqI54JenKGLPpVzncCX8Re_-b_mddi1CkPnHk1-ckH0ViSnhr0Fdq80EhX4MIhmIhTjNIW3QJYqAOgozaNAIUNeSXtI9-YyqFeiCo_mDFHBc549Svifh8W8po8M2lNlyRZ0FD1O9ypL8dounvHTRFw3Yl1msqNP61t5zUGdD_1KnbZpNs2O37rtWp2MYZoO-UcdqN1sd0zAsu2V025ZtWbsG_bcPajTtjm3brXbXtM2W3TXvd-88Y9Ub


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


```