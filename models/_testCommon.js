const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(`
    INSERT INTO companies(company_handle, password, company_name, country, num_employees, short_description, long_description, website_url, logo_url, main_image_url, looking_for)
    VALUES ('appl', $1, 'Apple', 'USA', 600, 'Creators of the iPhone', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.', 'https://apple.com', 'https://c1.img', 'https://c1-main.img', 'Web Developer'),
           ('gogl', $2, 'Google', 'Germany', 800, 'Creators of Android', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.', 'https://google.com', 'https://c2.img', 'https://c2-main.img', 'Graphic Designer'),
           ('msft', $3, 'Microsoft', 'Japan', 500, 'Creators of Windows', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.', 'https://microsoft.com', 'https://c3.img', 'https://c3-main.img', 'Analyst')`,
           [
             await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
             await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
             await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
           ]);

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email,
                          skill)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com', 'Web Developer'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com', 'Graphic Designer')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);

  await db.query(`
  INSERT INTO connections(username, company_handle)
  VALUES ('u1', 'appl')`)
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};