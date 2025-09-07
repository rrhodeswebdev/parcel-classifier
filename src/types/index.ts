export type FloodzoneIdentifier = "X" | "AE" | "VE";

interface BasePolygonData {
  coordinates: [number, number][];
}

export interface FloodzoneData extends BasePolygonData {
  entityId: FloodzoneIdentifier;
}

export interface ParcelData extends BasePolygonData {
  entityId: number;
}

export type PolygonData = FloodzoneData | ParcelData;

export type ValidationErrorType =
  | "FLOODZONE"
  | "PARCEL"
  | "NO_DATA"
  | "UNKNOWN";

export type FileErrorType = "FILE_NOT_FOUND";

export interface ValidationResult {
  isValid: boolean;
  invalidDataType?: ValidationErrorType;
  invalidLine?: string;
}

export interface FileReadResult {
  isValid: boolean;
  data?: string;
  invalidDataType?: FileErrorType;
}
