# BEAD Protocol Documentation

This document provides an overview of the available documentation for the BEAD Protocol off-chain TypeScript codebase.

## Available Documentation Formats

### 📝 Markdown Documentation
- **Location**: `./docs/`
- **Format**: Markdown files organized by module
- **Best for**: Reading in text editors, GitHub viewing, and integration with documentation systems
- **Entry point**: [./docs/modules.md](./docs/modules.md)

### 🌐 HTML Documentation  
- **Location**: `./docs-html/`
- **Format**: Interactive HTML with navigation and search
- **Best for**: Interactive browsing, development reference, and team documentation
- **Entry point**: [./docs-html/index.html](./docs-html/index.html)

## Documentation Structure

### Core Modules

#### 🪙 BEAD Token System (`bead.ts`)
Comprehensive token purchase and referral system featuring:
- Tier-based purchasing with progressive bonuses
- Referral system with percentage-based rewards  
- Comprehensive validation and error handling
- Performance monitoring and analytics

**Key Functions:**
- `purchaseBead()` - Main token purchase function
- `formatBetValidationError()` - Error formatting utility

**Key Interfaces:**
- `BeadPurchaseResult` - Purchase operation results
- `AdaDistribution` - ADA distribution breakdown
- `BeadAmountTier` - Purchase tier definitions

#### 🎯 Betting Platform (`bet.ts`)
Multi-token betting system for sports events including:
- ADA + BEAD combination betting
- Automated token burning and minting
- Comprehensive bet validation
- Performance monitoring across all phases

**Key Functions:**
- `BetInGame()` - Main betting function
- `createContractScripts()` - Contract setup utility
- `createBetAssets()` - Asset calculation utility

**Key Interfaces:**
- `BetResult` - Betting operation results
- `BetTransactionDetails` - Transaction metadata
- `BetTransactionMetrics` - Performance metrics

#### 🔮 Oracle Services (`oracle.ts`)
Oracle integration for external data feeds featuring:
- Game outcome verification
- Treasury collection management
- Data validation and consensus
- Result setting and verification

**Key Functions:**
- `SetGameResult()` - Set game outcomes
- `TreasuryCollection()` - Treasury management

#### 🔌 Provider Abstraction (`providers/`)
Blockchain provider interface supporting:
- Multiple network environments
- Wallet abstraction
- Transaction building and submission
- UTXO management

**Key Interfaces:**
- `IBlockchainProvider` - Provider interface
- `IBlockchainProviderFactory` - Provider factory

#### 🛠️ Utilities (`utils/`)
Shared utilities and type definitions including:
- Type definitions and interfaces
- Validation utilities
- Performance monitoring tools
- Error handling utilities

## Documentation Features

### 📊 Comprehensive Type Documentation
- Complete interface definitions with property descriptions
- Function signatures with parameter and return type details
- Enum definitions and constant values
- Complex type relationships and dependencies

### 📖 Detailed Function Documentation  
- Parameter descriptions with validation requirements
- Return value specifications with error conditions
- Usage examples and code snippets
- Performance considerations and best practices

### 🚨 Error Handling Documentation
- Error code definitions and categorizations
- Recovery suggestions and troubleshooting guides
- Validation feedback with actionable guidance
- Context information for debugging

### ⚡ Performance Documentation
- Performance metrics and monitoring capabilities
- Optimization strategies and implementation details
- Resource usage guidelines and limitations
- Timing and efficiency considerations

## Usage Examples

### Viewing Documentation

```bash
# Generate all documentation
npm run docs:clean

# Generate only Markdown docs
npm run docs

# Generate only HTML docs  
npm run docs:html

# Open HTML docs in browser (macOS)
npm run docs:view
```

### Integration Examples

```typescript
// BEAD token purchase example
import { purchaseBead } from './bead';
const result = await purchaseBead(provider, beadInput, referralAddress);

// Betting example
import { BetInGame } from './bet';
const betResult = await BetInGame(betInput, provider);

// Oracle example
import { SetGameResult } from './oracle';
const gameResult = await SetGameResult(oracleInput, provider);
```

## Maintenance

### Updating Documentation
1. Update JSDoc comments in source files
2. Run `npm run docs:clean` to regenerate all documentation
3. Verify generated documentation for accuracy
4. Commit both source and generated documentation files

### Documentation Standards
- Maintain comprehensive JSDoc comments for all public functions
- Include parameter validation requirements and constraints
- Provide usage examples for complex functions
- Document error conditions and recovery strategies
- Include performance considerations where relevant

## Contributing

When contributing to the codebase:
1. Maintain comprehensive JSDoc documentation
2. Include performance considerations in function documentation
3. Add validation and error handling documentation
4. Update type definitions and interface documentation
5. Run documentation generation to verify changes
6. Include usage examples for new features

For more information, see the main repository documentation and contribution guidelines.
