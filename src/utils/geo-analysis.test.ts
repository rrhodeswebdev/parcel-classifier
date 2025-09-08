import { describe, test, expect, vi } from "vitest";
import * as turf from "@turf/turf";
import {
  createPolygon,
  isPolygonClosed,
  generatePolygons,
  handleGeoAnalysis,
  prepareDataForPolygons,
  createClosedCoordinates,
  checkOverlaps,
  generateInsuredParcels,
  generateInsuredOutput,
} from "./geo-analysis";

describe("geo analysis utility functions", () => {
  test("handleGeoAnalysis correctly", () => {
    const mockWrite = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

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

    expect(mockWrite).toHaveBeenCalledWith(
      "\nParcel 1 should be insured against a VE zone\n"
    );
    expect(mockWrite).toHaveBeenCalledWith(
      "\nParcel 2 should be insured against a AE zone\n"
    );

    mockWrite.mockRestore();
  });

  test("generatePolygons correctly", () => {
    const mockPolygons = generatePolygons([
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
    ]);

    expect(mockPolygons).toStrictEqual([
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [15, 7],
              [15, 11],
              [22, 11],
              [22, 7],
              [15, 7],
            ],
          ],
        },
        properties: { name: "X" },
      },
    ]);
  });

  test("createPolygon correctly", () => {
    const mockPolygon = createPolygon(
      [
        [15, 7],
        [15, 11],
        [22, 11],
        [22, 7],
      ],
      "X"
    );

    expect(mockPolygon).toStrictEqual({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [15, 7],
            [15, 11],
            [22, 11],
            [22, 7],
            [15, 7],
          ],
        ],
      },
      properties: { name: "X" },
    });
  });

  test("isPolygonClosed correctly", () => {
    const mockPolygon = isPolygonClosed([
      [15, 7],
      [15, 11],
      [22, 11],
      [22, 7],
      [15, 7],
    ]);

    expect(mockPolygon).toStrictEqual(true);
  });

  test("isPolygonClosed correctly handles not closed coordinates", () => {
    const mockPolygon = isPolygonClosed([
      [15, 7],
      [15, 11],
      [22, 11],
      [22, 7],
    ]);

    expect(mockPolygon).toStrictEqual(false);
  });

  test("isPolygonClosed correctly handles empty coordinates", () => {
    const mockPolygon = isPolygonClosed([]);

    expect(mockPolygon).toStrictEqual(true);
  });

  test("prepareDataForPolygons correctly", () => {
    const mockData = prepareDataForPolygons([
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
    ]);

    expect(mockData).toStrictEqual([
      {
        type: "floodzone",
        entityId: "X",
        coordinates: [
          [15, 7],
          [15, 11],
          [22, 11],
          [22, 7],
          [15, 7],
        ],
      },
    ]);
  });

  test("createClosedCoordinates correctly", () => {
    const mockCoordinates = createClosedCoordinates([
      [15, 7],
      [15, 11],
      [22, 11],
      [22, 7],
    ]);

    expect(mockCoordinates).toStrictEqual([
      [15, 7],
      [15, 11],
      [22, 11],
      [22, 7],
      [15, 7],
    ]);
  });

  test("checkOverlaps when there is an overlap correctly", () => {
    const floodzones = [
      turf.polygon(
        [
          [
            [15, 7],
            [15, 11],
            [22, 11],
            [22, 7],
            [15, 7],
          ],
        ],
        { name: "X" }
      ),
    ];

    const parcels = [
      turf.polygon(
        [
          [
            [15, 7],
            [15, 11],
            [22, 11],
            [22, 7],
            [15, 7],
          ],
        ],
        { name: "1" }
      ),
    ];

    const mockOverlaps = checkOverlaps(floodzones, parcels);

    expect(mockOverlaps).toStrictEqual([{ parcel: "1", floodzone: "X" }]);
  });

  test("checkOverlaps when there is no overlap correctly", () => {
    const floodzones = [
      turf.polygon(
        [
          [
            [15, 7],
            [15, 11],
            [22, 11],
            [22, 7],
            [15, 7],
          ],
        ],
        { name: "X" }
      ),
    ];

    const parcels = [
      turf.polygon(
        [
          [
            [99, 99],
            [98, 99],
            [96, 96],
            [97, 97],
            [99, 99],
          ],
        ],
        { name: "1" }
      ),
    ];

    const mockOverlaps = checkOverlaps(floodzones, parcels);

    expect(mockOverlaps).toStrictEqual([]);
  });

  test("generateInsuredParcels correctly", () => {
    const mockInsuredParcels = generateInsuredParcels([
      { parcel: "1", floodzone: "X" },
      { parcel: "2", floodzone: "AE" },
      { parcel: "2", floodzone: "X" },
      { parcel: "3", floodzone: "AE" },
      { parcel: "3", floodzone: "VE" },
    ]);

    expect(mockInsuredParcels).toStrictEqual([
      { parcel: "1", floodzone: "X" },
      { parcel: "2", floodzone: "AE" },
      { parcel: "3", floodzone: "VE" },
    ]);
  });

  test("generateInsuredOutput correctly", () => {
    const mockWrite = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    generateInsuredOutput([
      { parcel: "1", floodzone: "X" },
      { parcel: "2", floodzone: "AE" },
      { parcel: "3", floodzone: "VE" },
    ]);

    expect(mockWrite).toHaveBeenCalledTimes(3);
    expect(mockWrite).toHaveBeenNthCalledWith(
      1,
      "\nParcel 1 should be insured against a X zone\n"
    );
    expect(mockWrite).toHaveBeenNthCalledWith(
      2,
      "\nParcel 2 should be insured against a AE zone\n"
    );
    expect(mockWrite).toHaveBeenNthCalledWith(
      3,
      "\nParcel 3 should be insured against a VE zone\n"
    );

    mockWrite.mockRestore();
  });
});
