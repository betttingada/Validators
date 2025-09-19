[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [providers/LucidProvider](../README.md) / LucidProviderFactory

# Class: LucidProviderFactory

Defined in: [providers/LucidProvider.ts:412](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L412)

Factory for creating Lucid-based blockchain providers for real networks.

This factory handles the initialization of LucidEvolution with Blockfrost
providers and wallet configuration for production environments.

## Example

```typescript
const wallet: UserWallet = {
  key: "your-wallet-mnemonic-or-identifier",
  address: "addr1..."
};

const chainConfig: ChainProviderConf = {
  network: Network.PREVIEW,
  uri: "https://cardano-preview.blockfrost.io/api/v0",
  key: "your-blockfrost-key",
  // ... other config
};

const factory = new LucidProviderFactory(wallet, chainConfig);
const provider = await factory.createProvider();
```

## Implements

- [`IBlockchainProviderFactory`](../../IBlockchainProvider/interfaces/IBlockchainProviderFactory.md)

## Constructors

### Constructor

> **new LucidProviderFactory**(`wallet`, `chainConfig`): `LucidProviderFactory`

Defined in: [providers/LucidProvider.ts:425](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L425)

Creates a new LucidProviderFactory instance

#### Parameters

##### wallet

[`UserWallet`](../../../utils/cstypes/interfaces/UserWallet.md)

Wallet configuration containing private key and address

##### chainConfig

[`ChainProviderConf`](../../../utils/cstypes/interfaces/ChainProviderConf.md)

Chain configuration including network, Blockfrost settings, etc.

#### Returns

`LucidProviderFactory`

## Properties

### wallet

> `private` `readonly` **wallet**: [`UserWallet`](../../../utils/cstypes/interfaces/UserWallet.md)

Defined in: [providers/LucidProvider.ts:414](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L414)

User wallet configuration

***

### chainConfig

> `private` `readonly` **chainConfig**: [`ChainProviderConf`](../../../utils/cstypes/interfaces/ChainProviderConf.md)

Defined in: [providers/LucidProvider.ts:417](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L417)

Chain and network configuration

## Methods

### createProvider()

> **createProvider**(): `Promise`\<[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md)\>

Defined in: [providers/LucidProvider.ts:442](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L442)

Creates a configured blockchain provider for real networks

This method:
1. Initializes a Blockfrost provider with the configured endpoint
2. Sets up LucidEvolution with the appropriate network
3. Loads the wallet using the provided private key
4. Returns a ready-to-use blockchain provider

#### Returns

`Promise`\<[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md)\>

Promise resolving to a configured IBlockchainProvider

#### Throws

Error if Blockfrost initialization fails, network is invalid, or wallet loading fails

#### Implementation of

[`IBlockchainProviderFactory`](../../IBlockchainProvider/interfaces/IBlockchainProviderFactory.md).[`createProvider`](../../IBlockchainProvider/interfaces/IBlockchainProviderFactory.md#createprovider)

***

### validateConfiguration()

> `private` **validateConfiguration**(): `void`

Defined in: [providers/LucidProvider.ts:476](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L476)

Validates the factory configuration

#### Returns

`void`

#### Throws

Error if configuration is invalid

***

### mapNetworkType()

> `private` **mapNetworkType**(`network`): `Network`

Defined in: [providers/LucidProvider.ts:502](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L502)

Maps our internal Network enum to Lucid's Network type

#### Parameters

##### network

[`Network`](../../../utils/cstypes/enumerations/Network.md)

Our internal network enum value

#### Returns

`Network`

Corresponding Lucid network identifier

#### Throws

Error if network type is not supported
