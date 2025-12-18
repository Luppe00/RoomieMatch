--
-- PostgreSQL database dump
--

\restrict N7gkFApGuhkGI6H3R855QzpjVNAcMFcBuGTbTVl9zeaY2YDqUUgAYxQ68PYxZoX

-- Dumped from database version 17.6 (Postgres.app)
-- Dumped by pg_dump version 17.6 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matches (
    id integer NOT NULL,
    user_a_id integer NOT NULL,
    user_b_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT check_ordered_pair CHECK ((user_a_id < user_b_id))
);


ALTER TABLE public.matches OWNER TO postgres;

--
-- Name: matches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matches_id_seq OWNER TO postgres;

--
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;


--
-- Name: preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preferences (
    id integer NOT NULL,
    user_id integer NOT NULL,
    max_rent numeric,
    preferred_location text,
    preferred_gender text,
    min_age_roomie integer,
    max_age_roomie integer,
    CONSTRAINT preferences_preferred_gender_check CHECK ((preferred_gender = ANY (ARRAY['Male'::text, 'Female'::text, 'Other'::text, 'Any'::text])))
);


ALTER TABLE public.preferences OWNER TO postgres;

--
-- Name: preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.preferences_id_seq OWNER TO postgres;

--
-- Name: preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.preferences_id_seq OWNED BY public.preferences.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title text NOT NULL,
    location text NOT NULL,
    rent numeric NOT NULL,
    size_sqm integer,
    room_image text,
    description text,
    available_from date
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rooms_id_seq OWNER TO postgres;

--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: swipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swipes (
    id integer NOT NULL,
    swiper_user_id integer NOT NULL,
    target_user_id integer NOT NULL,
    liked boolean NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.swipes OWNER TO postgres;

--
-- Name: swipes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.swipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.swipes_id_seq OWNER TO postgres;

--
-- Name: swipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.swipes_id_seq OWNED BY public.swipes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    age integer NOT NULL,
    gender text NOT NULL,
    email text NOT NULL,
    profile_image text,
    bio text,
    user_type text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_gender_check CHECK ((gender = ANY (ARRAY['Male'::text, 'Female'::text, 'Other'::text]))),
    CONSTRAINT users_user_type_check CHECK ((user_type = ANY (ARRAY['HAS_ROOM'::text, 'NEEDS_ROOM'::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: matches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);


--
-- Name: preferences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preferences ALTER COLUMN id SET DEFAULT nextval('public.preferences_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: swipes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swipes ALTER COLUMN id SET DEFAULT nextval('public.swipes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.matches (id, user_a_id, user_b_id, created_at) FROM stdin;
1	1	11	2025-12-18 13:00:36.056974
2	2	12	2025-12-18 13:00:36.056974
3	3	13	2025-12-18 13:00:36.056974
4	10	16	2025-12-18 13:00:36.056974
5	5	18	2025-12-18 13:00:36.056974
7	1	19	2025-12-18 13:13:07.961698
8	21	22	2025-12-18 13:18:40.732128
\.


--
-- Data for Name: preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preferences (id, user_id, max_rent, preferred_location, preferred_gender, min_age_roomie, max_age_roomie) FROM stdin;
1	11	5000	Nørrebro	Any	20	30
2	12	6500	Indre By	Female	18	25
3	13	4000	Valby	Any	22	28
4	14	8000	Ørestad	Male	25	35
5	15	5500	Vesterbro	Female	20	30
6	16	6000	Any	Any	25	40
7	17	4500	Amager	Female	20	26
8	18	7000	Any	Male	22	35
9	19	5200	Frederiksberg	Any	24	30
10	20	9000	Indre By	Male	28	40
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, user_id, title, location, rent, size_sqm, room_image, description, available_from) FROM stdin;
1	1	Cosy Nørrebro Room	Nørrebro	4500	15	https://images.unsplash.com/photo-1598928506311-c55ded91a20c	Close to metro and parks.	2025-01-01
2	2	Modern City Appt	Indre By	6000	20	https://images.unsplash.com/photo-1522771753033-6a586857f291	Big window, private bath.	2025-02-01
3	3	Quiet Room in Valby	Valby	4000	12	https://images.unsplash.com/photo-1598928506311-c55ded91a20c	Detailed tech setup included.	2025-01-15
4	4	Sunny Vesterbro Studio	Vesterbro	5500	18	https://images.unsplash.com/photo-1522771753033-6a586857f291	Artistic vibe.	2025-03-01
5	5	Penthouse Room	Ørestad	7000	25	https://images.unsplash.com/photo-1522771753033-6a586857f291	Luxury building with gym.	2025-01-10
6	6	Cozy Corner	Frederiksberg	4800	14	https://images.unsplash.com/photo-1598928506311-c55ded91a20c	Quiet area.	2025-02-15
7	7	Student Dorm Share	Amager	3500	10	https://images.unsplash.com/photo-1598928506311-c55ded91a20c	Fun environment.	2025-01-20
8	8	Garden Room	Østerbro	5000	16	https://images.unsplash.com/photo-1522771753033-6a586857f291	Access to garden.	2025-04-01
9	9	Music Den	Nørrebro	4200	15	https://images.unsplash.com/photo-1598928506311-c55ded91a20c	Soundproofed.	2025-01-05
10	10	Harbor View	Nordhavn	6500	22	https://images.unsplash.com/photo-1522771753033-6a586857f291	Water view.	2025-03-15
\.


--
-- Data for Name: swipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swipes (id, swiper_user_id, target_user_id, liked, created_at) FROM stdin;
1	11	1	t	2025-12-18 13:00:36.056974
3	12	2	t	2025-12-18 13:00:36.056974
4	2	12	t	2025-12-18 13:00:36.056974
5	13	3	t	2025-12-18 13:00:36.056974
6	3	13	t	2025-12-18 13:00:36.056974
7	16	10	t	2025-12-18 13:00:36.056974
8	10	16	t	2025-12-18 13:00:36.056974
9	18	5	t	2025-12-18 13:00:36.056974
10	5	18	t	2025-12-18 13:00:36.056974
11	15	4	t	2025-12-18 13:00:36.056974
12	14	9	t	2025-12-18 13:00:36.056974
13	19	1	t	2025-12-18 13:12:37.228528
14	19	2	t	2025-12-18 13:12:37.698608
15	19	3	t	2025-12-18 13:12:38.091906
16	19	4	t	2025-12-18 13:12:38.271266
17	19	5	t	2025-12-18 13:12:38.441994
18	19	6	t	2025-12-18 13:12:38.601535
19	19	7	t	2025-12-18 13:12:38.766455
20	19	8	t	2025-12-18 13:12:38.931869
21	19	9	t	2025-12-18 13:12:39.096604
22	19	10	t	2025-12-18 13:12:39.27657
23	1	20	t	2025-12-18 13:13:05.342373
2	1	11	t	2025-12-18 13:13:05.509725
25	1	17	t	2025-12-18 13:13:05.665255
26	1	12	t	2025-12-18 13:13:07.297174
27	1	18	t	2025-12-18 13:13:07.477395
28	1	15	t	2025-12-18 13:13:07.645008
29	1	13	t	2025-12-18 13:13:07.814787
30	1	19	t	2025-12-18 13:13:07.957761
31	1	16	t	2025-12-18 13:13:08.114357
32	1	14	t	2025-12-18 13:13:09.492933
42	21	14	t	2025-12-18 13:14:35.6571
51	22	1	t	2025-12-18 13:17:51.150366
52	22	2	t	2025-12-18 13:17:52.63836
53	22	3	t	2025-12-18 13:17:53.696977
54	22	4	t	2025-12-18 13:17:54.361557
55	22	5	t	2025-12-18 13:17:56.458108
56	22	6	t	2025-12-18 13:17:57.615142
57	22	7	t	2025-12-18 13:17:59.042362
58	22	8	t	2025-12-18 13:17:59.743342
59	22	9	t	2025-12-18 13:18:00.295558
60	22	10	t	2025-12-18 13:18:00.810218
61	22	21	t	2025-12-18 13:18:01.301434
33	21	20	t	2025-12-18 13:18:33.734363
34	21	11	t	2025-12-18 13:18:34.735299
35	21	17	t	2025-12-18 13:18:35.372486
36	21	12	t	2025-12-18 13:18:35.856707
37	21	18	t	2025-12-18 13:18:36.635285
38	21	15	t	2025-12-18 13:18:37.088506
39	21	13	t	2025-12-18 13:18:37.59508
40	21	19	t	2025-12-18 13:18:38.12886
41	21	16	t	2025-12-18 13:18:38.635438
71	21	22	t	2025-12-18 13:18:40.728882
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, age, gender, email, profile_image, bio, user_type, created_at) FROM stdin;
1	Bob	Baker	28	Male	bob@example.com	https://randomuser.me/api/portraits/men/1.jpg	Have a spare room in Nørrebro.	HAS_ROOM	2025-12-18 13:00:36.056974
2	Diana	Dusk	30	Female	diana@example.com	https://randomuser.me/api/portraits/women/2.jpg	Professional working in city center. Renting out room.	HAS_ROOM	2025-12-18 13:00:36.056974
3	Frank	Fisher	35	Male	frank@example.com	https://randomuser.me/api/portraits/men/3.jpg	Quiet IT professional. Looking for a tidy roommate.	HAS_ROOM	2025-12-18 13:00:36.056974
4	Hannah	Hunt	29	Female	hannah@example.com	https://randomuser.me/api/portraits/women/4.jpg	Artist with a sunny room in Vesterbro.	HAS_ROOM	2025-12-18 13:00:36.056974
5	Jack	Jones	40	Male	jack@example.com	https://randomuser.me/api/portraits/men/5.jpg	Traveling consultant, rarely home. Room available.	HAS_ROOM	2025-12-18 13:00:36.056974
6	Linda	Lane	32	Female	linda@example.com	https://randomuser.me/api/portraits/women/6.jpg	Nurse with shift work. Need someone quiet during day.	HAS_ROOM	2025-12-18 13:00:36.056974
7	Noah	Nolan	26	Male	noah@example.com	https://randomuser.me/api/portraits/men/7.jpg	Student apartment share in Amager.	HAS_ROOM	2025-12-18 13:00:36.056974
8	Patricia	Price	50	Female	patricia@example.com	https://randomuser.me/api/portraits/women/8.jpg	Empty nester renting out a room in Østerbro villa.	HAS_ROOM	2025-12-18 13:00:36.056974
9	Robert	Ross	31	Male	robert@example.com	https://randomuser.me/api/portraits/men/9.jpg	Musician. Room available in creative collective.	HAS_ROOM	2025-12-18 13:00:36.056974
10	Tina	Turner	27	Female	tina@example.com	https://randomuser.me/api/portraits/women/10.jpg	Modern apartment in Nordhavn. Looking for roomie.	HAS_ROOM	2025-12-18 13:00:36.056974
11	Alice	Anderson	25	Female	alice@example.com	https://randomuser.me/api/portraits/women/11.jpg	Quiet student looking for a room.	NEEDS_ROOM	2025-12-18 13:00:36.056974
12	Charlie	Clark	22	Male	charlie@example.com	https://randomuser.me/api/portraits/men/12.jpg	Social and outgoing, need a place.	NEEDS_ROOM	2025-12-18 13:00:36.056974
13	Eve	Evans	24	Female	eve@example.com	https://randomuser.me/api/portraits/women/13.jpg	Looking for a shared apartment.	NEEDS_ROOM	2025-12-18 13:00:36.056974
14	George	Grey	23	Male	george@example.com	https://randomuser.me/api/portraits/men/14.jpg	New to the city. Working in finance.	NEEDS_ROOM	2025-12-18 13:00:36.056974
15	Ivy	Irwin	21	Female	ivy@example.com	https://randomuser.me/api/portraits/women/15.jpg	Design student. Love plants and coffee.	NEEDS_ROOM	2025-12-18 13:00:36.056974
16	Kevin	King	28	Male	kevin@example.com	https://randomuser.me/api/portraits/men/16.jpg	Chef. I cook great meals for my roomies!	NEEDS_ROOM	2025-12-18 13:00:36.056974
17	Mia	Moore	25	Female	mia@example.com	https://randomuser.me/api/portraits/women/17.jpg	Looking for a room near university.	NEEDS_ROOM	2025-12-18 13:00:36.056974
18	Oscar	Owens	29	Male	oscar@example.com	https://randomuser.me/api/portraits/men/18.jpg	Freelance developer. Need good wifi.	NEEDS_ROOM	2025-12-18 13:00:36.056974
19	Sarah	Scott	26	Female	sarah@example.com	https://randomuser.me/api/portraits/women/19.jpg	Teacher. Early bird.	NEEDS_ROOM	2025-12-18 13:00:36.056974
20	Victor	Vance	30	Male	victor@example.com	https://randomuser.me/api/portraits/men/20.jpg	PhD student. Quiet and respectful.	NEEDS_ROOM	2025-12-18 13:00:36.056974
21	Emil	Luplau	25	Male	emilluplau@gmail.com	\N	Very big appartment	HAS_ROOM	2025-12-18 13:14:28.791166
22	Hans 	Jensen	58	Male	hans1@gmail.com	\N	Meget sød mand, leder efter en ung kvinde som har et værelse hun lejer ud	NEEDS_ROOM	2025-12-18 13:17:46.579034
\.


--
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.matches_id_seq', 8, true);


--
-- Name: preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.preferences_id_seq', 10, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rooms_id_seq', 10, true);


--
-- Name: swipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.swipes_id_seq', 71, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 22, true);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: preferences preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preferences
    ADD CONSTRAINT preferences_pkey PRIMARY KEY (id);


--
-- Name: preferences preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preferences
    ADD CONSTRAINT preferences_user_id_key UNIQUE (user_id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: swipes swipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swipes
    ADD CONSTRAINT swipes_pkey PRIMARY KEY (id);


--
-- Name: swipes swipes_swiper_user_id_target_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swipes
    ADD CONSTRAINT swipes_swiper_user_id_target_user_id_key UNIQUE (swiper_user_id, target_user_id);


--
-- Name: matches unique_match_pair; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT unique_match_pair UNIQUE (user_a_id, user_b_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_swipes_swiper; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_swipes_swiper ON public.swipes USING btree (swiper_user_id);


--
-- Name: idx_swipes_target; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_swipes_target ON public.swipes USING btree (target_user_id);


--
-- Name: matches matches_user_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_user_a_id_fkey FOREIGN KEY (user_a_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: matches matches_user_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_user_b_id_fkey FOREIGN KEY (user_b_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: preferences preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preferences
    ADD CONSTRAINT preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: rooms rooms_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: swipes swipes_swiper_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swipes
    ADD CONSTRAINT swipes_swiper_user_id_fkey FOREIGN KEY (swiper_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: swipes swipes_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swipes
    ADD CONSTRAINT swipes_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict N7gkFApGuhkGI6H3R855QzpjVNAcMFcBuGTbTVl9zeaY2YDqUUgAYxQ68PYxZoX

