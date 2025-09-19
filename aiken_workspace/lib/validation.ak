////
//// BEAD Protocol - Common Validation Library
////
//// This module provides centralized validation functions used across all BEAD protocol validators.
//// It implements common patterns for treasury validation, timing checks, token operations,
//// and ADA balance verification with enhanced tracing for debugging.
////
//// Key Features:
//// - Standardized validation patterns across all validators
//// - Enhanced tracing with structured debug output  
//// - Reusable utility functions for input/output filtering
//// - Consistent error handling and success indicators
////
//// Validators using this library:
//// - bead.ak: BEAD token minting with referral system
//// - bet.ak: Betting validator with complex payout calculations
//// - oracle.ak: Oracle token minting for game results
////

use aiken/collection/list.{filter, foldr, map}
use aiken/interval.{Finite}
use cardano/address.{PaymentCredential}
use cardano/assets.{AssetName, PolicyId, quantity_of}
use cardano/transaction.{Input, Output, Transaction, ValidityRange}
use env
use types.{POSIXTime}
use util.{signed_by}

// =============================================================================
// TREASURY SIGNATURE VALIDATION
// =============================================================================

/// Validates that a transaction is signed by the treasury wallet
/// 
/// This function checks if the treasury's signature is present in the transaction's
/// extra signatories list. Used across all validators to ensure treasury authorization
/// for minting operations and administrative actions.
///
/// ## Parameters
/// - `extra_signatories`: List of public key hashes that signed the transaction
/// - `context`: Identifying string for debugging (e.g., "bead-mint-treasury")
///
/// ## Returns
/// - `Bool`: True if treasury signature is valid, False otherwise
///
/// ## Tracing Output
/// - Validation context identifier
/// - Success/failure status with ✓/✗ indicators
/// - Structured debug sections for easy log parsing
///
/// ## Example Usage
/// ```aiken
/// validation.validate_treasury_signature(
///   extra_signatories: self.extra_signatories,
///   context: "bead-mint-treasury",
/// )
/// ```
pub fn validate_treasury_signature(
  extra_signatories: List<ByteArray>,
  context: ByteArray,
) -> Bool {
  trace @"=== TREASURY SIGNATURE VALIDATION ==="
  trace @"Context:"
  trace context
  let result = signed_by(env.treasury, extra_signatories)
  if result {
    trace @"✓ Treasury signature PASSED"
    Void
  } else {
    trace @"✗ Treasury signature FAILED"
    Void
  }
  trace @"=== VALIDATION END ==="
  result?
}

// =============================================================================
// TIMING VALIDATION FUNCTIONS
// =============================================================================

/// Validates that a transaction must start after a specific time
/// 
/// Ensures that the transaction's validity range starts after the specified target time.
/// Commonly used in betting scenarios to verify game completion timing or payout windows.
///
/// ## Parameters
/// - `range`: Transaction validity range containing time bounds
/// - `target_time`: Minimum required start time (POSIXTime in milliseconds)
/// - `context`: Identifying string for debugging (e.g., "bet-spend-claim")
///
/// ## Returns
/// - `Bool`: True if transaction starts after target time, False otherwise
///
/// ## Validation Logic
/// - Checks if transaction has a finite lower bound
/// - Compares transaction start time with target time
/// - Fails if transaction could start before the target time
///
/// ## Example Usage
/// ```aiken
/// validation.validate_timing_after(
///   range: self.validity_range,
///   target_time: gameDate,
///   context: "bet-spend-claim",
/// )
/// ```
pub fn validate_timing_after(
  range: ValidityRange,
  target_time: POSIXTime,
  context: ByteArray,
) -> Bool {
  trace @"=== TIMING AFTER VALIDATION ==="
  trace @"Context:"
  trace context
  trace @"Target time:"
  trace target_time
  let result = must_start_after(range, target_time)
  if result {
    trace @"✓ Timing after PASSED"
    Void
  } else {
    trace @"✗ Timing after FAILED"
    Void
  }
  trace @"=== VALIDATION END ==="
  result?
}

/// Validates that a transaction must start before a specific time
/// 
/// Ensures that the transaction's validity range starts before the specified target time.
/// Commonly used to enforce betting windows or time-limited operations.
///
/// ## Parameters
/// - `range`: Transaction validity range containing time bounds
/// - `target_time`: Maximum allowed start time (POSIXTime in milliseconds)
/// - `context`: Identifying string for debugging (e.g., "bet-mint")
///
/// ## Returns
/// - `Bool`: True if transaction starts before target time, False otherwise
///
/// ## Validation Logic
/// - Checks if transaction has a finite upper bound
/// - Compares transaction end time with target time
/// - Fails if transaction could run past the target time
///
/// ## Example Usage
/// ```aiken
/// validation.validate_timing_before(
///   range: self.validity_range,
///   target_time: gameDate,
///   context: "bet-mint",
/// )
/// ```
pub fn validate_timing_before(
  range: ValidityRange,
  target_time: POSIXTime,
  context: ByteArray,
) -> Bool {
  trace @"=== TIMING BEFORE VALIDATION ==="
  trace @"Context:"
  trace context
  trace @"Target time:"
  trace target_time
  let result = must_start_before(range, target_time)
  if result {
    trace @"✓ Timing before PASSED"
    Void
  } else {
    trace @"✗ Timing before FAILED"
    Void
  }
  trace @"=== VALIDATION END ==="
  result?
}

// =============================================================================
// TOKEN OPERATION VALIDATION FUNCTIONS
// =============================================================================

/// Validates token burning operations (negative quantity in mint field)
/// 
/// Ensures that a specific token is being burned (has negative quantity) in the transaction.
/// Used for token redemption, bet claiming, and cleanup operations.
///
/// ## Parameters
/// - `tx`: Transaction containing the mint field to validate
/// - `policy_id`: Policy ID of the token being burned
/// - `asset_name`: Asset name of the specific token being burned
/// - `context`: Identifying string for debugging (e.g., "bet-mint-burn")
///
/// ## Returns
/// - `Bool`: True if token quantity is negative (burning), False otherwise
///
/// ## Validation Logic
/// - Extracts token quantity from transaction mint field
/// - Verifies quantity is negative (indicates burning)
/// - Logs actual quantity for debugging
///
/// ## Example Usage
/// ```aiken
/// validation.validate_token_burn(
///   tx: self,
///   policy_id: policy_id,
///   asset_name: betAssetName,
///   context: "bet-mint-burn",
/// )
/// ```
pub fn validate_token_burn(
  tx: Transaction,
  policy_id: PolicyId,
  asset_name: AssetName,
  context: ByteArray,
) -> Bool {
  trace @"=== TOKEN BURN VALIDATION ==="
  trace @"Context:"
  trace context
  let quantity = quantity_of(tx.mint, policy_id, asset_name)
  trace @"Token quantity:"
  trace quantity
  let result = quantity < 0
  if result {
    trace @"✓ Token burn PASSED"
    Void
  } else {
    trace @"✗ Token burn FAILED - quantity should be negative"
    Void
  }
  trace @"=== VALIDATION END ==="
  result?
}

/// Validates exact token quantity matching
/// 
/// Ensures that two integer quantities match exactly. Used for validating calculated
/// vs actual token amounts, game ID verification, and precise quantity checks.
///
/// ## Parameters
/// - `actual`: The actual quantity found in the transaction
/// - `expected`: The expected quantity based on calculations or rules
/// - `token_name`: Human-readable token identifier for debugging
/// - `context`: Identifying string for debugging (e.g., "bead-mint-referral")
///
/// ## Returns
/// - `Bool`: True if actual equals expected, False otherwise
///
/// ## Validation Logic
/// - Performs exact equality comparison (actual == expected)
/// - Logs both values for debugging mismatches
/// - Provides clear success/failure indicators
///
/// ## Example Usage
/// ```aiken
/// validation.validate_token_quantity_exact(
///   actual: mintedBeadQt,
///   expected: calcBead(totalAda),
///   token_name: "BEAD",
///   context: "bead-mint-referral",
/// )
/// ```
pub fn validate_token_quantity_exact(
  actual: Int,
  expected: Int,
  token_name: ByteArray,
  context: ByteArray,
) -> Bool {
  trace @"=== TOKEN QUANTITY EXACT VALIDATION ==="
  trace @"Context:"
  trace context
  trace @"Token name:"
  trace token_name
  trace @"Actual quantity:"
  trace actual
  trace @"Expected quantity:"
  trace expected
  let result = actual == expected
  if result {
    trace @"✓ Token quantity exact PASSED"
    Void
  } else {
    trace @"✗ Token quantity exact FAILED"
    Void
  }
  trace @"=== VALIDATION END ==="
  result?
}

// =============================================================================
// ADA BALANCE VALIDATION
// =============================================================================

/// Validates ADA balance equation for payout calculations
/// 
/// Ensures that ADA inputs minus payouts equal ADA outputs, maintaining balance
/// in the betting system. Critical for preventing ADA drain attacks.
///
/// ## Parameters
/// - `total_inputs`: Total ADA amount in validator inputs (lovelaces)
/// - `payout`: ADA amount being paid out to winners (lovelaces)  
/// - `total_outputs`: Total ADA amount in validator outputs (lovelaces)
/// - `context`: Identifying string for debugging (e.g., "bet-spend-claim")
///
/// ## Returns
/// - `Bool`: True if balance equation holds, False otherwise
///
/// ## Validation Logic
/// - Calculates: total_inputs - payout
/// - Compares with: total_outputs
/// - Equation must hold: inputs - payout = outputs
/// - Prevents over-payment and ADA drainage
///
/// ## Example Usage
/// ```aiken
/// validation.validate_ada_balance(
///   total_inputs: allOwnAdaInInputs,
///   payout: payout,
///   total_outputs: allOwnAdaInOutputs,
///   context: "bet-spend-claim",
/// )
/// ```
pub fn validate_ada_balance(
  total_inputs: Int,
  payout: Int,
  total_outputs: Int,
  context: ByteArray,
) -> Bool {
  trace @"=== ADA BALANCE VALIDATION ==="
  trace @"Context:"
  trace context
  trace @"Total inputs:"
  trace total_inputs
  trace @"Payout:"
  trace payout
  trace @"Total outputs:"
  trace total_outputs
  let expected = total_inputs - payout
  trace @"Expected outputs:"
  trace expected
  let result = expected == total_outputs
  if result {
    trace @"✓ ADA balance PASSED"
    Void
  } else {
    trace @"✗ ADA balance FAILED"
    trace @"Difference:"
    trace expected - total_outputs
    Void
  }
  trace @"=== VALIDATION END ==="
  result?
}

// =============================================================================
// ENHANCED TRACING UTILITIES
// =============================================================================

/// Enhanced trace with context information
pub fn trace_with_context(label: ByteArray, value: Data, context: ByteArray) {
  trace @"["
  trace context
  trace @"] "
  trace label
  trace @":"
  trace value
  Void
}

/// Trace calculation steps for better debugging
pub fn trace_calculation(
  operation: ByteArray,
  inputs: List<(ByteArray, Data)>,
  result: Data,
  context: ByteArray,
) {
  trace @"=== CALCULATION: "
  trace operation
  trace @" ("
  trace context
  trace @") ==="
  // Trace all inputs
  expect _ =
    foldr(
      inputs,
      True,
      fn(input, _) {
        let (label, value) = input
        trace @"Input - "
        trace label
        trace @":"
        trace value
        True
      },
    )
  trace @"Result:"
  trace result
  trace @"=== CALCULATION END ==="
  Void
}

// =============================================================================
// UTILITY FUNCTIONS FOR INPUT/OUTPUT FILTERING
// =============================================================================

/// Filters outputs by payment credential
/// 
/// Returns all transaction outputs that belong to a specific payment credential.
/// Used for calculating validator-specific ADA amounts in multi-validator transactions.
///
/// ## Parameters
/// - `outputs`: List of all transaction outputs
/// - `credential`: Payment credential to filter by
///
/// ## Returns
/// - `List<Output>`: Filtered list containing only matching outputs
///
/// ## Use Cases
/// - Calculating total ADA in validator outputs
/// - Filtering payout destinations
/// - Validator-specific balance calculations
pub fn get_outputs_by_credential(
  outputs: List<Output>,
  credential: PaymentCredential,
) -> List<Output> {
  outputs
    |> filter(fn(o) { o.address.payment_credential == credential })
}

/// Filters inputs by payment credential and extracts their outputs
/// 
/// Returns outputs from all transaction inputs that belong to a specific payment credential.
/// Used for calculating validator-specific input ADA amounts.
///
/// ## Parameters
/// - `inputs`: List of all transaction inputs
/// - `credential`: Payment credential to filter by
///
/// ## Returns
/// - `List<Output>`: List of outputs from matching inputs
///
/// ## Processing Steps
/// 1. Extract output from each input
/// 2. Filter by payment credential match
/// 3. Return filtered output list
///
/// ## Use Cases
/// - Calculating total ADA in validator inputs
/// - Input validation and verification
/// - Balance calculations for payouts
pub fn get_inputs_by_credential(
  inputs: List<Input>,
  credential: PaymentCredential,
) -> List<Output> {
  inputs
    |> map(fn(i) { i.output })
    |> filter(fn(o) { o.address.payment_credential == credential })
}

// =============================================================================
// PRIVATE TIMING UTILITY FUNCTIONS
// =============================================================================

/// Internal helper: Validates transaction starts after lock expiration
/// 
/// Checks if the transaction's validity range lower bound is after the specified time.
/// Used internally by validate_timing_after.
///
/// ## Parameters
/// - `range`: Transaction validity range
/// - `lock_expiration_time`: Minimum required start time
///
/// ## Returns
/// - `Bool`: True if transaction starts after lock time
fn must_start_after(range: ValidityRange, lock_expiration_time: POSIXTime) {
  when range.lower_bound.bound_type is {
    Finite(tx_earliest_time) -> lock_expiration_time <= tx_earliest_time
    _ -> False
  }
}

/// Internal helper: Validates transaction starts before redeem expiration
/// 
/// Checks if the transaction's validity range upper bound is before the specified time.
/// Used internally by validate_timing_before.
///
/// ## Parameters
/// - `range`: Transaction validity range
/// - `redeem_expiration_time`: Maximum allowed start time
///
/// ## Returns
/// - `Bool`: True if transaction starts before expiration time
fn must_start_before(range: ValidityRange, redeem_expiration_time: POSIXTime) {
  when range.upper_bound.bound_type is {
    Finite(tx_latest_time) -> redeem_expiration_time >= tx_latest_time
    _ -> False
  }
}
