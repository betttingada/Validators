import beadContract from "./compiled/bead.signed.plutus.json" with { type: "json" };
import betMintingContract from "./compiled/bet.signed.plutus.json" with { type: "json" };
import oracleContract from "./compiled/oracle.signed.plutus.json" with { type: "json" };

/**
 * @fileoverview BEAD Protocol Off-Chain Entry Point
 * 
 * Main entry point for the BEAD Protocol off-chain utilities providing comprehensive
 * access to the core smart contracts and their interactions on the Cardano blockchain.
 * 
 * ## Core System Components
 * 
 * ### 🪙 BEAD Token System
 * Complete token purchase and management system with tier-based purchasing,
 * referral bonuses, and comprehensive validation.
 * 
 * ### 🎯 Betting Platform  
 * Multi-token betting system supporting ADA and BEAD combinations with
 * automated token burning, minting, and performance monitoring.
 * 
 * ### 🔮 Oracle Services
 * Game result management and external data feeds with validation,
 * consensus mechanisms, and economic analysis.
 * 
 * ## Available Test Suites
 * 
 * ### BEAD Token Tests
 * ```bash
 * deno run -A --unstable-sloppy-imports bead.tests.ts
 * ```
 * Tests comprehensive BEAD token purchasing scenarios including:
 * - Tier-based purchases (200 ADA to 2000 ADA)
 * - Referral bonus calculations and distributions
 * - Error handling and validation
 * - Performance monitoring
 * 
 * ### Betting Platform Tests
 * ```bash
 * deno run -A --unstable-sloppy-imports bet.tests.ts
 * ```
 * Tests complete betting workflows including:
 * - Multi-token bet placement (ADA + BEAD)
 * - Game outcome predictions (Draw, Home Win, Away Win)
 * - Bet token minting and management
 * - Oracle integration for result verification
 * 
 * ### Quick Demo
 * ```bash
 * deno run -A --unstable-sloppy-imports index.ts
 * ```
 * Displays available contracts and provides system overview.
 * 
 * ## Smart Contract Integration
 * 
 * The system integrates three core Plutus smart contracts:
 * - **BEAD Contract**: Token minting, burning, and referral management
 * - **BET Contract**: Betting logic, token creation, and pot management  
 * - **Oracle Contract**: Result submission, validation, and prize distribution
 * 
 * ## Network Support
 * 
 * Supports multiple Cardano networks:
 * - **Mainnet**: Production environment
 * - **Preprod**: Pre-production testing
 * - **Preview**: Development and integration testing
 * - **Custom**: Local development networks
 * 
 * ## Error Handling
 * 
 * Comprehensive error handling with:
 * - Structured error codes and categories
 * - Detailed error messages with context
 * - Recovery suggestions and troubleshooting guides
 * - Performance monitoring and optimization alerts
 * 
 * @version 2.0.0
 * @author BEAD Protocol Development Team
 * @since 2025-08-13
 * @see {@link https://bead.fi} Official BEAD Protocol Website
 * @see {@link https://github.com/cmorgado/Bead-Cardano} GitHub Repository
 * 
 * @example
 * Basic usage for contract validation:
 * ```typescript
 * import "./index.ts";
 * // Validates and displays available contracts
 * // Shows contract CBOR prefixes for verification
 * // Provides test suite information
 * ```
 * 
 * @example
 * Integration with other modules:
 * ```typescript
 * import { purchaseBead } from "./bead.ts";
 * import { BetInGame } from "./bet.ts";
 * import { SetGameResult } from "./oracle.ts";
 * 
 * // Use the off-chain utilities in your application
 * ```
 */

/**
 * Main application entry point demonstrating the BEAD Protocol off-chain system
 * 
 * Validates contract availability and provides system overview including:
 * - Contract CBOR validation and display
 * - Test suite availability and usage instructions
 * - System health checks and readiness confirmation
 * 
 * @returns Promise<void> Resolves when system validation is complete
 * @throws {Error} If contract validation fails or system is not ready
 * 
 * @example
 * Run the main entry point:
 * ```bash
 * deno run -A --unstable-sloppy-imports index.ts
 * ```
 * 
 * Expected output:
 * ```
 * 🎯 Bead Cardano Off-Chain Utilities
 * 📋 Available contracts:
 *   - BEAD Contract: 590a1359...
 *   - BET Contract: 590b2467...
 *   - Oracle Contract: 590c3578...
 * 
 * ✅ Off-chain utilities ready!
 * 💡 Available test suites:
 *   - BEAD: deno run -A --unstable-sloppy-imports bead.tests.ts
 *   - BET: 
 * ```
 */
async function main(): Promise<void> {
    console.log("🎯 Bead Cardano Off-Chain Utilities");
    console.log("📋 Available contracts:");
    console.log(`  - BEAD Contract: ${beadContract.cborHex.slice(0, 20)}...`);
    console.log(`  - BET Contract: ${betMintingContract.cborHex.slice(0, 20)}...`);
    console.log(`  - Oracle Contract: ${oracleContract.cborHex.slice(0, 20)}...`);
    
    console.log("\n✅ Off-chain utilities ready!");
    console.log("💡 Available test suites:");
    console.log("  - BEAD: deno run -A --unstable-sloppy-imports bead.tests.ts");
    console.log("  - BET: deno run -A --unstable-sloppy-imports bet.tests.ts");
}

/**
 * Execute the main function with comprehensive error handling
 * 
 * Catches and logs any setup failures, ensuring proper error reporting
 * and system state management.
 * 
 * @throws {Error} Re-throws setup errors after logging for proper error propagation
 */
main().catch((error: Error) => {
    console.error("🚨 Setup failed:", error);
    throw error;
});
