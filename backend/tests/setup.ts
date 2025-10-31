import db from "../src/models/database";

// Clear database before each test
beforeEach(() => {
  try {
    db.prepare("DELETE FROM generations").run();
    db.prepare("DELETE FROM users").run();
  } catch (error) {
    console.error("Error clearing database:", error);
  }
});

// Close database after all tests
afterAll(() => {
  db.close();
});
