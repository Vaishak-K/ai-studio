import { renderHook, act } from "@testing-library/react";
import { useGenerate } from "../hooks/useGenerate";
import { generationsAPI } from "../lib/api";
import axios from "axios";

jest.mock("@/lib/api");

describe("useGenerate Hook", () => {
  const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
  const mockParams = {
    image: mockFile,
    prompt: "Test prompt",
    style: "realistic" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("generates successfully", async () => {
    const mockResult = {
      id: "123",
      prompt: "Test prompt",
      style: "realistic",
      imageUrl: "/uploads/test.jpg",
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    (generationsAPI.create as jest.Mock).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useGenerate());

    await act(async () => {
      await result.current.generate(mockParams);
    });

    expect(result.current.result).toEqual(mockResult);
    expect(result.current.error).toBeNull();
    expect(result.current.isGenerating).toBe(false);
  });

  it("retries on overload error", async () => {
    const mockError = {
      response: {
        status: 503,
        data: { error: "Model overloaded", retryable: true },
      },
    };

    (generationsAPI.create as jest.Mock)
      .mockRejectedValueOnce(mockError)
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce({
        id: "123",
        imageUrl: "/test.jpg",
        prompt: "Test",
        style: "realistic",
        status: "completed",
        createdAt: new Date().toISOString(),
      });

    const { result } = renderHook(() => useGenerate());

    await act(async () => {
      await result.current.generate(mockParams);
    });

    expect(generationsAPI.create).toHaveBeenCalledTimes(3);
    expect(result.current.result).toBeTruthy();
  });

  it("aborts generation", async () => {
    (generationsAPI.create as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 5000))
    );

    const { result } = renderHook(() => useGenerate());

    act(() => {
      result.current.generate(mockParams);
    });

    act(() => {
      result.current.abort();
    });

    expect(result.current.error).toBe("Generation cancelled");
  });
});
