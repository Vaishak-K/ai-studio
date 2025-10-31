import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageUpload from "@/components/ImageUpload";

// Mock fetch for restored images
global.fetch = jest.fn();

describe("ImageUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders upload area", () => {
    const mockOnSelect = jest.fn();
    render(<ImageUpload onImageSelect={mockOnSelect} selectedImage={null} />);

    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
  });

  it("handles file selection", () => {
    const mockOnSelect = jest.fn();
    const { container } = render(
      <ImageUpload onImageSelect={mockOnSelect} selectedImage={null} />
    );

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnSelect).toHaveBeenCalledWith(file);
  });

  it("validates file size", () => {
    const mockOnSelect = jest.fn();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();

    const { container } = render(
      <ImageUpload onImageSelect={mockOnSelect} selectedImage={null} />
    );

    const largeFile = new File(["x".repeat(11 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(alertSpy).toHaveBeenCalledWith("File size must be less than 10MB");
    alertSpy.mockRestore();
  });

  it("validates file type", () => {
    const mockOnSelect = jest.fn();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();

    const { container } = render(
      <ImageUpload onImageSelect={mockOnSelect} selectedImage={null} />
    );

    const txtFile = new File(["test"], "test.txt", { type: "text/plain" });
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [txtFile] } });

    expect(alertSpy).toHaveBeenCalledWith(
      "Only JPEG and PNG files are allowed"
    );
    alertSpy.mockRestore();
  });

  it("shows preview after upload", async () => {
    const mockOnSelect = jest.fn();
    const { container } = render(
      <ImageUpload onImageSelect={mockOnSelect} selectedImage={null} />
    );

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });
  });
});
