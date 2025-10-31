import request from "supertest";
import app from "../src/index";
import db from "../src/models/database";

describe("Auth API", () => {
  // Clean before ALL tests start
  beforeAll(() => {
    db.prepare("DELETE FROM users").run();
  });

  // Clean before EACH test
  beforeEach(() => {
    const result = db.prepare("DELETE FROM users").run();
    console.log(`Deleted ${result.changes} users before test`);
  });

  // Clean up after all tests
  afterAll(() => {
    db.prepare("DELETE FROM users").run();
    db.close();
  });

  describe("POST /auth/signup", () => {
    it("should create a new user", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ email: "test@example.com", password: "password123" });

      // Debug: log the response
      console.log("Response status:", res.status);
      console.log("Response body:", res.body);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe("test@example.com");
    });

    it("should reject duplicate email", async () => {
      await request(app)
        .post("/auth/signup")
        .send({ email: "test@example.com", password: "password123" });

      const res = await request(app)
        .post("/auth/signup")
        .send({ email: "test@example.com", password: "password456" });

      expect(res.status).toBe(400);
    });

    it("should validate email format", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ email: "invalid-email", password: "password123" });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Ensure clean state before creating user
      await request(app)
        .post("/auth/signup")
        .send({ email: "test@example.com", password: "password123" });
    });

    it("should login with correct credentials", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should reject invalid credentials", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
    });
  });
});
