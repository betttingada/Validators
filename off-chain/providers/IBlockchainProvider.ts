import { 
    Address, 
    Assets, 
    Network, 
    PolicyId, 
    Redeemer, 
    Unit, 
    UTxO, 
    TxBuilder
} from '@evolution-sdk/lucid';

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCKCHAIN PROVIDER INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Abstraction interface for blockchain providers
 * This allows swapping between real Cardano network providers and emulators
 */
export interface IBlockchainProvider {


    
    // ═══════════════════════════════════════════════════════════════════════════
    // NETWORK & CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Get the current network configuration
     */
    getNetwork(): Network;
    
    /**
     * Get the current wallet address
     */
    getWalletAddress(): Promise<Address>;
    
    /**
     * Select a wallet using a seed phrase
     * This allows switching between different wallets/accounts
     */
    selectWallet(input: string): void;
    
    
    /**
     * Get list of available browser wallets
     * This is useful for dApp development to show users what wallets they can connect
     * @returns Array of available wallet keys, or empty array if not in browser
     */
    getAvailableWallets(): string[];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UTXO OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Get all UTXOs at a specific address
     */
    getUtxosAt(address: Address): Promise<UTxO[]>;
    
    /**
     * Get UTXOs at an address that contain a specific unit
     */
    getUtxosAtWithUnit(address: Address, unit: Unit): Promise<UTxO[]>;
    
    /**
     * Get UTXOs from the connected wallet
     */
    getWalletUtxos(): Promise<UTxO[]>;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // TRANSACTION BUILDING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Create a new transaction builder
     */
    newTx(): TxBuilder;
    
    /**
     * Complete, sign and submit a transaction
     * @param txBuilder - The transaction builder to complete and submit
     * @returns Promise<string> - The transaction hash
     */
    completeSignAndSubmit(txBuilder: TxBuilder): Promise<string>;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // VALIDATION & TIMING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Get the current time for validation purposes
     */
    getCurrentTime(): number;
    
    /**
     * Wait for a specified number of blocks (mainly for emulator testing)
     * For real networks, this may be a no-op or simulate time passage
     */
    awaitBlock(blocks: number): void;
    
    /**
     * Get the current blockchain time (equivalent to emulator.now())
     * For emulator: returns emulator time
     * For real networks: returns current system time
     */
    now(): number;
    
    /**
     * Get the current slot number (mainly for emulator testing)
     * For real networks, this may return a calculated slot or current time
     */
    getSlot(): number;
    
    /**
     * Wait for a specified number of slots (mainly for emulator testing)
     * For real networks, this may be a no-op or simulate time passage
     */
    awaitSlot(slots: number): void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER FACTORY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Factory for creating blockchain providers
 */
export interface IBlockchainProviderFactory {
    /**
     * Create a blockchain provider instance
     * This handles all the wallet loading and network configuration
     */
    createProvider(): Promise<IBlockchainProvider>;
}
