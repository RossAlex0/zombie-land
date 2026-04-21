CREATE TABLE configuration (
    id              INTEGER         PRIMARY KEY DEFAULT 1,
    entrance_price    DECIMAL(10, 2)  NOT NULL,
    capacity        INTEGER         NOT NULL,
    status          VARCHAR(50)     NOT NULL DEFAULT 'active',
    opening_hours   TIME            NOT NULL,
    closing_hours   TIME            NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE role (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50)     NOT NULL UNIQUE,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

INSERT INTO role (id, name) VALUES
    (1, 'customer'),
    (2, 'admin');

CREATE TABLE "user" (
    id          SERIAL PRIMARY KEY,
    first_name  VARCHAR(100)    NOT NULL,
    last_name   VARCHAR(100)    NOT NULL,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    valid_email BOOLEAN         DEFAULT FALSE,
    birth_date  DATE,
    password    VARCHAR(255)    NOT NULL,
    role_id     INTEGER         NOT NULL DEFAULT 1,
    password_changed_at     TIMESTAMP,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE RESTRICT
);

CREATE TABLE activity (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    description TEXT,
    picture     VARCHAR(255),
    status      VARCHAR(50)     NOT NULL DEFAULT 'active',
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE TABLE category (
    id          SERIAL PRIMARY KEY,
    label       VARCHAR(100)    NOT NULL UNIQUE,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);


CREATE TABLE category_activity (
    activity_id INTEGER     NOT NULL,
    category_id INTEGER     NOT NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (activity_id, category_id),
    CONSTRAINT fk_ca_activity FOREIGN KEY (activity_id) REFERENCES activity(id) ON DELETE CASCADE,
    CONSTRAINT fk_ca_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);


CREATE TABLE booking (
    id          SERIAL PRIMARY KEY,
    status      VARCHAR(50)     NOT NULL DEFAULT 'pending',
    start_at    TIMESTAMP       NOT NULL,
    end_at      TIMESTAMP       NOT NULL,
    duration    INTEGER         NOT NULL,
    user_id     INTEGER         NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    -- Contraintes pour que 'end_at' ne soit pas inférieur à 'start_date'
    CONSTRAINT chk_booking_dates CHECK (end_at > start_at) 
);

CREATE TABLE ticket (
    id                  SERIAL PRIMARY KEY,
    reservation_number  VARCHAR(50)     NOT NULL UNIQUE,
    status              VARCHAR(50)     NOT NULL DEFAULT 'valid',
    validity_date       TIMESTAMP       NOT NULL,
    booking_id          INTEGER         NOT NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_ticket_booking FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
);


CREATE TABLE price_modifier (
    id          SERIAL PRIMARY KEY,
    label       VARCHAR(100)    NOT NULL,
    -- On vérifie que reduction n'est pas sépérieur à 100 - réduction est un pourcentage
    reduction   INT   NOT NULL DEFAULT 0 CHECK (reduction >= 0 AND reduction <= 100),
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
);

CREATE TABLE ticket_price_modifier (
    ticket_id           INTEGER     NOT NULL,
    price_modifier_id   INTEGER     NOT NULL,
    created_at          TIMESTAMP   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (ticket_id, price_modifier_id),
    CONSTRAINT fk_tpm_ticket FOREIGN KEY (ticket_id) REFERENCES ticket(id) ON DELETE CASCADE,
    CONSTRAINT fk_tpm_price_modifier FOREIGN KEY (price_modifier_id) REFERENCES price_modifier(id) ON DELETE CASCADE
);

CREATE TABLE refresh_token (
    id SERIAL           PRIMARY KEY,
    token TEXT          NOT NULL,
    issued_at           TIMESTAMP   NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMP   NOT NULL,
    user_id INTEGER     NOT NULL,
    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
)