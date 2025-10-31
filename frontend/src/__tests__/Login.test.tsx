import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../app/(auth)/login/page";

// Use relative path instead of @/ alias
jest.mock("../lib/api", () => ({
  authAPI: {
    login: jest.fn(),
    signup: jest.fn(),
  },
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders login form", () => {
    render(<LoginPage />);

    // Changed to match the actual heading text "Sign In"
    expect(
      screen.getByRole("heading", { name: /sign in/i })
    ).toBeInTheDocument();

    // Verify the welcome badge is present
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("displays error on failed login", async () => {
    const { authAPI } = require("../lib/api");
    authAPI.login.mockRejectedValue({
      response: { data: { error: "Invalid credentials" } },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      // Look for the error alert with role="alert"
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("disables form during submission", async () => {
    const { authAPI } = require("../lib/api");
    authAPI.login.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  it("shows loading state during login", async () => {
    const { authAPI } = require("../lib/api");
    authAPI.login.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ token: "test-token" }), 1000)
        )
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });

  it("navigates to signup page", () => {
    render(<LoginPage />);

    const signupLink = screen.getByRole("link", { name: /sign up/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/signup");
  });

  it("can dismiss error message", async () => {
    const { authAPI } = require("../lib/api");
    authAPI.login.mockRejectedValue({
      response: { data: { error: "Invalid credentials" } },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    // Find and click the close button in the error alert
    const alert = screen.getByRole("alert");
    const closeButton = alert.querySelector('button[type="button"]');
    if (closeButton) {
      fireEvent.click(closeButton);
    }

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
