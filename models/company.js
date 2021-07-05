"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Company {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { company_name, country, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for }
   *
   * Returns { company_name, country, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ company_name, country, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for }) {
    const duplicateCheck = await db.query(
          `SELECT company_name
           FROM companies
           WHERE company_name = $1`,
        [company_name]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${company_name}`);

    const result = await db.query(
          `INSERT INTO companies
           (company_name, country, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           company_name, country, num_employees AS "numEmployees", short_description, long_description, website_url, logoUrl AS "logoUrl, main_image_url, looking_for`,
        [
          company_name, 
          country, 
          numEmployees, 
          short_description, 
          long_description, 
          website_url, 
          logoUrl, 
          main_image_url, 
          looking_for,
        ],
    );
    const company = result.rows[0];

    return company;
  }

  /** Find all companies.   
   * */

  static async findAll() {
    const companiesRes = await db.query(
          `SELECT company_name, 
            country, 
            num_employees AS "numEmployees", 
            short_description, 
            long_description, 
            website_url, 
            logo_url AS "logoUrl, 
            main_image_url, 
            looking_for
          FROM companies
          ORDER BY name`);
    return companiesRes.rows;
  }

  /** Given a company id, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(company_id) {
    const companyRes = await db.query(
          `SELECT company_name, 
            country, 
            num_employees AS "numEmployees", 
            short_description, 
            long_description, 
            website_url, 
            logo_url AS "logoUrl", 
            main_image_url, 
            looking_for
           FROM companies
           WHERE company_id = $1`,
        [company_id]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${company_id}`);

    const connectionRes = await db.query(
      `SELECT username 
        FROM connections
        WHERE company_id = $1
        ORDER BY username`,
      [company_id],
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

  static async update(company_id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          numEmployees: "num_employees",
          logoUrl: "logo_url",
        });
    const companyIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE company_id = ${companyIdVarIdx}
                      RETURNING company_id, 
                                company_name, 
                                country,
                                num_employees AS "numEmployees", 
                                short_description,
                                long_description,
                                website_url,
                                logo_url AS "logoUrl",
                                main_image_url,
                                looking_for`;
    const result = await db.query(querySql, [...values, company_id]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(company_id) {
    const result = await db.query(
          `DELETE
           FROM companies
           WHERE company_id = $1
           RETURNING company_name`,
        [company_id]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
  }
}


module.exports = Company;
