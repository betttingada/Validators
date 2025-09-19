[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [lib/bead](../README.md) / BeadPurchaseResult

# Interface: BeadPurchaseResult

Defined in: lib/bead.ts:57

Result interface for BEAD token purchase operations
Contains transaction details, token amounts, and distribution information

## Properties

### txHash

> **txHash**: `string`

Defined in: lib/bead.ts:59

Transaction hash of the successful purchase

***

### beadAmount

> **beadAmount**: `bigint`

Defined in: lib/bead.ts:61

Amount of BEAD tokens minted for the buyer

***

### referralAmount

> **referralAmount**: `bigint`

Defined in: lib/bead.ts:63

Amount of referral tokens minted

***

### distribution?

> `optional` **distribution**: `AdaDistribution`

Defined in: lib/bead.ts:65

ADA distribution details (only for referral purchases)

***

### referralBonus?

> `optional` **referralBonus**: `number`

Defined in: lib/bead.ts:67

Referral bonus percentage applied (only for referral purchases)

***

### tier?

> `optional` **tier**: `BeadAmountTier`

Defined in: lib/bead.ts:69

Purchase tier information
