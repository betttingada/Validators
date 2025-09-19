import { Constructor, UTxO, Unit, fromText, applyDoubleCborEncoding, mintingPolicyToId, applyParamsToScript, MintingPolicy, SpendingValidator, validatorToAddress, Network, PolicyId } from "@evolution-sdk/lucid";
import { Result, ResultFactory, WalletErrorCode, WalletErrorCodes } from "./cstypes";

/**
 * @fileoverview Shared utility functions and classes for the Bead Cardano betting system.
 * This module provides common functionality used across multiple components including
 * token utilities, validation functions, contract helpers, and logging utilities.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY CLASSES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Specialized utility class for BEAD token operations.
 * Provides static methods for creating and managing BEAD token minting scripts.
 */
export class BeadTokenUtils {
    /**
     * Creates a BEAD minting script with proper structure for Plutus V3.
     * 
     * @param beadContractCborHex - The hexadecimal CBOR-encoded contract script
     * @param beadName - The name for the main BEAD token
     * @param beadReferralName - The name for the BEAD referral token
     * @returns Object containing the minting script, policy ID, and token units
     * 
     * @example
     * ```typescript
     * const result = BeadTokenUtils.createBeadMintingScript(
     *   "590a1c590a19010000...", 
     *   "BEAD", 
     *   "BEAD_REF"
     * );
     * console.log(result.beadPolicyId); // Policy ID for the tokens
     * ```
     */
    static createBeadMintingScript(beadContractCborHex: string, beadName: string, beadReferralName: string) {
        const beadMintScript = {
            script: applyDoubleCborEncoding(beadContractCborHex),
            type: "PlutusV3" as const
        };
        const beadPolicyId = mintingPolicyToId(beadMintScript);
        const unitBead = beadPolicyId + fromText(beadName);
        const unitBeadReferral = beadPolicyId + fromText(beadReferralName);

        return {
            beadMintScript,
            beadPolicyId,
            unitBead,
            unitBeadReferral
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Conversion factor from ADA to Lovelace (1 ADA = 1,000,000 Lovelace) */
export const LOVELACE_PER_ADA = 1_000_000;

/** Scale factor for BEAD token calculations (1:1,000,000 ratio) */
export const BEAD_SCALE_FACTOR = 1_000_000;

/** Minimum UTXO value required by Cardano protocol (1 ADA in Lovelace) */
export const MIN_UTXO_VALUE = 1_000_000; // Minimum 1 ADA per UTXO

/** Maximum number of UTXOs to include in a single transaction for optimal performance */
export const MAX_UTXOS_PER_TX = 50; // Limit UTXOs per transaction for efficiency

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON VALIDATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validates basic game parameters used across bet.ts and oracle.ts modules.
 * Performs comprehensive validation of game ID, name, and date with helpful error messages.
 * 
 * @param game - Unique integer identifier for the game (must be non-negative)
 * @param gameName - Human-readable name for the game (cannot be empty)
 * @param gameDate - Unix timestamp for when the game occurs (must be positive)
 * @param maxGameNameLength - Maximum allowed length for game name (default: 50)
 * @returns Validation result with success status, error message, and suggestions
 * 
 * @example
 * ```typescript
 * const result = validateGameParameters(123, "Lakers vs Warriors", 1640995200000);
 * if (!result.isValid) {
 *   console.error(result.error);
 *   if (result.suggestions) {
 *     console.log("Suggestions:", result.suggestions);
 *   }
 * }
 * ```
 */
export function validateGameParameters(
    game: number,
    gameName: string,
    gameDate: number,
    maxGameNameLength: number = 50
): { isValid: boolean; error?: string; suggestions?: string[] } {
    if (game < 0 || !Number.isInteger(game)) {
        return { isValid: false, error: `Invalid game ID: ${game}` };
    }

    if (!gameName || gameName.trim().length === 0) {
        return { isValid: false, error: "Game name cannot be empty" };
    }

    if (gameName.length > maxGameNameLength) {
        return {
            isValid: false,
            error: `Game name too long (${gameName.length} chars). Max: ${maxGameNameLength}`,
            suggestions: [`Try shortening to: "${gameName.substring(0, maxGameNameLength)}"`]
        };
    }

    if (gameDate <= 0) {
        return { isValid: false, error: `Invalid game date: ${gameDate}` };
    }

    // Check if game date is not too far in the future (sanity check)
    const currentTime = Date.now();
    const maxFutureTime = currentTime + (365 * 24 * 60 * 60 * 1000); // 1 year from now
    if (gameDate > maxFutureTime) {
        return { isValid: false, error: "Game date is too far in the future" };
    }

    return { isValid: true };
}

/**
 * Validates integer amounts (like ADA amounts that should be whole numbers).
 * Ensures the amount is a valid non-negative integer within optional bounds.
 * 
 * @param amount - The numeric amount to validate
 * @param fieldName - Name of the field being validated (for error messages)
 * @param min - Optional minimum allowed value (inclusive)
 * @param max - Optional maximum allowed value (inclusive)
 * @returns Validation result with success status, error message, and suggestions
 * 
 * @example
 * ```typescript
 * const result = validateIntegerAmount(10.5, "Bet Amount", 1, 1000);
 * if (!result.isValid) {
 *   console.error(result.error); // "Bet Amount must be a whole number. Got: 10.5"
 *   console.log(result.suggestions); // ["Try using 10 or 11 instead"]
 * }
 * ```
 */
export function validateIntegerAmount(amount: number, fieldName: string, min?: number, max?: number): { isValid: boolean; error?: string; suggestions?: string[] } {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return { isValid: false, error: `${fieldName} must be a valid number` };
    }

    if (amount < 0) {
        return { isValid: false, error: `${fieldName} cannot be negative. Got: ${amount}` };
    }

    if (amount !== Math.floor(amount)) {
        return {
            isValid: false,
            error: `${fieldName} must be a whole number. Got: ${amount}`,
            suggestions: [`Try using ${Math.floor(amount)} or ${Math.ceil(amount)} instead`]
        };
    }

    if (min !== undefined && amount < min) {
        return {
            isValid: false,
            error: `${fieldName} must be at least ${min}. Got: ${amount}`
        };
    }

    if (max !== undefined && amount > max) {
        return {
            isValid: false,
            error: `${fieldName} cannot exceed ${max}. Got: ${amount}`
        };
    }

    return { isValid: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON CONTRACT UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Creates a Plutus V3 minting policy script with flexible parameter handling.
 * Supports both parameterized scripts and simple CBOR-encoded scripts.
 * 
 * @param cborHex - Hexadecimal CBOR-encoded contract script
 * @param params - Optional contract parameters for parameterized scripts
 * @returns MintingPolicy object ready for use in transactions
 * 
 * @example
 * ```typescript
 * // For parameterized scripts
 * const mintingScript = createMintingPolicy(cborHex, [game, gameName, gameDate]);
 * 
 * // For simple scripts (uses double CBOR encoding)
 * const oracleScript = createMintingPolicy(oracleCborHex);
 * ```
 */
export function createMintingPolicy(cborHex: string, params?: any[]): MintingPolicy {
    return {
        type: "PlutusV3" as const,
        script: params ? applyParamsToScript(cborHex, params) : applyDoubleCborEncoding(cborHex)
    };
}

/**
 * Creates a Plutus V3 spending validator script with contract parameters.
 * Used for creating validators that control UTXOs and contract interactions.
 * 
 * @param cborHex - Hexadecimal CBOR-encoded validator script
 * @param params - Contract parameters to apply to the script
 * @returns SpendingValidator object ready for use in transactions
 * 
 * @example
 * ```typescript
 * const validator = createSpendingValidator(cborHex, [game, gameName, gameDate]);
 * const address = validatorToAddress(network, validator);
 * ```
 */
export function createSpendingValidator(cborHex: string, params: any[]): SpendingValidator {
    return {
        type: "PlutusV3" as const,
        script: applyParamsToScript(cborHex, params)
    };
}

/**
 * Complete contract suite interface for betting operations.
 * Contains all scripts, policy IDs, and addresses needed for contract interactions.
 */
export interface ContractSuite {
    /** Bet minting policy script */
    betMintingScript: MintingPolicy;
    /** Oracle minting policy script */
    oracleMintScript: MintingPolicy;
    /** Bet pot spending validator script */
    potScript: SpendingValidator;
    /** Bet token policy ID */
    betPolicyId: PolicyId;
    /** Oracle token policy ID */
    oraclePolicyId: PolicyId;
    /** Bet pot contract address */
    betPotAddress: string;
    /** Contract parameters used in script creation */
    params: any[];
}

/**
 * Creates a complete contract suite for betting operations.
 * Generates all necessary scripts, policy IDs, and addresses in one call.
 * 
 * @param betMintingCborHex - Bet minting contract CBOR hex
 * @param oracleMintCborHex - Oracle minting contract CBOR hex
 * @param game - Game identifier
 * @param gameName - Human-readable game name
 * @param gameDate - Game date timestamp
 * @param network - Cardano network (for address generation)
 * @returns Complete contract suite with all components
 * 
 * @example
 * ```typescript
 * const contracts = createContractSuite(
 *   betCborHex,
 *   oracleCborHex,
 *   123,
 *   "Lakers vs Warriors",
 *   1640995200000,
 *   "Preview"
 * );
 * 
 * // Use the contracts
 * console.log(contracts.betPolicyId);
 * console.log(contracts.betPotAddress);
 * ```
 */
export function createContractSuite(
    betMintingCborHex: string,
    oracleMintCborHex: string,
    game: number,
    gameName: string,
    gameDate: number,
    network: Network
): ContractSuite {
    const params = createContractParams(game, gameName, gameDate);
    
    const betMintingScript = createMintingPolicy(betMintingCborHex, params);
    const oracleMintScript = createMintingPolicy(oracleMintCborHex);
    const potScript = createSpendingValidator(betMintingCborHex, params);
    
    const betPolicyId = mintingPolicyToId(betMintingScript);
    const oraclePolicyId = mintingPolicyToId(oracleMintScript);
    const betPotAddress = validatorToAddress(network, potScript);
    
    return {
        betMintingScript,
        oracleMintScript,
        potScript,
        betPolicyId,
        oraclePolicyId,
        betPotAddress,
        params
    };
}

/**
 * Creates contract parameters array used across all Plutus contracts.
 * Converts JavaScript types to appropriate Plutus data types for on-chain validation.
 * 
 * @param game - Game identifier (converted to BigInt)
 * @param gameName - Game name (converted to UTF-8 bytes)
 * @param gameDate - Game date timestamp (converted to BigInt)
 * @returns Array of contract parameters ready for Plutus script execution
 * 
 * @example
 * ```typescript
 * const params = createContractParams(123, "Lakers vs Warriors", 1640995200000);
 * // Returns: [123n, fromText("Lakers vs Warriors"), 1640995200000n]
 * ```
 */
export function createContractParams(game: number, gameName: string, gameDate: number): any[] {
    return [BigInt(game), fromText(gameName), BigInt(gameDate)];
}

/**
 * Extracts the network configuration from a Lucid instance with fallback.
 * 
 * @param lucid - Lucid blockchain provider instance
 * @returns Network name string ("Preview", "Preprod", or "Mainnet")
 * 
 * @example
 * ```typescript
 * const network = getNetworkFromLucid(lucidInstance);
 * console.log(`Connected to: ${network}`); // "Connected to: Preview"
 * ```
 */
export function getNetworkFromLucid(lucid: any): string {
    return lucid.config().network || "Preview";
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED ERROR HANDLING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Creates a standardized error result with intelligent error code classification.
 * Automatically categorizes errors based on message content and provides consistent formatting.
 * 
 * @param error - The caught error object
 * @param context - Additional context about where the error occurred
 * @param defaultCode - Default error code to use if classification fails
 * @param suggestions - Optional array of suggested fixes
 * @returns Standardized Result failure object
 * 
 * @example
 * ```typescript
 * try {
 *   // Some operation
 * } catch (error) {
 *   return createStandardError(
 *     error,
 *     "Bet placement",
 *     WalletErrorCodes.TRANSACTION_FAILED,
 *     ["Check your wallet balance", "Verify network connection"]
 *   );
 * }
 * ```
 */
export function createStandardError(
    error: Error,
    context: string,
    defaultCode: WalletErrorCode = WalletErrorCodes.TRANSACTION_FAILED,
    suggestions?: string[]
): Result<never> {
    let errorCode = defaultCode;
    const message = error.message.toLowerCase();
    
    // Intelligent error classification based on message content
    if (message.includes("invalid input") || 
        message.includes("validation") || 
        message.includes("parameter") ||
        message.includes("invalid amount")) {
        errorCode = WalletErrorCodes.INVALID_INPUT;
    } else if (message.includes("network") || 
               message.includes("connection") || 
               message.includes("timeout") ||
               message.includes("fetch")) {
        errorCode = WalletErrorCodes.NETWORK_ERROR;
    } else if (message.includes("insufficient") || 
               message.includes("balance") || 
               message.includes("funds")) {
        errorCode = WalletErrorCodes.TRANSACTION_FAILED; // Use existing code for fund issues
    } else if (message.includes("wallet") || 
               message.includes("address") || 
               message.includes("signature")) {
        errorCode = WalletErrorCodes.WALLET_CONNECTION_FAILED; // Use existing wallet error code
    }
    
    const formattedMessage = `${context}: ${error.message}`;
    
    return suggestions 
        ? ResultFactory.failure(errorCode, formattedMessage, { suggestions })
        : ResultFactory.failure(errorCode, formattedMessage);
}

/**
 * Creates a standardized validation error with helpful suggestions.
 * Specialized error creator for input validation failures.
 * 
 * @param field - The field that failed validation
 * @param value - The invalid value provided
 * @param expectedFormat - Description of the expected format
 * @param suggestions - Array of suggested fixes
 * @returns Standardized validation error result
 * 
 * @example
 * ```typescript
 * if (gameId < 0) {
 *   return createValidationError(
 *     "gameId",
 *     gameId,
 *     "positive integer",
 *     ["Use a positive number", "Check the game ID from the oracle"]
 *   );
 * }
 * ```
 */
export function createValidationError(
    field: string,
    value: any,
    expectedFormat: string,
    suggestions: string[]
): Result<never> {
    const message = `Invalid ${field}: expected ${expectedFormat}, got ${JSON.stringify(value)}`;
    return ResultFactory.failure(WalletErrorCodes.INVALID_INPUT, message, { suggestions });
}

/**
 * Creates a standardized transaction failure error with context.
 * Specialized error creator for transaction-related failures.
 * 
 * @param operation - The operation that failed (e.g., "bet placement", "token redemption")
 * @param txError - The transaction error details
 * @param troubleshootingSteps - Array of troubleshooting suggestions
 * @returns Standardized transaction error result
 * 
 * @example
 * ```typescript
 * return createTransactionError(
 *   "bet placement",
 *   error,
 *   [
 *     "Check your wallet balance",
 *     "Verify network connectivity", 
 *     "Try reducing the bet amount"
 *   ]
 * );
 * ```
 */
export function createTransactionError(
    operation: string,
    txError: Error,
    troubleshootingSteps: string[]
): Result<never> {
    const message = `Transaction failed during ${operation}: ${txError.message}`;
    return ResultFactory.failure(WalletErrorCodes.TRANSACTION_FAILED, message, { 
        suggestions: troubleshootingSteps 
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON FORMATTING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Converts a hexadecimal string to readable ASCII text.
 * Handles both plain hex strings and Aiken-style hex literals with h' prefix.
 * 
 * @param hex - Hexadecimal string to convert (with or without h' prefix)
 * @returns Decoded ASCII string, or original hex if conversion fails
 * 
 * @example
 * ```typescript
 * hexToString("48656c6c6f"); // Returns: "Hello"
 * hexToString("h'48656c6c6f'"); // Returns: "Hello" (Aiken format)
 * hexToString("invalid"); // Returns: "invalid" (fallback)
 * ```
 */
export function hexToString(hex: string): string {
    try {
        // Remove 'h' prefix if present
        const cleanHex = hex.startsWith("h'") ? hex.slice(2, -1) : hex;
        let result = '';
        for (let i = 0; i < cleanHex.length; i += 2) {
            const hexPair = cleanHex.substr(i, 2);
            result += String.fromCharCode(parseInt(hexPair, 16));
        }
        return result;
    } catch (error) {
        return hex; // Return original if conversion fails
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Enumeration of logging levels for controlling output verbosity.
 * Lower values indicate higher priority messages.
 */
export enum LogLevel {
    /** Critical errors that prevent operation */
    ERROR = 0,
    /** Warning messages for potential issues */
    WARN = 1,
    /** General informational messages */
    INFO = 2,
    /** Detailed debugging information */
    DEBUG = 3,
    /** Extremely detailed trace information */
    VERBOSE = 4
}

// Global logging configuration
let LOGGING_ENABLED = true;
let CURRENT_LOG_LEVEL = LogLevel.INFO;

/**
 * Checks if logging is currently enabled globally.
 * 
 * @returns true if logging is enabled, false otherwise
 */
export function isLoggingEnabled(): boolean {
    return LOGGING_ENABLED;
}

/**
 * Determines if a specific log level should be output based on current settings.
 * 
 * @param level - LogLevel to check
 * @returns true if the level should be logged, false otherwise
 */
function shouldLog(level: LogLevel): boolean {
    return LOGGING_ENABLED && level <= CURRENT_LOG_LEVEL;
}

/**
 * Logs a decorative line separator for visual organization.
 * 
 * @param level - Log level for this output (default: INFO)
 */
export function logLine(level: LogLevel = LogLevel.INFO) {
    if (!shouldLog(level)) return;
    console.log("-".repeat(80));
}

/**
 * Logs a step or section title in the process flow.
 * 
 * @param title - Title or description of the step
 * @param level - Log level for this output (default: INFO)
 */
export function logStep(title: string, level: LogLevel = LogLevel.INFO) {
    if (!shouldLog(level)) return;
    console.log(title);
}

/**
 * Logs a success message indicating successful completion.
 * 
 * @param message - Success message to display
 * @param level - Log level for this output (default: INFO)
 */
export function logSuccess(message: string, level: LogLevel = LogLevel.INFO) {
    if (!shouldLog(level)) return;
    console.log(message);
}

/**
 * Logs a general informational message.
 * 
 * @param message - Information message to display
 * @param level - Log level for this output (default: INFO)
 */
export function logInfo(message: string, level: LogLevel = LogLevel.INFO) {
    if (!shouldLog(level)) return;
    console.log(message);
}

/**
 * Logs an error message for debugging and troubleshooting.
 * 
 * @param message - Error message to display
 * @param level - Log level for this output (default: ERROR)
 */
export function logError(message: string, level: LogLevel = LogLevel.ERROR) {
    if (!shouldLog(level)) return;
    console.log(message);
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculates the total quantity of a specific token across multiple UTXOs.
 * Safely handles UTXOs that may not contain the specified token.
 * 
 * @param va - Array of UTXOs to search through
 * @param tokenUnit - Token unit identifier (policy ID + asset name)
 * @returns Total quantity of the token found across all UTXOs
 * 
 * @example
 * ```typescript
 * const utxos = await lucid.wallet.getUtxos();
 * const total = await getUtxosWithRef(utxos, "policy123...abc456");
 * console.log(`Total tokens: ${total}`);
 * ```
 */
export async function getUtxosWithRef(va: UTxO[], tokenUnit: Unit): Promise<number> {
    let total: number = 0;

    try {
        va.forEach(obj => {
            try {
                total += parseInt(obj.assets[tokenUnit].toString());
            } catch (error) {
                // Ignore errors for UTXOs that don't have this token
            }
        })
    } catch (error) {
        // Ignore errors
    }

    return total;
}

/**
 * Calculates the winning amount for a bet based on proportional payout.
 * 
 * **CRITICAL**: This function MUST match the validator's calculate_payout logic exactly!
 * The validator uses integer arithmetic with floor division to ensure deterministic results.
 * 
 * **Validator Logic** (from bet.ak):
 * ```
 * payout = floor((myBet × totalPot) / totalWinners)
 * ```
 * 
 * This implements a proportional payout system where:
 * - Each winning token gets an equal share of the total prize pool
 * - Calculations use integer arithmetic to avoid floating-point precision issues
 * - Results must match the on-chain validator exactly for transaction validation
 * 
 * @param totalWinners - Total amount of winning bet tokens across all winners
 * @param totalPot - Total ADA available in the prize pool (in lovelace)
 * @param myBet - This player's bet tokens being redeemed
 * @returns Winning amount in lovelace (with floor division to match validator)
 * 
 * @example
 * ```typescript
 * // If total pot is 1000 ADA and there are 500 winning tokens
 * // A player with 50 tokens should receive: (50 × 1000000000) / 500 = 100000000 lovelace (100 ADA)
 * const winnings = valueWon(500, 1000000000, 50);
 * console.log(`Winnings: ${winnings / 1000000} ADA`); // "Winnings: 100 ADA"
 * ```
 */
export function valueWon(totalWinners: number, totalPot: number, myBet: number): number {
    console.log("valueWon", totalWinners, totalPot, myBet);
    
    // Use precise integer arithmetic to match Aiken validator calculation
    // This matches the Aiken rational.floor() behavior exactly
    
    // Calculate: (myBet / totalWinners) × totalPot using integer arithmetic
    // To avoid floating point precision issues, we use: (myBet × totalPot) / totalWinners
    const numerator = myBet * totalPot;
    const exactWinnings = Math.floor(numerator / totalWinners);
    
    console.log("valueWon", exactWinnings);
    
    return exactWinnings;
}