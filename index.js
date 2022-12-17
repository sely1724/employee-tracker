const inquirer = require("inquirer");
const fs = require("fs");
const cTable = require("console.table");
const mysql = require("mysql2");
//const schema = require("./db/schema.sql");

//connection pool example from https://www.npmjs.com/package/mysql2?activeTab=readme
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'test',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
//   });

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "wZ(k3TmrlOWEForpDiQ[",
    database: "employee_management_system",
  }
  //console.log(`Connected to the ${db.database} database.`)
);

// db.query(`select * from departments`, function (err, results) {
//   console.log(results);
// });

//initialize project.  Asks user questions in the terminal
function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "task",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then((response) => {
      if (response.task === "view all departments") {
        viewDepartments();
      } else if (response.task === "view all roles") {
        viewRoles();
      } else if (response.task === "view all employees") {
        viewEmployees();
      } else if (response.task === "add a department") {
        addDepartment();
      } else if (response.task === "add a role") {
        addRole();
      } else if (response.task === "add an employee") {
        addEmployee();
      } else {
        updateEmployeeRole();
      }
    });
}

function viewDepartments() {
  db.query("select * from departments", function (err, results) {
    console.log(results);
  });
  next();
}

function viewRoles() {
  next();
}

function viewEmployees() {
  next();
}

function addDepartment() {
  next();
}

function addRole() {
  next();
}

function addEmployee() {
  next();
}

function updateEmployeeRole() {
  next();
}

function next() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "task",
        message: "What would you like to do next?",
        choices: ["start new task", "quit"],
      },
    ])
    .then((response) => {
      if (response.task === "start new task") {
        init();
      } else {
        //end
      }
    });
}

init();
