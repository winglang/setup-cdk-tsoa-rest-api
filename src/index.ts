import { App, Stack } from "aws-cdk-lib/core";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { SpecRestApi, ApiDefinition } from "aws-cdk-lib/aws-apigateway";
import { readFile } from "fs/promises";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";
import type { OpenAPIV3 } from "openapi-types";

const app = new App();

const stack = new Stack(app, "TsoaStack", {
	env: {
		account: process.env["CDK_DEFAULT_ACCOUNT"],
		region: process.env["CDK_DEFAULT_REGION"],
	},
});

const handler = new NodejsFunction(stack, "TsoaFunction", {
	handler: "index.handler",
	entry: `${import.meta.dirname}/app.ts`,
});

const swagger = JSON.parse(
	await readFile(`${import.meta.dirname}/../build/swagger.json`, "utf-8"),
) as OpenAPIV3.Document;

// Delete the `components.schemas` property as it is not fully supported by AWS.
// See https://github.com/lukeautry/tsoa/issues/911#issuecomment-1105120745.
//
// Note that the swagger file has previously been flattened by `openapi-flattener`.
delete swagger.components?.schemas;

// Add the `x-amazon-apigateway-integration` property to the paths.
swagger.paths = {
	...Object.fromEntries(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Object.entries(swagger.paths).map(([key, value]: [string, any]) => [
			key,
			Object.fromEntries(
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
				Object.entries(value).map(([key, value]: [string, any]) => [
					key,
					{
						// QUESTION (Niv): Is this something you are doing as well? 
						...value,
						"x-amazon-apigateway-integration": {
							type: "aws_proxy",
							httpMethod: "POST",
							uri: `arn:aws:apigateway:${process.env["CDK_DEFAULT_REGION"]}:lambda:path/2015-03-31/functions/${handler.functionArn}/invocations`,
						},
					},
				]),
			),
		]),
	),
};

const api = new SpecRestApi(stack, "TsoaApi", {
	apiDefinition: ApiDefinition.fromInline(swagger),
});

handler.addPermission("AllowInvoke", {
	principal: new ServicePrincipal("apigateway.amazonaws.com"),
	sourceArn: api.arnForExecuteApi(),
});
