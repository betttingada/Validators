[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / ContractSuite

# Interface: ContractSuite

Defined in: [utils/utils.ts:238](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L238)

Complete contract suite interface for betting operations.
Contains all scripts, policy IDs, and addresses needed for contract interactions.

## Properties

### betMintingScript

> **betMintingScript**: `Script`

Defined in: [utils/utils.ts:240](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L240)

Bet minting policy script

***

### oracleMintScript

> **oracleMintScript**: `Script`

Defined in: [utils/utils.ts:242](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L242)

Oracle minting policy script

***

### potScript

> **potScript**: `Script`

Defined in: [utils/utils.ts:244](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L244)

Bet pot spending validator script

***

### betPolicyId

> **betPolicyId**: `string`

Defined in: [utils/utils.ts:246](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L246)

Bet token policy ID

***

### oraclePolicyId

> **oraclePolicyId**: `string`

Defined in: [utils/utils.ts:248](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L248)

Oracle token policy ID

***

### betPotAddress

> **betPotAddress**: `string`

Defined in: [utils/utils.ts:250](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L250)

Bet pot contract address

***

### params

> **params**: `any`[]

Defined in: [utils/utils.ts:252](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L252)

Contract parameters used in script creation
