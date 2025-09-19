[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [lib/bet](../README.md) / BetResult

# Interface: BetResult

Defined in: lib/bet.ts:79

Result interface for betting operations
Contains transaction details and bet information

## Properties

### txHash

> **txHash**: `string`

Defined in: lib/bet.ts:81

Transaction hash of the successful bet

***

### betSummary

> **betSummary**: `string`

Defined in: lib/bet.ts:83

Human-readable summary of the bet placed

***

### betTokensMinted

> **betTokensMinted**: `bigint`

Defined in: lib/bet.ts:85

Amount of bet tokens minted for this bet

***

### warnings?

> `optional` **warnings**: `string`[]

Defined in: lib/bet.ts:87

Optional warnings about the bet placement

***

### betDetails?

> `optional` **betDetails**: `BetTransactionDetails`

Defined in: lib/bet.ts:89

Bet details for tracking and analytics
