import request from "supertest";
import path from "path";
import app from "../src/index";
import db from "../src/models/database";

describe("Generations API", () => {
  let token: string;

  beforeAll(async () => {
    db.prepare("DELETE FROM users").run();
    db.prepare("DELETE FROM generations").run();

    const res = await request(app)
      .post("/auth/signup")
      .send({ email: "test@example.com", password: "password123" });

    token = res.body.token;
  });

  describe("POST /generations", () => {
    const testImagePath = path.join(__dirname, "fixtures", "test-image.jpg");

    it("should create generation with original image URL", async () => {
      const res = await request(app)
        .post("/generations")
        .set("Authorization", `Bearer ${token}`)
        .field("prompt", "A beautiful sunset")
        .field("style", "realistic")
        .attach("image", testImagePath);

      if (res.status === 201) {
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("imageUrl");
        expect(res.body).toHaveProperty("originalImageUrl"); // NEW TEST
        expect(res.body.originalImageUrl).toContain("original-");
        expect(res.body.prompt).toBe("A beautiful sunset");
      }
    });
  });

  describe("GET /generations", () => {
    it("should return generations with original image URLs", async () => {
      const res = await request(app)
        .get("/generations?limit=5")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty("originalImageUrl"); // NEW TEST
      }
    });
  });
});
