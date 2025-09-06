export type FloodzoneIdentifier = "X" | "AE" | "VE";
export type PolygonData = FloodzoneData | ParcelData;

export type FloodzoneData = {
	entityId: FloodzoneIdentifier;
  coordinates: [number, number][];
};

export type ParcelData = {
	entityId: number;
  coordinates: [number, number][];
};

// Enhanced validation result interface
export interface ValidationResult {
    isValid: boolean;
    invalidDataType?: 'FLOODZONE' | 'PARCEL' | 'NO_DATA' | 'UNKNOWN';
    invalidLine?: string;
  }
  
  // File read result interface
  export interface FileReadResult {
    isValid: boolean;
    data?: string;
    invalidDataType?: 'FILE_NOT_FOUND';
  }