import fs from "fs";
import { FLOODZONE, PARCEL } from "../constants";
import {
  FloodzoneIdentifier,
  FileReadResult,
  ValidationResult,
  FloodzoneData,
  ParcelData,
} from "../types/index";

// Verify that the file is a txt file
function verifyFileExtension(file: string) {
  return file.endsWith(".txt");
}

// Verify that the file exists
function verifyFileExists(file: string) {
  return fs.existsSync(file);
}

// Read the file data
function readFileData(file: string) {
  return fs.readFileSync(file, "utf8");
}

// Read the file
function readFile(file: string): FileReadResult {
  if (!verifyFileExists(file)) {
    return { isValid: false, invalidDataType: "FILE_NOT_FOUND" };
  }

  return { isValid: true, data: readFileData(file) };
}

// Parse the lines of the file
function parseLines(data: string) {
  return data.split("\n").filter((line) => line.trim());
}

// Verify that the file is in the correct format
function verifyCorrectFormat(data: string): ValidationResult {
  const lines = parseLines(data);

  if (lines.length === 0) {
    return { isValid: false, invalidDataType: "NO_DATA" };
  }

  const invalidLine = lines.find((line) => {
    return (
      !(line.startsWith(FLOODZONE) && verifyFloodzoneData(line)) &&
      !(line.startsWith(PARCEL) && verifyParcelData(line))
    );
  });

  if (invalidLine) {
    const dataType = invalidLine.startsWith(FLOODZONE)
      ? "FLOODZONE"
      : invalidLine.startsWith(PARCEL)
      ? "PARCEL"
      : "UNKNOWN";

    return { isValid: false, invalidDataType: dataType, invalidLine };
  }

  return { isValid: true };
}

// Verify that the floodzone data is in the correct format
function verifyFloodzoneData(data: string) {
  const parts = data.split(" ");

  return (
    parts[0] === FLOODZONE &&
    ["X", "AE", "VE"].includes(parts[1] as FloodzoneIdentifier) &&
    parts.length === 6 &&
    verifyCoordinates(parts.slice(2))
  );
}

// Verify that the parcel data is in the correct format
function verifyParcelData(data: string) {
  const parts = data.split(" ");

  return (
    parts[0] === PARCEL &&
    !isNaN(Number(parts[1])) &&
    parts.length === 6 &&
    verifyCoordinates(parts.slice(2))
  );
}

// Verify that the coordinates are in the correct format
function verifyCoordinates(coordinates: string[]) {
  return (
    coordinates.length === 4 &&
    coordinates.every((coord) => /^\d+,\d+$/.test(coord))
  );
}

// Parse the data into floodzones and parcels
function parseData(data: string) {
  const floodzones: FloodzoneData[] = [];
  const parcels: ParcelData[] = [];

  data.split("\n").forEach((line) => {
    if (!line.trim()) return;

    const [type, id, ...coords] = line.split(" ");
    if (coords.length !== 4) return;

    const coordinates = coords.map(
      (c) => c.split(",").map(Number) as [number, number]
    );

    if (type === FLOODZONE) {
      floodzones.push({ entityId: id as FloodzoneIdentifier, coordinates });
    } else if (type === PARCEL) {
      const entityId = Number(id);

      if (!isNaN(entityId)) parcels.push({ entityId, coordinates });
    }
  });

  return { floodzones, parcels };
}

// Handle the file
function handleFile(filepath: string) {
  const validExtension = verifyFileExtension(filepath);

  if (!validExtension) {
    process.stderr.write(
      "----- Error: Invalid file format. File must be a .txt file.\n"
    );
    process.exit(1);
  }

  const { isValid: isValidFile, data } = readFile(filepath);

  if (!isValidFile || !data) {
    process.stderr.write(`----- Error: File not found - ${filepath}\n`);
    process.exit(1);
  }

  const { isValid: isValidFormat, invalidDataType } = verifyCorrectFormat(data);

  if (!isValidFormat) {
    process.stderr.write(
      `----- Data format validation failed - invalid ${invalidDataType} data found\n`
    );
    process.exit(1);
  }

  return parseData(data);
}

export { handleFile };
