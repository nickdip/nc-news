# Northcoders News API

Welcome to my backend project for Northcoders: Nicks-NC-News! 

## Live Demo

You can check out the live demo of this project at [https://nicks-nc-news.onrender.com/api](https://nicks-nc-news.onrender.com/api).

## Getting Started

To get started with this project, you'll need to clone the repository to your local machine. Follow these steps:

1. Open your terminal.

2. Navigate to the directory where you want to clone the project.

3. Run the following command to clone the repository:

git clone https://github.com/nickdip/nc-news


## Dependencies

Before you can run the project, make sure you have the following dependencies installed:

- [Node.js](https://nodejs.org/) (^20.5.1)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [pg](https://www.npmjs.com/package/pg) (^8.7.3)

<u>Developer Dependencies</u>
- [jest] (https://www.npmjs.com/package/jest)
- [jest-sorted](https://www.npmjs.com/package/jest-sorted)
- [jest-extended](https://www.npmjs.com/package/jest-extended)
- [pg-format](https://www.npmjs.com/package/pg-format)
- [supertest](https://www.npmjs.com/package/supertest)
- [husky](https://www.npmjs.com/package/husky)

While yarn can be used can install these dependencies, the package.json file assums npm is installed when running this application. Please visit[npm docs](https://docs.npmjs.com/cli/v6/commands/npm-install) for instructions on installing npm.

## Seeding

The file contains both test-data and development-data. For testing purposes, test-data will be seeded before each test (see ./__tests__/app.test.js). Assuming npm is installed, enter 'npm run seed' to seed the database. 

## Environment Variables

This project uses dotenv (see dependencies).

Three files will need to be created:

1. .env.test - requires PGDATABASE=nc_news_test to access the test database

2. .env.development - requires PGDATABASE=nc_news to access the developement data

3. .env.production - requires DATABASE_URL=**url** (the url to host - this can be the demo link provided above)

## Testing

Jest and supertest is used for integration testing and utility testing. The extensions jest-extended and jest-sorted are also used and need to be installed (see dependencies). The command 'npm t' runs all test files while you can access a single test file by typing the file name after e.g npm t app.test.py. Note that husky (see dependencies) requires all tests to pass before commiting.


