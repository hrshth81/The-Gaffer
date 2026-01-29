
/* 
  SQL Schema for The Gaffer - Productivity App
  Handles Users, Leagues, Fixtures, Submissions, and Stats
*/

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'PLAYER', -- MANAGER, PLAYER
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LEAGUES TABLE
CREATE TABLE leagues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    admin_id UUID REFERENCES users(id),
    season_start DATE,
    season_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LEAGUE MEMBERSHIP (Many-to-Many)
CREATE TABLE league_members (
    league_id UUID REFERENCES leagues(id),
    user_id UUID REFERENCES users(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (league_id, user_id)
);

-- FIXTURES (TASKS)
CREATE TABLE fixtures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    league_id UUID REFERENCES leagues(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    difficulty_stars INTEGER CHECK (difficulty_stars >= 1 AND difficulty_stars <= 5),
    matchweek INTEGER NOT NULL,
    is_common BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SUBMISSIONS (MATCH HIGHLIGHTS)
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fixture_id UUID REFERENCES fixtures(id),
    user_id UUID REFERENCES users(id),
    submission_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    content_url TEXT, -- URL to the uploaded solution
    rank INTEGER, -- Submission order within the league for Golden Boot
    points_earned INTEGER DEFAULT 0,
    is_late BOOLEAN DEFAULT FALSE,
    yellow_card BOOLEAN DEFAULT FALSE,
    UNIQUE(fixture_id, user_id)
);

-- WEEKLY STATS (LEAGUE TABLE LOGIC)
CREATE TABLE weekly_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    league_id UUID REFERENCES leagues(id),
    matchweek INTEGER NOT NULL,
    points_gained INTEGER DEFAULT 0,
    is_clean_sheet BOOLEAN DEFAULT FALSE,
    yellow_cards_count INTEGER DEFAULT 0,
    red_cards_count INTEGER DEFAULT 0
);
