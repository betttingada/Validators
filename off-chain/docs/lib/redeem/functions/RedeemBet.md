[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [lib/redeem](../README.md) / RedeemBet

# Function: RedeemBet()

> **RedeemBet**(`redeemInput`, `provider`): `Promise`\<[`Result`](../../../utils/cstypes/type-aliases/Result.md)\<[`BetRedemptionResult`](../interfaces/BetRedemptionResult.md)\>\>

Defined in: lib/redeem.ts:754

Comprehensive bet redemption function with enhanced error handling

## Parameters

### redeemInput

[`BetRedeemInput`](../../../utils/cstypes/interfaces/BetRedeemInput.md)

BetRedeemInput object containing all redemption parameters

### provider

[`IBlockchainProvider`](../../../providers/IBlockchainProvider/interfaces/IBlockchainProvider.md)

IBlockchainProvider instance for blockchain interaction

## Returns

`Promise`\<[`Result`](../../../utils/cstypes/type-aliases/Result.md)\<[`BetRedemptionResult`](../interfaces/BetRedemptionResult.md)\>\>

Promise<Result<BetRedemptionResult>> - Result containing transaction hash and redemption details

Enhanced Features:
- Comprehensive validation with detailed error reporting
- Oracle verification with game state validation
- Optimized UTXO selection with efficiency tracking
- Detailed transaction metrics and analysis
- Graceful error handling with recovery suggestions
