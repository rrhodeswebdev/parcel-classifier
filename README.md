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

## Usage

Once installed, you can use the CLI tool:

```bash
parcel-classification --help
```

or

```bash
node dist/index.js --help
```

This will show you all available commands and options.

## Development

To run in development mode with auto-compilation:

```bash
npm run dev
```
