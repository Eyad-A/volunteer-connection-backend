"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");
const Company = require("../models/company");

const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();

/** GET /  =>
 *   { companies: [ { company_name, state, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for }, ...] }
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const companies = await Company.findAll();
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

/** GET /[company_handle]  =>  { company }
 *
 *  Company is { company_name, state, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for } 
 *
 * Authorization required: none
 */

router.get("/:company_handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.company_handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { company_name, state, num_employees, short_description, long_description, website_url, logoUrl, main_image_url, looking_for }  
 *
 * Authorization required: login
 */

router.patch("/:company_handle", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.update(req.params.company_handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
