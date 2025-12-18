-- Seed data for RoomieMatch with 20 Users

-- 1. Users
-- 10 Landlords (HAS_ROOM)
-- 10 Seekers (NEEDS_ROOM)

INSERT INTO users (first_name, last_name, age, email, bio, user_type, profile_image, gender) VALUES
-- HAS_ROOM Users
('Bob', 'Baker', 28, 'bob@example.com', 'Have a spare room in Nørrebro.', 'HAS_ROOM', 'https://randomuser.me/api/portraits/men/1.jpg', 'Male'),
('Diana', 'Dusk', 30, 'diana@example.com', 'Professional working in city center. Renting out room.', 'HAS_ROOM', 'https://randomuser.me/api/portraits/women/2.jpg', 'Female'),
('Frank', 'Fisher', 35, 'frank@example.com', 'Quiet IT professional. Looking for a tidy roommate.', 'HAS_ROOM', 'https://randomuser.me/api/portraits/men/3.jpg', 'Male'),
('Hannah', 'Hunt', 29, 'hannah@example.com', 'Artist with a sunny room in Vesterbro.', 'HAS_ROOM', 'https://randomuser.me/api/portraits/women/4.jpg', 'Female'),
('Jack', 'Jones', 40, 'jack@example.com', 'Traveling consultant, rarely home. Room available.', 'HAS_ROOM', 'https://randomuser.me/api/portraits/men/5.jpg', 'Male'),
('Linda', 'Lane', 32, 'linda@example.com', 'Nurse with shift work. Need someone quiet during day.', 'HAS_ROOM', 'https://randomuser.me/api/portraits/women/6.jpg', 'Female'),
('Noah', 'Nolan', 26, 'noah@example.com', 'Student apartment share in Amager.', 'HAS_ROOM', 'https://randomuser.me/api/portraits/men/7.jpg', 'Male'),
('Patricia', 'Price', 50, 'patricia@example.com', 'Empty nester renting out a room in Østerbro villa.', 'HAS_ROOM', 'https://randomuser.me/api/portraits/women/8.jpg', 'Female'),
('Robert', 'Ross', 31, 'robert@example.com', 'Musician. Room available in creative collective.', 'HAS_ROOM', 'https://randomuser.me/api/portraits/men/9.jpg', 'Male'),
('Tina', 'Turner', 27, 'tina@example.com', 'Modern apartment in Nordhavn. Looking for roomie.', 'HAS_ROOM', 'https://randomuser.me/api/portraits/women/10.jpg', 'Female'),

-- NEEDS_ROOM Users
('Alice', 'Anderson', 25, 'alice@example.com', 'Quiet student looking for a room.', 'NEEDS_ROOM', 'https://randomuser.me/api/portraits/women/11.jpg', 'Female'),
('Charlie', 'Clark', 22, 'charlie@example.com', 'Social and outgoing, need a place.', 'NEEDS_ROOM', 'https://randomuser.me/api/portraits/men/12.jpg', 'Male'),
('Eve', 'Evans', 24, 'eve@example.com', 'Looking for a shared apartment.', 'NEEDS_ROOM', 'https://randomuser.me/api/portraits/women/13.jpg', 'Female'),
('George', 'Grey', 23, 'george@example.com', 'New to the city. Working in finance.', 'NEEDS_ROOM', 'https://randomuser.me/api/portraits/men/14.jpg', 'Male'),
('Ivy', 'Irwin', 21, 'ivy@example.com', 'Design student. Love plants and coffee.', 'NEEDS_ROOM', 'https://randomuser.me/api/portraits/women/15.jpg', 'Female'),
('Kevin', 'King', 28, 'kevin@example.com', 'Chef. I cook great meals for my roomies!', 'NEEDS_ROOM', 'https://randomuser.me/api/portraits/men/16.jpg', 'Male'),
('Mia', 'Moore', 25, 'mia@example.com', 'Looking for a room near university.', 'NEEDS_ROOM', 'https://randomuser.me/api/portraits/women/17.jpg', 'Female'),
('Oscar', 'Owens', 29, 'oscar@example.com', 'Freelance developer. Need good wifi.', 'NEEDS_ROOM', 'https://randomuser.me/api/portraits/men/18.jpg', 'Male'),
('Sarah', 'Scott', 26, 'sarah@example.com', 'Teacher. Early bird.', 'NEEDS_ROOM', 'https://randomuser.me/api/portraits/women/19.jpg', 'Female'),
('Victor', 'Vance', 30, 'victor@example.com', 'PhD student. Quiet and respectful.', 'NEEDS_ROOM', 'https://randomuser.me/api/portraits/men/20.jpg', 'Male');

-- 2. Rooms (One for each HAS_ROOM user)
INSERT INTO rooms (user_id, title, location, rent, size_sqm, room_image, description, available_from) VALUES
((SELECT id FROM users WHERE email='bob@example.com'), 'Cosy Nørrebro Room', 'Nørrebro', 4500, 15, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c', 'Close to metro and parks.', '2025-01-01'),
((SELECT id FROM users WHERE email='diana@example.com'), 'Modern City Appt', 'Indre By', 6000, 20, 'https://images.unsplash.com/photo-1522771753033-6a586857f291', 'Big window, private bath.', '2025-02-01'),
((SELECT id FROM users WHERE email='frank@example.com'), 'Quiet Room in Valby', 'Valby', 4000, 12, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c', 'Detailed tech setup included.', '2025-01-15'),
((SELECT id FROM users WHERE email='hannah@example.com'), 'Sunny Vesterbro Studio', 'Vesterbro', 5500, 18, 'https://images.unsplash.com/photo-1522771753033-6a586857f291', 'Artistic vibe.', '2025-03-01'),
((SELECT id FROM users WHERE email='jack@example.com'), 'Penthouse Room', 'Ørestad', 7000, 25, 'https://images.unsplash.com/photo-1522771753033-6a586857f291', 'Luxury building with gym.', '2025-01-10'),
((SELECT id FROM users WHERE email='linda@example.com'), 'Cozy Corner', 'Frederiksberg', 4800, 14, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c', 'Quiet area.', '2025-02-15'),
((SELECT id FROM users WHERE email='noah@example.com'), 'Student Dorm Share', 'Amager', 3500, 10, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c', 'Fun environment.', '2025-01-20'),
((SELECT id FROM users WHERE email='patricia@example.com'), 'Garden Room', 'Østerbro', 5000, 16, 'https://images.unsplash.com/photo-1522771753033-6a586857f291', 'Access to garden.', '2025-04-01'),
((SELECT id FROM users WHERE email='robert@example.com'), 'Music Den', 'Nørrebro', 4200, 15, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c', 'Soundproofed.', '2025-01-05'),
((SELECT id FROM users WHERE email='tina@example.com'), 'Harbor View', 'Nordhavn', 6500, 22, 'https://images.unsplash.com/photo-1522771753033-6a586857f291', 'Water view.', '2025-03-15');

-- 3. Preferences (One for each NEEDS_ROOM user)
INSERT INTO preferences (user_id, max_rent, preferred_location, min_age_roomie, max_age_roomie, preferred_gender) VALUES
((SELECT id FROM users WHERE email='alice@example.com'), 5000, 'Nørrebro', 20, 30, 'Any'),
((SELECT id FROM users WHERE email='charlie@example.com'), 6500, 'Indre By', 18, 25, 'Female'),
((SELECT id FROM users WHERE email='eve@example.com'), 4000, 'Valby', 22, 28, 'Any'),
((SELECT id FROM users WHERE email='george@example.com'), 8000, 'Ørestad', 25, 35, 'Male'),
((SELECT id FROM users WHERE email='ivy@example.com'), 5500, 'Vesterbro', 20, 30, 'Female'),
((SELECT id FROM users WHERE email='kevin@example.com'), 6000, 'Any', 25, 40, 'Any'),
((SELECT id FROM users WHERE email='mia@example.com'), 4500, 'Amager', 20, 26, 'Female'),
((SELECT id FROM users WHERE email='oscar@example.com'), 7000, 'Any', 22, 35, 'Male'),
((SELECT id FROM users WHERE email='sarah@example.com'), 5200, 'Frederiksberg', 24, 30, 'Any'),
((SELECT id FROM users WHERE email='victor@example.com'), 9000, 'Indre By', 28, 40, 'Male');

-- 4. Swipes & Matches
-- Match 1: Alice (NEEDS) <-> Bob (HAS)
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='alice@example.com'), (SELECT id FROM users WHERE email='bob@example.com'), true),
((SELECT id FROM users WHERE email='bob@example.com'), (SELECT id FROM users WHERE email='alice@example.com'), true);

INSERT INTO matches (user_a_id, user_b_id) VALUES
(
    (SELECT LEAST(id, (SELECT id FROM users WHERE email='bob@example.com')) FROM users WHERE email='alice@example.com'),
    (SELECT GREATEST(id, (SELECT id FROM users WHERE email='bob@example.com')) FROM users WHERE email='alice@example.com')
);

-- Match 2: Charlie (NEEDS) <-> Diana (HAS)
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='charlie@example.com'), (SELECT id FROM users WHERE email='diana@example.com'), true),
((SELECT id FROM users WHERE email='diana@example.com'), (SELECT id FROM users WHERE email='charlie@example.com'), true);

INSERT INTO matches (user_a_id, user_b_id) VALUES
(
    (SELECT LEAST(id, (SELECT id FROM users WHERE email='diana@example.com')) FROM users WHERE email='charlie@example.com'),
    (SELECT GREATEST(id, (SELECT id FROM users WHERE email='diana@example.com')) FROM users WHERE email='charlie@example.com')
);

-- Match 3: Eve (NEEDS) <-> Frank (HAS)
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='eve@example.com'), (SELECT id FROM users WHERE email='frank@example.com'), true),
((SELECT id FROM users WHERE email='frank@example.com'), (SELECT id FROM users WHERE email='eve@example.com'), true);

INSERT INTO matches (user_a_id, user_b_id) VALUES
(
    (SELECT LEAST(id, (SELECT id FROM users WHERE email='frank@example.com')) FROM users WHERE email='eve@example.com'),
    (SELECT GREATEST(id, (SELECT id FROM users WHERE email='frank@example.com')) FROM users WHERE email='eve@example.com')
);

-- Match 4: Kevin (NEEDS) <-> Tina (HAS)
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='kevin@example.com'), (SELECT id FROM users WHERE email='tina@example.com'), true),
((SELECT id FROM users WHERE email='tina@example.com'), (SELECT id FROM users WHERE email='kevin@example.com'), true);

INSERT INTO matches (user_a_id, user_b_id) VALUES
(
    (SELECT LEAST(id, (SELECT id FROM users WHERE email='tina@example.com')) FROM users WHERE email='kevin@example.com'),
    (SELECT GREATEST(id, (SELECT id FROM users WHERE email='tina@example.com')) FROM users WHERE email='kevin@example.com')
);

-- Match 5: Oscar (NEEDS) <-> Jack (HAS)
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='oscar@example.com'), (SELECT id FROM users WHERE email='jack@example.com'), true),
((SELECT id FROM users WHERE email='jack@example.com'), (SELECT id FROM users WHERE email='oscar@example.com'), true);

INSERT INTO matches (user_a_id, user_b_id) VALUES
(
    (SELECT LEAST(id, (SELECT id FROM users WHERE email='jack@example.com')) FROM users WHERE email='oscar@example.com'),
    (SELECT GREATEST(id, (SELECT id FROM users WHERE email='jack@example.com')) FROM users WHERE email='oscar@example.com')
);

-- One-way Likes (Pending)
-- Ivy likes Hannah (No match)
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='ivy@example.com'), (SELECT id FROM users WHERE email='hannah@example.com'), true);

-- George likes Robert (No match)
INSERT INTO swipes (swiper_user_id, target_user_id, liked) VALUES
((SELECT id FROM users WHERE email='george@example.com'), (SELECT id FROM users WHERE email='robert@example.com'), true);
