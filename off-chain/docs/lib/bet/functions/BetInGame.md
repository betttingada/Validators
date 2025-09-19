[**BEAD Protocol Off-Chain Documentation v1.0.0**](../../../README.md)

***

[BEAD Protocol Off-Chain Documentation](../../../modules.md) / [lib/bet](../README.md) / BetInGame

# Function: BetInGame()

> **BetInGame**(`betInput`, `provider`): `Promise`\<[`Result`](../../../utils/cstypes/type-aliases/Result.md)\<[`BetResult`](../interfaces/BetResult.md)\>\>

Defined in: lib/bet.ts:604

Enhanced betting function with comprehensive validation and detailed error handling.
Supports multi-token betting (ADA + BEAD) with automatic token burning and minting.

Key Features:
- Comprehensive parameter validation with detailed error messages
- Enhanced error handling with recovery suggestions
- Automatic BEAD token burning for bet placement
- Type-safe transaction building with validation
- Detailed logging and debugging support

## Parameters

### betInput

[`BetInput`](../../../utils/cstypes/interfaces/BetInput.md)

Complete betting configuration containing:
  - wallet: UserWallet (user identification and address)
  - chainProviderConf: ChainProviderConf (network and contract configuration)
  - betPotValidatorCbor: string (bet pot validator CBOR hex)
  - betMintingValidatorCbor: string (bet minting validator CBOR hex)
  - oracleMintingValidatorCbor: string (oracle minting validator CBOR hex)
  - posixTime: number (game date/time in POSIX format)
  - gameNr: number (unique game identifier)
  - gameName: string (human-readable game name)
  - lovelaces: number (ADA bet amount)
  - beads: number (BEAD bet amount)
  - totalBet: number (calculated total bet value)
  - winner: GameOutcome (predicted outcome: "0"=Draw, "1"=Home, "2"=Away)

### provider

[`IBlockchainProvider`](../../../providers/IBlockchainProvider/interfaces/IBlockchainProvider.md)

IBlockchainProvider instance for blockchain operations

## Returns

`Promise`\<[`Result`](../../../utils/cstypes/type-aliases/Result.md)\<[`BetResult`](../interfaces/BetResult.md)\>\>

Promise<Result<BetResult>> containing:
  - success: BetResult with transaction hash and bet summary
  - failure: Detailed error with recovery suggestions and context

## Example

```typescript
const betInput: BetInput = {
  wallet: userWallet,
  chainProviderConf: networkConfig,
  betPotValidatorCbor: "...",
  betMintingValidatorCbor: "...",
  oracleMintingValidatorCbor: "...",
  posixTime: Date.now() + 3600000, // 1 hour from now
  gameNr: 12345,
  gameName: "TeamA_vs_TeamB",
  lovelaces: 100, // 100 ADA bet
  beads: 50,      // 50 BEAD bet
  totalBet: 150,
  winner: GameOutcome.HOME // Betting on home team win
};

const result = await BetInGame(betInput, provider);
if (result.success) {
  console.log(`Bet placed! TX: ${result.data.txHash}`);
} else {
  console.error(`Bet failed: ${result.error.message}`);
}
```
