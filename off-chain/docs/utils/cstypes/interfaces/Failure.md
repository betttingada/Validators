[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / Failure

# Interface: Failure

Defined in: [utils/cstypes.ts:710](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L710)

Failure result containing comprehensive error information

Represents failed operation outcomes with detailed error context,
categorization, and recovery information. Provides structured
error handling with codes, messages, and debugging details.

 Failure

## Example

Creating and handling failure results:
```typescript
// Creating a failure result with context
const validationFailure: Failure = ResultFactory.failure(
  'VALIDATION_ERROR',
  'User age must be between 18 and 120',
  { 
    providedAge: -5,
    validRange: { min: 18, max: 120 },
    fieldName: 'age'
  }
);

// Handling the failure
if (isFailure(validationFailure)) {
  console.error("Code:", validationFailure.error.code);
  console.error("Message:", validationFailure.error.message);
  console.error("Details:", validationFailure.error.details);
}
```

## Extends

- [`IResult`](IResult.md)

## Properties

### timestamp

> `readonly` **timestamp**: `Date`

Defined in: [utils/cstypes.ts:633](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L633)

Timestamp when the result was created for tracking and debugging

#### Inherited from

[`IResult`](IResult.md).[`timestamp`](IResult.md#timestamp)

***

### success

> `readonly` **success**: `false`

Defined in: [utils/cstypes.ts:712](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L712)

Always false for failure results

#### Overrides

[`IResult`](IResult.md).[`success`](IResult.md#success)

***

### error

> `readonly` **error**: `object`

Defined in: [utils/cstypes.ts:714](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L714)

Comprehensive error information object

#### code

> `readonly` **code**: `string`

Categorized error code for programmatic error handling and routing

#### message

> `readonly` **message**: `string`

Human-readable error description explaining what went wrong

#### details?

> `readonly` `optional` **details**: `Record`\<`string`, `unknown`\>

Optional additional error context and debugging information

#### stack?

> `readonly` `optional` **stack**: `string`

Optional stack trace for debugging and error tracking
