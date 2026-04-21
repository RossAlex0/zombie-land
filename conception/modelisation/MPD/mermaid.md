### Link : https://mermaid.live/edit#pako:eNrFV11v2jAU_SuWX9pKtOKjIcBbFgyLSpMuhG6dkCyTGLBKEuQ43Tra_z4nJAzKV7Z1IzzZPr6-99xzr80CuqFHYQtS3mZkwok_DID8Bn1kg5eXy8twAT5Y1o1hdkELDKH8pev5XAJ5WQDH0G-Qs4HQdMe4N5yH3IquOahr2Q94tbCOzleLobPjMuxyhO9sQ0f41mobHUM6v45_s1R4n231UI5OGckXM6cts2N0B7bmGJYJFsvJ5DNMBzAP3N38mmoj3bjVerhSxlVAA8FJ4FI8plRaNC0HmINeLz82M4G68kSXzInLxPMe2L1m6x81GytlEAki4mgNJ8_saIOeA86IK9gTPVvf6Bi3CIRzGrBggqdhzKM9J6RAdxZGRYB9R7u9Ay6nRFAPEyGhuROm9fn8Yjc-nntH8K855Ss5HGY7p6VSLoOA-PtIdtAXB3g0cjmbCxYG2waqigLmzBUxp-9E-j-naFVKxSmakRGdrQcxMI1PA3Qy1_GeNKcVkfIqKwKnAUmbNuogG5k66q_kcc68CyBrso16yEHSbl_X2mh3fQk6CflOa7k7x639DjuraNPuUixJypaM_zJFKyfStlZcKWPGI4EPlNSmrIphkyKjPmFHJNiW6QAjxsUUJ4oqYHROouhbyL0jPZaHM5rkv_Mm_0mC0tyfrN3l12xhlRzoR7LXe7KH72lIciMXS5cORyut7IfljHoxJ0lDPQJjHo4jyreIT0R5WuKzF0Zh3jmVcTylMeMg9kcyqINaLpayJzJj3tke5kZh-CjzuUVeppnT8vfmUfXnV9FGA8jeUIp8QnHqxe4Bif1HleCDwabpEsx9pGLXHbM0Ufy-mnMm341-6LExo3yXxU1v3vnugiU44cyDLcFjWoI-5bJvyyFMgx5CMaU-HcLknewR_pjsS_bMSfA1DP18Gw_jyRS2xmQWydGS8Ozvx2qWy0ZDuR7GgYCtWrOZGoGtBfwOW5c19apyXa1UFbVcbzab6nUJPsvpekO9kgO1Vq-qjXpdbbyW4I_03OpVo6aUG81KQ6lfV9Wmqrz-BB4mkRg


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
        DECIMAL_10_2 entrance_fee "NOT NULL"
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
        TIMESTAMP expires_at  "NOT NULL"
        INTEGER user_id "NOT NULL"
    }