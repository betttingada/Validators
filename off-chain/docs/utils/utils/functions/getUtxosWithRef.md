[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / getUtxosWithRef

# Function: getUtxosWithRef()

> **getUtxosWithRef**(`va`, `tokenUnit`): `Promise`\<`number`\>

Defined in: [utils/utils.ts:627](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L627)

Calculates the total quantity of a specific token across multiple UTXOs.
Safely handles UTXOs that may not contain the specified token.

## Parameters

### va

`UTxO`[]

Array of UTXOs to search through

### tokenUnit

`string`

Token unit identifier (policy ID + asset name)

## Returns

`Promise`\<`number`\>

Total quantity of the token found across all UTXOs

## Example

```typescript
const utxos = await lucid.wallet.getUtxos();
const total = await getUtxosWithRef(utxos, "policy123...abc456");
console.log(`Total tokens: ${total}`);
```
