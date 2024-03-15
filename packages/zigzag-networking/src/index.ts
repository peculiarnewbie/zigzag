import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { drizzle } from "drizzle-orm/d1";
import { Users, users } from "../db/schema";
import { nanoid } from "nanoid";
import { cors } from "hono/cors";

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", poweredBy());

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.use("/api/*", cors());

app.post("/api/replicache/pull", (c) => {
	return c.json(
		{
			// We will discuss these two fields in later steps.
			lastMutationIDChanges: {},
			cookie: 42,
			patch: [
				{ op: "clear" },
				{
					op: "put",
					key: "message/qpdgkvpb9ao",
					value: {
						from: "Jane",
						content: "Hey, what's for lunch?",
						order: 1,
					},
				},
				{
					op: "put",
					key: "message/5ahljadc408",
					value: {
						from: "Fred",
						content: "tacos?",
						order: 2,
					},
				},
			],
		},
		200
	);
});

app.get("/putexample", async (c) => {
	const db = drizzle(c.env.DB);
	const userExample: Users = {
		id: nanoid(),
		textModifiers: "hecc",
		intModifiers: true,
	};

	const response = await db.insert(users).values(userExample).returning();

	return c.text("inserted");
});

export default app;
