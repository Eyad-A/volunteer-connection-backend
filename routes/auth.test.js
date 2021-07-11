"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/login-user */

describe("POST /auth/login-user", function () {
  test("can post a new token successfully", async function () {
    const resp = await request(app)
        .post("/auth/login-user")
        .send({
          username: "u1",
          password: "password1",          
        });
    expect(resp.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app)
        .post("/auth/login-user")
        .send({
          username: "no-such-user",
          password: "password2",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
        .post("/auth/login-user")
        .send({
          username: "u2",
          password: "nope",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/auth/login-user")
        .send({
          username: "u2",
        });
    expect(resp.statusCode).toEqual(400);
  });  
});

/************************************** POST /auth/register-user */

describe("POST /auth/register-user", function () {
  test("can register successfully", async function () {
    const resp = await request(app)
        .post("/auth/register-user")
        .send({
          username: "new",
          firstName: "first",
          lastName: "last",
          password: "password",
          email: "new@email.com",
          skill: "Product Manager",
        });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
        .post("/auth/register-user")
        .send({
          username: "new",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/auth/register-user")
        .send({
          username: "new",
          firstName: "first",
          lastName: "last",
          password: "password",
          email: "not-an-email",
        });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/login-company */

describe("POST /auth/login-company", function () {
  test("can post a new token successfully", async function () {
    const resp = await request(app)
        .post("/auth/login-company")
        .send({
          companyHandle: "c1",
          password: "password1",       
        });
    expect(resp.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("unauth with non-existent companies", async function () {
    const resp = await request(app)
        .post("/auth/login-company")
        .send({
          companyHandle: "no-such-company",
          password: "password2",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
        .post("/auth/login-company")
        .send({
          username: "c1",
          password: "wrongpassword",
        });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/auth/login-company")
        .send({
          username: "c1",
        });
    expect(resp.statusCode).toEqual(400);
  });  
});