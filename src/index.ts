import { Command } from "commander";
import { handleFile } from "./utils/files";

import { handleGeoAnalysis } from "./utils/geo-analysis";

const program = new Command();

program
  .version("0.0.1")
  .description("Parcel Classification")
  .option("-f, --file <file>", "Path to the txt file")
  .action((options) => {
    const parsedData = handleFile(options);

    handleGeoAnalysis(parsedData);

    process.exit(0);
  });

program.parse(process.argv);
