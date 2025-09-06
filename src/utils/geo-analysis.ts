import * as turf from "@turf/turf";
import { FloodzoneIdentifier, PolygonData } from "../types";
import { Feature, Polygon } from "geojson";

function generatePolygons(data: PolygonData[]) {
  const polygonData = prepareDataForPolygons(data);

  return polygonData.map((item) =>
    createPolygon(item.coordinates, item.entityId)
  );
}

function createPolygon(
  coordinates: PolygonData["coordinates"],
  identifier: FloodzoneIdentifier | number
) {
  const closedCoordinates = ensureClosedPolygon(coordinates);

  const properties: { name: string } = {
    name: identifier.toString(),
  };

  return turf.polygon([closedCoordinates], properties);
}

function ensureClosedPolygon(coordinates: number[][]): number[][] {
  if (coordinates.length === 0) return coordinates;

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];

  if (first[0] !== last[0] || first[1] !== last[1]) {
    return [...coordinates, first];
  }

  return coordinates;
}

function prepareDataForPolygons(data: PolygonData[]) {
  return data.map((item) => {
    const closedCoordinates = [...item.coordinates];

    if (!ensureClosedPolygon(closedCoordinates)) {
      closedCoordinates.push(closedCoordinates[0]);
    }

    return { ...item, coordinates: closedCoordinates };
  });
}

function checkOverlaps(
  floodzones: Feature<Polygon>[],
  parcels: Feature<Polygon>[]
) {
  return floodzones.flatMap((floodzone) =>
    parcels
      .filter((parcel) => turf.booleanIntersects(floodzone, parcel))
      .map((parcel) => ({
        parcel: parcel.properties?.name || "Unknown",
        floodzone: floodzone.properties?.name || "Unknown",
      }))
  );
}

function generateInsuredParcels(
  overlaps: { parcel: string; floodzone: string }[]
) {
  const importanceOrder = ["VE", "AE", "X"];

  const bestOverlaps = overlaps.reduce((acc, overlap) => {
    const existing = acc[overlap.parcel];

    if (
      !existing ||
      importanceOrder.indexOf(overlap.floodzone) <
        importanceOrder.indexOf(existing.floodzone)
    ) {
      acc[overlap.parcel] = overlap;
    }

    return acc;
  }, {} as Record<string, { parcel: string; floodzone: string }>);

  return Object.values(bestOverlaps);
}

function generateInsuredOutput(
  insuredParcels: { parcel: string; floodzone: string }[]
) {
  insuredParcels.map((overlap) => {
    process.stdout.write(
      `\nParcel ${overlap.parcel} should be insured by ${overlap.floodzone}\n`
    );
  });
}

function handleGeoAnalysis(parsedData: {
  floodzones: PolygonData[];
  parcels: PolygonData[];
}) {
  const { floodzones, parcels } = parsedData;

  const floodzonePolygons = generatePolygons(floodzones);
  const parcelPolygons = generatePolygons(parcels);

  const overlap = checkOverlaps(floodzonePolygons, parcelPolygons);
  const insuredParcels = generateInsuredParcels(overlap);

  generateInsuredOutput(insuredParcels);
}

export { handleGeoAnalysis };
