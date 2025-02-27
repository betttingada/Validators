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
use util.{payedToAddress, signed_by, value_sent_to_pubkeyhash}

pub type BeadRedeemer {
  action: Int,
}

validator bead {
  mint(redeemer: BeadRedeemer, policy_id: PolicyId, self: Transaction) {
    trace @"Start"
    let ref_outputs = self.reference_inputs |> map(fn(o) { o.output })

    let paiedToTreasury =
      lovelace_of(value_sent_to_pubkeyhash(self, env.treasury))
    let mintedBeadQt = quantity_of(self.mint, policy_id, env.beadName)
    let mintedBeadReferralQt =
      quantity_of(self.mint, policy_id, env.beadReferralName)
    let unique =
      ref_outputs
        |> map(fn(out: Output) { out.address })
    when redeemer.action is {
      1 ->
        if length(unique) == 1 {
          trace @"referral"
          expect Some(referralAddress) = list.head(unique)
          let paiedToReferral = payedToAddress(self, referralAddress)
          let beadReferralQt =
            maxReferral(
              getReferralBeadFromReference(
                ref_outputs,
                policy_id,
                env.beadReferralName,
              ),
            )
          and {
            verifyRatios(paiedToTreasury, paiedToReferral, beadReferralQt)?,
            (mintedBeadQt == calcBead(paiedToTreasury + paiedToReferral))?,
            (mintedBeadReferralQt == calcBeadReferral(
              paiedToTreasury + paiedToReferral,
            ))?,
          }
        } else if length(unique) == 0 {
          trace @"no referral"
          and {
            validatePayedAndMintedBead(mintedBeadQt, paiedToTreasury)?,
            validatePayedAndMintedBeadReferral(
              mintedBeadReferralQt,
              paiedToTreasury,
            )?,
          }
        } else {
          fail @"Invalid Referrals"
        }
      2 -> signed_by(env.treasury, self.extra_signatories)?
      3 -> (mintedBeadQt < 0)?
      _ -> fail @"Invalid Action"
    }
  }

  else(_) {
    fail @"Master"
  }
}

pub fn getReferralBeadFromReference(
  refs: List<Output>,
  policyId: PolicyId,
  assetName: AssetName,
) -> Int {
  refs
    |> map(fn(o) { quantity_of(o.value, policyId, assetName) })
    |> foldl(0, fn(acc, x) { acc + x })
}

pub fn maxReferral(ref: Int) -> Int {
  if ref > 50 {
    50
  } else {
    ref
  }
}

pub fn verifyRatios(treasuryAda: Int, referralAda: Int, ratio: Int) -> Bool {
  let total = treasuryAda + referralAda
  trace total
  trace referralAda
  let m = total * ratio / 100
  trace m
  m == referralAda
}

pub fn calcBead(input: Int) -> Int {
  when input is {
    200_000_000 -> 1000
    400_000_000 -> 2040
    600_000_000 -> 3090
    800_000_000 -> 4060
    1_000_000_000 -> 5250
    2_000_000_000 -> 10500

    _ -> input * 5 / 100_000
  }
}

pub fn calcBeadReferral(input: Int) -> Int {
  when input is {
    200_000_000 -> 5
    400_000_000 -> 10
    600_000_000 -> 15
    800_000_000 -> 20
    1_000_000_000 -> 25
    2_000_000_000 -> 50

    _ -> 0
  }
}

pub fn validatePayedAndMintedBead(
  mintedBeadQt: Int,
  paiedToTreasury: Int,
) -> Bool {
  let c = calcBead(paiedToTreasury)
  mintedBeadQt == c && mintedBeadQt > 0 && c > 0
}

pub fn validatePayedAndMintedBeadReferral(
  mintedBeadReferralQt: Int,
  paiedToTreasury: Int,
) -> Bool {
  let c = calcBeadReferral(paiedToTreasury)
  mintedBeadReferralQt == c && mintedBeadReferralQt > 0 && c > 0
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
