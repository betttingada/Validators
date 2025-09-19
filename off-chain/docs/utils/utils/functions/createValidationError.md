[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / createValidationError

# Function: createValidationError()

> **createValidationError**(`field`, `value`, `expectedFormat`, `suggestions`): [`Result`](../../cstypes/type-aliases/Result.md)\<`never`\>

Defined in: [utils/utils.ts:434](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L434)

Creates a standardized validation error with helpful suggestions.
Specialized error creator for input validation failures.

## Parameters

### field

`string`

The field that failed validation

### value

`any`

The invalid value provided

### expectedFormat

`string`

Description of the expected format

### suggestions

`string`[]

Array of suggested fixes

## Returns

[`Result`](../../cstypes/type-aliases/Result.md)\<`never`\>

Standardized validation error result

## Example

```typescript
if (gameId < 0) {
  return createValidationError(
    "gameId",
    gameId,
    "positive integer",
    ["Use a positive number", "Check the game ID from the oracle"]
  );
}
```
