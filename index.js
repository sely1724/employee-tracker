const inquirer = require("inquirer");
const fs = require("fs");

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

init();
