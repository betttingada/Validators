import { Lucid, generateSeedPhrase, Assets, LucidEvolution, Emulator, EmulatorAccount, generatePrivateKey, Required, Address, MintingPolicy, generateEmulatorAccount, validatorToAddress, PolicyId, mintingPolicyToId, applyDoubleCborEncoding, Unit, fromText, getAddressDetails } from "@lucid-evolution/lucid";
import beadContract from "./compiled/bead.signed.plutus.json" with { type: "json" };;
import * as bead from "./bead"
import *  as bet from "./bet";
import * as oracle from "./oracle";
import * as BetRedeemer from "./betredeem";

// deno run -A --unstable-sloppy-imports --inspect-brk index.ts
// deno run -A --unstable-sloppy-imports  index.ts
const addrTreasury: Address = "addr_test1qr25xnnj0c44wc0xr69wunaal63ahx6kqz5anz0t0dl6xa7k0s7kanz0a9wey098yds788qs7uhxgcqtc96h9x2vchcqaf7r46";

export const treasury = "section deposit express expire tornado urban among sunset meadow drift start great crane seek assist honey zoo mean gasp such castle recycle inmate foil";
export const accountA = generateEmulatorAccount({ lovelace: 12_001_000_000n });
export const accountB = generateEmulatorAccount({ lovelace: 12_002_000_000n });
export const accountC = generateEmulatorAccount({ lovelace: 12_003_000_000n });
export const accountD = generateEmulatorAccount({ lovelace: 12_004_000_000n });
export const accountE = generateEmulatorAccount({ lovelace: 12_005_000_000n });
export const accountF = generateEmulatorAccount({ lovelace: 12_006_000_000n });
export const accountG = generateEmulatorAccount({ lovelace: 12_007_000_000n });
// 
export const treasuryAccount: EmulatorAccount = {
    address: "addr_test1qr25xnnj0c44wc0xr69wunaal63ahx6kqz5anz0t0dl6xa7k0s7kanz0a9wey098yds788qs7uhxgcqtc96h9x2vchcqaf7r46",
    seedPhrase: treasury,
    assets: { lovelace: 100_000_000n },
    privateKey: ""
}

export const AccountsList: EmulatorAccount[] = [
    treasuryAccount, accountA, accountB, accountC, accountD, accountE, accountF, accountG
]
const emulator = new Emulator(AccountsList);
export async function startBetScenarioA() {
    console.clear();
    console.log("---------------------------start emulation------------------------------------------------");
    console.log("accountA", accountA.address);
    const lucid = await Lucid(emulator,"Custom");
    emulator.awaitBlock(1);
    await bead.BuyWithoutReferral(
        accountA.seedPhrase,
        accountA.address,
        treasuryAccount.address,
        1_000_000_000n,
        lucid
    )

    emulator.awaitBlock(1);
    await bead.BuyWithoutReferral(
        accountE.seedPhrase,
        accountE.address,
        treasuryAccount.address,
        600_000_000n,
        lucid
    )
    emulator.awaitBlock(1);
    console.log("--------------------------- B ------------------------------------------------");
    await bead.BuyWithReferral(
        accountB.seedPhrase,
        accountB.address,
        accountA.address,
        treasuryAccount.address,
        400_000_000n,
        lucid,
        accountD.address
    )

    emulator.awaitBlock(1);
    console.log("--------------------------- C ------------------------------------------------");
    await bead.BuyWithReferral(
        accountC.seedPhrase,
        accountC.address,
        accountA.address,
        treasuryAccount.address,
        200_000_000n,
        lucid,
        accountD.address
    )

    emulator.awaitBlock(1);

    emulator.log();

    console.log("---------------------------end emulation------------------------------------------------");
}


export async function TestBets() {
    console.clear();
    console.log("---------------------------start betting emulation------------------------------------------------");
    const lucid = await Lucid(emulator, "Custom");

    emulator.awaitBlock(1);
    await bead.BuyWithoutReferral(
        accountA.seedPhrase,
        accountA.address,
        treasuryAccount.address,
        1_000_000_000n,
        lucid
    )
    emulator.awaitBlock(1);
    await bead.BuyWithoutReferral(
        accountB.seedPhrase,
        accountB.address,
        treasuryAccount.address,
        200_000_000n,
        lucid
    );
    emulator.awaitBlock(1);
    await bead.BuyWithoutReferral(
        accountC.seedPhrase,
        accountC.address,
        treasuryAccount.address,
        400_000_000n,
        lucid
    );
    emulator.awaitBlock(1);
    const time = emulator.now() + 200000;
    console.log("---------------------------A------------------------------------------------");
    await bet.BetInGane(
        accountA.seedPhrase,
        accountA.address,
        99999,
        ":Porto - Sporting",
        time,
        0,
        110,
        50,
        lucid,
    )
    emulator.awaitBlock(1);
    console.log("---------------------------B------------------------------------------------");
    await bet.BetInGane(
        accountB.seedPhrase,
        accountB.address,
        99999,
        ":Porto - Sporting",
        time,
        0,
        154,
        20,
        lucid,
    )
    emulator.awaitBlock(1);
    console.log("---------------------------C------------------------------------------------");
    await bet.BetInGane(
        accountC.seedPhrase,
        accountC.address,
        99999,
        ":Porto - Sporting",
        time,
        1,
        10,
        0,
        lucid,
    )

    emulator.awaitBlock(1);
    console.log("---------------------------D------------------------------------------------");
    await bet.BetInGane(
        accountD.seedPhrase,
        accountD.address,
        99999,
        ":Porto - Sporting",
        time,
        1,
        3,
        0,
        lucid,
    )
    emulator.awaitBlock(1);
    console.log("---------------------------E------------------------------------------------");
    await bet.BetInGane(
        accountE.seedPhrase,
        accountE.address,
        99999,
        ":Porto - Sporting",
        time,
        2,
        10,
        0,
        lucid,
    )
    // emulator.awaitBlock(1);
    console.log("---------------------------f------------------------------------------------");
    await bet.BetInGane(
        accountF.seedPhrase,
        accountF.address,
        99999,
        ":Porto - Sporting",
        time,
        2,
        10,
        0,
        lucid,
    )
    emulator.awaitBlock(20);
    console.log("---------------------------O------------------------------------------------");
    await oracle.SetResultGame(treasuryAccount.seedPhrase,
        treasuryAccount.address,
        99999,
        ":Porto - Sporting",
        time,
        2,
        "Porto:0 - Sporting:2",
        lucid);

    emulator.awaitBlock(20);
   // emulator.log();
    console.log("---------------------------r c------------------------------------------------");
    await BetRedeemer.RedeemBet(
        accountE.seedPhrase,
        accountE.address,
        99999,
        ":Porto - Sporting",
        time,
        "Porto:0 - Sporting:2",
        lucid)
    emulator.awaitBlock(20);
    //emulator.log();
    console.log("--------------------------- r d ------------------------------------------------");
    await BetRedeemer.RedeemBet(
        accountF.seedPhrase,
        accountF.address,
        99999,
        ":Porto - Sporting",
        time,
        "Porto:0 - Sporting:2",
        lucid)
    emulator.awaitBlock(20);
   emulator.log();
}

await startBetScenarioA();
await TestBets();