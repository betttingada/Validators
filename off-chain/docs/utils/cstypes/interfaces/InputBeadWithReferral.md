[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / InputBeadWithReferral

# Interface: InputBeadWithReferral

Defined in: [utils/cstypes.ts:526](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L526)

BEAD token purchase input interface with referral support

Contains all parameters necessary for purchasing BEAD tokens, including
referral address configuration, investment amounts, and blockchain
configuration for token minting and distribution.

 InputBeadWithReferral

## Examples

Creating a BEAD purchase with referral:
```typescript
const beadPurchase: InputBeadWithReferral = {
  wallet: {
    key: "buyer-wallet-key",
    address: "addr_test1q...buyer-address"
  },
  chainProviderConf: testnetConfig,
  referralAddress: "addr_test1q...referrer-address", // Optional
  treasuryAddress: "addr_test1q...treasury-address",
  buyerAdaInvestmentLovelace: 400_000_000 // 400 ADA in lovelace
};
```

Creating a BEAD purchase without referral:
```typescript
const directPurchase: InputBeadWithReferral = {
  wallet: buyerWallet,
  chainProviderConf: testnetConfig,
  referralAddress: "", // Empty for no referral
  treasuryAddress: treasuryAddress,
  buyerAdaInvestmentLovelace: 200_000_000 // 200 ADA minimum tier
};
```

## Properties

### wallet

> **wallet**: [`UserWallet`](UserWallet.md)

Defined in: [utils/cstypes.ts:528](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L528)

Buyer's wallet for token distribution

***

### chainProviderConf

> **chainProviderConf**: [`ChainProviderConf`](ChainProviderConf.md)

Defined in: [utils/cstypes.ts:530](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L530)

Blockchain network configuration

***

### referralAddress

> **referralAddress**: `string`

Defined in: [utils/cstypes.ts:532](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L532)

Optional referral address for bonus distribution

***

### treasuryAddress

> **treasuryAddress**: `string`

Defined in: [utils/cstypes.ts:534](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L534)

Treasury address for fund collection

***

### buyerAdaInvestmentLovelace

> **buyerAdaInvestmentLovelace**: `number`

Defined in: [utils/cstypes.ts:536](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L536)

ADA investment amount in lovelace units
