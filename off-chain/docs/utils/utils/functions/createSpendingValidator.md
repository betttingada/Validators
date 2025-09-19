[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / createSpendingValidator

# Function: createSpendingValidator()

> **createSpendingValidator**(`cborHex`, `params`): `Script`

Defined in: [utils/utils.ts:227](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L227)

Creates a Plutus V3 spending validator script with contract parameters.
Used for creating validators that control UTXOs and contract interactions.

## Parameters

### cborHex

`string`

Hexadecimal CBOR-encoded validator script

### params

`any`[]

Contract parameters to apply to the script

## Returns

`Script`

SpendingValidator object ready for use in transactions

## Example

```typescript
const validator = createSpendingValidator(cborHex, [game, gameName, gameDate]);
const address = validatorToAddress(network, validator);
```
