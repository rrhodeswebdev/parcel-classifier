// Todo:
// 3. Read the file and verify the data in the file is correct
// 4. Parse the data in the file
// 5. Floodzones and parcels should be in separate arrays

import { Command } from "commander";
import {
  readFile,
  verifyCorrectFormat,
  verifyFileExtension,
  parseData,
} from "./utils/files";

import { checkOverlaps, generateInsuredOutput, generateInsuredParcels, generatePolygons } from "./utils/geo-analysis";

const program = new Command();

program
  .version("0.0.1")
  .description("Parcel Classification")
  .option("-f, --file <file>", "Path to the txt file")
  .action(async (options) => {
    if (!verifyFileExtension(options.file)) {
      console.error(
        "+++++ Error: Invalid file format. File must be a .txt file."
      );
      process.exit(1);
    }

    console.log(`+++++ TXT file detected: ${options.file}`);

    const fileResult = readFile(options.file);

    if (!fileResult.isValid) {
      console.error(`+++++ Error: File not found - ${options.file}`);
      process.exit(1);
    }

    console.log("+++++ File data read successfully");

    const validationResult = verifyCorrectFormat(fileResult.data!);

    if (validationResult.isValid) {
      console.log(
        "+++++ Data format validation passed - all data is in correct format"
      );
    } else {
      console.log(
        `+++++ Data format validation failed - invalid ${
          validationResult.invalidDataType || "DATA"
        } data found`
      );
	  process.exit(1);
    }

    const parsedData = parseData(fileResult.data!);
    console.log("+++++ Data parsed successfully");

    const floodzones = parsedData.floodzones;
    const parcels = parsedData.parcels;

    const floodzonePolygons = generatePolygons(floodzones);
    const parcelPolygons = generatePolygons(parcels);

    console.log(
      `+++++ Processing complete. Found ${floodzones.length} floodzones and ${parcels.length} parcels.\n\n`
    );

	const overlap = checkOverlaps(floodzonePolygons, parcelPolygons);

	const insuredParcels = generateInsuredParcels(overlap);

	generateInsuredOutput(insuredParcels);
  });

program.parse(process.argv);
