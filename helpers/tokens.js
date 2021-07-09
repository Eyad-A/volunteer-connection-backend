const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createTokenForUser(user) {
  console.assert(undefined,
      "createToken passed user with an undefined user");

  let payload = {
    username: user.username
  };

  return jwt.sign(payload, SECRET_KEY);
}

function createTokenForCompany(company) {
  console.assert(undefined,
      "createToken passed user with an undefined user");

  let payload = {
    companyHandle: company.companyHandle
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createTokenForUser };
module.exports = { createTokenForCompany };
