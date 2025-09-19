////
//// BEAD Protocol - Betting Validator
////
//// This validator manages the betting system for sports games, handling both betting token
//// minting/burning and payout distribution. It implements complex rational arithmetic for
//// precise payout calculations and integrates with oracle validators for game results.
////
//// Key Features:
//// - Time-based betting windows (bet before game, claim after game)
//// - Rational arithmetic for precise payout calculations with floor rounding
//// - Oracle integration for verified game results
//// - BEAD token integration for betting fees
//// - Treasury signature validation for administrative actions
//// - Enhanced tracing for debugging complex payout logic
////
//// Validator Parameters:
//// - gameId: Unique integer identifier for the specific game
//// - gameName: Human-readable game name (e.g., "Porto")
//// - gameDate: POSIX timestamp when game completes and payouts become available
////
//// Supported Actions:
//// 1. Mint: Create betting tokens during betting window (before gameDate)
//// 2. Spend: Claim winnings using betting tokens (after gameDate)
//// 3. Treasury: Administrative token burning with treasury signature
////

use aiken/math/rational
use aiken/primitive/string
use cardano/address.{Address}
use cardano/assets.{AssetName, PolicyId, quantity_of}
use cardano/transaction.{
  InlineDatum, Input, Output, OutputReference, Transaction, find_script_outputs,
}
use cocktail.{value_policy_info}
use env
use types.{BetAction, BetMintingRedeemer, OracleDatum, POSIXTime}
use util.{getAdaInOutputs}
use validation.{get_inputs_by_credential, get_outputs_by_credential}

/// BEAD Protocol Betting Validator
///
/// Manages betting tokens for a specific game with time-based windows and payout calculations.
/// 
/// ## Validator Parameters
/// - `gameId`: Unique identifier for the game (used in oracle validation)
/// - `gameName`: Human-readable game name (e.g., "Porto") 
/// - `gameDate`: POSIX timestamp when betting closes and payouts begin
///
/// ## Minting Logic
/// Handles betting token creation and burning based on redeemer action:
/// - **Action 1**: Mint betting tokens before gameDate (betting window)
/// - **Action 2**: Burn tokens after gameDate (burning window) 
/// - **Treasury**: Administrative burning with treasury signature
///
/// ## Validation Steps for Minting
/// 1. Time window validation (before gameDate for betting, after for burning)
/// 2. BEAD token fee validation (half-test to prevent spam)
/// 3. Asset name validation (result must match game format)
/// 4. Token quantity validation (positive for betting, negative for burning)
///
/// ## Enhanced Tracing
/// Provides detailed logs for debugging betting token operations and validation steps.
validator bet(gameId: Int, gameName: ByteArray, gameDate: POSIXTime) {
  /// Minting endpoint for betting tokens
  ///
  /// ## Parameters
  /// - `r`: BetMintingRedeemer containing result prediction and action type
  /// - `policy_id`: Policy ID of the betting token being minted/burned
  /// - `self`: Current transaction context
  ///
  /// ## Returns
  /// - `Bool`: True if minting/burning is valid according to betting rules
  mint(r: BetMintingRedeemer, policy_id: PolicyId, self: Transaction) {
    let betAssetName: AssetName = getResultBA(gameName, r.result)
    let betQt = quantity_of(self.mint, policy_id, betAssetName)
    // Validate that the token name matches the expected format (result + gameName)
    // MINT
    if r.action == 0 {
      let beadQt = quantity_of(self.mint, env.beadPolicyId, env.beadName)
      let paidToPot =
        getAdaInOutputs(find_script_outputs(self.outputs, policy_id))
      let expectedBetQt = calculate_expected_bet_quantity(paidToPot, beadQt)
      and {
        checkGameResultCorrect(gameName, betAssetName, r.result)?,
        lessThanHaft(paidToPot, beadQt)?,
        if betQt == expectedBetQt {
          trace @"✓ Bet quantity validation passed"
          True
        } else {
          trace @"✗ Bet quantity validation failed for asset:"
          trace string.from_bytearray(gameName)
          fail string.from_bytearray(betAssetName)
        },
        {
          let bet_mint_context = "bet-mint"
          validation.validate_timing_before(
            range: self.validity_range,
            target_time: gameDate,
            context: bet_mint_context,
          )?
        },
      }
    } else {
      let burn_context = "bet-mint-burn"
      and {
        validation.validate_timing_after(
          range: self.validity_range,
          target_time: gameDate,
          context: burn_context,
        )?,
        validation.validate_token_burn(
          tx: self,
          policy_id: policy_id,
          asset_name: betAssetName,
          context: burn_context,
        )?,
      }
    }
  }

  /// Spending endpoint for payout claims
  ///
  /// Handles winner payout distribution after game completion. Validates oracle results,
  /// calculates precise payouts using rational arithmetic, and ensures ADA balance integrity.
  ///
  /// ## Parameters
  /// - `_d`: Unused datum (betting validator uses UTxO model)
  /// - `redeemer`: BetAction specifying claim type (1=claim winnings, 2=treasury action)
  /// - `my_output_reference`: Reference to the UTxO being spent
  /// - `self`: Current transaction context
  ///
  /// ## Returns
  /// - `Bool`: True if spending is valid according to payout rules
  ///
  /// ## Spend Actions
  /// - **Action 1**: Claim winnings with oracle verification and payout calculation
  /// - **Action 2**: Treasury administrative spending with signature validation
  ///
  /// ## Payout Calculation Process
  /// 1. Oracle validation (verify game result and timing)
  /// 2. Winner identification and total calculation
  /// 3. Rational arithmetic for precise payout distribution
  /// 4. ADA balance validation (inputs - payout = outputs)
  /// 5. Betting token burning (removes winning tokens from circulation)
  spend(
    _d: Option<Data>,
    redeemer: BetAction,
    my_output_reference: OutputReference,
    self: Transaction,
  ) {
    trace @"=== BET SPEND ==="
    trace @"[bet-spend] Redeemer action:"
    trace redeemer.action
    when redeemer.action is {
      0 -> {
        trace @"=== CLAIMING WINNINGS ==="
        expect [oracleIn] = self.reference_inputs
        expect InlineDatum(oracle_datum_) = oracleIn.output.datum
        expect Some((policyId, _, _)) =
          value_policy_info(oracleIn.output.value, env.oraclePolicyId)

        expect oracle_datum: OracleDatum = oracle_datum_
        let OracleDatum {
          gameId: game,
          winner,
          betPolicyId: gamePolicyId,
          totalAda,
          totalWinning: totalWinnings,
        } = oracle_datum
        let betAssetName: AssetName = getResultBA(gameName, winner)
        let betQt = quantity_of(self.mint, gamePolicyId, betAssetName)

        expect Some(ownInput) =
          self.inputs |> transaction.find_input(my_output_reference)
        let ownHash = ownInput.output.address.payment_credential

        let Address { payment_credential, .. } = oracleIn.output.address
        expect payment_credential == ownHash
        // Use helper functions for filtering inputs and outputs
        // Calculate payout using helper function with ceiling rounding
        // Perform all validations
        let claim_context = "bet-spend-claim"
        let game_id_token_name = "Game ID"
        and {
          validation.validate_timing_after(
            range: self.validity_range,
            target_time: gameDate,
            context: claim_context,
          )?,
          validation.validate_token_quantity_exact(
            actual: game,
            expected: gameId,
            token_name: game_id_token_name,
            context: claim_context,
          )?,
          // Validate oracle policy ID match
          if policyId == env.oraclePolicyId {
            True
          } else {
            fail policyId
          }?,
          validation.validate_token_burn(
            tx: self,
            policy_id: gamePolicyId,
            asset_name: betAssetName,
            context: claim_context,
          )?,
          validation.validate_ada_balance(
            total_inputs: getAdaInOutputs(
              get_inputs_by_credential(self.inputs, ownHash),
            ),
            payout: calculate_payout(betQt, totalWinnings, totalAda),
            total_outputs: getAdaInOutputs(
              get_outputs_by_credential(self.outputs, ownHash),
            ),
            context: claim_context,
          )?,
        }
      }
      2 -> {
        let treasury_context = "bet-spend-treasury"
        validation.validate_treasury_signature(
          extra_signatories: self.extra_signatories,
          context: treasury_context,
        )
      }
      _ -> fail @"Invalid Action"
    }
  }

  else(_) {
    fail
  }
}

// =============================================================================
// BET-SPECIFIC HELPER FUNCTIONS
// =============================================================================

/// Calculate the expected bet quantity based on ADA paid and BEAD tokens
pub fn calculate_expected_bet_quantity(paid_to_pot: Int, bead_qt: Int) -> Int {
  if bead_qt == 0 {
    // When no BEAD tokens are involved, bet quantity should equal ADA paid to pot
    paid_to_pot
  } else {
    // When BEAD tokens are involved, adjust the expected quantity
    paid_to_pot + -1_000_000 * bead_qt
  }
}

// =============================================================================
// PAYOUT CALCULATION FUNCTIONS
// =============================================================================

/// Calculate payout for winning bet
/// 
/// This function implements the core payout calculation with specific rounding behavior.
/// It uses rational arithmetic to ensure precise calculations and then applies floor 
/// rounding to determine the final payout amount.
///
/// Parameters:
/// - bet_qt: The quantity of bet tokens being burned (negative value, e.g., -10000000)
/// - total_winnings: Total amount of winning bet tokens across all winners (positive, e.g., 17000000)
/// - total_ada: Total ADA available in the prize pool (positive, e.g., 32000000 lovelace)
///
/// Formula: payout = floor((-bet_qt / total_winnings) × total_ada)
///
/// Example calculation:
/// - bet_qt = -10000000 (Account A's bet tokens, negative because burning)
/// - total_winnings = 17000000 (Account A: 10M + Account C: 7M tokens)
/// - total_ada = 32000000 (10 + 15 + 7 = 32 ADA in lovelace)
///
/// Step 1: Create ratio of bet tokens to total winnings
///   ratio = (-(-10000000)) / 17000000 = 10000000 / 17000000 = 0.588235294...
///
/// Step 2: Multiply by total ADA available
///   payout_exact = 0.588235294... × 32000000 = 18823529.411764705...
///
/// Step 3: Apply floor rounding (CRITICAL FOR PREVENTING INSUFFICIENT FUNDS)
///   payout_final = floor(18823529.411764705...) = 18823529 lovelace
///
/// ROUNDING BEHAVIOR:
/// The use of rational.floor() means ANY fractional part rounds DOWN to the lower integer.
/// This prevents claiming more than available in the pot:
/// - 18823529.1 → 18823529 (rounds down)
/// - 18823529.9 → 18823529 (rounds down) 
/// - 18823529.0 → 18823529 (no change, already integer)
///
/// OFF-CHAIN MATCHING:
/// The off-chain code MUST use identical logic to avoid validation failures.
/// JavaScript Math.floor() should match this behavior exactly.
///
/// INSUFFICIENT FUNDS PREVENTION:
/// Floor rounding ensures we never try to claim more than what's available in the pot.
/// Better to leave a few lovelaces in the pot than to have redemptions fail.
/// Calculates precise payout using rational arithmetic with floor rounding
///
/// Implements the core payout formula: (bet_tokens / total_winnings) × total_ada
/// Uses rational arithmetic to prevent floating-point errors and applies floor
/// rounding to ensure sequential redemptions don't fail due to rounding accumulation.
///
/// ## Parameters
/// - `bet_qt`: Quantity of betting tokens being burned (negative value)
/// - `total_winnings`: Total winning betting tokens for this result
/// - `total_ada`: Total ADA available for distribution
///
/// ## Returns
/// - `Int`: Calculated payout amount in lovelaces (ADA)
///
/// ## Calculation Steps
/// 1. Convert bet quantity to positive ratio component (-bet_qt / total_winnings)
/// 2. Create rational representation of total ADA pool
/// 3. Multiply ratios for proportional payout calculation
/// 4. Apply floor rounding to prevent over-payment
///
/// ## Floor Rounding Benefits
/// - Prevents sequential redemption failures
/// - Ensures total payouts never exceed available ADA
/// - Maintains system integrity under high concurrent redemptions
///
/// ## Example
/// - Bet: 100 tokens, Total Winnings: 500 tokens, Total ADA: 1000 ADA
/// - Calculation: (100/500) × 1000 = 200 ADA payout
pub fn calculate_payout(bet_qt: Int, total_winnings: Int, total_ada: Int) -> Int {
  trace @"=== PAYOUT CALCULATION ==="
  // Create rational number: (-bet_qt) / total_winnings
  // Note: bet_qt is negative (burning), so -bet_qt makes it positive for the ratio
  expect Some(rd) = rational.new(-1 * bet_qt, total_winnings)
  // Create rational number: total_ada / 1 (convert integer to rational)
  expect Some(total_rat) = rational.new(total_ada, 1)
  // Multiply the ratios: (bet_ratio) × (total_ada)
  let r = rational.mul(rd, total_rat)
  // Apply floor rounding - this ensures we never claim more than available
  // This prevents insufficient funds errors in sequential redemptions
  let result = rational.floor(r)
  trace @"=== PAYOUT CALCULATION DETAILS ==="
  trace @"Bet quantity (burned):"
  trace bet_qt
  trace @"Total winnings:"
  trace total_winnings
  trace @"Total ADA:"
  trace total_ada
  trace @"Final payout:"
  trace result
  result
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/// Extracts inline datum from transaction output
///
/// Helper function to safely extract inline datums from UTxOs, commonly used
/// for oracle data validation and result verification.
///
/// ## Parameters
/// - `output`: Transaction output that may contain an inline datum
///
/// ## Returns
/// - `Option<Data>`: Some(datum) if inline datum exists, None otherwise
///
/// ## Use Cases
/// - Oracle result extraction
/// - Datum validation in multi-validator transactions
/// - Safe datum parsing with error handling
pub fn datum_of(output: Output) -> Option<Data> {
  when output.datum is {
    transaction.InlineDatum(d) -> Some(d)
    _ -> None
  }
}

/// BEAD token spam prevention validation (Half Test)
///
/// Ensures sufficient ADA is provided relative to BEAD token quantities to prevent
/// micro-betting spam attacks. Requires at least 2 ADA per BEAD token involved.
///
/// ## Parameters
/// - `lovelaces`: ADA amount in the transaction (in lovelaces)
/// - `bead`: BEAD token quantity involved in the transaction
///
/// ## Returns
/// - `Bool`: True if ADA/BEAD ratio is acceptable, False if spam detected
///
/// ## Validation Rules
/// - BEAD > 0: Requires lovelaces/(bead × 1M) >= 2 (minimum 2 ADA per BEAD)
/// - BEAD = 0: Allows any positive ADA amount (no BEAD tokens involved)
/// - BEAD < 0: Prevents negative token exploits (should not occur in normal flow)
///
/// ## Spam Prevention
/// - Prevents micro-transactions that could clog the network
/// - Ensures meaningful betting amounts relative to transaction fees
/// - Maintains economic viability of betting operations
pub fn lessThanHaft(lovelaces: Int, bead: Int) -> Bool {
  trace @"=== HALF TEST ==="
  let result =
    if bead > 0 {
      lovelaces / ( bead * 1_000_000 ) >= 2
    } else if bead == 0 {
      // When no BEAD tokens are involved, allow any positive ADA amount
      lovelaces > 0
    } else {
      // bead < 0 (burning), should always be valid for the half test
      True
    }
  trace @"[lessThanHaft] Lovelaces:"
  trace lovelaces
  trace @"[lessThanHaft] BEAD tokens:"
  trace bead
  trace @"[lessThanHaft] Half test result:"
  trace result
  result
}

/// Helper function to create the formatted name string
fn create_result_name_string(
  game_name_ba: ByteArray,
  game_result: Int,
) -> String {
  let game_name: String = string.from_bytearray(game_name_ba)
  let result: String = string.from_int(game_result)
  string.concat(left: result, right: game_name)
}

/// Validates that the provided game result ByteArray matches the expected format
/// of result concatenated with game name
pub fn checkGameResultCorrect(
  gameNameBA: ByteArray,
  gameResultBA: ByteArray,
  gameResult: Int,
) -> Bool {
  let finalName = create_result_name_string(gameNameBA, gameResult)
  string.to_bytearray(finalName) == gameResultBA
}

/// Generates the expected token name by concatenating the game result with the game name
pub fn getResultBA(gameNameBA: ByteArray, gameResult: Int) -> ByteArray {
  let finalName = create_result_name_string(gameNameBA, gameResult)
  string.to_bytearray(finalName)
}
