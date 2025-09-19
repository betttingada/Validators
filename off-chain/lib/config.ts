import { EmulatorAccount, generateEmulatorAccount, Address } from "@evolution-sdk/lucid";

// Treasury configuration
export const TREASURY_ADDRESS: Address = "addr_test1qr25xnnj0c44wc0xr69wunaal63ahx6kqz5anz0t0dl6xa7k0s7kanz0a9wey098yds788qs7uhxgcqtc96h9x2vchcqaf7r46";
export const TREASURY_SEED = "section deposit express expire tornado urban among sunset meadow drift start great crane seek assist honey zoo mean gasp such castle recycle inmate foil";




// Account generation with descriptive names
export const ACCOUNTS = {
    treasury: {
        address: TREASURY_ADDRESS,
        seedPhrase: TREASURY_SEED,
        assets: { lovelace: 500_000_000n },
        privateKey: ""
    } as EmulatorAccount,

    accountA: generateEmulatorAccount({ 
        lovelace: 12_001_000_000n
    }),
    accountB: generateEmulatorAccount({ 
        lovelace: 12_002_000_000n
    }),
    accountC: generateEmulatorAccount({ 
        lovelace: 12_003_000_000n
    }),
    accountD: generateEmulatorAccount({ 
        lovelace: 12_004_000_000n
    }),
    accountE: generateEmulatorAccount({ 
        lovelace: 12_005_000_000n
    }),
    accountF: generateEmulatorAccount({ 
        lovelace: 12_006_000_000n
    }),
    accountG: generateEmulatorAccount({ 
        lovelace: 12_007_000_000n
    })
} as const;

// Account list for emulator
export const ACCOUNTS_LIST: EmulatorAccount[] = [
    ACCOUNTS.treasury,
    ACCOUNTS.accountA,
    ACCOUNTS.accountB,
    ACCOUNTS.accountC,
    ACCOUNTS.accountD,
    ACCOUNTS.accountE,
    ACCOUNTS.accountF,
    ACCOUNTS.accountG
];

// Purchase amounts in lovelace
export const PURCHASE_AMOUNTS = {
    HUGE: 2_000_000_000n,     // 2,000 ADA
    LARGE: 1_000_000_000n,    // 1,000 ADA
    EXTRA: 800_000_000n,      // 800 ADA
    MEDIUM: 600_000_000n,     // 600 ADA
    SMALL: 400_000_000n,      // 400 ADA
    TINY: 200_000_000n        // 200 ADA
} as const;
