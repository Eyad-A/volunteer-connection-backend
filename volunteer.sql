\echo 'Delete and recreate volunteer db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE volunteer;
CREATE DATABASE volunteer;
\connect volunteer

\i volunteer-schema.sql
\i volunteer-seed.sql

\echo 'Delete and recreate volunteer_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE volunteer_test;
CREATE DATABASE volunteer_test;
\connect volunteer_test

\i volunteer-schema.sql
