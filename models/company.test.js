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
      // company_name, country, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for  // 
      `SELECT company_handle, 
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
           WHERE company_handle = 'mnc'`);
    expect(result.rows).toEqual([
      {
        company_handle: "mnc",
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
        companyHandle: "appl",
        companyName: "Apple",
        country: "USA",
        numEmployees: 600,
        shortDescription: "Creators of the iPhone",
        longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
        websiteUrl: "https://apple.com",
        logoUrl: "http://c1.img",
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
        logoUrl: "http://c2.img",
        mainImageUrl: "https://c2-main.img",
        lookingFor: "Graphic Designer",
      },
      {
        //'Microsoft', 'Japan', 500, 'Creators of Windows', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.', 'https://microsoft.com', 'https://c3.img', 'https://c3-main.img', 'Analyst'
        companyHandle: "mcsf",
        companyName: "Microsoft",
        country: "Japan",
        numEmployees: 500,
        shortDescription: "Creators of Windows",
        longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
        websiteUrl: "https://microsoft.com",
        logoUrl: "http://c3.img",
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
      logoUrl: "http://c1.img",
      mainImageUrl: "https://c1-main.img",
      lookingfor: "Web Developer",
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
    logoUrl: "http://c1.img",
    mainImageUrl: "https://c1-main.img",
    lookingFor: "Web Developer",
  };

  test("Able to update company info", async function () {
    let company = await Company.update("appl", updateData);
    expect(company).toEqual({
      companyHandle: "aple",
      ...updateData,
    });

    const result = await db.query(
      `SELECT company_handle, company_name, country, num_employees, short_description, long_description, website_url, logo_url, main_image_url, looking_for
           FROM companies
           WHERE company_handle = 'appl'`);
    expect(result.rows).toEqual([{
      companyHandle: "appl",
      companyName: "New name",
      country: "Italy",
      numEmployees: 500,
      shortDescription: "Creators of the iPhone",
      longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis, ex nec hendrerit lacinia, augue arcu pharetra odio, pharetra semper tortor erat non urna.",
      websiteUrl: "https://apple.com",
      logoUrl: "http://c1.img",
      mainImageUrl: "https://c1-main.img",
      lookingFor: "Web Developer",
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
