[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / GameOutcome

# Enumeration: GameOutcome

Defined in: [utils/cstypes.ts:152](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L152)

Game outcome enumeration for betting system

Represents the three possible outcomes in sports betting:
- **TIE**: Draw/tie result (value "0")
- **HOME**: Home team victory (value "1") 
- **AWAY**: Away team victory (value "2")

## Example

Using game outcomes in betting operations:
```typescript
// Betting on a home team victory
const homeBet = {
  outcome: GameOutcome.HOME,
  amount: 100 // ADA
};

// Betting on a draw
const drawBet = {
  outcome: GameOutcome.TIE,
  amount: 50 // ADA
};

// Setting game result via oracle
const gameResult = {
  gameId: 12345,
  winner: GameOutcome.AWAY // Away team won
};
```

## Enumeration Members

### TIE

> **TIE**: `"0"`

Defined in: [utils/cstypes.ts:154](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L154)

Draw/tie result - no clear winner

***

### HOME

> **HOME**: `"1"`

Defined in: [utils/cstypes.ts:156](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L156)

Home team victory

***

### AWAY

> **AWAY**: `"2"`

Defined in: [utils/cstypes.ts:158](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L158)

Away team victory
