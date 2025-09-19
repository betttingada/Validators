[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / UserWallet

# Interface: UserWallet

Defined in: [utils/cstypes.ts:210](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L210)

User wallet configuration interface

Represents a user's wallet with identification and address information
for blockchain operations and transaction signing.

 UserWallet

## Examples

Creating a user wallet configuration:
```typescript
const userWallet: UserWallet = {
  key: "your-wallet-mnemonic-or-identifier",
  address: "addr_test1qp...xyz123" // Cardano address
};
```

Using with different wallet types:
```typescript
// Hardware wallet configuration
const hardwareWallet: UserWallet = {
  key: "ledger-device-id",
  address: "addr1q9...abc456"
};

// Software wallet configuration
const softwareWallet: UserWallet = {
  key: "abandon abandon abandon...", // Mnemonic
  address: "addr_test1qq...def789"
};

// Browser wallet configuration
const browserWallet: UserWallet = {
  key: "eternl", // Wallet identifier
  address: "addr_test1qq...def789"
};
```

## Properties

### key

> **key**: `string`

Defined in: [utils/cstypes.ts:212](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L212)

Wallet identifier or mnemonic key for authentication

***

### address

> **address**: `string`

Defined in: [utils/cstypes.ts:214](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L214)

Cardano address for receiving funds and signing transactions
