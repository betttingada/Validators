use aiken/crypto.{VerificationKeyHash}
use aiken/primitive/string

pub const treasury: VerificationKeyHash =
  #"d5434e727e2b5761e61e8aee4fbdfea3db9b5600a9d989eb7b7fa377"

pub const beadName: ByteArray = string.to_bytearray(@"BEAD PR")

pub const beadReferralName: ByteArray = string.to_bytearray(@"BEADR PR")

pub const beadPolicyId: ByteArray =
  #"0e7c63a49875d9bbd46cf17511d838156718218f79e9466ccc99b0a2"

pub const oraclePolicyId: ByteArray =
  #"16aefa4b1eacca5884189dfab880d18f4b182ce445d66da1240d76e0"
