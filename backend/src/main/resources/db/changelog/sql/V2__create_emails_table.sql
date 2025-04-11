CREATE TABLE emails (
                        id BIGSERIAL PRIMARY KEY,
                        sender_id BIGSERIAL NOT NULL,
                        receiver_id BIGSERIAL NOT NULL,
                        subject VARCHAR(255),
                        body TEXT,
                        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        folder VARCHAR(50) DEFAULT 'INBOX',

                        CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                        CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);