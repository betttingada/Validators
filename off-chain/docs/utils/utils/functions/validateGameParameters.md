[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / validateGameParameters

# Function: validateGameParameters()

> **validateGameParameters**(`game`, `gameName`, `gameDate`, `maxGameNameLength`): `object`

Defined in: [utils/utils.ts:96](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L96)

Validates basic game parameters used across bet.ts and oracle.ts modules.
Performs comprehensive validation of game ID, name, and date with helpful error messages.

## Parameters

### game

`number`

Unique integer identifier for the game (must be non-negative)

### gameName

`string`

Human-readable name for the game (cannot be empty)

### gameDate

`number`

Unix timestamp for when the game occurs (must be positive)

### maxGameNameLength

`number` = `50`

Maximum allowed length for game name (default: 50)

## Returns

`object`

Validation result with success status, error message, and suggestions

### isValid

> **isValid**: `boolean`

### error?

> `optional` **error**: `string`

### suggestions?

> `optional` **suggestions**: `string`[]

## Example

```typescript
const result = validateGameParameters(123, "Lakers vs Warriors", 1640995200000);
if (!result.isValid) {
  console.error(result.error);
  if (result.suggestions) {
    console.log("Suggestions:", result.suggestions);
  }
}
```
