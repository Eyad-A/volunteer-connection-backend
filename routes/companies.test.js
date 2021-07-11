"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  c1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** GET /companies */

describe("GET /companies", function () {
  test("can get all companies successfully", async function () {
    const resp = await request(app).get("/companies");
    expect(resp.body).toEqual({
      companies:
        [
          {
            companyHandle: "c1",
            companyName: "C1",
            country: "USA",
            numEmployees: 200,
            shortDescription: "Short desc 1",
            longDescription: "Long desc 1",
            websiteUrl: "https://google.com",
            logoUrl: "https://c1.img",
            mainImageUrl: "https://main1.img",
            lookingFor: "Graphic Designer",
          },
          {
            companyHandle: "c2",
            companyName: "C2",
            country: "Japan",
            numEmployees: 300,
            shortDescription: "Short desc 2",
            longDescription: "Long desc 2",
            websiteUrl: "https://cnn.com",
            logoUrl: "https://c2.img",
            mainImageUrl: "https://main2.img",
            lookingFor: "Writer",
          },
          {
            companyHandle: "c3",
            companyName: "C3",
            country: "Canada",
            numEmployees: 700,
            shortDescription: "Short desc 3",
            longDescription: "Long desc 3",
            websiteUrl: "https://facebook.com",
            logoUrl: "https://c3.img",
            mainImageUrl: "https://main3.img",
            lookingFor: "Manager",
          },
        ],
    });
  });
});

/************************************** GET /companies/:company_handle */

describe("GET /companies/:company_handle", function () {
  test("can get a company successfully", async function () {
    const resp = await request(app).get(`/companies/c1`);
    expect(resp.body).toEqual({
      company: {
        companyHandle: "c1",
        companyName: "C1",
        country: "USA",
        numEmployees: 200,
        shortDescription: "Short desc 1",
        longDescription: "Long desc 1",
        websiteUrl: "https://google.com",
        logoUrl: "https://c1.img",
        mainImageUrl: "https://main1.img",
        lookingFor: "Graphic Designer",
        users: ["u1"],
      },
    });
  });

  test("not found for no such company", async function () {
    const resp = await request(app).get(`/companies/85895`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /companies/:handle */

describe("PATCH /companies/:company_handle", function () {
  test("can patch a company successfully", async function () {
    const resp = await request(app)
      .patch(`/companies/c1`)
      .send({
        companyName: "C1-new",
      })
      .set("authorization", `Bearer ${c1Token}`);
    expect(resp.body).toEqual({
      company: {        
        companyHandle: "c1",
        companyName: "C1-new",
        country: "USA",
        numEmployees: 200,
        shortDescription: "Short desc 1",
        longDescription: "Long desc 1",
        websiteUrl: "https://google.com",
        logoUrl: "https://c1.img",
        mainImageUrl: "https://main1.img",
        lookingFor: "Graphic Designer",
      },
    });
  });  

  test("not found on no such company", async function () {
    const resp = await request(app)
      .patch(`/companies/nope`)
      .send({
        name: "new nope",
      })
      .set("authorization", `Bearer ${c1Token}`);
    expect(resp.statusCode).toEqual(400);
  }); 

  test("bad request on invalid data", async function () {
    const resp = await request(app)
      .patch(`/companies/c1`)
      .send({
        logoUrl: "not-a-url",
      })
      .set("authorization", `Bearer ${c1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

