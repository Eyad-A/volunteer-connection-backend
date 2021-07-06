"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");

  await Company.create(
    //company_name, country, num_employees, short_description, long_description, website_url, logo_url, main_image_url, looking_for
      {        
        company_name: "C1",
        country: "USA",
        numEmployees: 200,
        short_description: "Short desc 1",
        long_description: "Long desc 1",
        website_url: "https://google.com",
        logoUrl: "https://c1.img",
        main_image_url: "https://main1.img",
        looking_for: "Graphic Designer",
      });
  await Company.create(
      {
        company_name: "C2",
        country: "Japan",
        numEmployees: 300,
        short_description: "Short desc 2",
        long_description: "Long desc 2",
        website_url: "https://cnn.com",
        logoUrl: "https://c2.img",
        main_image_url: "https://main2.img",
        looking_for: "Writer",
      });
  await Company.create(
      {
        company_name: "C3",
        country: "Canada",
        numEmployees: 700,
        short_description: "Short desc 3",
        long_description: "Long desc 3",
        website_url: "https://facebook.com",
        logoUrl: "https://c3.img",
        main_image_url: "https://main3.img",
        looking_for: "Manager",
      });

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    skill: "UX Designer",
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    skill: "Analyst",
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    skill: "Chef",
  });

  await User.applyToCompany("u1", 1);
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


const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });
const u3Token = createToken({ username: "u3" });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token,
};
