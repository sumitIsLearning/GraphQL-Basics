require("dotenv").config();
const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
const path = require("path");
const fs = require("fs");
const rootValue = require("./graphql/resolvers");
const corsMiddleware = require("./middleware/cors");
const authentication = require("./middleware/auth");


const schemaPath = path.join(__dirname, "graphql", "schema", "schema.graphql");
const schemaString = fs.readFileSync(schemaPath, "utf8");
const schema = buildSchema(schemaString);

const app = express();
app.use(express.json());
app.use(authentication);
app.use(corsMiddleware);

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue,
    context: req => ({
      userId: req.raw.userVerifiedId,
    }),
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/graphql`);
});
