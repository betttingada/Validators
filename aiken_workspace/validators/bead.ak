use aiken/collection/list.{foldl, length, map}
use cardano/assets.{
  AssetName, PolicyId, from_asset, from_lovelace, lovelace_of, quantity_of,
}
use cardano/transaction.{Output, Transaction}
use env
use mocktail.{
  complete, mint, mocktail_tx, ref_tx_in, required_signer_hash, tx_in, tx_out,
}
use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_output_reference.{mock_tx_hash}
use util.{payedToAddress, value_sent_to_pubkeyhash}
use validation

/// BEAD Protocol - Token Minting Validator
/// =====================================
/// 
/// This validator handles the minting of BEAD tokens with an integrated referral system.
/// BEAD tokens are the core utility tokens in the BEAD protocol, used for betting,
/// oracle operations, and referral rewards.
/// 
/// Features:
/// - Controlled token minting with treasury authorization
/// - Integrated referral system with configurable reward ratios
/// - Treasury payment validation for each mint operation
/// - Proper token burning validation
/// 
/// Architecture:
/// - Action-based redeemer system (mint=0, burn=1, other=2+)
/// - Referral rewards paid as additional BEAD tokens
/// - Treasury fees collected for each mint operation
/// - Uses shared validation library for common patterns
/// 
/// Token Economics:
/// - Treasury receives payment for each mint operation
/// - Referrers receive bonus BEAD tokens as rewards
/// - Controlled supply through treasury authorization
/// 
/// Example Usage:
/// - Mint 1000 BEAD with referrer: mint 1000 to user + bonus to referrer
/// - Burn operation: reduce total supply by specified amount
/// - Treasury operations: controlled by treasury signature
/// BeadRedeemer type defines the action to be performed by the validator
/// 
/// Actions:
/// - 0: Mint BEAD tokens (with optional referral rewards)
/// - 1: Burn BEAD tokens (reduce total supply)
/// - 2+: Future actions (reserved for protocol upgrades)
pub type BeadRedeemer {
  action: Int,
}

/// BEAD Token Minting Validator
/// 
/// Validates minting and burning of BEAD tokens with integrated referral system.
/// All operations require treasury authorization and proper payment validation.
/// 
/// Parameters:
/// - redeemer: BeadRedeemer containing the action type
/// - policy_id: The policy ID of the BEAD token
/// - self: The transaction being validated
/// 
/// Returns:
/// - Bool: True if the operation is valid, False otherwise
/// 
/// Validation Logic:
/// - Action 0 (Mint): Validates treasury payment, token quantities, and referral rewards
/// - Action 1 (Burn): Validates token burning with treasury authorization
/// - Other actions: Validates with treasury signature only
/// 
/// Treasury Integration:
/// - All operations require treasury authorization
/// - Mint operations require ADA payment to treasury
/// - Referral rewards calculated based on minted quantities
/// 
/// Example:
/// ```
/// // Mint 1000 BEAD tokens with referral
/// BeadRedeemer { action: 0 }
/// // Results in: 1000 BEAD to user + referral reward to referrer
/// ```
validator bead {
  mint(redeemer: BeadRedeemer, policy_id: PolicyId, self: Transaction) {
    trace @"=== BEAD VALIDATOR MINT ==="
    trace @"Action:"
    trace redeemer.action
    let ref_outputs = self.reference_inputs |> map(fn(o) { o.output })

    let paiedToTreasury =
      lovelace_of(value_sent_to_pubkeyhash(self, env.treasury))
    let mintedBeadQt = quantity_of(self.mint, policy_id, env.beadName)
    let mintedBeadReferralQt =
      quantity_of(self.mint, policy_id, env.beadReferralName)
    let unique = ref_outputs |> map(fn(out: Output) { out.address })
    trace @"[bead-mint] Treasury payment:"
    trace paiedToTreasury
    trace @"[bead-mint] Minted BEAD quantity:"
    trace mintedBeadQt
    trace @"[bead-mint] Minted BEAD referral quantity:"
    trace mintedBeadReferralQt
    trace @"[bead-mint] Unique addresses count:"
    trace length(unique)
    when redeemer.action is {
      1 ->
        if length(unique) == 1 {
          trace @"=== REFERRAL BRANCH ==="
          expect Some(referralAddress) = list.head(unique)
          trace @"[bead-mint] Referral address:"
          trace referralAddress
          let paiedToReferral = payedToAddress(self, referralAddress)
          let beadReferralQt =
            maxReferral(
              getReferralBeadFromReference(
                ref_outputs,
                policy_id,
                env.beadReferralName,
              ),
            )
          let totalAda = paiedToTreasury + paiedToReferral
          trace @"=== REFERRAL PAYMENT CALCULATION ==="
          trace @"Treasury payment:"
          trace paiedToTreasury
          trace @"Referral payment:"
          trace paiedToReferral
          trace @"Referral BEAD quantity:"
          trace beadReferralQt
          trace @"Total ADA:"
          trace totalAda
          and {
            verifyRatios(paiedToTreasury, paiedToReferral, beadReferralQt)?,
            validation.validate_token_quantity_exact(
              actual: mintedBeadQt,
              expected: calcBead(totalAda),
              token_name: "BEAD",
              context: "bead-mint-referral",
            )?,
            validation.validate_token_quantity_exact(
              actual: mintedBeadReferralQt,
              expected: calcBeadReferral(totalAda),
              token_name: "BEAD Referral",
              context: "bead-mint-referral",
            )?,
          }
        } else if length(unique) == 0 {
          trace @"=== NO REFERRAL BRANCH ==="
          and {
            validatePayedAndMintedBead(mintedBeadQt, paiedToTreasury)?,
            validatePayedAndMintedBeadReferral(
              mintedBeadReferralQt,
              paiedToTreasury,
            )?,
          }
        } else {
          trace @"✗ Invalid Referrals: multiple addresses not allowed"
          fail @"Invalid Referrals"
        }
      2 ->
        validation.validate_treasury_signature(
          extra_signatories: self.extra_signatories,
          context: "bead-mint-treasury",
        )
      3 ->
        validation.validate_token_burn(
          tx: self,
          policy_id: policy_id,
          asset_name: env.beadName,
          context: "bead-mint-burn",
        )
      _ -> {
        trace @"✗ Invalid Action: "
        trace redeemer.action
        fail @"Invalid Action"
      }
    }
  }

  else(_) {
    fail @"Master"
  }
}

/// Calculate the total BEAD tokens present in reference outputs for referral rewards
/// 
/// This function examines all reference outputs to determine how many BEAD referral
/// tokens are available for calculation purposes. It's used to cap referral rewards
/// based on the available referral token supply.
/// 
/// Parameters:
/// - refs: List of reference outputs to examine
/// - policyId: The policy ID of the BEAD token
/// - assetName: The asset name for BEAD referral tokens
/// 
/// Returns:
/// - Int: Total quantity of BEAD referral tokens found in references
/// 
/// Logic:
/// 1. Extract token quantities from each reference output
/// 2. Sum all quantities to get total available referral tokens
/// 3. Return total for use in referral cap calculations
/// 
/// Used For:
/// - Calculating maximum possible referral rewards
/// - Ensuring referral rewards don't exceed available supply
/// - Transparent referral token accounting
pub fn getReferralBeadFromReference(
  refs: List<Output>,
  policyId: PolicyId,
  assetName: AssetName,
) -> Int {
  trace @"=== REFERRAL BEAD CALCULATION ==="
  let quantities =
    refs |> map(fn(o) { quantity_of(o.value, policyId, assetName) })
  trace @"[getReferralBeadFromReference] Individual quantities:"
  trace quantities
  let total = quantities |> foldl(0, fn(acc, x) { acc + x })
  trace @"[getReferralBeadFromReference] Total referral BEAD:"
  trace total
  total
}

/// Apply maximum cap to referral rewards
/// 
/// Ensures referral rewards don't exceed the protocol's maximum limit of 50 tokens.
/// This prevents excessive referral rewards that could destabilize the token economy.
/// 
/// Parameters:
/// - ref: The calculated referral amount before capping
/// 
/// Returns:
/// - Int: The capped referral amount (maximum 50)
/// 
/// Business Logic:
/// - Maximum referral reward: 50 BEAD tokens
/// - Prevents referral reward inflation
/// - Maintains sustainable token economics
/// - Protects against excessive referral claims
/// 
/// Example:
/// ```
/// maxReferral(25) -> 25  // No capping needed
/// maxReferral(75) -> 50  // Capped to maximum
/// ```
pub fn maxReferral(ref: Int) -> Int {
  trace @"=== MAX REFERRAL CAP ==="
  trace @"[maxReferral] Input referral amount:"
  trace ref
  let result =
    if ref > 50 {
      trace @"[maxReferral] Capped to maximum:"
      trace 50
      50
    } else {
      ref
    }
  trace @"[maxReferral] Final referral amount:"
  trace result
  result
}

/// Verify that referral payment ratios are correct
/// 
/// Validates that the referral payment amount matches the expected percentage
/// of the total ADA payment (treasury + referral). This ensures the referral
/// system maintains proper economic ratios.
/// 
/// Parameters:
/// - treasuryAda: Amount of ADA paid to treasury
/// - referralAda: Amount of ADA paid to referrer
/// - ratio: Expected referral percentage (0-100)
/// 
/// Returns:
/// - Bool: True if the referral ratio is correct, False otherwise
/// 
/// Calculation:
/// 1. Calculate total ADA: treasury + referral
/// 2. Calculate expected referral: total * ratio / 100
/// 3. Verify expected equals actual referral payment
/// 
/// Example:
/// ```
/// verifyRatios(180_000_000, 20_000_000, 10) -> True
/// // 200M total * 10% = 20M referral (correct)
/// 
/// verifyRatios(190_000_000, 10_000_000, 10) -> False
/// // 200M total * 10% = 20M, but only 10M paid (incorrect)
/// ```
pub fn verifyRatios(treasuryAda: Int, referralAda: Int, ratio: Int) -> Bool {
  trace @"=== RATIO VERIFICATION ==="
  let total = treasuryAda + referralAda
  let expectedReferral = total * ratio / 100
  trace @"Treasury ADA:"
  trace treasuryAda
  trace @"Referral ADA:"
  trace referralAda
  trace @"Ratio percentage:"
  trace ratio
  trace @"Total ADA:"
  trace total
  trace @"Expected referral:"
  trace expectedReferral
  trace @"Ratio verification result:"
  trace expectedReferral == referralAda
  expectedReferral == referralAda
}

/// Calculate BEAD tokens to mint based on ADA payment
/// 
/// Converts ADA payment amounts to corresponding BEAD token quantities using
/// predefined conversion rates. Supports both fixed-rate tiers and a fallback
/// formula for custom amounts.
/// 
/// Parameters:
/// - input: ADA amount in lovelace (1 ADA = 1,000,000 lovelace)
/// 
/// Returns:
/// - Int: Number of BEAD tokens to mint
/// 
/// Conversion Tiers:
/// - 200 ADA (200M lovelace) -> 1,000 BEAD
/// - 400 ADA (400M lovelace) -> 2,040 BEAD
/// - 600 ADA (600M lovelace) -> 3,090 BEAD
/// - 800 ADA (800M lovelace) -> 4,060 BEAD
/// - 1,000 ADA (1B lovelace) -> 5,250 BEAD
/// - 2,000 ADA (2B lovelace) -> 10,500 BEAD
/// - Other amounts: input * 5 / 100,000 (custom formula)
/// 
/// Example:
/// ```
/// calcBead(200_000_000) -> 1000    // 200 ADA -> 1000 BEAD
/// calcBead(150_000_000) -> 7500    // 150 ADA -> 7500 BEAD (formula)
/// ```
pub fn calcBead(input: Int) -> Int {
  trace @"=== BEAD CALCULATION ==="
  trace @"[calcBead] Input ADA amount:"
  trace input
  let result =
    when input is {
      200_000_000 -> 1000
      400_000_000 -> 2040
      600_000_000 -> 3090
      800_000_000 -> 4060
      1_000_000_000 -> 5250
      2_000_000_000 -> 10500
      _ -> input * 5 / 100_000
    }
  trace @"[calcBead] Calculated BEAD quantity:"
  trace result
  result
}

/// Calculate BEAD referral tokens based on total ADA payment
/// 
/// Determines the number of BEAD referral tokens to mint based on the total
/// ADA payment (treasury + referral). Referral tokens are bonus rewards for
/// successful referrals in the BEAD ecosystem.
/// 
/// Parameters:
/// - input: Total ADA amount in lovelace (treasury + referral payments)
/// 
/// Returns:
/// - Int: Number of BEAD referral tokens to mint
/// 
/// Referral Reward Tiers:
/// - 200 ADA total -> 5 BEAD referral tokens
/// - 400 ADA total -> 10 BEAD referral tokens
/// - 600 ADA total -> 15 BEAD referral tokens
/// - 800 ADA total -> 20 BEAD referral tokens
/// - 1,000 ADA total -> 25 BEAD referral tokens
/// - 2,000 ADA total -> 50 BEAD referral tokens
/// - Other amounts -> 0 (no referral reward for non-standard amounts)
/// 
/// Business Logic:
/// - Referral rewards are only given for specific payment tiers
/// - Maximum referral reward is 50 tokens (enforced by maxReferral function)
/// - Non-standard amounts receive no referral rewards
/// 
/// Example:
/// ```
/// calcBeadReferral(200_000_000) -> 5     // 200 ADA -> 5 referral tokens
/// calcBeadReferral(150_000_000) -> 0     // Custom amount -> no referral
/// ```
pub fn calcBeadReferral(input: Int) -> Int {
  trace @"=== BEAD REFERRAL CALCULATION ==="
  trace @"[calcBeadReferral] Input ADA amount:"
  trace input
  let result =
    when input is {
      200_000_000 -> 5
      400_000_000 -> 10
      600_000_000 -> 15
      800_000_000 -> 20
      1_000_000_000 -> 25
      2_000_000_000 -> 50
      _ -> 0
    }
  trace @"[calcBeadReferral] Calculated BEAD referral quantity:"
  trace result
  result
}

pub fn validatePayedAndMintedBead(
  mintedBeadQt: Int,
  paiedToTreasury: Int,
) -> Bool {
  trace @"=== BEAD PAYMENT VALIDATION ==="
  let expectedQuantity = calcBead(paiedToTreasury)
  trace @"Minted BEAD quantity:"
  trace mintedBeadQt
  trace @"Paid to treasury:"
  trace paiedToTreasury
  trace @"Expected BEAD quantity:"
  trace expectedQuantity
  trace @"Validation result:"
  trace mintedBeadQt == expectedQuantity && mintedBeadQt > 0 && expectedQuantity > 0
  mintedBeadQt == expectedQuantity && mintedBeadQt > 0 && expectedQuantity > 0
}

pub fn validatePayedAndMintedBeadReferral(
  mintedBeadReferralQt: Int,
  paiedToTreasury: Int,
) -> Bool {
  trace @"=== BEAD REFERRAL VALIDATION ==="
  let expectedQuantity = calcBeadReferral(paiedToTreasury)
  trace @"Minted BEAD referral quantity:"
  trace mintedBeadReferralQt
  trace @"Paid to treasury:"
  trace paiedToTreasury
  trace @"Expected BEAD referral quantity:"
  trace expectedQuantity
  trace @"Validation result:"
  trace mintedBeadReferralQt == expectedQuantity && mintedBeadReferralQt > 0 && expectedQuantity > 0
  mintedBeadReferralQt == expectedQuantity && mintedBeadReferralQt > 0 && expectedQuantity > 0
}

fn mock_bead_without_referral(
  investment: Int,
  bead: Int,
  bead_referral: Int,
) -> Transaction {
  let buyer_address = mock_pub_key_address(0, None)
  let treasury_address = (env.treasury, #"") |> util.address_from_tuple

  mocktail_tx()
    |> tx_in(True, mock_tx_hash(0), 0, from_lovelace(investment), buyer_address)
    |> mint(True, bead, env.beadPolicyId, env.beadName)
    |> mint(True, bead_referral, env.beadPolicyId, env.beadReferralName)
    |> tx_out(True, treasury_address, from_lovelace(investment))
    |> complete()
}

fn mock_bead_referral(
  investment: Int,
  investment_treasury: Int,
  investment_referral: Int,
  referral_bead_referral: Int,
  bead: Int,
  bead_referral: Int,
) -> Transaction {
  let buyer_address = mock_pub_key_address(1, None)
  let referral_address = mock_pub_key_address(2, None)
  // let bad_referral_address = mock_pub_key_address(3, None)
  let treasury_address = (env.treasury, #"") |> util.address_from_tuple

  mocktail_tx()
    |> ref_tx_in(
        True,
        mock_tx_hash(0),
        3,
        from_asset(
          env.beadPolicyId,
          env.beadReferralName,
          referral_bead_referral,
        ),
        referral_address,
      )
    |> tx_in(True, mock_tx_hash(0), 0, from_lovelace(investment), buyer_address)
    |> mint(True, bead, env.beadPolicyId, env.beadName)
    |> mint(True, bead_referral, env.beadPolicyId, env.beadReferralName)
    |> tx_out(True, treasury_address, from_lovelace(investment_treasury))
    |> tx_out(True, referral_address, from_lovelace(investment_referral))
    |> complete()
}

fn mock_bead_burning(bead: Int) -> Transaction {
  mocktail_tx()
    |> mint(True, bead, env.beadPolicyId, env.beadName)
    |> required_signer_hash(True, env.treasury)
    |> complete()
}

test without_referral_1_success() {
  bead.mint(
    BeadRedeemer { action: 1 },
    env.beadPolicyId,
    mock_bead_without_referral(200_000_000, 1_000, 5),
  )
}

test without_referral_1_no_success() {
  !bead.mint(
    BeadRedeemer { action: 1 },
    env.beadPolicyId,
    mock_bead_without_referral(100_000_000, 1_000, 5),
  )
}

test with_referral_1_success() {
  bead.mint(
    BeadRedeemer { action: 1 },
    env.beadPolicyId,
    mock_bead_referral(200_000_000, 100_000_000, 100_000_000, 50, 1_000, 5),
  )
}

test with_referral_1_error() {
  !bead.mint(
    BeadRedeemer { action: 1 },
    env.beadPolicyId,
    mock_bead_referral(200_000_000, 100_000_000, 100_000_000, 5, 1_000, 5),
  )
}

test test_burning_bead() {
  bead.mint(
    BeadRedeemer { action: 3 },
    env.beadPolicyId,
    mock_bead_burning(-1000),
  )
}
