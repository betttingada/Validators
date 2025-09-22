# BEAD Protocol - Cardano Smart Contract System

A comprehensive Cardano DeFi protocol featuring BEAD token minting with referral rewards, multi-token betting functionality, and oracle services for sports betting and prediction markets. Built with a modern provider architecture, comprehensive testing framework, and production-ready error handling.

## 🎯 Overview

The BEAD Protocol is a sophisticated betting and gaming platform built on Cardano that combines:

- **BEAD Token System**: Native tokens with integrated referral rewards and tier-based purchasing
- **Multi-Token Betting**: ADA + BEAD combination betting on sports events and prediction markets  
- **Oracle Integration**: Decentralized game outcome verification and result setting
- **Treasury Management**: Automated fee collection and reward distribution
- **Provider Architecture**: Abstracted blockchain providers supporting real networks and emulator testing
- **Type-Safe Operations**: Comprehensive Result pattern for functional error handling
- **Enhanced Testing**: Complete test suites with emulator support and automated scenarios

## 📁 Project Structure

```
├── README.md                           # This file
├── aiken_workspace/                    # Aiken smart contract environment
│   ├── validators/                     # Smart contract validators
│   │   ├── bead.ak                     # BEAD token minting/burning
│   │   ├── bet.ak                      # Betting contract logic
│   │   ├── oracle.ak                   # Oracle result verification
│   │   └── *.tests.ak                  # Contract test suites
│   ├── lib/                            # Shared contract utilities
│   │   ├── validation.ak               # Common validation functions
│   │   ├── util.ak                     # Utility functions
│   │   └── types.ak                    # Type definitions
│   ├── env/                            # Environment configurations
│   │   ├── default.ak                  # Default network settings
│   │   ├── preprod.ak                  # Pre-production environment
│   │   └── preview.ak                  # Preview testnet environment
│   └── build/                          # Compiled artifacts
├── off-chain/                          # TypeScript off-chain code
│   ├── lib/                            # Core functionality modules
│   │   ├── bead.ts                     # BEAD token interactions
│   │   ├── bet.ts                      # Betting platform logic
│   │   ├── oracle.ts                   # Oracle services
│   │   ├── redeem.ts                   # Bet redemption utilities
│   │   └── config.ts                   # Configuration management
│   ├── providers/                      # Blockchain provider abstraction
│   │   ├── IBlockchainProvider.ts      # Provider interface definition
│   │   └── LucidProvider.ts            # Lucid-based implementation
│   ├── utils/                          # Shared utilities and types
│   │   ├── cstypes.ts                  # Comprehensive type definitions
│   │   ├── types.ts                    # Plutus data structures
│   │   └── utils.ts                    # Utility functions and constants
│   ├── tests/                          # Comprehensive test suites
│   │   ├── bead.tests.ts               # BEAD token purchase tests
│   │   └── bet.tests.ts                # Complete betting workflow tests
│   ├── compiled/                       # Compiled Plutus contracts
│   ├── docs/                           # Generated Markdown docs
│   └── docs-html/                      # Generated HTML docs
└── cs-offchain/                        # C# off-chain implementation (legacy)
```

## 🏗️ Smart Contracts

The protocol consists of three main smart contract validators:

### 🪙 BEAD Token Contract (`bead.ak`)
- **Purpose**: Controlled minting and burning of BEAD utility tokens
- **Features**: 
  - Integrated referral system with configurable reward ratios
  - Treasury payment validation for each mint operation
  - Tier-based purchasing with progressive bonuses
  - Proper burning validation with supply management

### 🎯 Betting Contract (`bet.ak`)
- **Purpose**: Multi-token betting system for sports events and prediction markets
- **Features**:
  - ADA + BEAD combination betting
  - Automated token burning and minting for bet lifecycle
  - Comprehensive bet validation and error handling
  - Performance monitoring and analytics

### 🔮 Oracle Contract (`oracle.ak`)
- **Purpose**: External data integration and game outcome verification
- **Features**:
  - Game result setting and verification
  - Treasury collection management
  - Data validation and consensus mechanisms
  - Result distribution to betting contracts

### 📚 Supporting Libraries (`lib/`)
- `validation.ak` - Common validation patterns and utilities
- `util.ak` - Helper functions for address and value operations
- `types.ak` - Shared type definitions across contracts

## 🏗️ Off-Chain Architecture

### 🔗 Provider System (`providers/`)

The protocol features a modern provider architecture that abstracts blockchain interactions:

#### **IBlockchainProvider Interface**
- Unified interface for blockchain operations
- Support for real networks (Blockfrost) and emulator testing
- Network abstraction (Mainnet, Preprod, Preview, Custom)
- Wallet management (seed phrase, private key, browser wallets)
- Transaction building and submission utilities

#### **LucidProvider Implementation**
- Production-ready Lucid Evolution wrapper
- Blockfrost integration for real network operations
- Browser wallet support (Nami, Eternl, Flint, etc.)
- Comprehensive error handling and logging

#### **EmulatorProvider Support**
- In-memory blockchain emulation for testing
- Deterministic transaction execution
- Controllable time and slot progression
- No external network dependencies

### 🛡️ Type System (`utils/`)

#### **Result Pattern (`cstypes.ts`)**
- Functional error handling without exceptions
- Type-safe success/failure discrimination
- Comprehensive error categorization and context
- Monadic operations for composable error handling

#### **Network Configuration**
- Multi-network support (Mainnet, Preprod, Preview, Custom)
- Environment-specific settings and treasury addresses
- Automated contract deployment and policy ID management

#### **Input Interfaces**
- `BetInput` - Complete betting operation parameters
- `BetOracleInput` - Oracle result submission data
- `BetRedeemInput` - Winning bet redemption requests
- `InputBeadWithReferral` - BEAD token purchase configuration

### 🧪 Testing Framework (`tests/`)

#### **Comprehensive Test Suites**
- `bead.tests.ts` - BEAD token purchase scenarios with different amounts
- `bet.tests.ts` - Complete betting lifecycle with multiple participants
- Emulator-based testing with controlled environments
- Automated error handling and validation testing

## 🚀 Quick Start

### Prerequisites

- [Aiken](https://aiken-lang.org) v1.1.19+
- [Deno](https://deno.land) for TypeScript execution
- Node.js and npm/pnpm for off-chain development
- **Environment Configuration**: See [Environment Setup](#environment-configuration) section

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/betttingada/Validators.git
   cd Validators
   ```

2. **Set up environment configuration** (Critical - see [Environment Configuration](#environment-configuration)):
   ```bash
   # Create Aiken environment files
   # Copy and customize aiken_workspace/env/*.ak files with your network settings
   
   # Create TypeScript environment files  
   # Add your wallet seed phrases to off-chain/env/*.ts files
   ```

3. **Install off-chain dependencies**:
   ```bash
   cd off-chain
   npm install
   # or
   pnpm install
   ```

4. **Verify Aiken installation**:
   ```bash
   cd aiken_workspace
   aiken --version
   ```

## 🔧 Development Workflow

### Initial Environment Setup

**⚠️ Critical First Step**: Before building contracts or running tests, you must configure the environment files. The contracts and off-chain code will not work without proper environment configuration.

```bash
# 1. Set up Aiken environment
cd aiken_workspace/env/
# Edit preview.ak, preprod.ak, default.ak with your treasury and policy IDs

# 2. Set up TypeScript environment  
cd ../../off-chain/env/
# Create laceOne.ts, laceTreasury.ts, etc. with your wallet seed phrases

# 3. Verify setup
cd ../aiken_workspace
aiken check  # Should pass without environment errors
```

### Building Contracts

```bash
# Navigate to Aiken workspace
cd aiken_workspace

# Build all contracts
aiken build

# Build for specific environment
aiken build --env preview
aiken build --env preprod
```

### Running Tests

#### **BEAD Token Tests**
```bash
cd off-chain

# Test different purchase amounts
deno run -A --unstable-sloppy-imports tests/bead.tests.ts 200   # 200 ADA purchase
deno run -A --unstable-sloppy-imports tests/bead.tests.ts 400   # 400 ADA purchase
deno run -A --unstable-sloppy-imports tests/bead.tests.ts 1000  # 1000 ADA purchase

# Test error conditions
deno run -A --unstable-sloppy-imports tests/bead.tests.ts notreasury
```

#### **Betting Workflow Tests**
```bash
cd off-chain

# Complete betting lifecycle test
deno run -A --unstable-sloppy-imports tests/bet.tests.ts

# This test includes:
# - Multiple accounts purchasing BEAD tokens
# - Placing bets on different outcomes
# - Oracle setting game results
# - Winners redeeming their rewards
# - Treasury collecting remaining funds
```

#### **Manual Contract Testing**
```bash
# Run all contract tests
aiken check

# Run specific test patterns
aiken check -m bead
aiken check -m bet
aiken check -m oracle

# Run tests with verbose output
aiken check -v
```

### Manual Build Process

For manual control or debugging, you can also build step-by-step:

```bash
cd aiken_workspace

# Build for specific environment
aiken build --env preview
aiken build --env preprod

# Manual contract conversion
aiken blueprint convert -m bead > ../off-chain/compiled/bead.signed.plutus.json
aiken blueprint convert -m bet > ../off-chain/compiled/bet.signed.plutus.json
aiken blueprint convert -m bet > ../off-chain/compiled/betpot.signed.plutus.json  
aiken blueprint convert -m oracle > ../off-chain/compiled/oracle.signed.plutus.json

# Extract policy IDs
aiken blueprint policy -m bead
aiken blueprint policy -m oracle
```

## 💻 Off-Chain Development

### Provider-Based Architecture

The new provider system allows for easy switching between networks and testing environments:

```typescript
import { 
  IBlockchainProvider, 
  LucidProviderFactory, 
  EmulatorProviderFactory 
} from './providers/LucidProvider';

// Production environment
const wallet: UserWallet = { key: "eternl", address: "addr1..." };
const chainConfig: ChainProviderConf = { /* network config */ };
const factory = new LucidProviderFactory(wallet, chainConfig);
const provider = await factory.createProvider();

// Testing environment
const provider = await EmulatorProviderFactory.createDefaultProvider();
```

### Enhanced Error Handling

All operations now use the Result pattern for type-safe error handling:

```typescript
import { purchaseBead } from './lib/bead';
import { isSuccess, isFailure } from './utils/cstypes';

const result = await purchaseBead(provider, beadInput);

if (isSuccess(result)) {
  console.log(`✅ Purchased ${result.data.beadAmount} BEAD tokens`);
  console.log(`📊 Transaction: ${result.data.txHash}`);
} else {
  console.error(`❌ Purchase failed: ${result.error.message}`);
  console.error(`🔧 Error code: ${result.error.code}`);
}
```

### Running the Application

```bash
cd off-chain

# Show available contracts and functions
deno run -A --unstable-sloppy-imports index.ts

# Run BEAD token tests
deno run -A --unstable-sloppy-imports tests/bead.tests.ts

# Run betting system tests  
deno run -A --unstable-sloppy-imports tests/bet.tests.ts
```

### TypeScript Project Structure

The off-chain codebase provides comprehensive TypeScript interfaces for:

- **Token Operations**: Purchase, mint, and burn BEAD tokens with referral tracking
- **Betting Platform**: Place bets, manage pools, and handle payouts
- **Oracle Services**: Submit results, verify outcomes, and trigger distributions
- **Provider Abstraction**: Support for multiple wallets and network environments
- **Type Safety**: Comprehensive Result pattern for functional error handling
- **Testing Framework**: Emulator-based testing with deterministic execution

### Type System Features

#### **Result Pattern Implementation**
```typescript
// All operations return Result<T> for type-safe error handling
const result: Result<BeadPurchaseData> = await purchaseBead(provider, input);

// Pattern matching for success/failure
ResultUtils.match(
  result,
  (data) => console.log("Success:", data.beadAmount),
  (error) => console.error("Failed:", error.message)
);

// Chaining operations
const finalResult = ResultUtils.flatMap(
  parseInput(userInput),
  (parsed) => validateInput(parsed)
);
```

#### **Comprehensive Error Codes**
```typescript
// Categorized error codes for programmatic handling
export const WalletErrorCodes = {
  WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR', 
  INVALID_INPUT: 'INVALID_INPUT',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED'
} as const;
```

#### **Network Configuration Types**
```typescript
// Type-safe network configuration
interface ChainProviderConf {
  network: Network;
  uri: string;
  key: string;
  beadCbor: string;
  treasuryAddress: string;
}
```

### Documentation Generation

The project now includes comprehensive documentation generation:

```bash
cd off-chain

# Generate all documentation formats
npm run docs:clean

# Generate Markdown documentation
npm run docs

# Generate HTML documentation with interactive navigation
npm run docs:html

# Open HTML docs in browser (macOS)
npm run docs:view
```

#### **Enhanced TypeDoc Configuration**

The project includes dual documentation configurations:

- **Markdown Output** (`typedoc.json`) - For README integration and text-based docs
- **HTML Output** (`typedoc-html.json`) - For interactive web documentation

Both configurations include:
- Comprehensive module coverage (lib/, providers/, utils/)
- Custom categorization and sorting
- External link integration
- Enhanced validation and error reporting

## 🌐 Network Environments

The protocol supports multiple Cardano network environments:

### Available Networks
- **Preview Testnet** (`preview.ak`) - Development and testing
- **Pre-Production** (`preprod.ak`) - Staging environment  
- **Default** (`default.ak`) - Base configuration

### Automated Build Scripts

The project includes automated build scripts for streamlined environment-specific deployments:

#### 🔧 `bpreview.zsh` - Preview Testnet Automation
```bash
# Run the complete preview build pipeline
cd aiken_workspace
./bpreview.zsh
```

**What it does:**
- Builds contracts with verbose output for preview environment
- Converts all contracts to Plutus JSON format
- Places compiled contracts in local `off-chain/compiled/` directory
- Deploys contracts to API database at `../../../FrontEnd/BeadServices/BeadRestApi/Json/Db/plutus/preview/`
- Displays policy IDs for BEAD and Oracle contracts for easy reference

#### 🚀 `bpreprod.zsh` - Pre-Production Automation
```bash
# Run the complete preprod build pipeline
cd aiken_workspace  
./bpreprod.zsh
```

**What it does:**
- Builds contracts for pre-production environment
- Converts all contracts to Plutus JSON format
- Deploys contracts directly to API database at `../../../FrontEnd/BeadServices/BeadRestApi/Json/Db/plutus/preprod/`
- Displays policy IDs for BEAD and Oracle contracts
- Rebuilds with verbose output for verification

#### 📋 Generated Artifacts

Both scripts generate the following contract files:
- `bead.signed.plutus.json` - BEAD token minting contract
- `bet.signed.plutus.json` - Betting contract (mint operations)
- `betpot.signed.plutus.json` - Betting pot contract (spend operations)  
- `oracle.signed.plutus.json` - Oracle result verification contract

#### 🔑 Policy ID Extraction

The scripts automatically display critical policy IDs:
```bash
# Example output
bead policyId: a1b2c3d4e5f6...
oracle policyId: f6e5d4c3b2a1...
```

These policy IDs are essential for:
- Frontend integration and API configuration
- Wallet interactions and transaction building
- Asset identification across the Cardano network

### Environment Configuration

#### **📁 Required Environment Setup**

Both the Aiken workspace and off-chain TypeScript code require environment configuration files to be created manually. These files contain sensitive information and network-specific parameters that are not included in the repository for security reasons.

#### **🏗️ Aiken Workspace Environment (`aiken_workspace/env/`)**

The Aiken contracts reference environment modules that define network-specific constants. You need to ensure these files exist and contain the correct values for your target network:

**Required Files:**
- `env/default.ak` - Default/Mainnet configuration
- `env/preview.ak` - Preview testnet configuration  
- `env/preprod.ak` - Pre-production testnet configuration

**Example `env/preview.ak` structure:**
```aiken
use aiken/crypto.{VerificationKeyHash}
use aiken/primitive/string

// Treasury public key hash for receiving fees
pub const treasury: VerificationKeyHash =
  #"d5434e727e2b5761e61e8aee4fbdfea3db9b5600a9d989eb7b7fa377"

// Token names for this network
pub const beadName: ByteArray = string.to_bytearray(@"BEAD PR")
pub const beadReferralName: ByteArray = string.to_bytearray(@"BEADR PR")

// Policy IDs (generated after first contract deployment)
pub const beadPolicyId: ByteArray =
  #"88f726eca4f971d876533177b7cd736779d318e528e12aa6942a20eb"
pub const oraclePolicyId: ByteArray =
  #"76ad8c0237016138f33bfd821ffbc3571eb98e6ea11622fd7f014d40"
```

**Configuration Steps:**
1. **Create Environment Files**: Copy the structure above for each network you plan to use
2. **Set Treasury Address**: Replace the treasury hash with your treasury wallet's payment key hash
3. **Define Token Names**: Customize token names for each network (e.g., "BEAD PR" for Preview, "BEAD" for Mainnet)
4. **Generate Policy IDs**: Initially set placeholder values, then update after first contract build:
   ```bash
   cd aiken_workspace
   aiken build --env preview
   aiken blueprint policy -m bead    # Copy this to beadPolicyId
   aiken blueprint policy -m oracle  # Copy this to oraclePolicyId
   ```

#### **💻 Off-Chain Environment (`off-chain/env/`)**

The TypeScript off-chain code requires wallet seed phrases and private keys for testing and operations. These files contain sensitive cryptographic material and must be created manually.

**Required Files:**
- `env/laceOne.ts` - Primary wallet seed phrase
- `env/laceTwo.ts` - Secondary wallet seed phrase  
- `env/laceTreasury.ts` - Treasury wallet seed phrase
- `env/laceTree.ts` - Additional wallet for testing

**Example File Structure:**
```typescript
// env/laceOne.ts
export const laceOne: string = "your twenty-four word mnemonic seed phrase goes here for the primary wallet";

// env/laceTreasury.ts  
export const laceTreasury: string = "treasury wallet mnemonic seed phrase that matches the treasury hash in aiken env files";

// env/laceTwo.ts
export const laceTwo: string = "secondary wallet mnemonic for testing multiple user scenarios";
```

**Security Requirements:**
- **Never commit these files to version control**
- **Use test wallets only** - never use real funds
- **Generate fresh mnemonics** for each environment
- **Ensure treasury wallet** matches the treasury hash in Aiken env files

**Wallet Generation:**
```bash
# Generate test wallets using Cardano CLI or online tools
# For Preview/Preprod networks only - never use for Mainnet!

# You can use tools like:
# - Daedalus wallet (testnet mode)
# - Eternl wallet (testnet)  
# - Online mnemonic generators (for testing only)
```

#### **🔗 Environment Synchronization**

**Critical**: The treasury configuration must be consistent between Aiken and TypeScript environments:

1. **Generate Treasury Wallet**: Create a new wallet and extract the payment key hash
2. **Update Aiken Config**: Set the `treasury` constant in all `env/*.ak` files
3. **Update TypeScript Config**: Set the corresponding seed phrase in `env/laceTreasury.ts`
4. **Verify Addresses Match**: Ensure the derived addresses are identical

**Verification Script:**
```typescript
// Verify treasury address consistency
import { laceTreasury } from './env/laceTreasury';
// Use Lucid to derive address from seed phrase and compare with Aiken treasury hash
```

Each environment module provides network-specific settings:
- Network ID and magic numbers
- Treasury addresses and fee structures
- Oracle operator configurations
- Token policy IDs and asset names

## 📊 Protocol Features

### 🪙 BEAD Token Economics
- **Utility Token**: Core token for all protocol operations
- **Referral System**: Automated rewards for user referrals
- **Tier-Based Purchasing**: Progressive bonuses for larger purchases
- **Treasury Integration**: Automated fee collection and distribution

### 🎯 Betting Platform
- **Multi-Token Support**: Bet with ADA + BEAD combinations
- **Sports Betting**: Support for various sports and leagues
- **Prediction Markets**: Community-driven outcome predictions
- **Automated Payouts**: Smart contract-based reward distribution

### 🔮 Oracle Services  
- **Decentralized Results**: Multiple oracle operators for reliability
- **Game Outcome Verification**: Automated result validation
- **Treasury Collection**: Fee distribution to oracle operators
- **Consensus Mechanisms**: Multi-signature result verification

## 🛠️ Advanced Usage

### Provider Integration Examples

#### **Production Environment Setup**
```typescript
import { LucidProviderFactory } from './providers/LucidProvider';
import { Network, UserWallet, ChainProviderConf } from './utils/cstypes';

const wallet: UserWallet = {
  key: "eternl", // Browser wallet identifier
  address: "addr1..." // Cardano address
};

const chainConfig: ChainProviderConf = {
  network: Network.MAINNET,
  uri: "https://cardano-mainnet.blockfrost.io/api/v0",
  key: "your-blockfrost-api-key",
  beadCbor: "590a1359...", // Contract CBOR
  beadName: "BEAD",
  beadReferralName: "BEADR",
  treasuryAddress: "addr1..."
};

const factory = new LucidProviderFactory(wallet, chainConfig);
const provider = await factory.createProvider();
```

#### **Testing Environment Setup**
```typescript
import { EmulatorProviderFactory } from './providers/LucidProvider';
import { ACCOUNTS_LIST, ACCOUNTS } from './lib/config';

// Create emulator provider with pre-configured accounts
const provider = await EmulatorProviderFactory.createProvider(
  ACCOUNTS_LIST,
  ACCOUNTS.accountA,
  Network.PREVIEW
);

// Run test operations
const result = await purchaseBead(provider, beadInput);
```

### Contract Integration Examples

#### **BEAD Token Purchase with Referral**
```typescript
import { purchaseBead } from './lib/bead';
import { InputBeadWithReferral } from './utils/cstypes';

const beadInput: InputBeadWithReferral = {
  wallet: userWallet,
  chainProviderConf: networkConfig,
  referralAddress: "addr1...", // or "" for no referral
  treasuryAddress: "addr1...",
  buyerAdaInvestmentLovelace: 1000000 // 1 ADA in lovelace
};

const result = await purchaseBead(provider, beadInput);
if (result.success) {
  console.log(`✅ Purchased ${result.data.beadAmount} BEAD tokens`);
  console.log(`🎁 Referral bonus: ${result.data.referralAmount} tokens`);
}
```

#### **Placing a Bet on Sports Event**
```typescript
import { BetInGame } from './lib/bet';
import { BetInput, GameOutcome } from './utils/cstypes';

const betInput: BetInput = {
  wallet: userWallet,
  chainProviderConf: networkConfig,
  betPotValidatorCbor: "...",
  betMintingValidatorCbor: "...",
  oracleMintingValidatorCbor: "...",
  posixTime: 1691836800000,
  gameNr: 123,
  gameName: "TeamA-TeamB",
  lovelaces: 100000000, // 100 ADA in lovelace
  beads: 50, // 50 BEAD tokens
  totalBet: 150, // Combined value
  winner: GameOutcome.HOME // Betting on home team
};

const betResult = await BetInGame(betInput, provider);
if (betResult.success) {
  console.log(`🎯 Bet placed! Tokens minted: ${betResult.data.betTokensMinted}`);
}
```

#### **Oracle Result Submission**
```typescript
import { SetGameResult } from './lib/oracle';
import { BetOracleInput, GameOutcome } from './utils/cstypes';

const oracleInput: BetOracleInput = {
  gameNr: 123,
  gameName: "TeamA-TeamB",
  posixTime: 1691836800000,
  winner: GameOutcome.HOME, // Actual result
  id: "2-1", // Final score
  wallet: oracleWallet,
  chainProviderConf: networkConfig,
  betPotValidatorCbor: "...",
  betMintingValidatorCbor: "...",
  betOracleValidatorCbor: "..."
};

const oracleResult = await SetGameResult(oracleInput, provider);
if (oracleResult.success) {
  console.log(`🔮 Game result set: ${oracleResult.data.gameInfo.resultDescription}`);
}
```

#### **Redeeming Winning Bets**
```typescript
import { RedeemBet } from './lib/redeem';
import { BetRedeemInput } from './utils/cstypes';

const redeemInput: BetRedeemInput = {
  wallet: winnerWallet,
  chainProviderConf: networkConfig,
  betPotValidatorCbor: "...",
  betMintingValidatorCbor: "...",
  betOracleValidatorCbor: "...",
  winner: GameOutcome.HOME,
  posixTime: 1691836800000,
  gameNr: 123,
  gameName: "TeamA-TeamB",
  id: "2-1",
  playerWinTX: [],
  payingTx: []
};

const redeemResult = await RedeemBet(redeemInput, provider);
if (redeemResult.success) {
  console.log(`💰 Winnings: ${redeemResult.data.adaWon} ADA`);
  console.log(`🔥 Tokens burned: ${redeemResult.data.betTokensBurned}`);
}
```

### Custom Provider Implementation

For specialized requirements, implement the IBlockchainProvider interface:

```typescript
import { IBlockchainProvider } from './providers/IBlockchainProvider';

class CustomProvider implements IBlockchainProvider {
  async getNetwork(): Promise<Network> {
    // Custom implementation
  }
  
  async getWalletAddress(): Promise<Address> {
    // Custom implementation
  }
  
  async completeSignAndSubmit(txBuilder: TxBuilder): Promise<string> {
    // Custom transaction handling
  }
  
  // ... implement other required methods
}
```

## 🚨 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear build cache
cd aiken_workspace
rm -rf build/
aiken build

# Update dependencies
aiken packages install
```

**TypeScript Errors**
```bash
cd off-chain
# Clean compiled files
npm run clean

# Rebuild TypeScript
npm run compile
```

#### **🚨 Environment Issues**

**Missing Environment Files**
```bash
# Error: Module 'env' not found
# Solution: Create required environment files
cd aiken_workspace/env/
# Ensure preview.ak, preprod.ak, default.ak exist with proper constants

cd ../../off-chain/env/  
# Ensure wallet seed phrase files exist: laceOne.ts, laceTreasury.ts, etc.
```

**Treasury Mismatch**
```bash
# Error: Transaction validation failed - treasury address mismatch
# Solution: Verify treasury consistency between Aiken and TypeScript configs

# 1. Check Aiken treasury hash
grep -r "treasury" aiken_workspace/env/

# 2. Verify TypeScript treasury seed phrase derives to same address
# Use Lucid to derive address from laceTreasury.ts seed phrase
```

**Policy ID Mismatch**
```bash
# Error: Wrong policy ID in transaction
# Solution: Update environment files with correct policy IDs after contract build

cd aiken_workspace
aiken build --env preview
aiken blueprint policy -m bead    # Update beadPolicyId in env/preview.ak
aiken blueprint policy -m oracle  # Update oraclePolicyId in env/preview.ak
```

**Provider Connection Issues**
- Verify network environment settings in configuration
- Check Blockfrost API key validity and network match
- Ensure sufficient ADA for transaction fees
- Validate wallet connectivity (browser wallets vs seed phrases)

**Contract Validation Failures**
- Verify all required signers are present in transaction
- Check UTxO selection and collateral requirements
- Validate datum and redeemer structures match contract expectations
- Ensure correct contract parameters and policy IDs

**Testing Issues**
```bash
# Reset emulator state
rm -rf off-chain/.emulator-state 2>/dev/null || true

# Run tests with fresh state
deno run -A --unstable-sloppy-imports tests/bead.tests.ts

# Verify contract compilation
cd aiken_workspace && aiken check
```

### Performance Optimization

**Smart Contract Tips**
- Use efficient data structures in validators
- Minimize computational complexity in validation logic
- Implement proper UTxO management patterns
- Test gas consumption with realistic transaction sizes

**Off-Chain Optimization**
- Batch multiple operations when possible
- Use appropriate provider settings for network conditions
- Implement proper error handling and retry logic
- Monitor transaction confirmation times

**Provider Selection**
```typescript
// For testing - use emulator for fast, deterministic execution
const testProvider = await EmulatorProviderFactory.createDefaultProvider();

// For production - use Blockfrost with appropriate network
const prodProvider = await new LucidProviderFactory(wallet, config).createProvider();
```

## 📖 Documentation

### Generated Documentation
- **HTML Documentation**: Comprehensive interactive docs at `off-chain/docs-html/`
- **Markdown Documentation**: Text-based docs at `off-chain/docs/`  
- **Contract Documentation**: Aiken-generated docs at `aiken_workspace/docs/`

### Key Documentation Files
- `off-chain/DOCUMENTATION.md` - Off-chain API documentation overview
- `aiken_workspace/docs/` - Smart contract API reference with interactive examples
- `off-chain/docs-html/index.html` - Interactive documentation portal with full API coverage

### Generating Documentation

```bash
# Generate Aiken contract documentation
cd aiken_workspace
aiken docs

# Generate comprehensive TypeScript documentation
cd off-chain
npm run docs:clean  # Cleans both HTML and Markdown outputs
npm run docs        # Generates Markdown documentation  
npm run docs:html   # Generates interactive HTML documentation
npm run docs:view   # Opens HTML docs in browser (macOS)
```

### Documentation Features

#### **Enhanced Coverage**
- Complete API documentation for all modules in `lib/`, `providers/`, and `utils/`
- Interactive type definitions with examples
- Cross-referenced interfaces and implementations
- Error handling patterns and troubleshooting guides

#### **Interactive Features (HTML docs)**
- Searchable interface with full-text search
- Hierarchical navigation with breadcrumbs
- Syntax highlighting for TypeScript and Aiken code
- Direct links to source code on GitHub

#### **Integration Ready**
- External links to BEAD Protocol website and GitHub repository
- Customizable branding and navigation
- Mobile-responsive design for all devices
- Export capabilities for integration with other documentation systems

## 🤝 Contributing

### Development Standards
1. **Smart Contracts**: Follow Aiken best practices and validation patterns
2. **TypeScript**: Maintain comprehensive JSDoc documentation and use Result pattern
3. **Testing**: Include test coverage for all new features using emulator framework
4. **Documentation**: Update relevant documentation with changes using TypeDoc
5. **Error Handling**: Use Result pattern consistently throughout the codebase
6. **Provider Integration**: Ensure compatibility with IBlockchainProvider interface

### Development Workflow

#### **Setting Up Development Environment**
```bash
# Clone repository
git clone https://github.com/betttingada/Validators.git
cd Validators

# CRITICAL: Set up environment configuration first
# See Environment Configuration section above for detailed instructions

# Install Aiken dependencies
cd aiken_workspace
aiken packages install

# Install TypeScript dependencies  
cd ../off-chain
npm install

# Verify setup with environment files in place
cd ../aiken_workspace
aiken check                                        # Test contracts
cd ../off-chain  
deno run -A --unstable-sloppy-imports tests/bead.tests.ts  # Test off-chain
```

#### **Development Process**
1. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
2. **Write Tests**: Add comprehensive tests for new functionality
3. **Implement Feature**: Use Result pattern and proper error handling
4. **Update Documentation**: Generate updated docs with `npm run docs:clean`
5. **Validate Changes**: Run full test suite and contract validation
6. **Submit PR**: Include detailed description and test results

### Pull Request Process
1. Fork the repository and create a feature branch
2. Implement changes with appropriate tests and documentation
3. Ensure all tests pass and documentation is updated
4. Submit pull request with detailed description of changes
5. Address review feedback and maintain code quality standards

### Code Review Guidelines
- All smart contract changes require security review
- TypeScript changes should include type safety validation  
- Documentation updates should be clear and comprehensive
- Test coverage should be maintained or improved
- Error handling should follow Result pattern consistently

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- **Aiken Documentation**: [https://aiken-lang.org](https://aiken-lang.org)
- **Evolution SDK (previously known as Lucid-Evolution)**: [https://no-witness-labs.github.io/evolution-sdk/docs/](https://no-witness-labs.github.io/evolution-sdk/docs/)


---

**Built with ❤️ for the Cardano ecosystem**
