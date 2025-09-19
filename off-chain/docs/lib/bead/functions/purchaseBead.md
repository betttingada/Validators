[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [lib/bead](../README.md) / purchaseBead

# Function: purchaseBead()

> **purchaseBead**(`provider`, `beadInput`, `referralAddress?`): `Promise`\<[`Result`](../../../utils/cstypes/type-aliases/Result.md)\<[`BeadPurchaseResult`](../interfaces/BeadPurchaseResult.md)\>\>

Defined in: lib/bead.ts:536

Enhanced unified BEAD token purchase function with comprehensive error handling
Supports both direct purchases and referral purchases with optimized performance

## Parameters

### provider

[`IBlockchainProvider`](../../../providers/IBlockchainProvider/interfaces/IBlockchainProvider.md)

Blockchain provider interface for network operations

### beadInput

[`InputBeadWithReferral`](../../../utils/cstypes/interfaces/InputBeadWithReferral.md)

Purchase configuration and wallet setup

### referralAddress?

`string`

Optional referral address for bonus distribution

## Returns

`Promise`\<[`Result`](../../../utils/cstypes/type-aliases/Result.md)\<[`BeadPurchaseResult`](../interfaces/BeadPurchaseResult.md)\>\>

Promise resolving to detailed purchase result or error

## Example

```typescript
// Direct purchase
const result = await purchaseBead(provider, {
  adaAmount: "400", // 400 ADA investment
  chainProviderConf: config
});

// Referral purchase  
const result = await purchaseBead(provider, {
  adaAmount: "1000",
  chainProviderConf: config
}, "addr1_referral_address");
```
