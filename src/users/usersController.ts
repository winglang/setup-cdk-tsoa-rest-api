import {
	Body,
	Controller,
	Get,
	Path,
	Post,
	Query,
	Route,
	SuccessResponse,
} from "tsoa";
import type { User } from "./user.js";
import type { UserCreationParams } from "./usersService.js";
import { UsersService } from "./usersService.js";

@Route("users")
export class UsersController extends Controller {
	@Get("{userId}")
	public async getUser(
		@Path() userId: number,
		@Query() name?: string,
	): Promise<User> {
		console.log(userId, name);
		return new UsersService().get(userId, name);
	}

	@SuccessResponse("201", "Created") // Custom success response
	@Post()
	public async createUser(
		@Body() requestBody: UserCreationParams,
	): Promise<void> {
		this.setStatus(201); // set return status 201
		// Question (Elad): What happens if they do bucket.put here
		// 1. Where do they get the bucket from?
		// 2. How do they get permissions for it
		new UsersService().create(requestBody);
		return;
	}
}
