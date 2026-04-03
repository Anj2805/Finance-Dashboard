import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  const email = `test-${Date.now()}@example.com`;
  const password = "123456";

  it("should register user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User 2",
      email: `other-${Date.now()}@example.com`,
      password,
      role: "admin",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should login user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email,
      password,
      role: "admin",
    });
    const res = await request(app).post("/api/auth/login").send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it("should fail with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({ email, password: "wrongpass" });
    expect(res.statusCode).toBe(401);
  });
});
