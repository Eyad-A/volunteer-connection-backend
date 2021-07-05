"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
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

/************************************** create */

describe("create", function () {
  const newCompany = {
    company_name: "My new company",
    country: "USA",
    numEmployees: 500,
    short_description: "Great company",
    long_description: "Really great company",
    website_url: "https://google.com",
    logoUrl: "https://new.img",
    main_image_url: "https://main.img",
    looking_for: "Web Developer",
  };

  test("Can create a new company", async function () {
    let company = await Company.create(newCompany);
    expect(company).toEqual(newCompany);

    const result = await db.query(
      // company_name, country, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for  // 
      `SELECT company_id, 
            company_name, 
            country, 
            num_employees, 
            short_description, 
            long_description, 
            website_url, 
            logoUrl, 
            main_image_url, 
            looking_for
           FROM companies
           WHERE company_name = 'My new company'`);
    expect(result.rows).toEqual([
      {
        company_name: "My new company",
        country: "USA",
        numEmployees: 500,
        short_description: "Great company",
        long_description: "Really great company",
        website_url: "https://google.com",
        logoUrl: "https://new.img",
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
        company_name: "Apple",
        country: "USA",
        numEmployees: 600,
        short_description: "Creators of the iPhone",
        long_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
        website_url: "https://apple.com",
        logoUrl: "http://c1.img",
        main_image_url: "https://c1-main.img",
        looking_for: "Web Developer",
      },
      {
        company_name: "Google",
        country: "Germany",
        numEmployees: 800,
        short_description: "Creators of Android",
        long_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
        website_url: "https://google.com",
        logoUrl: "http://c2.img",
        main_image_url: "https://c2-main.img",
        looking_for: "Graphic Designer",
      },
      {
        //'Microsoft', 'Japan', 500, 'Creators of Windows', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.', 'https://microsoft.com', 'https://c3.img', 'https://c3-main.img', 'Analyst'
        company_name: "Microsoft",
        country: "Japan",
        numEmployees: 500,
        short_description: "Creators of Windows",
        long_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
        website_url: "https://microsoft.com",
        logoUrl: "http://c3.img",
        main_image_url: "https://c3-main.img",
        looking_for: "Analyst",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("Can get a company by ID", async function () {
    let company = await Company.get(1);
    expect(company).toEqual({
      company_name: "Apple",
      country: "USA",
      numEmployees: 600,
      short_description: "Creators of the iPhone",
      long_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
      website_url: "https://apple.com",
      logoUrl: "http://c1.img",
      main_image_url: "https://c1-main.img",
      looking_for: "Web Developer",
    });
  });

  test("not found if no such company", async function () {
    try {
      await Company.get(96585);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    company_name: "New name",
    country: "Italy",
    numEmployees: 500,
    short_description: "Creators of the iPhone",
    long_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
    website_url: "https://apple.com",
    logoUrl: "http://c1.img",
    main_image_url: "https://c1-main.img",
    looking_for: "Web Developer",
  };

  test("Able to update company info", async function () {
    let company = await Company.update(1, updateData);
    expect(company).toEqual({
      company_id: "c1",
      ...updateData,
    });

    const result = await db.query(
      `SELECT company_name, country, num_employees, short_description, long_description, website_url, logo_url, main_image_url, looking_for
           FROM companies
           WHERE company_id = 1`);
    expect(result.rows).toEqual([{
      company_id: 1,
      company_name: "New name",
      country: "Italy",
      numEmployees: 500,
      short_description: "Creators of the iPhone",
      long_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
      website_url: "https://apple.com",
      logoUrl: "http://c1.img",
      main_image_url: "https://c1-main.img",
      looking_for: "Web Developer",
    }]);
  });  

  test("not found if no such company", async function () {
    try {
      await Company.update(89874, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });  
});
