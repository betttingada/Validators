[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/utils](../README.md) / BeadTokenUtils

# Class: BeadTokenUtils

Defined in: [utils/utils.ts:18](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L18)

Specialized utility class for BEAD token operations.
Provides static methods for creating and managing BEAD token minting scripts.

## Constructors

### Constructor

> **new BeadTokenUtils**(): `BeadTokenUtils`

#### Returns

`BeadTokenUtils`

## Methods

### createBeadMintingScript()

> `static` **createBeadMintingScript**(`beadContractCborHex`, `beadName`, `beadReferralName`): `object`

Defined in: [utils/utils.ts:37](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/utils.ts#L37)

Creates a BEAD minting script with proper structure for Plutus V3.

#### Parameters

##### beadContractCborHex

`string`

The hexadecimal CBOR-encoded contract script

##### beadName

`string`

The name for the main BEAD token

##### beadReferralName

`string`

The name for the BEAD referral token

#### Returns

`object`

Object containing the minting script, policy ID, and token units

##### beadMintScript

> **beadMintScript**: `object`

###### beadMintScript.script

> **script**: `string`

###### beadMintScript.type

> **type**: `"PlutusV3"`

##### beadPolicyId

> **beadPolicyId**: `string`

##### unitBead

> **unitBead**: `string`

##### unitBeadReferral

> **unitBeadReferral**: `string`

#### Example

```typescript
const result = BeadTokenUtils.createBeadMintingScript(
  "590a1c590a19010000...", 
  "BEAD", 
  "BEAD_REF"
);
console.log(result.beadPolicyId); // Policy ID for the tokens
```
