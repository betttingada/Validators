import { Data } from "@evolution-sdk/lucid";

/**
 * @fileoverview Type definitions for the Bead Cardano betting system.
 * This module defines data structures used for on-chain validation and off-chain interactions
 * including redeemer types, network configurations, and oracle data formats.
 */

/**
 * Shape definition for BeadRedeemer data structure.
 * Defines the structure for redemption operations on bead tokens.
 * 
 * @property goal - Integer representing the goal/outcome (0-3)
 *   - 0: TIE
 *   - 1: HOME team wins
 *   - 2: AWAY team wins  
 *   - 3: Game cancelled/void
 */
export const BeadRedeemerShape = Data.Object({
    goal: Data.Integer({ minimum: 0, maximum: 3 }),
});

/**
 * Type definition for BeadRedeemer derived from the shape.
 * Used when redeeming bead tokens from the smart contract.
 */
export type BeadRedeemer = Data.Static<typeof BeadRedeemerShape>;

/**
 * BeadRedeemer constructor/validator instance.
 * Used to encode/decode bead redeemer data for Plutus transactions.
 */
export const BeadRedeemer = BeadRedeemerShape as unknown as BeadRedeemer;

/**
 * Shape definition for BetMintingRedeemer data structure.
 * Defines the structure for minting/burning bet tokens.
 * 
 * @property result - Integer representing the game result/outcome (0-3)
 *   - 0: TIE
 *   - 1: HOME team wins
 *   - 2: AWAY team wins
 *   - 3: Game cancelled/void
 * @property action - Integer representing the minting action (0-3)
 *   - 0: Mint new bet tokens
 *   - 1: Burn bet tokens
 *   - 2: Administrative action
 *   - 3: Emergency/void action
 */
export const BetMintingRedeemerShape = Data.Object({
    result: Data.Integer({ minimum: 0, maximum: 3 }),
    action: Data.Integer({ minimum: 0, maximum: 3 }),
});

/**
 * Type definition for BetMintingRedeemer derived from the shape.
 * Used when minting or burning bet tokens through the minting policy.
 */
export type BetMintingRedeemer = Data.Static<typeof BetMintingRedeemerShape>;

/**
 * BetMintingRedeemer constructor/validator instance.
 * Used to encode/decode bet minting redeemer data for Plutus transactions.
 */
export const BetMintingRedeemer = BetMintingRedeemerShape as unknown as BetMintingRedeemer;

/**
 * Shape definition for BetSpendRedeemer data structure.
 * Defines the structure for spending bet tokens from UTXOs.
 * 
 * @property action - Integer representing the spending action (0-3)
 *   - 0: Claim winnings
 *   - 1: Refund bet
 *   - 2: Administrative withdrawal
 *   - 3: Emergency/void withdrawal
 */
export const BetSpendRedeemerShape = Data.Object({
    action: Data.Integer({ minimum: 0, maximum: 3 }),
});

/**
 * Type definition for BetSpendRedeemer derived from the shape.
 * Used when spending bet tokens from smart contract UTXOs.
 */
export type BetSpendRedeemer = Data.Static<typeof BetSpendRedeemerShape>;

/**
 * BetSpendRedeemer constructor/validator instance.
 * Used to encode/decode bet spending redeemer data for Plutus transactions.
 */
export const BetSpendRedeemer = BetSpendRedeemerShape as unknown as BetSpendRedeemer;

/**
 * Shape definition for OracleDatum data structure.
 * Defines the structure for oracle data stored on-chain to provide game results and betting statistics.
 * 
 * @property game - Unique integer identifier for the game/match
 * @property winner - Integer representing the winning outcome (0-3)
 *   - 0: TIE/Draw
 *   - 1: HOME team wins
 *   - 2: AWAY team wins
 *   - 3: Game cancelled/void
 * @property gamePolicyId - Bytes representing the policy ID of the game token
 * @property totalAda - Total ADA amount in the betting pool for this game
 * @property totalWinnings - Total ADA amount available for distribution to winners
 */
export const OracleDatumShape = Data.Object({
    game: Data.Integer(),
    winner: Data.Integer({ minimum: 0, maximum: 3 }),
    gamePolicyId: Data.Bytes(),
    totalAda: Data.Integer(),
    totalWinnings: Data.Integer(),
});

/**
 * Type definition for OracleDatum derived from the shape.
 * Used to represent oracle data containing game results and betting pool information.
 */
export type OracleDatum = Data.Static<typeof OracleDatumShape>;

/**
 * OracleDatum constructor/validator instance.
 * Used to encode/decode oracle datum data for Plutus transactions and on-chain storage.
 */
export const OracleDatum = OracleDatumShape as unknown as OracleDatum;
