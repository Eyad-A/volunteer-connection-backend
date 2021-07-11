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
      {        
        companyHandle: "c1",
        password: "password1",
        companyName: "C1",
        country: "USA",
        numEmployees: 200,
        shortDescription: "Short desc 1",
        longDescription: "Long desc 1",
        websiteUrl: "https://google.com",
        logoUrl: "https://c1.img",
        mainImageUrl: "https://main1.img",
        lookingFor: "Graphic Designer",
      });
  await Company.create(
      {
        companyHandle: "c2",
        password: "password2",
        companyName: "C2",
        country: "Japan",
        numEmployees: 300,
        shortDescription: "Short desc 2",
        longDescription: "Long desc 2",
        websiteUrl: "https://cnn.com",
        logoUrl: "https://c2.img",
        mainImageUrl: "https://main2.img",
        lookingFor: "Writer",
      });
  await Company.create(
      {
        companyHandle: "c3",
        password: "password3",
        companyName: "C3",
        country: "Canada",
        numEmployees: 700,
        shortDescription: "Short desc 3",
        longDescription: "Long desc 3",
        websiteUrl: "https://facebook.com",
        logoUrl: "https://c3.img",
        mainImageUrl: "https://main3.img",
        lookingFor: "Manager",
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

  await User.connectToCompany("u1", "c1");
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
