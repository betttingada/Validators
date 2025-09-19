# Copy to Frontend Scripts

This directory contains scripts to copy the `lib`, `providers`, and `utils` folders from the off-chain directory to the BeadBlazor frontend project.

## Available Methods

### 1. Using npm scripts (Recommended)

From the `off-chain` directory, you can use the following npm commands:

```bash
# Copy using shell script
npm run copy-to-frontend

# Copy using Node.js script (cross-platform)
npm run copy-to-frontend:js

# Build TypeScript files and then copy to frontend
npm run deploy-frontend
```

### 2. Using shell script directly

```bash
# Make sure you're in the off-chain directory
cd /Users/ctw00206/Projects/Bead-Cardano/Aiken/bead/off-chain

# Run the shell script
./copy-to-frontend.sh
```

### 3. Using Node.js script directly

```bash
# Make sure you're in the off-chain directory
cd /Users/ctw00206/Projects/Bead-Cardano/Aiken/bead/off-chain

# Run the Node.js script
node copy-to-frontend.js
```

## What gets copied

The scripts copy the following directories:
- `lib/` - Contains the main library files (bead.ts, bet.ts, oracle.ts, etc.)
- `providers/` - Contains blockchain provider interfaces and implementations
- `utils/` - Contains utility functions and type definitions

## Destination

All folders are copied to:
```
/Users/ctw00206/Projects/Bead-Cardano/FrontEnd/BeadBlazor/BeadBlazor/wwwroot/src/
```

## Features

- **Clean copy**: Removes existing directories before copying to ensure fresh content
- **Error handling**: Checks if source and destination directories exist
- **Cross-platform**: Node.js version works on any platform with Node.js
- **Colorized output**: Easy to see success/failure status
- **Verification**: Shows what was copied after completion

## File Structure After Copy

```
BeadBlazor/wwwroot/src/
├── lib/
│   ├── bead.ts
│   ├── bet.ts
│   ├── config.ts
│   ├── oracle.ts
│   └── redeem.ts
├── providers/
│   ├── IBlockchainProvider.ts
│   └── LucidProvider.ts
└── utils/
    ├── cstypes.ts
    ├── types.ts
    └── utils.ts
```

## Troubleshooting

If you encounter permission errors, make sure the scripts are executable:

```bash
chmod +x copy-to-frontend.sh
chmod +x copy-to-frontend.js
```

If paths don't exist, verify:
1. You're running from the correct directory (`off-chain`)
2. The BeadBlazor project structure exists
3. You have write permissions to the destination directory
