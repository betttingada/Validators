[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / ChainProviderConf

# Interface: ChainProviderConf

Defined in: [utils/cstypes.ts:261](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L261)

Comprehensive chain provider configuration interface

Contains all necessary configuration for connecting to and interacting
with the Cardano blockchain, including network settings, contract
references, and operational parameters.

 ChainProviderConf

## Examples

Production mainnet configuration:
```typescript
const mainnetConfig: ChainProviderConf = {
  network: Network.MAINNET,
  uri: "https://cardano-mainnet.koios.rest/api/v0",
  key: "mainnet-production",
  beadCbor: "590a1359...", // Actual CBOR hex
  beadName: "BEAD",
  beadReferralName: "BEADR", 
  treasuryAddress: "addr1q9...production-treasury"
};
```

Development testnet configuration:
```typescript
const testnetConfig: ChainProviderConf = {
  network: Network.PREVIEW,
  uri: "https://preview.koios.rest/api/v0",
  key: "preprod-testing",
  beadCbor: "590b2467...", // Test contract CBOR
  beadName: "BEAD PR", // Test prefix
  beadReferralName: "BEADR PR",
  treasuryAddress: "addr_test1q...test-treasury"
};
```

## Properties

### network

> **network**: [`Network`](../enumerations/Network.md)

Defined in: [utils/cstypes.ts:263](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L263)

Target Cardano network for operations

***

### uri

> **uri**: `string`

Defined in: [utils/cstypes.ts:265](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L265)

Blockchain API endpoint URI for network communication

***

### key

> **key**: `string`

Defined in: [utils/cstypes.ts:267](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L267)

Network-specific identifier or access key

***

### beadCbor

> **beadCbor**: `string`

Defined in: [utils/cstypes.ts:269](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L269)

BEAD token minting contract CBOR hex string

***

### beadName

> **beadName**: `string`

Defined in: [utils/cstypes.ts:271](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L271)

Human-readable name for BEAD tokens

***

### beadReferralName

> **beadReferralName**: `string`

Defined in: [utils/cstypes.ts:273](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L273)

Human-readable name for BEAD referral tokens

***

### treasuryAddress

> **treasuryAddress**: `string`

Defined in: [utils/cstypes.ts:275](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L275)

Treasury address for fee collection and management
