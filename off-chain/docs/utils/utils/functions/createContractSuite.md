[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / createContractSuite

# Function: createContractSuite()

> **createContractSuite**(`betMintingCborHex`, `oracleMintCborHex`, `game`, `gameName`, `gameDate`, `network`): [`ContractSuite`](../interfaces/ContractSuite.md)

Defined in: [utils/utils.ts:283](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L283)

Creates a complete contract suite for betting operations.
Generates all necessary scripts, policy IDs, and addresses in one call.

## Parameters

### betMintingCborHex

`string`

Bet minting contract CBOR hex

### oracleMintCborHex

`string`

Oracle minting contract CBOR hex

### game

`number`

Game identifier

### gameName

`string`

Human-readable game name

### gameDate

`number`

Game date timestamp

### network

`Network`

Cardano network (for address generation)

## Returns

[`ContractSuite`](../interfaces/ContractSuite.md)

Complete contract suite with all components

## Example

```typescript
const contracts = createContractSuite(
  betCborHex,
  oracleCborHex,
  123,
  "Lakers vs Warriors",
  1640995200000,
  "Preview"
);

// Use the contracts
console.log(contracts.betPolicyId);
console.log(contracts.betPotAddress);
```
