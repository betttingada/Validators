[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [providers/IBlockchainProvider](../README.md) / IBlockchainProvider

# Interface: IBlockchainProvider

Defined in: [providers/IBlockchainProvider.ts:20](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L20)

Abstraction interface for blockchain providers
This allows swapping between real Cardano network providers and emulators

## Methods

### getNetwork()

> **getNetwork**(): `Network`

Defined in: [providers/IBlockchainProvider.ts:31](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L31)

Get the current network configuration

#### Returns

`Network`

***

### getWalletAddress()

> **getWalletAddress**(): `Promise`\<`string`\>

Defined in: [providers/IBlockchainProvider.ts:36](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L36)

Get the current wallet address

#### Returns

`Promise`\<`string`\>

***

### selectWallet()

> **selectWallet**(`input`): `void`

Defined in: [providers/IBlockchainProvider.ts:42](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L42)

Select a wallet using a seed phrase
This allows switching between different wallets/accounts

#### Parameters

##### input

`string`

#### Returns

`void`

***

### getAvailableWallets()

> **getAvailableWallets**(): `string`[]

Defined in: [providers/IBlockchainProvider.ts:50](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L50)

Get list of available browser wallets
This is useful for dApp development to show users what wallets they can connect

#### Returns

`string`[]

Array of available wallet keys, or empty array if not in browser

***

### getUtxosAt()

> **getUtxosAt**(`address`): `Promise`\<`UTxO`[]\>

Defined in: [providers/IBlockchainProvider.ts:59](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L59)

Get all UTXOs at a specific address

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`UTxO`[]\>

***

### getUtxosAtWithUnit()

> **getUtxosAtWithUnit**(`address`, `unit`): `Promise`\<`UTxO`[]\>

Defined in: [providers/IBlockchainProvider.ts:64](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L64)

Get UTXOs at an address that contain a specific unit

#### Parameters

##### address

`string`

##### unit

`string`

#### Returns

`Promise`\<`UTxO`[]\>

***

### getWalletUtxos()

> **getWalletUtxos**(): `Promise`\<`UTxO`[]\>

Defined in: [providers/IBlockchainProvider.ts:69](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L69)

Get UTXOs from the connected wallet

#### Returns

`Promise`\<`UTxO`[]\>

***

### newTx()

> **newTx**(): `TxBuilder`

Defined in: [providers/IBlockchainProvider.ts:78](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L78)

Create a new transaction builder

#### Returns

`TxBuilder`

***

### completeSignAndSubmit()

> **completeSignAndSubmit**(`txBuilder`): `Promise`\<`string`\>

Defined in: [providers/IBlockchainProvider.ts:85](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L85)

Complete, sign and submit a transaction

#### Parameters

##### txBuilder

`TxBuilder`

The transaction builder to complete and submit

#### Returns

`Promise`\<`string`\>

Promise<string> - The transaction hash

***

### getCurrentTime()

> **getCurrentTime**(): `number`

Defined in: [providers/IBlockchainProvider.ts:94](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L94)

Get the current time for validation purposes

#### Returns

`number`

***

### awaitBlock()

> **awaitBlock**(`blocks`): `void`

Defined in: [providers/IBlockchainProvider.ts:100](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L100)

Wait for a specified number of blocks (mainly for emulator testing)
For real networks, this may be a no-op or simulate time passage

#### Parameters

##### blocks

`number`

#### Returns

`void`

***

### now()

> **now**(): `number`

Defined in: [providers/IBlockchainProvider.ts:107](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L107)

Get the current blockchain time (equivalent to emulator.now())
For emulator: returns emulator time
For real networks: returns current system time

#### Returns

`number`

***

### getSlot()

> **getSlot**(): `number`

Defined in: [providers/IBlockchainProvider.ts:113](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L113)

Get the current slot number (mainly for emulator testing)
For real networks, this may return a calculated slot or current time

#### Returns

`number`

***

### awaitSlot()

> **awaitSlot**(`slots`): `void`

Defined in: [providers/IBlockchainProvider.ts:119](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/providers/IBlockchainProvider.ts#L119)

Wait for a specified number of slots (mainly for emulator testing)
For real networks, this may be a no-op or simulate time passage

#### Parameters

##### slots

`number`

#### Returns

`void`
