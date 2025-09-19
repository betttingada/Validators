[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / Result

# Type Alias: Result\<T\>

> **Result**\<`T`\> = [`Success`](../interfaces/Success.md)\<`T`\> \| [`Failure`](../interfaces/Failure.md)

Defined in: [utils/cstypes.ts:762](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L762)

Union type representing either successful or failed operation results

This discriminated union type ensures type-safe handling of both
success and failure cases at compile time. TypeScript's type system
can automatically narrow the type based on the success property.

## Type Parameters

### T

`T`

Type of the data contained in successful results

## Example

Function returning a Result type:
```typescript
function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await userService.getUser(id);
    if (!user) {
      return ResultFactory.failure('USER_NOT_FOUND', `User ${id} not found`);
    }
    return ResultFactory.success(user);
  } catch (error) {
    return ResultFactory.fromError(error, 'DATABASE_ERROR');
  }
}

// Type-safe usage
const userResult = await fetchUser("123");
if (userResult.success) {
  // TypeScript knows this is Success<User>
  console.log(userResult.data.name);
} else {
  // TypeScript knows this is Failure
  console.error(userResult.error.message);
}
```
