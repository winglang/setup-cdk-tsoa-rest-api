import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes.js";

export const app = express();

// Use body parser to read sent json payloads
app.use(
	urlencoded({
		extended: true,
	}),
);
app.use(json());

RegisterRoutes(app);

import serverlessHttp from "serverless-http";

export const handler = serverlessHttp(app);
