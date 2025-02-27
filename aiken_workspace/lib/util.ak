//// calculate winnings : total wining bet, total ada in pot, my winning tickets

use aiken/collection/list.{filter, foldl, map}
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{
  Address, Inline, PaymentCredential, VerificationKey, from_verification_key,
}
use cardano/assets.{
  AssetName, PolicyId, Value, lovelace_of, merge, quantity_of, zero,
}
use cardano/transaction.{Output, Transaction}
use types.{FixedP, PaymentKeyHash, StakeKeyHash}

pub fn fixed_point_division(
  valorI: Int,
  interesI: Int,
  precision: Int,
) -> FixedP {
  let valorFix = valorI * precision_multiplier(precision)
  let interesFix = interesI * precision_multiplier(precision)

  Pair(
    valorFix / interesFix,
    valorI % interesI * precision_multiplier(precision) / interesI,
  )
}

pub fn precision_multiplier(precision: Int) -> Int {
  when precision is {
    0 -> 1
    1 -> 10
    2 -> 100
    3 -> 1000
    4 -> 10000
    5 -> 100000
    6 -> 1000000
    7 -> 10000000
    8 -> 100000000
    9 -> 1000000000
    10 -> 10000000000
    _ -> fail
  }
}

pub fn getAdaInOutputsToAddress(outputs: List<Output>, address: Address) -> Int {
  outputs
    |> filter(fn(o) { o.address == address })
    |> map(fn(o) { lovelace_of(o.value) })
    |> foldl(0, fn(acc, x) { acc + x })
}

pub fn getAdaInOutputs(outputs: List<Output>) -> Int {
  outputs
    |> map(fn(o) { lovelace_of(o.value) })
    |> foldl(0, fn(acc, x) { acc + x })
}

pub fn compare_token_names(an: AssetName, tn: Option<ByteArray>) -> Bool {
  expect Some(tn) = tn
  an == tn
}

pub fn getTokenInOutputsBurned(
  outputs: List<Output>,
  policyId: PolicyId,
  assetName: AssetName,
) -> Int {
  outputs
    |> map(fn(o) { quantity_of(o.value, policyId, assetName) })
    |> foldl(0, fn(acc, x) { acc + x })
}

pub fn getTokenInOutputs(
  outputs: List<Output>,
  policyId: PolicyId,
  assetName: AssetName,
  address: Address,
) -> Int {
  outputs
    |> filter(fn(o) { o.address == address })
    |> map(fn(o) { quantity_of(o.value, policyId, assetName) })
    |> foldl(0, fn(acc, x) { acc + x })
}

pub fn signed_by(signer: ByteArray, signatories: List<ByteArray>) {
  if list.has(signatories, signer) {
    True
  } else {
    fail @"@not signedBy"
  }
}

pub fn signer(signatories: List<ByteArray>) -> ByteArray {
  expect [x, ..] = signatories
  x
}

pub fn payedToAddress(self: Transaction, address: Address) -> Int {
  getAdaInOutputsToAddress(self.outputs, address)
}

pub fn value_sent_to_pubkeyhash(
  tx: Transaction,
  pubkeyhash: VerificationKeyHash,
) -> Value {
  let outputs =
    list.filter(
      tx.outputs,
      fn(output) {
        let cred: PaymentCredential = output.address.payment_credential
        let pay_addr: Address =
          Address { payment_credential: cred, stake_credential: None }
        let pubkey_addr = from_verification_key(pubkeyhash)
        pay_addr == pubkey_addr
      },
    )
  let val =
    list.foldl(
      outputs,
      zero,
      fn(output: Output, final_val: Value) -> Value {
        merge(final_val, output.value)
      },
    )
  val
}

test fixed_point_example_test() {
  let fp = fixed_point_division(100, 2000, 6)
  let Pair(n, d) = fp
  n * 1000000 + d == 50000
}

test fixed_point_example_test_1() {
  let fp = fixed_point_division(11, 14, 6)
  let Pair(n, d) = fp
  n * 1000000 + d == 785714
}

pub fn address_from_tuple(key_hash_tuple: (PaymentKeyHash, StakeKeyHash)) {
  let (pkh, skh) = key_hash_tuple
  Address {
    payment_credential: pkh |> VerificationKey,
    stake_credential: if skh == "" {
      None
    } else {
      skh |> VerificationKey |> Inline |> Some
    },
  }
}
