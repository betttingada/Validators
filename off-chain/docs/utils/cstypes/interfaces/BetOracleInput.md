[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / BetOracleInput

# Interface: BetOracleInput

Defined in: [utils/cstypes.ts:395](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L395)

Oracle input interface for game result submission operations

Contains parameters necessary for oracle operations to submit game results,
including authentication, game identification, result data, and contract
configurations for blockchain result recording.

 BetOracleInput

## Example

Creating an oracle result submission:
```typescript
const oracleInput: BetOracleInput = {
  wallet: {
    key: "oracle-operator-key",
    address: "addr_test1q...oracle-address"
  },
  chainProviderConf: testnetConfig,
  betPotValidatorCbor: "590c3578...",
  betMintingValidatorCbor: "590d4689...",
  betOracleValidatorCbor: "590f68ab...",
  posixTime: 1691836800000, // Game completion time
  gameNr: 12345, // Same as betting game ID
  gameName: "TeamA_vs_TeamB",
  winner: GameOutcome.HOME, // Actual result: home team won
  id: "2-1" // Final score or additional details
};
```

## Properties

### wallet

> **wallet**: [`UserWallet`](UserWallet.md)

Defined in: [utils/cstypes.ts:397](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L397)

Oracle operator wallet for transaction signing

***

### chainProviderConf

> **chainProviderConf**: [`ChainProviderConf`](ChainProviderConf.md)

Defined in: [utils/cstypes.ts:399](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L399)

Blockchain network configuration

***

### betPotValidatorCbor

> **betPotValidatorCbor**: `string`

Defined in: [utils/cstypes.ts:401](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L401)

Bet pot spending validator CBOR hex

***

### betMintingValidatorCbor

> **betMintingValidatorCbor**: `string`

Defined in: [utils/cstypes.ts:403](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L403)

Bet token minting validator CBOR hex

***

### betOracleValidatorCbor

> **betOracleValidatorCbor**: `string`

Defined in: [utils/cstypes.ts:405](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L405)

Oracle-specific validator CBOR hex

***

### posixTime

> **posixTime**: `number`

Defined in: [utils/cstypes.ts:407](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L407)

Game date/time for result correlation

***

### gameNr

> **gameNr**: `number`

Defined in: [utils/cstypes.ts:409](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L409)

Game identifier matching betting records

***

### gameName

> **gameName**: `string`

Defined in: [utils/cstypes.ts:411](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L411)

Game identifier for result association

***

### winner

> **winner**: [`GameOutcome`](../enumerations/GameOutcome.md)

Defined in: [utils/cstypes.ts:413](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L413)

Actual game outcome/result

***

### id

> **id**: `string`

Defined in: [utils/cstypes.ts:415](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L415)

Additional result identifier (e.g., final score, details)
