use aiken/crypto.{VerificationKeyHash}

pub type POSIXTime =
  Int

pub type BetAction {
  action: Int,
}

pub type BetMintingRedeemer {
  result: Int,
  action: Int,
}

pub type FixedP =
  Pair<Int, Int>

pub type BetDatum {
  winner: Int,
  betPolicyId: ByteArray,
  playerPkh: ByteArray,
}

pub type OracleDatum {
  gameId: Int,
  winner: Int,
  betPolicyId: ByteArray,
  totalAda: Int,
  totalWinning: Int,
}

pub type PaymentKeyHash =
  VerificationKeyHash

pub type StakeKeyHash =
  VerificationKeyHash
