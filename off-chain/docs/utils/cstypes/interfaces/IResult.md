[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / IResult

# Interface: IResult

Defined in: [utils/cstypes.ts:629](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L629)

Base result interface that all result types implement

Provides common properties shared by both success and failure results,
including success flag and timestamp for tracking and debugging.

 IResult

## Extended by

- [`Success`](Success.md)
- [`Failure`](Failure.md)

## Properties

### success

> `readonly` **success**: `boolean`

Defined in: [utils/cstypes.ts:631](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L631)

Indicates whether the operation succeeded

***

### timestamp

> `readonly` **timestamp**: `Date`

Defined in: [utils/cstypes.ts:633](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L633)

When the result was created for tracking
