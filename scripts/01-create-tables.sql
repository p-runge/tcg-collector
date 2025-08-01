-- Create tables for Pokemon card collection tracker (without auth)

-- Series (e.g., Base Set, Neo, E-Card, etc.)
CREATE TABLE IF NOT EXISTS series (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    release_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sets within series
CREATE TABLE IF NOT EXISTS sets (
    id SERIAL PRIMARY KEY,
    series_id INTEGER REFERENCES series(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    release_date DATE,
    total_cards INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Languages
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

-- Card variants (1st edition, unlimited, reverse holo, etc.)
CREATE TABLE IF NOT EXISTS variants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Card conditions/quality
CREATE TABLE IF NOT EXISTS conditions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    abbreviation VARCHAR(10),
    description TEXT
);

-- Cards in sets
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    set_id INTEGER REFERENCES sets(id),
    number VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    rarity VARCHAR(50),
    card_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(set_id, number)
);

-- User's owned cards (simplified without user auth)
CREATE TABLE IF NOT EXISTS user_cards (
    id SERIAL PRIMARY KEY,
    card_id INTEGER REFERENCES cards(id),
    language_id INTEGER REFERENCES languages(id),
    variant_id INTEGER REFERENCES variants(id),
    condition_id INTEGER REFERENCES conditions(id),
    quantity INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sets being actively collected (simplified without user auth)
CREATE TABLE IF NOT EXISTS collecting_sets (
    id SERIAL PRIMARY KEY,
    set_id INTEGER REFERENCES sets(id) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- App settings (simplified without user auth)
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default favorite language setting
INSERT INTO app_settings (setting_key, setting_value) VALUES ('favorite_language_id', '1') ON CONFLICT (setting_key) DO NOTHING;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_cards_card_id ON user_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_cards_set_id ON cards(set_id);
CREATE INDEX IF NOT EXISTS idx_sets_series_id ON sets(series_id);
