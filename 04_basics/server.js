const cors = require('cors');
require('dotenv').config();
const express = require('express');
const {buildSchema} = require('graphql');
const {createHandler} = require('graphql-http/lib/use/express');

const app = express();
const port = process.env.PORT || 3000;

const messages = [];

// mutations are operation to modify data on server , it is similar to query but instead of fetching data it allows us to alter/modify the data in the server

const schema = buildSchema(`
    input MessageInput{
        content:String
        author:String
    }
    
    type Message {
        id: ID!
        content: String
        author: String
    }

    type Mutation{
        setMessage(input: MessageInput): Message
        updateMessage(id:ID! , input: MessageInput) : Message
    }

    type Query {
        hello: String,
        getMessage: [Message],
        get(id:ID!): Message
    }
`)

class Message{
    constructor(id , {content , author}) {
        this.id = id
        this.content = content
        this.author = author
    }
}


const root = {
    hello : () => "Hello World",

    setMessage: ({input}) => {
        const max = 9999;
        const min = 1000;
        const id = Math.floor(Math.random() * (max - min + 1) + min);

        messages.push({...input , id});
        return new Message(id , input);
    },

    updateMessage: ({id , input}) => {
        const foundMessageIndex = messages.findIndex(message => message.id === parseInt(id));

        if(foundMessageIndex >= 0) {
            messages[foundMessageIndex] = {...messages[foundMessageIndex] , ...input}
            return new Message(id , messages[foundMessageIndex]);
        }
        throw new Error("no message exists with id: " + id)
    },

    getMessage: () => messages,
    get: ({id}) => {
        const foundMessage = messages.find(message => message.id === parseInt(id));
        if(foundMessage) {
            return foundMessage;
        }
        throw new Error("no message exists with id: " + id)
    },

}

app.use(cors());

app.all(
    "/graphql",
    createHandler({
        schema,
        rootValue:root,
    })
)

app.listen(port , () => {
    console.log(`running on: http://localhost:${port}/graphql`);
})