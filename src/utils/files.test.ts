import { test, expect, describe, vi } from "vitest";
import { handleFile } from "./files";

describe("files utility functions", () => {
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
    const mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    handleFile("./sample-data/incorrect-floodzone-format.txt");

    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  test("handleFile incorrect parcel file format successfully", () => {
    const mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    handleFile("./sample-data/incorrect-parcel-format.txt");

    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  test("handleFile wrong filetype successfully", () => {
    const mockExit = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    handleFile("./sample-data/wrong-filetype.doc");

    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  test("handleFile invalid file path successfully", () => {
    const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    expect(() => handleFile("./sample-data/invalid-file-path.txt")).toThrow(
      "process.exit called"
    );

    mockExit.mockRestore();
  });

  test("handleFile no data successfully", () => {
    const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    expect(() => handleFile("./sample-data/empty-file.txt")).toThrow(
      "process.exit called"
    );

    mockExit.mockRestore();
  });

  test("handleFile unknown file data successfully", () => {
    const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    expect(() => handleFile("./sample-data/unknown-data-included.txt")).toThrow(
      "process.exit called"
    );

    mockExit.mockRestore();
  });
});
