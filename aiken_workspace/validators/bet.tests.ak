use aiken/primitive/bytearray
use aiken/primitive/string
use bet.{lessThanHaft}

test stringy_test() {
  let gameName = @"1:Santa Clara - GIL Vicente : 2024/10/25 19:45 UTC"
  let gameBA = string.to_bytearray(gameName)

  let gameFB = string.from_bytearray(gameBA)

  gameName == gameFB
}

test extract_result_from_name_1_test() {
  let gameBA =
    string.to_bytearray(@"1:Santa Clara - GIL Vicente : 2024/10/25 19:45 UTC")

  bytearray.starts_with(gameBA, prefix: "1") == True
}

test extract_result_from_name_0_test() {
  let gameBA =
    string.to_bytearray(@"1:Santa Clara - GIL Vicente : 2024/10/25 19:45 UTC")

  bytearray.starts_with(gameBA, prefix: "0") == False
}

test extract_result_from_name_2_test() {
  let gameBA =
    string.to_bytearray(@"2:Santa Clara - GIL Vicente : 2024/10/25 19:45 UTC")

  bytearray.starts_with(gameBA, prefix: "2") == True
}

// test bead_address() {
//   let beadPolicyId: PolicyId = env.beadPolicyId
//   let beadAddress: Address = from_script(beadPolicyId)
//   trace beadAddress
//   True
// }

test verify_game_result() {
  let gameResultBA = string.to_bytearray(@"2:Porto")
  let gameNameBA = string.to_bytearray(@":Porto")
  let gameName: String = string.from_bytearray(gameNameBA)
  let result: String = string.from_int(2)

  let finalName = string.concat(left: result, right: gameName)
  trace gameNameBA
  trace gameResultBA
  trace finalName
  string.to_bytearray(finalName) == gameResultBA
}

test morethanhalf_test() {
  lessThanHaft(50_000_000, 25) == True
}

test morethanhalf_test_zero() {
  lessThanHaft(50_000_000, 0) == True
}
