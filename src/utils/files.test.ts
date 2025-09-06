import { test, expect, describe } from "vitest";
import {
  readFile,
  verifyCorrectFormat,
  verifyFileExtension,
  verifyFloodzoneData,
  verifyParcelData,
} from "./files";

describe("files utility functions", () => {
  test("verifyFileExtension successfully", () => {
    expect(verifyFileExtension("test.txt")).toBe(true);
    expect(verifyFileExtension("test.pdf")).toBe(false);
  });

  test("readFile successfully", () => {
    const result = readFile("./sample-data/parcel-2.txt");
    expect(result.isValid).toBe(true);
    expect(result.data).toContain("FLOODZONE X 12,10 12,15 30,15 30,10");
  });

  test("verifyCorrectFormat for correct format", () => {
    const data = readFile("./sample-data/parcel-2.txt");
    const result = verifyCorrectFormat(data.data!);
    expect(result.isValid).toBe(true);
  });

  test("verifyCorrectFormat for empty data", () => {
    const result = verifyCorrectFormat("");
    expect(result.isValid).toBe(false);
    expect(result.invalidDataType).toBe("UNKNOWN");
  });

  test("verifyFloodzoneData for correct floodzone format", () => {
    const data = readFile("./sample-data/parcel-2.txt");
    const firstFloodzoneeLine = data.data!.split("\n")[0];
    expect(verifyFloodzoneData(firstFloodzoneeLine)).toBe(true);
  });

  test("verifyFloodzoneData for incorrect format", () => {
    expect(verifyFloodzoneData("FLOODZONE INVALID 1,2 3,4")).toBe(false);
    expect(verifyFloodzoneData("FLOODZONE X 1,2")).toBe(false);
  });

  test("verifyParcelData for correct parcel format", () => {
    const data = readFile("./sample-data/parcel-2.txt");
    const firstParcelLine = data
      .data!.split("\n")
      .find((line) => line.startsWith("PARCEL"));
    expect(verifyParcelData(firstParcelLine!)).toBe(true);
  });

  test("verifyParcelData for incorrect format", () => {
    expect(verifyParcelData("PARCEL notanumber 1,2 3,4 5,6 7,8")).toBe(false);
    expect(verifyParcelData("PARCEL 1 1,2")).toBe(false);
  });
});
