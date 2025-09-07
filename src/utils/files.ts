import fs from "fs";
import { FLOODZONE, PARCEL } from "../constants";
import type {
  FloodzoneIdentifier,
  FileReadResult,
  ValidationResult,
  FloodzoneData,
  ParcelData,
  ParsedData,
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
    return {
      success: false,
      error: {
        type: "FILE_NOT_FOUND",
        message: `File not found: ${file}`,
      },
    };
  }

  return { success: true, data: readFileData(file) };
}

// Parse the lines of the file
function parseLines(data: string) {
  return data.split("\n").filter((line) => line.trim());
}

// Verify that the file is in the correct format
function verifyCorrectFormat(data: string): ValidationResult {
  const lines = parseLines(data);

  if (lines.length === 0) {
    return {
      success: false,
      error: {
        type: "NO_DATA",
        message: "File contains no valid data lines",
      },
    };
  }

  const invalidLine = lines.find((line) => {
    return (
      !(line.startsWith(FLOODZONE) && verifyFloodzoneData(line)) &&
      !(line.startsWith(PARCEL) && verifyParcelData(line))
    );
  });

  if (invalidLine) {
    const errorType = invalidLine.startsWith(FLOODZONE)
      ? "FLOODZONE"
      : invalidLine.startsWith(PARCEL)
      ? "PARCEL"
      : "UNKNOWN";

    return {
      success: false,
      error: {
        type: errorType,
        message: `Invalid ${errorType.toLowerCase()} data format`,
      },
    };
  }

  return { success: true };
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
function parseData(data: string): ParsedData {
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
      floodzones.push({
        type: "floodzone",
        entityId: id as FloodzoneIdentifier,
        coordinates,
      });
    } else if (type === PARCEL) {
      const entityId = Number(id);

      if (!isNaN(entityId)) {
        parcels.push({
          type: "parcel",
          entityId,
          coordinates,
        });
      }
    }
  });

  return { floodzones, parcels };
}

// Handle the file
function handleFile(filepath: string): ParsedData {
  const validExtension = verifyFileExtension(filepath);

  if (!validExtension) {
    process.stderr.write(
      "----- Error: Invalid file format. File must be a .txt file.\n"
    );
    process.exit(1);
  }

  const fileResult = readFile(filepath);

  if (!fileResult.success || !fileResult.data) {
    const errorMessage =
      fileResult.error?.message || `File not found - ${filepath}`;
    process.stderr.write(`----- Error: ${errorMessage}\n`);
    process.exit(1);
  }

  const validationResult = verifyCorrectFormat(fileResult.data);

  if (!validationResult.success) {
    const error = validationResult.error!;
    process.stderr.write(
      `----- Data format validation failed - ${error.message}\n`
    );
    
    process.exit(1);
  }

  return parseData(fileResult.data);
}

export { handleFile };
