[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / Success

# Interface: Success\<T\>

Defined in: [utils/cstypes.ts:665](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L665)

Success result containing data from successful operations

Represents successful operation outcomes with the resulting data.
Used when operations complete without errors and produce valid results.

 Success

## Example

Creating and using success results:
```typescript
// Creating a success result
const userResult: Success<User> = ResultFactory.success({
  id: "123",
  name: "John Doe",
  email: "john@example.com"
});

// Type-safe access to data
if (isSuccess(userResult)) {
  console.log("User name:", userResult.data.name);
  console.log("User email:", userResult.data.email);
}
```

## Extends

- [`IResult`](IResult.md)

## Type Parameters

### T

`T`

Type of the successful result data

## Properties

### timestamp

> `readonly` **timestamp**: `Date`

Defined in: [utils/cstypes.ts:633](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L633)

Timestamp when the result was created for tracking and debugging

#### Inherited from

[`IResult`](IResult.md).[`timestamp`](IResult.md#timestamp)

***

### success

> `readonly` **success**: `true`

Defined in: [utils/cstypes.ts:667](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L667)

Always true for success results

#### Overrides

[`IResult`](IResult.md).[`success`](IResult.md#success)

***

### data

> `readonly` **data**: `T`

Defined in: [utils/cstypes.ts:669](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L669)

The successful operation result data
