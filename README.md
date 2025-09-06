# Parcel Classification CLI Tool

A command-line tool for validating and processing parcel and floodzone data from text files.

## Overview

This CLI tool reads text files containing parcel and floodzone information, validates the format, and processes the data to determine flood risk classifications for parcels.

## Prerequisites

- Node.js (version 16 or higher)
- npm or pnpm package manager

## Installation

### Option 1: Install from source

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd parcel-classification
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Build the project:
   ```bash
   pnpm run build
   # or
   npm run build
   ```

### Option 2: Install globally (after building)

After building the project, you can install it globally:

```bash
npm install -g .
```

This will make the `parcel-classification` command available system-wide.

## Usage

### Basic Usage

```bash
parcel-classification -f <path-to-file.txt>
# or
parcel-classification --file <path-to-file.txt>
```

### Examples

Using the provided sample data:

```bash
# Process sample parcel data
parcel-classification -f sample-data/parcel-1.txt
parcel-classification -f sample-data/parcel-2.txt
```

### Command Options

- `-f, --file <file>`: **Required.** Path to the input text file containing parcel and floodzone data
- `-V, --version`: Display version information
- `-h, --help`: Display help information

## Input File Format

The input file must be a `.txt` file with the following format:

### Structure

Each line should contain either a FLOODZONE or PARCEL definition:

```
FLOODZONE <type> <x1>,<y1> <x2>,<y2> <x3>,<y3> <x4>,<y4>
PARCEL <id> <x1>,<y1> <x2>,<y2> <x3>,<y3> <x4>,<y4>
```

### Floodzone Types

- `X`: Minimal flood risk
- `AE`: High flood risk
- `VE`: Very high flood risk

### Example File Content

```
FLOODZONE X 15,7 15,11 22,11 22,7
FLOODZONE AE 0,20 0,24 20,24 20,20
FLOODZONE VE 0,0 0,20 12,20 12,0
PARCEL 1 8,17 8,22 15,22 15,17
PARCEL 2 16,8 16,15 25,15 25,8
PARCEL 3 16,3 16,5 20,5 20,3
```

### Coordinate Format

- Coordinates are specified as `x,y` pairs
- Each floodzone and parcel is defined by 4 coordinate points (forming a quadrilateral)
- Coordinates should be integers

## Output

The tool provides feedback on the processing steps:

1. **File Detection**: Confirms the file type and path
2. **File Reading**: Indicates successful file read
3. **Format Validation**: Reports whether the data format is valid or invalid

### Success Output Example

```
✓ Text file detected: sample-data/parcel-1.txt
✓ File data read successfully
✓ File format is valid
```

### Error Output Example

```
✗ Invalid file format. Only .txt files are supported.
```

or

```
✗ File not found: nonexistent-file.txt
```

## Development

### Scripts

- `pnpm run dev`: Watch mode for development (compiles TypeScript)
- `pnpm start`: Run the compiled CLI tool
- `pnpm test`: Run tests
- `pnpm test:ui`: Run tests with UI

### Project Structure

```
src/
├── art/           # Console output formatting
├── types/         # TypeScript type definitions
├── utils/         # Utility functions (file handling, validation)
└── index.ts       # Main CLI entry point
```

## Troubleshooting

### Common Issues

1. **"Invalid file format" error**: Ensure your file has a `.txt` extension
2. **"File not found" error**: Check that the file path is correct and the file exists
3. **"File format is invalid" error**: Verify your file follows the correct format with proper FLOODZONE and PARCEL definitions

### Sample Data

The `sample-data/` directory contains example files you can use to test the tool:

- `parcel-1.txt`: Basic example with 3 parcels and 4 floodzones
- `parcel-2.txt`: Extended example with 4 parcels and 5 floodzones

## License

ISC
