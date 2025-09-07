# Parcel Classification

## Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Install from source

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd parcel-classification
   ```

2. Install and setup the CLI globally:

   ```bash
   npm run cli:install
   ```

3. Use the CLI from anywhere:
   ```bash
   parcel-classification
   ```

Alternatively, you can run directly without global installation:

```bash
npm run install
npm run build
node dist/index.js -f <file-path>
```

### Uninstall

Simply run the following to uninstall the CLI tool

```bash
npm run cli:uninstall
```

## Usage

Once installed, you can use the CLI tool:

```bash
parcel-classification -f <file-path>
```

or

```bash
node dist/index.js -f <file-path>
```

For help, use the following

```bash
parcel-classification --help
```

or

```bash
node dist/index.js -f <file-path>
```

This will show you all available commands and options.

I also provided multiple files for different use cases that you can use to interact with the tool. Those files are located in the `/sample-data` directory.

## Development

To run in development mode with auto-compilation:

```bash
npm run dev
```

## Testing

To run the tests, simply run the following command:

```bash
npm run test
```

## Technical Decisions

I decided to use the following packages to streamline parts of the code:

- **CommanderJS**: Easy to spin up a CLI tool and allows me to focus more on the logic than on the tool the logic is running through
- **TurfJS**: Utilize geospatial analysis without having to write my own calculations and/or algorithms to process coordinate data. I am a firm believer of not re-creating the wheel
- **Vitest**: Automates all of the testing

One assumption that I made around the data is that coordinates for a Floodzone or Parcel will always contain four coordinates. If there was the opportunity for more coordinates, I would adjust the code accordingly. I based this on the two examples in the assessment description.

I also assumed that I didn't need to provide any visual confirmation of the analysis to the user in the terminal. If I were to apply this same tool in a real-world situation, I would include feedback while the tool is analyzing the file that the user submitted. For example, instead of just returning error messages for file parsing, I would also include success messaging at each step.

I broke out the logic into two separate files, one for file parsing logic and the other for geospatial analysis logic to keep concerns separated. These are in the `utils` directory, alongside the corresponding tests for each file.

All of the types are included in a type index file. I like to centralize my types as much as possible.

## AI Usage

The main usage of AI for this work was primarily around research of the documentation for the dependencies (using the context7 MCP). As I wrote code, I used AI to help debug any issues around the dependencies as well.

All logic and feature flow was hand written. AI only assisted with errors related to using the packages, and some refactor/cleanup.
