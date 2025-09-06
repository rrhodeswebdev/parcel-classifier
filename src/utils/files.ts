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
  if (file.endsWith(".txt")) {
    return true;
  }
  return false;
}

function verifyFileExists(file: string) {
  if (fs.existsSync(file)) {
    return true;
  }
  return false;
}

// Read the file
function readFile(file: string): FileReadResult {
  if (!verifyFileExists(file)) {
    return { isValid: false, invalidDataType: "FILE_NOT_FOUND" };
  }

  return { isValid: true, data: fs.readFileSync(file, "utf8") };
}

// Verify that the file is in the correct format
function verifyCorrectFormat(data: string): ValidationResult {
  const lines = data.split("\n").filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return { isValid: false, invalidDataType: "UNKNOWN" };
  }

  for (const line of lines) {
    let isValidLine = false;
    let dataType: "FLOODZONE" | "PARCEL" | "UNKNOWN" = "UNKNOWN";

    if (line.startsWith(FLOODZONE)) {
      isValidLine = verifyFloodzoneData(line);
      dataType = "FLOODZONE";
    } else if (line.startsWith(PARCEL)) {
      isValidLine = verifyParcelData(line);
      dataType = "PARCEL";
    }

    if (!isValidLine) {
      return {
        isValid: false,
        invalidDataType: dataType,
        invalidLine: line,
      };
    }
  }

  return { isValid: true };
}

// Verify that the data is in the correct format for floodzones
function verifyFloodzoneData(data: string) {
  const parts = data.trim().split(" ");

  if (parts[0] !== FLOODZONE) {
    return false;
  }

  const identifier = parts[1] as FloodzoneIdentifier;
  const validIdentifiers: FloodzoneIdentifier[] = ["X", "AE", "VE"];

  if (!validIdentifiers.includes(identifier)) {
    return false;
  }

  const coordinates = parts.slice(2);

  if (coordinates.length < 4) {
    return false;
  }

  for (const coord of coordinates) {
    if (!coord.match(/^\d+,\d+$/)) {
      return false;
    }
  }

  return true;
}

// Verify that the data is in the correct format for parcels
function verifyParcelData(data: string) {
  const parts = data.trim().split(" ");

  if (parts[0] !== PARCEL) {
    return false;
  }

  // Check if we have a parcel ID (should be a number)
  const parcelId = parts[1];
  if (isNaN(Number(parcelId))) {
    return false;
  }

  // Check coordinates (should have at least 4 coordinate pairs)
  const coordinates = parts.slice(2);

  if (coordinates.length < 4) {
    return false;
  }

  for (const coord of coordinates) {
    if (!coord.match(/^\d+,\d+$/)) {
      return false;
    }
  }

  return true;
}

function parseData(data: string) {
  const lines = data.split("\n").filter((line) => line.trim() !== "");

  let floodzones: FloodzoneData[] = [];
  let parcels: ParcelData[] = [];

  for (const line of lines) {
    if (line.startsWith(FLOODZONE)) {
      const parts = line.split(" ");
      floodzones.push({
        entityId: parts[1] as FloodzoneIdentifier,
        coordinates: parts.slice(2).map((coord) => {
          const [x, y] = coord.split(",");
          return [Number(x), Number(y)];
        }),
      });
    } else if (line.startsWith(PARCEL)) {
      const parts = line.split(" ");
      parcels.push({
        entityId: Number(parts[1]),
        coordinates: parts.slice(2).map((coord) => {
          const [x, y] = coord.split(",");
          return [Number(x), Number(y)];
        }),
      });
    }
  }

  return {
    floodzones,
    parcels,
  };
}

export {
  verifyCorrectFormat,
  verifyFileExtension,
  verifyFileExists,
  readFile,
  verifyFloodzoneData,
  verifyParcelData,
  parseData,
};
