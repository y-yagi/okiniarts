SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;
SET default_tablespace = '';
SET default_with_oids = false;

--
-- Name: artists; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE artists (
    id bigint NOT NULL,
    name character varying NOT NULL,
    user_identifier character varying NOT NULL,
    detail text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: artists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE artists_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: artists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE artists_id_seq OWNED BY artists.id;

--
-- Name: arts; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE arts (
    id bigint NOT NULL,
    name character varying NOT NULL,
    user_identifier character varying NOT NULL,
    detail text,
    artist_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: arts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE arts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: arts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE arts_id_seq OWNED BY arts.id;


-- Name: museums; Type: TABLE; Schema: public; Owner: -; Tablespace:
--

CREATE TABLE museums (
    id bigint NOT NULL,
    name character varying NOT NULL,
    address character varying NOT NULL,
    url character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: museums_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE museums_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: museums_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE museums_id_seq OWNED BY museums.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY artists ALTER COLUMN id SET DEFAULT nextval('artists_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY arts ALTER COLUMN id SET DEFAULT nextval('arts_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY museums ALTER COLUMN id SET DEFAULT nextval('museums_id_seq'::regclass);

