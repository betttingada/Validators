[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / createContractParams

# Function: createContractParams()

> **createContractParams**(`game`, `gameName`, `gameDate`): `any`[]

Defined in: [utils/utils.ts:327](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L327)

Creates contract parameters array used across all Plutus contracts.
Converts JavaScript types to appropriate Plutus data types for on-chain validation.

## Parameters

### game

`number`

Game identifier (converted to BigInt)

### gameName

`string`

Game name (converted to UTF-8 bytes)

### gameDate

`number`

Game date timestamp (converted to BigInt)

## Returns

`any`[]

Array of contract parameters ready for Plutus script execution

## Example

```typescript
const params = createContractParams(123, "Lakers vs Warriors", 1640995200000);
// Returns: [123n, fromText("Lakers vs Warriors"), 1640995200000n]
```
