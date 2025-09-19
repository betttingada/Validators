[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / validateIntegerAmount

# Function: validateIntegerAmount()

> **validateIntegerAmount**(`amount`, `fieldName`, `min?`, `max?`): `object`

Defined in: [utils/utils.ts:151](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L151)

Validates integer amounts (like ADA amounts that should be whole numbers).
Ensures the amount is a valid non-negative integer within optional bounds.

## Parameters

### amount

`number`

The numeric amount to validate

### fieldName

`string`

Name of the field being validated (for error messages)

### min?

`number`

Optional minimum allowed value (inclusive)

### max?

`number`

Optional maximum allowed value (inclusive)

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
const result = validateIntegerAmount(10.5, "Bet Amount", 1, 1000);
if (!result.isValid) {
  console.error(result.error); // "Bet Amount must be a whole number. Got: 10.5"
  console.log(result.suggestions); // ["Try using 10 or 11 instead"]
}
```
