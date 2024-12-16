// Resolvers for GraphQL queries and mutations
require('dotenv').config();
const fs = require("fs");
var jwt = require('jsonwebtoken');

const todosFileAddress = "./src/utils/Todo.json";
const usersFileAddress = "./src/utils/users.json";

const secretKey = process.env.secretKey || "My secret Key"

//utils functions
function readData(file) {
  try {
    const data = fs.readFileSync(file, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading data: ${err.message}`);
  }
}

function writeData(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, " "), "utf-8");
  } catch (err) {
    console.error(`Error reading data: ${err.message}`);
  }
}

function getRandomId() {
  return Date.now().toString() + Math.floor(Math.random() * 100000).toString();
}

//creating tasks
function createTask({ input: { title, description } }) {
  if (!title || !description)
    throw new Error("Title and description are Required");

  try {
    const todos = readData(todosFileAddress);

    const newTodo = {
      id: getRandomId(),
      title: title,
      description: description,
      status: false,
    };

    writeData(todosFileAddress, [...todos, newTodo]);
    return newTodo;
  } catch (err) {
    console.error(`Error creating task: ${err.message}`);
  }
}
//updating tasks
function updateTask({ id, input: { title, description } }) {
  if (!title || !description || !id)
    throw new Error("title , description and id are Required");

  try {
    const todos = readData(todosFileAddress);
    const index = todos.findIndex((todo) => todo.id === id);

    todos[index] = { ...todos[index], title: title, description: description };

    writeData(todosFileAddress, todos);

    return todos[index];
  } catch (err) {
    console.error(`Error creating task: ${err.message}`);
  }
}

function statusUpdate({ id }) {
  if (!id) throw new Error("id are Required");

  try {
    const todos = readData(todosFileAddress);
    const index = todos.findIndex((todo) => todo.id === id);

    todos[index] = { ...todos[index], status: !todos[index].status };

    writeData(todosFileAddress, todos);
    return todos[index];
  } catch (err) {
    console.error(`Error creating task: ${err.message}`);
  }
}

// deleting task
function deleteTask({ id }) {
  if (!id) throw new Error("id are Required");

  try {
    const todos = readData(todosFileAddress);
    const index = todos.findIndex((todo) => todo.id === id);

    todos.pop(todos[index]);

    writeData(todosFileAddress, todos);
    return "Successfully deleted the task";
  } catch (err) {
    console.error(`Error creating task: ${err.message}`);
  }
}

// user getting tasks
function getTasks() {
  const todos = readData(todosFileAddress);
  return todos;
}

function getTask({ id }) {
  if (!id) throw new Error("id are Required");

  try {
    const todos = readData(todosFileAddress);
    const foundTodo = todos.find((todo) => todo.id === id);

    return foundTodo;
  } catch (err) {
    console.error(`Error creating task: ${err.message}`);
  }
}

function getLimitedTasks({ status = true, limit = 20 }) {
  const todos = readData(todosFileAddress);

  const filteredTodos = todos.filter(
    (todo, index) => index < limit && todo.status === status
  );

  return filteredTodos;
}

// user login/signUp
function signUp({ input: { userName, email, contact, password } }) {
  try {
    const users = readData(usersFileAddress);

    const user = {
      id: getRandomId(),
      userName,
      email,
      contact,
      password,
    };

    writeData(usersFileAddress, [...users, user]);
    return "Successfully SignedUp";
  } catch (err) {
    console.error(`Error signingUp: ${err.message}`);
  }
}

function signIn({input:{userName , password}}) {
  try{
    const users = readData(usersFileAddress);

    const foundUser = users.find(user => ((user.userName === userName) && (user.password === password)))

    if(!foundUser) throw new Error("user Not found");

    const payload = {
      id:foundUser.id,
      timeStamp: Date.now()
    }
    
    const token = jwt.sign(payload , secretKey , {expiresIn:'1h'});

    return {token};

  } catch(err) {
    console.error(`Error signIngIn: ${err.message}`)
  }
}

const rootValue = {
  signUp: signUp,
  signIn: signIn,
  createTask: createTask,
  updateTask: updateTask,
  statusUpdate: statusUpdate,
  deleteTask: deleteTask,
  getTasks: getTasks,
  getTask: getTask,
  getLimitedTasks: getLimitedTasks,
};

module.exports = rootValue;
