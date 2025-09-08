import { test, expect, describe, vi, afterEach, beforeEach } from "vitest";
import {
  handleFile,
  readFileData,
  verifyFileExists,
  verifyFileExtension,
  readFile,
  parseLines,
  verifyCorrectFormat,
  verifyFloodzoneData,
  verifyParcelData,
  verifyCoordinates,
  parseData,
} from "./files";
import fs from "fs";

describe("files utility functions", () => {
  let mockExit: any;

  beforeEach(() => {
    mockExit = vi.spyOn(process, "exit").mockImplementation((() => {}) as any);
  });

  afterEach(() => {
    mockExit.mockRestore();
  });

  test("handleFile correct file format successfully", () => {
    expect(handleFile("./sample-data/parcel-1.txt")).toStrictEqual({
      floodzones: [
        {
          type: "floodzone",
          entityId: "X",
          coordinates: [
            [15, 7],
            [15, 11],
            [22, 11],
            [22, 7],
          ],
        },
        {
          type: "floodzone",
          entityId: "AE",
          coordinates: [
            [0, 20],
            [0, 24],
            [20, 24],
            [20, 20],
          ],
        },
        {
          type: "floodzone",
          entityId: "AE",
          coordinates: [
            [12, 14],
            [12, 20],
            [18, 20],
            [18, 14],
          ],
        },
        {
          type: "floodzone",
          entityId: "VE",
          coordinates: [
            [0, 0],
            [0, 20],
            [12, 20],
            [12, 0],
          ],
        },
      ],
      parcels: [
        {
          type: "parcel",
          entityId: 1,
          coordinates: [
            [8, 17],
            [8, 22],
            [15, 22],
            [15, 17],
          ],
        },
        {
          type: "parcel",
          entityId: 2,
          coordinates: [
            [16, 8],
            [16, 15],
            [25, 15],
            [25, 8],
          ],
        },
        {
          type: "parcel",
          entityId: 3,
          coordinates: [
            [16, 3],
            [16, 5],
            [20, 5],
            [20, 3],
          ],
        },
      ],
    });
  });

  test("handleFile incorrect floodzone file format successfully", () => {
    handleFile("./sample-data/incorrect-floodzone-format.txt");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test("handleFile incorrect parcel file format successfully", () => {
    handleFile("./sample-data/incorrect-parcel-format.txt");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test("handleFile wrong filetype successfully", () => {
    handleFile("./sample-data/wrong-filetype.doc");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test("handleFile invalid file path successfully", () => {
    mockExit.mockImplementation(() => {
      throw new Error("process.exit called");
    });

    expect(() => handleFile("./sample-data/invalid-file-path.txt")).toThrow(
      "process.exit called"
    );
  });

  test("handleFile no data successfully", () => {
    mockExit.mockImplementation(() => {
      throw new Error("process.exit called");
    });

    expect(() => handleFile("./sample-data/empty-file.txt")).toThrow(
      "process.exit called"
    );
  });

  test("handleFile unknown file data successfully", () => {
    mockExit.mockImplementation(() => {
      throw new Error("process.exit called");
    });

    expect(() => handleFile("./sample-data/unknown-data-included.txt")).toThrow(
      "process.exit called"
    );
  });

  test("verifyFileExtension returns true for .txt file", () => {
    expect(verifyFileExtension("./sample-data/parcel-1.txt")).toBeTruthy();
  });

  test("verifyFileExtension returns false for .doc file", () => {
    expect(verifyFileExtension("./sample-data/parcel-1.doc")).toBeFalsy();
  });

  test("verifyFileExtension returns false for .txt file with wrong extension", () => {
    expect(verifyFileExtension("./sample-data/parcel-1.txt.doc")).toBeFalsy();
  });

  test("verifyFileExists returns true for existing file", () => {
    expect(verifyFileExists("./sample-data/parcel-1.txt")).toBeTruthy();
  });

  test("verifyFileExists returns false for non-existing file", () => {
    expect(verifyFileExists("./sample-data/par.txt")).toBeFalsy();
  });

  test("readFileData returns correct data for existing file", () => {
    const mockData =
      "FLOODZONE X 15,7 15,11 22,11 22,7\nFLOODZONE AE 0,20 0,24 20,24 20,20\nFLOODZONE AE 12,14 12,20 18,20 18,14\nFLOODZONE VE 0,0 0,20 12,20 12,0\nPARCEL 1 8,17 8,22 15,22 15,17\nPARCEL 2 16,8 16,15 25,15 25,8\nPARCEL 3 16,3 16,5 20,5 20,3";

    vi.spyOn(fs, "readFileSync").mockReturnValue(mockData);

    expect(readFileData("./sample-data/parcel-1.txt")).toBe(mockData);
  });

  test("readFile returns correct data for existing file", () => {
    const mockData =
      "FLOODZONE X 15,7 15,11 22,11 22,7\nFLOODZONE AE 0,20 0,24 20,24 20,20\nFLOODZONE AE 12,14 12,20 18,20 18,14\nFLOODZONE VE 0,0 0,20 12,20 12,0\nPARCEL 1 8,17 8,22 15,22 15,17\nPARCEL 2 16,8 16,15 25,15 25,8\nPARCEL 3 16,3 16,5 20,5 20,3";

    vi.spyOn(fs, "readFileSync").mockReturnValue(mockData);

    expect(readFile("./sample-data/parcel-1.txt")).toStrictEqual({
      success: true,
      data: mockData,
    });
  });

  test("readFile returns error for non-existing file", () => {
    expect(readFile("./sample-data/parce.txt")).toStrictEqual({
      success: false,
      error: {
        type: "FILE_NOT_FOUND",
        message: "File not found: ./sample-data/parce.txt",
      },
    });
  });

  test("parseLines returns correct lines for existing file", () => {
    const mockData =
      "FLOODZONE X 15,7 15,11 22,11 22,7\nFLOODZONE AE 0,20 0,24 20,24 20,20\nFLOODZONE AE 12,14 12,20 18,20 18,14\nFLOODZONE VE 0,0 0,20 12,20 12,0\nPARCEL 1 8,17 8,22 15,22 15,17\nPARCEL 2 16,8 16,15 25,15 25,8\nPARCEL 3 16,3 16,5 20,5 20,3";

    expect(parseLines(mockData)).toStrictEqual([
      "FLOODZONE X 15,7 15,11 22,11 22,7",
      "FLOODZONE AE 0,20 0,24 20,24 20,20",
      "FLOODZONE AE 12,14 12,20 18,20 18,14",
      "FLOODZONE VE 0,0 0,20 12,20 12,0",
      "PARCEL 1 8,17 8,22 15,22 15,17",
      "PARCEL 2 16,8 16,15 25,15 25,8",
      "PARCEL 3 16,3 16,5 20,5 20,3",
    ]);
  });

  test("verifyCorrectFormat returns success for valid data", () => {
    const mockData =
      "FLOODZONE X 15,7 15,11 22,11 22,7\nFLOODZONE AE 0,20 0,24 20,24 20,20\nFLOODZONE AE 12,14 12,20 18,20 18,14\nFLOODZONE VE 0,0 0,20 12,20 12,0\nPARCEL 1 8,17 8,22 15,22 15,17\nPARCEL 2 16,8 16,15 25,15 25,8\nPARCEL 3 16,3 16,5 20,5 20,3";

    expect(verifyCorrectFormat(mockData)).toStrictEqual({
      success: true,
    });
  });

  test("verifyCorrectFormat returns error for invalid floodzone data", () => {
    const mockData =
      "FLOODZONE 15,7 15,11 22,11 22,7\nFLOODZONE AE 0,20 0,24 20,24 20,20\nFLOODZONE AE 12,14 12,20 18,20 18,14\nFLOODZONE VE 0,0 0,20 12,20 12,0\nPARCEL 1 8,17 8,22 15,22 15,17\nPARCEL 2 16,8 16,15 25,15 25,8\nPARCEL 3 16,3 16,5 20,5 20,3";

    expect(verifyCorrectFormat(mockData)).toStrictEqual({
      success: false,
      error: {
        type: "FLOODZONE",
        message: "Invalid floodzone data format",
      },
    });
  });

  test("verifyCorrectFormat returns error for invalid parcel data", () => {
    const mockData =
      "FLOODZONE X 15,7 15,11 22,11 22,7\nFLOODZONE AE 0,20 0,24 20,24 20,20\nFLOODZONE AE 12,14 12,20 18,20 18,14\nFLOODZONE VE 0,0 0,20 12,20 12,0\nPARCEL 8,17 8,22 15,22 15,17\nPARCEL 2 16,8 16,15 25,15 25,8\nPARCEL 3 16,3 16,5 20,5 20,3";

    expect(verifyCorrectFormat(mockData)).toStrictEqual({
      success: false,
      error: {
        type: "PARCEL",
        message: "Invalid parcel data format",
      },
    });
  });

  test("verifyCorrectFormat returns error for no data", () => {
    const mockData = "";

    expect(verifyCorrectFormat(mockData)).toStrictEqual({
      success: false,
      error: {
        type: "NO_DATA",
        message: "File contains no valid data lines",
      },
    });
  });

  test("verifyCorrectFormat returns error for unknown data", () => {
    const mockData = "UNKNOWN 15,7 15,11 22,11 22,7";

    expect(verifyCorrectFormat(mockData)).toStrictEqual({
      success: false,
      error: { type: "UNKNOWN", message: "Invalid unknown data format" },
    });
  });

  test("verifyFloodzoneData returns true for valid floodzone data", () => {
    const mockData = "FLOODZONE X 15,7 15,11 22,11 22,7";

    expect(verifyFloodzoneData(mockData)).toBeTruthy();
  });

  test("verifyFloodzoneData returns false for invalid floodzone data", () => {
    const mockData = "FLOODZONE 15,7 15,11 22,11 22,7";

    expect(verifyFloodzoneData(mockData)).toBeFalsy();
  });

  test("verifyParcelData returns true for valid parcel data", () => {
    const mockData = "PARCEL 1 8,17 8,22 15,22 15,17";

    expect(verifyParcelData(mockData)).toBeTruthy();
  });

  test("verifyParcelData returns false for invalid parcel data", () => {
    const mockData = "PARCEL 8,17 8,22 15,22 15,17";

    expect(verifyParcelData(mockData)).toBeFalsy();
  });

  test("verifyCoordinates returns true for valid coordinates", () => {
    const mockData = ["15,7", "15,11", "22,11", "22,7"];

    expect(verifyCoordinates(mockData)).toBeTruthy();
  });

  test("verifyCoordinates returns false for invalid coordinates", () => {
    const mockData = ["15,7", "15,11", "22,11", "22", "23,23"];

    expect(verifyCoordinates(mockData)).toBeFalsy();
  });

  test("parseData returns correct data for valid data", () => {
    const mockData =
      "FLOODZONE X 15,7 15,11 22,11 22,7\nFLOODZONE AE 0,20 0,24 20,24 20,20\nFLOODZONE AE 12,14 12,20 18,20 18,14\nFLOODZONE VE 0,0 0,20 12,20 12,0\nPARCEL 1 8,17 8,22 15,22 15,17\nPARCEL 2 16,8 16,15 25,15 25,8\nPARCEL 3 16,3 16,5 20,5 20,3";

    expect(parseData(mockData)).toStrictEqual({
      floodzones: [
        {
          type: "floodzone",
          entityId: "X",
          coordinates: [
            [15, 7],
            [15, 11],
            [22, 11],
            [22, 7],
          ],
        },
        {
          type: "floodzone",
          entityId: "AE",
          coordinates: [
            [0, 20],
            [0, 24],
            [20, 24],
            [20, 20],
          ],
        },
        {
          type: "floodzone",
          entityId: "AE",
          coordinates: [
            [12, 14],
            [12, 20],
            [18, 20],
            [18, 14],
          ],
        },
        {
          type: "floodzone",
          entityId: "VE",
          coordinates: [
            [0, 0],
            [0, 20],
            [12, 20],
            [12, 0],
          ],
        },
      ],
      parcels: [
        {
          type: "parcel",
          entityId: 1,
          coordinates: [
            [8, 17],
            [8, 22],
            [15, 22],
            [15, 17],
          ],
        },
        {
          type: "parcel",
          entityId: 2,
          coordinates: [
            [16, 8],
            [16, 15],
            [25, 15],
            [25, 8],
          ],
        },
        {
          type: "parcel",
          entityId: 3,
          coordinates: [
            [16, 3],
            [16, 5],
            [20, 5],
            [20, 3],
          ],
        },
      ],
    });
  });

  test("parseData handles blank lines successfully", () => {
    const mockData =
      "FLOODZONE AE 12,14 12,20 18,20 18,14\n\nPARCEL 1 8,17 8,22 15,22 15,17\n";

    expect(parseData(mockData)).toStrictEqual({
      floodzones: [
        {
          type: "floodzone",
          entityId: "AE",
          coordinates: [
            [12, 14],
            [12, 20],
            [18, 20],
            [18, 14],
          ],
        },
      ],
      parcels: [
        {
          type: "parcel",
          entityId: 1,
          coordinates: [
            [8, 17],
            [8, 22],
            [15, 22],
            [15, 17],
          ],
        },
      ],
    });
  });
});
