import { test, expect, describe, vi, beforeEach, afterEach } from "vitest";
import { handleFile } from "./utils/files.js";
import { handleGeoAnalysis } from "./utils/geo-analysis.js";

vi.mock("./utils/files.js");
vi.mock("./utils/geo-analysis.js");

const mockHandleFile = vi.mocked(handleFile);
const mockHandleGeoAnalysis = vi.mocked(handleGeoAnalysis);

describe("CLI Application", () => {
  let mockExit: any;
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = process.argv;
    mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    mockHandleFile.mockClear();
    mockHandleGeoAnalysis.mockClear();

    // Clear module cache to ensure fresh imports
    vi.resetModules();
  });

  afterEach(() => {
    process.argv = originalArgv;
    mockExit.mockRestore();
  });

  test("should execute CLI with file option", async () => {
    const mockParsedData = { parcels: [], floodzones: [] };
    mockHandleFile.mockReturnValue(mockParsedData);

    // Set up process.argv as if CLI was called with --file option
    process.argv = ["node", "index.js", "--file", "test-file.txt"];

    // Import the module to execute it
    await import("./index.js");

    expect(mockHandleFile).toHaveBeenCalledWith("test-file.txt");
    expect(mockHandleGeoAnalysis).toHaveBeenCalledWith(mockParsedData);
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test("should execute CLI with short file option", async () => {
    const mockParsedData = {
      parcels: [
        {
          type: "parcel" as const,
          entityId: 1,
          coordinates: [
            [0, 0],
            [1, 1],
          ] as [number, number][],
        },
      ],
      floodzones: [
        {
          type: "floodzone" as const,
          entityId: "AE" as const,
          coordinates: [
            [0, 0],
            [2, 2],
          ] as [number, number][],
        },
      ],
    };
    mockHandleFile.mockReturnValue(mockParsedData);

    process.argv = ["node", "index.js", "-f", "another-test.txt"];

    await import("./index.js");

    expect(mockHandleFile).toHaveBeenCalledWith("another-test.txt");
    expect(mockHandleGeoAnalysis).toHaveBeenCalledWith(mockParsedData);
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
