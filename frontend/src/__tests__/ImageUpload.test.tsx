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

    // Updated to match the new UI text
    expect(screen.getByText(/upload your image/i)).toBeInTheDocument();
    expect(
      screen.getByText(/drag and drop or click to browse/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/png, jpg/i)).toBeInTheDocument();
    expect(screen.getByText(/max 10mb/i)).toBeInTheDocument();
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
    expect(mockOnSelect).not.toHaveBeenCalled();
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
    expect(mockOnSelect).not.toHaveBeenCalled();
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

  it("shows clear button when image is uploaded", async () => {
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
      expect(screen.getByText(/clear/i)).toBeInTheDocument();
    });
  });

  it("clears image when clear button is clicked", async () => {
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

    const clearButton = screen.getByText(/clear/i);
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
      expect(mockOnSelect).toHaveBeenCalledWith(null);
    });
  });

  it("shows change image button when preview is displayed", async () => {
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
      expect(screen.getByText(/change image/i)).toBeInTheDocument();
    });
  });

  it("shows ready badge when image is uploaded", async () => {
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
      expect(screen.getByText(/ready/i)).toBeInTheDocument();
    });
  });

  it("handles drag and drop", async () => {
    const mockOnSelect = jest.fn();
    render(<ImageUpload onImageSelect={mockOnSelect} selectedImage={null} />);

    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const dropZone = screen.getByRole("button", { name: /upload image/i });

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(mockOnSelect).toHaveBeenCalledWith(file);
  });
});
