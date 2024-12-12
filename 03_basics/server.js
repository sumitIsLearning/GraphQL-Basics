const cors = require('cors');
require('dotenv').config();
const express = require('express');
const {buildSchema} = require('graphql');
const {createHandler} = require('graphql-http/lib/use/express');

const app = express();
const port = process.env.PORT || 3000;

// object type 
// when you use ! sign with types that mean you dont want their value to be null
const schema = buildSchema(`
    type Query {
        getDie(numSides:Int): RandomDie
    },

    type RandomDie {
        numSides: Int
        rollOnce: Int
        rollMultiple(times:Int!):[Int]
    }
    
`)

class RandomDie {
    constructor(numSides) {
        this.numSides = numSides
    }

    rollOnce() {
        return (Math.floor(Math.random() * this.numSides) + 1)
    }

    rollMultiple({times}) {
        const rolls = [];
        for(let i = 0; i < times; i++) {
            rolls.push(this.rollOnce())
        }

        return rolls;
    }

}

const root = {
    getDie: ({numSides}) => new RandomDie(numSides),
    RandomDie: {
        rollOnce: (die) => die.rollOnce(),
        rollMultiple: (die , {times}) => die.rollMultiple(times)
    }
}

app.use(cors());

app.all(
    "/graphql",
    createHandler({
        schema,
        rootValue: root
    })
)

app.listen(port , () => {
    console.log(`running on : http://localhost:${port}/graphql`);
    
})