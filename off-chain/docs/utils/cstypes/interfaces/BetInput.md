[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / BetInput

# Interface: BetInput

Defined in: [utils/cstypes.ts:329](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L329)

Comprehensive betting input interface for game wagering operations

Contains all necessary parameters for placing bets on sporting events,
including game details, bet amounts, outcome predictions, and contract
configurations for blockchain execution.

 BetInput

## Example

Creating a comprehensive bet input:
```typescript
const betInput: BetInput = {
  wallet: {
    key: "user-wallet-key",
    address: "addr_test1q...user-address"
  },
  chainProviderConf: testnetConfig,
  betPotValidatorCbor: "590c3578...",
  betMintingValidatorCbor: "590d4689...",
  oracleMintingValidatorCbor: "590e579a...",
  posixTime: 1691836800000, // Game date
  gameNr: 12345,
  gameName: "TeamA_vs_TeamB",
  lovelaces: 100_000_000, // 100 ADA in lovelace
  beads: 50, // 50 BEAD tokens
  totalBet: 150, // Combined value
  winner: GameOutcome.HOME // Betting on home team
};
```

## Properties

### wallet

> **wallet**: [`UserWallet`](UserWallet.md)

Defined in: [utils/cstypes.ts:331](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L331)

User wallet configuration for transaction signing

***

### chainProviderConf

> **chainProviderConf**: [`ChainProviderConf`](ChainProviderConf.md)

Defined in: [utils/cstypes.ts:333](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L333)

Blockchain network configuration

***

### betPotValidatorCbor

> **betPotValidatorCbor**: `string`

Defined in: [utils/cstypes.ts:335](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L335)

Bet pot spending validator CBOR hex

***

### betMintingValidatorCbor

> **betMintingValidatorCbor**: `string`

Defined in: [utils/cstypes.ts:337](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L337)

Bet token minting validator CBOR hex

***

### oracleMintingValidatorCbor

> **oracleMintingValidatorCbor**: `string`

Defined in: [utils/cstypes.ts:339](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L339)

Oracle token minting validator CBOR hex

***

### posixTime

> **posixTime**: `number`

Defined in: [utils/cstypes.ts:341](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L341)

Game date/time in POSIX timestamp format

***

### gameNr

> **gameNr**: `number`

Defined in: [utils/cstypes.ts:343](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L343)

Unique game identifier number

***

### gameName

> **gameName**: `string`

Defined in: [utils/cstypes.ts:345](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L345)

Human-readable game identifier/name

***

### lovelaces

> **lovelaces**: `number`

Defined in: [utils/cstypes.ts:347](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L347)

ADA bet amount in lovelace units

***

### beads

> **beads**: `number`

Defined in: [utils/cstypes.ts:349](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L349)

BEAD token bet amount

***

### totalBet

> **totalBet**: `number`

Defined in: [utils/cstypes.ts:351](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L351)

Total calculated bet value

***

### winner

> **winner**: [`GameOutcome`](../enumerations/GameOutcome.md)

Defined in: [utils/cstypes.ts:353](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L353)

Predicted game outcome
