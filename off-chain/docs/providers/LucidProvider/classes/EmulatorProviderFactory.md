[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [providers/LucidProvider](../README.md) / EmulatorProviderFactory

# Class: EmulatorProviderFactory

Defined in: [providers/LucidProvider.ts:547](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L547)

Factory for creating emulator-based blockchain providers for testing.

This factory creates providers using LucidEvolution's in-memory emulator,
which is ideal for unit testing, integration testing, and development scenarios
where you need deterministic blockchain behavior.

Features:
- Deterministic transaction execution
- Controllable time and slot progression
- No external network dependencies
- Fast execution for testing

## Example

```typescript
const accounts = [
  {
    address: "addr_test1...",
    seedPhrase: "abandon abandon...",
    privateKey: "ed25519_sk1...",
    assets: { lovelace: 100_000_000_000n }
  }
];

const provider = await EmulatorProviderFactory.createProvider(
  accounts,
  accounts[0],
  Network.PREVIEW
);
```

## Constructors

### Constructor

> **new EmulatorProviderFactory**(): `EmulatorProviderFactory`

#### Returns

`EmulatorProviderFactory`

## Methods

### createProvider()

> `static` **createProvider**(`accounts`, `selectedAccount`, `network`): `Promise`\<[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md)\>

Defined in: [providers/LucidProvider.ts:586](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L586)

Creates a configured blockchain provider using the emulator

This static method:
1. Initializes an emulator with the provided accounts
2. Sets up LucidEvolution with "Custom" network (emulator mode)
3. Selects the specified account using its seed phrase
4. Returns a provider with emulator capabilities (time/slot control)

#### Parameters

##### accounts

`EmulatorAccount`[]

Array of emulator accounts to initialize

##### selectedAccount

`EmulatorAccount`

The account to select as the active wallet

##### network

[`Network`](../../../utils/cstypes/enumerations/Network.md) = `NetworkType.PREVIEW`

Network type (used for configuration, defaults to PREVIEW)

#### Returns

`Promise`\<[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md)\>

Promise resolving to a configured IBlockchainProvider with emulator support

#### Throws

Error if emulator initialization fails or account selection fails

#### Example

```typescript
// Create accounts for testing
const accounts: EmulatorAccount[] = [
  {
    address: "addr_test1...",
    seedPhrase: "abandon abandon abandon...",
    privateKey: "ed25519_sk1...",
    assets: { lovelace: 100_000_000_000n }
  }
];

// Create provider
const provider = await EmulatorProviderFactory.createProvider(
  accounts,
  accounts[0]
);

// Use provider for testing
await provider.awaitBlock(1); // Advance one block
const utxos = await provider.getWalletUtxos();
```

***

### createDefaultProvider()

> `static` **createDefaultProvider**(`accountCount`, `adaPerAccount`): `Promise`\<[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md)\>

Defined in: [providers/LucidProvider.ts:647](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L647)

Creates a simple emulator provider with default test accounts

This convenience method creates a basic testing setup with pre-configured
accounts that have sufficient ADA for testing transactions.

#### Parameters

##### accountCount

`number` = `3`

Number of test accounts to create (default: 3)

##### adaPerAccount

`bigint` = `100_000_000_000n`

ADA amount per account in lovelace (default: 100 ADA)

#### Returns

`Promise`\<[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md)\>

Promise resolving to a configured provider with the first account selected

#### Throws

Error if account creation or provider initialization fails

#### Example

```typescript
// Quick setup for testing
const provider = await EmulatorProviderFactory.createDefaultProvider();

// Provider is ready to use with the first account selected
const address = await provider.getWalletAddress();
const utxos = await provider.getWalletUtxos();
```
