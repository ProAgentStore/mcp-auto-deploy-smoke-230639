import { Hono } from "hono";

interface Env {
	AI: Ai;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => c.json({ agent: "mcp-auto-deploy-smoke-230639", status: "ok" }));

app.post("/chat", async (c) => {
	const { message } = await c.req.json<{ message: string }>();
	const result = await c.env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
		messages: [
			{ role: "system", content: "You are MCP Auto Deploy Smoke. Smoke-test agent proving scaffold_agent can automatically trigger deployment." },
			{ role: "user", content: message },
		],
	});
	return c.json(result);
});

export class AgentDO {
	constructor(private state: DurableObjectState, private env: Env) {}

	async fetch(request: Request): Promise<Response> {
		return app.fetch(request, this.env);
	}
}

export default app;
