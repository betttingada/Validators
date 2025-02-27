use aiken/collection/list.{filter, map}
use aiken/interval.{Finite}
use aiken/math/rational
use aiken/primitive/string
use cardano/address.{Address}
use cardano/assets.{AssetName, PolicyId, from_lovelace, quantity_of}
use cardano/transaction.{
  InlineDatum, Output, OutputReference, Transaction, ValidityRange,
  find_script_outputs,
}
use cocktail.{value_policy_info}
use env
use mocktail.{
  complete, mint, mocktail_tx, ref_tx_in, required_signer_hash, tx_in, tx_out,
}
use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_key_hash.{mock_policy_id}
use mocktail/virgin_output_reference.{mock_tx_hash}
use types.{BetAction, BetMintingRedeemer, OracleDatum, POSIXTime}
use util.{getAdaInOutputs, signed_by}

validator bet(gameId: Int, gameName: ByteArray, gameDate: POSIXTime) {
  mint(r: BetMintingRedeemer, policy_id: PolicyId, self: Transaction) {
    let betAssetName: AssetName = getResultBA(gameName, r.result)
    let betQt = quantity_of(self.mint, policy_id, betAssetName)
    // MINT
    if r.action == 0 {
      let beadQt = quantity_of(self.mint, env.beadPolicyId, env.beadName)
      let paidToPot =
        getAdaInOutputs(find_script_outputs(self.outputs, policy_id))

      and {
        lessThanHaft(paidToPot, -1 * beadQt)?,
        if betQt == paidToPot + -1_000_000 * beadQt {
          True
        } else {
          fail betAssetName
        },
        must_start_before(self.validity_range, gameDate)?,
        True == True,
      }
    } else {
      and {
        must_start_after(self.validity_range, gameDate)?,
        (betQt < 0)?,
      }
    }
  }

  spend(
    _d: Option<Data>,
    redeemer: BetAction,
    my_output_reference: OutputReference,
    self: Transaction,
  ) {
    when redeemer.action is {
      0 -> {
        expect [oracleIn] = self.reference_inputs
        expect InlineDatum(oracle_datum_) = oracleIn.output.datum
        expect Some((policyId, _, _)) =
          value_policy_info(oracleIn.output.value, env.oraclePolicyId)

        expect oracle_datum: OracleDatum = oracle_datum_
        let OracleDatum(game, winner, gamePolicyId, totalAda, totalWinnings) =
          oracle_datum
        let betAssetName: AssetName = getResultBA(gameName, winner)
        let betQt = quantity_of(self.mint, gamePolicyId, betAssetName)

        expect Some(ownInput) =
          self.inputs
            |> transaction.find_input(my_output_reference)
        let ownHash = ownInput.output.address.payment_credential

        let Address { payment_credential, .. } = oracleIn.output.address
        expect payment_credential == ownHash
        let allOwnInputs =
          self.inputs
            |> map(fn(i) { i.output })
            |> filter(fn(o) { o.address.payment_credential == ownHash })
        let allOwnAdaInInputs = getAdaInOutputs(allOwnInputs)
        let allOwnOutputs =
          self.outputs
            |> filter(fn(o) { o.address.payment_credential == ownHash })
        let allOwnAdaInOutputs = getAdaInOutputs(allOwnOutputs)
        expect Some(rd) = rational.new(-1 * betQt, totalWinnings)
        expect Some(totalRat) = rational.new(totalAda, 1)
        let r = rational.mul(rd, totalRat)
        and {
          must_start_after(self.validity_range, gameDate)?,
          (game == gameId)?,
          (policyId == env.oraclePolicyId)?,
          (betQt < 0)?,
          (allOwnAdaInInputs - rational.ceil(r) == allOwnAdaInOutputs)?,
        }
      }
      2 -> signed_by(env.treasury, self.extra_signatories)?
      _ -> fail @"Invalid Action"
    }
  }

  else(_) {
    fail
  }
}

pub fn datum_of(output: Output) -> Option<Data> {
  when output.datum is {
    transaction.InlineDatum(d) -> Some(d)
    _ -> None
  }
}

pub fn lessThanHaft(lovelaces: Int, bead: Int) -> Bool {
  if bead > 0 {
    lovelaces / ( bead * 1_000_000 ) >= 2
  } else {
    True
  }
}

fn must_start_after(range: ValidityRange, lock_expiration_time: POSIXTime) {
  when range.lower_bound.bound_type is {
    Finite(tx_earliest_time) -> lock_expiration_time <= tx_earliest_time
    _ -> False
  }
}

fn must_start_before(range: ValidityRange, redeem_expiration_time: POSIXTime) {
  when range.upper_bound.bound_type is {
    Finite(tx_latest_time) -> redeem_expiration_time >= tx_latest_time
    _ -> False
  }
}

pub fn checkGameResultCorrect(
  gameNameBA: ByteArray,
  gameResultBA: ByteArray,
  gameResult: Int,
) {
  let gameName: String = string.from_bytearray(gameNameBA)
  let result: String = string.from_int(gameResult)
  let finalName = string.concat(left: result, right: gameName)
  string.to_bytearray(finalName) == gameResultBA
}

pub fn getResultBA(gameNameBA: ByteArray, gameResult: Int) -> ByteArray {
  let gameName: String = string.from_bytearray(gameNameBA)
  let result: String = string.from_int(gameResult)
  let finalName = string.concat(left: result, right: gameName)
  string.to_bytearray(finalName)
}
// fn tx_make_a_bet(
//   gameId: Int,
//   gameName: ByteArray,
//   gameDate: POSIXTime,
// ) -> Transaction {
//   // let redeemer: BetMintingRedeemer = { action: 0 }

//   let buyer_address = mock_pub_key_address(0, None)
//   let betPolicyId = mock_policy_id(0)
//   mocktail_tx()
//     |> tx_in(True, betPolicyId, 0, from_lovelace(5_000_000), buyer_address)
//     |> complete()
// }

// test test_betting_in_game_success() {
//   let gameId: Int = 1
//   // let gameName: ByteArray = string.to_bytearray(":Porto + Benfica")
//   // bet.mint(
//   //   BetMintingRedeemer,
//   //   tx_make_a_bet(1, #"game1", 1000)
//   // )
// }
