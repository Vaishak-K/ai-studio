import { render, screen } from "@testing-library/react";
import StudioPage from "../app/studio/page";

// Mock with relative paths
jest.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    logout: jest.fn(),
  }),
}));

jest.mock("../hooks/useGenerate", () => ({
  useGenerate: () => ({
    generate: jest.fn(),
    abort: jest.fn(),
    isGenerating: false,
    error: null,
    result: null,
    retryCount: 0,
  }),
}));

jest.mock("../lib/api", () => ({
  generationsAPI: {
    create: jest.fn(),
    getRecent: jest.fn(() => Promise.resolve([])),
  },
}));

describe("StudioPage", () => {
  it("renders studio page when authenticated", async () => {
    render(<StudioPage />);

    // Wait for async rendering
    await screen.findByText(/ai studio/i);

    expect(screen.getByText(/ai studio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prompt/i)).toBeInTheDocument();
  });
});
