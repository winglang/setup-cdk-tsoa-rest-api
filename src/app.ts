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

import serverlessExpress from "@codegenie/serverless-express";

// QUESTION (Niv): I think you have a handler for every controller
export const handler = serverlessExpress({ app });
