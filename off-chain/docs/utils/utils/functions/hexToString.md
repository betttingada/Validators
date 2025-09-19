[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / hexToString

# Function: hexToString()

> **hexToString**(`hex`): `string`

Defined in: [utils/utils.ts:495](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L495)

Converts a hexadecimal string to readable ASCII text.
Handles both plain hex strings and Aiken-style hex literals with h' prefix.

## Parameters

### hex

`string`

Hexadecimal string to convert (with or without h' prefix)

## Returns

`string`

Decoded ASCII string, or original hex if conversion fails

## Example

```typescript
hexToString("48656c6c6f"); // Returns: "Hello"
hexToString("h'48656c6c6f'"); // Returns: "Hello" (Aiken format)
hexToString("invalid"); // Returns: "invalid" (fallback)
```
