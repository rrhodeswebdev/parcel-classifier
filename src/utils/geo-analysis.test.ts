import { describe, test, expect, vi } from "vitest";
import { handleGeoAnalysis } from "./geo-analysis";

describe("geo analysis utility functions", () => {
  test("handleGeoAnalysis correctly", () => {
    const mockWrite = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    
    handleGeoAnalysis({
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

    expect(mockWrite).toHaveBeenCalledWith('\nParcel 1 should be insured by VE\n');
    expect(mockWrite).toHaveBeenCalledWith('\nParcel 2 should be insured by AE\n');
    
    mockWrite.mockRestore();
  });
});
