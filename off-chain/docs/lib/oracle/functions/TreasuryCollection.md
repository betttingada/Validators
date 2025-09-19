[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [lib/oracle](../README.md) / TreasuryCollection

# Function: TreasuryCollection()

> **TreasuryCollection**(`params`): `Promise`\<`TreasuryCollectionResult`\>

Defined in: lib/oracle.ts:1015

Collect all remaining funds from betting pot back to treasury, including oracle UTXOs
This function burns oracle tokens and collects all ADA back to the treasury address

## Parameters

### params

`TreasuryCollectionParams`

Treasury collection parameters

## Returns

`Promise`\<`TreasuryCollectionResult`\>

Promise<TreasuryCollectionResult> - Collection operation result

Features:
- Collects both regular and oracle UTXOs
- Burns oracle tokens during collection
- Validates complete pot cleanup
- Provides detailed operation feedback
- Handles treasury signature requirements

Usage:
```typescript
const result = await TreasuryCollection({
  potAddress: "addr_test1...",
  potScript: betSpendingValidator,
  treasuryAddress: "addr_test1...",
  provider: blockchainProvider,
  oracleCborHex: "590a...",
  oraclePolicyId: "76ad8c02..." // optional
});
```
