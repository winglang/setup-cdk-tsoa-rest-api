#

## Installation

```sh
pnpm install
```

## Dev

```sh
pnpm run dev
```

Then, navigate to `http://localhost:3000/users/1` to see an example response.

## Deploy

```sh
pnpm run deploy
```

This application consists of:

- The Tsoa app at `src/app.ts` with some routes and controllers in `src/users/`
  - Exposes a handler for AWS Lambda compatibility
  - The Tsoa CLI generates the OpenAPI spec and the routes at `build/swagger.json`
  - The OpenAPI spec is later flattened for consuming with the CDK
- The CDK app at `src/index.ts`
  - Builds the Lambda function for the Tsoa app
  - Reads the OpenAPI spec and attaches additional information required by the API Gateway
  - Assigns necessary permissions to the Lambda function

## Try the example

- Deploy the application
- Retrieve the `TsoaStack` endpoint output (eg, `https://xxx.execute-api.xxx.amazonaws.com/prod/`)
- Navigate to `https://xxx.execute-api.xxx.amazonaws.com/prod/users/1` to see an example response
