[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [utils/cstypes](../README.md) / Network

# Enumeration: Network

Defined in: [utils/cstypes.ts:111](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L111)

Cardano network enumeration for multi-network support

Supports all major Cardano networks for development, testing, and production:
- **MAINNET**: Production Cardano network with real ADA
- **PREPROD**: Pre-production testing network for final validation
- **PREVIEW**: Development and integration testing network
- **CUSTOM**: Local development networks and private testnets

## Example

Network configuration for different environments:
```typescript
// Production environment
const mainnetConfig = { network: Network.MAINNET };

// Testing environment  
const testConfig = { network: Network.PREPROD };

// Development environment
const devConfig = { network: Network.PREVIEW };

// Local development
const localConfig = { network: Network.CUSTOM };
```

## Enumeration Members

### MAINNET

> **MAINNET**: `"mainnet"`

Defined in: [utils/cstypes.ts:113](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L113)

Production Cardano network with real economic value

***

### PREPROD

> **PREPROD**: `"preprod"`

Defined in: [utils/cstypes.ts:115](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L115)

Pre-production testing network for final validation

***

### PREVIEW

> **PREVIEW**: `"preview"`

Defined in: [utils/cstypes.ts:117](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L117)

Development and integration testing network

***

### CUSTOM

> **CUSTOM**: `"custom"`

Defined in: [utils/cstypes.ts:119](https://github.com/cmorgado/Bead-Cardano/blob/24017eb600ede1b71f111ffff6b54d88eb612b06/Aiken/bead/off-chain/utils/cstypes.ts#L119)

Custom/local development networks
