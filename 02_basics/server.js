require("dotenv").config();
const cors = require("cors");
const { createHandler } = require("graphql-http/lib/use/express");
const express = require("express");
const { buildSchema } = require("graphql");

const app = express();
const port = process.env.PORT || 3000;

const schema = buildSchema(`
    type Query {
        hello:String
        rollDice(numDice:Int! , numSides:Int):RollResult
    }
    type RollResult {
        total: Int!
        rolls: [Int!]!
    }
`);

const root = {
  hello() {
    return "Hello World";
  },
  rollDice({ numDice, numSides }) {
    let output = [];
    for (let i = 0; i < numDice; i++) {
      output.push(Math.floor(Math.random() * (numSides || 6)) + 1);
    }
    const total = output.reduce((sum, value) => sum + value, 0); // Calculate total
    return {
      rolls: output,
      total, // Include the total
    };
  },
};

app.use(cors());

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.listen(port, () => {
  console.log(`server is running on:http://localhost:${port}/graphql`);
});
