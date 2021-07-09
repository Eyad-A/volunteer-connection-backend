const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(undefined,
      "createToken passed user with an undefined user");

  let payload = {
    username: user.username
  };

  return jwt.sign(payload, SECRET_KEY);
}
 
module.exports = { createToken };
