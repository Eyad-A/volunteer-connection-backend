# Volunteer Connection
This is the backend for the Volunteer Connection project. Volunteer Connection is a platform that allows freelancers to connect with nonprofit companies. 
The backend is built with Node, Express, and Postgresql. 

[You can find the frontend here](https://github.com/Eyad-A/volunteer-connection-frontend) 

## Testing
You can run the tests locally by using the comand `npm run test`. This project uses Jest for testing.

## Features 
- This is a pure API app, taking values from the query string (GET requests) or 
from a JSON body, and returns JSON
- Uses JWT tokens for role-based (users/companies) authentication/authorization 
- Users (freelancers) and companies (nonprofits) have two different signup and login forms
- Users can browse companies and may login to connect with the company of their choice
- Users can view a list of their connections
- Companies can signup and list the type of volunteers they're looking for (Developers, Designers, etc..)
- Companies can view a list of all the users they connected with 
- Allows users to connect with a company by sending POST request to
/users/:username/companies/:companyHandle 
