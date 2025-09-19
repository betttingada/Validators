[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / BetRedeemInput

# Interface: BetRedeemInput

Defined in: [utils/cstypes.ts:458](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L458)

Bet redemption input interface for claiming winning bet rewards

Contains comprehensive parameters for redeeming winning bet tokens,
including bet identification, oracle verification, and transaction
references for blockchain reward distribution.

 BetRedeemInput

## Example

Creating a bet redemption request:
```typescript
const redeemInput: BetRedeemInput = {
  wallet: winnerWallet,
  chainProviderConf: testnetConfig,
  betPotValidatorCbor: "590c3578...",
  betMintingValidatorCbor: "590d4689...",
  betOracleValidatorCbor: "590f68ab...",
  winner: GameOutcome.HOME, // Winning outcome
  posixTime: 1691836800000,
  gameNr: 12345,
  gameName: "TeamA_vs_TeamB",
  id: "2-1",
  playerWinTX: ["tx_hash_1", "tx_hash_2"], // Winning bet transactions
  payingTx: ["payout_tx_hash"] // Reward distribution transactions
};
```

## Properties

### wallet

> **wallet**: [`UserWallet`](UserWallet.md)

Defined in: [utils/cstypes.ts:460](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L460)

Winner's wallet for reward distribution

***

### chainProviderConf

> **chainProviderConf**: [`ChainProviderConf`](ChainProviderConf.md)

Defined in: [utils/cstypes.ts:462](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L462)

Blockchain network configuration

***

### betPotValidatorCbor

> **betPotValidatorCbor**: `string`

Defined in: [utils/cstypes.ts:464](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L464)

Bet pot spending validator CBOR hex

***

### betMintingValidatorCbor

> **betMintingValidatorCbor**: `string`

Defined in: [utils/cstypes.ts:466](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L466)

Bet token minting validator CBOR hex

***

### betOracleValidatorCbor

> **betOracleValidatorCbor**: `string`

Defined in: [utils/cstypes.ts:468](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L468)

Oracle validator for result verification

***

### winner

> **winner**: [`GameOutcome`](../enumerations/GameOutcome.md)

Defined in: [utils/cstypes.ts:470](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L470)

Winning outcome for validation

***

### posixTime

> **posixTime**: `number`

Defined in: [utils/cstypes.ts:472](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L472)

Game time for correlation

***

### gameNr

> **gameNr**: `number`

Defined in: [utils/cstypes.ts:474](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L474)

Game identifier for bet tracking

***

### gameName

> **gameName**: `string`

Defined in: [utils/cstypes.ts:476](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L476)

Game name for identification

***

### id

> **id**: `string`

Defined in: [utils/cstypes.ts:478](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L478)

Result identifier for verification

***

### playerWinTX

> **playerWinTX**: `string`[]

Defined in: [utils/cstypes.ts:480](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L480)

Transaction hashes proving winning bets

***

### payingTx

> **payingTx**: `string`[]

Defined in: [utils/cstypes.ts:482](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L482)

Payment transaction references
