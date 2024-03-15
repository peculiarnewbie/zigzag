import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";

const app = new Hono();

app.use("*", poweredBy());

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/api/replicache/pull", (c) => {
	return c.text("pulling");
});

export default app;
