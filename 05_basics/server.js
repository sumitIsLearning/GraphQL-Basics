require('dotenv').config();
  const express = require('express');
  const { createHandler } = require('graphql-http/lib/use/express');
  const { buildSchema } = require('graphql');
  const path = require('path');
  const fs = require('fs');
  const cors = require('cors');
  const jwt = require('jsonwebtoken')
  
  const schemaPath = path.join(__dirname, 'schema', 'schema.graphql');
  const schemaString = fs.readFileSync(schemaPath, 'utf8');
  const schema = buildSchema(schemaString);
  
  const rootValue = {
    hello: () => 'Hello, world!'
  };
  
  const app = express();
  app.use(cors());
  app.all('/graphql', createHandler({
    schema,
    rootValue,
  }));
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/graphql`);
  });
  