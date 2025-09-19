[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / createMintingPolicy

# Function: createMintingPolicy()

> **createMintingPolicy**(`cborHex`, `params?`): `Script`

Defined in: [utils/utils.ts:206](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L206)

Creates a Plutus V3 minting policy script with flexible parameter handling.
Supports both parameterized scripts and simple CBOR-encoded scripts.

## Parameters

### cborHex

`string`

Hexadecimal CBOR-encoded contract script

### params?

`any`[]

Optional contract parameters for parameterized scripts

## Returns

`Script`

MintingPolicy object ready for use in transactions

## Example

```typescript
// For parameterized scripts
const mintingScript = createMintingPolicy(cborHex, [game, gameName, gameDate]);

// For simple scripts (uses double CBOR encoding)
const oracleScript = createMintingPolicy(oracleCborHex);
```
