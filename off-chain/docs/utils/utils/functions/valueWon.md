[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / valueWon

# Function: valueWon()

> **valueWon**(`totalWinners`, `totalPot`, `myBet`): `number`

Defined in: [utils/utils.ts:674](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L674)

Calculates the winning amount for a bet based on proportional payout.

**CRITICAL**: This function MUST match the validator's calculate_payout logic exactly!
The validator uses integer arithmetic with floor division to ensure deterministic results.

**Validator Logic** (from bet.ak):
```
payout = floor((myBet × totalPot) / totalWinners)
```

This implements a proportional payout system where:
- Each winning token gets an equal share of the total prize pool
- Calculations use integer arithmetic to avoid floating-point precision issues
- Results must match the on-chain validator exactly for transaction validation

## Parameters

### totalWinners

`number`

Total amount of winning bet tokens across all winners

### totalPot

`number`

Total ADA available in the prize pool (in lovelace)

### myBet

`number`

This player's bet tokens being redeemed

## Returns

`number`

Winning amount in lovelace (with floor division to match validator)

## Example

```typescript
// If total pot is 1000 ADA and there are 500 winning tokens
// A player with 50 tokens should receive: (50 × 1000000000) / 500 = 100000000 lovelace (100 ADA)
const winnings = valueWon(500, 1000000000, 50);
console.log(`Winnings: ${winnings / 1000000} ADA`); // "Winnings: 100 ADA"
```
