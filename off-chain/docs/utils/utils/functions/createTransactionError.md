[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / createTransactionError

# Function: createTransactionError()

> **createTransactionError**(`operation`, `txError`, `troubleshootingSteps`): [`Result`](../../cstypes/type-aliases/Result.md)\<`never`\>

Defined in: [utils/utils.ts:466](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L466)

Creates a standardized transaction failure error with context.
Specialized error creator for transaction-related failures.

## Parameters

### operation

`string`

The operation that failed (e.g., "bet placement", "token redemption")

### txError

`Error`

The transaction error details

### troubleshootingSteps

`string`[]

Array of troubleshooting suggestions

## Returns

[`Result`](../../cstypes/type-aliases/Result.md)\<`never`\>

Standardized transaction error result

## Example

```typescript
return createTransactionError(
  "bet placement",
  error,
  [
    "Check your wallet balance",
    "Verify network connectivity", 
    "Try reducing the bet amount"
  ]
);
```
