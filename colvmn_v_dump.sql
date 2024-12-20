PGDMP     +                	    |           colvmn_v %   14.13 (Ubuntu 14.13-0ubuntu0.22.04.1) %   14.13 (Ubuntu 14.13-0ubuntu0.22.04.1) *               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    32768    colvmn_v    DATABASE     Y   CREATE DATABASE colvmn_v WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C.UTF-8';
    DROP DATABASE colvmn_v;
                postgres    false                       0    0    DATABASE colvmn_v    ACL     -   GRANT ALL ON DATABASE colvmn_v TO vivcolvmn;
                   postgres    false    3356            �            1259    32814    actions    TABLE     �   CREATE TABLE public.actions (
    id integer NOT NULL,
    user_id integer,
    action_type text NOT NULL,
    target_id integer,
    target_type text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.actions;
       public         heap    postgres    false                       0    0    TABLE actions    ACL     H   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.actions TO vivcolvmn;
          public          postgres    false    215            �            1259    32813    actions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.actions_id_seq;
       public          postgres    false    215                       0    0    actions_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.actions_id_seq OWNED BY public.actions.id;
          public          postgres    false    214                        0    0    SEQUENCE actions_id_seq    ACL     :   GRANT ALL ON SEQUENCE public.actions_id_seq TO vivcolvmn;
          public          postgres    false    214            �            1259    32784    events    TABLE     7  CREATE TABLE public.events (
    event_id integer NOT NULL,
    user_id integer,
    date date NOT NULL,
    artist character varying(255),
    venue_name character varying(255),
    venue_address character varying(255),
    "time" time without time zone,
    cost numeric(10,2),
    likes integer DEFAULT 0
);
    DROP TABLE public.events;
       public         heap    postgres    false            !           0    0    TABLE events    ACL     G   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.events TO vivcolvmn;
          public          postgres    false    212            �            1259    32783    events_event_id_seq    SEQUENCE     �   CREATE SEQUENCE public.events_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.events_event_id_seq;
       public          postgres    false    212            "           0    0    events_event_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.events_event_id_seq OWNED BY public.events.event_id;
          public          postgres    false    211            #           0    0    SEQUENCE events_event_id_seq    ACL     ?   GRANT ALL ON SEQUENCE public.events_event_id_seq TO vivcolvmn;
          public          postgres    false    211            �            1259    32798    friends    TABLE     ^   CREATE TABLE public.friends (
    user_id integer NOT NULL,
    friend_id integer NOT NULL
);
    DROP TABLE public.friends;
       public         heap    postgres    false            $           0    0    TABLE friends    ACL     H   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.friends TO vivcolvmn;
          public          postgres    false    213            �            1259    32770    users    TABLE     T  CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    profile_pic character varying(255),
    bio text,
    user_since timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    quote text
);
    DROP TABLE public.users;
       public         heap    postgres    false            %           0    0    TABLE users    ACL     F   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO vivcolvmn;
          public          postgres    false    210            �            1259    32769    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    210            &           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    209            '           0    0    SEQUENCE users_user_id_seq    ACL     =   GRANT ALL ON SEQUENCE public.users_user_id_seq TO vivcolvmn;
          public          postgres    false    209            s           2604    32817 
   actions id    DEFAULT     h   ALTER TABLE ONLY public.actions ALTER COLUMN id SET DEFAULT nextval('public.actions_id_seq'::regclass);
 9   ALTER TABLE public.actions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215            q           2604    32787    events event_id    DEFAULT     r   ALTER TABLE ONLY public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);
 >   ALTER TABLE public.events ALTER COLUMN event_id DROP DEFAULT;
       public          postgres    false    211    212    212            o           2604    32773    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    209    210    210                      0    32814    actions 
   TABLE DATA           `   COPY public.actions (id, user_id, action_type, target_id, target_type, "timestamp") FROM stdin;
    public          postgres    false    215   f-                 0    32784    events 
   TABLE DATA           q   COPY public.events (event_id, user_id, date, artist, venue_name, venue_address, "time", cost, likes) FROM stdin;
    public          postgres    false    212   �-                 0    32798    friends 
   TABLE DATA           5   COPY public.friends (user_id, friend_id) FROM stdin;
    public          postgres    false    213   �.                 0    32770    users 
   TABLE DATA           m   COPY public.users (user_id, username, email, password_hash, profile_pic, bio, user_since, quote) FROM stdin;
    public          postgres    false    210   �.       (           0    0    actions_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.actions_id_seq', 1, false);
          public          postgres    false    214            )           0    0    events_event_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.events_event_id_seq', 7, true);
          public          postgres    false    211            *           0    0    users_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);
          public          postgres    false    209            �           2606    32822    actions actions_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.actions
    ADD CONSTRAINT actions_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.actions DROP CONSTRAINT actions_pkey;
       public            postgres    false    215            |           2606    32792    events events_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);
 <   ALTER TABLE ONLY public.events DROP CONSTRAINT events_pkey;
       public            postgres    false    212            ~           2606    32802    friends friends_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY (user_id, friend_id);
 >   ALTER TABLE ONLY public.friends DROP CONSTRAINT friends_pkey;
       public            postgres    false    213    213            v           2606    32782    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    210            x           2606    32778    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    210            z           2606    32780    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    210            �           2606    32823    actions actions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.actions
    ADD CONSTRAINT actions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 F   ALTER TABLE ONLY public.actions DROP CONSTRAINT actions_user_id_fkey;
       public          postgres    false    210    3192    215            �           2606    32793    events events_user_id_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 D   ALTER TABLE ONLY public.events DROP CONSTRAINT events_user_id_fkey;
       public          postgres    false    212    3192    210            �           2606    32808    friends friends_friend_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.users(user_id);
 H   ALTER TABLE ONLY public.friends DROP CONSTRAINT friends_friend_id_fkey;
       public          postgres    false    3192    210    213            �           2606    32803    friends friends_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 F   ALTER TABLE ONLY public.friends DROP CONSTRAINT friends_user_id_fkey;
       public          postgres    false    210    213    3192                  x������ � �           x����N�0��㧘H+ۉ�ֆ��V�"T��RLka��N����EU��#K3�_>$��H����|��YZc�x2�um�'��Z��P��(v�[�ոp�Gg�`����#]�$;����8-���w�#.`�;�V[��@��Og"��@��
���5��&�;qFk��eX�@\L��A�g9�>
�6u1xe��x�8�4��b���U/M���oA����j�YqL���������E��c8��kO�r��M���o�}�_�A0��m��
a��            x�3�4�2�4�2�=... E         �   x���An�0е}��HTȪ+$z�J���#;����a�U��Ō��oĐ���Ds����2)
�ő�X�o�l#s.]]����N>P��i�!��B��K��Ch�׫F����6�No�ݧ�n[q$v�,��T`J!H-�%z��~'ҳh�FCZ�/���h��?�l��%zvs\���(�L9��4t��``���8��Ϸ��UF�TR�?.��     