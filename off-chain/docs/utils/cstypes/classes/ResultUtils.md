[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / ResultUtils

# Class: ResultUtils

Defined in: [utils/cstypes.ts:1070](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L1070)

Utility functions for working with results

## Constructors

### Constructor

> **new ResultUtils**(): `ResultUtils`

#### Returns

`ResultUtils`

## Methods

### map()

> `static` **map**\<`T`, `U`\>(`result`, `mapper`): [`Result`](../type-aliases/Result.md)\<`U`\>

Defined in: [utils/cstypes.ts:1077](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L1077)

Maps a successful result to a new type

#### Type Parameters

##### T

`T`

##### U

`U`

#### Parameters

##### result

[`Result`](../type-aliases/Result.md)\<`T`\>

The result to map

##### mapper

(`data`) => `U`

Function to transform the data

#### Returns

[`Result`](../type-aliases/Result.md)\<`U`\>

New result with transformed data, or original failure

***

### flatMap()

> `static` **flatMap**\<`T`, `U`\>(`result`, `mapper`): [`Result`](../type-aliases/Result.md)\<`U`\>

Defined in: [utils/cstypes.ts:1094](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L1094)

Chains results together, allowing for sequential operations

#### Type Parameters

##### T

`T`

##### U

`U`

#### Parameters

##### result

[`Result`](../type-aliases/Result.md)\<`T`\>

The initial result

##### mapper

(`data`) => [`Result`](../type-aliases/Result.md)\<`U`\>

Function that takes success data and returns a new result

#### Returns

[`Result`](../type-aliases/Result.md)\<`U`\>

The result of the mapper, or original failure

***

### unwrap()

> `static` **unwrap**\<`T`\>(`result`): `T`

Defined in: [utils/cstypes.ts:1111](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L1111)

Unwraps a result, throwing an error if it's a failure

#### Type Parameters

##### T

`T`

#### Parameters

##### result

[`Result`](../type-aliases/Result.md)\<`T`\>

The result to unwrap

#### Returns

`T`

The data from a successful result

#### Throws

Error if the result is a failure

***

### getOrDefault()

> `static` **getOrDefault**\<`T`\>(`result`, `defaultValue`): `T`

Defined in: [utils/cstypes.ts:1126](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L1126)

Gets the data from a result, or returns a default value if it's a failure

#### Type Parameters

##### T

`T`

#### Parameters

##### result

[`Result`](../type-aliases/Result.md)\<`T`\>

The result to get data from

##### defaultValue

`T`

Value to return if result is a failure

#### Returns

`T`

The data or default value

***

### match()

> `static` **match**\<`T`, `U`\>(`result`, `onSuccess`, `onFailure`): `U`

Defined in: [utils/cstypes.ts:1137](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L1137)

Executes different functions based on result type

#### Type Parameters

##### T

`T`

##### U

`U`

#### Parameters

##### result

[`Result`](../type-aliases/Result.md)\<`T`\>

The result to match on

##### onSuccess

(`data`) => `U`

Function to execute for success

##### onFailure

(`error`) => `U`

Function to execute for failure

#### Returns

`U`

The result of the executed function
