```
MCD

https://www.mocodo.net/?mcd=eNpVUcGOgyAQvfMVfACH7dWb69IuaVY3apv0RKhOWxJFM-Bu9u8XoRobQhge897MPBKSrIv4nRX5XhxOZVqLIk90yygYh8o0IG8AjDZqVI12f4xap9xkGR1GMNrc5WOY0HqFNKvFWdSXQDaq96QWbIN6dHowjI66cRPCIkCytOaHorzIz7SSC5nRt5y-XJa0NT_od-oKHdnM4Kc4VbycH28arZPPFjrl4xhCr3TH6FWje8hWOQ-NytrfAb0gDh0EBfleFMdKltzH5-AGo7sdfbn7tuZUsgFDV4s1_kQnlZtNbMPZTqhmG7YUeeA594bzStYiO_I6FFrDfFuTRDihcxkEC_gT9KSZesDV0_iXcUVGcPe7FBmXX8WH2PMytL9BxBOK-eT1hcaKwe65cDs1YYx_gAOsVA==

```

```
https://www.mocodo.net/?mcd=eNpVkcFuwyAMhu88BQ_AYb3mlmU0RVXJlKaTekKMuCtSSiJDNu3tB6TpNiFkY8vfb5uCFI9D4q0auRX1qS070cjC9oyCC6idAXUBYNToSRsbvhn1QYfZMzpO4Kz7UNdxRh8JZdWJN9Gdc7HTt1jUgzdop2BHx-hkTZgRVgDZlUdGnyRd6_KjKjteN-2ZrE6mDfodBvKn49jz6cjblLxY9EEteoN-uHDTdmD03WK4ql6HGJq0918jRh6OA5BDueexg82GPjfNXsg6N5Cw5B7I2uu40WJQOqTF9Nn2M-o0Gqm55HFxd1onqj3voitXMFlCBU08BA_4mQuVm2-AvxITWgP3_1hOtStlzZc9vbai4urQvIit4G0OLVzyP0MXnbyzJNfPJon9AIEllLg=



```




```

:
:
:
:
:
:


:
CONFIGURATION:id, entrance_fee, capacity, status, opening_hours
:
ACTIVITY:id, name, description, picture, status
CATEGORY_HAS_ACTIVITY, 0N ACTIVITY, 0N CATEGORY
CATEGORY:id, label

:
:
:
:
:
:

USER:id,first_ name, last_name, email, birth_date, password, role
USER_BOOKS_RESERVATION, 11 RESERVATION, 0N USER
RESERVATION:id, status, start_at, end_at, duration
RESERVATION_GENERATES_TICKET, 11 TICKET, 1N RESERVATION
TICKET: id, reservation_numer, status, price
:


:
:
:
:
TICKET_HAS_PRICE_MODIFER, 0N PRICE_MODIFIER, 0N TICKET
PRICE_MODIFIER : id, label, reduction


```


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