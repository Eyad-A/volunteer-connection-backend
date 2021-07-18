CREATE TABLE companies (
  company_handle VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  company_name TEXT NOT NULL,
  state TEXT NOT NULL,
  num_employees INTEGER CHECK (num_employees > 0),
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  main_image_url TEXT,
  looking_for TEXT NOT NULL,
  role TEXT DEFAULT 'company'
);

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  skill TEXT NOT NULL,
  role TEXT DEFAULT 'user'
);

CREATE TABLE connections (
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  company_handle VARCHAR(25)
    REFERENCES companies ON DELETE CASCADE,
  PRIMARY KEY (username, company_handle)
);
