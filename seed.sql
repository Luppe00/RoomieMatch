-- Seed data for RoomieMatch

-- 1. Users
INSERT INTO users (first_name, last_name, age, email, bio, user_type, profile_image, gender) VALUES
('Alice', 'Anderson', 25, 'alice@example.com', 'Quiet student looking for a room.', 'NEEDS_ROOM', 'https://i.pravatar.cc/300?u=alice', 'Female'),
('Bob', 'Baker', 28, 'bob@example.com', 'Have a spare room in Nørrebro.', 'HAS_ROOM', 'https://i.pravatar.cc/300?u=bob', 'Male'),
('Charlie', 'Clark', 22, 'charlie@example.com', 'Social and outgoing, need a place.', 'NEEDS_ROOM', 'https://i.pravatar.cc/300?u=charlie', 'Male'),
('Diana', 'Dusk', 30, 'diana@example.com', 'Professional working in city center. Renting out room.', 'HAS_ROOM', 'https://i.pravatar.cc/300?u=diana', 'Female'),
('Eve', 'Evans', 24, 'eve@example.com', 'Looking for a shared apartment.', 'NEEDS_ROOM', 'https://i.pravatar.cc/300?u=eve', 'Female');

-- 2. Rooms
INSERT INTO rooms (user_id, title, location, rent, size_sqm, room_image, description, available_from) VALUES
((SELECT id FROM users WHERE email='bob@example.com'), 'Cosy Nørrebro Room', 'Nørrebro, København', 4500, 15, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c', 'Close to metro and parks.', '2025-01-01'),
((SELECT id FROM users WHERE email='diana@example.com'), 'Modern City Appt', 'Indre By, København', 6000, 20, 'https://images.unsplash.com/photo-1522771753033-6a586857f291', 'Big window, private bath.', '2025-02-01'),
((SELECT id FROM users WHERE email='bob@example.com'), 'Small Attic Room', 'Nørrebro, København', 3000, 10, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c', 'Very cheap but small.', '2025-01-15');

-- 3. Preferences
INSERT INTO preferences (user_id, max_rent, preferred_location, min_age_roomie, max_age_roomie, preferred_gender) VALUES
((SELECT id FROM users WHERE email='alice@example.com'), 5000, 'Nørrebro', 20, 30, 'Any'),
((SELECT id FROM users WHERE email='charlie@example.com'), 6500, 'Indre By', 18, 25, 'Female'),
((SELECT id FROM users WHERE email='eve@example.com'), 4000, 'Valby', 22, 28, 'Any');

-- 4. Swipes
-- Alice (NEEDS) swipes LIKE on Bob (HAS)
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='alice@example.com'), (SELECT id FROM users WHERE email='bob@example.com'), true);

-- Bob (HAS) swipes LIKE on Alice (NEEDS) -> This should lead to a match
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='bob@example.com'), (SELECT id FROM users WHERE email='alice@example.com'), true);

-- Charlie (NEEDS) swipes LIKE on Diana (HAS)
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='charlie@example.com'), (SELECT id FROM users WHERE email='diana@example.com'), true);

-- Diana (HAS) swipes DISLIKE on Charlie (NEEDS)
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='diana@example.com'), (SELECT id FROM users WHERE email='charlie@example.com'), false);

-- 5. Matches
-- Manually inserting the match between Alice and Bob to facilitate testing
-- Note: id of Alice < id of Bob because of insertion order.
INSERT INTO matches (user_a_id, user_b_id) VALUES
((SELECT id FROM users WHERE email='alice@example.com'), (SELECT id FROM users WHERE email='bob@example.com'));
