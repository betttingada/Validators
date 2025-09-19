import { Lucid, Emulator, fromText, applyParamsToScript, validatorToAddress } from "@evolution-sdk/lucid";
import { ACCOUNTS } from "../lib/config";
import { BetInGame } from "../lib/bet";
import { purchaseBead } from "../lib/bead";
import { SetGameResult, TreasuryCollection } from "../lib/oracle";
import { RedeemBet } from "../lib/redeem";
import { BetInput, UserWallet, ChainProviderConf, BetOracleInput, BetRedeemInput, InputBeadWithReferral, GameOutcome, Network } from "../utils/cstypes";
import { IBlockchainProvider, LucidBlockchainProvider } from "../providers/LucidProvider";
import beadContract from "../compiled/bead.signed.plutus.json" with { type: "json" };
import betContract from "../compiled/bet.signed.plutus.json" with { type: "json" };
import oracleContract from "../compiled/oracle.signed.plutus.json" with { type: "json" };

// Helper function to create standard wallet and chain provider configuration
async function createStandardWalletAndChainConfig(
    provider: IBlockchainProvider,
    beadCborOverride?: string
): Promise<{ wallet: UserWallet; chainProviderConf: ChainProviderConf }> {
    const wallet: UserWallet = {
        key: "", // Not needed for testing
        address: ""  // Will be set from provider
    };

    // Get network from provider and convert to our Network enum
    const lucidNetwork = await provider.getNetwork();
    const network = lucidNetwork === "Preview" ? Network.PREVIEW :
                   lucidNetwork === "Preprod" ? Network.PREPROD :
                   lucidNetwork === "Mainnet" ? Network.MAINNET :
                   Network.PREVIEW; // Default to PREVIEW for custom networks
    
    const chainProviderConf: ChainProviderConf = {
        network: network,
        uri: "",
        key: "",
        beadCbor: beadCborOverride || beadContract.cborHex,
        beadName: "BEAD PR",
        beadReferralName: "BEADR PR", 
        treasuryAddress: ACCOUNTS.treasury.address
    };

    return { wallet, chainProviderConf };
}

// Helper function to create BetOracleInput from individual parameters
async function createOracleInput(
    gameNr: number,
    gameName: string,
    posixTime: number,
    winner: number,
    id: string,
    provider: IBlockchainProvider,
    betMintingValidatorCbor: string,
    betOracleValidatorCbor: string
): Promise<BetOracleInput> {
    const { wallet, chainProviderConf } = await createStandardWalletAndChainConfig(provider);

    // Convert numeric winner to GameOutcome
    const gameOutcome = winner === 0 ? GameOutcome.TIE : 
                       winner === 1 ? GameOutcome.HOME : 
                       GameOutcome.AWAY;

    return {
        wallet,
        chainProviderConf,
        betPotValidatorCbor: betContract.cborHex,
        betMintingValidatorCbor: betMintingValidatorCbor,
        betOracleValidatorCbor: betOracleValidatorCbor,
        posixTime,
        gameNr,
        gameName,
        winner: gameOutcome,
        id
    };
}

// Helper function to create BetInput from individual parameters
async function createBetInput(
    gameNr: number,
    gameName: string,
    posixTime: number,
    winner: number,
    lovelaces: number,
    beads: number,
    provider: IBlockchainProvider,
    betMintingValidatorCbor: string,
    beadCbor: string
): Promise<BetInput> {
    const { wallet, chainProviderConf } = await createStandardWalletAndChainConfig(provider, beadCbor);

    // Convert numeric winner to GameOutcome
    const gameOutcome = winner === 0 ? GameOutcome.TIE : 
                       winner === 1 ? GameOutcome.HOME : 
                       GameOutcome.AWAY;

    return {
        wallet,
        chainProviderConf,
        betPotValidatorCbor: betContract.cborHex,
        betMintingValidatorCbor: betMintingValidatorCbor,
        oracleMintingValidatorCbor: oracleContract.cborHex,
        posixTime,
        gameNr,
        gameName,
        lovelaces,
        beads,
        totalBet: lovelaces + beads,
        winner: gameOutcome
    };
}

// Helper function to create BetRedeemInput from individual parameters
async function createRedeemInput(
    gameNr: number,
    gameName: string,
    posixTime: number,
    result: string,
    provider: IBlockchainProvider,
    betPotValidatorCbor: string,
    betOracleValidatorCbor: string
): Promise<BetRedeemInput> {
    const { wallet, chainProviderConf } = await createStandardWalletAndChainConfig(provider);

    // Parse result as GameOutcome - for "2-1" score, assume HOME wins
    const gameOutcome = result === "2-1" ? GameOutcome.HOME : 
                       result === "1-2" ? GameOutcome.AWAY :
                       result === "1-1" ? GameOutcome.TIE :
                       result as GameOutcome;

    return {
        wallet,
        chainProviderConf,
        betPotValidatorCbor,
        betMintingValidatorCbor: betContract.cborHex,
        betOracleValidatorCbor,
        winner: gameOutcome,
        posixTime,
        gameNr,
        gameName,
        id: result,
        playerWinTX: [],
        payingTx: []
    };
}

// Helper function to create InputBeadWithReferral for purchaseBead
async function createBeadInputWithoutReferral(
    treasuryAddress: string,
    buyerAdaInvestmentLovelace: number, // Now always in lovelace
    provider: IBlockchainProvider,
    beadContractCorHex: string
): Promise<InputBeadWithReferral> {
    const { wallet, chainProviderConf } = await createStandardWalletAndChainConfig(provider, beadContractCorHex);

    return {
        wallet,
        chainProviderConf,
        referralAddress: "", // Empty string indicates no referral
        treasuryAddress,
        buyerAdaInvestmentLovelace
    };
}

/**
 * Account A bets 10 ADA on SPO-PO game with Home Win, game tomorrow
 * First buys BEAD tokens, then places the bet
 */
export async function betAccountAOnSPOPO(gameDate: number, provider: IBlockchainProvider) {
    // Create provider for Account A if not provided

    provider.selectWallet(ACCOUNTS.accountA.seedPhrase);
    console.log("🪙 Buying BEAD tokens first...");
    
    // First, buy some BEAD tokens (200 ADA worth = 200,000,000 lovelace)
    const beadInput = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        200_000_000, // 200 ADA in lovelace
        provider,
        beadContract.cborHex
    );
    const beadPurchaseResult = await purchaseBead(
        provider,
        beadInput
    );
    
    if (!beadPurchaseResult.success) {
        console.log(`❌ BEAD purchase failed: ${beadPurchaseResult.error.message}`);
        return beadPurchaseResult;
    }
    
    console.log(`✅ Got ${beadPurchaseResult.data.beadAmount} BEAD tokens\n`);
    
    // Wait a block for confirmation
    provider.awaitBlock(1);

    console.log("🎯 Placing bet...");
    
    // Use the provided game date
    
    // Place the bet
    const betInput = await createBetInput(
        1001,                           // game ID
        "_SPO-PO",                      // game name
        gameDate,                      // game date (tomorrow)
        1,                             // result: 1 = Home Win (0 = Draw, 1 = Home Win, 2 = Away Win)
        10_000_000,                    // bet 10 ADA (in lovelace)
        0,                             // bet 0 BEAD 
        provider,
        betContract.cborHex,           // bet contract
        beadContract.cborHex           // bead contract
    );
    
    return await BetInGame(betInput, provider);
}

/**
 * Account B bets 15 ADA + 5 BEAD on SPO-PO game with Away Win
 * First buys BEAD tokens, then places the bet
 */
export async function betAccountBOnSPOPO(gameDate: number, provider: IBlockchainProvider) {
    // Create provider for Account B if not provided
    provider.selectWallet(ACCOUNTS.accountB.seedPhrase);
    
    console.log("🪙 Account B buying BEAD tokens first...");
    
    // First, buy some BEAD tokens (200 ADA worth = 200,000,000 lovelace)
    const beadInput2 = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        200_000_000, // 200 ADA in lovelace
        provider,
        beadContract.cborHex
    );
    const beadPurchaseResult = await purchaseBead(
        provider,
        beadInput2
    );
    
    if (!beadPurchaseResult.success) {
        console.log(`❌ BEAD purchase failed: ${beadPurchaseResult.error.message}`);
        return beadPurchaseResult;
    }
    
    console.log(`✅ Got ${beadPurchaseResult.data.beadAmount} BEAD tokens\n`);
    
    // Wait a block for confirmation
    provider.awaitBlock(1);
    
    console.log("🎯 Account B placing bet...");
    
    // Use the provided game date
    
    // Place the bet on Away Win (result: 2)
    const betInput = await createBetInput(
        1001,                           // game ID
        "_SPO-PO",                      // game name
        gameDate,                      // game date
        2,                             // result: 2 = Away Win (0 = Draw, 1 = Home Win, 2 = Away Win)
        15_000_000,                    // bet 15 ADA (in lovelace)
        5,                             // bet 5 BEAD 
        provider,
        betContract.cborHex,           // bet contract
        beadContract.cborHex           // bead contract
    );
    
    return await BetInGame(betInput, provider);
}

/**
 * Account C bets 7 ADA on SPO-PO game with Home Win
 * First buys BEAD tokens, then places the bet
 */
export async function betAccountCOnSPOPO( gameDate: number, provider: IBlockchainProvider) {
    // Create provider for Account C if not provided
    provider.selectWallet(ACCOUNTS.accountC.seedPhrase);
    
    console.log("🪙 Account C buying BEAD tokens first...");
    
    // First, buy some BEAD tokens (200 ADA worth = 200,000,000 lovelace)
    const beadInput3 = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        200_000_000, // 200 ADA in lovelace
        provider,
        beadContract.cborHex
    );
    const beadPurchaseResult = await purchaseBead(
        provider,
        beadInput3
    );
    
    if (!beadPurchaseResult.success) {
        console.log(`❌ BEAD purchase failed: ${beadPurchaseResult.error.message}`);
        return beadPurchaseResult;
    }
    
    console.log(`✅ Got ${beadPurchaseResult.data.beadAmount} BEAD tokens\n`);
    
    // Wait a block for confirmation
    provider.awaitBlock(1);
    
    console.log("🎯 Account C placing bet...");
    
    // Use the provided game date
    
    // Place the bet on Home Win (result: 1) - Increased to meet minimum 10 ADA requirement
    const betInput = await createBetInput(
        1001,                           // game ID
        "_SPO-PO",                      // game name
        gameDate,                      // game date
        1,                             // result: 1 = Home Win (0 = Draw, 1 = Home Win, 2 = Away Win)
        12_000_000,                    // bet 12 ADA (in lovelace) - above minimum
        0,                             // bet 0 BEAD 
        provider,
        betContract.cborHex,           // bet contract
        beadContract.cborHex           // bead contract
    );

    return await BetInGame(betInput, provider);
}

/**
 * Account D bets 23 ADA + 7 BEAD on SPO-PO game with Tie result
 * First buys BEAD tokens, then places the bet
 */
export async function betAccountDOnSPOPO(gameDate: number, provider: IBlockchainProvider) {
    // Create provider for Account D if not provided
    provider.selectWallet(ACCOUNTS.accountD.seedPhrase);
    
    console.log("🪙 Account D buying BEAD tokens first...");
    
    // First, buy some BEAD tokens (200 ADA worth = 200,000,000 lovelace)
    const beadInput4 = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        200_000_000, // 200 ADA in lovelace
        provider,
        beadContract.cborHex
    );
    const beadPurchaseResult = await purchaseBead(
        provider,
        beadInput4
    );
    
    if (!beadPurchaseResult.success) {
        console.log(`❌ BEAD purchase failed: ${beadPurchaseResult.error.message}`);
        return beadPurchaseResult;
    }
    
    console.log(`✅ Got ${beadPurchaseResult.data.beadAmount} BEAD tokens\n`);
    
    // Wait a block for confirmation
    provider.awaitBlock(1);
    
    console.log("🎯 Account D placing bet...");
    
    // Use the provided game date
    
    // Place the bet on Tie (result: 0) with mixed ADA + BEAD bet
    const betInput = await createBetInput(
        1001,                           // game ID
        "_SPO-PO",                      // game name
        gameDate,                      // game date
        0,                             // result: 0 = Tie (0 = Draw, 1 = Home Win, 2 = Away Win)
        23_000_000,                    // bet 23 ADA (in lovelace)
        7,                             // bet 7 BEAD 
        provider,
        betContract.cborHex,           // bet contract
        beadContract.cborHex           // bead contract
    );

    return await BetInGame(betInput, provider);
}

/**
 * Account E bets 13 ADA on SPO-PO game with Home Win
 * First buys BEAD tokens, then places the bet
 */
export async function betAccountEOnSPOPO(gameDate: number, provider: IBlockchainProvider) {
    // Create provider for Account E if not provided
    provider.selectWallet(ACCOUNTS.accountE.seedPhrase);
    
    console.log("🪙 Account E buying BEAD tokens first...");
    
    // First, buy some BEAD tokens (200 ADA worth = 200,000,000 lovelace)
    const beadInput5 = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        200_000_000, // 200 ADA in lovelace
        provider,
        beadContract.cborHex
    );
    const beadPurchaseResult = await purchaseBead(
        provider,
        beadInput5
    );
    
    if (!beadPurchaseResult.success) {
        console.log(`❌ BEAD purchase failed: ${beadPurchaseResult.error.message}`);
        return beadPurchaseResult;
    }
    
    console.log(`✅ Got ${beadPurchaseResult.data.beadAmount} BEAD tokens\n`);
    
    // Wait a block for confirmation
    provider.awaitBlock(1);
    
    console.log("🎯 Account E placing bet...");
    
    // Use the provided game date
    
    // Place the bet on Home Win (result: 1)
    const betInput = await createBetInput(
        1001,                           // game ID
        "_SPO-PO",                      // game name
        gameDate,                      // game date
        1,                             // result: 1 = Home Win (0 = Draw, 1 = Home Win, 2 = Away Win)
        13_000_000,                    // bet 13 ADA (in lovelace)
        0,                             // bet 0 BEAD 
        provider,
        betContract.cborHex,           // bet contract
        beadContract.cborHex           // bead contract
    );

    return await BetInGame(betInput, provider);
}

/**
 * Set the result of the SPO-PO game to a Home Win
 * Simple function to declare the winner using the oracle
 */
export async function setGameResultHomeWin(gameDate: number, provider: IBlockchainProvider) {
    // Create provider for Treasury (oracle operator)
    provider.selectWallet(ACCOUNTS.treasury.seedPhrase);
    
    console.log("🔮 Setting game result to Home Win...");
    
    // Use the provided game date
    
    // Set the game result
    const oracleInput = await createOracleInput(
        1001,                           // game ID (same as bet)
        "_SPO-PO",                      // game name (same as bet)
        gameDate,                      // game date (same as bet)
        1,                             // result: 1 = Home Win
        "2-1",                         // final score
        provider,
        betContract.cborHex,           // bet contract
        oracleContract.cborHex         // oracle contract
    );
    
    return await SetGameResult(oracleInput, provider);
}

/**
 * Redeem the winning bet after oracle has set the result
 * Simple function to claim the winnings - but wait until after game time
 */
export async function redeemWinningBet(gameDate: number, provider: IBlockchainProvider) {
    // Create provider for Account A
    provider.selectWallet(ACCOUNTS.accountA.seedPhrase);
    
    console.log("💰 Redeeming winning bet...");
    
    // Use the provided game date
    
    // Redeem the bet
    const redeemInput = await createRedeemInput(
        1001,                           // game ID (same as bet)
        "_SPO-PO",                      // game name (same as bet)
        gameDate,                      // game date (same as bet and oracle) 
        "2-1",                         // final score (same as oracle)
        provider,
        betContract.cborHex,           // bet contract
        oracleContract.cborHex         // oracle contract
    );
    return await RedeemBet(redeemInput, provider);
}

/**
 * Redeem Account C's winning bet after oracle has set the result
 * Account C also bet on Home Win, so they should be able to redeem their share
 */
export async function redeemWinningBetAccountC(gameDate: number, provider: IBlockchainProvider) {
    // Create provider for Account C
    provider.selectWallet(ACCOUNTS.accountC.seedPhrase);
    
    console.log("💰 Account C redeeming winning bet...");
    
    // Refresh the UTXO state to get the latest blockchain state
    const walletAddress = await provider.getWalletAddress();
    await provider.getUtxosAt(walletAddress);
    
    // Use the provided game date
    
    // Redeem the bet
    const redeemInput = await createRedeemInput(
        1001,                           // game ID (same as bet)
        "_SPO-PO",                      // game name (same as bet)
        gameDate,                      // game date (same as bet and oracle) 
        "2-1",                         // final score (same as oracle)
        provider,
        betContract.cborHex,           // bet contract
        oracleContract.cborHex         // oracle contract
    );
    return await RedeemBet(redeemInput, provider);
}

/**
 * Redeem Account E's winning bet after oracle has set the result
 * Account E also bet on Home Win, so they should be able to redeem their share
 */
export async function redeemWinningBetAccountE(gameDate: number, provider: IBlockchainProvider) {
    // Create provider for Account E
    provider.selectWallet(ACCOUNTS.accountE.seedPhrase);
    
    console.log("💰 Account E redeeming winning bet...");
    
    // Refresh the UTXO state to get the latest blockchain state
    const walletAddress = await provider.getWalletAddress();
    await provider.getUtxosAt(walletAddress);
    
    // Use the provided game date
    
    // Redeem the bet
    const redeemInput = await createRedeemInput(
        1001,                           // game ID (same as bet)
        "_SPO-PO",                      // game name (same as bet)
        gameDate,                      // game date (same as bet and oracle) 
        "2-1",                         // final score (same as oracle)
        provider,
        betContract.cborHex,           // bet contract
        oracleContract.cborHex         // oracle contract
    );
    return await RedeemBet(redeemInput, provider);
}

// Run the function if this file is executed directly
if (true) { // Comment out for library usage
    try {
        console.log("🎯 Testing betting flow");
        const emulator = new Emulator([
            ACCOUNTS.treasury,
            ACCOUNTS.accountA,
            ACCOUNTS.accountB,
            ACCOUNTS.accountC,
            ACCOUNTS.accountD,   // Add the scammer account
            ACCOUNTS.accountE,   // Add Account E
        ]);
        const lucid = await Lucid(emulator, "Custom");
        
        // Create a single provider for Account A using the shared emulator
        const accountProvider = new LucidBlockchainProvider(lucid, emulator);
       
        // Calculate game date - use current emulator time + a longer interval to fit slot range
        const currentTime = accountProvider.now();
        const currentSlot = accountProvider.getSlot();
        const gameDate = currentTime + (300 * 1000); // 300 seconds (5 minutes) from now - longer to accommodate multiple bets
        console.log(`🎮 Game: ${new Date(gameDate).toISOString()}`);
   
        // Step 1: Place the bet
        console.log("\n=== PLACING BETS ===");
        
        // const betResult = await betAccountAOnSPOPO(gameDate, accountProvider);

        // if (betResult.success) {
        //     console.log("✅ Bet placed!");
        //     console.log(`🎫 Tokens: ${betResult.data.betTokensMinted}`);
        // } else {
        //     console.log("❌ Bet failed!");
        //     console.log(`Error: ${betResult.error.message}`);
        //     // process.exit(1);
        //     throw new Error("Bet failed");
        // }

        // Wait a block for bet confirmation
        accountProvider.awaitBlock(1);
        
        // Step 1.5: Account B places bet on Away Win - SKIPPED FOR ROUNDING TEST
        console.log("\n=== ACCOUNT B BET (SKIPPED) ===");
        console.log("⏭️ Skipping Account B BEAD bet to focus on rounding fix testing");
        
        const betResultB = await betAccountBOnSPOPO(gameDate, accountProvider);
        
        if (betResultB.success) {
            console.log("✅ Account B bet placed successfully!");
            console.log(`📊 TX: ${betResultB.data.txHash}`);
            console.log(`🎫 Tokens: ${betResultB.data.betTokensMinted}`);
        } else {
            console.log("❌ Account B bet failed!");
            console.log(`Error: ${betResultB.error.message}`);
            process.exit(1);
        }

        // Wait a block for Account B bet confirmation
         accountProvider.awaitBlock(1);
        
        
        // Step 1.7: Account C places bet on Home Win
        console.log("\n=== ACCOUNT C BET ===");
        
        // Create provider for Account C using the shared emulator
     
        const betResultC = await betAccountCOnSPOPO(gameDate, accountProvider);

        if (betResultC.success) {
            console.log("✅ Account C bet placed successfully!");
            console.log(`📊 TX: ${betResultC.data.txHash}`);
            console.log(`🎫 Tokens: ${betResultC.data.betTokensMinted}`);
        } else {
            console.log("❌ Account C bet failed!");
            console.log(`Error: ${betResultC.error.message}`);
            // process.exit(1);
            throw new Error("Account C bet failed");
        }

        // Wait a block for Account C bet confirmation
        accountProvider.awaitBlock(1);
        
        // Step 1.8: Account D places bet on Tie (for testing purposes)
        console.log("\n=== ACCOUNT D BET ===");
        
        // Create provider for Account D using the shared emulator
     
        const betResultD = await betAccountDOnSPOPO(gameDate, accountProvider);

        if (betResultD.success) {
            console.log("✅ Account D bet placed successfully!");
            console.log(`📊 TX: ${betResultD.data.txHash}`);
            console.log(`🎫 Tokens: ${betResultD.data.betTokensMinted}`);
        } else {
            console.log("❌ Account D bet failed!");
            console.log(`Error: ${betResultD.error.message}`);
            // process.exit(1);
            throw new Error("Account D bet failed");
        }

        // Wait a block for Account D bet confirmation
        accountProvider.awaitBlock(1);
        
        // Step 1.9: Account E places bet on Home Win
        console.log("\n=== ACCOUNT E BET ===");
        
        // Create provider for Account E using the shared emulator
     
        const betResultE = await betAccountEOnSPOPO(gameDate, accountProvider);

        if (betResultE.success) {
            console.log("✅ Account E bet placed successfully!");
            console.log(`📊 TX: ${betResultE.data.txHash}`);
            console.log(`🎫 Tokens: ${betResultE.data.betTokensMinted}`);
        } else {
            console.log("❌ Account E bet failed!");
            console.log(`Error: ${betResultE.error.message}`);
            // process.exit(1);
            throw new Error("Account E bet failed");
        }

        // Wait a block for Account E bet confirmation
        accountProvider.awaitBlock(1);
        
        // Step 2: Set the game result (Oracle declares Home Win)
        console.log("\n=== SETTING ORACLE RESULT ===");
        const oracleResult = await setGameResultHomeWin(gameDate, accountProvider);

        if (oracleResult.success) {
            console.log("✅ Oracle result set!");
            console.log(`🏆 Result: ${oracleResult.data.gameInfo.resultDescription}`);
            console.log(`💰 Prize Pool: ${oracleResult.data.economics.prizePoolAda.toFixed(2)} ADA`);
        } else {
            console.log("❌ Oracle failed!");
            console.log(`Error: ${oracleResult.error.message}`);
            // process.exit(1);
            throw new Error("Oracle failed");
        }

        // Wait a block for oracle confirmation
        accountProvider.awaitBlock(1);

        // Step 2.5: Treasury sends additional 2 ADA to pot for liquidity
        console.log("\n=== TREASURY LIQUIDITY INJECTION ===");
        
        // Switch to treasury wallet
        accountProvider.selectWallet(ACCOUNTS.treasury.seedPhrase);
        
        // Get the pot address (we need to recreate it)
        const liquidityContractParams = [BigInt(1001), fromText("_SPO-PO"), BigInt(gameDate)];
        
        const liquidityPotScript = {
            type: "PlutusV3" as const,
            script: applyParamsToScript(betContract.cborHex, liquidityContractParams),
        };
        
        const liquidityNetwork = lucid.config().network ?? "Preview";
        const liquidityPotAddress = validatorToAddress(liquidityNetwork, liquidityPotScript);
        
        console.log("💰 Treasury sending 2 ADA to pot for additional liquidity...");
        
        try {
            const liquidityTx = accountProvider
                .newTx()
                .pay.ToAddress(liquidityPotAddress, { lovelace: 2_000_000n }); // 2 ADA
            
            const liquidityTxHash = await accountProvider.completeSignAndSubmit(liquidityTx);
            console.log(`✅ Treasury liquidity injection successful!`);
            console.log(`📋 TX: ${liquidityTxHash}`);
            console.log(`💰 Added: 2 ADA to betting pot`);
            
            // Wait a block for treasury injection confirmation
            accountProvider.awaitBlock(1);
        } catch (error) {
            console.log(`⚠️ Treasury liquidity injection failed: ${error}`);
            console.log("Continuing with existing pot liquidity...");
        }

        // Advance emulator time to after the game date
        console.log("⏰ Advancing time past game date...");
        const timeNow = accountProvider.now();
        const advanceToTime = gameDate + 10000; // Advance to 10 seconds after game time
        
        // Advance emulator time to well past the game date
        accountProvider.awaitSlot(Math.floor((advanceToTime - timeNow) / 1000)); // Convert ms to seconds

        // Step 3: Redeem the winning bet (Account A claims winnings)
        console.log("\n=== ACCOUNT A REDEMPTION ===");
        


        
        // Integer division as validator might do it
    
        // Let's also check what's in the betting pot before redemption
        console.log("\n🏦 Checking pot contents:");
        
        // Switch to treasury to check pot UTXOs
    
        // Get the pot address (we need to recreate it)
        const contractParams = [BigInt(1001), fromText("_SPO-PO"), BigInt(gameDate)];
        
        const potScript = {
            type: "PlutusV3" as const,
            script: applyParamsToScript(betContract.cborHex, contractParams),
        };
        
        const network = lucid.config().network ?? "Preview";
        const potAddress = validatorToAddress(network, potScript);
        console.log(`   � Pot address: ${potAddress}`);
        
        const potUtxos = await lucid.utxosAt(potAddress);
        console.log(`   📦 Pot has ${potUtxos.length} UTXOs`);
        
        let totalPotAda = 0;
        potUtxos.forEach((utxo) => {
            const ada = Number(utxo.assets.lovelace || 0n) / 1_000_000;
            totalPotAda += ada;
        });
        
        console.log(`   💰 Total pot: ${totalPotAda.toFixed(6)} ADA (${potUtxos.length} UTXOs)`);
        
      
        const redeemResult = await redeemWinningBet(gameDate, accountProvider);

        if (redeemResult.success) {
            console.log("✅ Account A redeemed successfully!");
            console.log(`💰 Won: ${redeemResult.data.adaWon.toFixed(6)} ADA`);
            console.log(`🔥 Burned: ${redeemResult.data.betTokensBurned} tokens`);
        } else {
            console.log("❌ Account A redemption failed!");
            console.log(`💥 Error: ${redeemResult.error.message}`);
        }

        // Advance slots to ensure Account A's transaction is processed
        console.log("\n⏰ Advancing slots for UTXO state update...");
        accountProvider.awaitSlot(accountProvider.getSlot() + 5); // Advance 5 slots for better synchronization
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        if (redeemResult.success) {
            console.log("✅ Bet redeemed successfully!");
            console.log(`� TX: ${redeemResult.data.txHash}`);
            console.log(`🎫 Bet Tokens Burned: ${redeemResult.data.betTokensBurned}`);
            console.log(`💰 ADA Won: ${redeemResult.data.adaWon.toFixed(6)} ADA`);
            console.log(`📈 Payout Multiplier: ${redeemResult.data.payoutMultiplier.toFixed(2)}x`);
            console.log(`🏆 Game: ${redeemResult.data.gameInfo.gameName} | Score: ${redeemResult.data.gameInfo.finalScore}`);
            
            // Enhanced logging for transaction details
            if (redeemResult.data.utxoSelection) {
                console.log(`\n📊 Transaction Details:`);
                console.log(`   🎯 Target Amount: ${(redeemResult.data.utxoSelection.targetAmount / 1_000_000).toFixed(6)} ADA`);
                console.log(`   📦 UTXOs Selected: ${redeemResult.data.utxoSelection.selectedUtxos}`);
                console.log(`   💸 Total Input: ${(redeemResult.data.utxoSelection.totalInput / 1_000_000).toFixed(6)} ADA`);
                console.log(`   💰 Payout Amount: ${(redeemResult.data.utxoSelection.payoutAmount / 1_000_000).toFixed(6)} ADA`);
                console.log(`   🔄 Change Amount: ${(redeemResult.data.utxoSelection.changeAmount / 1_000_000).toFixed(6)} ADA`);
            }
        } else {
            console.log("❌ Redemption failed!");
            console.log(`💥 Error Type: ${redeemResult.error.code}`);
            console.log(`📝 Error Message: ${redeemResult.error.message}`);
            
            // Enhanced error logging - parse validator traces if available
            if (redeemResult.error.message.includes("Trace")) {
                console.log(`\n🔍 Validator Trace Analysis:`);
                const message = redeemResult.error.message;
                
                // Extract key trace information
                if (message.includes("timingTest ? False")) {
                    console.log(`   ⏰ TIMING ISSUE: Transaction submitted before game date`);
                    console.log(`   💡 Solution: Wait until after game date to redeem`);
                }
                if (message.includes("Game ID:")) {
                    const gameIdMatch = message.match(/Game ID: Trace (\d+)/);
                    if (gameIdMatch) console.log(`   🎲 Game ID: ${gameIdMatch[1]}`);
                }
                if (message.includes("Winner:")) {
                    const winnerMatch = message.match(/Winner: Trace (\d+)/);
                    if (winnerMatch) console.log(`   🏆 Winner: ${winnerMatch[1]}`);
                }
                if (message.includes("Total ADA:")) {
                    const adaMatch = message.match(/Total ADA: Trace (\d+)/);
                    if (adaMatch) console.log(`   💰 Total ADA: ${(parseInt(adaMatch[1]) / 1_000_000).toFixed(6)} ADA`);
                }
                if (message.includes("Bet quantity being burned:")) {
                    const burnMatch = message.match(/Bet quantity being burned: Trace (-?\d+)/);
                    if (burnMatch) console.log(`   🔥 Burning: ${burnMatch[1]} bet tokens`);
                }
                if (message.includes("Calculated payout:")) {
                    const payoutMatch = message.match(/Calculated payout: Trace (\d+)/);
                    if (payoutMatch) console.log(`   💵 Calculated Payout: ${(parseInt(payoutMatch[1]) / 1_000_000).toFixed(6)} ADA`);
                }
            }
        }

        console.log("\n=== ACCOUNT C REDEMPTION ===");

        const redeemResultC = await redeemWinningBetAccountC(gameDate, accountProvider);

        if (redeemResultC.success) {
            console.log("✅ Account C redeemed successfully!");
            console.log(`💰 Won: ${redeemResultC.data.adaWon.toFixed(6)} ADA`);
            console.log(`� Burned: ${redeemResultC.data.betTokensBurned} tokens`);
        } else {
            console.log("❌ Account C redemption failed!");
            console.log(`💥 Error: ${redeemResultC.error.message}`);
        }

        // Advance slots to ensure Account C's transaction is processed
        console.log("\n⏰ Advancing slots for UTXO state update after Account C...");
        accountProvider.awaitSlot(accountProvider.getSlot() + 5); // Advance 5 slots for better synchronization
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

        console.log("\n=== ACCOUNT E REDEMPTION ===");

        const redeemResultE = await redeemWinningBetAccountE(gameDate, accountProvider);

        if (redeemResultE.success) {
            console.log("✅ Account E redeemed successfully!");
            console.log(`💰 Won: ${redeemResultE.data.adaWon.toFixed(6)} ADA`);
            console.log(`🔥 Burned: ${redeemResultE.data.betTokensBurned} tokens`);
        } else {
            console.log("❌ Account E redemption failed!");
            console.log(`💥 Error: ${redeemResultE.error.message}`);
        }

        // Advance slots to ensure Account E's transaction is processed
        console.log("\n⏰ Advancing slots for UTXO state update after Account E...");
        accountProvider.awaitSlot(accountProvider.getSlot() + 5); // Advance 5 slots for better synchronization
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

        // Final pot analysis
        console.log("\n=== FINAL POT ANALYSIS ===");
        
        // Get the pot address using the same contract params
        const finalContractParams = [BigInt(1001), fromText("_SPO-PO"), BigInt(gameDate)];
        
        const finalPotScript = {
            type: "PlutusV3" as const,
            script: applyParamsToScript(betContract.cborHex, finalContractParams),
        };
        
        const finalNetwork = lucid.config().network ?? "Preview";
        const finalPotAddress = validatorToAddress(finalNetwork, finalPotScript);
        
        console.log(`🏦 Final Pot Analysis:`);
        console.log(`   📍 Pot address: ${finalPotAddress}`);
        
        const finalPotUtxos = await lucid.utxosAt(finalPotAddress);
        console.log(`   📦 Remaining UTXOs: ${finalPotUtxos.length}`);
        
        let finalTotalPotAda = 0;
        let oracleUtxoCount = 0;
        let regularUtxoCount = 0;
        
        finalPotUtxos.forEach((utxo, index) => {
            const ada = Number(utxo.assets.lovelace || 0n) / 1_000_000;
            finalTotalPotAda += ada;
            
            // Check if this is the oracle UTXO (has oracle tokens)
            const hasOracleTokens = utxo.assets && Object.keys(utxo.assets).some(key => 
                key !== 'lovelace' && key.includes('76ad8c02') // Oracle policy ID
            );
            
            const hasDatum = !!utxo.datum;
            
            if (hasOracleTokens) {
                oracleUtxoCount++;
                console.log(`   📋 UTXO ${index + 1}: ${ada.toFixed(6)} ADA [ORACLE] ${hasDatum ? '+ datum' : ''}`);
                if (utxo.assets) {
                    Object.keys(utxo.assets).forEach(asset => {
                        if (asset !== 'lovelace') {
                            console.log(`      🏷️  ${asset.substring(0, 20)}... : ${utxo.assets![asset]}`);
                        }
                    });
                }
            } else {
                regularUtxoCount++;
                console.log(`   📋 UTXO ${index + 1}: ${ada.toFixed(6)} ADA ${hasDatum ? '[+datum]' : '[regular]'}`);
            }
        });
        
        console.log(`\n📊 Final Pot Summary:`);
        console.log(`   💰 Total remaining: ${finalTotalPotAda.toFixed(6)} ADA`);
        console.log(`   🔮 Oracle UTXOs: ${oracleUtxoCount}`);
        console.log(`   📦 Regular UTXOs: ${regularUtxoCount}`);
        console.log(`   🏆 Total distributed to winners: ${(16.571428 + 19.885714 + 21.542857).toFixed(6)} ADA`);
        console.log(`   💼 Treasury injection: 2.000000 ADA`);
        console.log(`   📈 Oracle contribution: 2.000000 ADA`);
        
        const expectedRemaining = 62 - (16.571428 + 19.885714 + 21.542857);
        console.log(`   🧮 Expected remaining: ${expectedRemaining.toFixed(6)} ADA`);
        console.log(`   ✅ Balance verification: ${Math.abs(finalTotalPotAda - expectedRemaining) < 0.000001 ? 'CORRECT' : 'MISMATCH'}`);

        // Treasury collection of remaining funds (including oracle UTXO)
        console.log("\n=== TREASURY COLLECTION ===");
        
        // Switch to treasury wallet
        accountProvider.selectWallet(ACCOUNTS.treasury.seedPhrase);
        
        // Use the new TreasuryCollection function from oracle module
        const treasuryResult = await TreasuryCollection({
            potAddress: finalPotAddress,
            potScript: finalPotScript,
            treasuryAddress: ACCOUNTS.treasury.address,
            provider: accountProvider,
            oracleCborHex: oracleContract.cborHex,
            oraclePolicyId: "76ad8c02" // Oracle policy ID
        });
        
        if (treasuryResult.success) {
            console.log(`✨ Treasury collection completed successfully!`);
            console.log(`💰 Total collected: ${treasuryResult.totalCollected} ADA`);
            console.log(`🔥 Oracle tokens burned: ${treasuryResult.oracleTokensBurned}`);
            console.log(`📦 Final pot state: ${treasuryResult.finalPotState.isEmpty ? 'EMPTY' : 'HAS_UTXOS'}`);
        } else {
            console.log(`❌ Treasury collection failed: ${treasuryResult.error}`);
        }

        console.log("\n🎉 Complete betting lifecycle finished!");
        
    } catch (error) {
        console.error("💥 Test error:", error);
    }
}

// Test is now using the TreasuryCollection function from oracle module
