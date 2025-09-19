/**
 * @fileoverview Lucid-based implementation of the blockchain provider abstraction
 *
 * This module provides concrete implementations of the IBlockchainProvider interface
 * using LucidEvolution as the underlying blockchain interaction library. It supports
 * both real network environments (via Blockfrost) and emulated environments for testing.
 *
 * Key Features:
 * - Network abstraction (Mainnet, Preprod, Preview, Custom/Emulator)
 * - Wallet management (seed phrase, private key, browser wallets)
 * - Transaction building and submission
 * - UTxO querying and management
 * - Time/slot progression (with emulator support)
 * - Browser wallet integration (Nami, Eternl, Flint, etc.)
 *
 * @author BEAD Protocol Team
 * @version 1.0.0
 */

import {
  Address,
  Network as LucidNetwork,
  Unit,
  UTxO,
  TxBuilder,
  LucidEvolution,
  Lucid,
  Blockfrost,
  Emulator,
  EmulatorAccount,
} from "@evolution-sdk/lucid";
import {
  IBlockchainProvider,
  IBlockchainProviderFactory,
} from "./IBlockchainProvider";
import {
  UserWallet,
  ChainProviderConf,
  Network as NetworkType,
} from "../utils/cstypes";

// Re-export the interfaces with proper type export for external consumption
export type { IBlockchainProvider, IBlockchainProviderFactory };

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES AND CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Browser wallet detection interface
 * Represents the window.cardano object in browser environments
 */
interface CardanoWindow {
  [walletName: string]: {
    enable(): Promise<any>;
    isEnabled(): Promise<boolean>;
    name: string;
    icon: string;
  };
}

/**
 * Slot calculation constants for real networks
 * These values are network-specific and used for slot time calculations
 */
const SLOT_CONFIG = {
  /** Slot length in milliseconds (1 second for Cardano) */
  SLOT_LENGTH: 1000,
  /** Approximate Byron era end time (used for slot calculations) */
  BYRON_END_TIME: 1596491091000, // July 4, 2020 Shelley launch
  /** Slots per epoch (approximate, varies by network) */
  SLOTS_PER_EPOCH: 432000,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// LUCID BLOCKCHAIN PROVIDER IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lucid-based implementation of the blockchain provider interface.
 *
 * This class wraps a LucidEvolution instance and provides a unified interface
 * for blockchain operations. It supports both real network operations (via Blockfrost)
 * and emulated operations (via in-memory emulator) for testing.
 *
 * @example
 * ```typescript
 * // For real networks
 * const provider = new Blockfrost(uri, key);
 * const lucid = await Lucid(provider, "Preview");
 * const blockchainProvider = new LucidBlockchainProvider(lucid);
 *
 * // For testing with emulator
 * const emulator = new Emulator(accounts);
 * const lucid = await Lucid(emulator, "Custom");
 * const blockchainProvider = new LucidBlockchainProvider(lucid, emulator);
 * ```
 */
export class LucidBlockchainProvider implements IBlockchainProvider {
  /** The underlying LucidEvolution instance */
  private readonly lucid: LucidEvolution;

  /** Optional emulator reference for testing scenarios */
  private readonly emulator?: Emulator;

  /**
   * Creates a new LucidBlockchainProvider instance
   *
   * @param lucid - The LucidEvolution instance to wrap
   * @param emulator - Optional emulator for testing scenarios
   */
  constructor(lucid: LucidEvolution, emulator?: Emulator) {
    this.lucid = lucid;
    this.emulator = emulator;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NETWORK & CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets the current network configuration
   *
   * @returns The network identifier (Preview, Preprod, Mainnet, or Custom)
   * @throws Never throws - defaults to "Preview" if network is undefined
   */
  getNetwork(): LucidNetwork {
    return (this.lucid.config().network ?? "Preview") as LucidNetwork;
  }

  /**
   * Gets the current wallet's address
   *
   * @returns Promise resolving to the wallet's Cardano address
   * @throws Error if no wallet is selected or wallet is inaccessible
   */
  async getWalletAddress(): Promise<Address> {
    try {
      return await this.lucid.wallet().address();
    } catch (error) {
      throw new Error(
        `Failed to get wallet address: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WALLET MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Selects a wallet using either seed phrase (Node.js) or wallet key (browser)
   *
   * This method intelligently detects the environment:
   * - In Node.js environments: treats input as seed phrase
   * - In browser environments: treats input as wallet identifier for browser wallet API
   *
   * @param input - Seed phrase (Node.js) or wallet identifier (browser: 'nami', 'eternl', etc.)
   * @throws Error if wallet selection fails or wallet is not available
   *
   * @example
   * ```typescript
   * // Node.js environment - seed phrase
   * await provider.selectWallet("abandon abandon abandon...");
   *
   * // Browser environment - wallet identifier
   * await provider.selectWallet("nami");
   * ```
   */
  async selectWallet(input: string): Promise<void> {
    try {
      // Environment detection: Node.js vs Browser
      if (typeof window === "undefined") {
        // Node.js environment - treat as seed phrase
        this.lucid.selectWallet.fromSeed(input);
        return;
      }

      // Browser environment - treat as wallet identifier
      const cardanoWindow = (window as any).cardano as
        | CardanoWindow
        | undefined;

      if (!cardanoWindow) {
        throw new Error("No Cardano wallets detected in browser environment");
      }

      // Validate wallet availability
      if (!cardanoWindow[input]) {
        const availableWallets = Object.keys(cardanoWindow);
        throw new Error(
          `Wallet '${input}' not found. Available wallets: ${
            availableWallets.length > 0 ? availableWallets.join(", ") : "none"
          }`
        );
      }

      // Enable and select the wallet
      const walletAPI = await cardanoWindow[input].enable();
      this.lucid.selectWallet.fromAPI(walletAPI);
    } catch (error) {
      throw new Error(
        `Wallet selection failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Gets a list of available browser wallets
   *
   * @returns Array of wallet identifiers that can be used with selectWallet()
   * @example ['nami', 'eternl', 'flint', 'yoroi']
   */
  getAvailableWallets(): string[] {
    // Environment check: only meaningful in browser
    if (typeof window === "undefined") {
      return [];
    }

    const cardanoWindow = (window as any).cardano as CardanoWindow | undefined;
    return cardanoWindow ? Object.keys(cardanoWindow) : [];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTXO OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Queries UTxOs at a specific address
   *
   * @param address - The Cardano address to query
   * @returns Promise resolving to array of UTxOs at the address
   * @throws Error if address is invalid or query fails
   */
  async getUtxosAt(address: Address): Promise<UTxO[]> {
    try {
      return await this.lucid.utxosAt(address);
    } catch (error) {
      throw new Error(
        `Failed to get UTxOs at address ${address}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Queries UTxOs at a specific address that contain a specific native token
   *
   * @param address - The Cardano address to query
   * @param unit - The asset unit (policy ID + asset name) to filter by
   * @returns Promise resolving to array of UTxOs containing the specified asset
   * @throws Error if address is invalid, unit is malformed, or query fails
   */
  async getUtxosAtWithUnit(address: Address, unit: Unit): Promise<UTxO[]> {
    try {
      return await this.lucid.utxosAtWithUnit(address, unit);
    } catch (error) {
      throw new Error(
        `Failed to get UTxOs with unit ${unit} at address ${address}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Gets all UTxOs in the current wallet
   *
   * @returns Promise resolving to array of wallet UTxOs
   * @throws Error if no wallet is selected or query fails
   */
  async getWalletUtxos(): Promise<UTxO[]> {
    try {
      return await this.lucid.wallet().getUtxos();
    } catch (error) {
      throw new Error(
        `Failed to get wallet UTxOs: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSACTION BUILDING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Creates a new transaction builder
   *
   * @returns A new TxBuilder instance for constructing transactions
   */
  newTx(): TxBuilder {
    return this.lucid.newTx();
  }

  /**
   * Completes, signs, and submits a transaction
   *
   * This method handles the full transaction lifecycle:
   * 1. Completes the transaction (balancing inputs/outputs, calculating fees)
   * 2. Signs with the currently selected wallet
   * 3. Submits to the network
   *
   * @param txBuilder - The transaction builder to process
   * @returns Promise resolving to the transaction hash
   * @throws Error if transaction completion, signing, or submission fails
   */
  async completeSignAndSubmit(txBuilder: TxBuilder): Promise<string> {
    try {
      const completedTx = await txBuilder.complete();
      const signedTx = await completedTx.sign.withWallet().complete();
      return await signedTx.submit();
    } catch (error) {
      throw new Error(
        `Transaction submission failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TIME & SLOT OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets the current system time
   *
   * @returns Current timestamp in milliseconds
   * @deprecated Use now() instead for blockchain-aware time
   */
  getCurrentTime(): number {
    return Date.now();
  }

  /**
   * Gets the current blockchain time
   *
   * For emulator environments, this returns the emulator's controlled time.
   * For real networks, this returns the current system time.
   *
   * @returns Current blockchain time in milliseconds
   */
  now(): number {
    return this.emulator?.now() ?? Date.now();
  }

  /**
   * Gets the current slot number
   *
   * For emulator environments, this returns the emulator's current slot.
   * For real networks, this calculates an approximate slot based on current time.
   *
   * @returns Current slot number
   * @note Real network slot calculation is approximate and should not be used for critical operations
   */
  getSlot(): number {
    if (this.emulator) {
      return this.emulator.slot;
    }

    // Approximate slot calculation for real networks
    // Note: This is simplified and may not be accurate for all networks
    const currentTime = Date.now();
    return Math.floor(
      (currentTime - SLOT_CONFIG.BYRON_END_TIME) / SLOT_CONFIG.SLOT_LENGTH
    );
  }

  /**
   * Waits for a specified number of blocks to be produced
   *
   * For emulator environments, this actively waits for block production.
   * For real networks, this is a no-op since block production cannot be controlled.
   *
   * @param blocks - Number of blocks to wait for
   * @note In real network scenarios, use transaction confirmation APIs instead
   */
  awaitBlock(blocks: number): void {
    if (this.emulator) {
      this.emulator.awaitBlock(blocks);
    }
    // Real networks: Block production is not controllable
    // In production, implement proper confirmation waiting strategies
  }

  /**
   * Waits for a specified number of slots to pass
   *
   * For emulator environments, this actively advances the slot counter.
   * For real networks, this is a no-op since slot progression cannot be controlled.
   *
   * @param slots - Number of slots to wait for
   * @note In real network scenarios, use time-based waiting or confirmation APIs instead
   */
  awaitSlot(slots: number): void {
    if (this.emulator) {
      this.emulator.awaitSlot(slots);
    }
    // Real networks: Slot progression is not controllable
    // In production, implement proper time-based waiting strategies
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER FACTORY IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Factory for creating Lucid-based blockchain providers for real networks.
 *
 * This factory handles the initialization of LucidEvolution with Blockfrost
 * providers and wallet configuration for production environments.
 *
 * @example
 * ```typescript
 * const wallet: UserWallet = {
 *   key: "your-wallet-mnemonic-or-identifier",
 *   address: "addr1..."
 * };
 *
 * const chainConfig: ChainProviderConf = {
 *   network: Network.PREVIEW,
 *   uri: "https://cardano-preview.blockfrost.io/api/v0",
 *   key: "your-blockfrost-key",
 *   // ... other config
 * };
 *
 * const factory = new LucidProviderFactory(wallet, chainConfig);
 * const provider = await factory.createProvider();
 * ```
 */
export class LucidProviderFactory implements IBlockchainProviderFactory {
  /** User wallet configuration */
  private readonly wallet: UserWallet;

  /** Chain and network configuration */
  private readonly chainConfig: ChainProviderConf;

  /**
   * Creates a new LucidProviderFactory instance
   *
   * @param wallet - Wallet configuration containing private key and address
   * @param chainConfig - Chain configuration including network, Blockfrost settings, etc.
   */
  constructor(wallet: UserWallet, chainConfig: ChainProviderConf) {
    this.wallet = wallet;
    this.chainConfig = chainConfig;
  }

  /**
   * Creates a configured blockchain provider for real networks
   *
   * This method:
   * 1. Initializes a Blockfrost provider with the configured endpoint
   * 2. Sets up LucidEvolution with the appropriate network
   * 3. Loads the wallet using the provided private key
   * 4. Returns a ready-to-use blockchain provider
   *
   * @returns Promise resolving to a configured IBlockchainProvider
   * @throws Error if Blockfrost initialization fails, network is invalid, or wallet loading fails
   */
  async createProvider(): Promise<IBlockchainProvider> {
    try {
      // Validate configuration
      this.validateConfiguration();

      // Create Blockfrost provider with validated configuration
      const blockfrostProvider = new Blockfrost(
        this.chainConfig.uri,
        this.chainConfig.key
      );

      // Convert our Network enum to Lucid's Network type
      const lucidNetwork = this.mapNetworkType(this.chainConfig.network);

      // Initialize Lucid with network configuration
      const lucid = await Lucid(blockfrostProvider, lucidNetwork);

      // Load wallet from private key
      const browserWallet = await window.cardano[this.wallet.key].enable();

      // Select wallet in Lucid
      lucid.selectWallet.fromAPI(browserWallet);

      // Create and return the provider (no emulator for real networks)
      return new LucidBlockchainProvider(lucid);
    } catch (error) {
      throw new Error(
        `Failed to create Lucid provider: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Validates the factory configuration
   *
   * @throws Error if configuration is invalid
   * @private
   */
  private validateConfiguration(): void {
    if (!this.wallet.key) {
      throw new Error("Wallet private key is required");
    }

    if (!this.chainConfig.uri) {
      throw new Error("Blockfrost URI is required");
    }

    if (!this.chainConfig.key) {
      throw new Error("Blockfrost API key is required");
    }

    const validNetworks = Object.values(NetworkType).map((n) =>
      n.toLowerCase()
    );
    const configNetwork = (this.chainConfig.network ?? "").toLowerCase();
    if (!validNetworks.includes(configNetwork)) {
      throw new Error(`Invalid network type: ${this.chainConfig.network}`);
    }
  }

  /**
   * Maps our internal Network enum to Lucid's Network type
   *
   * @param network - Our internal network enum value
   * @returns Corresponding Lucid network identifier
   * @throws Error if network type is not supported
   * @private
   */
  private mapNetworkType(network: NetworkType): LucidNetwork {
    switch (network) {
      case NetworkType.MAINNET:
        return "Mainnet";
      case NetworkType.PREPROD:
        return "Preprod";
      case NetworkType.PREVIEW:
        return "Preview";
      default:
        throw new Error(`Unsupported network type: ${network}`);
    }
  }
}

/**
 * Factory for creating emulator-based blockchain providers for testing.
 *
 * This factory creates providers using LucidEvolution's in-memory emulator,
 * which is ideal for unit testing, integration testing, and development scenarios
 * where you need deterministic blockchain behavior.
 *
 * Features:
 * - Deterministic transaction execution
 * - Controllable time and slot progression
 * - No external network dependencies
 * - Fast execution for testing
 *
 * @example
 * ```typescript
 * const accounts = [
 *   {
 *     address: "addr_test1...",
 *     seedPhrase: "abandon abandon...",
 *     privateKey: "ed25519_sk1...",
 *     assets: { lovelace: 100_000_000_000n }
 *   }
 * ];
 *
 * const provider = await EmulatorProviderFactory.createProvider(
 *   accounts,
 *   accounts[0],
 *   Network.PREVIEW
 * );
 * ```
 */
export class EmulatorProviderFactory {
  /**
   * Creates a configured blockchain provider using the emulator
   *
   * This static method:
   * 1. Initializes an emulator with the provided accounts
   * 2. Sets up LucidEvolution with "Custom" network (emulator mode)
   * 3. Selects the specified account using its seed phrase
   * 4. Returns a provider with emulator capabilities (time/slot control)
   *
   * @param accounts - Array of emulator accounts to initialize
   * @param selectedAccount - The account to select as the active wallet
   * @param network - Network type (used for configuration, defaults to PREVIEW)
   * @returns Promise resolving to a configured IBlockchainProvider with emulator support
   * @throws Error if emulator initialization fails or account selection fails
   *
   * @example
   * ```typescript
   * // Create accounts for testing
   * const accounts: EmulatorAccount[] = [
   *   {
   *     address: "addr_test1...",
   *     seedPhrase: "abandon abandon abandon...",
   *     privateKey: "ed25519_sk1...",
   *     assets: { lovelace: 100_000_000_000n }
   *   }
   * ];
   *
   * // Create provider
   * const provider = await EmulatorProviderFactory.createProvider(
   *   accounts,
   *   accounts[0]
   * );
   *
   * // Use provider for testing
   * await provider.awaitBlock(1); // Advance one block
   * const utxos = await provider.getWalletUtxos();
   * ```
   */
  static async createProvider(
    accounts: EmulatorAccount[],
    selectedAccount: EmulatorAccount,
    network: NetworkType = NetworkType.PREVIEW
  ): Promise<IBlockchainProvider> {
    try {
      // Validate inputs
      if (!accounts.length) {
        throw new Error("At least one emulator account is required");
      }

      if (!selectedAccount) {
        throw new Error("Selected account is required");
      }

      if (!accounts.includes(selectedAccount)) {
        throw new Error(
          "Selected account must be included in the accounts array"
        );
      }

      // Initialize emulator with provided accounts
      const emulator = new Emulator(accounts);

      // Create Lucid instance with emulator (uses "Custom" network)
      const lucid = await Lucid(emulator, "Custom");

      // Select wallet using seed phrase (consistent with existing test patterns)
      if (!selectedAccount.seedPhrase) {
        throw new Error(
          "Selected account must have a seed phrase for wallet selection"
        );
      }

      lucid.selectWallet.fromSeed(selectedAccount.seedPhrase);

      // Return provider with emulator reference for time/slot control
      return new LucidBlockchainProvider(lucid, emulator);
    } catch (error) {
      throw new Error(
        `Failed to create emulator provider: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Creates a simple emulator provider with default test accounts
   *
   * This convenience method creates a basic testing setup with pre-configured
   * accounts that have sufficient ADA for testing transactions.
   *
   * @param accountCount - Number of test accounts to create (default: 3)
   * @param adaPerAccount - ADA amount per account in lovelace (default: 100 ADA)
   * @returns Promise resolving to a configured provider with the first account selected
   * @throws Error if account creation or provider initialization fails
   *
   * @example
   * ```typescript
   * // Quick setup for testing
   * const provider = await EmulatorProviderFactory.createDefaultProvider();
   *
   * // Provider is ready to use with the first account selected
   * const address = await provider.getWalletAddress();
   * const utxos = await provider.getWalletUtxos();
   * ```
   */
  static async createDefaultProvider(
    accountCount: number = 3,
    adaPerAccount: bigint = 100_000_000_000n // 100 ADA
  ): Promise<IBlockchainProvider> {
    try {
      if (accountCount < 1) {
        throw new Error("Account count must be at least 1");
      }

      if (adaPerAccount <= 0n) {
        throw new Error("ADA per account must be positive");
      }

      // Generate default test accounts
      const accounts: EmulatorAccount[] = [];
      const basePhrase =
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon";

      for (let i = 0; i < accountCount; i++) {
        accounts.push({
          address: `addr_test1_account_${i}`,
          seedPhrase: `${basePhrase} ${String(i).padStart(2, "0")}`,
          privateKey: `ed25519_sk_test_${i}`,
          assets: { lovelace: adaPerAccount },
        });
      }

      return await this.createProvider(
        accounts,
        accounts[0],
        NetworkType.PREVIEW
      );
    } catch (error) {
      throw new Error(
        `Failed to create default emulator provider: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
