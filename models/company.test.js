"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const Company = require("./company.js");
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

/*************************************authenticate */

describe("authenticate", function () {
  test("authenticatation works correctly", async function () {
    const company = await Company.authenticate("appl", "password1");
    expect(company).toEqual({
      companyHandle: "appl",
      companyName: "Apple",
      country: "USA",
      numEmployees: 600,
      shortDescription: "Creators of the iPhone",
      longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
      websiteUrl: "https://apple.com",
      logoUrl: "https://c1.img",
      mainImageUrl: "https://c1-main.img",
      lookingFor: "Web Developer",
    });
  });

  test("unauth if no such user", async function () {
    try {
      await Company.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await Company.authenticate("appl", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});


/************************************** create */

describe("create", function () {
  const newCompany = {
    companyHandle: "mnc",
    companyName: "My new company",
    country: "USA",
    numEmployees: 500,
    shortDescription: "Great company",
    longDescription: "Really great company",
    websiteUrl: "https://google.com",
    logoUrl: "https://new.img",
    mainImageUrl: "https://main.img",
    lookingFor: "Web Developer",
  };

  test("Can create a new company", async function () {
    let company = await Company.create({
      ...newCompany,
      password: "password",
    });
    expect(company).toEqual(newCompany);

    const result = await db.query(
      `SELECT company_handle, 
            company_name, 
            country, 
            num_employees, 
            short_description, 
            long_description, 
            website_url, 
            logo_url,
            main_image_url, 
            looking_for
           FROM companies
           WHERE company_handle = 'mnc'`);
    expect(result.rows).toEqual([
      {
        company_handle: "mnc",
        company_name: "My new company",
        country: "USA",
        num_employees: 500,
        short_description: "Great company",
        long_description: "Really great company",
        website_url: "https://google.com",
        logo_url: "https://new.img",
        main_image_url: "https://main.img",
        looking_for: "Web Developer",
      },
    ]);
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("Find all companies works", async function () {
    let companies = await Company.findAll();
    expect(companies).toEqual([
      {
        companyHandle: "appl",
        companyName: "Apple",
        country: "USA",
        numEmployees: 600,
        shortDescription: "Creators of the iPhone",
        longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
        websiteUrl: "https://apple.com",
        logoUrl: "https://c1.img",
        mainImageUrl: "https://c1-main.img",
        lookingFor: "Web Developer",
      },
      {
        companyHandle: "gogl",
        companyName: "Google",
        country: "Germany",
        numEmployees: 800,
        shortDescription: "Creators of Android",
        longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
        websiteUrl: "https://google.com",
        logoUrl: "https://c2.img",
        mainImageUrl: "https://c2-main.img",
        lookingFor: "Graphic Designer",
      },
      {

        companyHandle: "msft",
        companyName: "Microsoft",
        country: "Japan",
        numEmployees: 500,
        shortDescription: "Creators of Windows",
        longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
        websiteUrl: "https://microsoft.com",
        logoUrl: "https://c3.img",
        mainImageUrl: "https://c3-main.img",
        lookingFor: "Analyst",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("Can get a company by handle", async function () {
    let company = await Company.get("appl");
    expect(company).toEqual({
      companyHandle: "appl",
      companyName: "Apple",
      country: "USA",
      numEmployees: 600,
      shortDescription: "Creators of the iPhone",
      longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
      websiteUrl: "https://apple.com",
      logoUrl: "https://c1.img",
      mainImageUrl: "https://c1-main.img",
      lookingFor: "Web Developer",
      users: ["u1"],
    });
  });

  test("not found if no such company", async function () {
    try {
      await Company.get("zzzzzz");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    companyHandle: "nwn",
    companyName: "New name",
    country: "Italy",
    numEmployees: 500,
    shortDescription: "Creators of the iPhone",
    longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
    websiteUrl: "https://apple.com",
    logoUrl: "https://c1.img",
    mainImageUrl: "https://c1-main.img",
    lookingFor: "Web Developer",
  };

  test("Able to update company info", async function () {
    let company = await Company.update("gogl", updateData);
    expect(company).toEqual({
      ...updateData,
    });

    const result = await db.query(
      `SELECT company_handle, company_name, country, num_employees, short_description, long_description, website_url, logo_url, main_image_url, looking_for
           FROM companies
           WHERE company_handle = 'nwn'`);
    expect(result.rows).toEqual([{
      company_handle: "nwn",
      company_name: "New name",
      country: "Italy",
      num_employees: 500,
      short_description: "Creators of the iPhone",
      long_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
      website_url: "https://apple.com",
      logo_url: "https://c1.img",
      main_image_url: "https://c1-main.img",
      looking_for: "Web Developer",
    }]);
  });

  test("not found if no such company", async function () {
    try {
      await Company.update('zzzzz', updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
