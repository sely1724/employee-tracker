# employee-tracker

![MIT](https://img.shields.io/badge/license-MIT-green)

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Screencastify Link](#screencastify)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Description

This application, with the main user being a business owner, provides a way for the user to view and management the various departments, roles, and employees withing the company. It makes organizing employee information extremely easy so they can spend time focusing on more pressing issues.

In terms of the application itself, a user is able to interact with it via Inquirer. When a user runs the application, inquirer asks them what they would like to do. For example, they can choose viewing a department or updating an employee's role. When a user chooses their task (let's say they chose to update an employee's role), inquirer connects to the DB to grab a list of all current employees that the user can choose from. Once the user chooses the employee they'd like to update, inquirer once again uses the DB to grab a list of current roles that the user can choose from. Once the user chooses the new role for the employee, that information is inserted into the database. Then when the user goes to view the list of employees, they can see that the employee's role_id has been changed.

## Installation

Clone the GitHub repository (git@github.com:sely1724/employee-tracker.git). Go to your integrated terminal and run using the command “node index.js”.

Once cloned, run these steps in your terminal.

1. npm init
2. npm i

Then to run the program enter node index.js into the command line.

## Screencastify

https://drive.google.com/file/d/1_aeI5nOpC8oFLCUPsXRdS-YI-oWHfK26/view

## License

License used for this project: [MIT LICENSE](https://opensource.org/licenses/MIT)
Please refer to the license section of my REPO if additional information is needed

## Contributing

n/a

## Testing

n/a

## Questions

Questions? Feel free to get in touch:

GitHub: https://github.com/sely1724

Email: sylvianne9417@gmail.com
