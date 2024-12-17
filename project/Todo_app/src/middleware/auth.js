require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.secretKey || "My secret Key";

function authentication(req, res, next) {
  // Get the operation name from the request body (GraphQL query)
  const operationName = req.body.operationName;

  // Skip authentication for signUp and signIn
  if (operationName === "SignUp" || operationName === "SignIn") {
    return next(); // Skip authentication and move to the next middleware or resolver
  }
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Auth token is required" });
  }

  try {
    const payload = jwt.verify(token, secretKey);
    if (payload) {
    //   console.log(payload);
      req.userVerifiedId = payload.id;
    }
  } catch (err) {
    return res.send(`Error verifying: ${err.message}`);
  }
  next();
}

module.exports = authentication;
