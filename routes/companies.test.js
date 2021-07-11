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
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /companies */

describe("POST /companies", function () {
  const newCompany = {
    companyHandle: "mnc",
    password: "password1",
    companyName: "New",
    country: "Canada",
    numEmployees: 500,
    shortDescription: "Short desc",
    longDescription: "Long desc",
    websiteUrl: "https://facebook.com",
    logoUrl: "https://new.img",
    mainImageUrl: "https://mainnew.img",
    lookingFor: "Manager",
  };

  test("Can view a all companies", async function () {
    const resp = await request(app)
      .post("/companies")
      .send(newCompany);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      company: newCompany,
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/companies")
      .send({
        company_name: "new",
        numEmployees: 500,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/companies")
      .send({
        ...newCompany,
        logoUrl: "not-a-url",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /companies */

describe("GET /companies", function () {
  test("can get all companies successfully", async function () {
    const resp = await request(app).get("/companies");
    expect(resp.body).toEqual({
      companies:
        [
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
          },
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
          },
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
          },
        ],
    });
  });
});

/************************************** GET /companies/:company_handle */

describe("GET /companies/:company_handle", function () {
  test("can get a company successfully", async function () {
    const resp = await request(app).get(`/companies/1`);
    expect(resp.body).toEqual({
      company: {
        company_name: "C1",
        country: "USA",
        numEmployees: 200,
        short_description: "Short desc 1",
        long_description: "Long desc 1",
        website_url: "https://google.com",
        logoUrl: "https://c1.img",
        main_image_url: "https://main1.img",
        looking_for: "Graphic Designer",
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
      .patch(`/companies/1`)
      .send({
        company_name: "C1-new",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      company: {        
        name: "C1-new",
        country: "USA",
        numEmployees: 200,
        short_description: "Short desc 1",
        long_description: "Long desc 1",
        website_url: "https://google.com",
        logoUrl: "https://c1.img",
        main_image_url: "https://main1.img",
        looking_for: "Graphic Designer",
      },
    });
  });  

  test("not found on no such company", async function () {
    const resp = await request(app)
      .patch(`/companies/nope`)
      .send({
        name: "new nope",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  }); 

  test("bad request on invalid data", async function () {
    const resp = await request(app)
      .patch(`/companies/1`)
      .send({
        logoUrl: "not-a-url",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

