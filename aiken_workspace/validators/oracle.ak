use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}
use validation

/// BEAD Protocol - Oracle Token Validator
/// =======================================
/// 
/// This validator manages the minting of oracle tokens used to publish game results
/// and other external data to the BEAD protocol. Oracle tokens represent verified
/// outcomes that can be consumed by betting contracts and other protocol components.
/// 
/// Features:
/// - Treasury-controlled oracle token minting
/// - Simple authorization model (treasury signature only)
/// - Designed for publishing game results and external data
/// - Integrates with BEAD protocol's betting system
/// 
/// Architecture:
/// - Minimal validator focused on authorization
/// - Uses shared validation library for treasury verification
/// - No complex redeemer logic (accepts any data)
/// - Fail-safe design with explicit failure for non-mint operations
/// 
/// Use Cases:
/// - Publishing sports game results
/// - Recording betting outcomes
/// - Providing external data feeds
/// - Creating verifiable oracle events
/// 
/// Security Model:
/// - Only treasury can mint oracle tokens
/// - No user-initiated oracle token creation
/// - Centralized but transparent oracle system
/// - Integrated with protocol's existing authorization
/// Oracle Token Minting Validator
/// 
/// Validates the minting of oracle tokens for publishing external data and game results.
/// This validator ensures only authorized treasury operations can create oracle tokens.
/// 
/// Parameters:
/// - _redeemer: Data payload (not validated, accepts any format)
/// - _policy_id: The policy ID of the oracle token (not used in validation)
/// - self: The transaction being validated
/// 
/// Returns:
/// - Bool: True if treasury signature is valid, False otherwise
/// 
/// Validation Logic:
/// - Requires treasury signature in extra signatories
/// - No additional validation on redeemer or token quantities
/// - Delegates to shared validation library for consistency
/// 
/// Security Features:
/// - Treasury-only minting prevents unauthorized oracle tokens
/// - Simple design reduces attack surface
/// - Consistent with protocol's authorization patterns
/// 
/// Example Usage:
/// ```
/// // Treasury mints oracle token for game result
/// Transaction {
///   extra_signatories: [treasury_key_hash],
///   mint: [oracle_token(1)],
///   ...
/// }
/// // Result: Oracle token minted successfully
/// ```
/// 
/// Integration:
/// - Works with betting validators that consume oracle tokens
/// - Part of BEAD protocol's data verification system
/// - Supports transparent outcome publication
validator oracle {
  mint(_redeemer: Data, _policy_id: PolicyId, self: Transaction) {
    let oracle_context = "oracle-mint"
    validation.validate_treasury_signature(
      self.extra_signatories,
      oracle_context,
    )
  }

  /// Default case handler for non-mint operations
  /// 
  /// Oracle tokens only support minting operations. All other operations
  /// (spending, burning with different endpoints) are explicitly rejected
  /// to maintain the security model.
  /// 
  /// This ensures oracle tokens can only be created, not arbitrarily manipulated.
  else(_) {
    fail
  }
}
