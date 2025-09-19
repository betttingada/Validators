[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [providers/LucidProvider](../README.md) / LucidBlockchainProvider

# Class: LucidBlockchainProvider

Defined in: [providers/LucidProvider.ts:99](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L99)

Lucid-based implementation of the blockchain provider interface.

This class wraps a LucidEvolution instance and provides a unified interface
for blockchain operations. It supports both real network operations (via Blockfrost)
and emulated operations (via in-memory emulator) for testing.

## Example

```typescript
// For real networks
const provider = new Blockfrost(uri, key);
const lucid = await Lucid(provider, "Preview");
const blockchainProvider = new LucidBlockchainProvider(lucid);

// For testing with emulator
const emulator = new Emulator(accounts);
const lucid = await Lucid(emulator, "Custom");
const blockchainProvider = new LucidBlockchainProvider(lucid, emulator);
```

## Implements

- [`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md)

## Constructors

### Constructor

> **new LucidBlockchainProvider**(`lucid`, `emulator?`): `LucidBlockchainProvider`

Defined in: [providers/LucidProvider.ts:112](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L112)

Creates a new LucidBlockchainProvider instance

#### Parameters

##### lucid

`LucidEvolution`

The LucidEvolution instance to wrap

##### emulator?

`Emulator`

Optional emulator for testing scenarios

#### Returns

`LucidBlockchainProvider`

## Properties

### lucid

> `private` `readonly` **lucid**: `LucidEvolution`

Defined in: [providers/LucidProvider.ts:101](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L101)

The underlying LucidEvolution instance

***

### emulator?

> `private` `readonly` `optional` **emulator**: `Emulator`

Defined in: [providers/LucidProvider.ts:104](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L104)

Optional emulator reference for testing scenarios

## Methods

### getNetwork()

> **getNetwork**(): `Network`

Defined in: [providers/LucidProvider.ts:127](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L127)

Gets the current network configuration

#### Returns

`Network`

The network identifier (Preview, Preprod, Mainnet, or Custom)

#### Throws

Never throws - defaults to "Preview" if network is undefined

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`getNetwork`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#getnetwork)

***

### getWalletAddress()

> **getWalletAddress**(): `Promise`\<`string`\>

Defined in: [providers/LucidProvider.ts:137](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L137)

Gets the current wallet's address

#### Returns

`Promise`\<`string`\>

Promise resolving to the wallet's Cardano address

#### Throws

Error if no wallet is selected or wallet is inaccessible

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`getWalletAddress`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#getwalletaddress)

***

### selectWallet()

> **selectWallet**(`input`): `Promise`\<`void`\>

Defined in: [providers/LucidProvider.ts:168](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L168)

Selects a wallet using either seed phrase (Node.js) or wallet key (browser)

This method intelligently detects the environment:
- In Node.js environments: treats input as seed phrase
- In browser environments: treats input as wallet identifier for browser wallet API

#### Parameters

##### input

`string`

Seed phrase (Node.js) or wallet identifier (browser: 'nami', 'eternl', etc.)

#### Returns

`Promise`\<`void`\>

#### Throws

Error if wallet selection fails or wallet is not available

#### Example

```typescript
// Node.js environment - seed phrase
await provider.selectWallet("abandon abandon abandon...");

// Browser environment - wallet identifier
await provider.selectWallet("nami");
```

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`selectWallet`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#selectwallet)

***

### getAvailableWallets()

> **getAvailableWallets**(): `string`[]

Defined in: [providers/LucidProvider.ts:209](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L209)

Gets a list of available browser wallets

#### Returns

`string`[]

Array of wallet identifiers that can be used with selectWallet()

#### Example

```ts
['nami', 'eternl', 'flint', 'yoroi']
```

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`getAvailableWallets`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#getavailablewallets)

***

### getUtxosAt()

> **getUtxosAt**(`address`): `Promise`\<`UTxO`[]\>

Defined in: [providers/LucidProvider.ts:230](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L230)

Queries UTxOs at a specific address

#### Parameters

##### address

`string`

The Cardano address to query

#### Returns

`Promise`\<`UTxO`[]\>

Promise resolving to array of UTxOs at the address

#### Throws

Error if address is invalid or query fails

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`getUtxosAt`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#getutxosat)

***

### getUtxosAtWithUnit()

> **getUtxosAtWithUnit**(`address`, `unit`): `Promise`\<`UTxO`[]\>

Defined in: [providers/LucidProvider.ts:246](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L246)

Queries UTxOs at a specific address that contain a specific native token

#### Parameters

##### address

`string`

The Cardano address to query

##### unit

`string`

The asset unit (policy ID + asset name) to filter by

#### Returns

`Promise`\<`UTxO`[]\>

Promise resolving to array of UTxOs containing the specified asset

#### Throws

Error if address is invalid, unit is malformed, or query fails

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`getUtxosAtWithUnit`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#getutxosatwithunit)

***

### getWalletUtxos()

> **getWalletUtxos**(): `Promise`\<`UTxO`[]\>

Defined in: [providers/LucidProvider.ts:260](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L260)

Gets all UTxOs in the current wallet

#### Returns

`Promise`\<`UTxO`[]\>

Promise resolving to array of wallet UTxOs

#### Throws

Error if no wallet is selected or query fails

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`getWalletUtxos`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#getwalletutxos)

***

### newTx()

> **newTx**(): `TxBuilder`

Defined in: [providers/LucidProvider.ts:277](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L277)

Creates a new transaction builder

#### Returns

`TxBuilder`

A new TxBuilder instance for constructing transactions

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`newTx`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#newtx)

***

### completeSignAndSubmit()

> **completeSignAndSubmit**(`txBuilder`): `Promise`\<`string`\>

Defined in: [providers/LucidProvider.ts:293](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L293)

Completes, signs, and submits a transaction

This method handles the full transaction lifecycle:
1. Completes the transaction (balancing inputs/outputs, calculating fees)
2. Signs with the currently selected wallet
3. Submits to the network

#### Parameters

##### txBuilder

`TxBuilder`

The transaction builder to process

#### Returns

`Promise`\<`string`\>

Promise resolving to the transaction hash

#### Throws

Error if transaction completion, signing, or submission fails

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`completeSignAndSubmit`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#completesignandsubmit)

***

### ~~getCurrentTime()~~

> **getCurrentTime**(): `number`

Defined in: [providers/LucidProvider.ts:313](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L313)

Gets the current system time

#### Returns

`number`

Current timestamp in milliseconds

#### Deprecated

Use now() instead for blockchain-aware time

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`getCurrentTime`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#getcurrenttime)

***

### now()

> **now**(): `number`

Defined in: [providers/LucidProvider.ts:325](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L325)

Gets the current blockchain time

For emulator environments, this returns the emulator's controlled time.
For real networks, this returns the current system time.

#### Returns

`number`

Current blockchain time in milliseconds

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`now`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#now)

***

### getSlot()

> **getSlot**(): `number`

Defined in: [providers/LucidProvider.ts:338](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L338)

Gets the current slot number

For emulator environments, this returns the emulator's current slot.
For real networks, this calculates an approximate slot based on current time.

#### Returns

`number`

Current slot number

#### Note

Real network slot calculation is approximate and should not be used for critical operations

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`getSlot`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#getslot)

***

### awaitBlock()

> **awaitBlock**(`blocks`): `void`

Defined in: [providers/LucidProvider.ts:358](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L358)

Waits for a specified number of blocks to be produced

For emulator environments, this actively waits for block production.
For real networks, this is a no-op since block production cannot be controlled.

#### Parameters

##### blocks

`number`

Number of blocks to wait for

#### Returns

`void`

#### Note

In real network scenarios, use transaction confirmation APIs instead

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`awaitBlock`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#awaitblock)

***

### awaitSlot()

> **awaitSlot**(`slots`): `void`

Defined in: [providers/LucidProvider.ts:375](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/LucidProvider.ts#L375)

Waits for a specified number of slots to pass

For emulator environments, this actively advances the slot counter.
For real networks, this is a no-op since slot progression cannot be controlled.

#### Parameters

##### slots

`number`

Number of slots to wait for

#### Returns

`void`

#### Note

In real network scenarios, use time-based waiting or confirmation APIs instead

#### Implementation of

[`IBlockchainProvider`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md).[`awaitSlot`](../../IBlockchainProvider/interfaces/IBlockchainProvider.md#awaitslot)
