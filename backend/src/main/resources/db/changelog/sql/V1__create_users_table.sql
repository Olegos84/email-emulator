CREATE TABLE users
(
    id         BIGSERIAL PRIMARY KEY,
    login      VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL
);