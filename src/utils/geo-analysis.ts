import * as turf from "@turf/turf";
import { PolygonData } from "../types";
import { Feature, Polygon } from "geojson";

function generatePolygons(data: PolygonData[]) {
  const polygonData = prepareDataForPolygons(data);

  const polygons = polygonData.map((item) => {
    const polygon = createPolygon(item.coordinates, item.entityId);

    return polygon;
  });

  return polygons;
}

function createPolygon(
  coordinates: PolygonData["coordinates"],
  identifier: string | number
) {
  const polygon = turf.polygon([coordinates], { name: identifier });
  return polygon;
}

function prepareDataForPolygons(data: PolygonData[]) {
  return data.map((item) => {
    const closedCoordinates = [...item.coordinates];

    if (
      closedCoordinates.length > 0 &&
      (closedCoordinates[0][0] !==
        closedCoordinates[closedCoordinates.length - 1][0] ||
        closedCoordinates[0][1] !==
          closedCoordinates[closedCoordinates.length - 1][1])
    ) {
      closedCoordinates.push(closedCoordinates[0]);
    }

    return { ...item, coordinates: closedCoordinates };
  });
}

function checkOverlaps(
  floodzones: Feature<Polygon>[],
  parcels: Feature<Polygon>[]
) {
  let overlaps: { parcel: string; floodzone: string }[] = [];

  for (const floodzone of floodzones) {
    for (const parcel of parcels) {
      if (turf.booleanIntersects(floodzone, parcel)) {
        overlaps.push({
          parcel: parcel.properties?.name,
          floodzone: floodzone.properties?.name,
        });
      }
    }
  }
  return overlaps;
}

function generateInsuredParcels(overlaps: { parcel: string; floodzone: string }[]) {
  const importanceOrder = ['VE', 'AE', 'X'];

  const bestOverlaps = overlaps.reduce((acc, overlap) => {
    const existing = acc[overlap.parcel];
    
    if (!existing || importanceOrder.indexOf(overlap.floodzone) < importanceOrder.indexOf(existing.floodzone)) {
      acc[overlap.parcel] = overlap;
    }
    
    return acc;
  }, {} as Record<string, { parcel: string; floodzone: string }>);

  return Object.values(bestOverlaps);
}

function generateInsuredOutput(insuredParcels: { parcel: string; floodzone: string }[]) {
  insuredParcels.map((overlap) => {
    process.stdout.write(`\nParcel ${overlap.parcel} should be insured by ${overlap.floodzone}\n`);
  });
}

function handleGeoAnalysis(parsedData: { floodzones: PolygonData[]; parcels: PolygonData[] }) {
    const floodzones = parsedData.floodzones;
    const parcels = parsedData.parcels;

    const floodzonePolygons = generatePolygons(floodzones);
    const parcelPolygons = generatePolygons(parcels);

    const overlap = checkOverlaps(floodzonePolygons, parcelPolygons);

    const insuredParcels = generateInsuredParcels(overlap);

    generateInsuredOutput(insuredParcels);
}

export { handleGeoAnalysis };
