[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [lib/oracle](../README.md) / SetGameResult

# Function: SetGameResult()

> **SetGameResult**(`oracleInput`, `provider`): `Promise`\<[`Result`](../../../utils/cstypes/type-aliases/Result.md)\<`GameResultResult`\>\>

Defined in: lib/oracle.ts:662

Simplified game result setting function

## Parameters

### oracleInput

[`BetOracleInput`](../../../utils/cstypes/interfaces/BetOracleInput.md)

BetOracleInput object containing all oracle parameters

### provider

[`IBlockchainProvider`](../../../providers/IBlockchainProvider/interfaces/IBlockchainProvider.md)

IBlockchainProvider instance for blockchain interaction

## Returns

`Promise`\<[`Result`](../../../utils/cstypes/type-aliases/Result.md)\<`GameResultResult`\>\>

Promise<Result<GameResultResult>> - Result containing transaction hash and game details

BetOracleInput contains:
- wallet: UserWallet (key and address)
- chainProviderConf: ChainProviderConf (network config, addresses, CBORs)
- betPotValidatorCbor: string (bet pot validator CBOR)
- betMintingValidatorCbor: string (bet minting validator CBOR)
- betOracleValidatorCbor: string (oracle validator CBOR)
- posixTime: number (game date/time)
- gameNr: number (game ID)
- gameName: string (game identifier)
- winner: GameOutcome (game result: TIE="0", HOME="1", AWAY="2")
- id: string (goals/final score identifier)
