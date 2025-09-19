/**
 * @fileoverview Core Type Definitions and Interfaces for BEAD Protocol
 * 
 * This module provides comprehensive type definitions, interfaces, and utility classes
 * for the BEAD Protocol off-chain system. It includes network configuration,
 * input interfaces, result patterns, and error handling utilities.
 * 
 * ## Key Features
 * 
 * ### 🌐 Network Configuration
 * - Cardano network enumeration (Mainnet, Preprod, Preview, Custom)
 * - Chain provider configuration with network-specific settings
 * - Wallet integration interfaces and utilities
 * 
 * ### 🎯 Game and Betting Types
 * - Game outcome enumeration for betting system
 * - Comprehensive input interfaces for all operations
 * - Type-safe parameter validation and structure
 * 
 * ### 🛡️ Result Pattern Implementation
 * - Functional programming result pattern for error handling
 * - Type-safe success and failure result management
 * - Comprehensive error categorization and context
 * 
 * ### ⚡ Utility Classes and Functions
 * - Result factory for consistent result creation
 * - Type guards for runtime type checking
 * - Result transformation and chaining utilities
 * 
 * ## Architecture Benefits
 * 
 * - **Type Safety**: Comprehensive TypeScript interfaces prevent runtime errors
 * - **Error Handling**: Functional result pattern eliminates exceptions
 * - **Maintainability**: Clear interfaces and consistent patterns
 * - **Scalability**: Modular design supports system growth
 * - **Testing**: Type-safe interfaces improve test reliability
 * 
 * @version 2.0.0
 * @author BEAD Protocol Development Team
 * @since 2025-08-13
 * @see {@link https://bead.fi/docs} Complete API Documentation
 * 
 * @example
 * Basic usage with network configuration:
 * ```typescript
 * import { Network, ChainProviderConf } from "./utils/cstypes";
 * 
 * const config: ChainProviderConf = {
 *   network: Network.PREPROD,
 *   uri: "https://preprod.koios.rest/api/v0",
 *   key: "preprod",
 *   beadCbor: "590a1359...",
 *   beadName: "BEAD",
 *   beadReferralName: "BEADR",
 *   treasuryAddress: "addr_test1..."
 * };
 * ```
 * 
 * @example
 * Result pattern usage:
 * ```typescript
 * import { Result, ResultFactory, isSuccess } from "./utils/cstypes";
 * 
 * async function processOperation(): Promise<Result<string>> {
 *   try {
 *     const data = await someOperation();
 *     return ResultFactory.success(data);
 *   } catch (error) {
 *     return ResultFactory.fromError(error, 'OPERATION_FAILED');
 *   }
 * }
 * 
 * const result = await processOperation();
 * if (isSuccess(result)) {
 *   console.log("Success:", result.data);
 * } else {
 *   console.error("Error:", result.error.message);
 * }
 * ```
 */

// ═══════════════════════════════════════════════════════════════════════════════
// NETWORK AND GAME TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cardano network enumeration for multi-network support
 * 
 * Supports all major Cardano networks for development, testing, and production:
 * - **MAINNET**: Production Cardano network with real ADA
 * - **PREPROD**: Pre-production testing network for final validation
 * - **PREVIEW**: Development and integration testing network
 * - **CUSTOM**: Local development networks and private testnets
 * 
 * @example
 * Network configuration for different environments:
 * ```typescript
 * // Production environment
 * const mainnetConfig = { network: Network.MAINNET };
 * 
 * // Testing environment  
 * const testConfig = { network: Network.PREPROD };
 * 
 * // Development environment
 * const devConfig = { network: Network.PREVIEW };
 * 
 * // Local development
 * const localConfig = { network: Network.CUSTOM };
 * ```
 */
export enum Network {
    /** Production Cardano network with real economic value */
    MAINNET = "mainnet",
    /** Pre-production testing network for final validation */
    PREPROD = "preprod", 
    /** Development and integration testing network */
    PREVIEW = "preview",
    /** Custom/local development networks */
    CUSTOM  = "custom"
}

/**
 * Game outcome enumeration for betting system
 * 
 * Represents the three possible outcomes in sports betting:
 * - **TIE**: Draw/tie result (value "0")
 * - **HOME**: Home team victory (value "1") 
 * - **AWAY**: Away team victory (value "2")
 * 
 * @example
 * Using game outcomes in betting operations:
 * ```typescript
 * // Betting on a home team victory
 * const homeBet = {
 *   outcome: GameOutcome.HOME,
 *   amount: 100 // ADA
 * };
 * 
 * // Betting on a draw
 * const drawBet = {
 *   outcome: GameOutcome.TIE,
 *   amount: 50 // ADA
 * };
 * 
 * // Setting game result via oracle
 * const gameResult = {
 *   gameId: 12345,
 *   winner: GameOutcome.AWAY // Away team won
 * };
 * ```
 */
export enum GameOutcome {
    /** Draw/tie result - no clear winner */
    TIE = "0",
    /** Home team victory */
    HOME = "1", 
    /** Away team victory */
    AWAY = "2"
}

// ═══════════════════════════════════════════════════════════════════════════════
// WALLET AND CHAIN PROVIDER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// WALLET AND CHAIN PROVIDER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * User wallet configuration interface
 * 
 * Represents a user's wallet with identification and address information
 * for blockchain operations and transaction signing.
 * 
 * @interface UserWallet
 * @property {string} key - Wallet identifier or mnemonic key for authentication
 * @property {string} address - Cardano address for receiving funds and signing transactions
 * 
 * @example
 * Creating a user wallet configuration:
 * ```typescript
 * const userWallet: UserWallet = {
 *   key: "your-wallet-mnemonic-or-identifier",
 *   address: "addr_test1qp...xyz123" // Cardano address
 * };
 * ```
 * 
 * @example
 * Using with different wallet types:
 * ```typescript
 * // Hardware wallet configuration
 * const hardwareWallet: UserWallet = {
 *   key: "ledger-device-id",
 *   address: "addr1q9...abc456"
 * };
 * 
 * // Software wallet configuration
 * const softwareWallet: UserWallet = {
 *   key: "abandon abandon abandon...", // Mnemonic
 *   address: "addr_test1qq...def789"
 * };
 *
 * // Browser wallet configuration
 * const browserWallet: UserWallet = {
 *   key: "eternl", // Wallet identifier
 *   address: "addr_test1qq...def789"
 * };
 * ```
 */
export interface UserWallet {
    /** Wallet identifier, mnemonic phrase, or authentication key */
    key: string;
    /** Cardano address for transactions and fund management */
    address: string;
}

/**
 * Comprehensive chain provider configuration interface
 * 
 * Contains all necessary configuration for connecting to and interacting
 * with the Cardano blockchain, including network settings, contract
 * references, and operational parameters.
 * 
 * @interface ChainProviderConf
 * @property {Network} network - Target Cardano network for operations
 * @property {string} uri - Blockchain API endpoint URI for network communication
 * @property {string} key - Network-specific identifier or access key
 * @property {string} beadCbor - BEAD token minting contract CBOR hex string
 * @property {string} beadName - Human-readable name for BEAD tokens
 * @property {string} beadReferralName - Human-readable name for BEAD referral tokens
 * @property {string} treasuryAddress - Treasury address for fee collection and management
 * 
 * @example
 * Production mainnet configuration:
 * ```typescript
 * const mainnetConfig: ChainProviderConf = {
 *   network: Network.MAINNET,
 *   uri: "https://cardano-mainnet.koios.rest/api/v0",
 *   key: "mainnet-production",
 *   beadCbor: "590a1359...", // Actual CBOR hex
 *   beadName: "BEAD",
 *   beadReferralName: "BEADR", 
 *   treasuryAddress: "addr1q9...production-treasury"
 * };
 * ```
 * 
 * @example
 * Development testnet configuration:
 * ```typescript
 * const testnetConfig: ChainProviderConf = {
 *   network: Network.PREVIEW,
 *   uri: "https://preview.koios.rest/api/v0",
 *   key: "preprod-testing",
 *   beadCbor: "590b2467...", // Test contract CBOR
 *   beadName: "BEAD PR", // Test prefix
 *   beadReferralName: "BEADR PR",
 *   treasuryAddress: "addr_test1q...test-treasury"
 * };
 * ```
 */
export interface ChainProviderConf {
    /** Target Cardano network for blockchain operations */
    network: Network;
    /** Blockchain API endpoint URI for network communication */
    uri: string;
    /** Network-specific identifier or access key for authentication */
    key: string;
    /** BEAD token minting contract CBOR hex string for smart contract execution */
    beadCbor: string;
    /** Human-readable name for BEAD tokens (e.g., "BEAD", "TBEAD") */
    beadName: string;
    /** Human-readable name for BEAD referral tokens (e.g., "BEADR", "TBEADR") */
    beadReferralName: string;
    /** Treasury address for fee collection, rewards, and fund management */
    treasuryAddress: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INPUT INTERFACES FOR OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// INPUT INTERFACES FOR OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Comprehensive betting input interface for game wagering operations
 * 
 * Contains all necessary parameters for placing bets on sporting events,
 * including game details, bet amounts, outcome predictions, and contract
 * configurations for blockchain execution.
 * 
 * @interface BetInput
 * @property {UserWallet} wallet - User wallet configuration for transaction signing
 * @property {ChainProviderConf} chainProviderConf - Blockchain network configuration
 * @property {string} betPotValidatorCbor - Bet pot spending validator CBOR hex
 * @property {string} betMintingValidatorCbor - Bet token minting validator CBOR hex  
 * @property {string} oracleMintingValidatorCbor - Oracle token minting validator CBOR hex
 * @property {number} posixTime - Game date/time in POSIX timestamp format
 * @property {number} gameNr - Unique game identifier number
 * @property {string} gameName - Human-readable game identifier/name
 * @property {number} lovelaces - ADA bet amount in lovelace units
 * @property {number} beads - BEAD token bet amount
 * @property {number} totalBet - Total calculated bet value
 * @property {GameOutcome} winner - Predicted game outcome
 * 
 * @example
 * Creating a comprehensive bet input:
 * ```typescript
 * const betInput: BetInput = {
 *   wallet: {
 *     key: "user-wallet-key",
 *     address: "addr_test1q...user-address"
 *   },
 *   chainProviderConf: testnetConfig,
 *   betPotValidatorCbor: "590c3578...",
 *   betMintingValidatorCbor: "590d4689...",
 *   oracleMintingValidatorCbor: "590e579a...",
 *   posixTime: 1691836800000, // Game date
 *   gameNr: 12345,
 *   gameName: "TeamA_vs_TeamB",
 *   lovelaces: 100_000_000, // 100 ADA in lovelace
 *   beads: 50, // 50 BEAD tokens
 *   totalBet: 150, // Combined value
 *   winner: GameOutcome.HOME // Betting on home team
 * };
 * ```
 */
export interface BetInput {
    /** User wallet configuration for transaction signing and identification */
    wallet: UserWallet;
    /** Blockchain network configuration and contract settings */
    chainProviderConf: ChainProviderConf;
    /** Bet pot spending validator CBOR hex string for smart contract execution */
    betPotValidatorCbor: string;
    /** Bet token minting validator CBOR hex string for token creation */
    betMintingValidatorCbor: string;
    /** Oracle token minting validator CBOR hex string for result verification */
    oracleMintingValidatorCbor: string;
    /** Game date and time in POSIX timestamp format (milliseconds since epoch) */
    posixTime: number;
    /** Unique game identifier number for tracking and reference */
    gameNr: number;
    /** Human-readable game identifier or description (e.g., "TeamA_vs_TeamB") */
    gameName: string;
    /** ADA bet amount in lovelace units (1 ADA = 1,000,000 lovelace) */
    lovelaces: number;
    /** BEAD token bet amount (can be 0 for ADA-only bets) */
    beads: number;
    /** Total calculated bet value for validation and tracking */
    totalBet: number;
    /** Predicted game outcome for betting purposes */
    winner: GameOutcome;
}

/**
 * Oracle input interface for game result submission operations
 * 
 * Contains parameters necessary for oracle operations to submit game results,
 * including authentication, game identification, result data, and contract
 * configurations for blockchain result recording.
 * 
 * @interface BetOracleInput
 * @property {UserWallet} wallet - Oracle operator wallet for transaction signing
 * @property {ChainProviderConf} chainProviderConf - Blockchain network configuration
 * @property {string} betPotValidatorCbor - Bet pot spending validator CBOR hex
 * @property {string} betMintingValidatorCbor - Bet token minting validator CBOR hex
 * @property {string} betOracleValidatorCbor - Oracle-specific validator CBOR hex
 * @property {number} posixTime - Game date/time for result correlation
 * @property {number} gameNr - Game identifier matching betting records
 * @property {string} gameName - Game identifier for result association
 * @property {GameOutcome} winner - Actual game outcome/result
 * @property {string} id - Additional result identifier (e.g., final score, details)
 * 
 * @example
 * Creating an oracle result submission:
 * ```typescript
 * const oracleInput: BetOracleInput = {
 *   wallet: {
 *     key: "oracle-operator-key",
 *     address: "addr_test1q...oracle-address"
 *   },
 *   chainProviderConf: testnetConfig,
 *   betPotValidatorCbor: "590c3578...",
 *   betMintingValidatorCbor: "590d4689...",
 *   betOracleValidatorCbor: "590f68ab...",
 *   posixTime: 1691836800000, // Game completion time
 *   gameNr: 12345, // Same as betting game ID
 *   gameName: "TeamA_vs_TeamB",
 *   winner: GameOutcome.HOME, // Actual result: home team won
 *   id: "2-1" // Final score or additional details
 * };
 * ```
 */
export interface BetOracleInput {
    /** Oracle operator wallet configuration for result submission authorization */
    wallet: UserWallet;
    /** Blockchain network configuration and contract settings */
    chainProviderConf: ChainProviderConf;
    /** Bet pot spending validator CBOR hex string for fund management */
    betPotValidatorCbor: string;
    /** Bet token minting validator CBOR hex string for token operations */
    betMintingValidatorCbor: string;
    /** Oracle-specific validator CBOR hex string for result verification */
    betOracleValidatorCbor: string;
    /** Game date/time for result correlation and validation */
    posixTime: number;
    /** Game identifier number matching original betting records */
    gameNr: number;
    /** Game identifier string for result association and tracking */
    gameName: string;
    /** Actual game outcome/result determined by oracle */
    winner: GameOutcome;
    /** Additional result identifier such as final score or result details */
    id: string;
}

/**
 * Bet redemption input interface for claiming winning bet rewards
 * 
 * Contains comprehensive parameters for redeeming winning bet tokens,
 * including bet identification, oracle verification, and transaction
 * references for blockchain reward distribution.
 * 
 * @interface BetRedeemInput
 * @property {UserWallet} wallet - Winner's wallet for reward distribution
 * @property {ChainProviderConf} chainProviderConf - Blockchain network configuration
 * @property {string} betPotValidatorCbor - Bet pot spending validator CBOR hex
 * @property {string} betMintingValidatorCbor - Bet token minting validator CBOR hex
 * @property {string} betOracleValidatorCbor - Oracle validator for result verification
 * @property {GameOutcome} winner - Winning outcome for validation
 * @property {number} posixTime - Game time for correlation
 * @property {number} gameNr - Game identifier for bet tracking
 * @property {string} gameName - Game name for identification
 * @property {string} id - Result identifier for verification
 * @property {string[]} playerWinTX - Transaction hashes proving winning bets
 * @property {string[]} payingTx - Payment transaction references
 * 
 * @example
 * Creating a bet redemption request:
 * ```typescript
 * const redeemInput: BetRedeemInput = {
 *   wallet: winnerWallet,
 *   chainProviderConf: testnetConfig,
 *   betPotValidatorCbor: "590c3578...",
 *   betMintingValidatorCbor: "590d4689...",
 *   betOracleValidatorCbor: "590f68ab...",
 *   winner: GameOutcome.HOME, // Winning outcome
 *   posixTime: 1691836800000,
 *   gameNr: 12345,
 *   gameName: "TeamA_vs_TeamB",
 *   id: "2-1",
 *   playerWinTX: ["tx_hash_1", "tx_hash_2"], // Winning bet transactions
 *   payingTx: ["payout_tx_hash"] // Reward distribution transactions
 * };
 * ```
 */
export interface BetRedeemInput {
    /** Winner's wallet configuration for reward distribution */
    wallet: UserWallet;
    /** Blockchain network configuration and contract settings */
    chainProviderConf: ChainProviderConf;
    /** Bet pot spending validator CBOR hex string */
    betPotValidatorCbor: string;
    /** Bet token minting validator CBOR hex string */
    betMintingValidatorCbor: string;
    /** Oracle validator CBOR hex string for result verification */
    betOracleValidatorCbor: string;
    /** Winning game outcome for validation and reward calculation */
    winner: GameOutcome;
    /** Game date/time for correlation and validation */
    posixTime: number;
    /** Game identifier number for tracking and verification */
    gameNr: number;
    /** Game identifier string for association */
    gameName: string;
    /** Result identifier for validation (e.g., final score) */
    id: string;
    /** Array of transaction hashes proving ownership of winning bet tokens */
    playerWinTX: string[];
    /** Array of payment transaction references for reward distribution */
    payingTx: string[];
}

/**
 * BEAD token purchase input interface with referral support
 * 
 * Contains all parameters necessary for purchasing BEAD tokens, including
 * referral address configuration, investment amounts, and blockchain
 * configuration for token minting and distribution.
 * 
 * @interface InputBeadWithReferral
 * @property {UserWallet} wallet - Buyer's wallet for token distribution
 * @property {ChainProviderConf} chainProviderConf - Blockchain network configuration
 * @property {string} referralAddress - Optional referral address for bonus distribution
 * @property {string} treasuryAddress - Treasury address for fund collection
 * @property {number} buyerAdaInvestmentLovelace - ADA investment amount in lovelace units
 * 
 * @example
 * Creating a BEAD purchase with referral:
 * ```typescript
 * const beadPurchase: InputBeadWithReferral = {
 *   wallet: {
 *     key: "buyer-wallet-key",
 *     address: "addr_test1q...buyer-address"
 *   },
 *   chainProviderConf: testnetConfig,
 *   referralAddress: "addr_test1q...referrer-address", // Optional
 *   treasuryAddress: "addr_test1q...treasury-address",
 *   buyerAdaInvestmentLovelace: 400_000_000 // 400 ADA in lovelace
 * };
 * ```
 * 
 * @example
 * Creating a BEAD purchase without referral:
 * ```typescript
 * const directPurchase: InputBeadWithReferral = {
 *   wallet: buyerWallet,
 *   chainProviderConf: testnetConfig,
 *   referralAddress: "", // Empty for no referral
 *   treasuryAddress: treasuryAddress,
 *   buyerAdaInvestmentLovelace: 200_000_000 // 200 ADA minimum tier
 * };
 * ```
 */
export interface InputBeadWithReferral {
    /** Buyer's wallet configuration for token distribution and transaction signing */
    wallet: UserWallet;
    /** Blockchain network configuration and contract settings */
    chainProviderConf: ChainProviderConf;
    /** Optional referral address for bonus distribution (empty string if no referral) */
    referralAddress: string;
    /** Treasury address for ADA collection and fund management */
    treasuryAddress: string;
    /** ADA investment amount in lovelace units (1 ADA = 1,000,000 lovelace) */
    buyerAdaInvestmentLovelace: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESULT PATTERN TYPES FOR ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// RESULT PATTERN TYPES FOR ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Functional programming result pattern implementation for type-safe error handling
 * 
 * The Result pattern provides a functional approach to error handling that eliminates
 * the need for exceptions and provides compile-time safety for error cases. This
 * implementation follows functional programming principles and provides consistent
 * error handling across the entire BEAD Protocol system.
 * 
 * ## Key Benefits
 * 
 * ### 🛡️ Type Safety
 * - Compile-time error handling validation
 * - No runtime exceptions or undefined behavior
 * - Explicit handling of success and failure cases
 * 
 * ### 🔧 Functional Programming
 * - Monadic operations with map and flatMap
 * - Composable error handling patterns
 * - Immutable result structures
 * 
 * ### 📊 Consistent Error Context
 * - Structured error information with codes
 * - Detailed error messages and context
 * - Recovery suggestions and debugging information
 * 
 * ### ⚡ Performance Optimized
 * - No exception throwing overhead
 * - Efficient error propagation
 * - Minimal memory allocation
 * 
 * @example
 * Basic Result pattern usage:
 * ```typescript
 * // Function that might fail
 * function riskyOperation(input: string): Result<number> {
 *   if (input.length === 0) {
 *     return ResultFactory.failure('INVALID_INPUT', 'Input cannot be empty');
 *   }
 *   
 *   const parsed = parseInt(input);
 *   if (isNaN(parsed)) {
 *     return ResultFactory.failure('PARSE_ERROR', 'Invalid number format');
 *   }
 *   
 *   return ResultFactory.success(parsed);
 * }
 * 
 * // Handling the result
 * const result = riskyOperation("123");
 * if (isSuccess(result)) {
 *   console.log("Parsed number:", result.data);
 * } else {
 *   console.error("Error:", result.error.message);
 * }
 * ```
 * 
 * @example
 * Chaining operations with Result:
 * ```typescript
 * const finalResult = ResultUtils.flatMap(
 *   parseInput(userInput),
 *   (parsed) => validateInput(parsed)
 * );
 * 
 * ResultUtils.match(
 *   finalResult,
 *   (data) => console.log("Success:", data),
 *   (error) => console.error("Failed:", error.message)
 * );
 * ```
 */

/**
 * Base result interface that all result types implement
 * 
 * Provides common properties shared by both success and failure results,
 * including success flag and timestamp for tracking and debugging.
 * 
 * @interface IResult
 * @property {boolean} success - Indicates whether the operation succeeded
 * @property {Date} timestamp - When the result was created for tracking
 */
export interface IResult {
    /** Indicates whether the operation succeeded (true) or failed (false) */
    readonly success: boolean;
    /** Timestamp when the result was created for tracking and debugging */
    readonly timestamp: Date;
}

/**
 * Success result containing data from successful operations
 * 
 * Represents successful operation outcomes with the resulting data.
 * Used when operations complete without errors and produce valid results.
 * 
 * @interface Success
 * @template T - Type of the successful result data
 * @extends IResult
 * @property {true} success - Always true for success results
 * @property {T} data - The successful operation result data
 * 
 * @example
 * Creating and using success results:
 * ```typescript
 * // Creating a success result
 * const userResult: Success<User> = ResultFactory.success({
 *   id: "123",
 *   name: "John Doe",
 *   email: "john@example.com"
 * });
 * 
 * // Type-safe access to data
 * if (isSuccess(userResult)) {
 *   console.log("User name:", userResult.data.name);
 *   console.log("User email:", userResult.data.email);
 * }
 * ```
 */
export interface Success<T> extends IResult {
    /** Always true for success results - enables type discrimination */
    readonly success: true;
    /** The successful operation result data of type T */
    readonly data: T;
}

/**
 * Failure result containing comprehensive error information
 * 
 * Represents failed operation outcomes with detailed error context,
 * categorization, and recovery information. Provides structured
 * error handling with codes, messages, and debugging details.
 * 
 * @interface Failure
 * @extends IResult
 * @property {false} success - Always false for failure results
 * @property {Object} error - Comprehensive error information object
 * @property {string} error.code - Categorized error code for programmatic handling
 * @property {string} error.message - Human-readable error description
 * @property {Record<string, unknown>} [error.details] - Optional additional error context
 * @property {string} [error.stack] - Optional stack trace for debugging
 * 
 * @example
 * Creating and handling failure results:
 * ```typescript
 * // Creating a failure result with context
 * const validationFailure: Failure = ResultFactory.failure(
 *   'VALIDATION_ERROR',
 *   'User age must be between 18 and 120',
 *   { 
 *     providedAge: -5,
 *     validRange: { min: 18, max: 120 },
 *     fieldName: 'age'
 *   }
 * );
 * 
 * // Handling the failure
 * if (isFailure(validationFailure)) {
 *   console.error("Code:", validationFailure.error.code);
 *   console.error("Message:", validationFailure.error.message);
 *   console.error("Details:", validationFailure.error.details);
 * }
 * ```
 */
export interface Failure extends IResult {
    /** Always false for failure results - enables type discrimination */
    readonly success: false;
    /** Comprehensive error information with categorization and context */
    readonly error: {
        /** Categorized error code for programmatic error handling and routing */
        readonly code: string;
        /** Human-readable error description explaining what went wrong */
        readonly message: string;
        /** Optional additional error context and debugging information */
        readonly details?: Record<string, unknown>;
        /** Optional stack trace for debugging and error tracking */
        readonly stack?: string;
    };
}

/**
 * Union type representing either successful or failed operation results
 * 
 * This discriminated union type ensures type-safe handling of both
 * success and failure cases at compile time. TypeScript's type system
 * can automatically narrow the type based on the success property.
 * 
 * @template T - Type of the data contained in successful results
 * @type {Success<T> | Failure} - Union of success and failure result types
 * 
 * @example
 * Function returning a Result type:
 * ```typescript
 * function fetchUser(id: string): Promise<Result<User>> {
 *   try {
 *     const user = await userService.getUser(id);
 *     if (!user) {
 *       return ResultFactory.failure('USER_NOT_FOUND', `User ${id} not found`);
 *     }
 *     return ResultFactory.success(user);
 *   } catch (error) {
 *     return ResultFactory.fromError(error, 'DATABASE_ERROR');
 *   }
 * }
 * 
 * // Type-safe usage
 * const userResult = await fetchUser("123");
 * if (userResult.success) {
 *   // TypeScript knows this is Success<User>
 *   console.log(userResult.data.name);
 * } else {
 *   // TypeScript knows this is Failure
 *   console.error(userResult.error.message);
 * }
 * ```
 */
export type Result<T> = Success<T> | Failure;

/**
 * Result factory class for creating consistent Result instances
 * 
 * Provides static factory methods for creating Success and Failure results
 * with proper typing, validation, and error handling. Ensures consistent
 * result creation patterns across the entire BEAD Protocol system.
 * 
 * ## Key Features
 * 
 * ### 🏭 Factory Pattern
 * - Consistent result instance creation
 * - Automatic timestamp generation
 * - Type-safe factory methods
 * 
 * ### 🛡️ Error Conversion
 * - Automatic Error object conversion
 * - Unknown error type handling
 * - Stack trace preservation
 * 
 * ### 📊 Context Preservation
 * - Detailed error context capture
 * - Structured error information
 * - Debugging information retention
 * 
 * @example
 * Basic factory usage:
 * ```typescript
 * // Creating success results
 * const numberResult = ResultFactory.success(42);
 * const userResult = ResultFactory.success({ id: "123", name: "John" });
 * 
 * // Creating failure results
 * const validationFailure = ResultFactory.failure(
 *   'VALIDATION_ERROR',
 *   'Invalid input provided'
 * );
 * 
 * const detailedFailure = ResultFactory.failure(
 *   'PROCESSING_ERROR',
 *   'Failed to process request',
 *   { step: 'validation', input: userInput }
 * );
 * ```
 * 
 * @example
 * Error conversion patterns:
 * ```typescript
 * // Converting Error objects
 * try {
 *   const data = await riskyOperation();
 *   return ResultFactory.success(data);
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     return ResultFactory.fromError(error, 'VALIDATION_FAILED');
 *   }
 *   return ResultFactory.fromError(error, 'OPERATION_FAILED');
 * }
 * 
 * // Handling unknown errors
 * const result = await operation().catch(error => 
 *   ResultFactory.fromUnknown(error, 'UNKNOWN_OPERATION_ERROR')
 * );
 * ```
 */
export class ResultFactory {
    /**
     * Creates a successful result containing the provided data
     * 
     * Generates a Success result with the provided data and automatic
     * timestamp generation. The resulting Success type is properly
     * typed based on the input data type.
     * 
     * @template T - Type of the data to be contained in the success result
     * @param {T} data - The successful operation result data
     * @returns {Success<T>} Success result containing the provided data
     * 
     * @example
     * Creating typed success results:
     * ```typescript
     * // String result
     * const textResult = ResultFactory.success("Hello World");
     * // Type: Success<string>
     * 
     * // Object result
     * const userResult = ResultFactory.success({
     *   id: "123",
     *   name: "John Doe",
     *   email: "john@example.com"
     * });
     * // Type: Success<{id: string, name: string, email: string}>
     * 
     * // Array result
     * const numbersResult = ResultFactory.success([1, 2, 3, 4, 5]);
     * // Type: Success<number[]>
     * ```
     */
    static success<T>(data: T): Success<T> {
        return {
            success: true,
            data,
            timestamp: new Date()
        };
    }

    /**
     * Creates a failure result with comprehensive error information
     * 
     * Generates a Failure result with categorized error code, human-readable
     * message, optional context details, and optional stack trace. Provides
     * structured error information for proper error handling and debugging.
     * 
     * @param {string} code - Categorized error code for programmatic handling
     * @param {string} message - Human-readable error description
     * @param {Record<string, unknown>} [details] - Optional additional error context
     * @param {string} [stack] - Optional stack trace for debugging
     * @returns {Failure} Failure result containing comprehensive error information
     * 
     * @example
     * Creating different types of failure results:
     * ```typescript
     * // Simple failure
     * const simpleFailure = ResultFactory.failure(
     *   'NOT_FOUND',
     *   'Resource not found'
     * );
     * 
     * // Failure with context
     * const contextualFailure = ResultFactory.failure(
     *   'VALIDATION_ERROR',
     *   'Invalid user data provided',
     *   {
     *     field: 'email',
     *     value: 'invalid-email',
     *     expectedFormat: 'user@domain.com'
     *   }
     * );
     * 
     * // Failure with stack trace
     * const trackedFailure = ResultFactory.failure(
     *   'SYSTEM_ERROR',
     *   'Internal system error occurred',
     *   { operation: 'database_query' },
     *   new Error().stack
     * );
     * ```
     */
    static failure(
        code: string,
        message: string,
        details?: Record<string, unknown>,
        stack?: string
    ): Failure {
        return {
            success: false,
            error: {
                code,
                message,
                details,
                stack
            },
            timestamp: new Date()
        };
    }

    /**
     * Creates a failure result from a JavaScript Error object
     * 
     * Converts standard JavaScript Error objects into structured Failure
     * results while preserving error messages, stack traces, and adding
     * additional context. Provides consistent error handling for thrown exceptions.
     * 
     * @param {Error} error - The JavaScript Error object to convert
     * @param {string} [code='UNKNOWN_ERROR'] - Error code for categorization
     * @param {Record<string, unknown>} [details] - Optional additional error context
     * @returns {Failure} Failure result converted from the Error object
     * 
     * @example
     * Converting different Error types:
     * ```typescript
     * // Basic Error conversion
     * try {
     *   JSON.parse('invalid json');
     * } catch (error) {
     *   const result = ResultFactory.fromError(error, 'JSON_PARSE_ERROR');
     *   // Preserves error message and stack trace
     * }
     * 
     * // Error with additional context
     * try {
     *   await networkOperation();
     * } catch (error) {
     *   const result = ResultFactory.fromError(
     *     error, 
     *     'NETWORK_ERROR',
     *     { 
     *       operation: 'fetch_user_data',
     *       url: 'https://api.example.com/users',
     *       timestamp: Date.now()
     *     }
     *   );
     * }
     * 
     * // Custom Error types
     * class ValidationError extends Error {
     *   constructor(field: string, value: any) {
     *     super(`Invalid ${field}: ${value}`);
     *     this.name = 'ValidationError';
     *   }
     * }
     * 
     * try {
     *   throw new ValidationError('email', 'invalid-email');
     * } catch (error) {
     *   const result = ResultFactory.fromError(error, 'VALIDATION_FAILED');
     * }
     * ```
     */
    static fromError(
        error: Error,
        code: string = 'UNKNOWN_ERROR',
        details?: Record<string, unknown>
    ): Failure {
        return ResultFactory.failure(
            code,
            error.message,
            details,
            error.stack
        );
    }

    /**
     * Creates a failure result from unknown error types
     * 
     * Safely converts unknown error types (including non-Error objects)
     * into structured Failure results. Handles cases where thrown values
     * are not Error objects, providing fallback error message generation.
     * 
     * @param {unknown} error - The unknown error value to convert
     * @param {string} [code='UNKNOWN_ERROR'] - Error code for categorization
     * @param {Record<string, unknown>} [details] - Optional additional error context
     * @returns {Failure} Failure result converted from the unknown error
     * 
     * @example
     * Handling various unknown error types:
     * ```typescript
     * // String errors
     * try {
     *   throw "Something went wrong";
     * } catch (error) {
     *   const result = ResultFactory.fromUnknown(error, 'STRING_ERROR');
     *   // Creates failure with message: "Something went wrong"
     * }
     * 
     * // Object errors
     * try {
     *   throw { code: 404, message: "Not found" };
     * } catch (error) {
     *   const result = ResultFactory.fromUnknown(error, 'OBJECT_ERROR');
     *   // Creates failure with message: "Unknown error occurred"
     * }
     * 
     * // Number errors
     * try {
     *   throw 500;
     * } catch (error) {
     *   const result = ResultFactory.fromUnknown(error, 'NUMERIC_ERROR');
     *   // Creates failure with message: "Unknown error occurred"
     * }
     * 
     * // Error objects (delegates to fromError)
     * try {
     *   throw new Error("Standard error");
     * } catch (error) {
     *   const result = ResultFactory.fromUnknown(error, 'DELEGATED_ERROR');
     *   // Delegates to fromError method for proper Error handling
     * }
     * ```
     */
    static fromUnknown(
        error: unknown,
        code: string = 'UNKNOWN_ERROR',
        details?: Record<string, unknown>
    ): Failure {
        if (error instanceof Error) {
            return ResultFactory.fromError(error, code, details);
        }
        
        const message = typeof error === 'string' ? error : 'Unknown error occurred';
        return ResultFactory.failure(code, message, details);
    }
}

/**
 * Type guards for checking result types
 */
export function isSuccess<T>(result: Result<T>): result is Success<T> {
    return result.success === true;
}

export function isFailure<T>(result: Result<T>): result is Failure {
    return result.success === false;
}

/**
 * Utility functions for working with results
 */
export class ResultUtils {
    /**
     * Maps a successful result to a new type
     * @param result - The result to map
     * @param mapper - Function to transform the data
     * @returns New result with transformed data, or original failure
     */
    static map<T, U>(result: Result<T>, mapper: (data: T) => U): Result<U> {
        if (isSuccess(result)) {
            try {
                return ResultFactory.success(mapper(result.data));
            } catch (error) {
                return ResultFactory.fromUnknown(error, 'MAPPING_ERROR');
            }
        }
        return result;
    }

    /**
     * Chains results together, allowing for sequential operations
     * @param result - The initial result
     * @param mapper - Function that takes success data and returns a new result
     * @returns The result of the mapper, or original failure
     */
    static flatMap<T, U>(result: Result<T>, mapper: (data: T) => Result<U>): Result<U> {
        if (isSuccess(result)) {
            try {
                return mapper(result.data);
            } catch (error) {
                return ResultFactory.fromUnknown(error, 'FLATMAP_ERROR');
            }
        }
        return result;
    }

    /**
     * Unwraps a result, throwing an error if it's a failure
     * @param result - The result to unwrap
     * @returns The data from a successful result
     * @throws Error if the result is a failure
     */
    static unwrap<T>(result: Result<T>): T {
        if (isSuccess(result)) {
            return result.data;
        }
        const error = new Error(result.error.message);
        error.stack = result.error.stack;
        throw error;
    }

    /**
     * Gets the data from a result, or returns a default value if it's a failure
     * @param result - The result to get data from
     * @param defaultValue - Value to return if result is a failure
     * @returns The data or default value
     */
    static getOrDefault<T>(result: Result<T>, defaultValue: T): T {
        return isSuccess(result) ? result.data : defaultValue;
    }

    /**
     * Executes different functions based on result type
     * @param result - The result to match on
     * @param onSuccess - Function to execute for success
     * @param onFailure - Function to execute for failure
     * @returns The result of the executed function
     */
    static match<T, U>(
        result: Result<T>,
        onSuccess: (data: T) => U,
        onFailure: (error: Failure['error']) => U
    ): U {
        return isSuccess(result) ? onSuccess(result.data) : onFailure(result.error);
    }
}

/**
 * Error codes specific to wallet operations
 */
export const WalletErrorCodes = {
    WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
    WALLET_CONNECTION_FAILED: 'WALLET_CONNECTION_FAILED',
    NETWORK_MISMATCH: 'NETWORK_MISMATCH',
    NETWORK_ERROR: 'NETWORK_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    STORAGE_ERROR: 'STORAGE_ERROR',
    CARDANO_NOT_AVAILABLE: 'CARDANO_NOT_AVAILABLE',
    WALLET_NOT_INSTALLED: 'WALLET_NOT_INSTALLED',
    LUCID_INIT_FAILED: 'LUCID_INIT_FAILED',
    ADDRESS_RETRIEVAL_FAILED: 'ADDRESS_RETRIEVAL_FAILED',
    WALLET_ENABLE_FAILED: 'WALLET_ENABLE_FAILED',
    TRANSACTION_FAILED: 'TRANSACTION_FAILED'
} as const;

export type WalletErrorCode = typeof WalletErrorCodes[keyof typeof WalletErrorCodes];
