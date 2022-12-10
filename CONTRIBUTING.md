# Contribution

Please read [Authok's contribution guidelines](https://github.com/authok/open-source-template/blob/master/GENERAL-CONTRIBUTING.md).

## Environment setup

- Make sure you have node and npm installed
- Run `npm install` to install dependencies
- Follow the local development steps below to get started

## Local development

- `npm install`: install dependencies
- `npm run build`: Build the binary
- `npm run build:test`: Do this once to build the test harness for the tests
- `npm test`: Run the unit tests
- `npm run test:watch`: Run the unit tests and watch for changes
- `npm run install:examples`: Install the examples
- Setup the examples https://github.com/authok/nextjs-authok/tree/main/examples
- `npm run start:basic`: Run the basic example
- `npm run start:kitchen-sink`: Run the kitchen sink example
- `npm run test:kitchen-sink`: Run the E2E tests (you will need to populate the `CYPRESS_USER_EMAIL` and `CYPRESS_USER_PASSWORD` env vars)
- `npm run test:kitchen-sink:watch`: Run the E2E tests and watch for changes

## Running examples against a mock openid provider

Your env vars in `/examples/kitchen-sink-example/.env.local` should look like

```bash
AUTHOK_SECRET=#ANY LONG RANDOM VALUE
AUTHOK_ISSUER_BASE_URL=http://localhost:3000/oidc
AUTHOK_BASE_URL=http://localhost:3000
AUTHOK_CLIENT_ID=testing
AUTHOK_CLIENT_SECRET=testing
```

Then run one of the commands:

- `start:kitchen-sink-local`: "npm run dev:local --prefix=examples/kitchen-sink-example",
- `test:kitchen-sink-local`: Run the E2E tests against a mock openid provider
- `test:kitchen-sink-local:watch`: Run the E2E tests against a mock openid provider and watch for changes
