export type FloodzoneIdentifier = "X" | "AE" | "VE";
export type Coordinates = [number, number][];

export interface FloodzoneData {
  readonly type: "floodzone";
  readonly entityId: FloodzoneIdentifier;
  readonly coordinates: Coordinates;
}

export interface ParcelData {
  readonly type: "parcel";
  readonly entityId: number;
  readonly coordinates: Coordinates;
}

export type PolygonData = FloodzoneData | ParcelData;

export type ErrorType = 
  | "FLOODZONE"
  | "PARCEL" 
  | "NO_DATA"
  | "UNKNOWN"
  | "FILE_NOT_FOUND";

export interface Result<T, E = ErrorType> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly type: E;
    readonly message?: string;
  };
}

export type FileReadResult = Result<string, "FILE_NOT_FOUND">;
export type ValidationResult = Result<void, Exclude<ErrorType, "FILE_NOT_FOUND">>;

export interface ParsedData {
  readonly floodzones: FloodzoneData[];
  readonly parcels: ParcelData[];
}
