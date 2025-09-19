[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / ResultFactory

# Class: ResultFactory

Defined in: [utils/cstypes.ts:828](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L828)

Result factory class for creating consistent Result instances

Provides static factory methods for creating Success and Failure results
with proper typing, validation, and error handling. Ensures consistent
result creation patterns across the entire BEAD Protocol system.

## Key Features

### 🏭 Factory Pattern
- Consistent result instance creation
- Automatic timestamp generation
- Type-safe factory methods

### 🛡️ Error Conversion
- Automatic Error object conversion
- Unknown error type handling
- Stack trace preservation

### 📊 Context Preservation
- Detailed error context capture
- Structured error information
- Debugging information retention

## Examples

Basic factory usage:
```typescript
// Creating success results
const numberResult = ResultFactory.success(42);
const userResult = ResultFactory.success({ id: "123", name: "John" });

// Creating failure results
const validationFailure = ResultFactory.failure(
  'VALIDATION_ERROR',
  'Invalid input provided'
);

const detailedFailure = ResultFactory.failure(
  'PROCESSING_ERROR',
  'Failed to process request',
  { step: 'validation', input: userInput }
);
```

Error conversion patterns:
```typescript
// Converting Error objects
try {
  const data = await riskyOperation();
  return ResultFactory.success(data);
} catch (error) {
  if (error instanceof ValidationError) {
    return ResultFactory.fromError(error, 'VALIDATION_FAILED');
  }
  return ResultFactory.fromError(error, 'OPERATION_FAILED');
}

// Handling unknown errors
const result = await operation().catch(error => 
  ResultFactory.fromUnknown(error, 'UNKNOWN_OPERATION_ERROR')
);
```

## Constructors

### Constructor

> **new ResultFactory**(): `ResultFactory`

#### Returns

`ResultFactory`

## Methods

### success()

> `static` **success**\<`T`\>(`data`): [`Success`](../interfaces/Success.md)\<`T`\>

Defined in: [utils/cstypes.ts:860](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L860)

Creates a successful result containing the provided data

Generates a Success result with the provided data and automatic
timestamp generation. The resulting Success type is properly
typed based on the input data type.

#### Type Parameters

##### T

`T`

Type of the data to be contained in the success result

#### Parameters

##### data

`T`

The successful operation result data

#### Returns

[`Success`](../interfaces/Success.md)\<`T`\>

Success result containing the provided data

#### Example

Creating typed success results:
```typescript
// String result
const textResult = ResultFactory.success("Hello World");
// Type: Success<string>

// Object result
const userResult = ResultFactory.success({
  id: "123",
  name: "John Doe",
  email: "john@example.com"
});
// Type: Success<{id: string, name: string, email: string}>

// Array result
const numbersResult = ResultFactory.success([1, 2, 3, 4, 5]);
// Type: Success<number[]>
```

***

### failure()

> `static` **failure**(`code`, `message`, `details?`, `stack?`): [`Failure`](../interfaces/Failure.md)

Defined in: [utils/cstypes.ts:910](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L910)

Creates a failure result with comprehensive error information

Generates a Failure result with categorized error code, human-readable
message, optional context details, and optional stack trace. Provides
structured error information for proper error handling and debugging.

#### Parameters

##### code

`string`

Categorized error code for programmatic handling

##### message

`string`

Human-readable error description

##### details?

`Record`\<`string`, `unknown`\>

Optional additional error context

##### stack?

`string`

Optional stack trace for debugging

#### Returns

[`Failure`](../interfaces/Failure.md)

Failure result containing comprehensive error information

#### Example

Creating different types of failure results:
```typescript
// Simple failure
const simpleFailure = ResultFactory.failure(
  'NOT_FOUND',
  'Resource not found'
);

// Failure with context
const contextualFailure = ResultFactory.failure(
  'VALIDATION_ERROR',
  'Invalid user data provided',
  {
    field: 'email',
    value: 'invalid-email',
    expectedFormat: 'user@domain.com'
  }
);

// Failure with stack trace
const trackedFailure = ResultFactory.failure(
  'SYSTEM_ERROR',
  'Internal system error occurred',
  { operation: 'database_query' },
  new Error().stack
);
```

***

### fromError()

> `static` **fromError**(`error`, `code?`, `details?`): [`Failure`](../interfaces/Failure.md)

Defined in: [utils/cstypes.ts:981](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L981)

Creates a failure result from a JavaScript Error object

Converts standard JavaScript Error objects into structured Failure
results while preserving error messages, stack traces, and adding
additional context. Provides consistent error handling for thrown exceptions.

#### Parameters

##### error

`Error`

The JavaScript Error object to convert

##### code?

`string` = `'UNKNOWN_ERROR'`

Error code for categorization

##### details?

`Record`\<`string`, `unknown`\>

Optional additional error context

#### Returns

[`Failure`](../interfaces/Failure.md)

Failure result converted from the Error object

#### Example

Converting different Error types:
```typescript
// Basic Error conversion
try {
  JSON.parse('invalid json');
} catch (error) {
  const result = ResultFactory.fromError(error, 'JSON_PARSE_ERROR');
  // Preserves error message and stack trace
}

// Error with additional context
try {
  await networkOperation();
} catch (error) {
  const result = ResultFactory.fromError(
    error, 
    'NETWORK_ERROR',
    { 
      operation: 'fetch_user_data',
      url: 'https://api.example.com/users',
      timestamp: Date.now()
    }
  );
}

// Custom Error types
class ValidationError extends Error {
  constructor(field: string, value: any) {
    super(`Invalid ${field}: ${value}`);
    this.name = 'ValidationError';
  }
}

try {
  throw new ValidationError('email', 'invalid-email');
} catch (error) {
  const result = ResultFactory.fromError(error, 'VALIDATION_FAILED');
}
```

***

### fromUnknown()

> `static` **fromUnknown**(`error`, `code?`, `details?`): [`Failure`](../interfaces/Failure.md)

Defined in: [utils/cstypes.ts:1042](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L1042)

Creates a failure result from unknown error types

Safely converts unknown error types (including non-Error objects)
into structured Failure results. Handles cases where thrown values
are not Error objects, providing fallback error message generation.

#### Parameters

##### error

`unknown`

The unknown error value to convert

##### code?

`string` = `'UNKNOWN_ERROR'`

Error code for categorization

##### details?

`Record`\<`string`, `unknown`\>

Optional additional error context

#### Returns

[`Failure`](../interfaces/Failure.md)

Failure result converted from the unknown error

#### Example

Handling various unknown error types:
```typescript
// String errors
try {
  throw "Something went wrong";
} catch (error) {
  const result = ResultFactory.fromUnknown(error, 'STRING_ERROR');
  // Creates failure with message: "Something went wrong"
}

// Object errors
try {
  throw { code: 404, message: "Not found" };
} catch (error) {
  const result = ResultFactory.fromUnknown(error, 'OBJECT_ERROR');
  // Creates failure with message: "Unknown error occurred"
}

// Number errors
try {
  throw 500;
} catch (error) {
  const result = ResultFactory.fromUnknown(error, 'NUMERIC_ERROR');
  // Creates failure with message: "Unknown error occurred"
}

// Error objects (delegates to fromError)
try {
  throw new Error("Standard error");
} catch (error) {
  const result = ResultFactory.fromUnknown(error, 'DELEGATED_ERROR');
  // Delegates to fromError method for proper Error handling
}
```
