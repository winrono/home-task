# Home Task

This repository contains solution for a test task

## About the project

This project is a simple TypeScript-based console app making few HTTP endpoint calls to 3rd party API. After retrieving it outputs some statistics about retrieved data.

3rd party integration logic is incapsulated under `integrations` folder to ensure that it could be easily reused if to, for example, convert this console app to web app.

It relies on just few packages:

1. `typescript`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `ts-node` to develop in TS
1. `eslint` to maintain consistent code style
2. `axios` to make http requests

### How to run

Solution was implemented using NodeJS version 18, so ideally you'd better run it on NodeJS 18 (obviously, we could use docker to ensure that software always runs on expected NodeJS version but it's out of scope of the task)

After having NodeJS installed to run application you simply need to perform following steps from root folder of the project:

1. Run `npm install`
2. Either:
    * `npm run build` and `npm run start:dist` (to build app and run from dist)
    * `npm run start:ts-node` (to start using ts-node engine)

In addition, there are also commands `npm run lint` and `npm run lint:fix` to check linting issues in the solution (second command tries to automatically resolve them)