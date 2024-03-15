import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { drizzle } from "drizzle-orm/d1";
import { Users, users } from "../db/schema";
import { nanoid } from "nanoid";

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", poweredBy());

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/api/replicache/pull", (c) => {
	return c.text("pulling");
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
