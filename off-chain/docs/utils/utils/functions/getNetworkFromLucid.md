[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / getNetworkFromLucid

# Function: getNetworkFromLucid()

> **getNetworkFromLucid**(`lucid`): `string`

Defined in: [utils/utils.ts:343](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L343)

Extracts the network configuration from a Lucid instance with fallback.

## Parameters

### lucid

`any`

Lucid blockchain provider instance

## Returns

`string`

Network name string ("Preview", "Preprod", or "Mainnet")

## Example

```typescript
const network = getNetworkFromLucid(lucidInstance);
console.log(`Connected to: ${network}`); // "Connected to: Preview"
```
