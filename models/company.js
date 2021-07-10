"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for companies. */

class Company {

  /** authenticate company with companyHandle, password.
   *
   * Returns { company }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/
  
  static async authenticate(companyHandle, password) {
    // try to find the company first
    const result = await db.query(
      `SELECT company_handle AS "companyHandle",
                  password,                  
                  company_name AS "companyName", 
                  country, 
                  num_employees AS "numEmployees", 
                  short_description AS "shortDescription", 
                  long_description AS "longDescription", 
                  website_url AS "websiteUrl", 
                  logo_url AS "logoUrl", 
                  main_image_url AS "mainImageUrl", 
                  looking_for AS "lookingFor"
           FROM companies
           WHERE company_handle = $1`,
      [companyHandle],
    );

    const company = result.rows[0];

    if (company) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, company.password);
      if (isValid === true) {
        delete company.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }


  /** Create a company (from data), update db, return new company data.
   *
   * data should be { companyName, country, numEmployees, shortDescription, longDescription, websiteUrl, logoUrl, mainImageUrl, lookingFor }
   *
   * Returns { company_name, country, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ companyHandle, password, companyName, country, numEmployees, shortDescription, longDescription, websiteUrl, logoUrl, mainImageUrl, lookingFor }) {
    const duplicateCheck = await db.query(
      `SELECT company_handle
           FROM companies
           WHERE company_handle = $1`,
      [companyHandle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${companyHandle}`);

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO companies
           (company_handle, password, company_name, country, num_employees, short_description, long_description, website_url, logo_url, main_image_url, looking_for)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING company_handle AS "companyHandle", company_name AS "companyName", country, num_employees AS "numEmployees", short_description AS "shortDescription", long_description AS "longDescription", website_url AS "websiteUrl", logo_url AS "logoUrl", main_image_url AS "mainImageUrl", looking_for AS "lookingFor"`,
      [
        companyHandle,
        hashedPassword,
        companyName,
        country,
        numEmployees,
        shortDescription,
        longDescription,
        websiteUrl,
        logoUrl,
        mainImageUrl,
        lookingFor,
      ],
    );
    const company = result.rows[0];

    return company;
  }

  /** Find all companies.   
   * */

  static async findAll() {
    const companiesRes = await db.query(
      `SELECT 
            company_handle AS "companyHandle",
            company_name AS "companyName", 
            country, 
            num_employees AS "numEmployees", 
            short_description AS "shortDescription", 
            long_description AS "longDescription", 
            website_url AS "websiteUrl", 
            logo_url AS "logoUrl", 
            main_image_url AS "mainImageUrl", 
            looking_for AS "lookingFor"
          FROM companies
          ORDER BY company_handle`);
    return companiesRes.rows;
  }

  /** Given a company id, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(companyHandle) {
    const companyRes = await db.query(
      `SELECT company_handle AS "companyHandle", 
            company_name AS "companyName", 
            country, 
            num_employees AS "numEmployees", 
            short_description AS "shortDescription", 
            long_description "longDescription", 
            website_url AS "websiteUrl", 
            logo_url AS "logoUrl", 
            main_image_url AS "mainImageUrl", 
            looking_for AS "lookingFor"
           FROM companies
           WHERE company_handle = $1`,
      [companyHandle]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${companyHandle}`);

    const connectionRes = await db.query(
      `SELECT username 
        FROM connections
        WHERE company_handle = $1
        ORDER BY username`,
      [companyHandle],
    );

    company.users = connectionRes.rows.map(u => u.username);
    // user.connections = userConnectionsRes.rows.map(c => c.company_handle);

    return company;
  }

  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {company_name, country, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for}
   *
   * Throws NotFoundError if not found.
   */

  static async update(companyHandle, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        companyHandle: "company_handle",
        companyName: "company_name",
        numEmployees: "num_employees",
        shortDescription: "short_description",
        longDescription: "long_description",
        websiteUrl: "website_url",
        logoUrl: "logo_url",
        mainImageUrl: "main_image_url",
        lookingFor: "looking_for"
      });
    const companyIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE company_handle = ${companyIdVarIdx}
                      RETURNING company_handle AS "companyHandle", 
                                company_name AS "companyName", 
                                country,
                                num_employees AS "numEmployees", 
                                short_description AS "shortDescription",
                                long_description AS "longDescription",
                                website_url AS "websiteUrl",
                                logo_url AS "logoUrl",
                                main_image_url AS "mainImageUrl",
                                looking_for AS "lookingFor"`;
    const result = await db.query(querySql, [...values, companyHandle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${companyHandle}`);

    return company;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(companyHandle) {
    const result = await db.query(
      `DELETE
           FROM companies
           WHERE company_handle = $1
           RETURNING company_name`,
      [companyHandle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${companyHandle}`);
  }
}


module.exports = Company;
