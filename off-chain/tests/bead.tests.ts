/**
 * Formats and logs a BEAD transaction error with detailed explanation.
 */
export function formatBeadError(errorMessage: string) {
    console.log("\n===== BEAD TRANSACTION ERROR =====\n");
    // Attempt to pretty-print known trace sections
    const traceSections = [
        /Trace === BEAD VALIDATOR MINT ===[\s\S]*?(?=Trace ===|$)/g,
        /Trace === NO REFERRAL BRANCH ===[\s\S]*?(?=Trace ===|$)/g,
        /Trace === BEAD PAYMENT VALIDATION ===[\s\S]*?(?=Trace ===|$)/g,
        /Trace === BEAD CALCULATION ===[\s\S]*?(?=Trace ===|$)/g,
    ];
    let foundSection = false;
    for (const section of traceSections) {
        const match = errorMessage.match(section);
        if (match) {
            foundSection = true;
            console.log(match[0].replace(/Trace /g, "  ").replace(/===/g, "\n===").trim());
        }
    }
    if (!foundSection) {
        // Fallback: print the whole error
        console.log(errorMessage);
    }
    // Key failure explanation
    if (errorMessage.includes("validatePayedAndMintedBead")) {
        console.log("\n❗ The validator checked the relationship between minted BEAD and ADA paid to treasury, and the check failed.");
    }
    if (errorMessage.includes("Validator returned false")) {
        console.log("\n❗ The validator returned false, so the transaction did not meet the required conditions.");
    }
    console.log("\n==================================\n");
}
import { ACCOUNTS, ACCOUNTS_LIST, PURCHASE_AMOUNTS } from "../lib/config";
import { purchaseBead } from "../lib/bead";
import { InputBeadWithReferral, UserWallet, ChainProviderConf, Network } from "../utils/cstypes";
import beadContract from "../compiled/bead.signed.plutus.json" with { type: "json"};
import { IBlockchainProvider, EmulatorProviderFactory } from "../providers/LucidProvider";

// to run use : deno run -A --unstable-sloppy-imports ./tests/bead.tests.ts

// Helper function to create InputBeadWithReferral for purchaseBead
async function createBeadInputWithoutReferral(
    treasuryAddress: string,
    buyerAdaInvestmentLovelace: number, // Now always in lovelace
    provider: IBlockchainProvider,
    beadContractCorHex: string
): Promise<InputBeadWithReferral> {
    const wallet: UserWallet = {
        key: "", // Not needed for testing
        address: ""  // Will be set from provider
    };

    const lucidNetwork = await provider.getNetwork();
    // Convert Lucid Network to our Network enum
    const network = lucidNetwork === "Preview" ? Network.PREVIEW : 
                   lucidNetwork === "Preprod" ? Network.PREPROD :
                   lucidNetwork === "Mainnet" ? Network.MAINNET : 
                   Network.CUSTOM;
    
    const chainProviderConf: ChainProviderConf = {
        network: network,
        uri: "",
        key: "",
        beadCbor: beadContractCorHex,
        beadName: "BEAD PR",
        beadReferralName: "BEADR PR", 
        treasuryAddress: treasuryAddress
    };

    return {
        wallet,
        chainProviderConf,
        referralAddress: "", // Empty string indicates no referral
        treasuryAddress,
        buyerAdaInvestmentLovelace
    };
}

/**
 * Buy 200 ADA worth of Bead tokens using AccountA
 */
export async function buyBeadWithAccountA() {
    // Create provider for Account A
    const provider = await EmulatorProviderFactory.createProvider(
        ACCOUNTS_LIST,
        ACCOUNTS.accountA,
        Network.PREVIEW
    );
    
    // Buy 200 ADA worth of BEAD tokens
    const beadInput = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        Number(PURCHASE_AMOUNTS.TINY), // 200 ADA (200_000_000n lovelace)
        provider,
        beadContract.cborHex
    );
    return await purchaseBead(
        provider,
        beadInput
    );
}

/**
 * Buy 400 ADA worth of Bead tokens using AccountA
 */
export async function buy400BeadWithAccountA() {
    // Create provider for Account A
    const provider = await EmulatorProviderFactory.createProvider(
        ACCOUNTS_LIST,
        ACCOUNTS.accountA,
        Network.PREVIEW
    );
    
    // Buy 400 ADA worth of BEAD tokens
    const beadInput2 = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        Number(PURCHASE_AMOUNTS.SMALL), // 400 ADA (400_000_000n lovelace)
        provider,
        beadContract.cborHex
    );
    return await purchaseBead(
        provider,
        beadInput2
    );
}

/**
 * Buy 600 ADA worth of Bead tokens using AccountA
 */
export async function buy600BeadWithAccountA() {
    // Create provider for Account A
    const provider = await EmulatorProviderFactory.createProvider(
        ACCOUNTS_LIST,
        ACCOUNTS.accountA,
        Network.PREVIEW
    );
    
    // Buy 600 ADA worth of BEAD tokens
    const beadInput3 = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        Number(PURCHASE_AMOUNTS.MEDIUM), // 600 ADA (600_000_000n lovelace)
        provider,
        beadContract.cborHex
    );
    return await purchaseBead(
        provider,
        beadInput3
    );
}

/**
 * Buy 800 ADA worth of Bead tokens using AccountA
 */
export async function buy800BeadWithAccountA() {
    // Create provider for Account A
    const provider = await EmulatorProviderFactory.createProvider(
        ACCOUNTS_LIST,
        ACCOUNTS.accountA,
        Network.PREVIEW
    );
    
    // Buy 800 ADA worth of BEAD tokens
    const beadInput4 = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        Number(PURCHASE_AMOUNTS.EXTRA), // 800 ADA (800_000_000n lovelace)
        provider,
        beadContract.cborHex
    );
    return await purchaseBead(
        provider,
        beadInput4
    );
}

/**
 * Buy 1000 ADA worth of Bead tokens using AccountA
 */
export async function buy1000BeadWithAccountA() {
    // Create provider for Account A
    const provider = await EmulatorProviderFactory.createProvider(
        ACCOUNTS_LIST,
        ACCOUNTS.accountA,
        Network.PREVIEW
    );
    
    // Buy 1000 ADA worth of BEAD tokens
    const beadInput5 = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        Number(PURCHASE_AMOUNTS.LARGE), // 1000 ADA (1_000_000_000n lovelace)
        provider,
        beadContract.cborHex
    );
   var result=  await purchaseBead(
        provider,
        beadInput5
    );

    return result;
}

/**
 * Buy 2000 ADA worth of Bead tokens using AccountA
 */
export async function buy2000BeadWithAccountA() {
    // Create provider for Account A
    const provider = await EmulatorProviderFactory.createProvider(
        ACCOUNTS_LIST,
        ACCOUNTS.accountA,
        Network.PREVIEW
    );
    
    // Buy 2000 ADA worth of BEAD tokens
    const beadInput6 = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address,
        Number(PURCHASE_AMOUNTS.HUGE), // 2000 ADA (2_000_000_000n lovelace)
        provider,
        beadContract.cborHex
    );
    return await purchaseBead(
        provider,
        beadInput6
    );
}

// Run the function if this file is executed directly
if (import.meta.main) {
    try {
        // @ts-ignore - Deno runtime global
        const args = globalThis.Deno?.args || [];
        const amount = args[0] || "200";
        
        let result;
        let functionName;
        
        switch (amount) {
            case "400":
                console.log("🚀 Starting 400 ADA BEAD purchase with Account A...");
                functionName = "buy400BeadWithAccountA";
                result = await buy400BeadWithAccountA();
                break;
            case "600":
                console.log("🚀 Starting 600 ADA BEAD purchase with Account A...");
                functionName = "buy600BeadWithAccountA";
                result = await buy600BeadWithAccountA();
                break;
            case "800":
                console.log("🚀 Starting 800 ADA BEAD purchase with Account A...");
                functionName = "buy800BeadWithAccountA";
                result = await buy800BeadWithAccountA();
                break;
            case "1000":
                console.log("🚀 Starting 1000 ADA BEAD purchase with Account A...");
                functionName = "buy1000BeadWithAccountA";
                result = await buy1000BeadWithAccountA();
                break;
            case "2000":
                console.log("🚀 Starting 2000 ADA BEAD purchase with Account A...");
                functionName = "buy2000BeadWithAccountA";
                result = await buy2000BeadWithAccountA();
                break;
            case "notreasury":
                console.log("🚀 Starting BEAD purchase WITHOUT sending ADA to treasury...");
                functionName = "buyBeadWithoutTreasuryAda";
                result = await buyBeadWithoutTreasuryAda();
                break;
            case "200":
            default:
                console.log("🚀 Starting 200 ADA BEAD purchase with Account A...");
                functionName = "buyBeadWithAccountA";
                result = await buyBeadWithAccountA();
                break;
        }
        
        if (result.success) {
            console.log("✅ Purchase successful!");
            console.log(`📊 Transaction Hash: ${result.data.txHash}`);
            console.log(`🪙 BEAD Amount: ${result.data.beadAmount}`);
            console.log(`🎁 Referral Amount: ${result.data.referralAmount}`);
            console.log(`💰 ADA Spent: ${amount} ADA`);
        } else {
            console.log("❌ Purchase failed!");
            console.log(`🚨 Error: ${result.error.message}`);
        }
        
        console.log(`\n💡 Function called: ${functionName}()`);
        console.log("📋 Available amounts: 200, 400, 600, 800, 1000, 2000");
        console.log("🔧 Usage: deno run -A --unstable-sloppy-imports bead.tests.ts [amount]");
        
    } catch (error) {
        console.error("💥 Error running purchase:", error);
    }
}

/**
 * Attempt to buy BEAD tokens but do NOT send ADA to the treasury.
 * Should fail and print the error.
 */
export async function buyBeadWithoutTreasuryAda() {
    // Create provider for Account A
    const provider = await EmulatorProviderFactory.createProvider(
        ACCOUNTS_LIST,
        ACCOUNTS.accountA,
        Network.PREVIEW
    );

    // Create bead input with a fake treasury address (simulate ADA not sent to treasury)
    const beadInput = await createBeadInputWithoutReferral(
        ACCOUNTS.treasury.address, // Invalid/fake address
        Number(PURCHASE_AMOUNTS.TINY),
        provider,
        beadContract.cborHex
    );

    // Try to purchase and print error
    const result = await purchaseBead(provider, beadInput);
    if (!result.success) {
        console.log("❌ Purchase failed as expected!");
        formatBeadError(result.error.message);
    } else {
        console.log("⚠️ Unexpected success! This should have failed.");
    }
    return result;
}
