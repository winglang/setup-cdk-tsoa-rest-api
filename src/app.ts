import express, { json, urlencoded } from "express";
// QUESTION (Cristian): is this the BKM (using the build artifact), does it work with 
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

// QUESTION (Elad): Consider creating our own wing-express adapter "@winglang/wing-express";
// export const handler = wingExpress({ app });

import serverlessExpress from "@codegenie/serverless-express";

// QUESTION (Cristian): What happens if there are more then one controller
// QUESTION (Niv): I think you have a handler for every controller
export const handler = serverlessExpress({ app });
