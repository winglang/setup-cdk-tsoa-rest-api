import type { User } from "./user.js";

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;

export class UsersService {
	public get(id: number, name?: string): User {
		return {
			id,
			email: "jane@doe.com",
			name: name ?? "Jane Doe",
			status: "Happy",
			phoneNumbers: ["616-555-5555"],
		};
	}

	public create(userCreationParams: UserCreationParams): User {
		return {
			id: Math.floor(Math.random() * 10000), // Random
			status: "Happy",
			...userCreationParams,
		};
	}
}
