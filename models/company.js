"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Company {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { companyName, country, numEmployees, shortDescription, longDescription, websiteUrl, logoUrl, mainImageUrl, lookingFor }
   *
   * Returns { company_name, country, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ companyName, country, numEmployees, shortDescription, longDescription, websiteUrl, logoUrl, mainImageUrl, lookingFor }) {
    const duplicateCheck = await db.query(
          `SELECT company_name
           FROM companies
           WHERE company_name = $1`,
        [companyName]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${companyName}`);

    const result = await db.query(
          `INSERT INTO companies
           (company_name, country, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING company_name AS "companyName", country, num_employees AS "numEmployees", short_description AS "shortDescription", long_description AS "longDescription", website_url AS "websiteUrl", logoUrl AS "logoUrl, main_image_url AS "mainImageUrl", looking_for AS "lookingFor"`,
        [
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
            company_id AS "companyId",
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
          ORDER BY company_id`);
    return companiesRes.rows;
  }

  /** Given a company id, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(companyId) {
    const companyRes = await db.query(
          `SELECT company_name AS "companyName", 
            country, 
            num_employees AS "numEmployees", 
            short_description AS "shortDescription", 
            long_description "longDescription", 
            website_url AS "websiteUrl", 
            logo_url AS "logoUrl", 
            main_image_url AS "mainImageUrl", 
            looking_for AS "lookingFor"
           FROM companies
           WHERE company_id = $1`,
        [companyId]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${company_id}`);

    const connectionRes = await db.query(
      `SELECT username 
        FROM connections
        WHERE company_id = $1
        ORDER BY username`,
      [companyId],
    );

    company.users = connectionRes.rows;
    
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

  static async update(companyId, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          companyId: "company_id",
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
                      WHERE company_id = ${companyIdVarIdx}
                      RETURNING company_id AS "companyId", 
                                company_name AS "companyName", 
                                country,
                                num_employees AS "numEmployees", 
                                short_description AS "shortDescription",
                                long_description AS "longDescription",
                                website_url AS "websiteUrl",
                                logo_url AS "logoUrl",
                                main_image_url AS "mainImageUrl",
                                looking_for AS "lookingFor"`;
    const result = await db.query(querySql, [...values, companyId]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(companyId) {
    const result = await db.query(
          `DELETE
           FROM companies
           WHERE company_id = $1
           RETURNING company_name`,
        [companyId]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
  }
}


module.exports = Company;
