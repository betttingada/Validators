import { Address, applyDoubleCborEncoding, applyParamsToScript, Assets, Data, Emulator, fromText, LucidEvolution, MintingPolicy, mintingPolicyToId, PolicyId, Redeemer, SpendingValidator, Unit, validatorToAddress, Lucid, fromUnit, toText, UTxO } from '@lucid-evolution/lucid';
import betMintingContract from "./compiled/bet.signed.plutus.json" with { type: "json" };
import betPotContract from "./compiled/betpot.signed.plutus.json" with { type: "json" };
import oracleContract from "./compiled/oracle.signed.plutus.json" with { type: "json" };
import beadContract from "./compiled/bead.signed.plutus.json" with { type: "json" };
import * as t from "./types";
import * as u from "./utils";

const oracleMintScript: MintingPolicy = {
    script: applyDoubleCborEncoding(oracleContract.cborHex),
    type: "PlutusV3"
}

const beadMintScript: MintingPolicy = {
    script: applyDoubleCborEncoding(beadContract.cborHex),
    type: "PlutusV3"
}


export async function RedeemBet(
    seedPhrase: any,
    buyerAddress: Address,
    game: number,
    gameName: string,
    gameDate: number,
    goals: string,
    lucid: LucidEvolution,
) {
    lucid.selectWallet.fromSeed(seedPhrase);

    const betMintingScript: MintingPolicy = {
        type: "PlutusV3",
        script: applyParamsToScript(
            betMintingContract.cborHex,
            [BigInt(game), fromText(gameName), BigInt(gameDate)] // Parameters
        ),
    };

    const potScript: SpendingValidator = {
        type: "PlutusV3",
        script: applyParamsToScript(
            betPotContract.cborHex,
            [BigInt(game), fromText(gameName), BigInt(gameDate)] // Parameters
        ),
    };

    const betPolicyId: PolicyId = mintingPolicyToId(betMintingScript);


    const oraclePolicyId: PolicyId = mintingPolicyToId(oracleMintScript);
    const betPotAddress = validatorToAddress(lucid.config().network, potScript);
    console.log("betPotAddress", betPotAddress);
    const unitOracle: Unit = oraclePolicyId + fromText(goals);
    console.log("unitOracle", unitOracle);
    const oracleUtxo = await lucid.utxosAtWithUnit(betPotAddress, unitOracle);
    const potUtxosToSpend = await lucid.utxosAt(betPotAddress);
    // console.log("oracleUtxo", oracleUtxo);
    if (oracleUtxo.length === 0) {
        throw new Error("no oracle in pot address");
    }
    if (!oracleUtxo[0].datum) {
        throw new Error("Datum is undefined");
    }
    var oracleResultDatum: t.OracleDatum = Data.from(oracleUtxo[0].datum, t.OracleDatum);
    // console.log("oracleResultDatum", oracleResultDatum);
    const betTokenName: string = oracleResultDatum.winner + gameName;
    // console.log("betTokenName", betTokenName);
    const unitBet: Unit = betPolicyId + fromText(betTokenName);

    const filtered = potUtxosToSpend.filter(o => o.txHash != oracleUtxo[0].txHash);


    const utxo = (await lucid.wallet().getUtxos()).filter((utxo: UTxO) => utxo.assets[unitBet] !== undefined);
    // console.log("utxo", utxo);
    if (utxo.length === 0) {
        throw new Error("no winning bets in address");
    }

    const totalBet = utxo.reduce((sum, utxo) => sum + Number(utxo.assets[unitBet]), 0);

    const betToBurn: Assets = {
        [unitBet]: BigInt(-1 * totalBet)
    }
    console.log("betToBurn", betToBurn);
    const gRedeemer1: t.BetMintingRedeemer =
    {
        result: BigInt(oracleResultDatum.winner),
        action: 1n

    };
    const gActionRedeemer1: t.BetSpendRedeener =
    {
        action: 0n
    }

    const toPay = u.valueWon(Number(oracleResultDatum.totalWinnings), Number(oracleResultDatum.totalAda), Number(totalBet));
    console.log("toPay", toPay);

    const targetAmount = toPay; // 5,000,000 lovelaces
    let selectedUtxos: UTxO[] = [];
    let accumulatedAmount = 0;

    for (const utxo of filtered) {
        const lovelaceAmount = Number(utxo.assets.lovelace);
        selectedUtxos.push(utxo);
        accumulatedAmount += lovelaceAmount;

        if (accumulatedAmount >= targetAmount) {
            break;
        }
    }

    if (accumulatedAmount < targetAmount) {
        throw new Error("Not enough lovelaces in the selected UTXOs");
    }
    console.log("selectedUtxos", selectedUtxos);
    const inInput = selectedUtxos.reduce((sum, utxo) => sum + Number(utxo.assets.lovelace), 0);
    console.log("inInput", inInput);


    console.log("inInput", inInput, inInput - toPay);
    const txBurnRedeemer: Redeemer = Data.to<t.BetMintingRedeemer>(gRedeemer1, t.BetMintingRedeemer);
    const txActionRedeemer: Redeemer = Data.to<t.BetSpendRedeener>(gActionRedeemer1, t.BetSpendRedeener);
    const tx = lucid
        .newTx()
        .readFrom(oracleUtxo)
        .mintAssets(betToBurn, txBurnRedeemer)
        .attach.MintingPolicy(betMintingScript)
        .collectFrom(selectedUtxos, txActionRedeemer)
        .pay.ToAddress(buyerAddress, { lovelace: BigInt(toPay) })

        .validFrom(gameDate)
        .addSigner(buyerAddress)
    if (inInput - toPay > 0) {
        tx.pay.ToAddress(betPotAddress, { lovelace: BigInt(inInput - toPay) })
    }


    const signedTx = await (await tx.complete()).sign.withWallet().complete();
    console.log("signed");
    const txHash = await signedTx.submit();
    console.log("redeeming tid: " + txHash);
}