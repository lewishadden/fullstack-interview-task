# Moneyhub Tech Test - Investments and Holdings

At Moneyhub we use microservices to partition and separate the concerns of the codebase. In this exercise we have given you an example `admin` service and some accompanying services to work with. In this case the admin service backs a front end admin tool allowing non-technical staff to interact with data.

A request for a new admin feature has been received

## Requirements

- As an admin, I want to be able to generate a CSV report showing the values of all user investment holdings
  - Any new routes should be added to the **admin** service
  - The csv report should be sent to the `/export` route of the **investments** service
  - The investments `/export` route expects the following:
    - content-type as `application/json`
    - JSON object containing the report as csv string, i.e, `{csv: '|User|First Name|...'}`
  - The csv should contain a row for each holding matching the following headers
    |User|First Name|Last Name|Date|Holding|Value|
  - The **Holding** property should be the name of the holding account given by the **financial-companies** service
  - The **Value** property can be calculated by `investmentTotal * investmentPercentage`
  - The new route in the admin service handling the generation of the csv report should return the csv as text with content type `text/csv`
- Ensure use of up to date packages and libraries (the service is known to use deprecated packages but there is no expectation to replace them)
- Make effective use of git

We prefer:

- Functional code
- Ramda.js (this is not a requirement but feel free to investigate)
- Unit testing

### Notes

All of you work should take place inside the `admin` microservice

For the purposes of this task we would assume there are sufficient security middleware, permissions access and PII safe protocols, you do not need to add additional security measures as part of this exercise.

You are free to use any packages that would help with this task

We're interested in how you break down the work and build your solution in a clean, reusable and testable manner rather than seeing a perfect example, try to only spend around _1-2 hours_ working on it

## Getting Started

Please clone this service and push it to your own github (or other) public repository

To develop against all the services each one will need to be started in each service run

```bash
npm start
or
npm run develop
```

The develop command will run nodemon allowing you to make changes without restarting

The services will try to use ports 8081, 8082 and 8083

Use Postman or any API tool of you choice to trigger your endpoints (this is how we will test your new route).

### Existing routes

We have provided a series of routes

Investments - localhost:8081

- `/investments` get all investments
- `/investments/:id` get an investment record by id
- `/investments/export` expects a csv formatted text input as the body

Financial Companies - localhost:8082

- `/companies` get all companies details
- `/companies/:id` get company by id

Admin - localhost:8083

- `/investments/:id` get an investment record by id

## Deliverables

### New routes

Admin - localhost:8083

- `/investments/report/:userId` generate a CSV report by userId

### Testing

Unit tests have been written for the new utility functions in Jest.

To run the unit tests, run

`npm test`

### How might you make this service more secure?

- As part of this task I upgraded all legacy dependencies to to the latest version, fixing all npm package vulnerabilities (as of 12/03/24) and enbling support for Node LTS (v20.11.1) features such as fetch API
- TLS - Install a TLS certificate on the express server to enforce HTTPS traffic for all requests. This encrypts data transmitted across the network, which prevents attackers from stealing private data.
- Restrict CORS access - Adding an Access-Control-Allow-Origin header to the service will restrict which domains/IP adresses are allowed to use the service. It is best practise to whitelist only the origin(s) which should have access.
- Authentication - Implement some kind of authentication middleware such as JWT to prevent access to unauthorized users. This will require a user to provide a valid secret or credentials in order to use the service. This can then be used to apply permission-based access to the admin service so that only admins are authorized to use the CSV report route.

### How would you make this solution scale to millions of records?

- Use a database to store the records so that they can be quickly retrieved in a single query. Databases are optimized for this kind of data storage and retrieval, making it much faster than generating the records on the fly. A simple relational database can be created with the existing data sources and will be much more efficient in terms of storage, speed, CPU cost, and maintainability

### What else would you have liked to improve given more time?

- Add more error handling to the new route so that I could return a more informative response based on the error that caused it
- I would have written more tests, especially integration tests for the new express route to cover the various sad paths that could occur. This can be done by implementing a library called SuperTest which allows you to invoke express routes without running a HTTP server.
- Explore and implement Ramda.js as suggested in the breif.
- Write up thorough documentation on the API usage

On completion email a link to your repository to your contact at Moneyhub and ensure it is publicly accessible.
