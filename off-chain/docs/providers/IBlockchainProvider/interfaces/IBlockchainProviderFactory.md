[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [providers/IBlockchainProvider](../README.md) / IBlockchainProviderFactory

# Interface: IBlockchainProviderFactory

Defined in: [providers/IBlockchainProvider.ts:129](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L129)

Factory for creating blockchain providers

## Methods

### createProvider()

> **createProvider**(): `Promise`\<[`IBlockchainProvider`](IBlockchainProvider.md)\>

Defined in: [providers/IBlockchainProvider.ts:134](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L134)

Create a blockchain provider instance
This handles all the wallet loading and network configuration

#### Returns

`Promise`\<[`IBlockchainProvider`](IBlockchainProvider.md)\>
