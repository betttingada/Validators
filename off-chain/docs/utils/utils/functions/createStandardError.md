[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / createStandardError

# Function: createStandardError()

> **createStandardError**(`error`, `context`, `defaultCode`, `suggestions?`): [`Result`](../../cstypes/type-aliases/Result.md)\<`never`\>

Defined in: [utils/utils.ts:375](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L375)

Creates a standardized error result with intelligent error code classification.
Automatically categorizes errors based on message content and provides consistent formatting.

## Parameters

### error

`Error`

The caught error object

### context

`string`

Additional context about where the error occurred

### defaultCode

[`WalletErrorCode`](../../cstypes/type-aliases/WalletErrorCode.md) = `WalletErrorCodes.TRANSACTION_FAILED`

Default error code to use if classification fails

### suggestions?

`string`[]

Optional array of suggested fixes

## Returns

[`Result`](../../cstypes/type-aliases/Result.md)\<`never`\>

Standardized Result failure object

## Example

```typescript
try {
  // Some operation
} catch (error) {
  return createStandardError(
    error,
    "Bet placement",
    WalletErrorCodes.TRANSACTION_FAILED,
    ["Check your wallet balance", "Verify network connection"]
  );
}
```
