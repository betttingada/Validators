use bead.{calcBead, maxReferral, validatePayedAndMintedBead, verifyRatios}

test maxReferralAbove_test() {
  maxReferral(51) == 50
}

test maxReferralBelow_test() {
  maxReferral(23) == 23
}

test verifyRatios_OK_test() {
  verifyRatios(100, 100, 50) == True
}

test calcBead_test() {
  calcBead(200000000) == 1000
}

test calcBead_test1() {
  calcBead(20_000_000) != 100
}

test verifyRatio_2() {
  verifyRatios(180_000_000, 20_000_000, 4) == False
}

test verifyRatio_3() {
  verifyRatios(150_000_000, 50_000_000, 25) == True
}

test verifyRatio_4() {
  verifyRatios(450_000_000, 150_000_000, 25) == True
}

test verifyRatio_5() {
  verifyRatios(510_000_000, 90_000_000, 15) == True
}

test validatePayedAndMintedBead_test1() {
  validatePayedAndMintedBead(1000, 200_000_000) == True
}

test validatePayedAndMintedBead_test12() {
  trace validatePayedAndMintedBead(111111111111, 20_000_000)
  validatePayedAndMintedBead(111111111111, 20_000_000) == False
}
// fn mock_tx(is_owner_signed: Bool) -> Transaction {
//   mocktail_tx()
//     |> required_signer_hash(is_owner_signed, mock_pub_key_hash(0))
//     |> complete()
// }
