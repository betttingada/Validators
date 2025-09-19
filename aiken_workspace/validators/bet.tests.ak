use aiken/primitive/bytearray
use aiken/primitive/string
use bet.{checkGameResultCorrect, lessThanHaft}

test stringy_test() {
  let gameName = @"1_Santa Clara - GIL Vicente : 2024/10/25 19:45 UTC"
  let gameBA = string.to_bytearray(gameName)
  let gameFB = string.from_bytearray(gameBA)
  gameName == gameFB
}

test extract_result_from_name_1_test() {
  let gameBA =
    string.to_bytearray(@"1_Santa Clara - GIL Vicente : 2024/10/25 19:45 UTC")

  bytearray.starts_with(gameBA, prefix: "1") == True
}

test extract_result_from_name_0_test() {
  let gameBA =
    string.to_bytearray(@"1_Santa Clara - GIL Vicente : 2024/10/25 19:45 UTC")

  bytearray.starts_with(gameBA, prefix: "0") == False
}

test extract_result_from_name_2_test() {
  let gameBA =
    string.to_bytearray(@"2_Santa Clara - GIL Vicente : 2024/10/25 19:45 UTC")

  bytearray.starts_with(gameBA, prefix: "2") == True
}

// test bead_address() {
//   let beadPolicyId: PolicyId = env.beadPolicyId
//   let beadAddress: Address = from_script(beadPolicyId)
//   trace beadAddress
//   True
// }

test verify_game_result() {
  let gameResultBA = string.to_bytearray(@"2_Porto")
  let gameNameBA = string.to_bytearray(@"_Porto")
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

// Test checkGameResultCorrect function with various scenarios
test check_game_result_correct_valid_test() {
  // Test case 1: Simple game name with result 1
  let gameName1 = string.to_bytearray(@"_Porto")
  let gameResult1 = 1
  let expectedTokenName1 = string.to_bytearray(@"1_Porto")
  checkGameResultCorrect(gameName1, expectedTokenName1, gameResult1) == True
}

test check_game_result_correct_valid_result_0_test() {
  // Test case 2: Game name with result 0 (draw)
  let gameName2 = string.to_bytearray(@"_Santa Clara - GIL Vicente")
  let gameResult2 = 0
  let expectedTokenName2 = string.to_bytearray(@"0_Santa Clara - GIL Vicente")
  checkGameResultCorrect(gameName2, expectedTokenName2, gameResult2) == True
}

test check_game_result_correct_valid_result_2_test() {
  // Test case 3: Complex game name with result 2
  let gameName3 =
    string.to_bytearray(@"_Benfica vs Porto : 2024/12/25 20:00 UTC")
  let gameResult3 = 2
  let expectedTokenName3 =
    string.to_bytearray(@"2_Benfica vs Porto : 2024/12/25 20:00 UTC")
  checkGameResultCorrect(gameName3, expectedTokenName3, gameResult3) == True
}

test check_game_result_correct_invalid_result_test() {
  // Test case 4: Wrong result should return False
  let gameName4 = string.to_bytearray(@"_Porto")
  let gameResult4 = 1
  let wrongTokenName4 = string.to_bytearray(@"2_Porto")
  // Wrong result in token name
  checkGameResultCorrect(gameName4, wrongTokenName4, gameResult4) == False
}

test check_game_result_correct_invalid_game_name_test() {
  // Test case 5: Wrong game name should return False
  let gameName5 = string.to_bytearray(@"_Porto")
  let gameResult5 = 1
  let wrongTokenName5 = string.to_bytearray(@"1_Benfica")
  // Wrong game name in token
  checkGameResultCorrect(gameName5, wrongTokenName5, gameResult5) == False
}

test check_game_result_correct_empty_game_name_test() {
  // Test case 6: Empty game name with result
  let emptyGameName = string.to_bytearray(@"")
  let gameResult6 = 1
  let expectedTokenName6 = string.to_bytearray(@"1")
  checkGameResultCorrect(emptyGameName, expectedTokenName6, gameResult6) == True
}
